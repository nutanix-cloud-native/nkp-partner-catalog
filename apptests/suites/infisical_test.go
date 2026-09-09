package suites

import (
	"fmt"
	"os"
	"strings"
	"time"

	fluxhelmv2 "github.com/fluxcd/helm-controller/api/v2"
	kustomizev1 "github.com/fluxcd/kustomize-controller/api/v1"
	fluxkustomize "github.com/fluxcd/pkg/apis/kustomize"
	apimeta "github.com/fluxcd/pkg/apis/meta"
	sourcev1 "github.com/fluxcd/source-controller/api/v1"
	. "github.com/onsi/ginkgo/v2"
	. "github.com/onsi/gomega"
	apierrors "k8s.io/apimachinery/pkg/api/errors"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	ctrlClient "sigs.k8s.io/controller-runtime/pkg/client"

	"github.com/nutanix-cloud-native/nkp-partner-catalog/apptests/catalog"
)

var _ = Describe("infisical Tests", Label("infisical"), func() {
	Describe("Installing infisical", Ordered, Label("install"), func() {
		var (
			c  *catalog.App
			hr *fluxhelmv2.HelmRelease
		)

		BeforeAll(func() {
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
			// TODO: Replace this with a proper dependency management mechanism in the future.
			By("installing cloudnative-pg")
			Expect(installingPrerequisites()).To(Succeed())

			c = catalog.NewAppScenario("infisical", *appVersion).(*catalog.App)
			GinkgoWriter.Printf("Installing %s @ %s\n", c.Name(), *appVersion)
			err := c.Install(ctx, env)
			Expect(err).ToNot(HaveOccurred())
			GinkgoWriter.Printf("Install applied, waiting for HelmRelease to become Ready\n")

			hr = &fluxhelmv2.HelmRelease{
				TypeMeta: metav1.TypeMeta{
					Kind:       fluxhelmv2.HelmReleaseKind,
					APIVersion: fluxhelmv2.GroupVersion.Version,
				},
				ObjectMeta: metav1.ObjectMeta{
					Name:      c.Name(),
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
			}).WithPolling(catalog.PollInterval).WithTimeout(5 * time.Minute).Should(Succeed())
		})
	})
})

func buildFluxOCIDependencyObjects(
	registryOrgURL, appName, version, namespace string,
) (*sourcev1.OCIRepository, *kustomizev1.Kustomization) {
	registryOrgURL = strings.TrimSuffix(registryOrgURL, "/")
	ociRepository := &sourcev1.OCIRepository{
		TypeMeta: metav1.TypeMeta{
			APIVersion: sourcev1.GroupVersion.String(),
			Kind:       sourcev1.OCIRepositoryKind,
		},
		ObjectMeta: metav1.ObjectMeta{
			Name:      fmt.Sprintf("%s-source", appName),
			Namespace: namespace,
		},
		Spec: sourcev1.OCIRepositorySpec{
			Interval: metav1.Duration{Duration: time.Minute},
			URL:      fmt.Sprintf("oci://%s/%s", registryOrgURL, appName),
			Reference: &sourcev1.OCIRepositoryRef{
				Tag: version,
			},
		},
	}

	kustomization := &kustomizev1.Kustomization{
		TypeMeta: metav1.TypeMeta{
			APIVersion: kustomizev1.GroupVersion.String(),
			Kind:       kustomizev1.KustomizationKind,
		},
		ObjectMeta: metav1.ObjectMeta{
			Name:      appName,
			Namespace: namespace,
		},
		Spec: kustomizev1.KustomizationSpec{
			Interval: metav1.Duration{Duration: time.Minute},
			Path:     "./",
			Prune:    true,
			Wait:     true,
			Timeout:  &metav1.Duration{Duration: 5 * time.Minute},
			SourceRef: kustomizev1.CrossNamespaceSourceReference{
				Kind: sourcev1.OCIRepositoryKind,
				Name: ociRepository.Name,
			},
			PostBuild: &kustomizev1.PostBuild{
				Substitute: map[string]string{
					"releaseName":      appName,
					"releaseNamespace": namespace,
					"appName":          appName,
					"appVersion":       version,
				},
			},
		},
	}
	return ociRepository, kustomization
}

func installingPrerequisites() error {
	GinkgoHelper()
	cnpgOCIRepo, cnpgKustomization := buildFluxOCIDependencyObjects(
		"ghcr.io/mesosphere/kommander-applications",
		"cloudnative-pg",
		"0.28.0",
		catalog.DefaultNamespace,
	)
	// Empty data on all ConfigMaps rendered by this Kustomization.
	cnpgKustomization.Spec.Patches = append(cnpgKustomization.Spec.Patches, fluxkustomize.Patch{
		Patch: `apiVersion: v1
kind: ConfigMap
metadata:
  name: not-used
data:
  values.yaml: "" # empty values.yaml to avoid nkp priorityclass
  grafana-dashboard.json: "" # empty dashboard to avoid strict substitution failure
binaryData: {}
`,
		Target: &fluxkustomize.Selector{
			Kind: "ConfigMap",
		},
	})

	err := k8sClient.Create(ctx, cnpgOCIRepo)
	if err != nil && !apierrors.IsAlreadyExists(err) {
		return err
	}

	err = k8sClient.Create(ctx, cnpgKustomization)
	if err != nil && !apierrors.IsAlreadyExists(err) {
		return err
	}

	var readyErr error
	Eventually(func() error {
		readyErr = k8sClient.Get(ctx, ctrlClient.ObjectKeyFromObject(cnpgKustomization), cnpgKustomization)
		if readyErr != nil {
			GinkgoWriter.Printf("Kustomization Get error: %v\n", readyErr)
			return readyErr
		}

		GinkgoWriter.Printf("Kustomization %s/%s conditions: %v\n",
			cnpgKustomization.Namespace, cnpgKustomization.Name, cnpgKustomization.Status.Conditions)

		for _, cond := range cnpgKustomization.Status.Conditions {
			if cond.Status == metav1.ConditionTrue &&
				cond.Type == apimeta.ReadyCondition {
				GinkgoWriter.Printf("cloudnative-pg Kustomization is Ready!\n")
				return nil
			}
		}

		return fmt.Errorf("cloudnative-pg kustomization not ready yet")
	}).WithPolling(catalog.PollInterval).WithTimeout(10 * time.Minute).Should(Succeed())

	return nil
}
