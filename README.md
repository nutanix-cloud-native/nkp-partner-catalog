All source code and other contents in this repository are covered by the Nutanix License and Services Agreement, which is located at https://www.nutanix.com/legal/eula

# NKP Partner Catalog

The **Nutanix Kubernetes Platform (NKP) Partner Catalog** is the source of truth for partner application manifests and metadata used to list, deploy, and upgrade applications in NKP. This repository holds Flux- and Helm-based definitions that partners maintain so that their customers can install and upgrade catalog apps through the **NKP Partner Catalog** in a consistent way.

New applications and updates are contributed via pull request and are reviewed and merged after approval by the Nutanix team. OCI artifacts for published applications are built and pushed post-merge; see [CONTRIBUTING.md](CONTRIBUTING.md) for registry layout and manifest details.

## Who this repository is for

| Audience | Use |
| -------- | --- |
| **Partners and ISVs** | Publish and maintain application versions, metadata, and tests so apps appear in the **NKP Partner Catalog** and behave correctly on install and upgrade. |
| **NKP users and operators** | Consume catalog content indirectly through NKP; this repo is the upstream source for what ships in the **NKP Partner Catalog** experience. |

## Repository layout

| Path | Description |
| ---- | ----------- |
| **`applications/`** | Partner applications. Each app can have multiple versions in **semver-named** subdirectories; each version directory contains the manifests for that release. See [`applications/README.md`](applications/README.md). |
| **`just/`** | [just](https://just.systems/man/en/introduction.html) recipes for common tasks against the applications in this repo. |
| **`apptests/`** | Automated test suites for installation and upgrade scenarios per application. |

## Documentation

| Document | Purpose |
| -------- | ------- |
| [**Contributing**](CONTRIBUTING.md) | Prerequisites (including devbox), generating app scaffolding with `nkp`, manifest structure, validation, and `apptests` requirements. |
| [**NKP Partner Catalog applications**](applications/README.md) | Overview of the `applications/` directory and version layout. |

**Quick start for contributors:** clone the repo, use the workflow in [CONTRIBUTING.md](CONTRIBUTING.md) (`nkp generate`, validate with `nkp validate catalog-repository`, open a PR with signed commits).

## Signed commits

All commits to this repository **must be signed**. See GitHub’s guide: [Managing commit signature verification](https://docs.github.com/en/authentication/managing-commit-signature-verification).
