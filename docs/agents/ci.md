# CI and local recipes (agents)

## Local

```bash
cd docs
just clean                          # wipe generated/build artifacts
just resolve-nkp-releases           # probe → .cache/nkp-releases.json
just fetch-catalog-sources          # Platform git + OCI (needs oras)
just generate-catalog               # needs sibling catalog clones
just generate-cli-docs              # needs network or .cache/nkp-cli
just docs-preview                   # full generate + prepare + serve
just docs-local                     # same + Chrome PDF/HTML export
just docs-build                     # production baseUrl + export
```

Sibling layout (`catalogs[].id` + expanded Platform source ids):

```
<org>/
  nkp-partner-catalog/
  nkp-ai-applications-catalog/
  nkp-nutanix-product-catalog/
  kommander-applications-2.16/   # fetched
  kommander-applications-2.17/
  kommander-applications-2.18/
  kommander-applications-full-2.19/  # oras pull
```

`justfile` `sibling_root` defaults to the org root (`docs/../../`).

## Prepare

`_docs-prepare`:

- rsync schemas; copy `catalog-data.json` when present
- `npm ci` in `site/`
- `sync-docs-data.mjs` → `site/src/data/*.json` (uses resolved releases when present)

## CI

`.github/workflows/deploy-docs.yaml`:

1. Check out partner + AI + Nutanix siblings
2. `just docs-build` (resolve → fetch Platform → generate → prepare → export → build)
3. `upload-pages-artifact` → `deploy-pages`

Requires `oras` (devbox) and network for downloads.d2iq.com + ghcr.io.

## Export

`scripts/build-exports.mjs` → `site/static/offline/` (Chrome). Skips generated
application shells and per-version CLI dumps.
