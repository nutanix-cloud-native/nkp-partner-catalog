---
title: nkp create nodepool gcp
sidebar_label: nkp create nodepool gcp
sidebar_position: 10
cli_generated: true
unlisted: true
hide_table_of_contents: true
displayed_sidebar: tutorialSidebar
nkp_minor: 2.19
nkp_patch: 2.19.0-dev
nkp_command_id: nkp_create_nodepool_gcp
nkp_command_kind: leaf
---

<div class="cli-doc-ref" aria-hidden="true"></div>

Create a nodepool in GCP.

Create a nodepool in GCP.

NAME must
  - have no more than 63 characters
  - consist of lower case alphanumeric characters, '-', or '.'
  - must start and end with an alphanumeric character

### Options

<dl class="cli-opts">
<dt><code>--additional-tags</code> <span class="cli-opt__default">default <code>&#91;&#93;</code></span></dt>
<dd>stringToString Tags to apply to the provisioned infrastructure</dd>
<dt><code>--associate-public-ip-address</code> <span class="cli-opt__default">default <code>true</code></span></dt>
<dd>Associate a public IP for all machines. When set to false the specified network must have Cloud NAT configured to provide internet access.</dd>
<dt><code>-c</code>, <code>--cluster-name</code> <span class="cli-opt__type">name</span></dt>
<dd>Name used to prefix the cluster and all the created resources.</dd>
<dt><code>--dry-run</code></dt>
<dd>Only print the objects that would be created, without creating them.</dd>
<dt><code>-h</code>, <code>--help</code></dt>
<dd>help for gcp</dd>
<dt><code>--http-proxy</code> <span class="cli-opt__type">string</span></dt>
<dd>HTTP proxy for nodes</dd>
<dt><code>--https-proxy</code> <span class="cli-opt__type">string</span></dt>
<dd>HTTPS proxy for nodes</dd>
<dt><code>--image</code> <span class="cli-opt__type">string</span></dt>
<dd>Full reference to an image to use for all nodes (set either this or --image-family) (ex. 'projects/my-project/global/images/konvoy-ubuntu-2204-1-99-99-1234567890')</dd>
<dt><code>--image-family</code> <span class="cli-opt__type">string</span></dt>
<dd>Full reference to an image family to use for all nodes (set either this or --image) (ex. 'projects/my-project/global/images/family/nkp-ubuntu-2204-&#123;&#123;.K8sVersion&#125;&#125;')</dd>
<dt><code>--instance-type</code> <span class="cli-opt__type">string</span> <span class="cli-opt__default">default <code>n2-standard-8</code></span></dt>
<dd>Worker machine instance type</dd>
<dt><code>--kubeconfig</code> <span class="cli-opt__type">string</span></dt>
<dd>Path to the kubeconfig for the management cluster. If unspecified, default discovery rules apply.</dd>
<dt><code>--kubernetes-version</code> <span class="cli-opt__type">string</span> <span class="cli-opt__default">default <code>1.36.2</code></span></dt>
<dd>Kubernetes version</dd>
<dt><code>-n</code>, <code>--namespace</code> <span class="cli-opt__type">string</span> <span class="cli-opt__default">default <code>default</code></span></dt>
<dd>If present, the namespace scope for this CLI request.</dd>
<dt><code>--no-proxy</code> <span class="cli-opt__type">strings</span> <span class="cli-opt__default">default <code>&#91;&#93;</code></span></dt>
<dd>No Proxy list for nodes</dd>
<dt><code>-o</code>, <code>--output</code> <span class="cli-opt__type">string</span></dt>
<dd>Output format. One of: (json, yaml, name).</dd>
<dt><code>--output-directory</code> <span class="cli-opt__type">string</span></dt>
<dd>Used with --output=json|yaml. The directory where to output resources to files. The directory must already exist.</dd>
<dt><code>--registry-mirror-cacert</code></dt>
<dd>file Path to file containing the CA certificate used to verify the registry mirror server certificate</dd>
<dt><code>--registry-mirror-password</code> <span class="cli-opt__type">string</span></dt>
<dd>Password used to authenticate with the registry mirror</dd>
<dt><code>--registry-mirror-url</code> <span class="cli-opt__type">url</span></dt>
<dd>URL of a container registry used as a mirror (required for air-gapped installations)</dd>
<dt><code>--registry-mirror-username</code> <span class="cli-opt__type">string</span></dt>
<dd>Username used to authenticate with the registry mirror</dd>
<dt><code>--replicas</code> <span class="cli-opt__type">int32</span> <span class="cli-opt__default">default <code>1</code></span></dt>
<dd>Number of replicas</dd>
<dt><code>--service-account-email</code> <span class="cli-opt__type">string</span> <span class="cli-opt__default">default <code>default</code></span></dt>
<dd>Worker machine Service Account email address</dd>
<dt><code>--show-managed-fields</code></dt>
<dd>If true, keep the managedFields when printing objects in JSON or YAML format.</dd>
<dt><code>--ssh-public-key-file</code> <span class="cli-opt__type">string</span></dt>
<dd>Path to the authorized SSH key for the user</dd>
<dt><code>--ssh-username</code> <span class="cli-opt__type">string</span> <span class="cli-opt__default">default <code>konvoy</code></span></dt>
<dd>Name of the user to create on the instance</dd>
<dt><code>--timeout</code> <span class="cli-opt__type">duration</span> <span class="cli-opt__default">default <code>30m0s</code></span></dt>
<dd>The length of time to wait before giving up. Zero means wait forever (e.g. 300s, 30m, 3h).</dd>
<dt><code>--use-context</code> <span class="cli-opt__type">string</span></dt>
<dd>Use a specific context in a kubeconfig file.</dd>
<dt><code>-v</code>, <code>--verbose</code> <span class="cli-opt__type">int</span></dt>
<dd>Output verbosity</dd>
<dt><code>--wait</code></dt>
<dd>If true, wait for operations to complete before returning.</dd>
<dt><code>--zone</code> <span class="cli-opt__type">string</span></dt>
<dd>Zone in the region to deploy the worker nodes to, if not set a random one will be selected (ex. us-west1-a)</dd>
</dl>

### Usage

```bash
nkp create nodepool gcp NAME [flags]
```

### Parent command

* [nkp create nodepool](nkp_create_nodepool.md) — Nodepool one of \[aks, aws, azure, docker, eks, gcp, metal, nutanix, preprovisioned, vsphere\]
