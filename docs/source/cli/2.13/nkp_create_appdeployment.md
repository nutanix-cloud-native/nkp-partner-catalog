---
title: nkp create appdeployment
sidebar_label: nkp create appdeployment
sidebar_position: 10
cli_generated: true
unlisted: true
hide_table_of_contents: true
displayed_sidebar: tutorialSidebar
nkp_minor: 2.13
nkp_patch: 2.13.3
nkp_command_id: nkp_create_appdeployment
nkp_command_kind: leaf
---

<div class="cli-doc-ref" aria-hidden="true"></div>

Create an AppDeployment

Creates an AppDeployment in a workspace or project.

When [--clusters C1,C2..] is not specified, it targets all existing clusters in the specified workspace or project.

### Options

<dl class="cli-opts">
<dt><code>--add-cluster-config-overrides</code> <span class="cli-opt__type">strings</span> <span class="cli-opt__default">default <code>&#91;&#93;</code></span></dt>
<dd>Comma-separated list of mappings of kommanderCluster name to cluster configuration override ConfigMap name to apply to the targeting clusters. (e.g., cluster-1:override-1-cm,cluster-2:override-2-cm)(only valid for dkp clusters version 2.3.x and up)</dd>
<dt><code>-a</code>, <code>--app</code> <span class="cli-opt__type">string</span></dt>
<dd>Name of the App to deploy</dd>
<dt><code>--clusters</code> <span class="cli-opt__type">strings</span> <span class="cli-opt__default">default <code>&#91;&#93;</code></span></dt>
<dd>List of names of kommanderClusters to select for the command. (e.g., cluster-1,cluster-2)(only valid for dkp clusters version 2.3.x and up)</dd>
<dt><code>--config</code> <span class="cli-opt__type">string</span> <span class="cli-opt__default">default <code>~/.kommander/config</code></span></dt>
<dd>Config file to use</dd>
<dt><code>-c</code>, <code>--config-overrides</code> <span class="cli-opt__type">string</span></dt>
<dd>Name of the ConfigMap used to override default configuration of the App</dd>
<dt><code>--context</code> <span class="cli-opt__type">string</span></dt>
<dd>The name of the kubeconfig context to use</dd>
<dt><code>-h</code>, <code>--help</code></dt>
<dd>help for appdeployment</dd>
<dt><code>--kubeconfig</code> <span class="cli-opt__type">string</span></dt>
<dd>Path to the kubeconfig file to use for CLI requests.</dd>
<dt><code>-p</code>, <code>--project</code> <span class="cli-opt__type">string</span></dt>
<dd>Name of the project to create the AppDeployment in. Requires workspace flag (workspace that the project belongs to).</dd>
<dt><code>--request-timeout</code> <span class="cli-opt__type">string</span></dt>
<dd>The length of time to wait before giving up on a single server request. Non-zero values should contain a corresponding time unit (e.g. 1s, 2m, 3h). A value of zero means don't timeout requests.</dd>
<dt><code>-v</code>, <code>--verbose</code> <span class="cli-opt__type">int</span></dt>
<dd>Output verbosity</dd>
<dt><code>-w</code>, <code>--workspace</code> <span class="cli-opt__type">string</span></dt>
<dd>Name of the workspace to create the AppDeployment in</dd>
</dl>

### Usage

```bash
nkp create appdeployment APPDEPLOYMENT_NAME --app NAME [flags]
```

### Parent command

* [nkp create](nkp_create.md) — Create one of \[appdeployment, bootstrap, bundle, capi-components, catalog, chart-bundle, cluster, image, image-bundle, metadata, nodepool, package-bundle, workspace\]
