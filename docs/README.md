# Docs in `nkp-partner-catalog`

Docusaurus 3 site for the NKP Catalog. Authored content lives in `source/`;
the app lives in `site/`. Run recipes from **`docs/`**.

Live: https://nutanix-cloud-native.github.io/nkp-partner-catalog/

## Layout

- `source/` — authored MD/MDX and `config.yaml` (`catalogs` + `applications` + `cliDocs`)
- `source/cli/` — authored landing; `source/cli/<minor>/` is **generated** (gitignored)
- `source/schemas/v1/` — authored JSON Schemas (canonical; prepare copies to `site/static/schemas/v1/`)
- `source/applications/`, `catalog-data.json`, `site/static/catalog-icons/` — **generated** (gitignored)
- `site/src/data/` — **generated** from `config.yaml` at prepare (gitignored)
- `site/static/cli/` — **generated** `commands.json` (gitignored)
- `scripts/` — CLI generator, config probe, `sync-docs-data`, offline PDF/HTML export
- `AGENTS.md` + `agents/` — guidance for coding agents

## Local commands

From `docs/`:

- `just clean` — remove generated/build artifacts
- `just generate-catalog` — crawl public sibling catalog repos → applications + icons + catalog-data
- `just resolve-nkp-releases` — probe downloads.d2iq.com from `nkpVersionFloor` → `.cache/nkp-releases.json`
- `just fetch-catalog-sources` — Platform git + OCI sources (needs `oras`)
- `just update-docs-config` — alias of `resolve-nkp-releases` (does not rewrite config.yaml)
- `just generate-cli-docs` — download nkp CLIs → versioned CLI pages + commands.json
- `just docs-preview` — generate + prepare + build/serve (**skips** Chrome/PDF)
- `just docs-local` — full local preview including Export PDF/HTML (needs Chrome)
- `just docs-build` — production build (`/nkp-partner-catalog/`) including Export
- `just docs-offline` — PDF + HTML only

Sibling clones (public) next to this repo — see `source/config.yaml` → `catalogs[]`:

- `nkp-ai-applications-catalog`
- `nkp-nutanix-product-catalog`

Typical loop:

```bash
cd docs
just clean
just docs-preview    # runs generate-catalog + generate-cli-docs first
```

## Notes

- Offline Export needs Chrome/Chromium (`CHROME_PATH` override supported).
- Local search from `docusaurus start` is limited; prefer `docs-preview` / `serve` of a build.
- Production publish is CI → GitHub Pages artifact.
