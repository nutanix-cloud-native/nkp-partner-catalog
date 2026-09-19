---
title: nkp update controlplane preprovisioned
sidebar_label: nkp update controlplane preprovisioned
sidebar_position: 10
cli_generated: true
unlisted: true
hide_table_of_contents: true
displayed_sidebar: tutorialSidebar
nkp_minor: 2.16
nkp_patch: 2.16.1
nkp_command_id: nkp_update_controlplane_preprovisioned
nkp_command_kind: leaf
---

<div class="cli-doc-ref" aria-hidden="true"></div>

Update a Kubernetes cluster control plane in Preprovisioned

### Options

<dl class="cli-opts">
<dt><code>-c</code>, <code>--cluster-name</code> <span class="cli-opt__type">name</span></dt>
<dd>Name used to prefix the cluster and all the created resources.</dd>
<dt><code>--control-plane-renew-certificates-before</code> <span class="cli-opt__type">int32</span></dt>
<dd>Enables automated control-plane certificates renewal. Provide the number of days between 7 and 360 when to trigger the certificate renewal. The renewal process will trigger new control-plane Machines to be created. A value of 0 disables the feature.</dd>
<dt><code>-h</code>, <code>--help</code></dt>
<dd>help for preprovisioned</dd>
<dt><code>--kubeconfig</code> <span class="cli-opt__type">string</span></dt>
<dd>Path to the kubeconfig for the management cluster. If unspecified, default discovery rules apply.</dd>
<dt><code>--kubernetes-version</code> <span class="cli-opt__type">string</span></dt>
<dd>Kubernetes version</dd>
<dt><code>-n</code>, <code>--namespace</code> <span class="cli-opt__type">string</span> <span class="cli-opt__default">default <code>default</code></span></dt>
<dd>If present, the namespace scope for this CLI request.</dd>
<dt><code>--timeout</code> <span class="cli-opt__type">duration</span> <span class="cli-opt__default">default <code>30m0s</code></span></dt>
<dd>The length of time to wait before giving up. Zero means wait forever (e.g. 300s, 30m, 3h).</dd>
<dt><code>--use-context</code> <span class="cli-opt__type">string</span></dt>
<dd>Use a specific context in a kubeconfig file.</dd>
<dt><code>-v</code>, <code>--verbose</code> <span class="cli-opt__type">int</span></dt>
<dd>Output verbosity</dd>
<dt><code>--wait</code> <span class="cli-opt__default">default <code>true</code></span></dt>
<dd>If true, wait for operations to complete before returning.</dd>
</dl>

### Usage

```bash
nkp update controlplane preprovisioned [flags]
```

### Parent command

* [nkp update controlplane](nkp_update_controlplane.md) — Update a Kubernetes cluster control plane, one of \[aks, aws, azure, eks, gcp, nutanix, preprovisioned, vsphere\]
