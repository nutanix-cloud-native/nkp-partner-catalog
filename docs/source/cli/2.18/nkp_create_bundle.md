---
title: nkp create bundle
sidebar_label: nkp create bundle
sidebar_position: 10
cli_generated: true
unlisted: true
hide_table_of_contents: true
displayed_sidebar: tutorialSidebar
nkp_minor: 2.18
nkp_patch: 2.18.0
nkp_command_id: nkp_create_bundle
nkp_command_kind: leaf
---

<div class="cli-doc-ref" aria-hidden="true"></div>

Create a bundle containing container images and/or Helm charts

### Options

<dl class="cli-opts">
<dt><code>--all-platforms</code></dt>
<dd>Download images for all platforms specified in the image manifests</dd>
<dt><code>--helm-charts-file</code> <span class="cli-opt__type">string</span></dt>
<dd>YAML file containing configuration of Helm charts to create bundle from</dd>
<dt><code>-h</code>, <code>--help</code></dt>
<dd>help for bundle</dd>
<dt><code>--image-pull-concurrency</code> <span class="cli-opt__type">int</span> <span class="cli-opt__default">default <code>1</code></span></dt>
<dd>Image pull concurrency</dd>
<dt><code>--images-file</code> <span class="cli-opt__type">string</span></dt>
<dd>File containing list of images to create bundle from, either as YAML configuration or a simple list of images</dd>
<dt><code>--merge</code></dt>
<dd>Merge new images into existing bundle file if it already exists</dd>
<dt><code>--oci-artifacts-file</code> <span class="cli-opt__type">string</span></dt>
<dd>File containing list of oci artifacts to create bundle from, either as YAML configuration or a simple list of images</dd>
<dt><code>--output-file</code> <span class="cli-opt__type">string</span> <span class="cli-opt__default">default <code>bundle.tar</code></span></dt>
<dd>Output file to write bundle to</dd>
<dt><code>--overwrite</code></dt>
<dd>Overwrite bundle file if it already exists</dd>
<dt><code>--platform</code> <span class="cli-opt__default">default <code>&#91;linux/amd64&#93;</code></span></dt>
<dd>platformSlice platforms to download images for (required format: &lt;os&gt;/&lt;arch&gt;&#91;/&lt;variant&gt;&#93;)</dd>
<dt><code>-v</code>, <code>--verbose</code> <span class="cli-opt__type">int</span></dt>
<dd>Output verbosity</dd>
</dl>

### Usage

```bash
nkp create bundle [flags]
```

### Parent command

* [nkp create](nkp_create.md) — Create one of \[appdeployment, bootstrap, bundle, capi-components, catalog-application, catalog-bundle, cluster, image, image-bundle, metadata, nodepool, package-bundle, project, workspace\]
