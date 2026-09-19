---
title: nkp update bootstrap credentials gcp
sidebar_label: nkp update bootstrap credentials gcp
sidebar_position: 10
cli_generated: true
unlisted: true
hide_table_of_contents: true
displayed_sidebar: tutorialSidebar
nkp_minor: 2.18
nkp_patch: 2.18.0
nkp_command_id: nkp_update_bootstrap_credentials_gcp
nkp_command_kind: leaf
---

<div class="cli-doc-ref" aria-hidden="true"></div>

Update GCP credentials in the cluster and restart CAPG controllers

### Options

<dl class="cli-opts">
<dt><code>--context</code> <span class="cli-opt__type">string</span></dt>
<dd>The name of the kubeconfig context to use</dd>
<dt><code>-h</code>, <code>--help</code></dt>
<dd>help for gcp</dd>
<dt><code>--kubeconfig</code> <span class="cli-opt__type">string</span></dt>
<dd>Path to the kubeconfig for the management cluster. If unspecified, default discovery rules apply.</dd>
<dt><code>--print-only</code></dt>
<dd>Print the credentials and exit the function. Without modifying cluster</dd>
<dt><code>-v</code>, <code>--verbose</code> <span class="cli-opt__type">int</span></dt>
<dd>Output verbosity</dd>
</dl>

### Usage

```bash
nkp update bootstrap credentials gcp [flags]
```

### Parent command

* [nkp update bootstrap credentials](nkp_update_bootstrap_credentials.md) — Update credentials in the cluster
