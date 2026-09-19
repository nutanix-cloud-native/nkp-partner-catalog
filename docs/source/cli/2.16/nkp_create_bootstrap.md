---
title: nkp create bootstrap
sidebar_label: nkp create bootstrap
sidebar_position: 10
cli_generated: true
unlisted: true
hide_table_of_contents: true
displayed_sidebar: tutorialSidebar
nkp_minor: 2.16
nkp_patch: 2.16.1
nkp_command_id: nkp_create_bootstrap
nkp_command_kind: leaf
---

<div class="cli-doc-ref" aria-hidden="true"></div>

Create bootstrap cluster

### Options

<dl class="cli-opts">
<dt><code>--aws-service-endpoints</code> <span class="cli-opt__type">string</span></dt>
<dd>Custom AWS service endpoints in a semi-colon separated format: $&#123;SigningRegion1&#125;:$&#123;ServiceID1&#125;=$&#123;URL&#125;,$&#123;ServiceID2&#125;=$&#123;URL&#125;;$&#123;SigningRegion2&#125;...</dd>
<dt><code>--bootstrap-cluster-image</code> <span class="cli-opt__type">string</span> <span class="cli-opt__default">default <code>docker.io/mesosphere/konvoy-bootstrap:v2.16.1</code></span></dt>
<dd>Container image used to create the bootstrap cluster. Can be an image name or path to a filee.g. ./nkp-v2.16.1/konvoy-bootstrap-image-v2.16.1.tar. If not provided, the default image will be used</dd>
<dt><code>--bundle</code> <span class="cli-opt__type">files</span> <span class="cli-opt__default">default <code>&#91;&#93;</code></span></dt>
<dd>A comma separated list of bundle artifacts that will be pushed to an in-cluster registry. Supports glob pattern to match multiple artifacts (e.g. ./bundles/&#42;.tar). Following artifacts must be provided: konvoy-image-bundle-v2.16.1.tar, kommander-image-bundle-v2.16.1.tar</dd>
<dt><code>-h</code>, <code>--help</code></dt>
<dd>help for bootstrap</dd>
<dt><code>--http-proxy</code> <span class="cli-opt__type">string</span></dt>
<dd>HTTP proxy for CAPI controllers</dd>
<dt><code>--https-proxy</code> <span class="cli-opt__type">string</span></dt>
<dd>HTTPS proxy for CAPI controllers</dd>
<dt><code>--kubeconfig</code> <span class="cli-opt__type">string</span></dt>
<dd>Path to the kubeconfig for the management cluster. If unspecified, default discovery rules apply.</dd>
<dt><code>--no-proxy</code> <span class="cli-opt__type">strings</span> <span class="cli-opt__default">default <code>&#91;&#93;</code></span></dt>
<dd>No Proxy list for CAPI controllers</dd>
<dt><code>--timeout</code> <span class="cli-opt__type">duration</span> <span class="cli-opt__default">default <code>20m0s</code></span></dt>
<dd>The length of time to wait before giving up. Zero means wait forever (e.g. 300s, 30m, 3h).</dd>
<dt><code>-v</code>, <code>--verbose</code> <span class="cli-opt__type">int</span></dt>
<dd>Output verbosity</dd>
<dt><code>--wait</code> <span class="cli-opt__default">default <code>true</code></span></dt>
<dd>If true, wait for operations to complete before returning.</dd>
<dt><code>--with-aws-bootstrap-credentials</code></dt>
<dd>Set true to use AWS bootstrap credentials from your environment. When false, the instance profile of the EC2 instance where the CAPA controller is scheduled on will be used instead.</dd>
<dt><code>--with-gcp-bootstrap-credentials</code></dt>
<dd>Set true to use GCP bootstrap credentials from your environment. When false, the service account of the VM instance where the CAPG controller is scheduled on will be used instead.</dd>
</dl>

### Usage

```bash
nkp create bootstrap [flags]
```

### Parent command

* [nkp create](nkp_create.md) — Create one of \[appdeployment, bootstrap, bundle, capi-components, catalog, catalog-application, catalog-bundle, cluster, image, image-bundle, metadata, nodepool, package-bundle, workspace\]
