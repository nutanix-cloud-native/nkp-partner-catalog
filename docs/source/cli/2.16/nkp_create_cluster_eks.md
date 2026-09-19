---
title: nkp create cluster eks
sidebar_label: nkp create cluster eks
sidebar_position: 10
cli_generated: true
unlisted: true
hide_table_of_contents: true
displayed_sidebar: tutorialSidebar
nkp_minor: 2.16
nkp_patch: 2.16.1
nkp_command_id: nkp_create_cluster_eks
nkp_command_kind: leaf
---

<div class="cli-doc-ref" aria-hidden="true"></div>

Create a Konvoy cluster in EKS

### Options

<dl class="cli-opts">
<dt><code>--additional-security-group-ids</code> <span class="cli-opt__type">strings</span> <span class="cli-opt__default">default <code>&#91;&#93;</code></span></dt>
<dd>A comma separated list of existing security group IDs to use for machines in addition to those created automatically</dd>
<dt><code>--additional-tags</code> <span class="cli-opt__default">default <code>&#91;&#93;</code></span></dt>
<dd>stringToString Tags to apply to the provisioned infrastructure</dd>
<dt><code>--allow-missing-template-keys</code> <span class="cli-opt__default">default <code>true</code></span></dt>
<dd>If true, ignore any errors in templates when a field or map key is missing in the template. Only applies to golang and jsonpath output formats.</dd>
<dt><code>--aws-service-endpoints</code> <span class="cli-opt__type">string</span></dt>
<dd>Custom AWS service endpoints in a semi-colon separated format: $&#123;SigningRegion1&#125;:$&#123;ServiceID1&#125;=$&#123;URL&#125;,$&#123;ServiceID2&#125;=$&#123;URL&#125;;$&#123;SigningRegion2&#125;...</dd>
<dt><code>--bootstrap-cluster-image</code> <span class="cli-opt__type">string</span> <span class="cli-opt__default">default <code>docker.io/mesosphere/konvoy-bootstrap:v2.16.1</code></span></dt>
<dd>Container image used to create the bootstrap cluster. Can be an image name or path to a filee.g. ./nkp-v2.16.1/konvoy-bootstrap-image-v2.16.1.tar. If not provided, the default image will be used</dd>
<dt><code>-c</code>, <code>--cluster-name</code> <span class="cli-opt__type">name</span></dt>
<dd>Name used to prefix the cluster and all the created resources.</dd>
<dt><code>--dry-run</code></dt>
<dd>Only print the objects that would be created, without creating them.</dd>
<dt><code>-h</code>, <code>--help</code></dt>
<dd>help for eks</dd>
<dt><code>--http-proxy</code> <span class="cli-opt__type">string</span></dt>
<dd>HTTP proxy for CAPI controllers</dd>
<dt><code>--https-proxy</code> <span class="cli-opt__type">string</span></dt>
<dd>HTTPS proxy for CAPI controllers</dd>
<dt><code>--kubeconfig</code> <span class="cli-opt__type">string</span></dt>
<dd>Path to the kubeconfig for the management cluster. If unspecified, default discovery rules apply.</dd>
<dt><code>--kubernetes-pod-network-cidr</code> <span class="cli-opt__default">default <code>192.168.0.0/16</code></span></dt>
<dd>cidr The Kubernetes Pod network CIDR to use in the cluster</dd>
<dt><code>--kubernetes-service-cidr</code> <span class="cli-opt__default">default <code>10.96.0.0/12</code></span></dt>
<dd>cidr The Kubernetes Service CIDR to use in the cluster</dd>
<dt><code>--kubernetes-version</code> <span class="cli-opt__type">string</span> <span class="cli-opt__default">default <code>1.32.0</code></span></dt>
<dd>Kubernetes version</dd>
<dt><code>-n</code>, <code>--namespace</code> <span class="cli-opt__type">string</span> <span class="cli-opt__default">default <code>default</code></span></dt>
<dd>If present, the namespace scope for this CLI request.</dd>
<dt><code>--no-proxy</code> <span class="cli-opt__type">strings</span> <span class="cli-opt__default">default <code>&#91;&#93;</code></span></dt>
<dd>No Proxy list for CAPI controllers</dd>
<dt><code>-o</code>, <code>--output</code> <span class="cli-opt__type">string</span></dt>
<dd>Output format. One of: (json, yaml, name, go-template, go-template-file, template, templatefile, jsonpath, jsonpath-as-json, jsonpath-file).</dd>
<dt><code>--output-directory</code> <span class="cli-opt__type">string</span></dt>
<dd>Used with --output=json|yaml. The directory where to output resources to files. The directory must already exist.</dd>
<dt><code>--region</code> <span class="cli-opt__type">string</span> <span class="cli-opt__default">default <code>us-west-2</code></span></dt>
<dd>AWS region to deploy cluster to</dd>
<dt><code>--registry-mirror-cacert</code></dt>
<dd>file Path to file containing the CA certificate used to verify the registry mirror server certificate</dd>
<dt><code>--registry-mirror-password</code> <span class="cli-opt__type">string</span></dt>
<dd>Password used to authenticate with the registry mirror</dd>
<dt><code>--registry-mirror-url</code> <span class="cli-opt__type">url</span></dt>
<dd>URL of a container registry used as a mirror (required for air-gapped installations)</dd>
<dt><code>--registry-mirror-username</code> <span class="cli-opt__type">string</span></dt>
<dd>Username used to authenticate with the registry mirror</dd>
<dt><code>--show-managed-fields</code></dt>
<dd>If true, keep the managedFields when printing objects in JSON or YAML format.</dd>
<dt><code>--subnet-ids</code> <span class="cli-opt__type">strings</span> <span class="cli-opt__default">default <code>&#91;&#93;</code></span></dt>
<dd>A comma separated list of existing subnet IDs to use for the kube-apiserver ELB and all control-plane and worker nodes</dd>
<dt><code>--template</code> <span class="cli-opt__type">string</span></dt>
<dd>Template string or path to template file to use when -o=go-template, -o=go-template-file. The template format is golang templates &#91;http://golang.org/pkg/text/template/#pkg-overview&#93;.</dd>
<dt><code>--timeout</code> <span class="cli-opt__type">duration</span> <span class="cli-opt__default">default <code>30m0s</code></span></dt>
<dd>The length of time to wait before giving up. Zero means wait forever (e.g. 300s, 30m, 3h).</dd>
<dt><code>-v</code>, <code>--verbose</code> <span class="cli-opt__type">int</span></dt>
<dd>Output verbosity</dd>
<dt><code>--vpc-id</code> <span class="cli-opt__type">string</span></dt>
<dd>Existing VPC ID to use for the cluster</dd>
<dt><code>--wait</code> <span class="cli-opt__default">default <code>true</code></span></dt>
<dd>If true, wait for operations to complete before returning.</dd>
<dt><code>--with-aws-bootstrap-credentials</code></dt>
<dd>Set true to use AWS bootstrap credentials from your environment. When false, the instance profile of the EC2 instance where the CAPA controller is scheduled on will be used instead.</dd>
<dt><code>--with-gcp-bootstrap-credentials</code></dt>
<dd>Set true to use GCP bootstrap credentials from your environment. When false, the service account of the VM instance where the CAPG controller is scheduled on will be used instead.</dd>
<dt><code>--worker-availability-zone</code> <span class="cli-opt__type">string</span></dt>
<dd>The AvailabilityZone in the region to deploy the worker nodes to, if not set a random one will be selected (ex. us-west-2a)</dd>
<dt><code>--worker-iam-instance-profile</code> <span class="cli-opt__type">string</span> <span class="cli-opt__default">default <code>nodes.cluster-api-provider-aws.sigs.k8s.io</code></span></dt>
<dd>Name of the IAM instance profile to assign to worker machines.</dd>
<dt><code>--worker-instance-type</code> <span class="cli-opt__type">string</span> <span class="cli-opt__default">default <code>m5.2xlarge</code></span></dt>
<dd>Worker machine instance type</dd>
<dt><code>--worker-replicas</code> <span class="cli-opt__type">int32</span> <span class="cli-opt__default">default <code>4</code></span></dt>
<dd>Number of workers</dd>
</dl>

### Usage

```bash
nkp create cluster eks [flags]
```

### Parent command

* [nkp create cluster](nkp_create_cluster.md) — Create a Kubernetes cluster, one of \[aks, aws, azure, eks, gcp, nutanix, preprovisioned, vsphere\]
