---
title: nkp get chart
sidebar_label: nkp get chart
sidebar_position: 10
cli_generated: true
unlisted: true
hide_table_of_contents: true
displayed_sidebar: tutorialSidebar
nkp_minor: 2.12
nkp_patch: 2.12.2
nkp_command_id: nkp_get_chart
nkp_command_kind: leaf
---

<div class="cli-doc-ref" aria-hidden="true"></div>

Obtain information about charts stored in the repository

### Options

<dl class="cli-opts">
<dt><code>-A</code>, <code>--all-namespaces</code></dt>
<dd>If present, list the requested object(s) across all namespaces.</dd>
<dt><code>--config</code> <span class="cli-opt__type">string</span> <span class="cli-opt__default">default <code>~/.kommander/config</code></span></dt>
<dd>Config file to use</dd>
<dt><code>--context</code> <span class="cli-opt__type">string</span></dt>
<dd>The name of the kubeconfig context to use</dd>
<dt><code>-h</code>, <code>--help</code></dt>
<dd>help for chart</dd>
<dt><code>--kubeconfig</code> <span class="cli-opt__type">string</span></dt>
<dd>Path to the kubeconfig file to use for CLI requests.</dd>
<dt><code>-o</code>, <code>--output</code> <span class="cli-opt__type">string</span></dt>
<dd>Output format. One of: table|yaml</dd>
<dt><code>--request-timeout</code> <span class="cli-opt__type">string</span></dt>
<dd>The length of time to wait before giving up on a single server request. Non-zero values should contain a corresponding time unit (e.g. 1s, 2m, 3h). A value of zero means don't timeout requests.</dd>
<dt><code>-v</code>, <code>--verbose</code> <span class="cli-opt__type">int</span></dt>
<dd>Output verbosity</dd>
</dl>

### Usage

```bash
nkp get chart [chartName] [chartVersion] [flags]
```

### Parent command

* [nkp get](nkp_get.md) — Get one of \[appdeployments, chart, clusters, dashboard, kubeconfig, nodepools, workspaces\]
