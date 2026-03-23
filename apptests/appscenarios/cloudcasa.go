package appscenarios

import (
	"context"
	"path/filepath"

	"github.com/mesosphere/kommander-applications/apptests/environment"
	"github.com/mesosphere/kommander-applications/apptests/scenarios"

	"github.com/nutanix-cloud-native/nkp-partner-catalog/apptests/appscenarios/constant"
	"github.com/nutanix-cloud-native/nkp-partner-catalog/apptests/utils"
)

type CloudCasa struct {
	appVersionToInstall string
}

func NewCloudCasaScenario(appVersionToInstall string) scenarios.AppScenario {
	return &CloudCasa{
		appVersionToInstall: appVersionToInstall,
	}
}

func (c *CloudCasa) Name() string {
	return "cloudcasa"
}

func (c *CloudCasa) Install(ctx context.Context, env *environment.Env) error {
	appPath, err := utils.AbsolutePathTo(c.Name(), c.appVersionToInstall)
	if err != nil {
		return err
	}

	return c.install(ctx, env, appPath)
}

func (c *CloudCasa) install(ctx context.Context, env *environment.Env, appPath string) error {
	helmreleasePath := filepath.Join(appPath, "helmrelease")
	return env.ApplyKustomizations(ctx, helmreleasePath, map[string]string{
		"releaseNamespace": constant.DEFAULT_NAMESPACE,
		"releaseName":      c.Name(),
	})
}

func (c *CloudCasa) InstallPreviousVersion(ctx context.Context, env *environment.Env) error {
	appPath, err := utils.GetPrevVAppsUpgradePath(c.Name())
	if err != nil {
		return err
	}

	return c.install(ctx, env, appPath)
}

func (c *CloudCasa) Upgrade(ctx context.Context, env *environment.Env) error {
	appPath, err := utils.AbsolutePathTo(c.Name(), "")
	if err != nil {
		return err
	}

	return c.install(ctx, env, appPath)
}
