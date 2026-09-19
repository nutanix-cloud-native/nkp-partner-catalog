---
title: nkp diagnose ssh
sidebar_label: nkp diagnose ssh
sidebar_position: 10
cli_generated: true
unlisted: true
hide_table_of_contents: true
displayed_sidebar: tutorialSidebar
nkp_minor: 2.13
nkp_patch: 2.13.3
nkp_command_id: nkp_diagnose_ssh
nkp_command_kind: leaf
---

<div class="cli-doc-ref" aria-hidden="true"></div>

Collect node-level diagnostics data over SSH

### Options

<dl class="cli-opts">
<dt><code>--bundle-name-prefix</code> <span class="cli-opt__type">string</span></dt>
<dd>Prefix added to support bundle name created</dd>
<dt><code>-h</code>, <code>--help</code></dt>
<dd>help for ssh</dd>
<dt><code>--redactors</code> <span class="cli-opt__type">strings</span> <span class="cli-opt__default">default <code>&#91;&#93;</code></span></dt>
<dd>Names of the additional redactors to use</dd>
<dt><code>--timeout</code> <span class="cli-opt__type">duration</span> <span class="cli-opt__default">default <code>5m0s</code></span></dt>
<dd>Timeout for collecting bundle per node</dd>
<dt><code>-v</code>, <code>--verbose</code> <span class="cli-opt__type">int</span></dt>
<dd>Output verbosity</dd>
</dl>

### Usage

```bash
nkp diagnose ssh path/to/inventory-file.yaml [flags]
```

### Parent command

* [nkp diagnose](nkp_diagnose.md) — Generate a support bundle
