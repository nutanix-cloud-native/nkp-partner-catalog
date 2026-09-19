---
title: nkp create catalog-app
sidebar_label: nkp create catalog-app
sidebar_position: 10
cli_generated: true
unlisted: true
hide_table_of_contents: true
displayed_sidebar: tutorialSidebar
nkp_minor: 2.19
nkp_patch: 2.19.0-dev
nkp_command_id: nkp_create_catalog-app
nkp_command_kind: leaf
---

<div class="cli-doc-ref" aria-hidden="true"></div>

Create a catalog application or collection in project or workspace namespace

Create a catalog application or collection in project or workspace namespace (creation in kommander namespace propagates to all workspaces/projects)

### Options

<dl class="cli-opts">
<dt><code>--cert-ref</code> <span class="cli-opt__type">string</span></dt>
<dd>the name of a secret to use for TLS certificates. If specified, --skip-oci-registry-patches is implied</dd>
<dt><code>--config</code> <span class="cli-opt__type">string</span> <span class="cli-opt__default">default <code>~/.kommander/config</code></span></dt>
<dd>Config file to use</dd>
<dt><code>--context</code> <span class="cli-opt__type">string</span></dt>
<dd>The name of the kubeconfig context to use</dd>
<dt><code>--dry-run</code></dt>
<dd>Export in YAML format to stdout</dd>
<dt><code>-h</code>, <code>--help</code></dt>
<dd>help for catalog-app</dd>
<dt><code>--insecure</code></dt>
<dd>for when connecting to a non-TLS registries over plain HTTP</dd>
<dt><code>--interval</code> <span class="cli-opt__type">duration</span> <span class="cli-opt__default">default <code>6h0m0s</code></span></dt>
<dd>Interval for flux source-controller check for updates in the catalog repository</dd>
<dt><code>--kubeconfig</code> <span class="cli-opt__type">string</span></dt>
<dd>Path to the kubeconfig file to use for CLI requests.</dd>
<dt><code>-o</code>, <code>--output</code> <span class="cli-opt__type">string</span> <span class="cli-opt__default">default <code>yaml</code></span></dt>
<dd>Output format. One of: yaml|json</dd>
<dt><code>-p</code>, <code>--project</code> <span class="cli-opt__type">string</span></dt>
<dd>Name of the Project to create for the catalog repository. Requires workspace flag (workspace that the project belongs to)</dd>
<dt><code>--proxy-secret-ref</code> <span class="cli-opt__type">string</span></dt>
<dd>the name of an existing secret containing the proxy address and credentials. If specified, --skip-oci-registry-patches is implied.</dd>
<dt><code>--request-timeout</code> <span class="cli-opt__type">string</span></dt>
<dd>The length of time to wait before giving up on a single server request. Non-zero values should contain a corresponding time unit (e.g. 1s, 2m, 3h). A value of zero means don't timeout requests.</dd>
<dt><code>--secret-ref</code> <span class="cli-opt__type">string</span></dt>
<dd>the name of the Kubernetes image pull secret (type 'kubernetes.io/dockerconfigjson'). If specified, --skip-oci-registry-patches is implied.</dd>
<dt><code>--service-account</code> <span class="cli-opt__type">string</span></dt>
<dd>the name of the Kubernetes service account that refers to an image pull secret. If specified, --skip-oci-registry-patches is implied.</dd>
<dt><code>--skip-oci-registry-patches</code></dt>
<dd>skips patching OCIRepository with credentials from CAPI Cluster</dd>
<dt><code>--tag</code> <span class="cli-opt__type">string</span></dt>
<dd>the OCI artifact tag</dd>
<dt><code>--timeout</code> <span class="cli-opt__type">duration</span> <span class="cli-opt__default">default <code>1m0s</code></span></dt>
<dd>Timeout for flux source-controller check for updates in the catalog repository</dd>
<dt><code>--url</code> <span class="cli-opt__type">string</span></dt>
<dd>the OCI repository URL</dd>
<dt><code>-v</code>, <code>--verbose</code> <span class="cli-opt__type">int</span></dt>
<dd>Output verbosity</dd>
<dt><code>-w</code>, <code>--workspace</code> <span class="cli-opt__type">string</span></dt>
<dd>Name of the Workspace to create for the catalog repository.</dd>
</dl>

### Usage

```bash
nkp create catalog-app [flags]
```

### Parent command

* [nkp create](nkp_create.md) — Create one of \[appdeployment, bootstrap, bootstrap-token, bundle, capi-components, catalog-app, catalog-bundle, cluster, image, image-bundle, metadata, nodepool, package-bundle, project, resource, wor
