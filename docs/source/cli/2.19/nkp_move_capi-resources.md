---
title: nkp move capi-resources
sidebar_label: nkp move capi-resources
sidebar_position: 10
cli_generated: true
unlisted: true
hide_table_of_contents: true
displayed_sidebar: tutorialSidebar
nkp_minor: 2.19
nkp_patch: 2.19.0-dev
nkp_command_id: nkp_move_capi-resources
nkp_command_kind: leaf
---

<div class="cli-doc-ref" aria-hidden="true"></div>

Move controllers and objects from one cluster to the other

### Options

<dl class="cli-opts">
<dt><code>--from-context</code> <span class="cli-opt__type">string</span></dt>
<dd>Context to be used within the from-cluster's kubeconfig file. If empty, current context will be used.</dd>
<dt><code>--from-kubeconfig</code></dt>
<dd>file Path to the kubeconfig for pivot's source cluster. If unspecified, default discovery rules apply.</dd>
<dt><code>-h</code>, <code>--help</code></dt>
<dd>help for capi-resources</dd>
<dt><code>-n</code>, <code>--namespace</code> <span class="cli-opt__type">string</span> <span class="cli-opt__default">default <code>default</code></span></dt>
<dd>If present, the namespace scope for this CLI request.</dd>
<dt><code>--nkp-namespace</code> <span class="cli-opt__type">string</span> <span class="cli-opt__default">default <code>kommander</code></span></dt>
<dd>Namespace on the from-cluster containing NKPCluster resources to move.</dd>
<dt><code>--to-context</code> <span class="cli-opt__type">string</span></dt>
<dd>Context to be used within the to-cluster's kubeconfig file. If empty, current context will be used.</dd>
<dt><code>--to-kubeconfig</code></dt>
<dd>file Path to the kubeconfig for pivot's destination cluster</dd>
<dt><code>--to-namespace</code> <span class="cli-opt__type">string</span></dt>
<dd>Resources are moved to this namespace in the to-cluster. By default, the same as the from-cluster namespace.</dd>
<dt><code>--to-nkp-namespace</code> <span class="cli-opt__type">string</span> <span class="cli-opt__default">default <code>kommander</code></span></dt>
<dd>Namespace on the to-cluster to move NKPCluster resources into.</dd>
<dt><code>-v</code>, <code>--verbose</code> <span class="cli-opt__type">int</span></dt>
<dd>Output verbosity</dd>
</dl>

### Usage

```bash
nkp move capi-resources [flags]
```

### Parent command

* [nkp move](nkp_move.md) — Move one of \[capi-resources\]
