package suites

import (
	"fmt"
	"os"
	"strings"
	"time"

	fluxhelmv2 "github.com/fluxcd/helm-controller/api/v2"
	apimeta "github.com/fluxcd/pkg/apis/meta"
	. "github.com/onsi/ginkgo/v2"
	. "github.com/onsi/gomega"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	ctrlClient "sigs.k8s.io/controller-runtime/pkg/client"

	"github.com/nutanix-cloud-native/nkp-partner-catalog/apptests/catalog"
)

var _ = Describe("nginx-ingress-controller Tests", Label("nginx-ingress-controller"), func() {
	Describe("Installing nginx-ingress-controller", Ordered, Label("install"), func() {
		var (
			app *catalog.App
			hr  *fluxhelmv2.HelmRelease
		)

		BeforeAll(func() {
			err := SetupKindCluster()
			Expect(err).ToNot(HaveOccurred())

			if !useExistingCluster {
				err = env.InstallLatestFlux(ctx)
				Expect(err).ToNot(HaveOccurred())
			}
		})

		AfterAll(func() {
			if useExistingCluster || os.Getenv("SKIP_CLUSTER_TEARDOWN") != "" {
				return
			}

			err := env.Destroy(ctx)
			Expect(err).ToNot(HaveOccurred())
		})

		It("should install successfully with default config", func() {
			app = catalog.NewAppScenario("nginx-ingress-controller", *appVersion).(*catalog.App)
			GinkgoWriter.Printf("Installing %s @ %s\n", app.Name(), *appVersion)
			err := app.Install(ctx, env)
			Expect(err).ToNot(HaveOccurred())
			GinkgoWriter.Printf("Install applied, waiting for HelmRelease to become Ready\n")

			hr = &fluxhelmv2.HelmRelease{
				TypeMeta: metav1.TypeMeta{
					Kind:       fluxhelmv2.HelmReleaseKind,
					APIVersion: fluxhelmv2.GroupVersion.Version,
				},
				ObjectMeta: metav1.ObjectMeta{
					Name:      app.Name(),
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
					// Check for irrecoverable TLS errors to fail immediately rather than waiting 5 minutes
					if cond.Status == metav1.ConditionFalse && (strings.Contains(cond.Message, "certificate signed by unknown authority") || strings.Contains(cond.Message, "tls: failed to verify certificate")) {
						return StopTrying(fmt.Sprintf("irrecoverable TLS error: %s", cond.Message))
					}

					if cond.Status == metav1.ConditionTrue && cond.Type == apimeta.ReadyCondition {
						GinkgoWriter.Printf("HelmRelease is Ready!\n")
						return nil
					}
				}
				return fmt.Errorf("helm release not ready yet")
			}).WithPolling(catalog.PollInterval).WithTimeout(5 * time.Minute).Should(Succeed())
		})
	})

	Describe("Upgrading nginx-ingress-controller", Ordered, Label("upgrade"), func() {
		var (
			app *catalog.App
			hr  *fluxhelmv2.HelmRelease
		)

		BeforeAll(func() {
			app = catalog.NewAppScenario("nginx-ingress-controller", *appVersion).(*catalog.App)
			if !app.HasPreviousVersion() {
				Skip("skipping upgrade test: no previous version available")
			}

			err := SetupKindCluster()
			Expect(err).ToNot(HaveOccurred())

			if !useExistingCluster {
				err = env.InstallLatestFlux(ctx)
				Expect(err).ToNot(HaveOccurred())
			}
		})

		AfterAll(func() {
			if useExistingCluster || os.Getenv("SKIP_CLUSTER_TEARDOWN") != "" {
				return
			}

			err := env.Destroy(ctx)
			Expect(err).ToNot(HaveOccurred())
		})

		It("should install the previous version successfully", func() {
			err := app.InstallPreviousVersion(ctx, env)
			Expect(err).ToNot(HaveOccurred())
			GinkgoWriter.Printf("Previous version install applied, waiting for HelmRelease to become Ready\n")

			hr = &fluxhelmv2.HelmRelease{
				TypeMeta: metav1.TypeMeta{
					Kind:       fluxhelmv2.HelmReleaseKind,
					APIVersion: fluxhelmv2.GroupVersion.Version,
				},
				ObjectMeta: metav1.ObjectMeta{
					Name:      app.Name(),
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
					// Check for irrecoverable TLS errors to fail immediately rather than waiting 5 minutes
					if cond.Status == metav1.ConditionFalse && (strings.Contains(cond.Message, "certificate signed by unknown authority") || strings.Contains(cond.Message, "tls: failed to verify certificate")) {
						return StopTrying(fmt.Sprintf("irrecoverable TLS error: %s", cond.Message))
					}

					if cond.Status == metav1.ConditionTrue && cond.Type == apimeta.ReadyCondition {
						GinkgoWriter.Printf("HelmRelease is Ready!\n")
						return nil
					}
				}
				return fmt.Errorf("helm release not ready yet")
			}).WithPolling(catalog.PollInterval).WithTimeout(5 * time.Minute).Should(Succeed())
		})

		It("should upgrade nginx-ingress-controller successfully", func() {
			err := app.Upgrade(ctx, env)
			Expect(err).ToNot(HaveOccurred())
			GinkgoWriter.Printf("Upgrade applied, waiting for HelmRelease upgrade to succeed\n")

			hr = &fluxhelmv2.HelmRelease{
				TypeMeta: metav1.TypeMeta{
					Kind:       fluxhelmv2.HelmReleaseKind,
					APIVersion: fluxhelmv2.GroupVersion.Version,
				},
				ObjectMeta: metav1.ObjectMeta{
					Name:      app.Name(),
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
					// Check for irrecoverable TLS errors to fail immediately rather than waiting 5 minutes
					if cond.Status == metav1.ConditionFalse && (strings.Contains(cond.Message, "certificate signed by unknown authority") || strings.Contains(cond.Message, "tls: failed to verify certificate")) {
						return StopTrying(fmt.Sprintf("irrecoverable TLS error: %s", cond.Message))
					}

					if cond.Status == metav1.ConditionTrue &&
						cond.Type == apimeta.ReadyCondition &&
						cond.Reason == fluxhelmv2.UpgradeSucceededReason {
						GinkgoWriter.Printf("HelmRelease upgrade succeeded!\n")
						return nil
					}
				}
				return fmt.Errorf("helm release not ready yet")
			}).WithPolling(catalog.PollInterval).WithTimeout(5 * time.Minute).Should(Succeed())
		})
	})
})
