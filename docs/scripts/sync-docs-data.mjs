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
  cliVersionsFromConfig,
  portalFromApplications,
} = require('./docs-config.cjs');

const DATA_DIR = path.join(DOCS_ROOT, 'site', 'src', 'data');

function sync() {
  const cfg = loadConfigYaml();
  const nkp = applicationsFromConfig(cfg);
  const cliVersions = cliVersionsFromConfig(cfg);
  const portal = portalFromApplications(nkp);

  fs.mkdirSync(DATA_DIR, {recursive: true});
  fs.writeFileSync(
    path.join(DATA_DIR, 'nkp-version-config.json'),
    `${JSON.stringify(nkp, null, 2)}\n`,
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
    cliDefault: cliVersions.defaultMinor,
    cliMinors: cliVersions.minors.map((m) => m.minor),
    portal,
  });
}

sync();
