package appscenarios

import (
	"context"
	"path/filepath"

	"github.com/mesosphere/kommander-applications/apptests/environment"
	"github.com/mesosphere/kommander-applications/apptests/scenarios"

	"github.com/nutanix-cloud-native/nkp-partner-catalog/apptests/appscenarios/constant"
	"github.com/nutanix-cloud-native/nkp-partner-catalog/apptests/utils"
)

type Kasm struct {
	appVersionToInstall string
}

func NewKasmScenario(appVersionToInstall string) scenarios.AppScenario {
	return &Kasm{
		appVersionToInstall: appVersionToInstall,
	}
}

func (k *Kasm) Name() string {
	return "kasm"
}

func (k *Kasm) Install(ctx context.Context, env *environment.Env) error {
	appPath, err := utils.AbsolutePathTo(k.Name(), k.appVersionToInstall)
	if err != nil {
		return err
	}

	err = k.install(ctx, env, appPath)
	if err != nil {
		return err
	}

	return err
}

func (k *Kasm) install(ctx context.Context, env *environment.Env, appPath string) error {
	// apply the kustomization for the helmrelease
	helmreleasePath := filepath.Join(appPath, "helmrelease")
	err := env.ApplyKustomizations(ctx, helmreleasePath, map[string]string{
		"releaseNamespace": constant.DEFAULT_NAMESPACE,
		"releaseName":      k.Name(),
	})
	if err != nil {
		return err
	}

	return err
}

func (k *Kasm) InstallPreviousVersion(ctx context.Context, env *environment.Env) error {
	appPath, err := utils.GetPrevVAppsUpgradePath(k.Name())
	if err != nil {
		return err
	}

	err = k.install(ctx, env, appPath)
	if err != nil {
		return err
	}

	return nil
}

func (k *Kasm) Upgrade(ctx context.Context, env *environment.Env) error {
	appPath, err := utils.AbsolutePathTo(k.Name(), "")
	if err != nil {
		return err
	}

	err = k.install(ctx, env, appPath)
	if err != nil {
		return err
	}

	return err
}
