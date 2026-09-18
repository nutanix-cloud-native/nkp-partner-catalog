#!/usr/bin/env node
// Crawls applications/ in the three NKP catalog repos and generates:
//   - catalog-data.json (slim listing index for AppCatalog; icon = URL)
//   - source/applications/<app>.{mdx,json} (flat detail pages; icon = URL)
//   - site/static/catalog-icons/<app>.{svg,png,...} (decoded from metadata)
//
// Usage:
//   node generate-catalog.js [--root <sibling-root>] [-o output.json]
//
// Default --root is the parent of this checkout (the org directory that
// contains nkp-partner-catalog, nkp-nutanix-product-catalog, and
// nkp-ai-applications-catalog as siblings).

'use strict';

const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');
const { parseNkpRange, DEFAULT_NKP_VERSIONS, toMinor, compareMinor, gaNkpVersions } = require('../src/components/nkpVersion');

const CATALOGS = {
  'nkp-ai-applications-catalog': {
    name: 'AI Applications',
    slug: 'ai',
    repo: 'https://github.com/nutanix-cloud-native/nkp-ai-applications-catalog',
  },
  'nkp-partner-catalog': {
    name: 'Partner Catalog',
    slug: 'partner',
    repo: 'https://github.com/nutanix-cloud-native/nkp-partner-catalog',
  },
  'nkp-nutanix-product-catalog': {
    name: 'Nutanix Products',
    slug: 'nutanix',
    repo: 'https://github.com/nutanix-cloud-native/nkp-nutanix-product-catalog',
  },
};

const DEFAULT_ROOT = path.resolve(__dirname, '..', '..', '..', '..');

function parseSemver(v) {
  const m = v.match(/^(\d+)\.(\d+)\.(\d+)/);
  return m ? [parseInt(m[1]), parseInt(m[2]), parseInt(m[3])] : null;
}

function compareSemver(a, b) {
  const sa = parseSemver(a);
  const sb = parseSemver(b);
  if (!sa || !sb) return 0;
  for (let i = 0; i < 3; i++) {
    if (sa[i] !== sb[i]) return sa[i] - sb[i];
  }
  return 0;
}

function scanApps(repoPath) {
  const appsDir = path.join(repoPath, 'applications');
  if (!fs.existsSync(appsDir)) {
    console.warn(`  WARN: no applications/ directory at ${appsDir}`);
    return [];
  }

  const apps = [];
  const entries = fs.readdirSync(appsDir, { withFileTypes: true });

  for (const entry of entries) {
    if (!entry.isDirectory() || entry.name.startsWith('.')) continue;

    const appPath = path.join(appsDir, entry.name);
    const versions = fs.readdirSync(appPath, { withFileTypes: true })
      .filter(d => d.isDirectory() && parseSemver(d.name))
      .map(d => d.name)
      .sort(compareSemver);

    if (versions.length === 0) {
      console.warn(`  WARN: skipping ${entry.name}: no semver version directories`);
      continue;
    }

    const latest = versions[versions.length - 1];
    const metaFile = path.join(appPath, latest, 'metadata.yaml');
    if (!fs.existsSync(metaFile)) {
      console.warn(`  WARN: skipping ${entry.name}: missing ${metaFile}`);
      continue;
    }

    let meta;
    try {
      const docs = yaml.loadAll(fs.readFileSync(metaFile, 'utf8')).filter(Boolean);
      meta = docs[0];
      if (!meta) throw new Error('empty document');
    } catch (err) {
      console.error(`  WARN: failed to parse ${metaFile}: ${err.message}`);
      continue;
    }

    let readme = '';
    const readmePath = path.join(appPath, 'README.md');
    if (fs.existsSync(readmePath)) {
      readme = fs.readFileSync(readmePath, 'utf8');
    }

    apps.push({
      name: entry.name,
      version: latest,
      allVersions: versions,
      displayName: meta.displayName || entry.name,
      description: meta.description || '',
      category: meta.category || [],
      licensing: meta.licensing || [],
      scope: meta.scope || [],
      icon: meta.icon || '',
      overview: meta.overview || '',
      supportLink: meta.supportLink || '',
      dependencies: meta.dependencies || [],
      requiredDependencies: meta.requiredDependencies || [],
      allowMultipleInstances: !!meta.allowMultipleInstances,
      nkpVersionSupport: meta.nkpVersionSupport || '',
      nkpRange: parseNkpRange(meta.nkpVersionSupport || ''),
      type: meta.type || 'custom',
      certifications: meta.certifications || [],
      readme,
    });
  }

  return apps.sort((a, b) => a.displayName.localeCompare(b.displayName));
}

function parseArgs(argv) {
  let outputPath = path.resolve(__dirname, '..', '..', 'source', 'catalog-data.json');
  let root = DEFAULT_ROOT;
  const repoOverrides = {};

  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === '-o' || argv[i] === '--output') {
      outputPath = path.resolve(argv[++i]);
    } else if (argv[i] === '--root') {
      root = path.resolve(argv[++i]);
    } else if (argv[i].includes('=')) {
      const eq = argv[i].indexOf('=');
      repoOverrides[argv[i].slice(0, eq)] = path.resolve(argv[i].slice(eq + 1));
    } else {
      console.error(`Unknown argument: ${argv[i]}`);
      process.exit(1);
    }
  }

  return { outputPath, root, repoOverrides };
}

function repoPathFor(id, root, repoOverrides) {
  if (repoOverrides[id]) return repoOverrides[id];
  return path.join(root, id);
}

function loadNkpVersions(partnerRepoPath) {
  const specPath = path.join(partnerRepoPath, '.release', 'stable.yaml');
  if (!fs.existsSync(specPath)) return DEFAULT_NKP_VERSIONS.slice();
  try {
    const spec = yaml.load(fs.readFileSync(specPath, 'utf8'));
    const versions = (spec.releases || [])
      .map(r => toMinor((r.constraints && r.constraints.nkpVersion) || r.tagName))
      .filter(Boolean);
    const unique = [...new Set(versions)].sort(compareMinor);
    return unique.length ? gaNkpVersions(unique) : DEFAULT_NKP_VERSIONS.slice();
  } catch (err) {
    console.warn(`  WARN: failed to read ${specPath}: ${err.message}`);
    return DEFAULT_NKP_VERSIONS.slice();
  }
}

function toListingApp(app) {
  const listingApp = { ...app };
  delete listingApp.overview;
  delete listingApp.readme;
  return listingApp;
}

function writeJson(filePath, value) {
  fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`);
}

/** Decode metadata icon base64 → static file; return site-absolute path or ''. */
function writeCatalogIcon(iconsRoot, appName, iconBase64) {
  if (!iconBase64) return '';
  let buf;
  try {
    buf = Buffer.from(iconBase64, 'base64');
  } catch {
    console.warn(`  WARN: invalid icon base64 for ${appName}`);
    return '';
  }
  if (!buf.length) return '';

  let ext = 'svg';
  if (buf[0] === 0x89 && buf[1] === 0x50) ext = 'png';
  else if (buf[0] === 0xff && buf[1] === 0xd8) ext = 'jpg';
  else if (buf[0] === 0x47 && buf[1] === 0x49) ext = 'gif';
  else if (buf.length >= 12 && buf.slice(8, 12).toString('ascii') === 'WEBP') ext = 'webp';

  const fileName = `${appName}.${ext}`;
  let out = buf;
  // Normalize text SVGs to match trailing-whitespace + end-of-file pre-commit hooks.
  // Do not alter binary formats (png/jpg/gif/webp).
  if (ext === 'svg') {
    const text = buf.toString('utf8')
      .replace(/[ \t]+$/gm, '')
      .replace(/\s*$/, '\n');
    out = Buffer.from(text, 'utf8');
  }
  fs.writeFileSync(path.join(iconsRoot, fileName), out);
  return `/catalog-icons/${fileName}`;
}

const { outputPath, root, repoOverrides } = parseArgs(process.argv.slice(2));

for (const id of Object.keys(repoOverrides)) {
  if (!CATALOGS[id]) {
    console.warn(`Ignoring unknown catalog id ${id} (supported: ${Object.keys(CATALOGS).join(', ')})`);
  }
}

const catalogs = [];

for (const [id, info] of Object.entries(CATALOGS)) {
  const repoPath = repoPathFor(id, root, repoOverrides);
  if (!fs.existsSync(repoPath)) {
    console.warn(`Skipping ${id}: ${repoPath} does not exist`);
    continue;
  }
  console.log(`Scanning ${info.name} (${id}) applications/ at ${repoPath} ...`);

  const apps = scanApps(repoPath);
  console.log(`  Found ${apps.length} application(s)`);

  catalogs.push({
    id,
    name: info.name,
    slug: info.slug,
    repo: info.repo,
    appCount: apps.length,
    apps,
  });
}

if (catalogs.length === 0) {
  console.error('No catalog repositories found. Clone the three catalog repos as siblings, or pass --root.');
  process.exit(1);
}

const partnerPath = repoPathFor('nkp-partner-catalog', root, repoOverrides);
const nkpVersions = loadNkpVersions(partnerPath);

const iconsRoot = path.resolve(__dirname, '..', 'static', 'catalog-icons');
if (fs.existsSync(iconsRoot)) {
  fs.rmSync(iconsRoot, { recursive: true });
}
fs.mkdirSync(iconsRoot, { recursive: true });

// Flat URLs require globally unique app names. Build both output shapes before
// writing anything so a duplicate cannot leave partially generated output.
const seenNames = new Map();
const flatApps = [];
let iconCount = 0;
const listingCatalogs = catalogs.map(catalog => {
  const apps = catalog.apps.map(app => {
    const prior = seenNames.get(app.name);
    if (prior) {
      console.error(
        `ERROR: duplicate application name "${app.name}" in ${catalog.id} and ${prior} — flat URLs require unique names`,
      );
      process.exit(1);
    }
    seenNames.set(app.name, catalog.id);

    const iconUrl = writeCatalogIcon(iconsRoot, app.name, app.icon);
    if (iconUrl) iconCount += 1;

    const fullApp = {
      ...app,
      icon: iconUrl,
      catalogName: catalog.name,
      catalogSlug: catalog.slug,
      catalogRepo: catalog.repo,
    };
    flatApps.push(fullApp);
    return toListingApp(fullApp);
  });

  return { ...catalog, apps };
});

flatApps.sort((a, b) => a.displayName.localeCompare(b.displayName));

const data = {
  totalApps: catalogs.reduce((s, c) => s + c.appCount, 0),
  nkpVersions,
  catalogs: listingCatalogs,
};

fs.mkdirSync(path.dirname(outputPath), { recursive: true });
writeJson(outputPath, data);
console.log(`\nWrote ${outputPath} — ${data.totalApps} app(s) across ${catalogs.length} catalog(s)`);

const pagesRoot = path.resolve(path.dirname(outputPath), 'applications');

if (fs.existsSync(pagesRoot)) {
  fs.rmSync(pagesRoot, { recursive: true });
}

fs.mkdirSync(pagesRoot, { recursive: true });
writeJson(path.join(pagesRoot, '_category_.json'), {
  label: 'Applications',
  position: 2,
  className: 'hidden',
  collapsible: false,
  // Keeps breadcrumb "Applications" clickable while staying out of the docs sidebar.
  link: { type: 'doc', id: 'applications/index' },
});

fs.writeFileSync(
  path.join(pagesRoot, 'index.mdx'),
  [
    '---',
    'title: Applications',
    'hide_title: true',
    'hide_table_of_contents: true',
    'catalog_filters: true',
    '---',
    '',
    "import AppCatalog from '@site/src/components/AppCatalog';",
    '',
    '<AppCatalog />',
    '',
  ].join('\n'),
);

let pageCount = 0;

for (const app of flatApps) {
  writeJson(path.join(pagesRoot, `${app.name}.json`), app);

  const mdx = [
    '---',
    `title: "${app.displayName}"`,
    `description: "${app.description.replace(/"/g, '\\"')}"`,
    `sidebar_label: "${app.displayName}"`,
    'unlisted: true',
    '---',
    '',
    "import AppDetailPage from '@site/src/components/AppDetailPage';",
    `import data from './${app.name}.json';`,
    '',
    '<AppDetailPage data={data} />',
    '',
  ].join('\n');

  fs.writeFileSync(path.join(pagesRoot, `${app.name}.mdx`), mdx);
  pageCount++;
}

console.log(`Generated ${pageCount} app page(s) under ${pagesRoot} (flat)`);
console.log(`Wrote ${iconCount} icon(s) under ${iconsRoot}`);
