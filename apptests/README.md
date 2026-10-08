# Creating Application Tests for Partner Catalog

This page details the process of creating application tests (apptests) for new applications onboarded to the NKP Partner Catalog.

## About this task

Application tests validate that partner applications can be successfully **installed** and **upgraded** in a Kubernetes environment using Flux. The framework spins up a Kind cluster, installs Flux CD, and verifies HelmRelease deployments.

## Test Scenarios

The framework tests two critical scenarios for each application:

| Scenario | Purpose | Success Condition |
|----------|---------|-------------------|
| **Install** | Validates fresh deployment with default config | HelmRelease `Ready=True` |
| **Upgrade** | Validates version migration from previous to latest | HelmRelease `Ready=True` + `UpgradeSucceeded` |

> **Note:** Upgrade tests require at least **2 versions** of your application in the `applications/<app-name>/` directory.

## Procedure

### Step 1: Create the Application Scenario

Create a new file in `apptests/appscenarios/` (e.g., `myapp.go`):

```go
package appscenarios

import (
    "context"
    "path/filepath"

    "github.com/mesosphere/kommander-applications/apptests/environment"
    "github.com/mesosphere/kommander-applications/apptests/scenarios"

    "github.com/nutanix-cloud-native/nkp-partner-catalog/apptests/appscenarios/constant"
    "github.com/nutanix-cloud-native/nkp-partner-catalog/apptests/utils"
)

type MyApp struct {
    appVersionToInstall string
}

func NewMyAppScenario(appVersionToInstall string) scenarios.AppScenario {
    return &MyApp{appVersionToInstall: appVersionToInstall}
}

func (m *MyApp) Name() string {
    return "my-app"  // Must match folder name in applications/
}

func (m *MyApp) Install(ctx context.Context, env *environment.Env) error {
    appPath, err := utils.AbsolutePathTo(m.Name(), m.appVersionToInstall)
    if err != nil {
        return err
    }
    return m.install(ctx, env, appPath)
}

func (m *MyApp) install(ctx context.Context, env *environment.Env, appPath string) error {
    helmreleasePath := filepath.Join(appPath, "helmrelease")
    return env.ApplyKustomizations(ctx, helmreleasePath, map[string]string{
        "releaseNamespace": constant.DEFAULT_NAMESPACE,
        "releaseName":      m.Name(),
    })
}

func (m *MyApp) InstallPreviousVersion(ctx context.Context, env *environment.Env) error {
    appPath, err := utils.GetPrevVAppsUpgradePath(m.Name())
    if err != nil {
        return err
    }
    return m.install(ctx, env, appPath)
}

func (m *MyApp) Upgrade(ctx context.Context, env *environment.Env) error {
    appPath, err := utils.AbsolutePathTo(m.Name(), "")
    if err != nil {
        return err
    }
    return m.install(ctx, env, appPath)
}
```

### Step 2: Create the Test Suite

Create a new file in `apptests/suites/` (e.g., `myapp_test.go`).

For detailed test implementation, refer to existing examples:
- [podinfo_test.go](suites/podinfo_test.go) - Basic application test
- [traefikhub_test.go](suites/traefikhub_test.go) - Full install and upgrade tests

The test suite must include:

1. **Install Test** (`Label("install")`):
   - Creates scenario with target version
   - Calls `Install(ctx, env)`
   - Waits for HelmRelease `Ready` condition

2. **Upgrade Test** (`Label("upgrade")`):
   - Creates scenario and calls `InstallPreviousVersion(ctx, env)`
   - Waits for HelmRelease `Ready` condition
   - Calls `Upgrade(ctx, env)`
   - Waits for HelmRelease `Ready` condition with `UpgradeSucceededReason`

> **Note:** The key difference in upgrade verification is checking for `fluxhelmv2.UpgradeSucceededReason` to confirm the upgrade path worked correctly.

### Step 3: Verify Application Structure

Ensure your application has the required structure:

```
applications/
└── my-app/
    ├── 1.0.0/                    # Previous version (required for upgrade tests)
    │   └── helmrelease/
    │       ├── cm.yaml
    │       ├── helmrelease.yaml
    │       └── kustomization.yaml
    └── 1.1.0/                    # Latest version
        └── helmrelease/
            ├── cm.yaml
            ├── helmrelease.yaml
            └── kustomization.yaml
```

### Step 4: Run the Tests

Run tests for your application:

```bash
cd apptests

# Run all tests for your app
go test -v ./suites/... --label-filter="my-app"

# Run only install tests
go test -v ./suites/... --label-filter="my-app && install"

# Run only upgrade tests
go test -v ./suites/... --label-filter="my-app && upgrade"
```

> **Note:** Set `SKIP_CLUSTER_TEARDOWN=1` to preserve the Kind cluster for debugging.

## Directory Structure

```
apptests/
├── appscenarios/           # Application-specific install/upgrade logic
│   ├── constant/
│   │   └── constant.go     # Shared constants
│   └── <app>.go            # Your application scenario
├── suites/                 # Ginkgo test suites
│   ├── suites_test.go      # Test suite setup
│   └── <app>_test.go       # Your application tests
├── utils/
│   └── common.go           # Path resolution utilities
└── go.mod
```

## Substitution Variables

The following variables are dynamically substituted during test execution:

| Variable | Description |
|----------|-------------|
| `${releaseName}` | Application name (from scenario's `Name()` method) |
| `${releaseNamespace}` | Namespace where the app is deployed (`default` by default) |

## Related Topics

- [Flux Kustomization](https://fluxcd.io/flux/components/kustomize/kustomizations/) - For applications with dependencies
- [Ginkgo Testing Framework](https://onsi.github.io/ginkgo/) - BDD testing framework used
- [Gomega Matchers](https://onsi.github.io/gomega/) - Assertion library
