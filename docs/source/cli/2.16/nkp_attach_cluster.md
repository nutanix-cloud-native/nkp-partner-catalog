---
title: nkp attach cluster
sidebar_label: nkp attach cluster
sidebar_position: 10
cli_generated: true
unlisted: true
hide_table_of_contents: true
displayed_sidebar: tutorialSidebar
nkp_minor: 2.16
nkp_patch: 2.16.1
nkp_command_id: nkp_attach_cluster
nkp_command_kind: leaf
---

<div class="cli-doc-ref" aria-hidden="true"></div>

Attach a cluster

### Options

<dl class="cli-opts">
<dt><code>--attached-kubeconfig</code> <span class="cli-opt__type">string</span></dt>
<dd>Path of the kubeconfig file of the cluster to be attached</dd>
<dt><code>--config</code> <span class="cli-opt__type">string</span> <span class="cli-opt__default">default <code>~/.kommander/config</code></span></dt>
<dd>Config file to use</dd>
<dt><code>--context</code> <span class="cli-opt__type">string</span></dt>
<dd>The name of the kubeconfig context to use</dd>
<dt><code>-h</code>, <code>--help</code></dt>
<dd>help for cluster</dd>
<dt><code>--kubeconfig</code> <span class="cli-opt__type">string</span></dt>
<dd>Path to the kubeconfig file to use for CLI requests.</dd>
<dt><code>-n</code>, <code>--name</code> <span class="cli-opt__type">string</span></dt>
<dd>Desired name of the attached cluster</dd>
<dt><code>--registry-cacert</code></dt>
<dd>file Path to file containing the CA certificate used to verify the registry server certificate</dd>
<dt><code>--registry-password</code> <span class="cli-opt__type">string</span></dt>
<dd>Password used to authenticate with the registry</dd>
<dt><code>--registry-url</code> <span class="cli-opt__type">url</span></dt>
<dd>URL of a container registry</dd>
<dt><code>--registry-username</code> <span class="cli-opt__type">string</span></dt>
<dd>Username used to authenticate with the registry</dd>
<dt><code>--request-timeout</code> <span class="cli-opt__type">string</span></dt>
<dd>The length of time to wait before giving up on a single server request. Non-zero values should contain a corresponding time unit (e.g. 1s, 2m, 3h). A value of zero means don't timeout requests.</dd>
<dt><code>-v</code>, <code>--verbose</code> <span class="cli-opt__type">int</span></dt>
<dd>Output verbosity</dd>
<dt><code>-w</code>, <code>--workspace</code> <span class="cli-opt__type">string</span></dt>
<dd>Name of the workspace of the attached cluster</dd>
</dl>

### Usage

```bash
nkp attach cluster -n NAME --attached-kubeconfig FILENAME [flags]
```

### Parent command

* [nkp attach](nkp_attach.md) — Attach one of \[cluster\]
