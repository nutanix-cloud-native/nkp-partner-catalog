---
title: nkp create package-bundle
sidebar_label: nkp create package-bundle
sidebar_position: 10
cli_generated: true
unlisted: true
hide_table_of_contents: true
displayed_sidebar: tutorialSidebar
nkp_minor: 2.17
nkp_patch: 2.17.1
nkp_command_id: nkp_create_package-bundle
nkp_command_kind: leaf
---

<div class="cli-doc-ref" aria-hidden="true"></div>

Create Operating System package bundle for one of [oracle-8.9, oracle-9.4, rhel-8.10, rhel-9.6, rocky-9.6, ubuntu-22.04, ubuntu-24.04]

### Options

<dl class="cli-opts">
<dt><code>--artifacts-directory</code> <span class="cli-opt__type">string</span></dt>
<dd>Path to a directory for storing OS package bundles. The directory must already exist.</dd>
<dt><code>--container-image</code> <span class="cli-opt__type">string</span></dt>
<dd>A container image to use for building the package bundles</dd>
<dt><code>--fips</code></dt>
<dd>Creats FIPS compliant packages</dd>
<dt><code>-h</code>, <code>--help</code></dt>
<dd>help for package-bundle</dd>
<dt><code>--kubernetes-version</code> <span class="cli-opt__type">string</span> <span class="cli-opt__default">default <code>1.34.3</code></span></dt>
<dd>Kubernetes version used to build packages</dd>
<dt><code>-v</code>, <code>--verbose</code> <span class="cli-opt__type">int</span></dt>
<dd>Output verbosity</dd>
</dl>

### Usage

```bash
nkp create package-bundle OSName [flags]
```

### Parent command

* [nkp create](nkp_create.md) — Create one of \[appdeployment, bootstrap, bundle, capi-components, catalog, catalog-application, catalog-bundle, catalog-collection-artifact, cluster, image, image-bundle, metadata, nodepool, package-b
