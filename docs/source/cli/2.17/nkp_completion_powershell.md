---
title: nkp completion powershell
sidebar_label: nkp completion powershell
sidebar_position: 10
cli_generated: true
unlisted: true
hide_table_of_contents: true
displayed_sidebar: tutorialSidebar
nkp_minor: 2.17
nkp_patch: 2.17.1
nkp_command_id: nkp_completion_powershell
nkp_command_kind: leaf
---

<div class="cli-doc-ref" aria-hidden="true"></div>

Generate the autocompletion script for powershell

Generate the autocompletion script for powershell.

To load completions in your current shell session:

### Options

<dl class="cli-opts">
<dt><code>-h</code>, <code>--help</code></dt>
<dd>help for powershell</dd>
<dt><code>--no-descriptions</code></dt>
<dd>disable completion descriptions</dd>
<dt><code>-v</code>, <code>--verbose</code> <span class="cli-opt__type">int</span></dt>
<dd>Output verbosity</dd>
</dl>

### Usage

```bash
nkp completion powershell [flags]
```

### Examples

```bash
nkp completion powershell | Out-String | Invoke-Expression
```

To load completions for every new session, add the output of the above command

to your powershell profile.

### Parent command

* [nkp completion](nkp_completion.md) — Generate the autocompletion script for the specified shell
