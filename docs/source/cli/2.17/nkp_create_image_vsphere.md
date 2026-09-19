---
title: nkp create image vsphere
sidebar_label: nkp create image vsphere
sidebar_position: 10
cli_generated: true
unlisted: true
hide_table_of_contents: true
displayed_sidebar: tutorialSidebar
nkp_minor: 2.17
nkp_patch: 2.17.1
nkp_command_id: nkp_create_image_vsphere
nkp_command_kind: leaf
---

<div class="cli-doc-ref" aria-hidden="true"></div>

Create Vsphere VM template for one of [flatcar, oracle-9.4, rhel-8.10, rhel-9.6, rocky-9.6, ubuntu-22.04, ubuntu-24.04]

### Options

<dl class="cli-opts">
<dt><code>--artifacts-directory</code> <span class="cli-opt__type">string</span></dt>
<dd>Path to a directory containing the artifacts needed to build the OS image. Useful in an air-gapped environment</dd>
<dt><code>--bastion-host</code> <span class="cli-opt__type">string</span></dt>
<dd>IP or hostname for bastion</dd>
<dt><code>--bastion-port</code> <span class="cli-opt__type">int</span> <span class="cli-opt__default">default <code>22</code></span></dt>
<dd>SSH port of the bastion host</dd>
<dt><code>--bastion-private-key-file</code></dt>
<dd>file Path to a PEM encoded private key file to use to authenticate with the bastion host</dd>
<dt><code>--bastion-username</code> <span class="cli-opt__type">string</span></dt>
<dd>The username to connect to the bastion host</dd>
<dt><code>--bundle</code> <span class="cli-opt__default">default <code>&#91;&#93;</code></span></dt>
<dd>fileSlice Path to a container image bundle tarball to load in the OS image. Multiple bundles can be provided with a comma separated list. File must be a '.tar' format. Useful in an air-gapped environment</dd>
<dt><code>--cluster</code> <span class="cli-opt__type">string</span></dt>
<dd>vSphere cluster name</dd>
<dt><code>--data-center</code> <span class="cli-opt__type">string</span></dt>
<dd>vSphere datacenter name</dd>
<dt><code>--data-store</code> <span class="cli-opt__type">string</span></dt>
<dd>vSphere datastore name</dd>
<dt><code>--debug</code></dt>
<dd>Run packer in debug mode. user will be prompted after each step while building the image.</dd>
<dt><code>--dry-run</code></dt>
<dd>Do not create artifacts, or delete them after creating. Recommended for tests.</dd>
<dt><code>--extra-build-name</code> <span class="cli-opt__type">string</span></dt>
<dd>Additional name to add in the OS image name</dd>
<dt><code>--fips</code></dt>
<dd>Enable FIPS support</dd>
<dt><code>--folder</code> <span class="cli-opt__type">string</span></dt>
<dd>vSphere folder name</dd>
<dt><code>-h</code>, <code>--help</code></dt>
<dd>help for vsphere</dd>
<dt><code>--insecure</code></dt>
<dd>Connect with vCenter without verifying CA certificates.Beneficial in scenarios where the certificate is self-signed. (not recommended for production use)</dd>
<dt><code>--kubernetes-version</code> <span class="cli-opt__type">string</span> <span class="cli-opt__default">default <code>1.34.3</code></span></dt>
<dd>Kubernetes version used to build packages</dd>
<dt><code>--network</code> <span class="cli-opt__type">string</span></dt>
<dd>vSphere network name</dd>
<dt><code>--overrides</code> <span class="cli-opt__default">default <code>&#91;&#93;</code></span></dt>
<dd>fileSlice A comma separated list of override YAML files.</dd>
<dt><code>--resource-pool</code> <span class="cli-opt__type">string</span></dt>
<dd>vSphere resource pool name</dd>
<dt><code>--server</code> <span class="cli-opt__type">string</span></dt>
<dd>Host IP or FQDN of vCenter API server</dd>
<dt><code>--template</code> <span class="cli-opt__type">string</span></dt>
<dd>Base template name to use for creating VM</dd>
<dt><code>-v</code>, <code>--verbose</code> <span class="cli-opt__type">int</span></dt>
<dd>Output verbosity</dd>
<dt><code>--work-directory</code> <span class="cli-opt__type">string</span></dt>
<dd>Path to a directory to use as a workspace to build the OS image. The directory must already exist.</dd>
</dl>

### Usage

```bash
nkp create image vsphere OSName [flags]
```

### Parent command

* [nkp create image](nkp_create_image.md) — Create Operating System image for one of \[aws, azure, gcp, nutanix, preprovisioned, vsphere\]
