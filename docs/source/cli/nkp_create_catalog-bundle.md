---
title: nkp create catalog-bundle
sidebar_position: 0

slug: cli/nkp-create-catalog-bundle
---


<div class="cli-doc-ref" aria-hidden="true"></div>

## nkp create catalog-bundle

Bundle up the catalog application(s) including container images & any OCI artifacts

```bash
nkp create catalog-bundle [flags]
```

### Options

```bash
      --airgapped                    Create an airgapped bundle that includes container images and OCI artifacts
      --apps strings                 Applications to include (name=version). Accepts comma-separated values or can be repeated
      --collection-tag string        Tag to assign to the catalog collection. Required when bundling multiple applications.
      --constraint strings           Constraints to filter the applications that are selected (e.g., nkpVersion=2.16)
  -h, --help                         help for catalog-bundle
      --image-pull-concurrency int   Image pull concurrency (default 1)
  -o, --output-file string           Path to the output file for the generated bundle
      --platform platformSlice       platforms to download images for (required format: <os>/<arch>[/<variant>]) (default [linux/amd64])
      --repo-dir string              Path to the catalog repository in which to generate the files. (default to current working directory)
```

### Options inherited from parent commands

```bash
  -v, --verbose int   Output verbosity
```

### SEE ALSO

* [nkp create](nkp_create.md)   - Create one of [catalog-bundle]
:::tip Live help
Run `nkp <command> --help` in your terminal for the latest options and flags.
:::
