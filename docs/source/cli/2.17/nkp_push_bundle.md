---
title: nkp push bundle
sidebar_label: nkp push bundle
sidebar_position: 10
cli_generated: true
unlisted: true
hide_table_of_contents: true
displayed_sidebar: tutorialSidebar
nkp_minor: 2.17
nkp_patch: 2.17.1
nkp_command_id: nkp_push_bundle
nkp_command_kind: leaf
---

<div class="cli-doc-ref" aria-hidden="true"></div>

Push from bundles into an existing OCI registry

### Options

<dl class="cli-opts">
<dt><code>--bundle</code> <span class="cli-opt__type">strings</span> <span class="cli-opt__default">default <code>&#91;&#93;</code></span></dt>
<dd>Tarball containing list of images to push. Can also be a glob pattern.</dd>
<dt><code>--ecr-lifecycle-policy-file</code> <span class="cli-opt__type">string</span></dt>
<dd>File containing ECR lifecycle policy for newly created repositories (only applies if target registry is hosted on ECR, ignored otherwise)</dd>
<dt><code>--force-oci-media-types</code></dt>
<dd>force OCI media types</dd>
<dt><code>-h</code>, <code>--help</code></dt>
<dd>help for bundle</dd>
<dt><code>--image-push-concurrency</code> <span class="cli-opt__type">int</span> <span class="cli-opt__default">default <code>1</code></span></dt>
<dd>Image push concurrency</dd>
<dt><code>--kubeconfig</code></dt>
<dd>file If pushing to a registry running in a Kubernetes cluster, the kubeconfig file for the cluster. If unspecified, default discovery rules apply.</dd>
<dt><code>--on-existing-tag</code> <span class="cli-opt__type">string</span> <span class="cli-opt__default">default <code>overwrite</code></span></dt>
<dd>how to handle existing tags: one of "overwrite", "error", or "skip"</dd>
<dt><code>--to-internal-registry-mirror</code></dt>
<dd>Push to an internal registry mirror running in a Kubernetes cluster.</dd>
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
nkp push bundle [flags]
```

### Parent command

* [nkp push](nkp_push.md) — Push one of \[bundle, chart, chart-bundle, image-bundle\]
