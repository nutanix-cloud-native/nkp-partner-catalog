---
title: nkp scale nodepool
sidebar_label: nkp scale nodepool
sidebar_position: 10
cli_generated: true
unlisted: true
hide_table_of_contents: true
displayed_sidebar: tutorialSidebar
nkp_minor: 2.19
nkp_patch: 2.19.0-dev
nkp_command_id: nkp_scale_nodepool
nkp_command_kind: leaf
---

<div class="cli-doc-ref" aria-hidden="true"></div>

Scale a nodepool of a given cluster to the number of replicas

### Options

<dl class="cli-opts">
<dt><code>-c</code>, <code>--cluster-name</code> <span class="cli-opt__type">name</span></dt>
<dd>Name used to prefix the cluster and all the created resources.</dd>
<dt><code>-h</code>, <code>--help</code></dt>
<dd>help for nodepool</dd>
<dt><code>--kubeconfig</code> <span class="cli-opt__type">string</span></dt>
<dd>Path to the kubeconfig for the management cluster. If unspecified, default discovery rules apply.</dd>
<dt><code>-n</code>, <code>--namespace</code> <span class="cli-opt__type">string</span> <span class="cli-opt__default">default <code>default</code></span></dt>
<dd>If present, the namespace scope for this CLI request.</dd>
<dt><code>--nodes-to-delete</code> <span class="cli-opt__type">strings</span> <span class="cli-opt__default">default <code>&#91;&#93;</code></span></dt>
<dd>A list of node names to mark for deletion when scaling down a node pool. If left empty, the nodes to delete will be selected at random.</dd>
<dt><code>--replicas</code> <span class="cli-opt__type">int32</span></dt>
<dd>The new desired number of replicas.</dd>
<dt><code>--use-context</code> <span class="cli-opt__type">string</span></dt>
<dd>Use a specific context in a kubeconfig file.</dd>
<dt><code>-v</code>, <code>--verbose</code> <span class="cli-opt__type">int</span></dt>
<dd>Output verbosity</dd>
</dl>

### Usage

```bash
nkp scale nodepool name [flags]
```

### Parent command

* [nkp scale](nkp_scale.md) — Scale one of \[nodepool\]
