---
title: nkp validate catalog-repository
sidebar_label: nkp validate catalog-repository
sidebar_position: 10
cli_generated: true
unlisted: true
hide_table_of_contents: true
displayed_sidebar: tutorialSidebar
nkp_minor: 2.19
nkp_patch: 2.19.0-dev
nkp_command_id: nkp_validate_catalog-repository
nkp_command_kind: leaf
---

<div class="cli-doc-ref" aria-hidden="true"></div>

Validate the given catalog repository contents

### Options

<dl class="cli-opts">
<dt><code>--apps</code> <span class="cli-opt__type">strings</span></dt>
<dd>Applications to validate (name=version). Accepts comma-separated values or can be repeated. When omitted, all applications are validated.</dd>
<dt><code>--config</code> <span class="cli-opt__type">string</span></dt>
<dd>Path to the catalog validation config file</dd>
<dt><code>-h</code>, <code>--help</code></dt>
<dd>help for catalog-repository</dd>
<dt><code>--repo-dir</code> <span class="cli-opt__type">string</span> <span class="cli-opt__default">default <code>to current working directory</code></span></dt>
<dd>Path to the catalog repository.</dd>
<dt><code>-v</code>, <code>--verbose</code> <span class="cli-opt__type">int</span></dt>
<dd>Output verbosity</dd>
</dl>

### Usage

```bash
nkp validate catalog-repository [flags]
```

### Parent command

* [nkp validate](nkp_validate.md) — Validate one of \[catalog-repository\]
