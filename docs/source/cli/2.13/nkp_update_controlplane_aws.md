---
title: nkp update controlplane aws
sidebar_label: nkp update controlplane aws
sidebar_position: 10
cli_generated: true
unlisted: true
hide_table_of_contents: true
displayed_sidebar: tutorialSidebar
nkp_minor: 2.13
nkp_patch: 2.13.3
nkp_command_id: nkp_update_controlplane_aws
nkp_command_kind: leaf
---

<div class="cli-doc-ref" aria-hidden="true"></div>

Update a Kubernetes cluster control plane in AWS

### Options

<dl class="cli-opts">
<dt><code>--ami</code> <span class="cli-opt__type">string</span></dt>
<dd>AMI ID to use for machines</dd>
<dt><code>--ami-base-os</code> <span class="cli-opt__type">string</span></dt>
<dd>Base OS used in search of AMIs. Examples: 'ubuntu-18.04', 'ubuntu-20.04'</dd>
<dt><code>--ami-format</code> <span class="cli-opt__type">string</span></dt>
<dd>Query string used in search of AMIs. Example: When --ami-base-os='rhel8.4', then the string 'prefix-&#123;&#123;.BaseOS&#125;&#125;-?&#123;&#123;.K8sVersion&#125;&#125;-&#42;' matches any AMIs with the Name 'prefix-rhel8.4-1.30.10</dd>
<dt><code>--ami-owner</code> <span class="cli-opt__type">string</span></dt>
<dd>ID of AWS account used in search of AMIs</dd>
<dt><code>-c</code>, <code>--cluster-name</code> <span class="cli-opt__type">name</span></dt>
<dd>Name used to prefix the cluster and all the created resources.</dd>
<dt><code>-h</code>, <code>--help</code></dt>
<dd>help for aws</dd>
<dt><code>--instance-type</code> <span class="cli-opt__type">string</span></dt>
<dd>Instance type to use for control plane machines</dd>
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
nkp update controlplane aws [flags]
```

### Parent command

* [nkp update controlplane](nkp_update_controlplane.md) — Update a Kubernetes cluster control plane, one of \[aks, aws, azure, eks, gcp, preprovisioned, vcd, vsphere\]
