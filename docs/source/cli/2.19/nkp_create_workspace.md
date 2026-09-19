---
title: nkp create workspace
sidebar_label: nkp create workspace
sidebar_position: 10
cli_generated: true
unlisted: true
hide_table_of_contents: true
displayed_sidebar: tutorialSidebar
nkp_minor: 2.19
nkp_patch: 2.19.0-dev
nkp_command_id: nkp_create_workspace
nkp_command_kind: leaf
---

<div class="cli-doc-ref" aria-hidden="true"></div>

Create a Workspace

### Options

<dl class="cli-opts">
<dt><code>--config</code> <span class="cli-opt__type">string</span> <span class="cli-opt__default">default <code>~/.kommander/config</code></span></dt>
<dd>Config file to use</dd>
<dt><code>--context</code> <span class="cli-opt__type">string</span></dt>
<dd>The name of the kubeconfig context to use</dd>
<dt><code>--display-name</code> <span class="cli-opt__type">string</span></dt>
<dd>Display name shown in the UI (defaults to WORKSPACE&#95;NAME)</dd>
<dt><code>--dry-run</code></dt>
<dd>Export in YAML format to stdout</dd>
<dt><code>-h</code>, <code>--help</code></dt>
<dd>help for workspace</dd>
<dt><code>--kubeconfig</code> <span class="cli-opt__type">string</span></dt>
<dd>Path to the kubeconfig file to use for CLI requests.</dd>
<dt><code>-n</code>, <code>--namespace</code> <span class="cli-opt__type">string</span></dt>
<dd>Name of the Namespace to create for the workspace</dd>
<dt><code>-o</code>, <code>--output</code> <span class="cli-opt__type">string</span> <span class="cli-opt__default">default <code>yaml</code></span></dt>
<dd>Output format. One of: yaml|json</dd>
<dt><code>--request-timeout</code> <span class="cli-opt__type">string</span></dt>
<dd>The length of time to wait before giving up on a single server request. Non-zero values should contain a corresponding time unit (e.g. 1s, 2m, 3h). A value of zero means don't timeout requests.</dd>
<dt><code>-v</code>, <code>--verbose</code> <span class="cli-opt__type">int</span></dt>
<dd>Output verbosity</dd>
</dl>

### Usage

```bash
nkp create workspace WORKSPACE_NAME [flags]
```

### Parent command

* [nkp create](nkp_create.md) — Create one of \[appdeployment, bootstrap, bootstrap-token, bundle, capi-components, catalog-app, catalog-bundle, cluster, image, image-bundle, metadata, nodepool, package-bundle, project, resource, wor
