package suites

import (
	"context"
	"flag"
	"os"
	"testing"

	fluxhelmv2 "github.com/fluxcd/helm-controller/api/v2"
	"github.com/mesosphere/kommander-applications/apptests/client"
	"github.com/mesosphere/kommander-applications/apptests/docker"
	"github.com/mesosphere/kommander-applications/apptests/environment"
	"github.com/mesosphere/kommander-applications/apptests/flux"
	"github.com/mesosphere/kommander-applications/apptests/kind"
	. "github.com/onsi/ginkgo/v2"
	. "github.com/onsi/gomega"
	genericClient "sigs.k8s.io/controller-runtime/pkg/client"
	"sigs.k8s.io/controller-runtime/pkg/log"
	"sigs.k8s.io/controller-runtime/pkg/log/zap"
)

var (
	env       *environment.Env
	ctx       context.Context
	network   *docker.NetworkResource
	k8sClient genericClient.Client

	useExistingCluster bool
)

var appVersion = flag.String("app-version", "", "The version of the application (required)")

var _ = BeforeSuite(func() {
	Expect(*appVersion).ToNot(BeEmpty(), "-app-version flag is required")

	log.SetLogger(zap.New(zap.WriteTo(GinkgoWriter), zap.UseDevMode(true)))

	ctx = context.Background()

	if kubeconfig := os.Getenv("E2E_KUBECONFIG"); kubeconfig != "" {
		useExistingCluster = true
		env = &environment.Env{}

		typedClient, err := client.NewClient(kubeconfig)
		Expect(err).ShouldNot(HaveOccurred())
		env.K8sClient = typedClient

		scheme := flux.NewScheme()
		_ = fluxhelmv2.AddToScheme(scheme)

		k8sClient, err = genericClient.New(typedClient.Config(), genericClient.Options{Scheme: scheme})
		Expect(err).ShouldNot(HaveOccurred())
	} else {
		var err error
		network, err = kind.EnsureDockerNetworkExist(ctx, "", false)
		Expect(err).ShouldNot(HaveOccurred())

		env = &environment.Env{
			Network: network,
		}
	}
})

func TestApplications(t *testing.T) {
	RegisterFailHandler(Fail)
	suiteConfig, reporterConfig := GinkgoConfiguration()
	RunSpecs(t, "Application Test Suite", suiteConfig, reporterConfig)
}

func SetupKindCluster() error {
	if useExistingCluster {
		return nil
	}

	if ctx == nil {
		ctx = context.Background()
	}

	err := env.Provision(ctx)
	if err != nil {
		return err
	}

	scheme := flux.NewScheme()
	_ = fluxhelmv2.AddToScheme(scheme)

	k8sClient, err = genericClient.New(env.K8sClient.Config(), genericClient.Options{Scheme: scheme})
	if err != nil {
		return err
	}

	return nil
}
