# [[nkp-partner-catalog]]
[[This repository is dedicated to storing HelmRelease manifests and other metadata required for partner applications. Contributions for new applications should be made here and will be reviewed and merged upon approval by the internal team.]]

### Finding your way around
- The `applications/` directory contains all partner applications. Each application can have multiple versions organized in semver-named subdirectories. Each version directory includes the manifest files for its HelmRelease.using semver named directory, and within each application version directory it contains manifest files for a helmrelease.
- The `just/` directory contains just recipes used to perform various actions on the applications.
- The `apptests/` directory contains test suites for each application's installation and upgrade scenarios.

### Pre Commit
This repository uses [pre-commit](https://pre-commit.com/) hooks.
Please install pre-commit and run the following in the repository root before committing:

## Signing commits
Commits into this repository must be signed. Learn how to sign your commits:
<!-- markdown-link-check-disable-next-line -->
https://docs.github.com/en/authentication/managing-commit-signature-verification

## CONTRIBUTION
If you would like to contribute to nkp partner catalog, you're welcome to open a GitHub pull request (PR).

### Clone
clone this git repo `git clone git@github.com:nutanix-cloud-native/nkp-partner-catalog.git`

### Prerequisites
- [just](https://just.systems/man/en/introduction.html) command runner.
- Not compulsary, but can use nkp cli tool to get started with creation of new application, validation of application. Get the nkp cli via running `just nkp-cli`, this will download the binary to `.local/bin`.

### Create new app
1. Create a new directory under `applications/` with your application name, then a versioned subdirectory.
Alternatively, use the nkp CLI:
```
nkp generate catalog-repository --repo-dir=/path/to/nkp-partner-catalog --apps=new-app=1.0.0
```
2. If using the CLI, it will generate the required layout and files automatically.
3. Directory layout example
  ```
  new-app
  └── 1.0.0
      ├── helmrelease
      │   ├── cm.yaml                   // k8s config map
      │   ├── helmrelease.yaml          // ocirepository and helmrelease
      │   └── kustomization.yaml
      ├── helmrelease.yaml              // fluxcd kustomize entry point
      ├── kustomization.yaml            // k8s kustomize entry point
      └── metadata.yaml                 // details regarding the application
  ```
4. Replace placeholder values:
   - Update ocirepository URL to point to your application's Helm chart
   - Customize cm.yaml as needed
5. Template placeholders
   - ${releaseName} : Will be replaced with a unique value when the application is installed in an NKP cluster.
   - ${releaseNamespace} : Will be replaced with the namespace where the application is deployed.

### OVERVIEW of how App structure works
- Each application can have multiple versions, each with its own directory.
- Each version must include a metadata.yaml, used by the NKP platform for rendering metadata.
- When a specific app version is installed:
  - The entry point is applications/<app-name>/<version>/kustomization.yaml
  - That file points to helmrelease.yaml
  - The helmrelease.yaml points to an OCI artifact of the Helm chart
- OCI artifacts are built and pushed to the Nutanix official OCI registry by the internal team
- FluxCD then applies the Kustomize files from the ./helmrelease directory within that OCI artifact


### PRE-CHECKS before submitting application
- Validate your directory structure and manifest content with:
```
just validate-manifests
```
Or use the NKP CLI:
```
nkp validate catalog-repository --repo-dir=/path/to/nkp-partner-catalog
```

### TESTING of application
1. Implement the AppScenario interface for the application in the apptests/ directory.
2. Write two Ginkgo test cases:
  - Install test: Deploys the latest app version and verifies the HelmRelease is created.
  - Upgrade test: Installs a previous version, then upgrades to the latest, and verifies:
    - Only one HelmRelease exists
    - Upgrade succeeded (status reason is UpgradeSucceeded or similar)
3. Label the test cases appropriately:
  - With the app name
  - With the type: install or upgrade
