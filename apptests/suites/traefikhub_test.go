package suites

import (
	"fmt"
	"os"
	"time"

	fluxhelmv2 "github.com/fluxcd/helm-controller/api/v2"
	apimeta "github.com/fluxcd/pkg/apis/meta"
	. "github.com/onsi/ginkgo/v2"
	. "github.com/onsi/gomega"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	ctrlClient "sigs.k8s.io/controller-runtime/pkg/client"

	"github.com/nutanix-cloud-native/nkp-partner-catalog/apptests/appscenarios"
	"github.com/nutanix-cloud-native/nkp-partner-catalog/apptests/appscenarios/constant"
)

var _ = Describe("traefik-hub Tests", Ordered, Label("traefik-hub"), func() {
	BeforeEach(OncePerOrdered, func() {
		err := SetupKindCluster()
		Expect(err).ToNot(HaveOccurred())

		err = env.InstallLatestFlux(ctx)
		Expect(err).ToNot(HaveOccurred())
	})

	AfterEach(OncePerOrdered, func() {
		if os.Getenv("SKIP_CLUSTER_TEARDOWN") != "" {
			return
		}

		err := env.Destroy(ctx)
		Expect(err).ToNot(HaveOccurred())
	})

	Describe("Installing traefik-hub", Ordered, Label("install"), func() {
		var (
			t  *appscenarios.TraefikHubAPIGW
			hr *fluxhelmv2.HelmRelease
		)

		It("should install successfully with default config", func() {
			t = appscenarios.NewTraefikHubAPIGWScenario(*appVersion).(*appscenarios.TraefikHubAPIGW)
			err := t.Install(ctx, env)
			Expect(err).ToNot(HaveOccurred())

			hr = &fluxhelmv2.HelmRelease{
				TypeMeta: metav1.TypeMeta{
					Kind:       fluxhelmv2.HelmReleaseKind,
					APIVersion: fluxhelmv2.GroupVersion.Version,
				},
				ObjectMeta: metav1.ObjectMeta{
					Name:      t.Name(),
					Namespace: constant.DEFAULT_NAMESPACE,
				},
			}

			// Check the status of the HelmReleases
			Eventually(func() error {
				err = k8sClient.Get(ctx, ctrlClient.ObjectKeyFromObject(hr), hr)
				fmt.Printf("HelmRelease Status: %v %v", hr.Status, err)
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
			}).WithPolling(constant.POLL_INTERVAL).WithTimeout(5 * time.Minute).Should(Succeed())
		})
	})

	Describe("Upgrading traefik-hub", Ordered, Label("upgrade"), func() {
		var (
			t  *appscenarios.TraefikHubAPIGW
			hr *fluxhelmv2.HelmRelease
		)

		It("should install the previous version successfully", func() {
			t = appscenarios.NewTraefikHubAPIGWScenario("").(*appscenarios.TraefikHubAPIGW)
			err := t.InstallPreviousVersion(ctx, env)
			Expect(err).ToNot(HaveOccurred())

			hr = &fluxhelmv2.HelmRelease{
				ObjectMeta: metav1.ObjectMeta{
					Name:      t.Name(),
					Namespace: constant.DEFAULT_NAMESPACE,
				},
			}

			// Check the status of the HelmReleases
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
			}).WithPolling(constant.POLL_INTERVAL).WithTimeout(5 * time.Minute).Should(Succeed())
		})

		It("should upgrade traefik-hub successfully", func() {
			err := t.Upgrade(ctx, env)
			Expect(err).ToNot(HaveOccurred())

			hr = &fluxhelmv2.HelmRelease{
				ObjectMeta: metav1.ObjectMeta{
					Name:      t.Name(),
					Namespace: constant.DEFAULT_NAMESPACE,
				},
			}

			// Check the status of the HelmReleases
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
			}).WithPolling(constant.POLL_INTERVAL).WithTimeout(5 * time.Minute).Should(Succeed())
		})
	})
})
