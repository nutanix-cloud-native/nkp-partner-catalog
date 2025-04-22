package constant

import "time"

const (
	KOMMANDER_NAMESPACE = "kommander"
	POLL_INTERVAL       = 2 * time.Second
	// Environment variables.
	UPGRADE_APPS_REPO_PATH_ENV     = "UPGRADE_APPS_REPO_PATH"
	DEFAULT_UPGRADE_APPS_REPO_PATH = ".work/upgrade/applications"
)
