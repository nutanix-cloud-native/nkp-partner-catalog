---
title: nkp create cluster nutanix
sidebar_label: nkp create cluster nutanix
sidebar_position: 10
cli_generated: true
unlisted: true
hide_table_of_contents: true
displayed_sidebar: tutorialSidebar
nkp_minor: 2.16
nkp_patch: 2.16.1
nkp_command_id: nkp_create_cluster_nutanix
nkp_command_kind: leaf
---

<div class="cli-doc-ref" aria-hidden="true"></div>

Create a Konvoy cluster in Nutanix

### Options

<dl class="cli-opts">
<dt><code>--acme-email</code> <span class="cli-opt__type">string</span></dt>
<dd>Email address the ACME server can use to contact you.</dd>
<dt><code>--acme-server</code> <span class="cli-opt__type">string</span> <span class="cli-opt__default">default <code>https://acme-v02.api.letsencrypt.org/directory</code></span></dt>
<dd>Address of the ACME service issuing the certificates (default: Let's encrypt).</dd>
<dt><code>--additional-trust-bundle</code> <span class="cli-opt__type">string</span></dt>
<dd>Additional CA trust bundle to use to validate the Prism Central server certificate.</dd>
<dt><code>--airgapped</code></dt>
<dd>Enable airgapped mode.</dd>
<dt><code>--allow-missing-template-keys</code> <span class="cli-opt__default">default <code>true</code></span></dt>
<dd>If true, ignore any errors in templates when a field or map key is missing in the template. Only applies to golang and jsonpath output formats.</dd>
<dt><code>--aws-service-endpoints</code> <span class="cli-opt__type">string</span></dt>
<dd>Custom AWS service endpoints in a semi-colon separated format: $&#123;SigningRegion1&#125;:$&#123;ServiceID1&#125;=$&#123;URL&#125;,$&#123;ServiceID2&#125;=$&#123;URL&#125;;$&#123;SigningRegion2&#125;...</dd>
<dt><code>--bootstrap-cluster-image</code> <span class="cli-opt__type">string</span> <span class="cli-opt__default">default <code>docker.io/mesosphere/konvoy-bootstrap:v2.16.1</code></span></dt>
<dd>Container image used to create the bootstrap cluster. Can be an image name or path to a filee.g. ./nkp-v2.16.1/konvoy-bootstrap-image-v2.16.1.tar. If not provided, the default image will be used</dd>
<dt><code>--bundle</code> <span class="cli-opt__type">files</span> <span class="cli-opt__default">default <code>&#91;&#93;</code></span></dt>
<dd>A comma separated list of bundle artifacts that will be pushed to an in-cluster registry. Supports glob pattern to match multiple artifacts (e.g. ./bundles/&#42;.tar). Following artifacts must be provided: konvoy-image-bundle-v2.16.1.tar, kommander-image-bundle-v2.16.1.tar</dd>
<dt><code>--cluster-hostname</code> <span class="cli-opt__type">string</span></dt>
<dd>Hostname that is used for accessing the cluster's ingresses.</dd>
<dt><code>-c</code>, <code>--cluster-name</code> <span class="cli-opt__type">name</span></dt>
<dd>Name used to prefix the cluster and all the created resources.</dd>
<dt><code>--control-plane-cores-per-vcpu</code> <span class="cli-opt__type">int32</span> <span class="cli-opt__default">default <code>1</code></span></dt>
<dd>The number of cores per vCPU(equivalent to CPU cores) to use in a control plane machine</dd>
<dt><code>--control-plane-disk-size</code> <span class="cli-opt__type">int32</span> <span class="cli-opt__default">default <code>80</code></span></dt>
<dd>The size of the primary disk (in GiB) of a control plane machine</dd>
<dt><code>--control-plane-endpoint-ip</code> <span class="cli-opt__type">ip</span></dt>
<dd>The control plane endpoint ip. Must be a static IPv4 address from the Layer 2 network of the control plane machines.</dd>
<dt><code>--control-plane-endpoint-port</code> <span class="cli-opt__type">int32</span> <span class="cli-opt__default">default <code>6443</code></span></dt>
<dd>The control plane endpoint port.</dd>
<dt><code>--control-plane-external-endpoint</code> <span class="cli-opt__type">string</span></dt>
<dd>The external control plane endpoint. A host that resolves to the endpoint IP. The host may be a Floating IPv4 address that maps to the control plane endpoint IP, or an FQDN that resolves to the control plane endpoint IP.</dd>
<dt><code>--control-plane-memory</code> <span class="cli-opt__type">int32</span> <span class="cli-opt__default">default <code>16</code></span></dt>
<dd>The size of memory (in GiB) of a control plane machine</dd>
<dt><code>--control-plane-pc-categories</code> <span class="cli-opt__type">strings</span> <span class="cli-opt__default">default <code>&#91;&#93;</code></span></dt>
<dd>Names of Prism Central categories to associate with control plane resources (VMs, VGs, etc). Example: key1=value1,key1=value2,key2=value2</dd>
<dt><code>--control-plane-pc-project</code> <span class="cli-opt__type">string</span></dt>
<dd>Name of Prism Central project to associate with control plane resources (VMs, VGs, etc).</dd>
<dt><code>--control-plane-prism-element-cluster</code> <span class="cli-opt__type">string</span></dt>
<dd>Name of the Prism Element cluster to use to create a control plane machine</dd>
<dt><code>--control-plane-renew-certificates-before</code> <span class="cli-opt__type">int32</span> <span class="cli-opt__default">default <code>180</code></span></dt>
<dd>Enables automated control-plane certificates renewal. Provide the number of days between 7 and 360 when to trigger the certificate renewal. The renewal process will trigger new control-plane Machines to be created. A value of 0 disables the feature.</dd>
<dt><code>--control-plane-replicas</code> <span class="cli-opt__type">int32</span> <span class="cli-opt__default">default <code>3</code></span></dt>
<dd>Number of control plane nodes</dd>
<dt><code>--control-plane-subnets</code> <span class="cli-opt__type">strings</span> <span class="cli-opt__default">default <code>&#91;&#93;</code></span></dt>
<dd>Names of Prism Central subnets to use for control plane machines. Example: subnet1,subnet2,subnet3</dd>
<dt><code>--control-plane-vcpus</code> <span class="cli-opt__type">int32</span> <span class="cli-opt__default">default <code>4</code></span></dt>
<dd>The number of vCPUs(equivalent to CPU sockets) to use in a control plane machine</dd>
<dt><code>--control-plane-vm-image</code> <span class="cli-opt__type">string</span></dt>
<dd>Name of OS image to use for control plane machines.</dd>
<dt><code>--csi-file-system</code> <span class="cli-opt__type">string</span> <span class="cli-opt__default">default <code>ext4</code></span></dt>
<dd>File system to use for CSI volumes. Allowed values &#91;"ext4" "xfs"&#93;.</dd>
<dt><code>--csi-flash-mode</code></dt>
<dd>If true, will enable flash mode for CSI volumes.</dd>
<dt><code>--csi-hypervisor-attached-volumes</code> <span class="cli-opt__default">default <code>true</code></span></dt>
<dd>If true, will enable the hypervisor attached feature for CSI volumes which allows disks to attach directly to the host without using iSCSI.</dd>
<dt><code>--csi-reclaim-policy</code> <span class="cli-opt__type">string</span> <span class="cli-opt__default">default <code>Delete</code></span></dt>
<dd>Reclaim policy for CSI volumes. Allowed values &#91;"Delete" "Retain"&#93;.</dd>
<dt><code>--csi-storage-container</code> <span class="cli-opt__type">string</span></dt>
<dd>Name of the Prism Central storage container to associate with the storage class created on the cluster.</dd>
<dt><code>--dry-run</code></dt>
<dd>Only print the objects that would be created, without creating them.</dd>
<dt><code>--endpoint</code> <span class="cli-opt__type">url</span></dt>
<dd>Prism Central URL. Accepted formats: host, host:port, http&#91;s&#93;://host&#91;:port&#93;. Accepted host formats: IP, FQDN.</dd>
<dt><code>--extra-sans</code> <span class="cli-opt__type">strings</span> <span class="cli-opt__default">default <code>&#91;&#93;</code></span></dt>
<dd>A comma separated list of additional Subject Alternative Names for the API Server signing cert</dd>
<dt><code>--fips</code></dt>
<dd>Enable FIPS mode. Note: The OS images used by the cluster must be prepared with FIPS mode enabled.</dd>
<dt><code>-h</code>, <code>--help</code></dt>
<dd>help for nutanix</dd>
<dt><code>--http-proxy</code> <span class="cli-opt__type">string</span></dt>
<dd>HTTP proxy for all nodes in the cluster</dd>
<dt><code>--https-proxy</code> <span class="cli-opt__type">string</span></dt>
<dd>HTTPS proxy for all nodes in the cluster</dd>
<dt><code>--ingress-ca</code></dt>
<dd>file Path to file containing the certificate's CA bundle.</dd>
<dt><code>--ingress-certificate</code></dt>
<dd>file Path to file containing certificates for configuring Ingress.</dd>
<dt><code>--ingress-private-key</code></dt>
<dd>file Path to file containing the certificate's private key (PEM).</dd>
<dt><code>--insecure</code></dt>
<dd>If true, the Prism Central server certificate will not be validated.</dd>
<dt><code>--kubeconfig</code> <span class="cli-opt__type">string</span></dt>
<dd>Path to the kubeconfig for the management cluster. If unspecified, default discovery rules apply. This flag is ignored if used with the --self-managed flag.</dd>
<dt><code>--kubernetes-pod-network-cidr</code> <span class="cli-opt__default">default <code>192.168.0.0/16</code></span></dt>
<dd>cidr The Kubernetes Pod network CIDR to use in the cluster</dd>
<dt><code>--kubernetes-service-cidr</code> <span class="cli-opt__default">default <code>10.96.0.0/12</code></span></dt>
<dd>cidr The Kubernetes Service CIDR to use in the cluster</dd>
<dt><code>--kubernetes-service-load-balancer-ip-range</code> <span class="cli-opt__type">string</span></dt>
<dd>A hyphen separated IP range to configure the Kubernetes Service Load Balancer provider with. Example: 10.0.0.0-10.0.0.10</dd>
<dt><code>--kubernetes-version</code> <span class="cli-opt__type">string</span> <span class="cli-opt__default">default <code>1.33.5</code></span></dt>
<dd>Kubernetes version</dd>
<dt><code>-n</code>, <code>--namespace</code> <span class="cli-opt__type">string</span> <span class="cli-opt__default">default <code>default</code></span></dt>
<dd>If present, the namespace scope for this CLI request.</dd>
<dt><code>--no-proxy</code> <span class="cli-opt__type">strings</span> <span class="cli-opt__default">default <code>&#91;&#93;</code></span></dt>
<dd>No Proxy list for all nodes in the cluster</dd>
<dt><code>--ntp-servers</code> <span class="cli-opt__type">strings</span> <span class="cli-opt__default">default <code>&#91;&#93;</code></span></dt>
<dd>A comma-separated list of NTP servers to configure on all nodes. Each entry must be a fully qualified domain name (FQDN) or an IP address (IPv4 or IPv6). This list overrides any default NTP settings preconfigured in the machine image.</dd>
<dt><code>-o</code>, <code>--output</code> <span class="cli-opt__type">string</span></dt>
<dd>Output format. One of: (json, yaml, name, go-template, go-template-file, template, templatefile, jsonpath, jsonpath-as-json, jsonpath-file).</dd>
<dt><code>--output-directory</code> <span class="cli-opt__type">string</span></dt>
<dd>Used with --output=json|yaml. The directory where to output resources to files. The directory must already exist.</dd>
<dt><code>--registry-cacert</code></dt>
<dd>file Path to file containing the CA certificate used to verify the registry server certificate</dd>
<dt><code>--registry-mirror-cacert</code></dt>
<dd>file Path to file containing the CA certificate used to verify the registry mirror server certificate</dd>
<dt><code>--registry-mirror-password</code> <span class="cli-opt__type">string</span></dt>
<dd>Password used to authenticate with the registry mirror</dd>
<dt><code>--registry-mirror-url</code> <span class="cli-opt__type">url</span></dt>
<dd>URL of a container registry used as a mirror (required for air-gapped installations)</dd>
<dt><code>--registry-mirror-username</code> <span class="cli-opt__type">string</span></dt>
<dd>Username used to authenticate with the registry mirror</dd>
<dt><code>--registry-password</code> <span class="cli-opt__type">string</span></dt>
<dd>Password used to authenticate with the registry</dd>
<dt><code>--registry-url</code> <span class="cli-opt__type">url</span></dt>
<dd>URL of a container registry</dd>
<dt><code>--registry-username</code> <span class="cli-opt__type">string</span></dt>
<dd>Username used to authenticate with the registry</dd>
<dt><code>--self-managed</code> <span class="cli-opt__default">default <code>false</code></span></dt>
<dd>When set to true, the required prerequisites are created before creating the cluster and the resulting cluster has all necessary components deployed onto itself, so it can manage its own cluster lifecycle. When set to false, a management cluster is used.</dd>
<dt><code>--show-managed-fields</code></dt>
<dd>If true, keep the managedFields when printing objects in JSON or YAML format.</dd>
<dt><code>--skip-preflight-checks</code> <span class="cli-opt__type">strings</span> <span class="cli-opt__default">default <code>&#91;&#93;</code></span></dt>
<dd>Skip preflight checks. Provide "all" to skip all checks, or a comma-separated list of check names.</dd>
<dt><code>--ssh-public-key-file</code> <span class="cli-opt__type">string</span></dt>
<dd>Path to the authorized SSH key for the user</dd>
<dt><code>--ssh-username</code> <span class="cli-opt__type">string</span> <span class="cli-opt__default">default <code>konvoy</code></span></dt>
<dd>Name of the user to create on the instance</dd>
<dt><code>--template</code> <span class="cli-opt__type">string</span></dt>
<dd>Template string or path to template file to use when -o=go-template, -o=go-template-file. The template format is golang templates &#91;http://golang.org/pkg/text/template/#pkg-overview&#93;.</dd>
<dt><code>--timeout</code> <span class="cli-opt__type">duration</span> <span class="cli-opt__default">default <code>30m0s</code></span></dt>
<dd>The length of time to wait before giving up. Zero means wait forever (e.g. 300s, 30m, 3h).</dd>
<dt><code>-v</code>, <code>--verbose</code> <span class="cli-opt__type">int</span></dt>
<dd>Output verbosity</dd>
<dt><code>--vm-image</code> <span class="cli-opt__type">string</span></dt>
<dd>Name of OS image to use for all machines.</dd>
<dt><code>--wait</code> <span class="cli-opt__default">default <code>true</code></span></dt>
<dd>If true, wait for operations to complete before returning. This flag is ignored and will always be 'true' if used with the --self-managed flag.</dd>
<dt><code>--with-aws-bootstrap-credentials</code></dt>
<dd>Set true to use AWS bootstrap credentials from your environment. When false, the instance profile of the EC2 instance where the CAPA controller is scheduled on will be used instead.</dd>
<dt><code>--with-gcp-bootstrap-credentials</code></dt>
<dd>Set true to use GCP bootstrap credentials from your environment. When false, the service account of the VM instance where the CAPG controller is scheduled on will be used instead.</dd>
<dt><code>--worker-cores-per-vcpu</code> <span class="cli-opt__type">int32</span> <span class="cli-opt__default">default <code>1</code></span></dt>
<dd>The number of cores per vCPU(equivalent to CPU cores) to use in a worker machine</dd>
<dt><code>--worker-disk-size</code> <span class="cli-opt__type">int32</span> <span class="cli-opt__default">default <code>80</code></span></dt>
<dd>The size of the primary disk (in GiB) of a worker machine</dd>
<dt><code>--worker-memory</code> <span class="cli-opt__type">int32</span> <span class="cli-opt__default">default <code>32</code></span></dt>
<dd>The size of memory (in GiB) of a worker machine</dd>
<dt><code>--worker-pc-categories</code> <span class="cli-opt__type">strings</span> <span class="cli-opt__default">default <code>&#91;&#93;</code></span></dt>
<dd>Names of Prism Central categories to associate with worker resources (VMs, VGs, etc). Example: key1=value1,key1=value2,key2=value2</dd>
<dt><code>--worker-pc-project</code> <span class="cli-opt__type">string</span></dt>
<dd>Name of Prism Central project to associate with worker resources (VMs, VGs, etc).</dd>
<dt><code>--worker-prism-element-cluster</code> <span class="cli-opt__type">string</span></dt>
<dd>Name of the Prism Element cluster to use to create a worker machine</dd>
<dt><code>--worker-replicas</code> <span class="cli-opt__type">int32</span> <span class="cli-opt__default">default <code>4</code></span></dt>
<dd>Number of workers</dd>
<dt><code>--worker-subnets</code> <span class="cli-opt__type">strings</span> <span class="cli-opt__default">default <code>&#91;&#93;</code></span></dt>
<dd>Names of Prism Central subnets to use for worker machines. Example: subnet1,subnet2,subnet3</dd>
<dt><code>--worker-vcpus</code> <span class="cli-opt__type">int32</span> <span class="cli-opt__default">default <code>8</code></span></dt>
<dd>The number of vCPUs(equivalent to CPU sockets) to use in a worker machine</dd>
<dt><code>--worker-vm-image</code> <span class="cli-opt__type">string</span></dt>
<dd>Name of OS image to use for worker machines.</dd>
</dl>

### Usage

```bash
nkp create cluster nutanix [flags]
```

### Parent command

* [nkp create cluster](nkp_create_cluster.md) — Create a Kubernetes cluster, one of \[aks, aws, azure, eks, gcp, nutanix, preprovisioned, vsphere\]
