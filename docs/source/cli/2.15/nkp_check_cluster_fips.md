---
title: nkp check cluster fips
sidebar_label: nkp check cluster fips
sidebar_position: 10
cli_generated: true
unlisted: true
hide_table_of_contents: true
displayed_sidebar: tutorialSidebar
nkp_minor: 2.15
nkp_patch: 2.15.2
nkp_command_id: nkp_check_cluster_fips
nkp_command_kind: leaf
---

<div class="cli-doc-ref" aria-hidden="true"></div>

Validate the components in your cluster are FIPS compliant

The check cluster fips command is used to validate that specific components and services are FIPS
compliant by checking the signatures of the files against a signed signature file, and checking that services
are using the certified algorithms.

### Options

<dl class="cli-opts">
<dt><code>-h</code>, <code>--help</code></dt>
<dd>help for fips</dd>
<dt><code>--kubeconfig</code> <span class="cli-opt__type">string</span></dt>
<dd>Path to the kubeconfig file for the fips cluster. If unspecified, default discovery rules apply.</dd>
<dt><code>-n</code>, <code>--namespace</code> <span class="cli-opt__type">string</span> <span class="cli-opt__default">default <code>default</code></span></dt>
<dd>If present, the namespace scope for this CLI request.</dd>
<dt><code>--output-configmap</code> <span class="cli-opt__type">string</span> <span class="cli-opt__default">default <code>check-cluster-fips-output") (DEPRECATED: This flag will be removed in a future release.</code></span></dt>
<dd>ConfigMap to store result of the fips check.</dd>
<dt><code>--signature-configmap</code> <span class="cli-opt__type">string</span></dt>
<dd>ConfigMap with fips signature data to verify.</dd>
<dt><code>--signature-file</code> <span class="cli-opt__type">string</span></dt>
<dd>File containing fips signature data.</dd>
<dt><code>--timeout</code> <span class="cli-opt__type">duration</span> <span class="cli-opt__default">default <code>10m0s</code></span></dt>
<dd>The length of time to wait before giving up. Zero means wait forever (e.g. 300s, 30m, 3h).</dd>
<dt><code>-v</code>, <code>--verbose</code> <span class="cli-opt__type">int</span></dt>
<dd>Output verbosity</dd>
</dl>

### Usage

```bash
nkp check cluster fips [flags]
```

### Examples

To use the built-in signature files for supported operating systems:

```bash
nkp check cluster fips
```

To use a custom signature file, named "manifest-rhel-84.json.asc":

```bash
nkp check cluster fips \
--signature-file manifest-rhel-84.json.asc \
--signature-configmap myconfigmap
```

The file will be copied to the ConfigMap. To use an existing ConfigMap:

```bash
nkp check cluster fips \
--signature-configmap myconfigmap
```

The validation will be re-checked against the existing signature data.

### Parent command

* [nkp check cluster](nkp_check_cluster.md) — Check a cluster, one of \[fips\]
