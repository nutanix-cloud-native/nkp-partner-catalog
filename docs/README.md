# Docs in `nkp-partner-catalog`

This directory contains docs source and docs tooling.

## Layout

- `source/` — authored docs content (MD/MDX), including:
  - `source/cli/` (generated CLI reference source files)
  - `source/schemas/v1/` (generated schema JSON files used by API docs pages)
- `site/` — Docusaurus app and config
- `scripts/build-exports.mjs` — builds Single PDF + Single HTML offline exports

## Local commands

From `docs/`:

- `just docs-build` — GitHub Pages build (`/nkp-partner-catalog/`) including Export downloads under `site/static/offline/`
- `just docs-local` — local preview at `/` (does not rebuild PDF/HTML exports)
- `just docs-offline` — PDF + HTML exports only (`docs/dist/` and `site/static/offline/`)
- `just docs-deploy` — stage `site/build/` into a local `gh-pages` clone

## Build behavior

Before docs build, schemas are synced from:

- `docs/source/schemas/v1/` -> `docs/site/static/schemas/v1/`

This ensures links such as `/schemas/v1/*.json` resolve during Docusaurus build.

`docs-build` and `docs-offline` also generate:

- `nkp-catalog-docs.pdf` (preferred offline format; section outline preserved)
- `nkp-catalog-docs.html` (secondary; open via `file://`)

The live site **Export** menu downloads those files. No local web server or language runtime is required to read them on Windows or Linux.

PDF generation needs Chrome/Chromium on the build machine (`CHROME_PATH` override supported).

## Deployment behavior

- Workflow: `.github/workflows/deploy-docs.yaml`
- Trigger: pushes to `main` affecting `docs/**` files, or manual dispatch
- Output: builds from `docs/site` and syncs generated static files to `gh-pages`
- Preserve: `source/` and `site/` on `gh-pages` are excluded from build-output rsync delete
