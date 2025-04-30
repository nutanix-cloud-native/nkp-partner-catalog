package appscenarios

import (
	"context"
	"path/filepath"

	// km_appscenarios "github.com/mesosphere/kommander-applications/apptests/appscenarios"
	"github.com/mesosphere/kommander-applications/apptests/environment"

	"github.com/nutanix-cloud-native/nkp-partner-catalog/apptests/appscenarios/constant"
	"github.com/nutanix-cloud-native/nkp-partner-catalog/apptests/utils"
)

type Prometheus struct {
	appVersionToInstall string
}

func NewPrometheusScenerio(appVesrionToInstall string) AppScenario {
	return &Prometheus{
		appVersionToInstall: appVesrionToInstall,
	}
}

func (pr *Prometheus) Name() string {
	return "prometheus"
}

func (pr *Prometheus) Install(ctx context.Context, env *environment.Env) error {
	appPath, err := utils.AbsolutePathTo(pr.Name(), pr.appVersionToInstall)
	if err != nil {
		return err
	}

	err = pr.install(ctx, env, appPath)
	if err != nil {
		return err
	}

	return err
}

func (pr *Prometheus) install(ctx context.Context, env *environment.Env, appPath string) error {
	// apply the kustomization for the source
	sourcesPath := filepath.Join(appPath, "sources")
	err := env.ApplyKustomizations(ctx, sourcesPath, map[string]string{
		"releaseNamespace": constant.KOMMANDER_NAMESPACE,
	})
	if err != nil {
		return err
	}

	// apply the kustomization for the helmrelease
	helmreleasePath := filepath.Join(appPath, "helmrelease")
	err = env.ApplyKustomizations(ctx, helmreleasePath, map[string]string{
		"releaseNamespace": constant.KOMMANDER_NAMESPACE,
	})
	if err != nil {
		return err
	}

	return err
}

func (pr *Prometheus) InstallPreviousVersion(ctx context.Context, env *environment.Env) error {
	appPath, err := utils.GetPrevVAppsUpgradePath(pr.Name())
	if err != nil {
		return err
	}

	err = pr.install(ctx, env, appPath)
	if err != nil {
		return err
	}

	return nil
}

func (pr *Prometheus) Upgrade(ctx context.Context, env *environment.Env) error {
	appPath, err := utils.AbsolutePathTo(pr.Name(), "")
	if err != nil {
		return err
	}

	err = pr.install(ctx, env, appPath)
	if err != nil {
		return err
	}

	return err
}
