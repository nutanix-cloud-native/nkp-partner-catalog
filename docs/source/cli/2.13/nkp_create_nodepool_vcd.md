---
title: nkp create nodepool vcd
sidebar_label: nkp create nodepool vcd
sidebar_position: 10
cli_generated: true
unlisted: true
hide_table_of_contents: true
displayed_sidebar: tutorialSidebar
nkp_minor: 2.13
nkp_patch: 2.13.3
nkp_command_id: nkp_create_nodepool_vcd
nkp_command_kind: leaf
---

<div class="cli-doc-ref" aria-hidden="true"></div>

Create a nodepool in VCD

### Options

<dl class="cli-opts">
<dt><code>--allow-missing-template-keys</code> <span class="cli-opt__default">default <code>true</code></span></dt>
<dd>If true, ignore any errors in templates when a field or map key is missing in the template. Only applies to golang and jsonpath output formats.</dd>
<dt><code>--catalog</code> <span class="cli-opt__type">string</span></dt>
<dd>Catalog hosting the virtual machine vApp template.</dd>
<dt><code>-c</code>, <code>--cluster-name</code> <span class="cli-opt__type">name</span></dt>
<dd>Name used to prefix the cluster and all the created resources.</dd>
<dt><code>--dry-run</code></dt>
<dd>Only print the objects that would be created, without creating them.</dd>
<dt><code>-h</code>, <code>--help</code></dt>
<dd>help for vcd</dd>
<dt><code>--http-proxy</code> <span class="cli-opt__type">string</span></dt>
<dd>HTTP proxy for nodes</dd>
<dt><code>--https-proxy</code> <span class="cli-opt__type">string</span></dt>
<dd>HTTPS proxy for nodes</dd>
<dt><code>--kubeconfig</code> <span class="cli-opt__type">string</span></dt>
<dd>Path to the kubeconfig for the management cluster. If unspecified, default discovery rules apply.</dd>
<dt><code>--kubernetes-version</code> <span class="cli-opt__type">string</span> <span class="cli-opt__default">default <code>1.30.10</code></span></dt>
<dd>Kubernetes version</dd>
<dt><code>-n</code>, <code>--namespace</code> <span class="cli-opt__type">string</span> <span class="cli-opt__default">default <code>default</code></span></dt>
<dd>If present, the namespace scope for this CLI request.</dd>
<dt><code>--no-proxy</code> <span class="cli-opt__type">strings</span> <span class="cli-opt__default">default <code>&#91;&#93;</code></span></dt>
<dd>No Proxy list for nodes</dd>
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
<dt><code>--show-managed-fields</code></dt>
<dd>If true, keep the managedFields when printing objects in JSON or YAML format.</dd>
<dt><code>--ssh-public-key-file</code> <span class="cli-opt__type">string</span></dt>
<dd>Path to the authorized SSH key for the user</dd>
<dt><code>--ssh-username</code> <span class="cli-opt__type">string</span> <span class="cli-opt__default">default <code>konvoy</code></span></dt>
<dd>Name of the user to create on the instance</dd>
<dt><code>--storage-profile</code> <span class="cli-opt__type">string</span> <span class="cli-opt__default">default <code>&#42;</code></span></dt>
<dd>The storage profile to be used for a virtual machine</dd>
<dt><code>--template</code> <span class="cli-opt__type">string</span></dt>
<dd>Template string or path to template file to use when -o=go-template, -o=go-template-file. The template format is golang templates &#91;http://golang.org/pkg/text/template/#pkg-overview&#93;.</dd>
<dt><code>--timeout</code> <span class="cli-opt__type">duration</span> <span class="cli-opt__default">default <code>30m0s</code></span></dt>
<dd>The length of time to wait before giving up. Zero means wait forever (e.g. 300s, 30m, 3h).</dd>
<dt><code>--vapp-template</code> <span class="cli-opt__type">string</span></dt>
<dd>The vApp template to use for a virtual machine.</dd>
<dt><code>-v</code>, <code>--verbose</code> <span class="cli-opt__type">int</span></dt>
<dd>Output verbosity</dd>
<dt><code>--wait</code></dt>
<dd>If true, wait for operations to complete before returning.</dd>
<dt><code>--worker-disk-size</code> <span class="cli-opt__type">int32</span></dt>
<dd>The size (in GiB) of the root disk used on this machine. If set to 0, the vApp template determines the disk size. To use values other than 0, disable Fast Provisioning in the Organization VDC.</dd>
<dt><code>--worker-placement-policy</code> <span class="cli-opt__type">string</span></dt>
<dd>The placement policy for workers to be used on this machine</dd>
<dt><code>--worker-sizing-policy</code> <span class="cli-opt__type">string</span></dt>
<dd>The sizing policy for workers to be used on this machine</dd>
</dl>

### Usage

```bash
nkp create nodepool vcd name [flags]
```

### Parent command

* [nkp create nodepool](nkp_create_nodepool.md) — Create a nodepool, one of \[aks, aws, azure, eks, gcp, nutanix, preprovisioned, vcd, vsphere\]
