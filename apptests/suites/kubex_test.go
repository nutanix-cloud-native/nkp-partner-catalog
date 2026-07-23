package suites

import (
	"context"
	"fmt"
	"time"

	fluxhelmv2 "github.com/fluxcd/helm-controller/api/v2"
	apimeta "github.com/fluxcd/pkg/apis/meta"
	"github.com/mesosphere/kommander-applications/apptests/catalog"
	. "github.com/onsi/ginkgo/v2"
	. "github.com/onsi/gomega"
	"gopkg.in/yaml.v3"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	"k8s.io/apimachinery/pkg/apis/meta/v1/unstructured"
	ctrlClient "sigs.k8s.io/controller-runtime/pkg/client"
)

// disableKubexForwarderJob patches the defaults ConfigMap to turn off the
// container-optimization-data-forwarder post-install Job. That Job requires
// live Densify SaaS credentials (the shipped defaults are placeholders), so it
// always fails on a CI cluster and blocks the HelmRelease from ever becoming
// Ready. Disabling it lets us assert the operator and collectors install and
// reconcile to Ready -- the meaningful signal we can verify without external
// credentials. Applying the kustomization rewrites this ConfigMap back to the
// shipped defaults, so this must be re-run after every install/upgrade.
func disableKubexForwarderJob(ctx context.Context, releaseName, namespace string) error {
	cm := &unstructured.Unstructured{
		Object: map[string]interface{}{
			"apiVersion": "v1",
			"kind":       "ConfigMap",
		},
	}
	cmName := releaseName + "-config-defaults"
	if err := catalog.K8sClient.Get(ctx, ctrlClient.ObjectKey{Name: cmName, Namespace: namespace}, cm); err != nil {
		return err
	}

	valuesYAML, _, _ := unstructured.NestedString(cm.Object, "data", "values.yaml")
	values := map[string]interface{}{}
	if err := yaml.Unmarshal([]byte(valuesYAML), &values); err != nil {
		return err
	}

	forwarder, ok := values["container-optimization-data-forwarder"].(map[string]interface{})
	if !ok || forwarder == nil {
		forwarder = map[string]interface{}{}
		values["container-optimization-data-forwarder"] = forwarder
	}
	job, ok := forwarder["job"].(map[string]interface{})
	if !ok || job == nil {
		job = map[string]interface{}{}
		forwarder["job"] = job
	}
	job["enable"] = false

	out, err := yaml.Marshal(values)
	if err != nil {
		return err
	}
	if err := unstructured.SetNestedField(cm.Object, string(out), "data", "values.yaml"); err != nil {
		return err
	}
	return catalog.K8sClient.Update(ctx, cm)
}

func kubexReady(hr *fluxhelmv2.HelmRelease, requireUpgrade bool) error {
	if err := catalog.K8sClient.Get(catalog.Ctx, ctrlClient.ObjectKeyFromObject(hr), hr); err != nil {
		return err
	}
	GinkgoWriter.Printf("HelmRelease %s/%s conditions: %v\n", hr.Namespace, hr.Name, hr.Status.Conditions)
	for _, cond := range hr.Status.Conditions {
		if cond.Status == metav1.ConditionTrue &&
			cond.Type == apimeta.ReadyCondition &&
			(!requireUpgrade || cond.Reason == fluxhelmv2.UpgradeSucceededReason) {
			return nil
		}
	}
	return fmt.Errorf("helm release not ready yet")
}

func newKubexHelmRelease() *fluxhelmv2.HelmRelease {
	return &fluxhelmv2.HelmRelease{
		TypeMeta: metav1.TypeMeta{
			Kind:       fluxhelmv2.HelmReleaseKind,
			APIVersion: fluxhelmv2.GroupVersion.Version,
		},
		ObjectMeta: metav1.ObjectMeta{
			Name:      "kubex-automation-stack",
			Namespace: catalog.DefaultNamespace,
		},
	}
}

var _ = Describe("kubex-automation-stack Tests", Label("kubex-automation-stack"), func() {
	Describe("Installing kubex-automation-stack", Ordered, Label("install"), func() {
		var (
			k  *catalog.App
			hr *fluxhelmv2.HelmRelease
		)

		BeforeAll(func() {
			err := catalog.SetupKindCluster()
			Expect(err).ToNot(HaveOccurred())

			err = catalog.Env.InstallLatestFlux(catalog.Ctx)
			Expect(err).ToNot(HaveOccurred())

			Expect(catalog.WaitForFluxCRDs()).To(Succeed())
		})

		AfterAll(func() {
			Expect(catalog.TeardownCluster()).To(Succeed())
		})

		It("should install successfully with default config", func() {
			k = catalog.NewAppScenario("kubex-automation-stack", *catalog.AppVersion).(*catalog.App)
			GinkgoWriter.Printf("Installing %s @ %s\n", k.Name(), *catalog.AppVersion)
			err := k.Install(catalog.Ctx, catalog.Env)
			Expect(err).ToNot(HaveOccurred())

			Expect(disableKubexForwarderJob(catalog.Ctx, k.Name(), catalog.DefaultNamespace)).To(Succeed())
			GinkgoWriter.Printf("Install applied, waiting for HelmRelease to become Ready\n")

			hr = newKubexHelmRelease()
			Eventually(func() error {
				return kubexReady(hr, false)
			}).WithPolling(catalog.PollInterval).WithTimeout(10 * time.Minute).Should(Succeed())
		})
	})

	Describe("Upgrading kubex-automation-stack", Ordered, Label("upgrade"), func() {
		var (
			k  *catalog.App
			hr *fluxhelmv2.HelmRelease
		)

		BeforeAll(func() {
			k = catalog.NewAppScenario("kubex-automation-stack", *catalog.AppVersion).(*catalog.App)
			if !k.HasPreviousVersion() {
				Skip("skipping upgrade test: no previous version available")
			}

			err := catalog.SetupKindCluster()
			Expect(err).ToNot(HaveOccurred())

			err = catalog.Env.InstallLatestFlux(catalog.Ctx)
			Expect(err).ToNot(HaveOccurred())

			Expect(catalog.WaitForFluxCRDs()).To(Succeed())
		})

		AfterAll(func() {
			Expect(catalog.TeardownCluster()).To(Succeed())
		})

		It("should install the previous version successfully", func() {
			err := k.InstallPreviousVersion(catalog.Ctx, catalog.Env)
			Expect(err).ToNot(HaveOccurred())

			Expect(disableKubexForwarderJob(catalog.Ctx, k.Name(), catalog.DefaultNamespace)).To(Succeed())

			hr = newKubexHelmRelease()
			Eventually(func() error {
				return kubexReady(hr, false)
			}).WithPolling(catalog.PollInterval).WithTimeout(10 * time.Minute).Should(Succeed())
		})

		It("should upgrade kubex-automation-stack successfully", func() {
			err := k.Upgrade(catalog.Ctx, catalog.Env)
			Expect(err).ToNot(HaveOccurred())

			// Upgrade re-applies the kustomization, which resets the ConfigMap to
			// the shipped defaults (forwarder Job re-enabled), so patch again.
			Expect(disableKubexForwarderJob(catalog.Ctx, k.Name(), catalog.DefaultNamespace)).To(Succeed())

			hr = newKubexHelmRelease()
			Eventually(func() error {
				return kubexReady(hr, true)
			}).WithPolling(catalog.PollInterval).WithTimeout(10 * time.Minute).Should(Succeed())
		})
	})
})
