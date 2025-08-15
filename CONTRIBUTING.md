# Contributing to nkp-partner-catalog

Follow these guidelines to add or update partner applications.

## How to contribute

- Open a GitHub Pull Request (PR) with your changes.
- Ensure all commits are **signed** (see the README for signing instructions).
- Validate your changes before submission (see **Pre-checks** below).

## Prerequisites

- Clone the repository:
    ```
    git clone git@github.com:nutanix-cloud-native/nkp-partner-catalog.git
    ```
- Install [devbox](https://www.jetify.com/docs/devbox/installing_devbox/). Devbox is a command-line tool that lets you easily create isolated shells for development.
- Enter the devbox environment by running `devbox shell` in the cloned repository directory. This will set up the environment with all necessary dependencies. Subsequently, you can run commands like `nkp`, `just`, and `go` directly.
    ```
    devbox shell
    ```

## Creating a new application

1. Generate a placeholder directory layout for your new application under `applications/` with your application name and version by executing:

    ```
    nkp generate catalog-repository --apps=<app-name>=<app-version>
    ```

    The CLI will generate the required layout and files automatically that looks similar to:

    ```
    ...
    ├── applications
    │   └── <app-name>
    │       └── <app-version>
    │           ├── helmrelease
    │           │   ├── cm.yaml             // Optional ConfigMap specifying any overrides for HelmRelease
    │           │   ├── helmrelease.yaml    // OCIRepository and HelmRelease
    │           │   └── kustomization.yaml  // Kubernetes Kustomization file
    │           ├── helmrelease.yaml        // FluxCD Kustomization file for the HelmRelease
    │           ├── kustomization.yaml      // Kubernetes Kustomization file
    │           └── metadata.yaml           // Application details
    ...
    ```

## Overview of App structure

- Each application can have **multiple versions**, each with its own directory.
- Each version must include `metadata.yaml`, used by NKP UI for rendering metadata.
- OCI artifacts are built and pushed to the `ghcr.io/nutanix-cloud-native/nkp-partner-catalog/<app-name>` automatically post-merge.

### Structuring application manifests

- Update **OCIRepository** URL to point to your application's Helm chart.
- Add optional overrides for application HelmRelease into `cm.yaml` as needed.
- The default layout (generated in previous step) satisfies most use cases that deploy a simple application with no dependencies. If there are any intricacies in deploying various components of the application, Flux Kustomization provides various constructs to orchestrate the application deployment such as:
  - Having multiple top level Flux Kustomization files that [depend on each other](https://fluxcd.io/flux/components/kustomize/kustomizations/#dependencies).
  - Ability to define [health checks](https://fluxcd.io/flux/components/kustomize/kustomizations/#health-checks) for each kustomization.
  - See https://fluxcd.io/flux/components/kustomize/kustomizations/ for more details on how to use Flux Kustomization.
- Substitution variables in the application manifests:
  - `${releaseName}` → Dynamically substituted with user provided AppDeployment value during installation.
  - `${releaseNamespace}` → Dynamically substituted with namespace where the app is deployed.


## Pre-checks before submitting

Validate your directory structure and manifest content using NKP CLI:

```
nkp validate catalog-repository --repo-dir=/path/to/nkp-partner-catalog
```

## Testing applications

1. Implement the **AppScenario** interface for your application in the `apptests/` directory.
1. Write two Ginkgo test cases:
    - **Install test**: Deploys the latest app version and verifies the HelmRelease is created.
    - **Upgrade test**:
        - Installs a previous version
        - Upgrades to the latest
        - Verifies:
            - Only one HelmRelease exists
            - Upgrade succeeded (status reason is `UpgradeSucceeded` or similar)
1. Label the test cases appropriately:
    - With the app name
    - With the type: `install` or `upgrade`
