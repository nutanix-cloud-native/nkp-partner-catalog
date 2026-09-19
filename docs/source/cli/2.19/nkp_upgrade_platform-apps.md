---
title: nkp upgrade platform-apps
sidebar_label: nkp upgrade platform-apps
sidebar_position: 10
cli_generated: true
unlisted: true
hide_table_of_contents: true
displayed_sidebar: tutorialSidebar
nkp_minor: 2.19
nkp_patch: 2.19.0-dev
nkp_command_id: nkp_upgrade_platform-apps
nkp_command_kind: leaf
---

<div class="cli-doc-ref" aria-hidden="true"></div>

Upgrade platform applications for a target NKPCluster

### Options

<dl class="cli-opts">
<dt><code>--allow-gitrepository-catalog-apps</code></dt>
<dd>Allow upgrade to proceed when deprecated GitRepository-based catalog apps are detected</dd>
<dt><code>--cluster-name</code> <span class="cli-opt__type">string</span></dt>
<dd>Name of target NKPCluster</dd>
<dt><code>--config</code> <span class="cli-opt__type">string</span> <span class="cli-opt__default">default <code>~/.kommander/config</code></span></dt>
<dd>Config file to use</dd>
<dt><code>--context</code> <span class="cli-opt__type">string</span></dt>
<dd>The name of the kubeconfig context to use</dd>
<dt><code>--core-app-timeout</code> <span class="cli-opt__type">duration</span> <span class="cli-opt__default">default <code>20m0s</code></span></dt>
<dd>Timeout to wait for upgrade of each kommander core application</dd>
<dt><code>--dry-run</code></dt>
<dd>Do not upgrade, just list the operations that would be performed</dd>
<dt><code>-h</code>, <code>--help</code></dt>
<dd>help for platform-apps</dd>
<dt><code>--kubeconfig</code> <span class="cli-opt__type">string</span></dt>
<dd>Path to the kubeconfig file to use for CLI requests.</dd>
<dt><code>--namespace</code> <span class="cli-opt__type">string</span></dt>
<dd>Namespace containing the target NKPCluster</dd>
<dt><code>--platform-apps-timeout</code> <span class="cli-opt__type">duration</span> <span class="cli-opt__default">default <code>40m0s</code></span></dt>
<dd>Timeout to wait for upgrade of the set of platform applications</dd>
<dt><code>--request-timeout</code> <span class="cli-opt__type">string</span></dt>
<dd>The length of time to wait before giving up on a single server request. Non-zero values should contain a corresponding time unit (e.g. 1s, 2m, 3h). A value of zero means don't timeout requests.</dd>
<dt><code>-v</code>, <code>--verbose</code> <span class="cli-opt__type">int</span></dt>
<dd>Output verbosity</dd>
<dt><code>--version</code> <span class="cli-opt__type">string</span></dt>
<dd>Target NKP platform version to upgrade to</dd>
<dt><code>--workspace</code> <span class="cli-opt__type">string</span></dt>
<dd>Workspace containing the target NKPCluster</dd>
</dl>

### Usage

```bash
nkp upgrade platform-apps --cluster-name CLUSTER_NAME --version VERSION [--workspace WORKSPACE | --namespace NAMESPACE] [--dry-run] [flags]
```

### Parent command

* [nkp upgrade](nkp_upgrade.md) — Upgrade one of \[addons, capi-components, catalog-app, cluster, kommander, platform-apps, workspace\]
