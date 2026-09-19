---
title: nkp experimental catalog release
sidebar_label: nkp experimental catalog release
sidebar_position: 10
cli_generated: true
unlisted: true
hide_table_of_contents: true
displayed_sidebar: tutorialSidebar
nkp_minor: 2.18
nkp_patch: 2.18.0
nkp_command_id: nkp_experimental_catalog_release
nkp_command_kind: leaf
---

<div class="cli-doc-ref" aria-hidden="true"></div>

Build the release artifacts for a given catalog repository

### Options

<dl class="cli-opts">
<dt><code>-h</code>, <code>--help</code></dt>
<dd>help for release</dd>
<dt><code>--release-spec</code> <span class="cli-opt__type">string</span> <span class="cli-opt__default">default <code>.release.yaml</code></span></dt>
<dd>Path to the file with release specification</dd>
<dt><code>--repo-dir</code> <span class="cli-opt__type">string</span></dt>
<dd>Path to the catalog repository in which to build the release artifacts</dd>
<dt><code>-v</code>, <code>--verbose</code> <span class="cli-opt__type">int</span></dt>
<dd>Output verbosity</dd>
</dl>

### Usage

```bash
nkp experimental catalog release [flags]
```

### Parent command

* [nkp experimental catalog](nkp_experimental_catalog.md) — Experimental catalog commands (release, docgen)
