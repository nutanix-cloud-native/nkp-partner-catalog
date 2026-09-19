---
title: nkp rotate dashboard-credentials
sidebar_label: nkp rotate dashboard-credentials
sidebar_position: 10
cli_generated: true
unlisted: true
hide_table_of_contents: true
displayed_sidebar: tutorialSidebar
nkp_minor: 2.19
nkp_patch: 2.19.0-dev
nkp_command_id: nkp_rotate_dashboard-credentials
nkp_command_kind: leaf
---

<div class="cli-doc-ref" aria-hidden="true"></div>

rotate the dashboard credentials

### Options

<dl class="cli-opts">
<dt><code>--config</code> <span class="cli-opt__type">string</span> <span class="cli-opt__default">default <code>~/.kommander/config</code></span></dt>
<dd>Config file to use</dd>
<dt><code>--context</code> <span class="cli-opt__type">string</span></dt>
<dd>The name of the kubeconfig context to use</dd>
<dt><code>-h</code>, <code>--help</code></dt>
<dd>help for dashboard-credentials</dd>
<dt><code>--kubeconfig</code> <span class="cli-opt__type">string</span></dt>
<dd>Path to the kubeconfig file to use for CLI requests.</dd>
<dt><code>--request-timeout</code> <span class="cli-opt__type">string</span></dt>
<dd>The length of time to wait before giving up on a single server request. Non-zero values should contain a corresponding time unit (e.g. 1s, 2m, 3h). A value of zero means don't timeout requests.</dd>
<dt><code>-v</code>, <code>--verbose</code> <span class="cli-opt__type">int</span></dt>
<dd>Output verbosity</dd>
<dt><code>-y</code>, <code>--yes</code></dt>
<dd>Skip the interactive confirmation prompt. Required to rotate in a non-interactive shell (e.g. scripts or CI).</dd>
</dl>

### Usage

```bash
nkp rotate dashboard-credentials [flags]
```

### Parent command

* [nkp rotate](nkp_rotate.md) — commands to rotate credentials
