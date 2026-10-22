package suites

import (
	"context"
	"errors"
	"fmt"
	"io"
	"net/http"
	"os"
	"time"

	fluxhelmv2 "github.com/fluxcd/helm-controller/api/v2"
	apimeta "github.com/fluxcd/pkg/apis/meta"
	. "github.com/onsi/ginkgo/v2"
	. "github.com/onsi/gomega"
	apierrors "k8s.io/apimachinery/pkg/api/errors"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	"k8s.io/apimachinery/pkg/apis/meta/v1/unstructured"
	utilyaml "k8s.io/apimachinery/pkg/util/yaml"
	ctrlClient "sigs.k8s.io/controller-runtime/pkg/client"

	"github.com/nutanix-cloud-native/nkp-partner-catalog/apptests/catalog"
)

const (
	ngfAppName = "nginx-gateway-fabric"

	// NKP provides the Gateway API CRDs through its gateway-api-crds platform application.
	// The kind test cluster doesn't have them, so install the standard channel of the
	// version NKP ships before deploying the application.
	ngfGatewayAPICRDsURL = "https://github.com/kubernetes-sigs/gateway-api/releases/download/v1.3.0/standard-install.yaml"
)

// installGatewayAPICRDs applies the Gateway API CRDs that NKP provides at runtime.
// Objects that already exist (for example, when running against an NKP cluster) are left as they are.
func installGatewayAPICRDs(ctx context.Context) error {
	req, err := http.NewRequestWithContext(ctx, http.MethodGet, ngfGatewayAPICRDsURL, nil)
	if err != nil {
		return err
	}

	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		return fmt.Errorf("downloading Gateway API CRDs: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return fmt.Errorf("downloading Gateway API CRDs: unexpected status %s", resp.Status)
	}

	decoder := utilyaml.NewYAMLOrJSONDecoder(resp.Body, 4096)
	for {
		obj := &unstructured.Unstructured{}
		if err := decoder.Decode(&obj.Object); err != nil {
			if errors.Is(err, io.EOF) {
				return nil
			}
			return fmt.Errorf("decoding Gateway API CRDs: %w", err)
		}

		if len(obj.Object) == 0 {
			continue
		}

		if err := k8sClient.Create(ctx, obj); err != nil && !apierrors.IsAlreadyExists(err) {
			return fmt.Errorf("creating %s %s: %w", obj.GetKind(), obj.GetName(), err)
		}
	}
}

// waitForHelmRelease waits until the application's HelmRelease is Ready. If reason is not
// empty, the Ready condition must also have that reason.
func waitForHelmRelease(ctx context.Context, name, reason string) {
	hr := &fluxhelmv2.HelmRelease{
		ObjectMeta: metav1.ObjectMeta{
			Name:      name,
			Namespace: catalog.DefaultNamespace,
		},
	}

	Eventually(func() error {
		if err := k8sClient.Get(ctx, ctrlClient.ObjectKeyFromObject(hr), hr); err != nil {
			GinkgoWriter.Printf("HelmRelease Get error: %v\n", err)
			return err
		}

		GinkgoWriter.Printf("HelmRelease %s/%s conditions: %v\n", hr.Namespace, hr.Name, hr.Status.Conditions)

		for _, cond := range hr.Status.Conditions {
			if cond.Type == apimeta.ReadyCondition &&
				cond.Status == metav1.ConditionTrue &&
				(reason == "" || cond.Reason == reason) {
				return nil
			}
		}

		return errors.New("helm release not ready yet")
	}).WithPolling(catalog.PollInterval).WithTimeout(10 * time.Minute).Should(Succeed())
}

// waitForGatewayClassAccepted waits until NGINX Gateway Fabric accepts the GatewayClass it
// creates. The application names the GatewayClass after the release.
func waitForGatewayClassAccepted(ctx context.Context, name string) {
	gc := &unstructured.Unstructured{}
	gc.SetAPIVersion("gateway.networking.k8s.io/v1")
	gc.SetKind("GatewayClass")

	Eventually(func() error {
		if err := k8sClient.Get(ctx, ctrlClient.ObjectKey{Name: name}, gc); err != nil {
			return err
		}

		conditions, _, err := unstructured.NestedSlice(gc.Object, "status", "conditions")
		if err != nil {
			return err
		}

		for _, c := range conditions {
			cond, ok := c.(map[string]interface{})
			if ok && cond["type"] == "Accepted" && cond["status"] == "True" {
				return nil
			}
		}

		return fmt.Errorf("GatewayClass %s not accepted yet", name)
	}).WithPolling(catalog.PollInterval).WithTimeout(5 * time.Minute).Should(Succeed())
}

var _ = Describe("nginx-gateway-fabric Tests", Label(ngfAppName), func() {
	Describe("Installing nginx-gateway-fabric", Ordered, Label("install"), func() {
		var n *catalog.App

		BeforeAll(func() {
			err := SetupKindCluster()
			Expect(err).ToNot(HaveOccurred())

			err = env.InstallLatestFlux(ctx)
			Expect(err).ToNot(HaveOccurred())

			err = installGatewayAPICRDs(ctx)
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
			n = catalog.NewAppScenario(ngfAppName, *appVersion).(*catalog.App)
			GinkgoWriter.Printf("Installing %s @ %s\n", n.Name(), *appVersion)

			err := n.Install(ctx, env)
			Expect(err).ToNot(HaveOccurred())

			waitForHelmRelease(ctx, n.Name(), "")
		})

		It("should accept its GatewayClass", func() {
			waitForGatewayClassAccepted(ctx, n.Name())
		})
	})

	Describe("Upgrading nginx-gateway-fabric", Ordered, Label("upgrade"), func() {
		var n *catalog.App

		BeforeAll(func() {
			n = catalog.NewAppScenario(ngfAppName, *appVersion).(*catalog.App)
			if !n.HasPreviousVersion() {
				Skip("skipping upgrade test: no previous version available")
			}

			err := SetupKindCluster()
			Expect(err).ToNot(HaveOccurred())

			err = env.InstallLatestFlux(ctx)
			Expect(err).ToNot(HaveOccurred())

			err = installGatewayAPICRDs(ctx)
			Expect(err).ToNot(HaveOccurred())
		})

		AfterAll(func() {
			if n == nil || !n.HasPreviousVersion() || useExistingCluster || os.Getenv("SKIP_CLUSTER_TEARDOWN") != "" {
				return
			}

			err := env.Destroy(ctx)
			Expect(err).ToNot(HaveOccurred())
		})

		It("should install the previous version successfully", func() {
			err := n.InstallPreviousVersion(ctx, env)
			Expect(err).ToNot(HaveOccurred())

			waitForHelmRelease(ctx, n.Name(), "")
		})

		It("should upgrade nginx-gateway-fabric successfully", func() {
			err := n.Upgrade(ctx, env)
			Expect(err).ToNot(HaveOccurred())

			waitForHelmRelease(ctx, n.Name(), fluxhelmv2.UpgradeSucceededReason)
			waitForGatewayClassAccepted(ctx, n.Name())
		})
	})
})
