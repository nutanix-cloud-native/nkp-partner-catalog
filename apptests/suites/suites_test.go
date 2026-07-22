package suites

import (
	"testing"

	"github.com/mesosphere/kommander-applications/apptests/catalog"
)

// skipApps have hand-written specs that need extra setup (secrets, ConfigMap
// patches); every other app under applications/ gets a default install +
// upgrade template test via auto-scan.
var skipApps = []string{"kasm", "traefik-hub"}

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
