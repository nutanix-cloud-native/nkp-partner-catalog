---
title: nkp create nodepool nutanix
sidebar_label: nkp create nodepool nutanix
sidebar_position: 10
cli_generated: true
unlisted: true
hide_table_of_contents: true
displayed_sidebar: tutorialSidebar
nkp_minor: 2.19
nkp_patch: 2.19.0-dev
nkp_command_id: nkp_create_nodepool_nutanix
nkp_command_kind: leaf
---

<div class="cli-doc-ref" aria-hidden="true"></div>

Create a nodepool in Nutanix.

Create a nodepool in Nutanix.

NAME must
  - have no more than 63 characters
  - consist of lower case alphanumeric characters, '-', or '.'
  - must start and end with an alphanumeric character

### Options

<dl class="cli-opts">
<dt><code>-c</code>, <code>--cluster-name</code> <span class="cli-opt__type">name</span></dt>
<dd>Name used to prefix the cluster and all the created resources.</dd>
<dt><code>--cores-per-vcpu</code> <span class="cli-opt__type">int32</span> <span class="cli-opt__default">default <code>1</code></span></dt>
<dd>The number of cores per vCPU(equivalent to CPU cores) to use in a worker machine</dd>
<dt><code>--disk-size</code> <span class="cli-opt__type">int32</span> <span class="cli-opt__default">default <code>80</code></span></dt>
<dd>The size of the primary disk (in GiB) of a worker machine</dd>
<dt><code>--dry-run</code></dt>
<dd>Only print the objects that would be created, without creating them.</dd>
<dt><code>--gpu-count</code> <span class="cli-opt__type">int32</span> <span class="cli-opt__default">default <code>1</code></span></dt>
<dd>Number of GPUs per VM in the nodepool.</dd>
<dt><code>--gpu-name</code> <span class="cli-opt__type">string</span></dt>
<dd>Name of the GPU resource. Can be either vGPU profile or name of passthrough GPU. On Prism Central 7.6 or later, it's recommended to use --gpu-profile-name instead.</dd>
<dt><code>--gpu-profile-name</code> <span class="cli-opt__type">string</span></dt>
<dd>Name of the AHV GPU profile to assign to each VM in the nodepool. Only supported on Prism Central 7.6 or later. Cannot be used together with --gpu-name.</dd>
<dt><code>-h</code>, <code>--help</code></dt>
<dd>help for nutanix</dd>
<dt><code>--kubeconfig</code> <span class="cli-opt__type">string</span></dt>
<dd>Path to the kubeconfig for the management cluster. If unspecified, default discovery rules apply.</dd>
<dt><code>--kubernetes-version</code> <span class="cli-opt__type">string</span> <span class="cli-opt__default">default <code>1.36.2</code></span></dt>
<dd>Kubernetes version</dd>
<dt><code>--memory</code> <span class="cli-opt__type">int32</span> <span class="cli-opt__default">default <code>32</code></span></dt>
<dd>The size of memory (in GiB) of a worker machine</dd>
<dt><code>-n</code>, <code>--namespace</code> <span class="cli-opt__type">string</span> <span class="cli-opt__default">default <code>kommander</code></span></dt>
<dd>If present, the namespace scope for this CLI request.</dd>
<dt><code>-o</code>, <code>--output</code> <span class="cli-opt__type">string</span></dt>
<dd>Output format. One of: (json, yaml, name).</dd>
<dt><code>--output-directory</code> <span class="cli-opt__type">string</span></dt>
<dd>Used with --output=json|yaml. The directory where to output resources to files. The directory must already exist.</dd>
<dt><code>--pc-categories</code> <span class="cli-opt__type">strings</span> <span class="cli-opt__default">default <code>&#91;&#93;</code></span></dt>
<dd>Names of Prism Central categories to associate with worker resources (VMs, VGs, etc). Example: key1=value1,key1=value2,key2=value2</dd>
<dt><code>--pc-project</code> <span class="cli-opt__type">string</span></dt>
<dd>Name of Prism Central project to associate with worker resources (VMs, VGs, etc).</dd>
<dt><code>--prism-element-cluster</code> <span class="cli-opt__type">string</span></dt>
<dd>Name of the Prism Element cluster to use to create a worker machine</dd>
<dt><code>--replicas</code> <span class="cli-opt__type">int32</span> <span class="cli-opt__default">default <code>1</code></span></dt>
<dd>Number of replicas</dd>
<dt><code>--show-managed-fields</code></dt>
<dd>If true, keep the managedFields when printing objects in JSON or YAML format.</dd>
<dt><code>--skip-preflight-checks</code> <span class="cli-opt__type">strings</span> <span class="cli-opt__default">default <code>&#91;&#93;</code></span></dt>
<dd>Skip preflight checks. Use "all" to skip all checks, a comma-separated list of names to skip specific checks, or "" to run all checks, even if checks were previously skipped.</dd>
<dt><code>--subnets</code> <span class="cli-opt__type">strings</span> <span class="cli-opt__default">default <code>&#91;&#93;</code></span></dt>
<dd>Names of Prism Central subnets to use for worker machines. Example: subnet1,subnet2,subnet3</dd>
<dt><code>--timeout</code> <span class="cli-opt__type">duration</span> <span class="cli-opt__default">default <code>30m0s</code></span></dt>
<dd>The length of time to wait before giving up. Zero means wait forever (e.g. 300s, 30m, 3h).</dd>
<dt><code>--use-context</code> <span class="cli-opt__type">string</span></dt>
<dd>Use a specific context in a kubeconfig file.</dd>
<dt><code>--vcpus</code> <span class="cli-opt__type">int32</span> <span class="cli-opt__default">default <code>8</code></span></dt>
<dd>The number of vCPUs(equivalent to CPU sockets) to use in a worker machine</dd>
<dt><code>-v</code>, <code>--verbose</code> <span class="cli-opt__type">int</span></dt>
<dd>Output verbosity</dd>
<dt><code>--vm-image</code> <span class="cli-opt__type">string</span></dt>
<dd>Name of OS image to use for worker machines.</dd>
<dt><code>--vm-profile</code> <span class="cli-opt__type">string</span></dt>
<dd>Name of the VM profile to use for worker machine. Cannot be used with machine configuration flags: --cores-per-vcpu, --vcpus, --memory, --gpu-name, --gpu-profile-name, --gpu-count.</dd>
<dt><code>--wait</code></dt>
<dd>If true, wait for operations to complete before returning.</dd>
<dt><code>--worker-failure-domain</code> <span class="cli-opt__type">string</span></dt>
<dd>The failure-domain used to provision the worker nodepool machines. These failure-domain types are supported:</dd>
</dl>

### Usage

```bash
nkp create nodepool nutanix NAME [flags]
```

### Parent command

* [nkp create nodepool](nkp_create_nodepool.md) — Nodepool one of \[aks, aws, azure, docker, eks, gcp, metal, nutanix, preprovisioned, vsphere\]
