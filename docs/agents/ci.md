# CI and local recipes (agents)

## Local

```bash
cd docs
just clean                          # wipe generated/build artifacts
just generate-catalog               # needs sibling catalog clones
just generate-cli-docs              # needs network or .cache/nkp-cli
just docs-preview                   # generate + prepare + serve (no PDF)
just docs-local                     # same + Chrome PDF/HTML export
just docs-build                     # production baseUrl + export
```

Sibling layout (public repos):

```
<org>/
  nkp-partner-catalog/
  nkp-ai-applications-catalog/
  nkp-nutanix-product-catalog/
```

`justfile` `sibling_root` defaults to the parent of this checkout’s parent
(`docs/../../` → org root when repo is `…/nkp-partner-catalog`).

## Prepare

`_docs-prepare` (via docs-preview/local/build/offline):

- rsync `source/schemas/v1/` → `site/static/schemas/v1/` (authored schemas; static
  copy not committed — browser loads `/schemas/v1/…`)
- copy `catalog-data.json` → `site/static/` when present
- `npm ci` in `site/`
- `scripts/sync-docs-data.mjs` → `site/src/data/{nkp-version-config,cli-versions,portal-version}.json`
  (gitignored; edit `source/config.yaml` only)

## CI (do not edit workflow from docs overhaul)

`.github/workflows/deploy-docs.yaml` (describe only):

1. Optional best-effort `just update-docs-config` (schedule/dispatch)
2. `just generate-catalog` / `just generate-cli-docs`
3. `just docs-build`
4. `upload-pages-artifact` → `deploy-pages`

No `gh-pages` branch push from CI. Do not revive `npm run deploy` / `just docs-deploy`.

## Export

`scripts/build-exports.mjs` builds PDF + HTML under `site/static/offline/`
(Chrome required). Portal version comes from `portal-version.json` (prepare),
not a hardcoded constant. Skips generated application shells and per-version
CLI dumps (landing is enough offline).
