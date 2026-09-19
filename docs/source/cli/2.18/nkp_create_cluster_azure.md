---
title: nkp create cluster azure
sidebar_label: nkp create cluster azure
sidebar_position: 10
cli_generated: true
unlisted: true
hide_table_of_contents: true
displayed_sidebar: tutorialSidebar
nkp_minor: 2.18
nkp_patch: 2.18.0
nkp_command_id: nkp_create_cluster_azure
nkp_command_kind: leaf
---

<div class="cli-doc-ref" aria-hidden="true"></div>

Create a Konvoy cluster in Azure

### Options

<dl class="cli-opts">
<dt><code>--additional-tags</code> <span class="cli-opt__default">default <code>&#91;&#93;</code></span></dt>
<dd>stringToString Tags to apply to the provisioned infrastructure</dd>
<dt><code>--aws-service-endpoints</code> <span class="cli-opt__type">string</span></dt>
<dd>Custom AWS service endpoints in a semi-colon separated format: $&#123;SigningRegion1&#125;:$&#123;ServiceID1&#125;=$&#123;URL&#125;,$&#123;ServiceID2&#125;=$&#123;URL&#125;;$&#123;SigningRegion2&#125;...</dd>
<dt><code>--bootstrap-cluster-image</code> <span class="cli-opt__type">string</span> <span class="cli-opt__default">default <code>docker.io/mesosphere/konvoy-bootstrap:v2.18.0</code></span></dt>
<dd>Container image used to create the bootstrap cluster. Can be an image name or path to a file, e.g., ./nkp-v2.18.0/konvoy-bootstrap-image-v2.18.0.tar. If not provided, the default image will be used</dd>
<dt><code>--capi-additional-sync-machine-annotations</code> <span class="cli-opt__type">string</span></dt>
<dd>Comma-separated list of regex patterns for additional machine annotations that should be synced to Nodes. Use this with create commands that perform a fresh CAPI components installation (for example: create bootstrap, create capi-components, or create cluster --self-managed). These are added to the default patterns: ^nvidia\.com/.&#42;,^nutanix\.com/.&#42;,^amd\.com/.&#42;</dd>
<dt><code>--capi-additional-sync-machine-labels</code> <span class="cli-opt__type">string</span></dt>
<dd>Comma-separated list of regex patterns for additional machine labels that should be synced to Nodes. Use this with create commands that perform a fresh CAPI components installation (for example: create bootstrap, create capi-components, or create cluster --self-managed). These are added to the default patterns: ^nvidia\.com/.&#42;,^nutanix\.com/.&#42;,^amd\.com/.&#42;</dd>
<dt><code>-c</code>, <code>--cluster-name</code> <span class="cli-opt__type">name</span></dt>
<dd>Name used to prefix the cluster and all the created resources.</dd>
<dt><code>--compute-gallery-id</code> <span class="cli-opt__type">string</span></dt>
<dd>Compute Gallery ID of a custom image, e.g., '/subscriptions/&lt;subscription id&gt;/resourceGroups/&lt;resource group name&gt;/providers/Microsoft.Compute/galleries/&lt;gallery name&gt;/images/&lt;image definition name&gt;/versions/&lt;version id&gt;' (replacing placeholders with the values used when creating the image)</dd>
<dt><code>--control-plane-http-proxy</code> <span class="cli-opt__type">string</span></dt>
<dd>HTTP proxy for control plane machines</dd>
<dt><code>--control-plane-https-proxy</code> <span class="cli-opt__type">string</span></dt>
<dd>HTTPS proxy for control plane machines</dd>
<dt><code>--control-plane-machine-size</code> <span class="cli-opt__type">string</span> <span class="cli-opt__default">default <code>Standard&#95;D4s&#95;v3</code></span></dt>
<dd>Control Plane machine size</dd>
<dt><code>--control-plane-no-proxy</code> <span class="cli-opt__type">strings</span> <span class="cli-opt__default">default <code>&#91;&#93;</code></span></dt>
<dd>No Proxy list for control plane machines</dd>
<dt><code>--control-plane-renew-certificates-before</code> <span class="cli-opt__type">int32</span> <span class="cli-opt__default">default <code>180</code></span></dt>
<dd>Enables automated control-plane certificates renewal. Provide the number of days between 7 and 360 when to trigger the certificate renewal. The renewal process will trigger new control-plane Machines to be created. A value of 0 disables the feature.</dd>
<dt><code>--control-plane-replicas</code> <span class="cli-opt__type">int32</span> <span class="cli-opt__default">default <code>3</code></span></dt>
<dd>Number of control plane nodes</dd>
<dt><code>--dry-run</code></dt>
<dd>Only print the objects that would be created, without creating them.</dd>
<dt><code>--etcd-image-repository</code> <span class="cli-opt__type">string</span></dt>
<dd>The image repository to use for pulling the etcd image</dd>
<dt><code>--etcd-version</code> <span class="cli-opt__type">string</span></dt>
<dd>The version of etcd to use.</dd>
<dt><code>--extra-sans</code> <span class="cli-opt__type">strings</span> <span class="cli-opt__default">default <code>&#91;&#93;</code></span></dt>
<dd>A comma separated list of additional Subject Alternative Names for the API Server signing cert</dd>
<dt><code>-h</code>, <code>--help</code></dt>
<dd>help for azure</dd>
<dt><code>--http-proxy</code> <span class="cli-opt__type">string</span></dt>
<dd>HTTP proxy for CAPI controllers</dd>
<dt><code>--https-proxy</code> <span class="cli-opt__type">string</span></dt>
<dd>HTTPS proxy for CAPI controllers</dd>
<dt><code>--kubeconfig</code> <span class="cli-opt__type">string</span></dt>
<dd>Path to the kubeconfig for the management cluster. If unspecified, default discovery rules apply. This flag is ignored if used with the --self-managed flag.</dd>
<dt><code>--kubernetes-image-repository</code> <span class="cli-opt__type">string</span></dt>
<dd>The image repository to use for pulling kubernetes images</dd>
<dt><code>--kubernetes-pod-network-cidr</code> <span class="cli-opt__default">default <code>192.168.0.0/16</code></span></dt>
<dd>cidr The Kubernetes Pod network CIDR to use in the cluster</dd>
<dt><code>--kubernetes-service-cidr</code> <span class="cli-opt__default">default <code>10.96.0.0/12</code></span></dt>
<dd>cidr The Kubernetes Service CIDR to use in the cluster</dd>
<dt><code>--kubernetes-version</code> <span class="cli-opt__type">string</span> <span class="cli-opt__default">default <code>1.35.2</code></span></dt>
<dd>Kubernetes version</dd>
<dt><code>--location</code> <span class="cli-opt__type">string</span> <span class="cli-opt__default">default <code>westus</code></span></dt>
<dd>Azure location to deploy cluster to</dd>
<dt><code>-n</code>, <code>--namespace</code> <span class="cli-opt__type">string</span> <span class="cli-opt__default">default <code>default</code></span></dt>
<dd>If present, the namespace scope for this CLI request.</dd>
<dt><code>--no-proxy</code> <span class="cli-opt__type">strings</span> <span class="cli-opt__default">default <code>&#91;&#93;</code></span></dt>
<dd>No Proxy list for CAPI controllers</dd>
<dt><code>-o</code>, <code>--output</code> <span class="cli-opt__type">string</span></dt>
<dd>Output format. One of: (json, yaml, name).</dd>
<dt><code>--output-directory</code> <span class="cli-opt__type">string</span></dt>
<dd>Used with --output=json|yaml. The directory where to output resources to files. The directory must already exist.</dd>
<dt><code>--plan-offer</code> <span class="cli-opt__type">string</span></dt>
<dd>The offer for a Marketplace image or a custom image sourced from a Marketplace image requiring Plan information.</dd>
<dt><code>--plan-publisher</code> <span class="cli-opt__type">string</span></dt>
<dd>The publisher for a Marketplace image or a custom image sourced from a Marketplace image requiring Plan information.</dd>
<dt><code>--plan-sku</code> <span class="cli-opt__type">string</span></dt>
<dd>The SKU for a Marketplace image or a custom image sourced from a Marketplace image requiring Plan information.</dd>
<dt><code>--registry-mirror-cacert</code></dt>
<dd>file Path to file containing the CA certificate used to verify the registry mirror server certificate</dd>
<dt><code>--registry-mirror-password</code> <span class="cli-opt__type">string</span></dt>
<dd>Password used to authenticate with the registry mirror</dd>
<dt><code>--registry-mirror-url</code> <span class="cli-opt__type">url</span></dt>
<dd>URL of a container registry used as a mirror (required for air-gapped installations)</dd>
<dt><code>--registry-mirror-username</code> <span class="cli-opt__type">string</span></dt>
<dd>Username used to authenticate with the registry mirror</dd>
<dt><code>--self-managed</code> <span class="cli-opt__default">default <code>false</code></span></dt>
<dd>When set to true, the required prerequisites are created before creating the cluster and the resulting cluster has all necessary components deployed onto itself, so it can manage its own cluster lifecycle. When set to false, a management cluster is used.</dd>
<dt><code>--show-managed-fields</code></dt>
<dd>If true, keep the managedFields when printing objects in JSON or YAML format.</dd>
<dt><code>--ssh-public-key-file</code> <span class="cli-opt__type">string</span></dt>
<dd>Path to the authorized SSH key for the user</dd>
<dt><code>--ssh-username</code> <span class="cli-opt__type">string</span> <span class="cli-opt__default">default <code>konvoy</code></span></dt>
<dd>Name of the user to create on the instance</dd>
<dt><code>--timeout</code> <span class="cli-opt__type">duration</span> <span class="cli-opt__default">default <code>30m0s</code></span></dt>
<dd>The length of time to wait before giving up. Zero means wait forever (e.g. 300s, 30m, 3h).</dd>
<dt><code>-v</code>, <code>--verbose</code> <span class="cli-opt__type">int</span></dt>
<dd>Output verbosity</dd>
<dt><code>--wait</code> <span class="cli-opt__default">default <code>true</code></span></dt>
<dd>If true, wait for operations to complete before returning. This flag is ignored and will always be 'true' if used with the --self-managed flag.</dd>
<dt><code>--with-aws-bootstrap-credentials</code></dt>
<dd>Set true to use AWS bootstrap credentials from your environment. When false, the instance profile of the EC2 instance where the CAPA controller is scheduled on will be used instead.</dd>
<dt><code>--with-gcp-bootstrap-credentials</code></dt>
<dd>Set true to use GCP bootstrap credentials from your environment. When false, the service account of the VM instance where the CAPG controller is scheduled on will be used instead.</dd>
<dt><code>--worker-availability-zone</code> <span class="cli-opt__type">string</span></dt>
<dd>The availability zone in the region to deploy the worker nodes to, if not set a random one will be selected (ex. 1). Not all locations, including the default 'westus', support setting this flag, see https://docs.microsoft.com/en-us/azure/availability-zones/az-overview.</dd>
<dt><code>--worker-http-proxy</code> <span class="cli-opt__type">string</span></dt>
<dd>HTTP proxy for nodes</dd>
<dt><code>--worker-https-proxy</code> <span class="cli-opt__type">string</span></dt>
<dd>HTTPS proxy for nodes</dd>
<dt><code>--worker-machine-size</code> <span class="cli-opt__type">string</span> <span class="cli-opt__default">default <code>Standard&#95;D8s&#95;v3</code></span></dt>
<dd>Worker machine size</dd>
<dt><code>--worker-no-proxy</code> <span class="cli-opt__type">strings</span> <span class="cli-opt__default">default <code>&#91;&#93;</code></span></dt>
<dd>No Proxy list for nodes</dd>
<dt><code>--worker-replicas</code> <span class="cli-opt__type">int32</span> <span class="cli-opt__default">default <code>4</code></span></dt>
<dd>Number of workers</dd>
</dl>

### Usage

```bash
nkp create cluster azure [flags]
```

### Parent command

* [nkp create cluster](nkp_create_cluster.md) — Create a Kubernetes cluster, one of \[aks, aws, azure, eks, gcp, nutanix, preprovisioned, vsphere\]
