---
title: nkp create package-bundle
sidebar_label: nkp create package-bundle
sidebar_position: 10
cli_generated: true
unlisted: true
hide_table_of_contents: true
displayed_sidebar: tutorialSidebar
nkp_minor: 2.19
nkp_patch: 2.19.0-dev
nkp_command_id: nkp_create_package-bundle
nkp_command_kind: leaf
---

<div class="cli-doc-ref" aria-hidden="true"></div>

Create Operating System package bundle for one of [oracle-8.9, oracle-9.4, rhel-8.10, rhel-9.6, rhel-9.8, rocky-9.8, ubuntu-22.04, ubuntu-24.04]

### Options

<dl class="cli-opts">
<dt><code>--artifacts-directory</code> <span class="cli-opt__type">string</span></dt>
<dd>Path to a directory for storing OS package bundles. The directory must already exist.</dd>
<dt><code>--container-image</code> <span class="cli-opt__type">string</span></dt>
<dd>A container image to use for building the package bundles</dd>
<dt><code>--fips</code></dt>
<dd>Creats FIPS compliant packages</dd>
<dt><code>--from-directory</code> <span class="cli-opt__type">string</span></dt>
<dd>Build using the scripts and configuration files in this directory instead of the embedded defaults. Typically the files are first produced and customized via --output-directory. The directory must already exist. Mutually exclusive with --output-directory.</dd>
<dt><code>-h</code>, <code>--help</code></dt>
<dd>help for package-bundle</dd>
<dt><code>--kubernetes-version</code> <span class="cli-opt__type">string</span> <span class="cli-opt__default">default <code>1.36.2</code></span></dt>
<dd>Kubernetes version used to build packages</dd>
<dt><code>--output-directory</code> <span class="cli-opt__type">string</span></dt>
<dd>Extract the scripts and configuration files used for the build into this directory and exit without building. Review and customize the extracted files, then pass the same directory to --from-directory on a later run to build from your customized files. The directory must already exist. Mutually exclusive with --from-directory.</dd>
<dt><code>-v</code>, <code>--verbose</code> <span class="cli-opt__type">int</span></dt>
<dd>Output verbosity</dd>
</dl>

### Usage

```bash
nkp create package-bundle OSName [flags]
```

### Parent command

* [nkp create](nkp_create.md) — Create one of \[appdeployment, bootstrap, bootstrap-token, bundle, capi-components, catalog-app, catalog-bundle, cluster, image, image-bundle, metadata, nodepool, package-bundle, project, resource, wor
