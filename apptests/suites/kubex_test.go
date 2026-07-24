package suites

import (
	"context"
	"fmt"
	"os"
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

// kubex-automation-stack ships a container-optimization-data-forwarder Job as a
// Helm post-install/post-upgrade hook. That Job authenticates to Densify SaaS and
// forwards collected metrics; Helm blocks on it, so the HelmRelease only reaches
// Ready if the forward succeeds. The catalog ships placeholder Densify creds, so
// without a real (test) Densify account the Job cannot succeed on a CI cluster.
//
// Rather than disabling the forwarder (which would make "green" mean nothing more
// than "the chart templated"), this test is gated on real credentials, exactly
// like traefik-hub gates on TRAEFIK_HUB_TOKEN: when the DENSIFY_* env vars are set
// we inject them and assert the real forwarder reaches Ready (a true end-to-end
// test); when they are absent we skip.
const (
	densifyUsernameEnvVar  = "DENSIFY_USERNAME"  //nolint:gosec // env var name, not a credential
	densifyEPasswordEnvVar = "DENSIFY_EPASSWORD" //nolint:gosec // env var name, not a credential
	densifyHostEnvVar      = "DENSIFY_HOST"      //nolint:gosec // env var name, not a credential
)

// densifyCredsPresent reports whether all Densify credentials required to run the
// functional forwarder test are available in the environment.
func densifyCredsPresent() bool {
	return os.Getenv(densifyUsernameEnvVar) != "" &&
		os.Getenv(densifyEPasswordEnvVar) != "" &&
		os.Getenv(densifyHostEnvVar) != ""
}

// setDensifyCredentials patches the defaults ConfigMap, replacing the shipped
// placeholder Densify credentials with the real ones from the environment so the
// forwarder Job can authenticate and forward. Applying the kustomization rewrites
// this ConfigMap back to the shipped placeholders, so this must be re-run after
// every install/upgrade.
func setDensifyCredentials(ctx context.Context, releaseName, namespace string) error {
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

	stack := ensureMap(values, "stack")
	densify := ensureMap(stack, "densify")
	densify["username"] = os.Getenv(densifyUsernameEnvVar)
	densify["encrypted_password"] = os.Getenv(densifyEPasswordEnvVar)

	forwarder := ensureMap(values, "container-optimization-data-forwarder")
	config := ensureMap(forwarder, "config")
	fwd := ensureMap(config, "forwarder")
	fwdDensify := ensureMap(fwd, "densify")
	url := ensureMap(fwdDensify, "url")
	url["host"] = os.Getenv(densifyHostEnvVar)

	out, err := yaml.Marshal(values)
	if err != nil {
		return err
	}
	if err := unstructured.SetNestedField(cm.Object, string(out), "data", "values.yaml"); err != nil {
		return err
	}
	return catalog.K8sClient.Update(ctx, cm)
}

// ensureMap returns m[key] as a map, creating it if absent or of the wrong type.
func ensureMap(m map[string]interface{}, key string) map[string]interface{} {
	child, ok := m[key].(map[string]interface{})
	if !ok || child == nil {
		child = map[string]interface{}{}
		m[key] = child
	}
	return child
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

// kubexReady polls the HelmRelease until it reports Ready. When requireUpgrade is
// true it additionally requires the Ready condition reason to be UpgradeSucceeded.
func kubexReady(hr *fluxhelmv2.HelmRelease, requireUpgrade bool) error {
	if err := catalog.K8sClient.Get(catalog.Ctx, ctrlClient.ObjectKeyFromObject(hr), hr); err != nil {
		return err
	}
	for _, cond := range hr.Status.Conditions {
		if cond.Status == metav1.ConditionTrue && cond.Type == apimeta.ReadyCondition {
			if requireUpgrade && cond.Reason != fluxhelmv2.UpgradeSucceededReason {
				continue
			}
			return nil
		}
	}
	return fmt.Errorf("helm release not ready yet")
}

var _ = Describe("kubex-automation-stack Tests", Label("kubex-automation-stack"), func() {
	Describe("Installing kubex-automation-stack", Ordered, Label("install"), func() {
		var (
			k  *catalog.App
			hr *fluxhelmv2.HelmRelease
		)

		BeforeAll(func() {
			if !densifyCredsPresent() {
				Skip(fmt.Sprintf("skipping kubex-automation-stack test: %s/%s/%s env vars not set",
					densifyUsernameEnvVar, densifyEPasswordEnvVar, densifyHostEnvVar))
			}

			Expect(catalog.SetupKindCluster()).To(Succeed())
			Expect(catalog.Env.InstallLatestFlux(catalog.Ctx)).To(Succeed())
			Expect(catalog.WaitForFluxCRDs()).To(Succeed())
		})

		AfterAll(func() {
			Expect(catalog.TeardownCluster()).To(Succeed())
		})

		It("should install successfully and forward to Densify", func() {
			k = catalog.NewAppScenario("kubex-automation-stack", *catalog.AppVersion).(*catalog.App)
			GinkgoWriter.Printf("Installing %s @ %s\n", k.Name(), *catalog.AppVersion)
			Expect(k.Install(catalog.Ctx, catalog.Env)).To(Succeed())

			Expect(setDensifyCredentials(catalog.Ctx, k.Name(), catalog.DefaultNamespace)).To(Succeed())

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
			if !densifyCredsPresent() {
				Skip(fmt.Sprintf("skipping kubex-automation-stack upgrade test: %s/%s/%s env vars not set",
					densifyUsernameEnvVar, densifyEPasswordEnvVar, densifyHostEnvVar))
			}

			k = catalog.NewAppScenario("kubex-automation-stack", *catalog.AppVersion).(*catalog.App)
			if !k.HasPreviousVersion() {
				Skip("skipping upgrade test: no previous version available")
			}

			Expect(catalog.SetupKindCluster()).To(Succeed())
			Expect(catalog.Env.InstallLatestFlux(catalog.Ctx)).To(Succeed())
			Expect(catalog.WaitForFluxCRDs()).To(Succeed())
		})

		AfterAll(func() {
			Expect(catalog.TeardownCluster()).To(Succeed())
		})

		It("should install the previous version successfully", func() {
			Expect(k.InstallPreviousVersion(catalog.Ctx, catalog.Env)).To(Succeed())

			Expect(setDensifyCredentials(catalog.Ctx, k.Name(), catalog.DefaultNamespace)).To(Succeed())

			hr = newKubexHelmRelease()
			Eventually(func() error {
				return kubexReady(hr, false)
			}).WithPolling(catalog.PollInterval).WithTimeout(10 * time.Minute).Should(Succeed())
		})

		It("should upgrade kubex-automation-stack successfully", func() {
			Expect(k.Upgrade(catalog.Ctx, catalog.Env)).To(Succeed())

			// Upgrade re-applies the kustomization, which resets the ConfigMap to
			// the shipped placeholder creds, so re-inject the real ones.
			Expect(setDensifyCredentials(catalog.Ctx, k.Name(), catalog.DefaultNamespace)).To(Succeed())

			hr = newKubexHelmRelease()
			Eventually(func() error {
				return kubexReady(hr, true)
			}).WithPolling(catalog.PollInterval).WithTimeout(10 * time.Minute).Should(Succeed())
		})
	})
})
