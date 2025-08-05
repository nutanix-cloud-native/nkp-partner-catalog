# [[nkp-partner-catalog]]
[[This repo is dedicated to storing the HelmRelease and other info needed for Partner's Appliations. Contibution for new applications are to be made here and will be reviewed and merged once approved from internal team.]]

### Finding your way around
- `applications` directory contains all the partner applications, each application can have multiple version which is shown using semver named directory, and within each application version directory it contains manifest files for a helmrelease.
- `just` directory contains just reciepes, using which one can perform various actions on the applications.
- `apptests` directory contains test suites for each application's intall and upgrade scenarios.

### Pre Commit
This repo uses https://pre-commit.com/ to run pre-commit hooks. Please install pre-commit and run pre-commit install in the root directory before committing.

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
1. create a new directory with app name inside the `applications` directory and within the newly created app directory, create a version directory or can use the nkp cli tool with `nkp generate catalog-repository --repo-dir=/path/to/nkp-partner-catalog --apps=new-app=1.0.0`.
2. if you used the above nkp cli `generate` command then it must have created the generic layout and content required for the app.
3. about the layout
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
4. now one can replace the url of ocirepository to point to their application helm chart, and also configmap data according to the need of the applciation.
5. about the placeholders
   - ${releaseName} : once the application is installed in NKP cluster, this will be substitiuted with a unique value.
   - ${releaseNamespace} : this will be substitiuted with the namespace at which the application is installed.

### OVERVIEW of how App structure works
- each app have either single or multiple versions
- each app version has metadata.yaml which is used by NKP platform for metadata purpose.
- when an application specific version is installed , the entry point will be the `nkp-partner-catalog/applications/test-app/1.0.0/kustomization.yaml` file, which eventually points to `nkp-partner-catalog/applications/test-app/1.0.0/helmrelease.yaml`.
- the above `helmrelease.yaml` point to the oci artifact of the current app version, which is created and deployed to nutanix official oci registry by the internal team.
- the  `helmrelease.yaml` instruct the flux cd to observe the `./helmrelease` path with respect to the oci artifact and apply the kustomize within the mentioned path.


### PRE-CHECKS before submitting application
- check the sturcture and manifest files content using command `just validate-manifests` or via nkp cli tool `nkp validate catalog-repository --repo-dir=/path/to/nkp-partner-catalog`.

### TESTING of application
