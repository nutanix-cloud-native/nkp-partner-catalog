package suites

import (
	"fmt"
	"os"
	"time"

	fluxhelmv2beta2 "github.com/fluxcd/helm-controller/api/v2beta2"
	apimeta "github.com/fluxcd/pkg/apis/meta"
	"github.com/nutanix-cloud-native/nkp-partner-catalog/tests/appscenarios"
	"github.com/nutanix-cloud-native/nkp-partner-catalog/tests/appscenarios/constant"
	. "github.com/onsi/ginkgo/v2"
	. "github.com/onsi/gomega"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	ctrlClient "sigs.k8s.io/controller-runtime/pkg/client"
)

var _ = Describe("redis Tests", Ordered, Label("redis"), func() {

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

	Describe("Installing redis", Ordered, Label("install"), func() {

		var (
			rs *appscenarios.Redis
			hr *fluxhelmv2beta2.HelmRelease
		)

		It("should install successfully with default config", func() {
			rs = appscenarios.NewRedisScenerio().(*appscenarios.Redis)
			err := rs.Install(ctx, env, *appVersion)
			Expect(err).ToNot(HaveOccurred())

			hr = &fluxhelmv2beta2.HelmRelease{
				TypeMeta: metav1.TypeMeta{
					Kind:       fluxhelmv2beta2.HelmReleaseKind,
					APIVersion: fluxhelmv2beta2.GroupVersion.Version,
				},
				ObjectMeta: metav1.ObjectMeta{
					Name:      rs.Name(),
					Namespace: constant.KOMMANDER_NAMESPACE,
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
	})
})
