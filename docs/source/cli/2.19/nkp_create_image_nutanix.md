---
title: nkp create image nutanix
sidebar_label: nkp create image nutanix
sidebar_position: 10
cli_generated: true
unlisted: true
hide_table_of_contents: true
displayed_sidebar: tutorialSidebar
nkp_minor: 2.19
nkp_patch: 2.19.0-dev
nkp_command_id: nkp_create_image_nutanix
nkp_command_kind: leaf
---

<div class="cli-doc-ref" aria-hidden="true"></div>

Create Nutanix Machine Image for one of [rhel-8.10, rhel-9.6, rhel-9.8, rocky-9.8, ubuntu-22.04, ubuntu-24.04]

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
<dd>Name of the Nutanix cluster.</dd>
<dt><code>--debug</code></dt>
<dd>Run packer in debug mode. user will be prompted after each step while building the image.</dd>
<dt><code>--dry-run</code></dt>
<dd>Do not create artifacts, or delete them after creating. Recommended for tests.</dd>
<dt><code>--endpoint</code> <span class="cli-opt__type">string</span></dt>
<dd>Host URL or IP for the Nutanix Prism Central instance.</dd>
<dt><code>--extra-build-name</code> <span class="cli-opt__type">string</span></dt>
<dd>Additional name to add in the OS image name</dd>
<dt><code>--fips</code></dt>
<dd>Enable FIPS support</dd>
<dt><code>--gpu-name</code> <span class="cli-opt__type">string</span></dt>
<dd>Assigns a GPU that is present on cluster-name on the temporary VM.</dd>
<dt><code>-h</code>, <code>--help</code></dt>
<dd>help for nutanix</dd>
<dt><code>--import-source</code> <span class="cli-opt__type">string</span></dt>
<dd>Custom URL or local path to import a qcow2 image directly to Prism Central.</dd>
<dt><code>--insecure</code></dt>
<dd>Connect with Prism without verifying CA certificates.</dd>
<dt><code>--kubernetes-version</code> <span class="cli-opt__type">string</span> <span class="cli-opt__default">default <code>1.36.2</code></span></dt>
<dd>Kubernetes version used to build packages</dd>
<dt><code>--overrides</code> <span class="cli-opt__default">default <code>&#91;&#93;</code></span></dt>
<dd>fileSlice A comma separated list of override YAML files.</dd>
<dt><code>--pc-project</code> <span class="cli-opt__type">string</span></dt>
<dd>Nutanix project name used for project-aware image build workflows.</dd>
<dt><code>--pc-project-uuid</code> <span class="cli-opt__type">string</span></dt>
<dd>Nutanix project UUID used for project-aware image build and import workflows.</dd>
<dt><code>--port</code> <span class="cli-opt__type">int</span> <span class="cli-opt__default">default <code>9440</code></span></dt>
<dd>Port for the Nutanix Prism Central instance.</dd>
<dt><code>--source-image</code> <span class="cli-opt__type">string</span></dt>
<dd>Base Image name or UUID used as a disk source. If the image name is not provided then upstream base image for the OS will be downloaded.</dd>
<dt><code>--subnet</code> <span class="cli-opt__type">string</span></dt>
<dd>Nutanix subnet name or UUID to use with the virtual machine.</dd>
<dt><code>-v</code>, <code>--verbose</code> <span class="cli-opt__type">int</span></dt>
<dd>Output verbosity</dd>
<dt><code>--vgpu-runfile</code></dt>
<dd>file Local path to runfile for vGPU driver.</dd>
<dt><code>--work-directory</code> <span class="cli-opt__type">string</span></dt>
<dd>Path to a directory to use as a workspace to build the OS image. The directory must already exist.</dd>
</dl>

### Usage

```bash
nkp create image nutanix OSName [flags]
```

### Parent command

* [nkp create image](nkp_create_image.md) — Create Operating System image for one of \[aws, azure, gcp, nutanix, preprovisioned, vsphere\]
