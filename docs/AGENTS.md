# AGENTS.md — NKP Catalog docs site

Guidance for agents working in **`docs/`**. Docusaurus 3 site for the NKP
Catalog (partner + Nutanix product + AI application catalogs).

Live: https://nutanix-cloud-native.github.io/nkp-partner-catalog/
(`baseUrl` `/nkp-partner-catalog/`)

Deep dives: [catalog](agents/catalog.md) · [CLI](agents/cli.md) · [CI / recipes](agents/ci.md)

---

## First principles

1. Run all `just` recipes from **`docs/`** (not the repo root).
2. Generated trees are produced by recipes — edit generators/`config.yaml`/authored
   sources, then regenerate.
3. Prefer `just` over raw `npm run` in `site/`. Production publish is CI → Pages
   artifact.
4. **Node 20** (devbox). Broken links fail the build (`onBrokenLinks: 'throw'`).
5. Scope edits to `docs/` unless the user asks otherwise.

## Layout

| Path | Role |
| --- | --- |
| `source/` | Authored MD/MDX + `config.yaml` |
| `source/cli/index.mdx`, `source/cli/_category_.json` | Authored CLI landing |
| `source/cli/<minor>/` | Generated (gitignored) |
| `source/applications/`, `catalog-data.json` | Generated (gitignored) |
| `site/` | Docusaurus app |
| `site/src/data/` | Generated from `config.yaml` at prepare (gitignored) |
| `site/static/cli/` | Generated `commands.json` per minor (gitignored) |
| `source/schemas/v1/` | Authored JSON Schemas (canonical) |
| `site/static/schemas/v1/` | Prepare-time copy of schemas (gitignored) |
| `site/static/catalog-icons/` | Generated (gitignored) |
| `scripts/` | `resolve-nkp-releases`, `fetch-catalog-sources`, `generate-cli-docs`, `sync-docs-data`, `docs-config`, `build-exports` |
| `site/scripts/generate-catalog.js` | Catalog crawler |
| `agents/` | Topic playbooks for agents |

## Recipes (from `docs/`)

| Recipe | Purpose |
| --- | --- |
| `just clean` | Delete generated/build artifacts |
| `just resolve-nkp-releases` | Probe downloads.d2iq.com from floor → `.cache/nkp-releases.json` |
| `just fetch-catalog-sources` | Platform git refs + OCI full artifacts (needs `oras`) |
| `just generate-catalog` | Sibling / fetched sources → applications + catalog-data + icons |
| `just generate-cli-docs` | Resolved tags → `source/cli/<minor>/` + static commands.json |
| `just update-docs-config` | Alias of `resolve-nkp-releases` |
| `just docs-preview` | Generate + prepare + build/serve (skips Chrome/PDF) |
| `just docs-local` | Same + PDF/HTML export (needs Chrome) |
| `just docs-build` | CI-style production build with export |

Siblings: clone repos listed in `source/config.yaml` → `catalogs[].id` next to
this repo; Platform sources are fetched into additional sibling dirs.

## Config

Human-edited: [`source/config.yaml`](source/config.yaml) — NKP floor / GA ceiling,
CLI download URL + defaultMinor, site identity, portal URLs, catalog list
(including Platform `platformHybrid`). Patch tags are **not** committed.

- `site` — Docusaurus title/org/repo/portal URLs
- `catalogs` — crawled repos / Platform hybrid source
- `applications` — `nkpVersionFloor` (probe start) + `maxGaNkpVersion`
- `cliDocs` — `downloadUrl`, `defaultMinor`; optional minor overlays only

Prepare (`just _docs-prepare` → `scripts/sync-docs-data.mjs`) writes
`site/src/data/{nkp-version-config,catalogs,site-config,cli-versions,portal-version}.json`
from `config.yaml` via `scripts/docs-config.cjs`. Commit `config.yaml` only; scripts
and site components read synced JSON or `docs-config.cjs`.

### Dev-only pages

Hide authored pages from the sidebar until a query flag is set:

```yaml
dev: true
sidebar_custom_props:
  dev: true
```

Open any docs URL with `?dev=true` or `?unlisted=true` (sticky for the tab via
`sessionStorage`). `?dev=false` clears it. Direct URLs always work.

## Generated artifacts

Regenerate rather than editing: `source/applications/**`, `catalog-data.json`,
`source/cli/<minor>/**`, `site/static/cli/`, `site/static/catalog-icons/`,
`site/static/schemas/v1/`, `site/src/data/*.json`.
