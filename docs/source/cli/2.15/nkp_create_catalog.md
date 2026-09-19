---
title: nkp create catalog
sidebar_label: nkp create catalog
sidebar_position: 10
cli_generated: true
unlisted: true
hide_table_of_contents: true
displayed_sidebar: tutorialSidebar
nkp_minor: 2.15
nkp_patch: 2.15.2
nkp_command_id: nkp_create_catalog
nkp_command_kind: leaf
---

<div class="cli-doc-ref" aria-hidden="true"></div>

Create a custom catalog GitRepository in project or workspace namespace

### Options

<dl class="cli-opts">
<dt><code>--airgapped</code></dt>
<dd>Enable airgapped mode.</dd>
<dt><code>--branch</code> <span class="cli-opt__type">string</span></dt>
<dd>Git branch to use for the catalog repository</dd>
<dt><code>--charts-bundle</code> <span class="cli-opt__default">default <code>&#91;&#93;</code></span></dt>
<dd>stringArray Path to charts-bundle to upload to chartmuseum. Required if airgapped mode is enabled.</dd>
<dt><code>--commit</code> <span class="cli-opt__type">string</span></dt>
<dd>Git commit to use for the catalog repository</dd>
<dt><code>--config</code> <span class="cli-opt__type">string</span> <span class="cli-opt__default">default <code>~/.kommander/config</code></span></dt>
<dd>Config file to use</dd>
<dt><code>--context</code> <span class="cli-opt__type">string</span></dt>
<dd>The name of the kubeconfig context to use</dd>
<dt><code>-h</code>, <code>--help</code></dt>
<dd>help for catalog</dd>
<dt><code>--interval</code> <span class="cli-opt__type">duration</span> <span class="cli-opt__default">default <code>1m0s</code></span></dt>
<dd>Interval for flux source-controller check for updates in the catalog repository</dd>
<dt><code>--kubeconfig</code> <span class="cli-opt__type">string</span></dt>
<dd>Path to the kubeconfig file to use for CLI requests.</dd>
<dt><code>--path</code> <span class="cli-opt__type">string</span></dt>
<dd>Path to the catalog repository. Required if airgapped mode is enabled.</dd>
<dt><code>-p</code>, <code>--project</code> <span class="cli-opt__type">string</span></dt>
<dd>Name of the Project to create for the catalog repository. Requires workspace flag (workspace that the project belongs to)</dd>
<dt><code>--request-timeout</code> <span class="cli-opt__type">string</span></dt>
<dd>The length of time to wait before giving up on a single server request. Non-zero values should contain a corresponding time unit (e.g. 1s, 2m, 3h). A value of zero means don't timeout requests.</dd>
<dt><code>--secret</code> <span class="cli-opt__type">string</span></dt>
<dd>name of the secret for flux to use to get authenticated for catalog repository. Required if your git repository needs authentication.</dd>
<dt><code>--tag</code> <span class="cli-opt__type">string</span></dt>
<dd>Git tag to use for the catalog repository</dd>
<dt><code>--timeout</code> <span class="cli-opt__type">duration</span> <span class="cli-opt__default">default <code>1m0s</code></span></dt>
<dd>Timeout for flux source-controller check for updates in the catalog repository</dd>
<dt><code>--type</code> <span class="cli-opt__type">string</span> <span class="cli-opt__default">default <code>custom</code></span></dt>
<dd>Type of the catalog repository. Must be one of custom|nkp|partner.</dd>
<dt><code>--url</code> <span class="cli-opt__type">string</span></dt>
<dd>URL of the catalog git repository. It can be an http/s or ssh address. Required.</dd>
<dt><code>-v</code>, <code>--verbose</code> <span class="cli-opt__type">int</span></dt>
<dd>Output verbosity</dd>
<dt><code>-w</code>, <code>--workspace</code> <span class="cli-opt__type">string</span></dt>
<dd>Name of the Workspace to create for the catalog repository.</dd>
</dl>

### Usage

```bash
nkp create catalog CATALOG_NAME [flags]
```

### Parent command

* [nkp create](nkp_create.md) — Create one of \[appdeployment, bootstrap, bundle, capi-components, catalog, chart-bundle, cluster, image, image-bundle, metadata, nodepool, package-bundle, workspace\]
