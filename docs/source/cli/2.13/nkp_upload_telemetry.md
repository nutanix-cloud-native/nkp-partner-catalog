---
title: nkp upload telemetry
sidebar_label: nkp upload telemetry
sidebar_position: 10
cli_generated: true
unlisted: true
hide_table_of_contents: true
displayed_sidebar: tutorialSidebar
nkp_minor: 2.13
nkp_patch: 2.13.3
nkp_command_id: nkp_upload_telemetry
nkp_command_kind: leaf
---

<div class="cli-doc-ref" aria-hidden="true"></div>

Upload telemetry information to a destination

### Options

<dl class="cli-opts">
<dt><code>--as</code> <span class="cli-opt__type">string</span></dt>
<dd>Username to impersonate for the operation. User could be a regular user or a service account in a namespace.</dd>
<dt><code>--as-group</code> <span class="cli-opt__default">default <code>&#91;&#93;</code></span></dt>
<dd>stringArray Group to impersonate for the operation, this flag can be repeated to specify multiple groups.</dd>
<dt><code>--as-uid</code> <span class="cli-opt__type">string</span></dt>
<dd>UID to impersonate for the operation.</dd>
<dt><code>--bundle-profile</code> <span class="cli-opt__type">string</span> <span class="cli-opt__default">default <code>telemetry</code></span></dt>
<dd>available profiles are: &#91;telemetry, diagnostics&#93;</dd>
<dt><code>--cache-dir</code> <span class="cli-opt__type">string</span> <span class="cli-opt__default">default <code>~/.kube/cache</code></span></dt>
<dd>Default cache directory</dd>
<dt><code>--certificate-authority</code> <span class="cli-opt__type">string</span></dt>
<dd>Path to a cert file for the certificate authority</dd>
<dt><code>--client-certificate</code> <span class="cli-opt__type">string</span></dt>
<dd>Path to a client certificate file for TLS</dd>
<dt><code>--client-key</code> <span class="cli-opt__type">string</span></dt>
<dd>Path to a client key file for TLS</dd>
<dt><code>--cluster</code> <span class="cli-opt__type">string</span></dt>
<dd>The name of the kubeconfig cluster to use</dd>
<dt><code>--context</code> <span class="cli-opt__type">string</span></dt>
<dd>The name of the kubeconfig context to use</dd>
<dt><code>--disable-compression</code></dt>
<dd>If true, opt-out of response compression for all requests to the server</dd>
<dt><code>-h</code>, <code>--help</code></dt>
<dd>help for telemetry</dd>
<dt><code>--insecure-skip-tls-verify</code></dt>
<dd>If true, the server's certificate will not be checked for validity. This will make your HTTPS connections insecure</dd>
<dt><code>--kubeconfig</code> <span class="cli-opt__type">string</span></dt>
<dd>Path to the kubeconfig file to use for CLI requests.</dd>
<dt><code>-n</code>, <code>--namespace</code> <span class="cli-opt__type">string</span></dt>
<dd>If present, the namespace scope for this CLI request</dd>
<dt><code>--request-timeout</code> <span class="cli-opt__type">string</span></dt>
<dd>The length of time to wait before giving up on a single server request. Non-zero values should contain a corresponding time unit (e.g. 1s, 2m, 3h). A value of zero means don't timeout requests.</dd>
<dt><code>-s</code>, <code>--server</code> <span class="cli-opt__type">string</span></dt>
<dd>The address and port of the Kubernetes API server</dd>
<dt><code>--tls-server-name</code> <span class="cli-opt__type">string</span></dt>
<dd>Server name to use for server certificate validation. If it is not provided, the hostname used to contact the server is used</dd>
<dt><code>--token</code> <span class="cli-opt__type">string</span></dt>
<dd>Bearer token for authentication to the API server</dd>
<dt><code>--user</code> <span class="cli-opt__type">string</span></dt>
<dd>The name of the kubeconfig user to use</dd>
<dt><code>-v</code>, <code>--verbose</code> <span class="cli-opt__type">int</span></dt>
<dd>Output verbosity</dd>
</dl>

### Usage

```bash
nkp upload telemetry [flags]
```

### Parent command

* [nkp upload](nkp_upload.md) — Collect and upload telemetry information
