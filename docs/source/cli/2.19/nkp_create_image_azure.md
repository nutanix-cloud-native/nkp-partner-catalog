---
title: nkp create image azure
sidebar_label: nkp create image azure
sidebar_position: 10
cli_generated: true
unlisted: true
hide_table_of_contents: true
displayed_sidebar: tutorialSidebar
nkp_minor: 2.19
nkp_patch: 2.19.0-dev
nkp_command_id: nkp_create_image_azure
nkp_command_kind: leaf
---

<div class="cli-doc-ref" aria-hidden="true"></div>

Create Azure Image for one of [rhel-9.6, rhel-9.8, rocky-9, ubuntu-22.04, ubuntu-24.04]

### Options

<dl class="cli-opts">
<dt><code>--allowed-inbound-ip-addresses</code> <span class="cli-opt__type">strings</span> <span class="cli-opt__default">default <code>&#91;&#93;</code></span></dt>
<dd>List of IP addresses or CIDR blocks allowed to access the Azure VM via SSH. If empty, SSH is allowed from any IP address.</dd>
<dt><code>--client-id</code> <span class="cli-opt__type">string</span></dt>
<dd>Client ID for the Azure service principal.</dd>
<dt><code>--cloud-endpoint</code> <span class="cli-opt__type">string</span> <span class="cli-opt__default">default <code>Public</code></span></dt>
<dd>Azure cloud endpoint. Which can be one of &#91;Public USGovernment China&#93;</dd>
<dt><code>--debug</code></dt>
<dd>Run packer in debug mode. user will be prompted after each step while building the image.</dd>
<dt><code>--dry-run</code></dt>
<dd>Do not create artifacts, or delete them after creating. Recommended for tests.</dd>
<dt><code>--extra-build-name</code> <span class="cli-opt__type">string</span></dt>
<dd>Additional name to add in the OS image name</dd>
<dt><code>--fips</code></dt>
<dd>Enable FIPS support</dd>
<dt><code>--gallery-image-locations</code> <span class="cli-opt__type">strings</span> <span class="cli-opt__default">default <code>&#91;&#93;</code></span></dt>
<dd>List of locations where to replicate the image to.If not provided, the value of the location flag will be used.</dd>
<dt><code>--gallery-image-name</code> <span class="cli-opt__type">string</span></dt>
<dd>Name of the Azure Shared Image Gallery image.If not provided, a default name based on the OS and Kubernetes version will be used.</dd>
<dt><code>--gallery-image-offer</code> <span class="cli-opt__type">string</span> <span class="cli-opt__default">default <code>nkp</code></span></dt>
<dd>The gallery image offer where the image will be stored.</dd>
<dt><code>--gallery-image-publisher</code> <span class="cli-opt__type">string</span> <span class="cli-opt__default">default <code>nkp</code></span></dt>
<dd>The gallery image publisher to use for the image.</dd>
<dt><code>--gallery-name</code> <span class="cli-opt__type">string</span> <span class="cli-opt__default">default <code>nkp</code></span></dt>
<dd>The gallery where the image will be stored.</dd>
<dt><code>-h</code>, <code>--help</code></dt>
<dd>help for azure</dd>
<dt><code>--instance-type</code> <span class="cli-opt__type">string</span> <span class="cli-opt__default">default <code>Standard&#95;D2s&#95;v3</code></span></dt>
<dd>The Instance Type to use for the build VM.</dd>
<dt><code>--kubernetes-version</code> <span class="cli-opt__type">string</span> <span class="cli-opt__default">default <code>1.36.2</code></span></dt>
<dd>Kubernetes version used to build packages</dd>
<dt><code>--location</code> <span class="cli-opt__type">string</span> <span class="cli-opt__default">default <code>westus</code></span></dt>
<dd>The location of the resource group.</dd>
<dt><code>--overrides</code> <span class="cli-opt__default">default <code>&#91;&#93;</code></span></dt>
<dd>fileSlice A comma separated list of override YAML files.</dd>
<dt><code>--resource-group-name</code> <span class="cli-opt__type">string</span> <span class="cli-opt__default">default <code>nkp</code></span></dt>
<dd>The resource group name to create image in.</dd>
<dt><code>--subscription-id</code> <span class="cli-opt__type">string</span></dt>
<dd>Azure subscription ID to use for the virtual machine.</dd>
<dt><code>--tenant-id</code> <span class="cli-opt__type">string</span></dt>
<dd>The tenant id to use for the build</dd>
<dt><code>-v</code>, <code>--verbose</code> <span class="cli-opt__type">int</span></dt>
<dd>Output verbosity</dd>
<dt><code>--work-directory</code> <span class="cli-opt__type">string</span></dt>
<dd>Path to a directory to use as a workspace to build the OS image. The directory must already exist.</dd>
</dl>

### Usage

```bash
nkp create image azure OSName [flags]
```

### Parent command

* [nkp create image](nkp_create_image.md) — Create Operating System image for one of \[aws, azure, gcp, nutanix, preprovisioned, vsphere\]
