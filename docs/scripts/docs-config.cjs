'use strict';

/**
 * Shared loader for docs/source/config.yaml (human-edited).
 * Node/scripts only — browser code must use site/src/data/*.json from sync.
 */
const fs = require('fs');
const path = require('path');

const DOCS_ROOT = path.resolve(__dirname, '..');
const CONFIG_FILE = path.join(DOCS_ROOT, 'source', 'config.yaml');

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

function applicationsFromConfig(cfg) {
  const a = cfg && cfg.applications;
  if (!a || !a.nkpVersionFloor || !a.maxGaNkpVersion) {
    throw new Error(
      'config.yaml applications.nkpVersionFloor/maxGaNkpVersion required',
    );
  }
  return {
    nkpVersionFloor: String(a.nkpVersionFloor),
    maxGaNkpVersion: String(a.maxGaNkpVersion),
    knownNkpVersions: (a.knownNkpVersions || []).map(String),
  };
}

function cliVersionsFromConfig(cfg) {
  const cli = cfg && cfg.cliDocs;
  if (!cli || !Array.isArray(cli.minors) || cli.minors.length === 0) {
    throw new Error('config.yaml cliDocs.minors is empty');
  }
  return {
    defaultMinor: String(
      cli.defaultMinor || cli.minors[cli.minors.length - 1].minor,
    ),
    minors: cli.minors.map((m) => ({
      minor: String(m.minor),
      latest: String(m.latest),
      patches: Array.isArray(m.patches)
        ? m.patches.map(String)
        : [String(m.latest)],
      unlisted: !!m.unlisted,
      ...(m.label ? {label: String(m.label)} : {}),
    })),
  };
}

function portalFromApplications(nkp) {
  const ver = String(nkp.maxGaNkpVersion).replace(/^v/, '');
  return {
    nkpVersion: ver,
    nkpDocsBaseUrl:
      'https://portal.nutanix.com/page/documents/details?targetId=Nutanix-Kubernetes-Platform-v' +
      ver.replace('.', '_'),
  };
}

function portalFromConfig(cfg) {
  return portalFromApplications(applicationsFromConfig(cfg));
}

/** Prefer synced JSON; else read config.yaml (no hardcoded NKP versions). */
function loadPortalVersion(siteRoot) {
  const jsonPath = path.join(siteRoot, 'src', 'data', 'portal-version.json');
  if (fs.existsSync(jsonPath)) {
    return JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
  }
  return portalFromConfig(loadConfigYaml());
}

module.exports = {
  DOCS_ROOT,
  CONFIG_FILE,
  loadConfigYaml,
  applicationsFromConfig,
  cliVersionsFromConfig,
  portalFromApplications,
  portalFromConfig,
  loadPortalVersion,
};
