---
title: nkp create capi-components
sidebar_label: nkp create capi-components
sidebar_position: 10
cli_generated: true
unlisted: true
hide_table_of_contents: true
displayed_sidebar: tutorialSidebar
nkp_minor: 2.18
nkp_patch: 2.18.0
nkp_command_id: nkp_create_capi-components
nkp_command_kind: leaf
---

<div class="cli-doc-ref" aria-hidden="true"></div>

Create the CAPI components in the cluster

### Options

<dl class="cli-opts">
<dt><code>--aws-service-endpoints</code> <span class="cli-opt__type">string</span></dt>
<dd>Custom AWS service endpoints in a semi-colon separated format: $&#123;SigningRegion1&#125;:$&#123;ServiceID1&#125;=$&#123;URL&#125;,$&#123;ServiceID2&#125;=$&#123;URL&#125;;$&#123;SigningRegion2&#125;...</dd>
<dt><code>--capi-additional-sync-machine-annotations</code> <span class="cli-opt__type">string</span></dt>
<dd>Comma-separated list of regex patterns for additional machine annotations that should be synced to Nodes. Use this with create commands that perform a fresh CAPI components installation (for example: create bootstrap, create capi-components, or create cluster --self-managed). These are added to the default patterns: ^nvidia\.com/.&#42;,^nutanix\.com/.&#42;,^amd\.com/.&#42;</dd>
<dt><code>--capi-additional-sync-machine-labels</code> <span class="cli-opt__type">string</span></dt>
<dd>Comma-separated list of regex patterns for additional machine labels that should be synced to Nodes. Use this with create commands that perform a fresh CAPI components installation (for example: create bootstrap, create capi-components, or create cluster --self-managed). These are added to the default patterns: ^nvidia\.com/.&#42;,^nutanix\.com/.&#42;,^amd\.com/.&#42;</dd>
<dt><code>-h</code>, <code>--help</code></dt>
<dd>help for capi-components</dd>
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
<dt><code>--with-aws-bootstrap-credentials</code></dt>
<dd>Set true to use AWS bootstrap credentials from your environment. When false, the instance profile of the EC2 instance where the CAPA controller is scheduled on will be used instead.</dd>
<dt><code>--with-gcp-bootstrap-credentials</code></dt>
<dd>Set true to use GCP bootstrap credentials from your environment. When false, the service account of the VM instance where the CAPG controller is scheduled on will be used instead.</dd>
</dl>

### Usage

```bash
nkp create capi-components [flags]
```

### Parent command

* [nkp create](nkp_create.md) — Create one of \[appdeployment, bootstrap, bundle, capi-components, catalog-application, catalog-bundle, cluster, image, image-bundle, metadata, nodepool, package-bundle, project, workspace\]
