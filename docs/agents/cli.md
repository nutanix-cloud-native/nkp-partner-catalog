# CLI reference (agents)

## Authored vs generated

| Authored (commit) | Generated (gitignored / regenerate) |
| --- | --- |
| `source/cli/index.mdx` | `source/cli/<minor>/**` (MD pages) |
| `source/cli/_category_.json` | `site/static/cli/<minor>/commands.json` |
| `source/config.yaml` → `cliDocs` | `site/src/data/cli-versions.json` (prepare / sync) |

## Generator

`just resolve-nkp-releases` then `just generate-cli-docs`

- Resolves minors/patches from `cliDocs.nkpVersionFloor` (default `2.12`) upward
  via shared `.cache/nkp-releases.json` (Platform/catalog still start at
  `applications.nkpVersionFloor`, currently `2.16`).
- Downloads each resolved `latest` via `cliDocs.downloadUrl`.
- Minors above `maxGaNkpVersion` or with `-dev` tags are `unlisted` by default
  (label `{minor} (dev)`). Optional `cliDocs.minors[]` overlays for exceptions.
- Writes versioned pages under `source/cli/<minor>/` and `commands.json`
  (gitignored).

`just update-docs-config` is an alias of `resolve-nkp-releases` (does **not**
rewrite `config.yaml`).

## UX

- Shared left nav: single **CLI** doc link; generated pages use `displayed_sidebar`.
- Landing: `CliLanding` + tree; version pills via `NkpVersionSwitch`.
- Public pills ≈ GA minors ≤ `maxGaNkpVersion`; Older menu / URL for unlisted.

## Support window

Edit `cliDocs.nkpVersionFloor`, `applications.nkpVersionFloor`, `maxGaNkpVersion`,
and `cliDocs.defaultMinor` in `source/config.yaml`. Do not commit per-minor
`latest` tags.
