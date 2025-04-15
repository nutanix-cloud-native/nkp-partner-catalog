package appscenarios

import (
	"context"
	"path/filepath"

	"github.com/mesosphere/kommander-applications/apptests/environment"
	"github.com/nutanix-cloud-native/nkp-partner-catalog/tests/appscenarios/constant"
)

type Redis struct{}

func NewRedisScenerio() AppScenario {
	return &Redis{}
}

func (r *Redis) Name() string {
	return "redis"
}

func (r *Redis) Install(ctx context.Context, env *environment.Env, appVersion string) error {
	appPath, err := absolutePathTo(r.Name(), appVersion)
	if err != nil {
		return err
	}

	err = r.install(ctx, env, appPath)
	if err != nil {
		return err
	}

	return err
}

func (r *Redis) install(ctx context.Context, env *environment.Env, appPath string) error {
	// apply defaults config maps first
	defaultKustomization := filepath.Join(appPath, "/defaults")
	err := env.ApplyKustomizations(ctx, defaultKustomization, map[string]string{
		"releaseNamespace": constant.KOMMANDER_NAMESPACE,
	})
	if err != nil {
		return err
	}

	// apply the kustomization for the source
	sourcesPath := filepath.Join(appPath, "/sources")
	err = env.ApplyKustomizations(ctx, sourcesPath, map[string]string{
		"releaseNamespace": constant.KOMMANDER_NAMESPACE,
	})
	if err != nil {
		return err
	}

	// apply the kustomization for the helmrelease
	helmreleasePath := filepath.Join(appPath, "/helmrelease")
	err = env.ApplyKustomizations(ctx, helmreleasePath, map[string]string{
		"releaseNamespace": constant.KOMMANDER_NAMESPACE,
	})
	if err != nil {
		return err
	}

	return err
}

func (r *Redis) InstallPreviousVersion(ctx context.Context, env *environment.Env) error {
	return nil
}

func (r *Redis) Upgrade(ctx context.Context, env *environment.Env) error {
	return nil
}