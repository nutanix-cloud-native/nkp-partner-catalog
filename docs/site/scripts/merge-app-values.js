'use strict';

/**
 * Resolve merged Helm values for a catalog application version:
 *   1. Read helmrelease/ (or version-root) kustomization.yaml
 *   2. Follow resources; Flux Kustomization CRs → spec.path + `kubectl kustomize`
 *      (two-level indirection used by platform apps like Harbor)
 *   3. Find HelmRelease → chartRef OCIRepository → url + tag
 *   4. helm pull the OCI chart (cached) and load its values.yaml
 *   5. Overlay application ConfigMap data.values.yaml (from valuesFrom)
 *
 * Values merge uses `yaml` (eemeli) Documents so we retain:
 *   - upstream key order, then append keys introduced by the app ConfigMap
 *   - comments from both sides (upstream kept on shared keys; overlay comments
 *     come along with replaced / newly added nodes)
 *
 * Map deep-merge; arrays and scalars are replaced (Helm-like).
 */

const fs = require('fs');
const path = require('path');
const {spawnSync} = require('child_process');
const crypto = require('crypto');
const YAML = require('yaml');

function parseYamlMulti(text) {
  try {
    return YAML.parseAllDocuments(String(text || ''), {prettyErrors: true})
      .map((d) => d.toJSON())
      .filter((d) => d != null);
  } catch (err) {
    console.warn(`  WARN: failed to parse YAML: ${err.message}`);
    return [];
  }
}

function parseAllPlain(filePath) {
  if (!fs.existsSync(filePath) || !fs.statSync(filePath).isFile()) return [];
  try {
    return parseYamlMulti(fs.readFileSync(filePath, 'utf8'));
  } catch (err) {
    console.warn(`  WARN: failed to parse ${filePath}: ${err.message}`);
    return [];
  }
}

function isFluxKustomization(doc) {
  return (
    !!doc &&
    doc.kind === 'Kustomization' &&
    typeof doc.apiVersion === 'string' &&
    doc.apiVersion.includes('kustomize.toolkit.fluxcd.io')
  );
}

function isNativeKustomization(doc) {
  return !!doc && doc.kind === 'Kustomization' && !isFluxKustomization(doc);
}

/**
 * Map Flux Kustomization spec.path (repo-relative, e.g.
 * `./applications/harbor/1.19.1/release`) onto the local version directory.
 */
function resolveFluxLocalPath(versionDir, fluxPath) {
  if (!fluxPath || !versionDir) return '';
  const normalized = String(fluxPath).replace(/\\/g, '/').replace(/^\.\//, '');
  const appName = path.basename(path.dirname(versionDir));
  const ver = path.basename(versionDir);
  const marker = `applications/${appName}/${ver}`;
  const idx = normalized.indexOf(marker);
  let local;
  if (idx >= 0) {
    const rest = normalized.slice(idx + marker.length).replace(/^\//, '');
    local = rest ? path.join(versionDir, rest) : versionDir;
  } else {
    local = path.resolve(versionDir, normalized);
    const rel = path.relative(versionDir, local);
    if (rel.startsWith('..') || path.isAbsolute(rel) || !fs.existsSync(local)) {
      local = path.join(versionDir, path.basename(normalized));
    }
  }
  return fs.existsSync(local) ? local : '';
}

/** `kubectl kustomize <dir>` (falls back to `kustomize build`). */
function runKustomize(dir) {
  const attempts = [
    ['kubectl', ['kustomize', dir]],
    ['kustomize', ['build', dir]],
  ];
  let lastErr = '';
  for (const [cmd, args] of attempts) {
    const result = spawnSync(cmd, args, {
      encoding: 'utf8',
      timeout: 60000,
    });
    if (result.error && result.error.code === 'ENOENT') {
      lastErr = `${cmd} not found`;
      continue;
    }
    if (result.status === 0) {
      return parseYamlMulti(result.stdout || '');
    }
    lastErr = (result.stderr || result.stdout || `${cmd} exit ${result.status}`).trim();
  }
  throw new Error(lastErr || 'kustomize failed');
}

/**
 * Collect rendered manifests from a native kustomization.yaml resources list.
 *
 * Level 1: native kustomize resources (files / dirs).
 * Level 2: Flux Kustomization CRs → follow spec.path and `kubectl kustomize`
 * that directory (treated as a regular kustomization root).
 *
 * @param {string} kustPath
 * @param {string} [versionDir] applications/<app>/<version> (for Flux path resolve)
 */
function loadDocsFromKustomization(kustPath, versionDir) {
  if (!fs.existsSync(kustPath)) return [];
  const dir = path.dirname(kustPath);
  if (!versionDir) {
    // helmrelease/kustomization.yaml → parent is versionDir; else kust dir is.
    versionDir =
      path.basename(dir) === 'helmrelease' ? path.dirname(dir) : dir;
  }

  let kust;
  try {
    const loaded = parseAllPlain(kustPath);
    kust =
      loaded.find((d) => isNativeKustomization(d) && Array.isArray(d.resources)) ||
      loaded.find((d) => isNativeKustomization(d)) ||
      loaded[0];
  } catch (err) {
    console.warn(`  WARN: failed to parse ${kustPath}: ${err.message}`);
    return [];
  }
  if (!kust || !Array.isArray(kust.resources)) return [];

  const docs = [];
  for (const res of kust.resources) {
    const p = path.join(dir, String(res));
    if (!fs.existsSync(p)) {
      console.warn(`  WARN: kustomization resource missing: ${p}`);
      continue;
    }
    const st = fs.statSync(p);
    if (st.isDirectory()) {
      const nested = ['kustomization.yaml', 'kustomization.yml', 'Kustomization']
        .map((n) => path.join(p, n))
        .find((f) => fs.existsSync(f));
      if (nested) {
        try {
          docs.push(...runKustomize(p));
        } catch (err) {
          // Fall back to walking the native kustomization tree.
          console.warn(
            `  WARN: kubectl kustomize ${p}: ${err.message}; walking resources`,
          );
          docs.push(...loadDocsFromKustomization(nested, versionDir));
        }
      } else {
        for (const f of fs.readdirSync(p)) {
          if (!/\.ya?ml$/i.test(f)) continue;
          docs.push(...expandResourceDocs(parseAllPlain(path.join(p, f)), versionDir));
        }
      }
      continue;
    }

    docs.push(...expandResourceDocs(parseAllPlain(p), versionDir));
  }
  return docs;
}

function loadPlainYamlDir(dir) {
  if (!fs.existsSync(dir) || !fs.statSync(dir).isDirectory()) return [];
  const out = [];
  for (const f of fs.readdirSync(dir)) {
    if (!/\.ya?ml$/i.test(f)) continue;
    out.push(...parseAllPlain(path.join(dir, f)));
  }
  return out;
}

/** Expand Flux Kustomizations via kubectl kustomize; keep other docs as-is. */
function expandResourceDocs(rawDocs, versionDir) {
  const out = [];
  for (const doc of rawDocs) {
    if (isFluxKustomization(doc)) {
      const fluxPath = doc.spec && doc.spec.path;
      const local = resolveFluxLocalPath(versionDir, fluxPath);
      if (!local) {
        console.warn(
          `  WARN: flux Kustomization path not found under version dir: ${fluxPath}`,
        );
        continue;
      }
      try {
        out.push(...runKustomize(local));
      } catch (err) {
        // Some Flux targets are plain manifest dirs (no kustomization.yaml).
        const plain = loadPlainYamlDir(local);
        if (plain.length) {
          out.push(...plain);
        } else {
          console.warn(`  WARN: kubectl kustomize ${local}: ${err.message}`);
        }
      }
      continue;
    }
    if (isNativeKustomization(doc)) continue;
    out.push(doc);
  }
  return out;
}

function findHelmreleaseKustomization(versionDir) {
  const candidates = [
    path.join(versionDir, 'helmrelease', 'kustomization.yaml'),
    path.join(versionDir, 'helmrelease', 'kustomization.yml'),
    path.join(versionDir, 'kustomization.yaml'),
    path.join(versionDir, 'kustomization.yml'),
  ];
  return candidates.find((p) => fs.existsSync(p)) || '';
}

function docsByKind(docs, kind) {
  return docs.filter((d) => d && d.kind === kind);
}

function nameOf(doc) {
  return doc && doc.metadata && doc.metadata.name
    ? String(doc.metadata.name)
    : '';
}

/**
 * Require a HelmRelease whose metadata.name equals the app name.
 * No fallback to "first HR" — logs ERROR and returns null on mismatch.
 */
function pickHelmRelease(docs, appName, contextLabel) {
  const releases = docsByKind(docs, 'HelmRelease');
  if (!releases.length) return null;
  const want = appName ? String(appName) : '';
  if (!want) {
    console.error(
      `  ERROR: appName required to select HelmRelease` +
        (contextLabel ? ` (${contextLabel})` : ''),
    );
    return null;
  }
  const exact = releases.find((r) => nameOf(r) === want);
  if (exact) return exact;
  console.error(
    `  ERROR: no HelmRelease named "${want}"` +
      (contextLabel ? ` in ${contextLabel}` : '') +
      ` (found: ${releases.map(nameOf).filter(Boolean).join(', ') || 'none'})`,
  );
  return null;
}

function isDefaultsConfigMapName(name) {
  return /(?:^|-)config-defaults$/i.test(String(name || ''));
}

/** Non-defaults ConfigMaps from valuesFrom (e.g. harbor-valkey-overrides). */
function overrideConfigMapNames(helmRelease) {
  const valuesFrom =
    (helmRelease && helmRelease.spec && helmRelease.spec.valuesFrom) || [];
  const names = [];
  const seen = new Set();
  for (const v of valuesFrom) {
    if (!v || v.kind !== 'ConfigMap' || !v.name) continue;
    const n = String(v.name);
    if (isDefaultsConfigMapName(n)) continue;
    if (seen.has(n)) continue;
    seen.add(n);
    names.push(n);
  }
  return names;
}

function mergeHelmReleaseValues(docs, hr, cacheRoot, label) {
  const overlayText = resolveConfigMapValuesText(docs, hr);
  let baseText = '';
  const chart = resolveOciChart(docs, hr);
  if (chart) {
    try {
      const valuesPath = helmPull(chart.url, chart.tag, cacheRoot);
      baseText = fs.readFileSync(valuesPath, 'utf8');
    } catch (err) {
      console.warn(
        `  WARN: helm pull failed for ${chart.url}@${chart.tag} (${label}): ${err.message}`,
      );
    }
  } else if (hr) {
    console.warn(
      `  WARN: could not resolve OCIRepository for HelmRelease ${nameOf(hr)} (${label})`,
    );
  }
  return mergeValuesYamlStrings(baseText, overlayText);
}

function pairKey(pair) {
  if (!pair || pair.key == null) return undefined;
  if (YAML.isScalar(pair.key)) return pair.key.value;
  return pair.key;
}

/**
 * Deep-merge overlay YAML.Document onto base YAML.Document in place.
 * - Existing keys keep their position (and key comments) from base
 * - Nested maps recurse
 * - Scalars / seqs are replaced with overlay nodes (overlay comments travel)
 * - New keys from overlay are appended in overlay order
 */
function mergeYamlMaps(baseMap, overlayMap) {
  if (!YAML.isMap(baseMap) || !YAML.isMap(overlayMap)) return;

  for (const overlayPair of overlayMap.items) {
    const key = pairKey(overlayPair);
    const idx = baseMap.items.findIndex((p) => pairKey(p) === key);
    if (idx < 0) {
      // Append new key from app ConfigMap (preserves overlay order among new keys).
      baseMap.items.push(overlayPair);
      continue;
    }

    const basePair = baseMap.items[idx];
    const baseVal = basePair.value;
    const overVal = overlayPair.value;

    if (YAML.isMap(baseVal) && YAML.isMap(overVal)) {
      mergeYamlMaps(baseVal, overVal);
      continue;
    }

    // Replace value node; keep base key + its comments. Prefer overlay value
    // comments when the overlay pair carries them.
    basePair.value = overVal;
    if (overlayPair.value && overlayPair.value.comment != null) {
      basePair.value.comment = overlayPair.value.comment;
    }
  }
}

function mergeValuesYamlStrings(baseText, overlayText) {
  const baseEmpty = !baseText || !String(baseText).trim();
  const overEmpty = !overlayText || !String(overlayText).trim();
  if (baseEmpty && overEmpty) return '';
  if (baseEmpty) {
    const overDoc = YAML.parseDocument(String(overlayText), {keepSourceTokens: true});
    return overDoc.toString({lineWidth: 100});
  }
  if (overEmpty) {
    const baseDoc = YAML.parseDocument(String(baseText), {keepSourceTokens: true});
    return baseDoc.toString({lineWidth: 100});
  }

  const baseDoc = YAML.parseDocument(String(baseText), {keepSourceTokens: true});
  const overDoc = YAML.parseDocument(String(overlayText), {keepSourceTokens: true});

  if (YAML.isMap(baseDoc.contents) && YAML.isMap(overDoc.contents)) {
    mergeYamlMaps(baseDoc.contents, overDoc.contents);
    return baseDoc.toString({lineWidth: 100});
  }

  // Non-map roots: overlay wins wholesale (still comment-preserving for overlay).
  return overDoc.toString({lineWidth: 100});
}

function extractCmValuesYamlText(cm) {
  if (!cm || !cm.data) return '';
  const raw = cm.data['values.yaml'];
  if (raw == null) return '';
  return typeof raw === 'string' ? raw : '';
}

function resolveConfigMapValuesText(docs, helmRelease) {
  const cms = docsByKind(docs, 'ConfigMap');
  if (!cms.length) return '';

  const valuesFrom = (helmRelease && helmRelease.spec && helmRelease.spec.valuesFrom) || [];
  const wanted = valuesFrom
    .filter((v) => v && v.kind === 'ConfigMap' && v.name)
    .map((v) => String(v.name));

  let cm = null;
  if (wanted.length) {
    cm = cms.find((c) => wanted.includes(nameOf(c)));
  }
  if (!cm) {
    cm = cms.find((c) => c.data && c.data['values.yaml'] != null) || cms[0];
  }
  return extractCmValuesYamlText(cm);
}

function resolveOciChart(docs, helmRelease) {
  const chartRef = helmRelease && helmRelease.spec && helmRelease.spec.chartRef;
  if (!chartRef || chartRef.kind !== 'OCIRepository' || !chartRef.name) {
    return null;
  }
  const want = String(chartRef.name);
  const repos = docsByKind(docs, 'OCIRepository');
  let repo = repos.find((r) => nameOf(r) === want);
  if (!repo && repos.length === 1) repo = repos[0];
  if (!repo || !repo.spec || !repo.spec.url) return null;

  // Expand Flux/bash-style ${var:=default} / ${var:-default} left unsubstituted
  // in catalog manifests (e.g. ${ociRegistryURL:=oci://ghcr.io}/mesosphere/...).
  const url = String(repo.spec.url)
    .trim()
    .replace(/\$\{[^:=}-]+:?[=-]([^}]+)\}/g, '$1');
  const tag =
    (repo.spec.ref && (repo.spec.ref.tag || repo.spec.ref.semver)) || '';
  if (!tag) {
    if (repo.spec.ref && repo.spec.ref.digest) {
      console.warn(`  WARN: OCIRepository digest refs not supported yet (${url})`);
    }
    return null;
  }
  return {url, tag: String(tag)};
}

function ensureDockerConfig(cacheRoot) {
  const dockerDir = path.join(cacheRoot, '_docker');
  fs.mkdirSync(dockerDir, {recursive: true});
  const cfg = path.join(dockerDir, 'config.json');
  if (!fs.existsSync(cfg)) {
    fs.writeFileSync(cfg, `${JSON.stringify({auths: {}}, null, 2)}\n`);
  }
  const helmReg = path.join(cacheRoot, '_helm-registry.json');
  if (!fs.existsSync(helmReg)) {
    fs.writeFileSync(helmReg, '{}\n');
  }
  return {dockerDir, helmReg};
}

function cacheKey(url, tag) {
  return crypto.createHash('sha256').update(`${url}\n${tag}`).digest('hex').slice(0, 24);
}

function findValuesYaml(extractDir) {
  if (!fs.existsSync(extractDir)) return '';
  const stack = [extractDir];
  while (stack.length) {
    const dir = stack.pop();
    const chartYaml = path.join(dir, 'Chart.yaml');
    const valuesYaml = path.join(dir, 'values.yaml');
    if (fs.existsSync(chartYaml) && fs.existsSync(valuesYaml)) {
      return valuesYaml;
    }
    let entries;
    try {
      entries = fs.readdirSync(dir, {withFileTypes: true});
    } catch {
      continue;
    }
    for (const e of entries) {
      if (e.isDirectory() && e.name !== 'charts' && e.name !== 'templates') {
        stack.push(path.join(dir, e.name));
      }
    }
  }
  const stack2 = [extractDir];
  while (stack2.length) {
    const dir = stack2.pop();
    const valuesYaml = path.join(dir, 'values.yaml');
    if (fs.existsSync(valuesYaml)) return valuesYaml;
    let entries;
    try {
      entries = fs.readdirSync(dir, {withFileTypes: true});
    } catch {
      continue;
    }
    for (const e of entries) {
      if (e.isDirectory()) stack2.push(path.join(dir, e.name));
    }
  }
  return '';
}

function helmPull(url, tag, cacheRoot) {
  const key = cacheKey(url, tag);
  const dest = path.join(cacheRoot, key);
  const marker = path.join(dest, '.ok');
  if (fs.existsSync(marker)) {
    const valuesPath = findValuesYaml(dest);
    if (valuesPath) return valuesPath;
  }

  fs.mkdirSync(dest, {recursive: true});
  const {dockerDir, helmReg} = ensureDockerConfig(cacheRoot);
  const ociUrl = url.startsWith('oci://') ? url : `oci://${url}`;

  const attempts = [tag];
  if (tag.startsWith('v') && tag.length > 1) attempts.push(tag.slice(1));
  else if (/^\d/.test(tag)) attempts.push(`v${tag}`);

  let lastErr = '';
  for (const ver of attempts) {
    for (const f of fs.readdirSync(dest)) {
      if (f === '.ok') continue;
      fs.rmSync(path.join(dest, f), {recursive: true, force: true});
    }
    const result = spawnSync(
      'helm',
      ['pull', ociUrl, '--version', ver, '--untar', '--untardir', dest],
      {
        encoding: 'utf8',
        env: {
          ...process.env,
          DOCKER_CONFIG: dockerDir,
          HELM_REGISTRY_CONFIG: helmReg,
        },
        timeout: 120000,
      },
    );
    if (result.error && result.error.code === 'ENOENT') {
      throw new Error(
        'helm not found (install kubernetes-helm in docs/devbox.json)',
      );
    }
    if (result.status === 0) {
      const valuesPath = findValuesYaml(dest);
      if (valuesPath) {
        fs.writeFileSync(marker, `${ociUrl}@${ver}\n`);
        return valuesPath;
      }
      lastErr = 'chart pulled but values.yaml not found';
      continue;
    }
    lastErr = (result.stderr || result.stdout || `helm exit ${result.status}`).trim();
  }
  throw new Error(lastErr || 'helm pull failed');
}

function readLegacyCmValuesText(versionDir) {
  const cmFile = path.join(versionDir, 'helmrelease', 'cm.yaml');
  if (!fs.existsSync(cmFile)) return '';
  const docs = parseAllPlain(cmFile);
  const cm = docs.find((d) => d && d.kind === 'ConfigMap') || docs[0];
  return extractCmValuesYamlText(cm);
}

/**
 * @typedef {{ name: string, primary: boolean, valuesYaml: string, overrideConfigMaps: string[] }} ValuesPanel
 */

/**
 * Resolve one panel per HelmRelease (primary = name matches app).
 *
 * @param {string} versionDir absolute path to applications/<app>/<version>
 * @param {{ cacheRoot: string, appName?: string, version?: string }} opts
 * @returns {ValuesPanel[]}
 */
function resolveMergedValuesPanels(versionDir, opts) {
  const cacheRoot = opts.cacheRoot;
  const appName = opts.appName || '';
  const label = `${appName || path.basename(path.dirname(versionDir))}@${opts.version || path.basename(versionDir)}`;
  const contextLabel = path.relative(process.cwd(), versionDir);

  const kustPath = findHelmreleaseKustomization(versionDir);
  if (!kustPath) {
    const text = readLegacyCmValuesText(versionDir);
    if (!text.trim()) return [];
    return [
      {
        name: appName || 'values',
        primary: true,
        valuesYaml: text,
        overrideConfigMaps: [],
      },
    ];
  }

  const docs = loadDocsFromKustomization(kustPath, versionDir);
  const releases = docsByKind(docs, 'HelmRelease');

  if (!releases.length) {
    const text =
      resolveConfigMapValuesText(docs, {}) || readLegacyCmValuesText(versionDir);
    if (!text.trim()) {
      console.warn(
        `  WARN: no HelmRelease in ${contextLabel}; using ConfigMap only (empty)`,
      );
      return [];
    }
    console.warn(
      `  WARN: no HelmRelease in ${contextLabel}; using ConfigMap only`,
    );
    return [
      {
        name: appName || 'values',
        primary: true,
        valuesYaml: text,
        overrideConfigMaps: [],
      },
    ];
  }

  const primary = pickHelmRelease(docs, appName, contextLabel);
  if (!primary) {
    return [];
  }

  const ordered = [primary, ...releases.filter((r) => r !== primary)];
  /** @type {ValuesPanel[]} */
  const panels = [];
  for (const hr of ordered) {
    const name = nameOf(hr);
    const valuesYaml = mergeHelmReleaseValues(
      docs,
      hr,
      cacheRoot,
      `${label}/${name}`,
    );
    if (!valuesYaml.trim()) {
      if (hr === primary) {
        console.error(
          `  ERROR: HelmRelease "${name}" produced empty values (${contextLabel})`,
        );
      }
      continue;
    }
    panels.push({
      name,
      primary: hr === primary,
      valuesYaml,
      overrideConfigMaps: overrideConfigMapNames(hr),
    });
  }
  return panels;
}

/**
 * @param {string} versionDir absolute path to applications/<app>/<version>
 * @param {{ cacheRoot: string, appName?: string, version?: string }} opts
 * @returns {string} primary panel values.yaml text (may be empty)
 */
function resolveMergedValuesYaml(versionDir, opts) {
  const panels = resolveMergedValuesPanels(versionDir, opts);
  const primary = panels.find((p) => p.primary);
  return primary ? primary.valuesYaml : '';
}

module.exports = {
  resolveMergedValuesYaml,
  resolveMergedValuesPanels,
  mergeValuesYamlStrings,
  loadDocsFromKustomization,
  findHelmreleaseKustomization,
  resolveFluxLocalPath,
  pickHelmRelease,
  overrideConfigMapNames,
};
