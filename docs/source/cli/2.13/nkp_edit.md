---
title: nkp edit
sidebar_label: nkp edit
sidebar_position: 10
cli_generated: true
unlisted: true
hide_table_of_contents: true
displayed_sidebar: tutorialSidebar
nkp_minor: 2.13
nkp_patch: 2.13.3
nkp_command_id: nkp_edit
nkp_command_kind: leaf
---

<div class="cli-doc-ref" aria-hidden="true"></div>

Edit a resource on the server

Edit a resource from the default editor.

 The edit command allows you to directly edit any API resource you can retrieve via the command-line tools. It will open
the editor defined by your KUBE_EDITOR, or EDITOR environment variables, or fall back to 'vi' for Linux or 'notepad' for
Windows. You can edit multiple objects, although changes are applied one at a time. The command accepts file names as
well as command-line arguments, although the files you point to must be previously saved versions of resources.

### Options

<dl class="cli-opts">
<dt><code>--allow-missing-template-keys</code> <span class="cli-opt__default">default <code>true</code></span></dt>
<dd>If true, ignore any errors in templates when a field or map key is missing in the template. Only applies to golang and jsonpath output formats.</dd>
<dt><code>--config</code> <span class="cli-opt__type">string</span> <span class="cli-opt__default">default <code>~/.kommander/config</code></span></dt>
<dd>Config file to use</dd>
<dt><code>--context</code> <span class="cli-opt__type">string</span></dt>
<dd>The name of the kubeconfig context to use</dd>
<dt><code>--field-manager</code> <span class="cli-opt__type">string</span> <span class="cli-opt__default">default <code>kommander-cli</code></span></dt>
<dd>Name of the manager used to track field ownership.</dd>
<dt><code>-f</code>, <code>--filename</code> <span class="cli-opt__type">strings</span> <span class="cli-opt__default">default <code>&#91;&#93;</code></span></dt>
<dd>Filename, directory, or URL to files to use to edit the resource</dd>
<dt><code>-h</code>, <code>--help</code></dt>
<dd>help for edit</dd>
<dt><code>--kubeconfig</code> <span class="cli-opt__type">string</span></dt>
<dd>Path to the kubeconfig file to use for CLI requests.</dd>
<dt><code>-k</code>, <code>--kustomize</code> <span class="cli-opt__type">string</span></dt>
<dd>Process the kustomization directory. This flag can't be used together with -f or -R.</dd>
<dt><code>-n</code>, <code>--namespace</code> <span class="cli-opt__type">string</span> <span class="cli-opt__default">default <code>default</code></span></dt>
<dd>namespace of the resource</dd>
<dt><code>-o</code>, <code>--output</code> <span class="cli-opt__type">string</span></dt>
<dd>Output format. One of: (json, yaml, name, go-template, go-template-file, template, templatefile, jsonpath, jsonpath-as-json, jsonpath-file).</dd>
<dt><code>--output-patch</code></dt>
<dd>Output the patch if the resource is edited.</dd>
<dt><code>-R</code>, <code>--recursive</code></dt>
<dd>Process the directory used in -f, --filename recursively. Useful when you want to manage related manifests organized within the same directory.</dd>
<dt><code>--request-timeout</code> <span class="cli-opt__type">string</span></dt>
<dd>The length of time to wait before giving up on a single server request. Non-zero values should contain a corresponding time unit (e.g. 1s, 2m, 3h). A value of zero means don't timeout requests.</dd>
<dt><code>--save-config</code></dt>
<dd>If true, the configuration of current object will be saved in its annotation. Otherwise, the annotation will be unchanged. This flag is useful when you want to perform kubectl apply on this object in the future.</dd>
<dt><code>--show-managed-fields</code></dt>
<dd>If true, keep the managedFields when printing objects in JSON or YAML format.</dd>
<dt><code>--subresource</code> <span class="cli-opt__type">string</span></dt>
<dd>If specified, edit will operate on the subresource of the requested object. Must be one of &#91;status&#93;. This flag is beta and may change in the future.</dd>
<dt><code>--template</code> <span class="cli-opt__type">string</span></dt>
<dd>Template string or path to template file to use when -o=go-template, -o=go-template-file. The template format is golang templates &#91;http://golang.org/pkg/text/template/#pkg-overview&#93;.</dd>
<dt><code>--validate</code></dt>
<dd>string&#91;="strict"&#93; Must be one of: strict (or true), warn, ignore (or false).</dd>
<dt><code>-v</code>, <code>--verbose</code> <span class="cli-opt__type">int</span></dt>
<dd>Output verbosity</dd>
<dt><code>--windows-line-endings</code></dt>
<dd>Defaults to the line ending native to your platform.</dd>
</dl>

### Usage

```bash
nkp edit (RESOURCE/NAME | -f FILENAME)
```

### Parent command

* [nkp](index.md)
