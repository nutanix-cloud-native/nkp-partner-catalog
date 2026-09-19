---
title: nkp create catalog-bundle
sidebar_label: nkp create catalog-bundle
sidebar_position: 10
cli_generated: true
unlisted: true
hide_table_of_contents: true
displayed_sidebar: tutorialSidebar
nkp_minor: 2.19
nkp_patch: 2.19.0-dev
nkp_command_id: nkp_create_catalog-bundle
nkp_command_kind: leaf
---

<div class="cli-doc-ref" aria-hidden="true"></div>

Bundle up the catalog application(s) including container images & any OCI artifacts

### Options

<dl class="cli-opts">
<dt><code>--airgapped</code></dt>
<dd>Create an airgapped bundle that includes container images and OCI artifacts</dd>
<dt><code>--apps</code> <span class="cli-opt__type">strings</span></dt>
<dd>Applications to include (name=version). Accepts comma-separated values or can be repeated</dd>
<dt><code>--collection-tag</code> <span class="cli-opt__type">string</span></dt>
<dd>Tag to assign to the catalog collection. Required when bundling multiple applications.</dd>
<dt><code>--constraint</code> <span class="cli-opt__type">strings</span></dt>
<dd>Constraints to filter the applications that are selected (e.g., nkpVersion=2.16)</dd>
<dt><code>-h</code>, <code>--help</code></dt>
<dd>help for catalog-bundle</dd>
<dt><code>--image-pull-concurrency</code> <span class="cli-opt__type">int</span> <span class="cli-opt__default">default <code>1</code></span></dt>
<dd>Image pull concurrency</dd>
<dt><code>-o</code>, <code>--output-file</code> <span class="cli-opt__type">string</span></dt>
<dd>Path to the output file for the generated bundle</dd>
<dt><code>--platform</code> <span class="cli-opt__default">default <code>&#91;linux/amd64&#93;</code></span></dt>
<dd>platformSlice platforms to download images for (required format: &lt;os&gt;/&lt;arch&gt;&#91;/&lt;variant&gt;&#93;)</dd>
<dt><code>--repo-dir</code> <span class="cli-opt__type">string</span> <span class="cli-opt__default">default <code>to current working directory</code></span></dt>
<dd>Path to the catalog repository in which to generate the files.</dd>
<dt><code>-v</code>, <code>--verbose</code> <span class="cli-opt__type">int</span></dt>
<dd>Output verbosity</dd>
</dl>

### Usage

```bash
nkp create catalog-bundle [flags]
```

### Parent command

* [nkp create](nkp_create.md) — Create one of \[appdeployment, bootstrap, bootstrap-token, bundle, capi-components, catalog-app, catalog-bundle, cluster, image, image-bundle, metadata, nodepool, package-bundle, project, resource, wor
