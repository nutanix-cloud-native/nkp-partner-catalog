---
title: nkp import image-bundle
sidebar_label: nkp import image-bundle
sidebar_position: 10
cli_generated: true
unlisted: true
hide_table_of_contents: true
displayed_sidebar: tutorialSidebar
nkp_minor: 2.15
nkp_patch: 2.15.2
nkp_command_id: nkp_import_image-bundle
nkp_command_kind: leaf
---

<div class="cli-doc-ref" aria-hidden="true"></div>

Import images from image bundles into Containerd

### Options

<dl class="cli-opts">
<dt><code>--containerd-namespace</code> <span class="cli-opt__type">string</span> <span class="cli-opt__default">default <code>k8s.io</code></span></dt>
<dd>Containerd namespace to import images into</dd>
<dt><code>-h</code>, <code>--help</code></dt>
<dd>help for image-bundle</dd>
<dt><code>--image-bundle</code> <span class="cli-opt__type">strings</span> <span class="cli-opt__default">default <code>&#91;&#93;</code></span></dt>
<dd>Tarball containing list of images to import. Can also be a glob pattern.</dd>
<dt><code>-v</code>, <code>--verbose</code> <span class="cli-opt__type">int</span></dt>
<dd>Output verbosity</dd>
</dl>

### Usage

```bash
nkp import image-bundle [flags]
```

### Parent command

* [nkp import](nkp_import.md) — Import images from an image bundle into Containerd
