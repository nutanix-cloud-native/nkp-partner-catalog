---
title: nkp update cluster nutanix-registry-credentials
sidebar_label: nkp update cluster nutanix-registry-credentials
sidebar_position: 10
cli_generated: true
unlisted: true
hide_table_of_contents: true
displayed_sidebar: tutorialSidebar
nkp_minor: 2.19
nkp_patch: 2.19.0-dev
nkp_command_id: nkp_update_cluster_nutanix-registry-credentials
nkp_command_kind: leaf
---

<div class="cli-doc-ref" aria-hidden="true"></div>

Set or rotate Nutanix DockerHub credentials on cluster(s).

Set or rotate the Nutanix DockerHub credentials used to pull NKP images.

This command updates the Nutanix DockerHub credentials Secret
(&lt;cluster-name&gt;-dockerhub-nutanix-credentials).

Use --cluster-name to target a single cluster, --all to target every cluster in
the selected namespace, or --all-namespaces to set the credentials on the
management cluster and every workload cluster in the fleet.

### Options

<dl class="cli-opts">
<dt><code>--all</code></dt>
<dd>Set the credentials on every cluster in the selected namespace.</dd>
<dt><code>--all-namespaces</code></dt>
<dd>Set the credentials on the management cluster and every workload cluster in the fleet.</dd>
<dt><code>-c</code>, <code>--cluster-name</code> <span class="cli-opt__type">name</span></dt>
<dd>Name used to prefix the cluster and all the created resources.</dd>
<dt><code>-h</code>, <code>--help</code></dt>
<dd>help for nutanix-registry-credentials</dd>
<dt><code>--kubeconfig</code> <span class="cli-opt__type">string</span></dt>
<dd>Path to the kubeconfig for the management cluster. If unspecified, default discovery rules apply.</dd>
<dt><code>-n</code>, <code>--namespace</code> <span class="cli-opt__type">string</span> <span class="cli-opt__default">default <code>default</code></span></dt>
<dd>If present, the namespace scope for this CLI request.</dd>
<dt><code>--nutanix-registry-password</code> <span class="cli-opt__type">string</span></dt>
<dd>Personal access token (PAT) for the Nutanix DockerHub organization, used to pull NKP images.</dd>
<dt><code>--nutanix-registry-username</code> <span class="cli-opt__type">string</span></dt>
<dd>Username for the Nutanix DockerHub organization, used to pull NKP images.</dd>
<dt><code>--use-context</code> <span class="cli-opt__type">string</span></dt>
<dd>Use a specific context in a kubeconfig file.</dd>
<dt><code>-v</code>, <code>--verbose</code> <span class="cli-opt__type">int</span></dt>
<dd>Output verbosity</dd>
</dl>

### Usage

```bash
nkp update cluster nutanix-registry-credentials [flags]
```

### Parent command

* [nkp update cluster](nkp_update_cluster.md) — Update cluster resources
