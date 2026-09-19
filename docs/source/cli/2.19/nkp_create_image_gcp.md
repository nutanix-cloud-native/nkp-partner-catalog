---
title: nkp create image gcp
sidebar_label: nkp create image gcp
sidebar_position: 10
cli_generated: true
unlisted: true
hide_table_of_contents: true
displayed_sidebar: tutorialSidebar
nkp_minor: 2.19
nkp_patch: 2.19.0-dev
nkp_command_id: nkp_create_image_gcp
nkp_command_kind: leaf
---

<div class="cli-doc-ref" aria-hidden="true"></div>

Create Google Cloud Platform Image for one of [ubuntu-22.04, ubuntu-24.04]

### Options

<dl class="cli-opts">
<dt><code>--debug</code></dt>
<dd>Run packer in debug mode. user will be prompted after each step while building the image.</dd>
<dt><code>--dry-run</code></dt>
<dd>Do not create artifacts, or delete them after creating. Recommended for tests.</dd>
<dt><code>--extra-build-name</code> <span class="cli-opt__type">string</span></dt>
<dd>Additional name to add in the OS image name</dd>
<dt><code>-h</code>, <code>--help</code></dt>
<dd>help for gcp</dd>
<dt><code>--image-storage-locations</code> <span class="cli-opt__type">strings</span> <span class="cli-opt__default">default <code>&#91;&#93;</code></span></dt>
<dd>The locations where the image will be stored.</dd>
<dt><code>--kubernetes-version</code> <span class="cli-opt__type">string</span> <span class="cli-opt__default">default <code>1.36.2</code></span></dt>
<dd>Kubernetes version used to build packages</dd>
<dt><code>--network</code> <span class="cli-opt__type">string</span></dt>
<dd>The network to use when creating an image</dd>
<dt><code>--network-tags</code> <span class="cli-opt__type">strings</span> <span class="cli-opt__default">default <code>&#91;&#93;</code></span></dt>
<dd>Network tags to apply firewall rules to the build instance.</dd>
<dt><code>--overrides</code> <span class="cli-opt__default">default <code>&#91;&#93;</code></span></dt>
<dd>fileSlice A comma separated list of override YAML files.</dd>
<dt><code>--project-id</code> <span class="cli-opt__type">string</span></dt>
<dd>The project id to use when storing created image.</dd>
<dt><code>--region</code> <span class="cli-opt__type">string</span> <span class="cli-opt__default">default <code>us-west1</code></span></dt>
<dd>The region in which to launch the instance.</dd>
<dt><code>-v</code>, <code>--verbose</code> <span class="cli-opt__type">int</span></dt>
<dd>Output verbosity</dd>
<dt><code>--work-directory</code> <span class="cli-opt__type">string</span></dt>
<dd>Path to a directory to use as a workspace to build the OS image. The directory must already exist.</dd>
</dl>

### Usage

```bash
nkp create image gcp OSName [flags]
```

### Parent command

* [nkp create image](nkp_create_image.md) — Create Operating System image for one of \[aws, azure, gcp, nutanix, preprovisioned, vsphere\]
