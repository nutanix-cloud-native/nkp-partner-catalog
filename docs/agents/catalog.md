# Catalog browser (agents)

## Generator

`just generate-catalog [root]` → `site/scripts/generate-catalog.js`

- Walks sibling `applications/<name>/<semver>/metadata.yaml` under
  `nkp-ai-applications-catalog`, `nkp-partner-catalog`, `nkp-nutanix-product-catalog`
  (all **public** clones; no token required).
- Writes (gitignored): `source/catalog-data.json`, `source/applications/*`,
  `site/static/catalog-icons/*`.
- Listing JSON omits `overview` / `readme` / `catalogAppNames`.
- Detail JSON includes `versionNkp[]`, `nkpCardRange` (oldest floor as `NKP {min}+`),
  and `catalogAppNames` for in-site dependency links.
- Latest `nkpVersionSupport` / `nkpRange` remain on the app for the default version.

Wipe policy: after a successful walk, the generator replaces `source/applications/`
and refreshes icons. Duplicate app directory names across catalogs fail the run.

## UI

- Listing: `AppCatalog` fetches `/catalog-data.json` (copied to `site/static/` at prepare).
- Detail: generated MDX imports `AppDetailPage` + sibling JSON.
- Card NKP label = `nkpCardRange`; filter matches **any** `versionNkp` range.
- Detail version pills select locally; NKP tag follows selection; GitHub link separate.
- Dependencies: `Tag` with `to=/docs/applications/<name>` when name is in `catalogAppNames`.

## Config

`source/config.yaml` → `applications`:

- `nkpVersionFloor` — empty support ⇒ this minor+; also lower bound for upper-only ranges (`<2.17` → floor). Sole source: `config.yaml` (synced JSON).
- `maxGaNkpVersion` — hide pre-GA from dropdown (do not show 2.20 until GA)
- `knownNkpVersions` — fallback list

Synced to `site/src/data/` by `sync-docs-data` (prepare) / generate-catalog.
