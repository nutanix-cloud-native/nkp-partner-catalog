---
title: nkp update nodepool gcp
sidebar_label: nkp update nodepool gcp
sidebar_position: 10
cli_generated: true
unlisted: true
hide_table_of_contents: true
displayed_sidebar: tutorialSidebar
nkp_minor: 2.12
nkp_patch: 2.12.2
nkp_command_id: nkp_update_nodepool_gcp
nkp_command_kind: leaf
---

<div class="cli-doc-ref" aria-hidden="true"></div>

Update a Konvoy cluster node pool in GCP

### Options

<dl class="cli-opts">
<dt><code>-c</code>, <code>--cluster-name</code> <span class="cli-opt__type">name</span></dt>
<dd>Name used to prefix the cluster and all the created resources.</dd>
<dt><code>-h</code>, <code>--help</code></dt>
<dd>help for gcp</dd>
<dt><code>--image</code> <span class="cli-opt__type">string</span></dt>
<dd>Full reference to an image to use for all nodes (set either this or --image-family) (ex. 'projects/my-project/global/images/konvoy-ubuntu-2004-1-99-99-1234567890')</dd>
<dt><code>--image-family</code> <span class="cli-opt__type">string</span></dt>
<dd>Full reference to an image family to use for all nodes (set either this or --image) (ex. 'projects/my-project/global/images/family/konvoy-ubuntu-2004-&#123;&#123;.K8sVersion&#125;&#125;')</dd>
<dt><code>--instance-type</code> <span class="cli-opt__type">string</span></dt>
<dd>Worker machine instance type (ex. "n2-standard-8")</dd>
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
nkp update nodepool gcp [flags]
```

### Parent command

* [nkp update nodepool](nkp_update_nodepool.md) — Upate a Kubernetes cluster node pool, one of \[aws, azure, eks, gcp, preprovisioned, vcd, vsphere\]
