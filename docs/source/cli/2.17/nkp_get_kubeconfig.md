---
title: nkp get kubeconfig
sidebar_label: nkp get kubeconfig
sidebar_position: 10
cli_generated: true
unlisted: true
hide_table_of_contents: true
displayed_sidebar: tutorialSidebar
nkp_minor: 2.17
nkp_patch: 2.17.1
nkp_command_id: nkp_get_kubeconfig
nkp_command_kind: leaf
---

<div class="cli-doc-ref" aria-hidden="true"></div>

Retrieve cluster kubeconfig and modify local kubeconfig file

### Options

<dl class="cli-opts">
<dt><code>-A</code>, <code>--all-namespaces</code></dt>
<dd>If present, list the requested object(s) across all namespaces.</dd>
<dt><code>--cluster</code> <span class="cli-opt__type">string</span></dt>
<dd>Kommander Cluster to get kubeconfig for</dd>
<dt><code>-c</code>, <code>--cluster-name</code> <span class="cli-opt__type">name</span></dt>
<dd>Name used to prefix the cluster and all the created resources.</dd>
<dt><code>-h</code>, <code>--help</code></dt>
<dd>help for kubeconfig</dd>
<dt><code>--kubeconfig</code> <span class="cli-opt__type">string</span></dt>
<dd>Path to the kubeconfig for the management cluster. If unspecified, default discovery rules apply.</dd>
<dt><code>-n</code>, <code>--namespace</code> <span class="cli-opt__type">string</span> <span class="cli-opt__default">default <code>default</code></span></dt>
<dd>If present, the namespace scope for this CLI request.</dd>
<dt><code>-o</code>, <code>--output</code> <span class="cli-opt__type">string</span></dt>
<dd>Output format. One of: table|yaml</dd>
<dt><code>-v</code>, <code>--verbose</code> <span class="cli-opt__type">int</span></dt>
<dd>Output verbosity</dd>
<dt><code>-w</code>, <code>--workspace</code> <span class="cli-opt__type">string</span></dt>
<dd>Name of the workspace to show clusters from</dd>
</dl>

### Usage

```bash
nkp get kubeconfig [flags]
```

### Parent command

* [nkp get](nkp_get.md) — Get one of \[appdeployments, chart, clusters, dashboard, kubeconfig, nodepools, workspaces\]
