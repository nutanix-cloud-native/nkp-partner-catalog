#!/usr/bin/env node
/**
 * Sync docs/source/config.yaml → site/src/data/*.json for the Docusaurus bundle.
 * Run from `just _docs-prepare` (also invoked by generate-cli-docs).
 * Do not commit the JSON outputs — edit config.yaml instead.
 */
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {createRequire} from 'node:module';

const require = createRequire(import.meta.url);
const {
  DOCS_ROOT,
  loadConfigYaml,
  applicationsFromConfig,
  catalogsFromConfig,
  siteFromConfig,
  cliVersionsFromConfig,
  portalFromConfig,
} = require('./docs-config.cjs');

const DATA_DIR = path.join(DOCS_ROOT, 'site', 'src', 'data');

function sync() {
  const cfg = loadConfigYaml();
  const nkp = applicationsFromConfig(cfg);
  // Footer / nav: logical catalogs only (do not require resolved hybrid expand).
  const {list: catalogsFull} = catalogsFromConfig(cfg, {requireResolved: false});
  const catalogs = catalogsFull.map((c) => ({
    id: c.id,
    name: c.name,
    slug: c.slug,
    repo: c.repo,
    nkpVersionsSource: c.nkpVersionsSource,
  }));
  const site = siteFromConfig(cfg);
  const portal = portalFromConfig(cfg);

  let cliVersions;
  try {
    cliVersions = cliVersionsFromConfig(cfg);
  } catch (err) {
    console.warn(
      `WARN: cli-versions sync skipped (${err.message || err}); run just resolve-nkp-releases`,
    );
    cliVersions = {
      downloadUrl: String((cfg.cliDocs && cfg.cliDocs.downloadUrl) || ''),
      defaultMinor: String((cfg.cliDocs && cfg.cliDocs.defaultMinor) || nkp.nkpVersionFloor),
      minors: [],
    };
  }

  fs.mkdirSync(DATA_DIR, {recursive: true});
  fs.writeFileSync(
    path.join(DATA_DIR, 'nkp-version-config.json'),
    `${JSON.stringify(nkp, null, 2)}\n`,
  );
  fs.writeFileSync(
    path.join(DATA_DIR, 'catalogs.json'),
    `${JSON.stringify(catalogs, null, 2)}\n`,
  );
  fs.writeFileSync(
    path.join(DATA_DIR, 'site-config.json'),
    `${JSON.stringify(site, null, 2)}\n`,
  );
  fs.writeFileSync(
    path.join(DATA_DIR, 'cli-versions.json'),
    `${JSON.stringify(cliVersions, null, 2)}\n`,
  );
  fs.writeFileSync(
    path.join(DATA_DIR, 'portal-version.json'),
    `${JSON.stringify(portal, null, 2)}\n`,
  );
  console.log('Synced site/src/data from config.yaml', {
    nkp,
    catalogs: catalogs.map((c) => c.id),
    site: {organization: site.organization, project: site.project},
    cliDefault: cliVersions.defaultMinor,
    cliMinors: cliVersions.minors.map((m) => m.minor),
    portal,
  });
}

sync();
