---
title: nkp create nodepool vsphere
sidebar_label: nkp create nodepool vsphere
sidebar_position: 10
cli_generated: true
unlisted: true
hide_table_of_contents: true
displayed_sidebar: tutorialSidebar
nkp_minor: 2.14
nkp_patch: 2.14.3
nkp_command_id: nkp_create_nodepool_vsphere
nkp_command_kind: leaf
---

<div class="cli-doc-ref" aria-hidden="true"></div>

Create a nodepool in vSphere

### Options

<dl class="cli-opts">
<dt><code>--additional-tags</code> <span class="cli-opt__default">default <code>&#91;&#93;</code></span></dt>
<dd>stringToString Tags to apply to the provisioned infrastructure</dd>
<dt><code>--allow-missing-template-keys</code> <span class="cli-opt__default">default <code>true</code></span></dt>
<dd>If true, ignore any errors in templates when a field or map key is missing in the template. Only applies to golang and jsonpath output formats.</dd>
<dt><code>-c</code>, <code>--cluster-name</code> <span class="cli-opt__type">name</span></dt>
<dd>Name used to prefix the cluster and all the created resources.</dd>
<dt><code>--cpus</code> <span class="cli-opt__type">int</span> <span class="cli-opt__default">default <code>8</code></span></dt>
<dd>The number of virtual processors in a worker machine</dd>
<dt><code>--data-center</code> <span class="cli-opt__type">string</span></dt>
<dd>The vSphere datacenter to deploy the workload cluster on.</dd>
<dt><code>--data-store</code> <span class="cli-opt__type">string</span></dt>
<dd>The vSphere datastore to deploy the workload cluster on.</dd>
<dt><code>--disk-size</code> <span class="cli-opt__type">int</span> <span class="cli-opt__default">default <code>80</code></span></dt>
<dd>The size of a worker machine's disk, in GB</dd>
<dt><code>--dry-run</code></dt>
<dd>Only print the objects that would be created, without creating them.</dd>
<dt><code>--folder</code> <span class="cli-opt__type">string</span></dt>
<dd>The vSphere folder for your VMs. Set to "" to use the root vSphere folder.</dd>
<dt><code>-h</code>, <code>--help</code></dt>
<dd>help for vsphere</dd>
<dt><code>--http-proxy</code> <span class="cli-opt__type">string</span></dt>
<dd>HTTP proxy for nodes</dd>
<dt><code>--https-proxy</code> <span class="cli-opt__type">string</span></dt>
<dd>HTTPS proxy for nodes</dd>
<dt><code>--kubeconfig</code> <span class="cli-opt__type">string</span></dt>
<dd>Path to the kubeconfig for the management cluster. If unspecified, default discovery rules apply.</dd>
<dt><code>--kubernetes-version</code> <span class="cli-opt__type">string</span> <span class="cli-opt__default">default <code>1.31.12</code></span></dt>
<dd>Kubernetes version</dd>
<dt><code>--memory</code> <span class="cli-opt__type">int</span> <span class="cli-opt__default">default <code>32</code></span></dt>
<dd>The size of a worker machine's memory, in GB</dd>
<dt><code>-n</code>, <code>--namespace</code> <span class="cli-opt__type">string</span> <span class="cli-opt__default">default <code>default</code></span></dt>
<dd>If present, the namespace scope for this CLI request.</dd>
<dt><code>--network</code> <span class="cli-opt__type">string</span></dt>
<dd>The vSphere network to deploy the workload cluster on.</dd>
<dt><code>--no-proxy</code> <span class="cli-opt__type">strings</span> <span class="cli-opt__default">default <code>&#91;&#93;</code></span></dt>
<dd>No Proxy list for nodes</dd>
<dt><code>--os-hint</code></dt>
<dd>flatcar A hint which will allow the installer to generate appropriate configurations for a target OS. Presently, only the hint for flatcar is supported.</dd>
<dt><code>-o</code>, <code>--output</code> <span class="cli-opt__type">string</span></dt>
<dd>Output format. One of: (json, yaml, name, go-template, go-template-file, template, templatefile, jsonpath, jsonpath-as-json, jsonpath-file).</dd>
<dt><code>--output-directory</code> <span class="cli-opt__type">string</span></dt>
<dd>Used with --output=json|yaml. The directory where to output resources to files. The directory must already exist.</dd>
<dt><code>--registry-mirror-cacert</code></dt>
<dd>file Path to file containing the CA certificate used to verify the registry mirror server certificate</dd>
<dt><code>--registry-mirror-password</code> <span class="cli-opt__type">string</span></dt>
<dd>Password used to authenticate with the registry mirror</dd>
<dt><code>--registry-mirror-url</code> <span class="cli-opt__type">url</span></dt>
<dd>URL of a container registry used as a mirror</dd>
<dt><code>--registry-mirror-username</code> <span class="cli-opt__type">string</span></dt>
<dd>Username used to authenticate with the registry mirror</dd>
<dt><code>--replicas</code> <span class="cli-opt__type">int32</span> <span class="cli-opt__default">default <code>1</code></span></dt>
<dd>Number of replicas</dd>
<dt><code>--resource-pool</code> <span class="cli-opt__type">string</span></dt>
<dd>The vSphere resource pool for the workload cluster's virtual machines.</dd>
<dt><code>--server</code> <span class="cli-opt__type">string</span></dt>
<dd>The vCenter server address. Accepted formats: host, host:port, http&#91;s&#93;://host&#91;:port&#93;. Accepted host formats: IPv4, IPv6, or DNS name.</dd>
<dt><code>--show-managed-fields</code></dt>
<dd>If true, keep the managedFields when printing objects in JSON or YAML format.</dd>
<dt><code>--ssh-public-key-file</code> <span class="cli-opt__type">string</span></dt>
<dd>Path to the authorized SSH key for the user</dd>
<dt><code>--ssh-username</code> <span class="cli-opt__type">string</span> <span class="cli-opt__default">default <code>konvoy</code></span></dt>
<dd>Name of the user to create on the instance</dd>
<dt><code>--storage-policy</code> <span class="cli-opt__type">string</span></dt>
<dd>This is the vSphere storage policy. Set it to "" if you don't want to use a storage policy.</dd>
<dt><code>--template</code> <span class="cli-opt__type">string</span></dt>
<dd>Template string or path to template file to use when -o=go-template, -o=go-template-file. The template format is golang templates &#91;http://golang.org/pkg/text/template/#pkg-overview&#93;.</dd>
<dt><code>--timeout</code> <span class="cli-opt__type">duration</span> <span class="cli-opt__default">default <code>30m0s</code></span></dt>
<dd>The length of time to wait before giving up. Zero means wait forever (e.g. 300s, 30m, 3h).</dd>
<dt><code>--tls-thumb-print</code> <span class="cli-opt__type">string</span></dt>
<dd>sha1 thumbprint of the vcenter certificate: openssl x509 -sha1 -fingerprint -in ca.crt -noout</dd>
<dt><code>-v</code>, <code>--verbose</code> <span class="cli-opt__type">int</span></dt>
<dd>Output verbosity</dd>
<dt><code>--vm-template</code> <span class="cli-opt__type">string</span></dt>
<dd>The virtual machine template to use for the workload cluster's virtual machines.</dd>
<dt><code>--wait</code></dt>
<dd>If true, wait for operations to complete before returning.</dd>
</dl>

### Usage

```bash
nkp create nodepool vsphere name [flags]
```

### Parent command

* [nkp create nodepool](nkp_create_nodepool.md) — Create a nodepool, one of \[aks, aws, azure, eks, gcp, nutanix, preprovisioned, vsphere\]
