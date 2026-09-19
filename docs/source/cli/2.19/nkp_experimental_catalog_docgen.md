---
title: nkp experimental catalog docgen
sidebar_label: nkp experimental catalog docgen
sidebar_position: 10
cli_generated: true
unlisted: true
hide_table_of_contents: true
displayed_sidebar: tutorialSidebar
nkp_minor: 2.19
nkp_patch: 2.19.0-dev
nkp_command_id: nkp_experimental_catalog_docgen
nkp_command_kind: leaf
---

<div class="cli-doc-ref" aria-hidden="true"></div>

Generate Markdown CLI documentation from the command tree

Generates one Markdown file per command into the given directory (default: docs/content/cli) with Docusaurus frontmatter for the docs site.

### Options

<dl class="cli-opts">
<dt><code>-h</code>, <code>--help</code></dt>
<dd>help for docgen</dd>
<dt><code>--out</code> <span class="cli-opt__type">string</span> <span class="cli-opt__default">default <code>docs/content/cli</code></span></dt>
<dd>Output directory for generated Markdown files</dd>
<dt><code>-v</code>, <code>--verbose</code> <span class="cli-opt__type">int</span></dt>
<dd>Output verbosity</dd>
</dl>

### Usage

```bash
nkp experimental catalog docgen [flags]
```

### Parent command

* [nkp experimental catalog](nkp_experimental_catalog.md) — Experimental catalog commands (release, docgen)
