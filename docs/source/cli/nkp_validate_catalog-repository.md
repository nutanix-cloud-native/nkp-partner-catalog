---
title: nkp validate catalog-repository
sidebar_position: 0

slug: cli/nkp-validate-catalog-repository
---


<div class="cli-doc-ref" aria-hidden="true"></div>

## nkp validate catalog-repository

Validate the given catalog repository contents

```bash
nkp validate catalog-repository [flags]
```

### Options

```bash
      --apps strings      Applications to validate (name=version). Accepts comma-separated values or can be repeated. When omitted, all applications are validated.
      --config string     Path to the catalog validation config file
  -h, --help              help for catalog-repository
      --repo-dir string   Path to the catalog repository. (default to current working directory)
```

### Options inherited from parent commands

```bash
  -v, --verbose int   Output verbosity
```

### SEE ALSO

* [nkp validate](nkp_validate.md)   - Validate one of [catalog-repository]
:::tip Live help
Run `nkp <command> --help` in your terminal for the latest options and flags.
:::
