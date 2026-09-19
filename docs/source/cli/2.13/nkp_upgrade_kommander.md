---
title: nkp upgrade kommander
sidebar_label: nkp upgrade kommander
sidebar_position: 10
cli_generated: true
unlisted: true
hide_table_of_contents: true
displayed_sidebar: tutorialSidebar
nkp_minor: 2.13
nkp_patch: 2.13.3
nkp_command_id: nkp_upgrade_kommander
nkp_command_kind: leaf
---

<div class="cli-doc-ref" aria-hidden="true"></div>

Upgrade the Kommander version of the targeted cluster

Upgrades all Kommander components and platform applications running on the targeted cluster. No attached clusters and applications running on them are affected by this action.

### Options

<dl class="cli-opts">
<dt><code>--charts-bundle</code> <span class="cli-opt__default">default <code>&#91;&#93;</code></span></dt>
<dd>stringArray Path to charts-bundle to upload to chartmuseum, apart from parsing the kommander applications repository</dd>
<dt><code>--config</code> <span class="cli-opt__type">string</span> <span class="cli-opt__default">default <code>~/.kommander/config</code></span></dt>
<dd>Config file to use</dd>
<dt><code>--context</code> <span class="cli-opt__type">string</span></dt>
<dd>The name of the kubeconfig context to use</dd>
<dt><code>--core-app-timeout</code> <span class="cli-opt__type">duration</span> <span class="cli-opt__default">default <code>20m0s</code></span></dt>
<dd>Timeout to wait for upgrade of each kommander core application</dd>
<dt><code>--disable-appdeployments</code> <span class="cli-opt__type">strings</span> <span class="cli-opt__default">default <code>&#91;dkp-insights-management,dkp-insights&#93;</code></span></dt>
<dd>List of AppDeployments to be disabled during upgrade</dd>
<dt><code>--disallow-charts-download</code></dt>
<dd>make CLI rely solely on provided chart bundles and do not try to download charts from the Internet</dd>
<dt><code>-h</code>, <code>--help</code></dt>
<dd>help for kommander</dd>
<dt><code>--kommander-applications-repository</code> <span class="cli-opt__type">string</span> <span class="cli-opt__default">default <code>v2.13.3</code></span></dt>
<dd>git repository with application definitions</dd>
<dt><code>--kommander-charts-version</code> <span class="cli-opt__type">string</span></dt>
<dd>Kommander helm charts version to download. Default: download all available versions</dd>
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
nkp upgrade kommander [flags]
```

### Parent command

* [nkp upgrade](nkp_upgrade.md) — Upgrade one of \[addons, capi-components, catalogapp, cluster, kommander, workspace\]
