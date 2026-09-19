---
title: nkp create image aws
sidebar_label: nkp create image aws
sidebar_position: 10
cli_generated: true
unlisted: true
hide_table_of_contents: true
displayed_sidebar: tutorialSidebar
nkp_minor: 2.19
nkp_patch: 2.19.0-dev
nkp_command_id: nkp_create_image_aws
nkp_command_kind: leaf
---

<div class="cli-doc-ref" aria-hidden="true"></div>

Create Amazon Machine Image(AMI) for one of [flatcar, oracle-8.9, rhel-8.10, rhel-9.6, rhel-9.8, rocky-9.8, ubuntu-22.04, ubuntu-24.04]

### Options

<dl class="cli-opts">
<dt><code>--ami-regions</code> <span class="cli-opt__type">strings</span> <span class="cli-opt__default">default <code>&#91;&#93;</code></span></dt>
<dd>A list of regions to publish AMIs to</dd>
<dt><code>--artifacts-directory</code> <span class="cli-opt__type">string</span></dt>
<dd>Path to a directory containing the artifacts needed to build the OS image. Useful in an air-gapped environment</dd>
<dt><code>--bundle</code> <span class="cli-opt__default">default <code>&#91;&#93;</code></span></dt>
<dd>fileSlice Path to a container image bundle tarball to load in the OS image. Multiple bundles can be provided with a comma separated list. File must be a '.tar' format. Useful in an air-gapped environment</dd>
<dt><code>--debug</code></dt>
<dd>Run packer in debug mode. user will be prompted after each step while building the image.</dd>
<dt><code>--dry-run</code></dt>
<dd>Do not create artifacts, or delete them after creating. Recommended for tests.</dd>
<dt><code>--extra-build-name</code> <span class="cli-opt__type">string</span></dt>
<dd>Additional name to add in the OS image name</dd>
<dt><code>--fips</code></dt>
<dd>Enable FIPS support</dd>
<dt><code>--gpu</code></dt>
<dd>Enable GPU support</dd>
<dt><code>-h</code>, <code>--help</code></dt>
<dd>help for aws</dd>
<dt><code>--instance-type</code> <span class="cli-opt__type">string</span></dt>
<dd>Instance type used to build the AMI. If not provided, a default instance type 't3.small' or 'g4dn.2xlarge (for GPU)' will be used.</dd>
<dt><code>--kubernetes-version</code> <span class="cli-opt__type">string</span> <span class="cli-opt__default">default <code>1.36.2</code></span></dt>
<dd>Kubernetes version used to build packages</dd>
<dt><code>--overrides</code> <span class="cli-opt__default">default <code>&#91;&#93;</code></span></dt>
<dd>fileSlice A comma separated list of override YAML files.</dd>
<dt><code>--region</code> <span class="cli-opt__type">string</span> <span class="cli-opt__default">default <code>us-west-2</code></span></dt>
<dd>Region in which to build the AMI</dd>
<dt><code>--security-group-id</code> <span class="cli-opt__type">string</span></dt>
<dd>The ID of the security group to use for the instance. If not provided, a temporary security group will be created.</dd>
<dt><code>--source-ami</code> <span class="cli-opt__type">string</span></dt>
<dd>The ID of the AMI to use as the source; If not provided, a source AMI will be selected automatically</dd>
<dt><code>-v</code>, <code>--verbose</code> <span class="cli-opt__type">int</span></dt>
<dd>Output verbosity</dd>
<dt><code>--work-directory</code> <span class="cli-opt__type">string</span></dt>
<dd>Path to a directory to use as a workspace to build the OS image. The directory must already exist.</dd>
</dl>

### Usage

```bash
nkp create image aws OSName [flags]
```

### Parent command

* [nkp create image](nkp_create_image.md) — Create Operating System image for one of \[aws, azure, gcp, nutanix, preprovisioned, vsphere\]
