'use strict';

/**
 * Shared loader for docs/source/config.yaml (human-edited).
 * Node/scripts only — browser code must use site/src/data/*.json from sync.
 *
 * Resolved NKP patch tags live in .cache/nkp-releases.json (from resolve-nkp-releases);
 * they are not committed.
 */
const fs = require('fs');
const path = require('path');

const DOCS_ROOT = path.resolve(__dirname, '..');
const CONFIG_FILE = path.join(DOCS_ROOT, 'source', 'config.yaml');
const NKP_RELEASES_CACHE = path.join(DOCS_ROOT, '.cache', 'nkp-releases.json');

function loadYamlModule() {
  try {
    return require(path.join(DOCS_ROOT, 'site', 'node_modules', 'js-yaml'));
  } catch {
    throw new Error(
      'Missing js-yaml. From docs/: just _docs-prepare (installs site deps) or cd site && npm ci',
    );
  }
}

function loadConfigYaml() {
  if (!fs.existsSync(CONFIG_FILE)) {
    throw new Error(`Missing ${path.relative(DOCS_ROOT, CONFIG_FILE)}`);
  }
  const yaml = loadYamlModule();
  return yaml.load(fs.readFileSync(CONFIG_FILE, 'utf8')) || {};
}

function compareMinor(a, b) {
  const pa = String(a).split('.').map((n) => parseInt(n, 10) || 0);
  const pb = String(b).split('.').map((n) => parseInt(n, 10) || 0);
  for (let i = 0; i < 2; i++) {
    if ((pa[i] || 0) !== (pb[i] || 0)) return (pa[i] || 0) - (pb[i] || 0);
  }
  return 0;
}

function nextMinor(v) {
  const [maj, min] = String(v).split('.').map((n) => parseInt(n, 10) || 0);
  return `${maj}.${min + 1}`;
}

/** Prefix patch tag for git refs / OCI tags (2.18.0 → v2.18.0). */
function vTag(latest) {
  const t = String(latest || '').trim();
  if (!t) return '';
  return t.startsWith('v') ? t : `v${t}`;
}

/**
 * Load probed NKP releases (gitignored). Returns null if missing.
 * Shape: { floor, maxGa, minors: [{ minor, latest }], generatedAt? }
 */
function loadResolvedNkpReleases() {
  if (!fs.existsSync(NKP_RELEASES_CACHE)) return null;
  try {
    const data = JSON.parse(fs.readFileSync(NKP_RELEASES_CACHE, 'utf8'));
    if (!data || !Array.isArray(data.minors) || data.minors.length === 0) return null;
    return {
      floor: data.floor ? String(data.floor) : '',
      maxGa: data.maxGa ? String(data.maxGa) : '',
      minors: data.minors.map((m) => ({
        minor: String(m.minor),
        latest: String(m.latest),
      })),
      generatedAt: data.generatedAt || '',
    };
  } catch {
    return null;
  }
}

function requireResolvedNkpReleases() {
  const resolved = loadResolvedNkpReleases();
  if (resolved) return resolved;
  throw new Error(
    `Missing ${path.relative(DOCS_ROOT, NKP_RELEASES_CACHE)} — run: just resolve-nkp-releases`,
  );
}

function applicationsFromConfig(cfg) {
  const a = cfg && cfg.applications;
  if (!a || !a.nkpVersionFloor || !a.maxGaNkpVersion) {
    throw new Error(
      'config.yaml applications.nkpVersionFloor/maxGaNkpVersion required',
    );
  }
  const floor = String(a.nkpVersionFloor);
  const maxGa = String(a.maxGaNkpVersion);
  const resolved = loadResolvedNkpReleases();
  let knownNkpVersions = (a.knownNkpVersions || []).map(String);
  if (resolved && resolved.minors.length) {
    // Catalog only lists minors at/above the applications floor (CLI may be older).
    knownNkpVersions = resolved.minors
      .map((m) => m.minor)
      .filter((m) => compareMinor(m, floor) >= 0);
  }
  if (!knownNkpVersions.length) {
    // Prepare may run before first probe; keep a minimal floor entry so sync
    // does not crash — generate paths require resolve.
    knownNkpVersions = [floor];
  }
  return {
    nkpVersionFloor: floor,
    maxGaNkpVersion: maxGa,
    knownNkpVersions,
  };
}

/**
 * Normalize catalogs[] into logical entries with concrete crawl sources[].
 * Expands kind: platformHybrid using resolved NKP releases.
 */
function catalogsFromConfig(cfg, opts = {}) {
  const rawList = cfg && cfg.catalogs;
  if (!Array.isArray(rawList) || rawList.length === 0) {
    throw new Error('config.yaml catalogs must be a non-empty list');
  }
  const requireResolved = opts.requireResolved !== false;
  const catalogFloor = String(
    (cfg.applications && cfg.applications.nkpVersionFloor) || '',
  );
  const byId = {};
  const list = [];
  let versionsSources = 0;

  for (const raw of rawList) {
    if (!raw || !raw.id || !raw.name || !raw.slug || !raw.repo) {
      throw new Error(
        'config.yaml catalogs[] entries require id, name, slug, and repo',
      );
    }
    const id = String(raw.id);
    if (byId[id]) {
      throw new Error(`config.yaml catalogs: duplicate id ${id}`);
    }

    const entry = {
      id,
      name: String(raw.name),
      slug: String(raw.slug),
      repo: String(raw.repo),
      nkpVersionsSource: !!raw.nkpVersionsSource,
      sources: [],
    };
    if (entry.nkpVersionsSource) versionsSources += 1;

    if (!raw.sources || !Array.isArray(raw.sources) || raw.sources.length === 0) {
      // Legacy: one sibling dir named id with applications/ at root.
      entry.sources.push({
        id,
        kind: 'git',
        repo: entry.repo,
        ref: '',
        applicationsPath: 'applications',
        nkpVersions: [],
        catalogRepo: entry.repo,
      });
    } else {
      for (const src of raw.sources) {
        if (!src || !src.kind) {
          throw new Error(
            `config.yaml catalogs[${id}].sources[] require kind`,
          );
        }
        if (src.kind === 'platformHybrid') {
          entry.sources.push(
            ...expandPlatformHybrid(id, src, requireResolved, catalogFloor),
          );
        } else if (src.kind === 'git') {
          if (!src.id || !src.repo) {
            throw new Error(
              `config.yaml catalogs[${id}] git source requires id and repo`,
            );
          }
          entry.sources.push({
            id: String(src.id),
            kind: 'git',
            repo: String(src.repo),
            ref: src.ref ? String(src.ref) : '',
            applicationsPath: String(src.applicationsPath || 'applications'),
            nkpVersions: (src.nkpVersions || []).map(String),
            catalogRepo: String(src.repo),
          });
        } else if (src.kind === 'oci') {
          if (!src.id || !src.oci || !src.tag) {
            throw new Error(
              `config.yaml catalogs[${id}] oci source requires id, oci, and tag`,
            );
          }
          entry.sources.push({
            id: String(src.id),
            kind: 'oci',
            oci: String(src.oci),
            tag: String(src.tag),
            applicationsPath: String(src.applicationsPath || 'applications'),
            nkpVersions: (src.nkpVersions || []).map(String),
            catalogRepo: '',
          });
        } else {
          throw new Error(
            `config.yaml catalogs[${id}]: unknown source kind ${src.kind}`,
          );
        }
      }
    }

    byId[id] = entry;
    list.push(entry);
  }

  if (versionsSources !== 1) {
    throw new Error(
      'config.yaml catalogs[] must mark exactly one entry with nkpVersionsSource: true',
    );
  }
  return {byId, list};
}

function expandPlatformHybrid(catalogId, src, requireResolved, catalogFloor) {
  if (!src.gitRepo || !src.oci) {
    throw new Error(
      `config.yaml catalogs[${catalogId}] platformHybrid requires gitRepo and oci`,
    );
  }
  const ociFromMinor = String(src.ociFromMinor || '2.19');
  const tagPrefix = src.tagPrefix != null ? String(src.tagPrefix) : 'v';
  const resolved = requireResolved
    ? requireResolvedNkpReleases()
    : loadResolvedNkpReleases();
  if (!resolved || !resolved.minors.length) {
    if (requireResolved) {
      requireResolvedNkpReleases();
    }
    return [];
  }

  const floor = catalogFloor ? String(catalogFloor) : '';
  const gitRepo = String(src.gitRepo);
  const oci = String(src.oci);
  const out = [];
  for (const {minor, latest} of resolved.minors) {
    if (floor && compareMinor(minor, floor) < 0) continue;
    const tag = tagPrefix ? `${tagPrefix}${String(latest).replace(/^v/, '')}` : String(latest);
    const useOci = compareMinor(minor, ociFromMinor) >= 0;
    if (useOci) {
      out.push({
        id: `kommander-applications-full-${minor}`,
        kind: 'oci',
        oci,
        tag,
        applicationsPath: 'applications',
        nkpVersions: [minor],
        catalogRepo: '',
      });
    } else {
      out.push({
        id: `kommander-applications-${minor}`,
        kind: 'git',
        repo: gitRepo,
        ref: tag,
        applicationsPath: 'applications',
        nkpVersions: [minor],
        catalogRepo: gitRepo,
      });
    }
  }
  return out;
}

/** Flat list of all crawl sources across catalogs (for fetch / CI). */
function allCatalogSources(cfg, opts) {
  const {list} = catalogsFromConfig(cfg, opts);
  const out = [];
  const seen = new Set();
  for (const cat of list) {
    for (const src of cat.sources) {
      if (seen.has(src.id)) {
        throw new Error(`duplicate catalog source id ${src.id}`);
      }
      seen.add(src.id);
      out.push({...src, catalogId: cat.id, catalogName: cat.name});
    }
  }
  return out;
}

/**
 * Support string covering exactly the given minors (e.g. 2.18 → ">=2.18 <2.19").
 */
function nkpSupportForMinors(minors) {
  const list = [...new Set((minors || []).map(String))].sort(compareMinor);
  if (!list.length) return '';
  if (list.length === 1) {
    const m = list[0];
    return `>=${m} <${nextMinor(m)}`;
  }
  return `>=${list[0]} <${nextMinor(list[list.length - 1])}`;
}

function siteFromConfig(cfg) {
  const s = cfg && cfg.site;
  if (
    !s ||
    !s.organization ||
    !s.project ||
    !s.siteUrl ||
    !s.githubRepo ||
    !s.editPath ||
    !s.portalHomeUrl ||
    !s.portalDocsUrlTemplate
  ) {
    throw new Error(
      'config.yaml site requires organization, project, siteUrl, githubRepo, editPath, portalHomeUrl, portalDocsUrlTemplate',
    );
  }
  return {
    title: String(s.title || 'NKP Catalog'),
    tagline: String(s.tagline || 'Documentation for NKP Catalog'),
    organization: String(s.organization),
    project: String(s.project),
    siteUrl: String(s.siteUrl).replace(/\/$/, ''),
    githubRepo: String(s.githubRepo).replace(/\/$/, ''),
    editPath: String(s.editPath).replace(/^\/+|\/+$/g, ''),
    portalHomeUrl: String(s.portalHomeUrl).replace(/\/$/, ''),
    portalDocsUrlTemplate: String(s.portalDocsUrlTemplate).trim(),
  };
}

/**
 * CLI versions: resolved releases + optional cliDocs.minors overlays + defaultMinor.
 * Includes minors from cliDocs.nkpVersionFloor (falls back to applications floor).
 */
function cliVersionsFromConfig(cfg) {
  const cli = cfg && cfg.cliDocs;
  if (!cli || !cli.downloadUrl) {
    throw new Error('config.yaml cliDocs.downloadUrl is required');
  }
  const apps = applicationsFromConfig(cfg);
  const maxGa = apps.maxGaNkpVersion;
  const cliFloor = String(cli.nkpVersionFloor || apps.nkpVersionFloor);
  const resolved = requireResolvedNkpReleases();

  const overlays = new Map();
  for (const m of cli.minors || []) {
    if (!m || !m.minor) continue;
    overlays.set(String(m.minor), {
      unlisted: m.unlisted,
      label: m.label ? String(m.label) : undefined,
      // optional hard pin (escape hatch; prefer probe)
      latest: m.latest ? String(m.latest) : undefined,
    });
  }

  const minors = resolved.minors
    .filter(({minor}) => compareMinor(minor, cliFloor) >= 0)
    .map(({minor, latest: probed}) => {
    const overlay = overlays.get(minor) || {};
    const latest = overlay.latest || probed;
    const isPre = /-/u.test(latest);
    const aboveGa = compareMinor(minor, maxGa) > 0;
    const unlisted =
      overlay.unlisted !== undefined
        ? !!overlay.unlisted
        : isPre || aboveGa;
    const label =
      overlay.label ||
      (isPre || aboveGa ? `${minor} (dev)` : undefined);
    return {
      minor,
      latest,
      patches: [latest],
      unlisted,
      ...(label ? {label} : {}),
    };
  });

  if (!minors.length) {
    throw new Error('resolved NKP releases produced no CLI minors');
  }

  let defaultMinor = cli.defaultMinor
    ? String(cli.defaultMinor)
    : minors.filter((m) => !m.unlisted).slice(-1)[0]?.minor;
  if (!defaultMinor || !minors.some((m) => m.minor === defaultMinor)) {
    defaultMinor = minors.filter((m) => !m.unlisted).slice(-1)[0]?.minor
      || minors[minors.length - 1].minor;
  }

  return {
    downloadUrl: String(cli.downloadUrl).trim(),
    defaultMinor,
    nkpVersionFloor: cliFloor,
    minors,
  };
}

function portalDocsUrl(template, maxGaNkpVersion) {
  const ver = String(maxGaNkpVersion).replace(/^v/, '');
  return String(template)
    .replaceAll('{version_underscore}', ver.replace('.', '_'))
    .replaceAll('{version}', ver);
}

function portalFromConfig(cfg) {
  const nkp = applicationsFromConfig(cfg);
  const site = siteFromConfig(cfg);
  const ver = String(nkp.maxGaNkpVersion).replace(/^v/, '');
  return {
    nkpVersion: ver,
    nkpDocsBaseUrl: portalDocsUrl(site.portalDocsUrlTemplate, ver),
  };
}

/** Prefer synced JSON; else read config.yaml. */
function loadPortalVersion(siteRoot) {
  const jsonPath = path.join(siteRoot, 'src', 'data', 'portal-version.json');
  if (fs.existsSync(jsonPath)) {
    return JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
  }
  return portalFromConfig(loadConfigYaml());
}

function loadSiteConfig(siteRoot) {
  const jsonPath = path.join(siteRoot, 'src', 'data', 'site-config.json');
  if (fs.existsSync(jsonPath)) {
    return JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
  }
  return siteFromConfig(loadConfigYaml());
}

function loadCatalogsList(siteRoot) {
  const jsonPath = path.join(siteRoot, 'src', 'data', 'catalogs.json');
  if (fs.existsSync(jsonPath)) {
    return JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
  }
  // Footer only needs logical catalogs (no expanded hybrid sources).
  return catalogsFromConfig(loadConfigYaml(), {requireResolved: false}).list.map(
    (c) => ({
      id: c.id,
      name: c.name,
      slug: c.slug,
      repo: c.repo,
      nkpVersionsSource: c.nkpVersionsSource,
    }),
  );
}

module.exports = {
  DOCS_ROOT,
  CONFIG_FILE,
  NKP_RELEASES_CACHE,
  loadConfigYaml,
  applicationsFromConfig,
  catalogsFromConfig,
  allCatalogSources,
  nkpSupportForMinors,
  siteFromConfig,
  cliVersionsFromConfig,
  portalDocsUrl,
  portalFromConfig,
  loadPortalVersion,
  loadSiteConfig,
  loadCatalogsList,
  loadResolvedNkpReleases,
  requireResolvedNkpReleases,
  vTag,
  compareMinor,
  nextMinor,
};
