# Partner catalog applications

This directory contains **partner applications** for the Nutanix Kubernetes Platform (NKP) partner catalog. Each subdirectory is one application; under it, **semver-named** version directories (for example `1.2.0`) hold the manifests and metadata for that release.

## Directory layout

| Level | Description |
| ----- | ----------- |
| **`<application-name>/`** | One folder per catalog application. |
| **`<application-name>/<semver>/`** | One folder per released version. It includes Flux and Helm wiring (for example HelmRelease and Kustomization files) and **`metadata.yaml`**, which the NKP UI uses to display application details. |

Generated layouts and field-level guidance are described in [CONTRIBUTING.md](../CONTRIBUTING.md).

## How to contribute

Additions and updates go through pull request and are reviewed and merged after approval by the Nutanix team. Use the steps in [CONTRIBUTING.md](../CONTRIBUTING.md) (`nkp generate`, validation, and `apptests` where required).

For repository-wide context (OCI publishing, signing policy, and other top-level paths), see the [root README](../README.md).
