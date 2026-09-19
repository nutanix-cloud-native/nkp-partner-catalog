---
title: nkp describe cluster
sidebar_label: nkp describe cluster
sidebar_position: 10
cli_generated: true
unlisted: true
hide_table_of_contents: true
displayed_sidebar: tutorialSidebar
nkp_minor: 2.13
nkp_patch: 2.13.3
nkp_command_id: nkp_describe_cluster
nkp_command_kind: leaf
---

<div class="cli-doc-ref" aria-hidden="true"></div>

Describe a Kubernetes cluster status

### Options

<dl class="cli-opts">
<dt><code>-c</code>, <code>--cluster-name</code> <span class="cli-opt__type">name</span></dt>
<dd>Name used to prefix the cluster and all the created resources.</dd>
<dt><code>-h</code>, <code>--help</code></dt>
<dd>help for cluster</dd>
<dt><code>--kubeconfig</code> <span class="cli-opt__type">string</span></dt>
<dd>Path to the kubeconfig for the management cluster. If unspecified, default discovery rules apply.</dd>
<dt><code>-n</code>, <code>--namespace</code> <span class="cli-opt__type">string</span> <span class="cli-opt__default">default <code>default</code></span></dt>
<dd>If present, the namespace scope for this CLI request.</dd>
<dt><code>-v</code>, <code>--verbose</code> <span class="cli-opt__type">int</span></dt>
<dd>Output verbosity</dd>
</dl>

### Usage

```bash
nkp describe cluster [flags]
```

### Parent command

* [nkp describe](nkp_describe.md) — Describe one of \[cluster\]
