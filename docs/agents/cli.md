# CLI reference (agents)

## Authored vs generated

| Authored (commit) | Generated (gitignored / regenerate) |
| --- | --- |
| `source/cli/index.mdx` | `source/cli/<minor>/**` (MD pages) |
| `source/cli/_category_.json` | `site/static/cli/<minor>/commands.json` |
| `source/config.yaml` → `cliDocs` | `site/src/data/cli-versions.json` (prepare / sync-docs-data) |

## Generator

`just generate-cli-docs` → `scripts/generate-cli-docs.mjs`

- Downloads `https://downloads.d2iq.com/dkp/v<tag>/nkp_v<tag>_<os>_amd64.tar.gz`
- Runs `nkp help --output markdown --tree`
- Writes versioned pages under `source/cli/<minor>/` and `commands.json` under
  `site/static/cli/<minor>/` (both gitignored; produced before every docs build).
- Refreshes `site/src/data/*` via `sync-docs-data.mjs` (same as prepare).

`just update-docs-config` probes downloads and rewrites `cliDocs.minors[].latest`
(best-effort). Prefers GA over `-dev`. Does not add minors or bump `maxGaNkpVersion`.

## UX (locked preferences)

- Shared left nav: single **CLI** doc link; generated pages use `displayed_sidebar`.
- Landing: `CliLanding` + tree (`CliCommandBrowser`); expand/collapse preference in sessionStorage.
- Version: shared `NkpVersionSwitch` (pills + Older). Applications may include “All”; CLI does not.
- Breadcrumbs on generated pages: **CLI** → `/docs/cli/` then `nkp › …` command path.
- Parent hubs: description + Available commands only.
- Leaves: Options (`dl.cli-opts`) → Usage → Examples → Parent command.
- Public pills ≈ current GA + ~2 prior; older minors `unlisted: true` (Older menu).

## Support window

Edit `cliDocs` in `source/config.yaml`. Mark pre-GA with `unlisted` / `label`.
Default minor should be the public default GA (or labeled `(dev)` while on `*-dev`).
