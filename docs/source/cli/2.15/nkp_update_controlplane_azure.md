---
title: nkp update controlplane azure
sidebar_label: nkp update controlplane azure
sidebar_position: 10
cli_generated: true
unlisted: true
hide_table_of_contents: true
displayed_sidebar: tutorialSidebar
nkp_minor: 2.15
nkp_patch: 2.15.2
nkp_command_id: nkp_update_controlplane_azure
nkp_command_kind: leaf
---

<div class="cli-doc-ref" aria-hidden="true"></div>

Update a Kubernetes cluster control plane in Azure

### Options

<dl class="cli-opts">
<dt><code>-c</code>, <code>--cluster-name</code> <span class="cli-opt__type">name</span></dt>
<dd>Name used to prefix the cluster and all the created resources.</dd>
<dt><code>--compute-gallery-id</code> <span class="cli-opt__type">string</span></dt>
<dd>Compute Gallery ID of a custom image, e.g., '/subscriptions/&lt;subscription id&gt;/resourceGroups/&lt;resource group name&gt;/providers/Microsoft.Compute/galleries/&lt;gallery name&gt;/images/&lt;image definition name&gt;/versions/&lt;version id&gt;' (replacing placeholders with the values used when creating the image)</dd>
<dt><code>-h</code>, <code>--help</code></dt>
<dd>help for azure</dd>
<dt><code>--kubeconfig</code> <span class="cli-opt__type">string</span></dt>
<dd>Path to the kubeconfig for the management cluster. If unspecified, default discovery rules apply.</dd>
<dt><code>--kubernetes-version</code> <span class="cli-opt__type">string</span></dt>
<dd>Kubernetes version</dd>
<dt><code>--machine-size</code> <span class="cli-opt__type">string</span></dt>
<dd>Worker machine size (ex. 'Standard&#95;D2s&#95;v3')</dd>
<dt><code>-n</code>, <code>--namespace</code> <span class="cli-opt__type">string</span> <span class="cli-opt__default">default <code>default</code></span></dt>
<dd>If present, the namespace scope for this CLI request.</dd>
<dt><code>--plan-offer</code> <span class="cli-opt__type">string</span></dt>
<dd>The offer for a Marketplace image or a custom image sourced from a Marketplace image requiring Plan information.</dd>
<dt><code>--plan-publisher</code> <span class="cli-opt__type">string</span></dt>
<dd>The publisher for a Marketplace image or a custom image sourced from a Marketplace image requiring Plan information.</dd>
<dt><code>--plan-sku</code> <span class="cli-opt__type">string</span></dt>
<dd>The SKU for a Marketplace image or a custom image sourced from a Marketplace image requiring Plan information.</dd>
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
nkp update controlplane azure [flags]
```

### Parent command

* [nkp update controlplane](nkp_update_controlplane.md) — Update a Kubernetes cluster control plane, one of \[aks, aws, azure, eks, gcp, preprovisioned, vsphere\]
