---
title: nkp delete capi-components
sidebar_label: nkp delete capi-components
sidebar_position: 10
cli_generated: true
unlisted: true
hide_table_of_contents: true
displayed_sidebar: tutorialSidebar
nkp_minor: 2.14
nkp_patch: 2.14.3
nkp_command_id: nkp_delete_capi-components
nkp_command_kind: leaf
---

<div class="cli-doc-ref" aria-hidden="true"></div>

Delete the CAPI components from the cluster

### Options

<dl class="cli-opts">
<dt><code>-h</code>, <code>--help</code></dt>
<dd>help for capi-components</dd>
<dt><code>--kubeconfig</code> <span class="cli-opt__type">string</span></dt>
<dd>Path to the kubeconfig for the management cluster. If unspecified, default discovery rules apply.</dd>
<dt><code>--timeout</code> <span class="cli-opt__type">duration</span> <span class="cli-opt__default">default <code>5m0s</code></span></dt>
<dd>The length of time to wait before giving up. Zero means wait forever (e.g. 300s, 30m, 3h).</dd>
<dt><code>-v</code>, <code>--verbose</code> <span class="cli-opt__type">int</span></dt>
<dd>Output verbosity</dd>
<dt><code>--wait</code> <span class="cli-opt__default">default <code>true</code></span></dt>
<dd>If true, wait for operations to complete before returning.</dd>
</dl>

### Usage

```bash
nkp delete capi-components [flags]
```

### Parent command

* [nkp delete](nkp_delete.md) — Delete one of \[bootstrap, capi-components, chart, cluster, nodepool\]
