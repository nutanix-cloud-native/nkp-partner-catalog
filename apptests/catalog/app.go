package catalog

import (
	"context"
	"fmt"
	"os"
	"path/filepath"
	"time"

	"github.com/mesosphere/kommander-applications/apptests/environment"
	"github.com/mesosphere/kommander-applications/apptests/scenarios"
)

const (
	DefaultNamespace = "default" // TODO: create a namespace dynamically during runtime
	PollInterval     = 2 * time.Second
)

// App is a generic implementation of scenarios.AppScenario that works for any
// application whose install/upgrade path follows the standard helmrelease
// kustomization layout under applications/<name>/<version>/helmrelease.
type App struct {
	name                string
	appVersionToInstall string
}

func NewAppScenario(name, appVersionToInstall string) scenarios.AppScenario {
	return &App{
		name:                name,
		appVersionToInstall: appVersionToInstall,
	}
}

func (a *App) Name() string {
	return a.name
}

func (a *App) Install(ctx context.Context, env *environment.Env) error {
	appPath, err := absolutePathTo(a.Name(), a.appVersionToInstall)
	if err != nil {
		return err
	}
	return a.install(ctx, env, appPath)
}

func (a *App) install(ctx context.Context, env *environment.Env, appPath string) error {
	helmreleasePath := filepath.Join(appPath, "helmrelease")
	return env.ApplyKustomizations(ctx, helmreleasePath, map[string]string{
		"releaseNamespace": DefaultNamespace,
		"releaseName":      a.Name(),
	})
}

func (a *App) InstallPreviousVersion(ctx context.Context, env *environment.Env) error {
	appPath, err := getPrevVersionPath(a.Name())
	if err != nil {
		return err
	}
	return a.install(ctx, env, appPath)
}

func (a *App) Upgrade(ctx context.Context, env *environment.Env) error {
	appPath, err := absolutePathTo(a.Name(), "")
	if err != nil {
		return err
	}
	return a.install(ctx, env, appPath)
}

// absolutePathTo returns the absolute path to the given application directory.
// When appVersion is empty it returns the latest (lexicographically last) version.
func absolutePathTo(application, appVersion string) (string, error) {
	dir, err := applicationDir(application)
	if err != nil {
		return "", err
	}

	if appVersion != "" {
		pathToApp := filepath.Join(dir, appVersion)
		if _, err := os.Stat(pathToApp); err != nil {
			return "", fmt.Errorf("no application directory found for app: %s of version: %s", application, appVersion)
		}
		return pathToApp, nil
	}

	matches, err := filepath.Glob(filepath.Join(dir, "*"))
	if err != nil {
		return "", err
	}

	if len(matches) == 0 {
		return "", fmt.Errorf("no application directory found for %s in the given path:%s", application, dir)
	}

	return matches[len(matches)-1], nil
}

// getPrevVersionPath returns the second-to-latest version directory for upgrade testing.
func getPrevVersionPath(application string) (string, error) {
	dir, err := applicationDir(application)
	if err != nil {
		return "", err
	}

	matches, err := filepath.Glob(filepath.Join(dir, "*"))
	if err != nil {
		return "", err
	}

	if len(matches) == 0 {
		return "", fmt.Errorf("no application directory found for %s in the given path:%s", application, dir)
	}

	if len(matches) < 2 {
		return "", fmt.Errorf("no old version found for the application: %s", application)
	}

	return matches[len(matches)-2], nil
}

// HasPreviousVersion reports whether there is a version directory that sorts
// before the app's configured version, i.e. whether an upgrade test is meaningful.
// When appVersionToInstall is empty (latest), it checks if there are at least
// two version directories.
func (a *App) HasPreviousVersion() bool {
	dir, err := applicationDir(a.name)
	if err != nil {
		return false
	}
	matches, err := filepath.Glob(filepath.Join(dir, "*"))
	if err != nil {
		return false
	}
	if a.appVersionToInstall == "" {
		return len(matches) >= 2
	}
	for _, m := range matches {
		if filepath.Base(m) < a.appVersionToInstall {
			return true
		}
	}
	return false
}

func applicationDir(application string) (string, error) {
	wd, err := os.Getwd()
	if err != nil {
		return "", err
	}

	var base string
	if _, err := os.Stat(filepath.Join(wd, "applications")); os.IsNotExist(err) {
		base = "../.."
	}

	return filepath.Abs(filepath.Join(wd, base, "applications", application))
}
