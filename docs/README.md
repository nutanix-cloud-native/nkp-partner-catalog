# Docs in `nkp-partner-catalog`

This directory contains docs source and docs tooling.

## Layout

- `source/` — authored docs content (MD/MDX), including:
  - `source/cli/` (generated CLI reference source files)
  - `source/schemas/v1/` (generated schema JSON files used by API docs pages)
- `site/` — Docusaurus app and config
- `docs.just` — docs recipes used by the repo `justfile`
- `devbox.json` — docs-local devbox commands

## Local commands

From repo root:

- `just docs-build`
- `just docs-local`
- `just docs-deploy`

## Build behavior

Before docs build, schemas are synced from:

- `docs/source/schemas/v1/` -> `docs/site/static/schemas/v1/`

This ensures links such as `/schemas/v1/*.json` resolve during Docusaurus build.

## Deployment behavior

- Workflow: `.github/workflows/deploy-docs.yaml`
- Trigger: pushes to `main` affecting `docs/**` files, or manual dispatch
- Output: builds from `docs/site` and syncs generated static files to `gh-pages`
- Preserve: `source/` and `site/` on `gh-pages` are excluded from build-output rsync delete
