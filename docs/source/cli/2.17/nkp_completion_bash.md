---
title: nkp completion bash
sidebar_label: nkp completion bash
sidebar_position: 10
cli_generated: true
unlisted: true
hide_table_of_contents: true
displayed_sidebar: tutorialSidebar
nkp_minor: 2.17
nkp_patch: 2.17.1
nkp_command_id: nkp_completion_bash
nkp_command_kind: leaf
---

<div class="cli-doc-ref" aria-hidden="true"></div>

Generate the autocompletion script for bash

Generate the autocompletion script for the bash shell.

This script depends on the 'bash-completion' package.
If it is not installed already, you can install it via your OS's package manager.

To load completions in your current shell session:

### Options

<dl class="cli-opts">
<dt><code>-h</code>, <code>--help</code></dt>
<dd>help for bash</dd>
<dt><code>--no-descriptions</code></dt>
<dd>disable completion descriptions</dd>
<dt><code>-v</code>, <code>--verbose</code> <span class="cli-opt__type">int</span></dt>
<dd>Output verbosity</dd>
</dl>

### Usage

```bash
nkp completion bash
```

### Examples

source &lt;(nkp completion bash)

To load completions for every new session, execute once:

#### Linux:

```bash
nkp completion bash > /etc/bash_completion.d/nkp
```

#### macOS:

```bash
nkp completion bash > $(brew --prefix)/etc/bash_completion.d/nkp
```

You will need to start a new shell for this setup to take effect.

### Parent command

* [nkp completion](nkp_completion.md) — Generate the autocompletion script for the specified shell
