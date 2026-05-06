package suites

import (
	"context"
	"crypto/ecdsa"
	"crypto/elliptic"
	"crypto/rand"
	"crypto/x509"
	"crypto/x509/pkix"
	"encoding/base64"
	"encoding/pem"
	"fmt"
	"math/big"
	"os"
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

// setKasmValues patches the Kasm default ConfigMap with the values required for
// the test to work. publicAddr and certificate.secretName are intentionally
// left empty in the shipped defaults for users to configure, so we set them here.
func setKasmValues(ctx context.Context, releaseName, version, namespace string) error {
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
	valuesYAML += "\npublicAddr: \"kasm.example.com\"\ncertificate:\n  secretName: \"kasm-tls-secret\"\n"
	if err := unstructured.SetNestedField(cm.Object, valuesYAML, "data", "values.yaml"); err != nil {
		return err
	}
	return k8sClient.Update(ctx, cm)
}

func createSelfSignedTLSSecret(name, namespace string) *unstructured.Unstructured {
	key, err := ecdsa.GenerateKey(elliptic.P256(), rand.Reader)
	Expect(err).ToNot(HaveOccurred())

	template := &x509.Certificate{
		SerialNumber: big.NewInt(1),
		Subject:      pkix.Name{CommonName: "kasm.example.com"},
		NotBefore:    time.Now(),
		NotAfter:     time.Now().Add(24 * time.Hour),
	}

	certDER, err := x509.CreateCertificate(rand.Reader, template, template, &key.PublicKey, key)
	Expect(err).ToNot(HaveOccurred())

	certPEM := pem.EncodeToMemory(&pem.Block{Type: "CERTIFICATE", Bytes: certDER})
	keyDER, err := x509.MarshalECPrivateKey(key)
	Expect(err).ToNot(HaveOccurred())
	keyPEM := pem.EncodeToMemory(&pem.Block{Type: "EC PRIVATE KEY", Bytes: keyDER})

	return &unstructured.Unstructured{
		Object: map[string]interface{}{
			"apiVersion": "v1",
			"kind":       "Secret",
			"metadata": map[string]interface{}{
				"name":      name,
				"namespace": namespace,
			},
			"type": "kubernetes.io/tls",
			"data": map[string]interface{}{
				"tls.crt": base64.StdEncoding.EncodeToString(certPEM),
				"tls.key": base64.StdEncoding.EncodeToString(keyPEM),
			},
		},
	}
}

var _ = Describe("kasm Tests", Label("kasm"), func() {
	Describe("Installing kasm", Ordered, Label("install"), func() {
		var (
			k  *catalog.App
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
			tlsSecret := createSelfSignedTLSSecret("kasm-tls-secret", catalog.DefaultNamespace)
			err := k8sClient.Create(ctx, tlsSecret)
			Expect(err).ToNot(HaveOccurred())

			k = catalog.NewAppScenario("kasm", *appVersion).(*catalog.App)
			GinkgoWriter.Printf("Installing %s @ %s\n", k.Name(), *appVersion)
			err = k.Install(ctx, env)
			Expect(err).ToNot(HaveOccurred())

			err = setKasmValues(ctx, k.Name(), *appVersion, catalog.DefaultNamespace)
			Expect(err).ToNot(HaveOccurred())
			GinkgoWriter.Printf("Install applied, waiting for HelmRelease to become Ready\n")

			hr = &fluxhelmv2.HelmRelease{
				TypeMeta: metav1.TypeMeta{
					Kind:       fluxhelmv2.HelmReleaseKind,
					APIVersion: fluxhelmv2.GroupVersion.Version,
				},
				ObjectMeta: metav1.ObjectMeta{
					Name:      k.Name(),
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

	Describe("Upgrading kasm", Ordered, Label("upgrade"), func() {
		var (
			k  *catalog.App
			hr *fluxhelmv2.HelmRelease
		)

		BeforeAll(func() {
			k = catalog.NewAppScenario("kasm", *appVersion).(*catalog.App)
			if !k.HasPreviousVersion() {
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
			tlsSecret := createSelfSignedTLSSecret("kasm-tls-secret", catalog.DefaultNamespace)
			err := k8sClient.Create(ctx, tlsSecret)
			Expect(err).ToNot(HaveOccurred())
			err = k.InstallPreviousVersion(ctx, env)
			Expect(err).ToNot(HaveOccurred())

			err = setKasmValues(ctx, k.Name(), *appVersion, catalog.DefaultNamespace)
			Expect(err).ToNot(HaveOccurred())

			hr = &fluxhelmv2.HelmRelease{
				ObjectMeta: metav1.ObjectMeta{
					Name:      k.Name(),
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

		It("should upgrade kasm successfully", func() {
			err := k.Upgrade(ctx, env)
			Expect(err).ToNot(HaveOccurred())

			hr = &fluxhelmv2.HelmRelease{
				ObjectMeta: metav1.ObjectMeta{
					Name:      k.Name(),
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
