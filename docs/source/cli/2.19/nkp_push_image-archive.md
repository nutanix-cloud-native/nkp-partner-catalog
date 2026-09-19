---
title: nkp push image-archive
sidebar_label: nkp push image-archive
sidebar_position: 10
cli_generated: true
unlisted: true
hide_table_of_contents: true
displayed_sidebar: tutorialSidebar
nkp_minor: 2.19
nkp_patch: 2.19.0-dev
nkp_command_id: nkp_push_image-archive
nkp_command_kind: leaf
---

<div class="cli-doc-ref" aria-hidden="true"></div>

Push OCI/docker image archive tarballs into an existing OCI registry

Push OCI image layout tarballs (oci-archive) and docker-save tarballs (docker-archive) directly to an OCI registry. The archive format is auto-detected from the file contents.

### Options

<dl class="cli-opts">
<dt><code>-h</code>, <code>--help</code></dt>
<dd>help for image-archive</dd>
<dt><code>--image-archive</code> <span class="cli-opt__type">strings</span> <span class="cli-opt__default">default <code>&#91;&#93;</code></span></dt>
<dd>Tarball containing an image archive to push (OCI image layout or docker-save format, auto-detected). Can be specified multiple times or as a glob pattern.</dd>
<dt><code>--image-tag</code> <span class="cli-opt__type">string</span></dt>
<dd>Destination image reference (repo:tag) to use when the archive contains a single image. Overrides any embedded tag; required if the archive has no embedded tag. Only valid when exactly one archive with one image is provided.</dd>
<dt><code>--to-registry</code> <span class="cli-opt__type">string</span></dt>
<dd>Registry to push images to. TLS verification will be skipped when using an http:// registry.</dd>
<dt><code>--to-registry-ca-cert-file</code> <span class="cli-opt__type">string</span></dt>
<dd>CA certificate file used to verify TLS verification of registry to push images to</dd>
<dt><code>--to-registry-insecure-skip-tls-verify</code></dt>
<dd>Skip TLS verification of registry to push images to (also use for non-TLS http registries)</dd>
<dt><code>--to-registry-password</code> <span class="cli-opt__type">string</span></dt>
<dd>Password to use to log in to destination registry</dd>
<dt><code>--to-registry-username</code> <span class="cli-opt__type">string</span></dt>
<dd>Username to use to log in to destination registry</dd>
<dt><code>-v</code>, <code>--verbose</code> <span class="cli-opt__type">int</span></dt>
<dd>Output verbosity</dd>
</dl>

### Usage

```bash
nkp push image-archive [flags]
```

### Parent command

* [nkp push](nkp_push.md) — Push one of \[bundle, image-archive, image-bundle\]
