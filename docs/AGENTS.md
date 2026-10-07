# AGENTS.md — NKP Catalog docs site

Guidance for agents working in **`docs/`**. Docusaurus 3 site for the NKP
Catalog (partner + Nutanix product + AI application catalogs).

Live: https://nutanix-cloud-native.github.io/nkp-partner-catalog/
(`baseUrl` `/nkp-partner-catalog/`)

---

## First principles

1. Run all `just` recipes from **`docs/`** (not the repo root).
2. Generated trees are produced by recipes — edit generators/`config.yaml`/authored
   sources, then regenerate.
3. Prefer `just` over raw `npm run` in `site/`. Production publish is CI → Pages
   artifact.
4. **Node 20** (devbox). Broken links fail the build (`onBrokenLinks: 'throw'`).
5. Scope edits to `docs/` unless the user asks otherwise.
6. Devbox packages for generate/fetch: `oras`, `kubernetes-helm`, `kubectl`
   (see `devbox.json`). Chart-value merges need `helm`/`kubectl` on PATH.

## Layout

| Path | Role |
| --- | --- |
| `source/` | Authored MD/MDX + `config.yaml` |
| `source/templates/` | Authored templates synced at prepare (e.g. airgapped bundle steps) |
| `source/cli/index.mdx`, `source/cli/_category_.json` | Authored CLI landing |
| `source/cli/<minor>/` | Generated (gitignored) |
| `source/applications/`, `catalog-data.json` | Generated (gitignored) |
| `site/` | Docusaurus app |
| `site/src/data/` | Generated from `config.yaml` at prepare (gitignored) |
| `site/src/search/` | Local-search ordering plugin (prefer newer versioned paths) |
| `site/static/cli/` | Generated `commands.json` per minor (gitignored) |
| `source/schemas/v1/` | Authored JSON Schemas (canonical) |
| `site/static/schemas/v1/` | Prepare-time copy of schemas (gitignored) |
| `site/static/catalog-icons/` | Generated (gitignored) |
| `scripts/` | `resolve-nkp-releases`, `fetch-catalog-sources`, `generate-cli-docs`, `sync-docs-data`, `docs-config`, `build-exports` |
| `site/scripts/generate-catalog.js` | Catalog crawler |
| `site/scripts/merge-app-values.js` | Helm chart ⊕ ConfigMap values merge (when `configDefaults`) |
| `.cache/` | Local caches (nkp CLI, releases, helm charts, …) — gitignored |
| `.preview/` | UX HTML mockups — gitignored |

## Recipes (from `docs/`)

| Recipe | Purpose |
| --- | --- |
| `just clean` | Delete generated/build artifacts |
| `just resolve-nkp-releases` | Probe downloads.d2iq.com from floor → `.cache/nkp-releases.json` |
| `just fetch-catalog-sources` | Platform git refs + OCI full artifacts (needs `oras`) |
| `just generate-catalog` | Sibling / fetched sources → applications + catalog-data + icons; with `configDefaults`, merges chart values via `helm`/`kubectl` |
| `just generate-cli-docs` | Resolved tags → `source/cli/<minor>/` + static commands.json |
| `just update-docs-config` | Alias of `resolve-nkp-releases` |
| `just docs-preview` | Generate + prepare + build/serve (skips Chrome/PDF) |
| `just docs-local` | Same + PDF/HTML export (needs Chrome) |
| `just docs-build` | CI-style production build with export |

Siblings: clone repos listed in `source/config.yaml` → `catalogs[].id` next to
this repo; Platform sources are fetched into additional sibling dirs.

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

## Config

Human-edited: [`source/config.yaml`](source/config.yaml) — NKP floor / GA ceiling,
CLI download URL + defaultMinor, site identity, portal URLs, catalog list
(including Platform `platformHybrid`). Patch tags are **not** committed.

- `site` — Docusaurus title/org/repo/portal URLs
- `catalogs` — crawled repos / Platform hybrid source; optional per-catalog flags
  (default `false`):
  - `configDefaults: true` — crawl merged Helm values → Default configuration UI
  - `airgappedBundle: true` — Install callout + airgapped bundle modal on app detail
- `applications` — `nkpVersionFloor` (probe start) + `maxGaNkpVersion`
- `cliDocs` — `downloadUrl`, `defaultMinor`; optional minor overlays only

No committed `knownNkpVersions` / patch pins. Tags come from
`.cache/nkp-releases.json` (`just resolve-nkp-releases`); Platform expansion
skips minors below `applications.nkpVersionFloor`.

### Prepare / synced JSON

`just _docs-prepare` → `scripts/sync-docs-data.mjs` writes (gitignored):

`site/src/data/{nkp-version-config,catalogs,site-config,cli-versions,portal-version,catalog-airgapped-bundle}.json`

from `config.yaml` (+ `source/templates/catalog-airgapped-bundle.yaml`) via
`scripts/docs-config.cjs`. Commit `config.yaml` and templates only; scripts and
site components read synced JSON or `docs-config.cjs`.

Also: rsync schemas; copy `catalog-data.json` when present; `npm ci` in `site/`.

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

Do not commit `.cache/` (includes pulled Helm charts used for value merges).

---

## Catalog browser

### Generator

`just resolve-nkp-releases` → `just fetch-catalog-sources` →
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

### Default configuration merge (`configDefaults`)

`site/scripts/merge-app-values.js` (from `generate-catalog.js`):

1. Resolve `helmrelease/` (or version-root) kustomization; follow Flux
   `Kustomization` → `kubectl kustomize` when needed.
2. Select HelmRelease(s); primary = `metadata.name` equals app name.
3. `helm pull` OCI chart (cached under `docs/.cache/helm-charts/`) → chart
   `values.yaml`.
4. Overlay ConfigMap `data.values.yaml` from `valuesFrom` (comment-preserving
   deep merge via `yaml` package).

**Empty ConfigMap `values.yaml`:** panel appears only if chart pull succeeds.
Private registries without credentials still fail (WARN in generate logs).

UI (`AppDetailPage` + `YamlCodePanel`):

- VS Code–style tab bar for multi-HelmRelease panels.
- Override-ConfigMap hint only when **multiple** HRs **and** the active tab is
  non-primary **and** that panel lists override ConfigMaps.
- Listing JSON strips `defaultValuesPanels` / `defaultValuesYaml`; detail
  payloads keep them.

### Airgapped bundle (`airgappedBundle`)

- Authored steps: `source/templates/catalog-airgapped-bundle.yaml`
  (`{{name}}`-style vars).
- Prepare → `site/src/data/catalog-airgapped-bundle.json`.
- Detail: Install row in the meta card → **Build airgapped bundle** opens
  `AirgappedBundleModal` (commands filled for selected version).

### UI

- Listing: `AppCatalog` fetches `/catalog-data.json`.
  - Card footer: NKP range + **scope** chips (`scopeLabel` → Workspace / Cluster /
    Project; raw metadata stays lowercase); cert/partner chips in the meta row.
  - Detail still shows Scope in the meta grid (same labels).
- Detail: `AppDetailPage`; GitHub link uses per-version `catalogRepo` + `ref`
  (omitted for OCI-backed Platform versions).
- Overview / Getting started markdown: external `http(s)` / `mailto` links open
  in a new tab (`marked` renderer + DOMPurify `ADD_ATTR: ['target']`).
- Card NKP label = `nkpCardRange`; filter matches any `versionNkp` range.

### Search

`site/src/search/versionedSearchOrderPlugin.js` (wired in `docusaurus.config.js`)
reorders local-search hits so newer `major.minor` path versions (CLI,
ai-conformance, …) rank above older copies of the same page.

---

## CLI reference

### Authored vs generated

| Authored (commit) | Generated (gitignored / regenerate) |
| --- | --- |
| `source/cli/index.mdx` | `source/cli/<minor>/**` (MD pages) |
| `source/cli/_category_.json` | `site/static/cli/<minor>/commands.json` |
| `source/config.yaml` → `cliDocs` | `site/src/data/cli-versions.json` (prepare / sync) |

### Generator

`just resolve-nkp-releases` then `just generate-cli-docs`

- Resolves minors/patches from `cliDocs.nkpVersionFloor` (default `2.12`) upward
  via shared `.cache/nkp-releases.json` (Platform/catalog still start at
  `applications.nkpVersionFloor`).
- Downloads each resolved `latest` via `cliDocs.downloadUrl`.
- Minors above `maxGaNkpVersion` or with `-dev` tags are `unlisted` by default
  (label `{minor} (dev)`). Optional `cliDocs.minors[]` overlays for exceptions.
- Writes versioned pages under `source/cli/<minor>/` and `commands.json`
  (gitignored).

`just update-docs-config` is an alias of `resolve-nkp-releases` (does **not**
rewrite `config.yaml`).

### UX

- Shared left nav: single **CLI** doc link; generated pages use `displayed_sidebar`.
- Landing: `CliLanding` + tree; version pills via `NkpVersionSwitch`.
- Public pills ≈ GA minors ≤ `maxGaNkpVersion`; Older menu / URL for unlisted.
- Local search prefers newer `cli/<minor>/…` hits (see Search above).

### Support window

Edit `cliDocs.nkpVersionFloor`, `applications.nkpVersionFloor`, `maxGaNkpVersion`,
and `cliDocs.defaultMinor` in `source/config.yaml`. Do not commit per-minor
`latest` tags.

---

## CI and local tooling

### Devbox

| Package | Used for |
| --- | --- |
| `nodejs` (20) | site + generators |
| `just` | recipes |
| `oras` | Platform OCI fetch |
| `kubernetes-helm` | `helm pull` for `configDefaults` merges |
| `kubectl` | `kubectl kustomize` in merge path |
| `chromium` | PDF/HTML export (Linux CI / `docs-local`) |

Missing `helm` in CI shows as `helm exit null` / empty Default configuration for
apps with empty ConfigMap values (e.g. cloudcasa-agent).

### CI workflow

`.github/workflows/deploy-docs.yaml`:

1. Check out partner + AI + Nutanix siblings
2. Install Nix + `devbox` for `docs/`
3. `devbox run -- just docs-build` (resolve → fetch Platform → generate →
   prepare → export → build)
4. `upload-pages-artifact` → `deploy-pages`

Needs network for downloads.d2iq.com, ghcr.io, and other public chart registries.

### Caches (gitignored)

Under `docs/.cache/` (entire tree ignored via `.cache`):

- `nkp-releases.json`, `nkp-cli/`, `bin/` — release probe / CLI binaries
- `helm-charts/` — OCI charts pulled during `generate-catalog` value merges

### Export

`scripts/build-exports.mjs` → `site/static/offline/` (Chrome). Skips generated
application shells and per-version CLI dumps.
