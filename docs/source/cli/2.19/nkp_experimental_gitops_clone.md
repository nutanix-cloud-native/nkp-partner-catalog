---
title: nkp experimental gitops clone
sidebar_label: nkp experimental gitops clone
sidebar_position: 10
cli_generated: true
unlisted: true
hide_table_of_contents: true
displayed_sidebar: tutorialSidebar
nkp_minor: 2.19
nkp_patch: 2.19.0-dev
nkp_command_id: nkp_experimental_gitops_clone
nkp_command_kind: leaf
---

<div class="cli-doc-ref" aria-hidden="true"></div>

clone a repo hosted on NKP Gitops system

### Options

<dl class="cli-opts">
<dt><code>--config</code> <span class="cli-opt__type">string</span> <span class="cli-opt__default">default <code>~/.kommander/config</code></span></dt>
<dd>Config file to use</dd>
<dt><code>--context</code> <span class="cli-opt__type">string</span></dt>
<dd>The name of the kubeconfig context to use</dd>
<dt><code>--git-claim-user-name</code> <span class="cli-opt__type">string</span> <span class="cli-opt__default">default <code>kommander</code></span></dt>
<dd>Name of the GitClaimUser (GitClaim will be deduced from GitClaimUser)</dd>
<dt><code>--git-claim-user-namespace</code> <span class="cli-opt__type">string</span> <span class="cli-opt__default">default <code>kommander</code></span></dt>
<dd>Namespace of the GitClaimUser (GitClaim will be deduced from GitClaimUser)</dd>
<dt><code>-h</code>, <code>--help</code></dt>
<dd>help for clone</dd>
<dt><code>--kubeconfig</code> <span class="cli-opt__type">string</span></dt>
<dd>Path to the kubeconfig file to use for CLI requests.</dd>
<dt><code>--output-dir</code> <span class="cli-opt__type">string</span></dt>
<dd>Output path to clone the repo</dd>
<dt><code>--request-timeout</code> <span class="cli-opt__type">string</span></dt>
<dd>The length of time to wait before giving up on a single server request. Non-zero values should contain a corresponding time unit (e.g. 1s, 2m, 3h). A value of zero means don't timeout requests.</dd>
<dt><code>-v</code>, <code>--verbose</code> <span class="cli-opt__type">int</span></dt>
<dd>Output verbosity</dd>
</dl>

### Usage

```bash
nkp experimental gitops clone [flags]
```

### Parent command

* [nkp experimental gitops](nkp_experimental_gitops.md) — commands to interact with NKP's Gitops Host
