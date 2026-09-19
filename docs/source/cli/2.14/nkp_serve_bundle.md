---
title: nkp serve bundle
sidebar_label: nkp serve bundle
sidebar_position: 10
cli_generated: true
unlisted: true
hide_table_of_contents: true
displayed_sidebar: tutorialSidebar
nkp_minor: 2.14
nkp_patch: 2.14.3
nkp_command_id: nkp_serve_bundle
nkp_command_kind: leaf
---

<div class="cli-doc-ref" aria-hidden="true"></div>

Serve an OCI registry from previously created bundles

### Options

<dl class="cli-opts">
<dt><code>--bundle</code> <span class="cli-opt__type">strings</span> <span class="cli-opt__default">default <code>&#91;&#93;</code></span></dt>
<dd>Bundle to serve. Can also be a glob pattern.</dd>
<dt><code>-h</code>, <code>--help</code></dt>
<dd>help for bundle</dd>
<dt><code>--listen-address</code> <span class="cli-opt__type">string</span> <span class="cli-opt__default">default <code>127.0.0.1</code></span></dt>
<dd>Address to listen on</dd>
<dt><code>--listen-port</code></dt>
<dd>uint16 Port to listen on (0 means use any free port)</dd>
<dt><code>--tls-cert-file</code> <span class="cli-opt__type">string</span></dt>
<dd>TLS certificate file</dd>
<dt><code>--tls-private-key-file</code> <span class="cli-opt__type">string</span></dt>
<dd>TLS private key file</dd>
<dt><code>-v</code>, <code>--verbose</code> <span class="cli-opt__type">int</span></dt>
<dd>Output verbosity</dd>
</dl>

### Usage

```bash
nkp serve bundle [flags]
```

### Parent command

* [nkp serve](nkp_serve.md) — Serve image or Helm chart bundles from an OCI registry
