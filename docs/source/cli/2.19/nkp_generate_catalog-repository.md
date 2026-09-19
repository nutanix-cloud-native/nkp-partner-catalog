---
title: nkp generate catalog-repository
sidebar_label: nkp generate catalog-repository
sidebar_position: 10
cli_generated: true
unlisted: true
hide_table_of_contents: true
displayed_sidebar: tutorialSidebar
nkp_minor: 2.19
nkp_patch: 2.19.0-dev
nkp_command_id: nkp_generate_catalog-repository
nkp_command_kind: leaf
---

<div class="cli-doc-ref" aria-hidden="true"></div>

Generate the catalog repository layout and its contents

### Options

<dl class="cli-opts">
<dt><code>--apps</code> <span class="cli-opt__type">strings</span></dt>
<dd>Apps to generate (name=version)</dd>
<dt><code>-h</code>, <code>--help</code></dt>
<dd>help for catalog-repository</dd>
<dt><code>--overwrite</code></dt>
<dd>Overwrite existing application files</dd>
<dt><code>--repo-dir</code> <span class="cli-opt__type">string</span> <span class="cli-opt__default">default <code>to current working directory</code></span></dt>
<dd>Path to the catalog repository in which to generate the files.</dd>
<dt><code>-v</code>, <code>--verbose</code> <span class="cli-opt__type">int</span></dt>
<dd>Output verbosity</dd>
</dl>

### Usage

```bash
nkp generate catalog-repository [flags]
```

### Parent command

* [nkp generate](nkp_generate.md) — Generate one of \[catalog-repository\]
