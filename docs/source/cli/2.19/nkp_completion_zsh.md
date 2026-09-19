---
title: nkp completion zsh
sidebar_label: nkp completion zsh
sidebar_position: 10
cli_generated: true
unlisted: true
hide_table_of_contents: true
displayed_sidebar: tutorialSidebar
nkp_minor: 2.19
nkp_patch: 2.19.0-dev
nkp_command_id: nkp_completion_zsh
nkp_command_kind: leaf
---

<div class="cli-doc-ref" aria-hidden="true"></div>

Generate the autocompletion script for zsh

Generate the autocompletion script for the zsh shell.

If shell completion is not already enabled in your environment you will need
to enable it.  You can execute the following once:

### Options

<dl class="cli-opts">
<dt><code>-h</code>, <code>--help</code></dt>
<dd>help for zsh</dd>
<dt><code>--no-descriptions</code></dt>
<dd>disable completion descriptions</dd>
<dt><code>-v</code>, <code>--verbose</code> <span class="cli-opt__type">int</span></dt>
<dd>Output verbosity</dd>
</dl>

### Usage

```bash
nkp completion zsh [flags]
```

### Examples

echo "autoload -U compinit; compinit" &gt;&gt; ~/.zshrc

To load completions in your current shell session:

source &lt;(nkp completion zsh)

To load completions for every new session, execute once:

#### Linux:

```bash
nkp completion zsh > "${fpath[1]}/_nkp"
```

#### macOS:

```bash
nkp completion zsh > $(brew --prefix)/share/zsh/site-functions/_nkp
```

You will need to start a new shell for this setup to take effect.

### Parent command

* [nkp completion](nkp_completion.md) — Generate the autocompletion script for the specified shell
