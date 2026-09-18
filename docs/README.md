# Docs in `nkp-partner-catalog`

This directory contains docs source and docs tooling.

## Layout

- `source/` — authored docs content (MD/MDX), including:
  - `source/cli/` (generated CLI reference source files)
  - `source/schemas/v1/` (generated schema JSON files used by API docs pages)
- `site/` — Docusaurus app and config
- `scripts/build-exports.mjs` — builds Single PDF + Single HTML offline exports

`source/applications/*.mdx`, their sibling `.json` files, `source/catalog-data.json`,
and `site/static/catalog-icons/` are generated catalog content. Icons are static
files referenced by URL (not base64). When the sibling catalog repositories are
available, run `just generate-catalog` before starting a local preview.

## Local commands

From `docs/`:

- `just generate-catalog` — crawl sibling catalog repos and refresh the slim `source/catalog-data.json` listing index, full per-app pages under `source/applications/`, and decoded icons under `site/static/catalog-icons/` (referenced by URL from both listing and detail JSON). Listing omits app overviews and READMEs. The NKP version dropdown includes versions from `.release/stable.yaml` up through `MAX_GA_NKP_VERSION` in `site/src/components/nkpVersion.js` (currently 2.19). Override with `MAX_GA_NKP_VERSION=2.20 just generate-catalog`.
- `just docs-build` — GitHub Pages build (`/nkp-partner-catalog/`) including Export downloads under `site/static/offline/`
- `just docs-local` — local preview at `/`, including regenerated PDF/HTML Export downloads
- `just docs-offline` — PDF + HTML exports only (`docs/dist/` and `site/static/offline/`)
- `just docs-deploy` — stage `site/build/` into a local `gh-pages` clone

## Build behavior

Before docs build, schemas are synced from:

- `docs/source/schemas/v1/` -> `docs/site/static/schemas/v1/`

`docs/source/schemas/v1/` is the source of truth. The committed
`docs/site/static/schemas/v1/` copy is build output retained so links such as
`/schemas/v1/*.json` resolve even before the prepare step; prepare refreshes it with
`rsync --delete`.

`docs-build`, `docs-local`, and `docs-offline` also generate:

- `nkp-catalog-docs.pdf` (preferred offline format; section outline preserved)
- `nkp-catalog-docs.html` (secondary; open via `file://`)

The live site **Export** menu downloads those files. No local web server or language runtime is required to read them on Windows or Linux.

PDF generation needs Chrome/Chromium on the build machine (`CHROME_PATH` override supported).

## Deployment behavior

- Workflow: `.github/workflows/deploy-docs.yaml`
- Trigger: pushes to `main` affecting `docs/**`, nightly cron (07:00 UTC), or manual dispatch
- Catalog index: CI clones `nkp-ai-applications-catalog` and `nkp-nutanix-product-catalog` next to this repo, then runs `just generate-catalog` before the site build. Private sibling repos need a `CATALOG_READ_TOKEN` secret with read access.
- Output: builds from `docs/site` and publishes to the `gh-pages` branch and GitHub Pages
- Preserve: `source/` and `site/` on `gh-pages` are excluded from build-output rsync delete
