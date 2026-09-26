# Catalog browser (agents)

## Generator

`just resolve-nkp-releases` then `just fetch-catalog-sources` then
`just generate-catalog [root]` → `site/scripts/generate-catalog.js`

- Catalog list: `source/config.yaml` → `catalogs[]`.
- Legacy entries: sibling `<id>/applications/<name>/<semver>/metadata.yaml`.
- Platform (`kind: platformHybrid`): one source per resolved NKP minor —
  git `kommander-applications` @ `v{latest}` when minor `< ociFromMinor` (default 2.19);
  OCI `ghcr.io/mesosphere/kommander-applications-full:v{latest}` at/above that minor.
- Merges apps by name within a logical catalog; injects `nkpVersionSupport` from
  the source minor when metadata omits it.
- Writes (gitignored): `source/catalog-data.json`, `source/applications/*`,
  `site/static/catalog-icons/*`.
- NKP filter versions: resolved releases (GA ≤ `maxGaNkpVersion`), with
  `.release/stable.yaml` only as a secondary fallback.

Duplicate app directory names across **logical** catalogs fail the run.

## UI

- Listing: `AppCatalog` fetches `/catalog-data.json`.
- Detail: `AppDetailPage`; GitHub link uses per-version `catalogRepo` + `ref`
  (omitted for OCI-backed Platform versions).
- Card NKP label = `nkpCardRange`; filter matches any `versionNkp` range.

## Config

`source/config.yaml` → `applications`:

- `nkpVersionFloor` — catalog/Platform start + empty-support floor (CLI may probe older via `cliDocs.nkpVersionFloor`)
- `maxGaNkpVersion` — public Applications dropdown ceiling

No committed `knownNkpVersions` / patch pins. Tags come from
`.cache/nkp-releases.json` (`just resolve-nkp-releases`); Platform expansion
skips minors below `applications.nkpVersionFloor`.
