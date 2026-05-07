package suites

import (
	"context"
	"fmt"
	"os"
	"strings"
	"time"

	fluxhelmv2 "github.com/fluxcd/helm-controller/api/v2"
	apimeta "github.com/fluxcd/pkg/apis/meta"
	. "github.com/onsi/ginkgo/v2"
	. "github.com/onsi/gomega"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	"k8s.io/apimachinery/pkg/apis/meta/v1/unstructured"
	ctrlClient "sigs.k8s.io/controller-runtime/pkg/client"

	"github.com/nutanix-cloud-native/nkp-partner-catalog/apptests/catalog"
)

const (
	hubTokenSecretName = "traefik-hub-token" //nolint:gosec // not a credential, just a resource name
	hubTokenEnvVar     = "TRAEFIK_HUB_TOKEN" //nolint:gosec // not a credential, just an env var name
)

func createHubTokenSecret(name, namespace string) *unstructured.Unstructured {
	return &unstructured.Unstructured{
		Object: map[string]interface{}{
			"apiVersion": "v1",
			"kind":       "Secret",
			"metadata": map[string]interface{}{
				"name":      name,
				"namespace": namespace,
			},
			"type": "Opaque",
			"stringData": map[string]interface{}{
				"token": os.Getenv(hubTokenEnvVar),
			},
		},
	}
}

// setTraefikHubValues patches the defaults ConfigMap so that hub.token points
// to a real Kubernetes secret name instead of the placeholder "XXX".
func setTraefikHubValues(ctx context.Context, releaseName, version, namespace string) error {
	cm := &unstructured.Unstructured{
		Object: map[string]interface{}{
			"apiVersion": "v1",
			"kind":       "ConfigMap",
		},
	}
	cmName := releaseName + "-" + version + "-config-defaults"
	if err := k8sClient.Get(ctx, ctrlClient.ObjectKey{Name: cmName, Namespace: namespace}, cm); err != nil {
		return err
	}
	valuesYAML, _, _ := unstructured.NestedString(cm.Object, "data", "values.yaml")
	valuesYAML = strings.Replace(valuesYAML, "token: \"XXX\"", "token: \""+hubTokenSecretName+"\"", 1)
	valuesYAML = strings.Replace(valuesYAML, "token: \"XXXX\"", "token: \""+hubTokenSecretName+"\"", 1)
	if err := unstructured.SetNestedField(cm.Object, valuesYAML, "data", "values.yaml"); err != nil {
		return err
	}
	return k8sClient.Update(ctx, cm)
}

var _ = Describe("traefik-hub Tests", Label("traefik-hub"), func() {
	Describe("Installing traefik-hub", Ordered, Label("install"), func() {
		var (
			t  *catalog.App
			hr *fluxhelmv2.HelmRelease
		)

		BeforeAll(func() {
			if os.Getenv(hubTokenEnvVar) == "" {
				Skip(fmt.Sprintf("skipping traefik-hub test: %s env var not set", hubTokenEnvVar))
			}

			err := SetupKindCluster()
			Expect(err).ToNot(HaveOccurred())

			err = env.InstallLatestFlux(ctx)
			Expect(err).ToNot(HaveOccurred())
		})

		AfterAll(func() {
			if useExistingCluster || os.Getenv("SKIP_CLUSTER_TEARDOWN") != "" {
				return
			}

			err := env.Destroy(ctx)
			Expect(err).ToNot(HaveOccurred())
		})

		It("should install successfully with default config", func() {
			secret := createHubTokenSecret(hubTokenSecretName, catalog.DefaultNamespace)
			err := k8sClient.Create(ctx, secret)
			Expect(err).ToNot(HaveOccurred())

			t = catalog.NewAppScenario("traefik-hub", *appVersion).(*catalog.App)
			GinkgoWriter.Printf("Installing %s @ %s\n", t.Name(), *appVersion)
			err = t.Install(ctx, env)
			Expect(err).ToNot(HaveOccurred())

			err = setTraefikHubValues(ctx, t.Name(), *appVersion, catalog.DefaultNamespace)
			Expect(err).ToNot(HaveOccurred())
			GinkgoWriter.Printf("Install applied, waiting for HelmRelease to become Ready\n")

			hr = &fluxhelmv2.HelmRelease{
				TypeMeta: metav1.TypeMeta{
					Kind:       fluxhelmv2.HelmReleaseKind,
					APIVersion: fluxhelmv2.GroupVersion.Version,
				},
				ObjectMeta: metav1.ObjectMeta{
					Name:      t.Name(),
					Namespace: catalog.DefaultNamespace,
				},
			}

			Eventually(func() error {
				err = k8sClient.Get(ctx, ctrlClient.ObjectKeyFromObject(hr), hr)
				if err != nil {
					GinkgoWriter.Printf("HelmRelease Get error: %v\n", err)
					return err
				}

				GinkgoWriter.Printf("HelmRelease %s/%s conditions: %v\n",
					hr.Namespace, hr.Name, hr.Status.Conditions)

				for _, cond := range hr.Status.Conditions {
					if cond.Status == metav1.ConditionTrue &&
						cond.Type == apimeta.ReadyCondition {
						GinkgoWriter.Printf("HelmRelease is Ready!\n")
						return nil
					}
				}
				return fmt.Errorf("helm release not ready yet")
			}).WithPolling(catalog.PollInterval).WithTimeout(10 * time.Minute).Should(Succeed())
		})
	})

	Describe("Upgrading traefik-hub", Ordered, Label("upgrade"), func() {
		var (
			t  *catalog.App
			hr *fluxhelmv2.HelmRelease
		)

		BeforeAll(func() {
			if os.Getenv(hubTokenEnvVar) == "" {
				Skip(fmt.Sprintf("skipping traefik-hub upgrade test: %s env var not set", hubTokenEnvVar))
			}

			t = catalog.NewAppScenario("traefik-hub", *appVersion).(*catalog.App)
			if !t.HasPreviousVersion() {
				Skip("skipping upgrade test: no previous version available")
			}

			err := SetupKindCluster()
			Expect(err).ToNot(HaveOccurred())

			err = env.InstallLatestFlux(ctx)
			Expect(err).ToNot(HaveOccurred())
		})

		AfterAll(func() {
			if useExistingCluster || os.Getenv("SKIP_CLUSTER_TEARDOWN") != "" {
				return
			}

			err := env.Destroy(ctx)
			Expect(err).ToNot(HaveOccurred())
		})

		It("should install the previous version successfully", func() {
			secret := createHubTokenSecret(hubTokenSecretName, catalog.DefaultNamespace)
			err := k8sClient.Create(ctx, secret)
			Expect(err).ToNot(HaveOccurred())

			err = t.InstallPreviousVersion(ctx, env)
			Expect(err).ToNot(HaveOccurred())

			err = setTraefikHubValues(ctx, t.Name(), *appVersion, catalog.DefaultNamespace)
			Expect(err).ToNot(HaveOccurred())

			hr = &fluxhelmv2.HelmRelease{
				ObjectMeta: metav1.ObjectMeta{
					Name:      t.Name(),
					Namespace: catalog.DefaultNamespace,
				},
			}

			Eventually(func() error {
				err = k8sClient.Get(ctx, ctrlClient.ObjectKeyFromObject(hr), hr)
				if err != nil {
					return err
				}

				for _, cond := range hr.Status.Conditions {
					if cond.Status == metav1.ConditionTrue &&
						cond.Type == apimeta.ReadyCondition {
						return nil
					}
				}
				return fmt.Errorf("helm release not ready yet")
			}).WithPolling(catalog.PollInterval).WithTimeout(10 * time.Minute).Should(Succeed())
		})

		It("should upgrade traefik-hub successfully", func() {
			err := t.Upgrade(ctx, env)
			Expect(err).ToNot(HaveOccurred())

			hr = &fluxhelmv2.HelmRelease{
				ObjectMeta: metav1.ObjectMeta{
					Name:      t.Name(),
					Namespace: catalog.DefaultNamespace,
				},
			}

			Eventually(func() error {
				err = k8sClient.Get(ctx, ctrlClient.ObjectKeyFromObject(hr), hr)
				if err != nil {
					return err
				}

				for _, cond := range hr.Status.Conditions {
					if cond.Status == metav1.ConditionTrue &&
						cond.Type == apimeta.ReadyCondition &&
						cond.Reason == fluxhelmv2.UpgradeSucceededReason {
						return nil
					}
				}
				return fmt.Errorf("helm release not ready yet")
			}).WithPolling(catalog.PollInterval).WithTimeout(10 * time.Minute).Should(Succeed())
		})
	})
})
