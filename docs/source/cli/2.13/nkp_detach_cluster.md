---
title: nkp detach cluster
sidebar_label: nkp detach cluster
sidebar_position: 10
cli_generated: true
unlisted: true
hide_table_of_contents: true
displayed_sidebar: tutorialSidebar
nkp_minor: 2.13
nkp_patch: 2.13.3
nkp_command_id: nkp_detach_cluster
nkp_command_kind: leaf
---

<div class="cli-doc-ref" aria-hidden="true"></div>

Detach a cluster

### Options

<dl class="cli-opts">
<dt><code>--config</code> <span class="cli-opt__type">string</span> <span class="cli-opt__default">default <code>~/.kommander/config</code></span></dt>
<dd>Config file to use</dd>
<dt><code>--context</code> <span class="cli-opt__type">string</span></dt>
<dd>The name of the kubeconfig context to use</dd>
<dt><code>-h</code>, <code>--help</code></dt>
<dd>help for cluster</dd>
<dt><code>--kubeconfig</code> <span class="cli-opt__type">string</span></dt>
<dd>Path to the kubeconfig file to use for CLI requests.</dd>
<dt><code>--request-timeout</code> <span class="cli-opt__type">string</span></dt>
<dd>The length of time to wait before giving up on a single server request. Non-zero values should contain a corresponding time unit (e.g. 1s, 2m, 3h). A value of zero means don't timeout requests.</dd>
<dt><code>--timeout</code> <span class="cli-opt__type">duration</span> <span class="cli-opt__default">default <code>0s</code></span></dt>
<dd>The length of time to wait before giving up on a detach, defaults to wait forever</dd>
<dt><code>-v</code>, <code>--verbose</code> <span class="cli-opt__type">int</span></dt>
<dd>Output verbosity</dd>
<dt><code>--wait</code> <span class="cli-opt__default">default <code>true</code></span></dt>
<dd>If true, wait for resources to be gone before returning. This waits for finalizers.</dd>
<dt><code>-w</code>, <code>--workspace</code> <span class="cli-opt__type">string</span></dt>
<dd>Name of the workspace of the attached cluster</dd>
</dl>

### Usage

```bash
nkp detach cluster CLUSTER_NAME [flags]
```

### Parent command

* [nkp detach](nkp_detach.md) — Detach one of \[cluster\]
