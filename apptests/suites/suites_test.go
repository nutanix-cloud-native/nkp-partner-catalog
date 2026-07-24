package suites

import (
	"testing"

	"github.com/mesosphere/kommander-applications/apptests/catalog"
)

// skipApps are excluded from the auto-scan default install/upgrade test because
// they have hand-written specs (see the matching *_test.go) that need extra
// setup: TLS secrets (kasm), a hub token (traefik-hub), or real Densify SaaS
// credentials (kubex-automation-stack). Every other app under applications/ gets
// the default auto-scan test.
var skipApps = []string{"kasm", "traefik-hub", "kubex-automation-stack"}

//nolint:gochecknoinits // init required for test registration before suite runs
func init() {
	catalog.InitSuite()
	skip := make(map[string]bool, len(skipApps))
	for _, a := range skipApps {
		skip[a] = true
	}
	// repoRoot is two levels up from apptests/suites/.
	catalog.ScanAndRegister("../..", skip)
}

func TestApplications(t *testing.T) { catalog.RunSuite(t) }
