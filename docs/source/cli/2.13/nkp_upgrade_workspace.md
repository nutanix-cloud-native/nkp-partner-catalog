---
title: nkp upgrade workspace
sidebar_label: nkp upgrade workspace
sidebar_position: 10
cli_generated: true
unlisted: true
hide_table_of_contents: true
displayed_sidebar: tutorialSidebar
nkp_minor: 2.13
nkp_patch: 2.13.3
nkp_command_id: nkp_upgrade_workspace
nkp_command_kind: leaf
---

<div class="cli-doc-ref" aria-hidden="true"></div>

Upgrade all platform applications in the given workspace and its projects to the same version as platform applications running on the management cluster

### Options

<dl class="cli-opts">
<dt><code>--config</code> <span class="cli-opt__type">string</span> <span class="cli-opt__default">default <code>~/.kommander/config</code></span></dt>
<dd>Config file to use</dd>
<dt><code>--context</code> <span class="cli-opt__type">string</span></dt>
<dd>The name of the kubeconfig context to use</dd>
<dt><code>--core-app-timeout</code> <span class="cli-opt__type">duration</span> <span class="cli-opt__default">default <code>20m0s</code></span></dt>
<dd>Timeout to wait for upgrade of each kommander core application</dd>
<dt><code>--disable-appdeployments</code> <span class="cli-opt__type">strings</span> <span class="cli-opt__default">default <code>&#91;dkp-insights-management,dkp-insights&#93;</code></span></dt>
<dd>List of AppDeployments to be disabled during upgrade</dd>
<dt><code>--dry-run</code></dt>
<dd>Do not upgrade, just list the AppDeployments that would be upgraded</dd>
<dt><code>-h</code>, <code>--help</code></dt>
<dd>help for workspace</dd>
<dt><code>--kubeconfig</code> <span class="cli-opt__type">string</span></dt>
<dd>Path to the kubeconfig file to use for CLI requests.</dd>
<dt><code>--platform-apps-timeout</code> <span class="cli-opt__type">duration</span> <span class="cli-opt__default">default <code>30m0s</code></span></dt>
<dd>Timeout to wait for upgrade of the set of platform applications</dd>
<dt><code>--request-timeout</code> <span class="cli-opt__type">string</span></dt>
<dd>The length of time to wait before giving up on a single server request. Non-zero values should contain a corresponding time unit (e.g. 1s, 2m, 3h). A value of zero means don't timeout requests.</dd>
<dt><code>-v</code>, <code>--verbose</code> <span class="cli-opt__type">int</span></dt>
<dd>Output verbosity</dd>
</dl>

### Usage

```bash
nkp upgrade workspace WORKSPACE_NAME [--dry-run] [flags]
```

### Parent command

* [nkp upgrade](nkp_upgrade.md) — Upgrade one of \[addons, capi-components, catalogapp, cluster, kommander, workspace\]
