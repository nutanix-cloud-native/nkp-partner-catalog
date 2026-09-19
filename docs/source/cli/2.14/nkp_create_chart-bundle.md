---
title: nkp create chart-bundle
sidebar_label: nkp create chart-bundle
sidebar_position: 10
cli_generated: true
unlisted: true
hide_table_of_contents: true
displayed_sidebar: tutorialSidebar
nkp_minor: 2.14
nkp_patch: 2.14.3
nkp_command_id: nkp_create_chart-bundle
nkp_command_kind: leaf
---

<div class="cli-doc-ref" aria-hidden="true"></div>

Create charts bundle based on a catalog applications git repository

### Options

<dl class="cli-opts">
<dt><code>--catalog-repository</code> <span class="cli-opt__type">string</span></dt>
<dd>Git repository containing catalog application definitions</dd>
<dt><code>--config</code> <span class="cli-opt__type">string</span> <span class="cli-opt__default">default <code>~/.kommander/config</code></span></dt>
<dd>Config file to use</dd>
<dt><code>--context</code> <span class="cli-opt__type">string</span></dt>
<dd>The name of the kubeconfig context to use</dd>
<dt><code>--extra-charts</code> <span class="cli-opt__type">strings</span> <span class="cli-opt__default">default <code>&#91;&#93;</code></span></dt>
<dd>Extra charts to include in the bundle, in the format &lt;repo-url1&gt;|&lt;chart-name1&gt;,&lt;repo-url2&gt;|&lt;chart-name2&gt;:&lt;chart-version2&gt;,...</dd>
<dt><code>-h</code>, <code>--help</code></dt>
<dd>help for chart-bundle</dd>
<dt><code>--kommander-charts-version</code> <span class="cli-opt__type">string</span></dt>
<dd>Kommander helm charts version to download. Default: download all available versions</dd>
<dt><code>--kubeconfig</code> <span class="cli-opt__type">string</span></dt>
<dd>Path to the kubeconfig file to use for CLI requests.</dd>
<dt><code>-o</code>, <code>--output</code> <span class="cli-opt__type">string</span> <span class="cli-opt__default">default <code>charts-bundle.tar.gz</code></span></dt>
<dd>File path to write charts bundle to</dd>
<dt><code>--request-timeout</code> <span class="cli-opt__type">string</span></dt>
<dd>The length of time to wait before giving up on a single server request. Non-zero values should contain a corresponding time unit (e.g. 1s, 2m, 3h). A value of zero means don't timeout requests.</dd>
<dt><code>--skip-charts</code> <span class="cli-opt__type">strings</span> <span class="cli-opt__default">default <code>&#91;&#93;</code></span></dt>
<dd>Charts to not to include in the bundle, in the format &lt;chart-name1&gt;,&lt;chart-name2&gt;:&lt;chart-version2&gt;,...</dd>
<dt><code>-v</code>, <code>--verbose</code> <span class="cli-opt__type">int</span></dt>
<dd>Output verbosity</dd>
</dl>

### Usage

```bash
nkp create chart-bundle [flags]
```

### Parent command

* [nkp create](nkp_create.md) — Create one of \[appdeployment, bootstrap, bundle, capi-components, catalog, chart-bundle, cluster, image, image-bundle, metadata, nodepool, package-bundle, workspace\]
