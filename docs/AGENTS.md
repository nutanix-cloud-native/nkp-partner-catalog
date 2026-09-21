# AGENTS.md — NKP Catalog docs site

Guidance for agents working in **`docs/` only**. Docusaurus 3 site for the NKP
Catalog (partner + Nutanix product + AI application catalogs).

Live: https://nutanix-cloud-native.github.io/nkp-partner-catalog/
(`baseUrl` `/nkp-partner-catalog/`)

Deep dives: [catalog](agents/catalog.md) · [CLI](agents/cli.md) · [CI / recipes](agents/ci.md)

---

## First principles

1. Run all `just` recipes from **`docs/`**, not the repo root.
2. **Never hand-edit generated output.** Catalog pages, CLI version trees, icons,
   and export/PDF are produced by generators (see below).
3. Prefer `just` over raw `npm run` in `site/`. Do **not** use a local
   `gh-pages` push; production publish is CI → Pages artifact.
4. **Node 20** (devbox). Broken links fail the build (`onBrokenLinks: 'throw'`).
5. Edit only under `docs/` unless the user explicitly asks otherwise.

## Layout

| Path | Role |
| --- | --- |
| `source/` | Authored MD/MDX + `config.yaml` |
| `source/cli/index.mdx`, `source/cli/_category_.json` | Authored CLI landing |
| `source/cli/<minor>/` | **Generated** (gitignored) |
| `source/applications/`, `catalog-data.json` | **Generated** (gitignored) |
| `site/` | Docusaurus app |
| `site/src/data/` | **Generated** from `config.yaml` at prepare (gitignored) |
| `site/static/cli/` | **Generated** `commands.json` per minor (gitignored) |
| `source/schemas/v1/` | Authored JSON Schemas (canonical) |
| `site/static/schemas/v1/` | **Copy** of schemas at prepare (gitignored) |
| `site/static/catalog-icons/` | Generated (gitignored) |
| `scripts/` | `generate-cli-docs`, `update-docs-config`, `sync-docs-data`, `build-exports` |
| `site/scripts/generate-catalog.js` | Catalog crawler |
| `agents/` | Topic playbooks for agents |

## Recipes (from `docs/`)

| Recipe | Purpose |
| --- | --- |
| `just clean` | Delete generated/build artifacts |
| `just generate-catalog` | Sibling repos → applications + catalog-data + icons |
| `just generate-cli-docs` | downloads.d2iq.com → `source/cli/<minor>/` + static commands.json |
| `just update-docs-config` | Best-effort refresh of `cliDocs.minors[].latest` |
| `just docs-preview` | Generate + prepare + build/serve (**no** Chrome/PDF) |
| `just docs-local` | Same + PDF/HTML export (needs Chrome) |
| `just docs-build` | CI-style production build with export |

Siblings (public): clone `nkp-ai-applications-catalog` and
`nkp-nutanix-product-catalog` next to this repo (see `justfile` `sibling_root`).

## Config

Human-edited: [`source/config.yaml`](source/config.yaml) — **only** place for NKP
version floors, GA ceiling, known minors, CLI minors, and portal version.

- `applications` — NKP filter floor / max GA / known minors
- `cliDocs` — which CLI minors to generate; `unlisted` hides from pills (Older menu)

Prepare (`just _docs-prepare` → `scripts/sync-docs-data.mjs`) writes
`site/src/data/{nkp-version-config,cli-versions,portal-version}.json` from
`config.yaml` via `scripts/docs-config.cjs`. Do not commit or hand-edit those
files. Do not hardcode NKP versions in scripts or site components — read synced
JSON or `docs-config.cjs`.

Keep top-level `docs/` with inner `site/` (Docusaurus app) and `source/`
(content). Do not rename for rename’s sake.

### Dev-only pages

Authored pages can be hidden from the sidebar until a query flag is set:

```yaml
dev: true
sidebar_custom_props:
  dev: true
```

Open any docs URL with `?dev=true` or `?unlisted=true` (sticky for the tab via
`sessionStorage`). `?dev=false` clears it. Direct URLs always work; there is no
`/dev` path prefix.

## Must nots

- Do not commit generated `source/applications/**`, `catalog-data.json`,
  `source/cli/<minor>/**`, `site/static/cli/`, `site/static/catalog-icons/`,
  `site/static/schemas/v1/`, or `site/src/data/*.json`.
- Do not edit sibling catalog repos’ `metadata.yaml` from this worktree.
- Do not push `gh-pages` or use removed `npm run deploy`.
- Do not invent AI conformance / portal content.
