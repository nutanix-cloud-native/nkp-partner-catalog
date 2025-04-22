package appscenarios

import (
	"context"
	"path/filepath"

	"github.com/mesosphere/kommander-applications/apptests/environment"
	"github.com/nutanix-cloud-native/nkp-partner-catalog/tests/appscenarios/constant"
)

type Prometheus struct{}

func NewPrometheusScenerio() AppScenario {
	return &Prometheus{}
}

func (pr *Prometheus) Name() string {
	return "prometheus"
}

func (pr *Prometheus) Install(ctx context.Context, env *environment.Env, appVersion string) error {
	appPath, err := absolutePathTo(pr.Name(), appVersion)
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
	appPath, err := getPrevVAppsUpgradePath(pr.Name())
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
	appPath, err := absolutePathTo(pr.Name(), "")
	if err != nil {
		return err
	}

	err = pr.install(ctx, env, appPath)
	if err != nil {
		return err
	}

	return err
}
