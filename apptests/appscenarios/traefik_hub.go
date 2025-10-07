package appscenarios

import (
	"context"
	"path/filepath"

	"github.com/mesosphere/kommander-applications/apptests/environment"
	"github.com/mesosphere/kommander-applications/apptests/scenarios"

	"github.com/nutanix-cloud-native/nkp-partner-catalog/apptests/appscenarios/constant"
	"github.com/nutanix-cloud-native/nkp-partner-catalog/apptests/utils"
)

type TraefikHubAPIGW struct {
	appVersionToInstall string
}

func NewTraefikHubAPIGWScenario(appVersionToInstall string) scenarios.AppScenario {
	return &TraefikHubAPIGW{
		appVersionToInstall: appVersionToInstall,
	}
}

func (t *TraefikHubAPIGW) Name() string {
	return "traefik-hub"
}

func (t *TraefikHubAPIGW) Install(ctx context.Context, env *environment.Env) error {
	appPath, err := utils.AbsolutePathTo(t.Name(), t.appVersionToInstall)
	if err != nil {
		return err
	}

	err = t.install(ctx, env, appPath)
	if err != nil {
		return err
	}

	return err
}

func (t *TraefikHubAPIGW) install(ctx context.Context, env *environment.Env, appPath string) error {
	// apply the kustomization for the helmrelease
	helmreleasePath := filepath.Join(appPath, "helmrelease")
	err := env.ApplyKustomizations(ctx, helmreleasePath, map[string]string{
		"releaseNamespace": constant.DEFAULT_NAMESPACE,
		"releaseName":      t.Name(),
	})
	if err != nil {
		return err
	}

	return err
}

func (t *TraefikHubAPIGW) InstallPreviousVersion(ctx context.Context, env *environment.Env) error {
	appPath, err := utils.GetPrevVAppsUpgradePath(t.Name())
	if err != nil {
		return err
	}

	err = t.install(ctx, env, appPath)
	if err != nil {
		return err
	}

	return nil
}

func (t *TraefikHubAPIGW) Upgrade(ctx context.Context, env *environment.Env) error {
	appPath, err := utils.AbsolutePathTo(t.Name(), "")
	if err != nil {
		return err
	}

	err = t.install(ctx, env, appPath)
	if err != nil {
		return err
	}

	return err
}
