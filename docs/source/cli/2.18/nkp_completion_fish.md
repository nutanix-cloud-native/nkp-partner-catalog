---
title: nkp completion fish
sidebar_label: nkp completion fish
sidebar_position: 10
cli_generated: true
unlisted: true
hide_table_of_contents: true
displayed_sidebar: tutorialSidebar
nkp_minor: 2.18
nkp_patch: 2.18.0
nkp_command_id: nkp_completion_fish
nkp_command_kind: leaf
---

<div class="cli-doc-ref" aria-hidden="true"></div>

Generate the autocompletion script for fish

Generate the autocompletion script for the fish shell.

To load completions in your current shell session:

### Options

<dl class="cli-opts">
<dt><code>-h</code>, <code>--help</code></dt>
<dd>help for fish</dd>
<dt><code>--no-descriptions</code></dt>
<dd>disable completion descriptions</dd>
<dt><code>-v</code>, <code>--verbose</code> <span class="cli-opt__type">int</span></dt>
<dd>Output verbosity</dd>
</dl>

### Usage

```bash
nkp completion fish [flags]
```

### Examples

```bash
nkp completion fish | source
```

To load completions for every new session, execute once:

```bash
nkp completion fish > ~/.config/fish/completions/nkp.fish
```

You will need to start a new shell for this setup to take effect.

### Parent command

* [nkp completion](nkp_completion.md) — Generate the autocompletion script for the specified shell
