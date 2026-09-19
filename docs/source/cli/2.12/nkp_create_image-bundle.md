---
title: nkp create image-bundle
sidebar_label: nkp create image-bundle
sidebar_position: 10
cli_generated: true
unlisted: true
hide_table_of_contents: true
displayed_sidebar: tutorialSidebar
nkp_minor: 2.12
nkp_patch: 2.12.2
nkp_command_id: nkp_create_image-bundle
nkp_command_kind: leaf
---

<div class="cli-doc-ref" aria-hidden="true"></div>

Create an image bundle

### Options

<dl class="cli-opts">
<dt><code>-h</code>, <code>--help</code></dt>
<dd>help for image-bundle</dd>
<dt><code>--image-pull-concurrency</code> <span class="cli-opt__type">int</span> <span class="cli-opt__default">default <code>1</code></span></dt>
<dd>Image pull concurrency</dd>
<dt><code>--images-file</code> <span class="cli-opt__type">string</span></dt>
<dd>File containing list of images to create bundle from, either as YAML configuration or a simple list of images</dd>
<dt><code>--output-file</code> <span class="cli-opt__type">string</span> <span class="cli-opt__default">default <code>images.tar</code></span></dt>
<dd>Output file to write image bundle to</dd>
<dt><code>--overwrite</code></dt>
<dd>Overwrite image bundle file if it already exists</dd>
<dt><code>--platform</code> <span class="cli-opt__default">default <code>&#91;linux/amd64&#93;</code></span></dt>
<dd>platformSlice platforms to download images (required format: &lt;os&gt;/&lt;arch&gt;&#91;/&lt;variant&gt;&#93;)</dd>
<dt><code>-v</code>, <code>--verbose</code> <span class="cli-opt__type">int</span></dt>
<dd>Output verbosity</dd>
</dl>

### Usage

```bash
nkp create image-bundle [flags]
```

### Parent command

* [nkp create](nkp_create.md) — Create one of \[appdeployment, bootstrap, capi-components, catalog, chart-bundle, cluster, image, image-bundle, nodepool, package-bundle, workspace\]
