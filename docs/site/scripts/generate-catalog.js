#!/usr/bin/env node
// Crawls catalog repositories and generates catalog-data.json for the AppCatalog component.
//
// Usage:
//   node generate-catalog.js <id>=</path/to/repo> [<id>=</path/to/repo> ...] [-o output.json]
//
// Example:
//   node generate-catalog.js \
//     nkp-ai-applications-catalog=../../nkp-ai-applications-catalog \
//     nkp-partner-catalog=../.. \
//     nkp-nutanix-product-catalog=../../nkp-nutanix-product-catalog

'use strict';

const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

const KNOWN_REPOS = {
  'nkp-ai-applications-catalog': {
    name: 'AI Applications',
    slug: 'ai',
    repo: 'https://github.com/nutanix-cloud-native/nkp-ai-applications-catalog',
    color: '#7855FA',
  },
  'nkp-partner-catalog': {
    name: 'Partner Catalog',
    slug: 'partner',
    repo: 'https://github.com/nutanix-cloud-native/nkp-partner-catalog',
    color: '#024DA1',
  },
  'nkp-nutanix-product-catalog': {
    name: 'Nutanix Products',
    slug: 'nutanix',
    repo: 'https://github.com/nutanix-cloud-native/nkp-nutanix-product-catalog',
    color: '#22A06B',
  },
  'kommander-applications': {
    name: 'Platform',
    slug: 'platform',
    repo: '',
    color: '#E56910',
    whitelist: ['nvidia-gpu-operator', 'nvidia-network-operator'],
  },
};

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

function scanApps(repoPath, whitelist) {
  const appsDir = path.join(repoPath, 'applications');
  if (!fs.existsSync(appsDir)) return [];

  const apps = [];
  const entries = fs.readdirSync(appsDir, { withFileTypes: true });

  for (const entry of entries) {
    if (!entry.isDirectory() || entry.name.startsWith('.')) continue;
    if (whitelist && !whitelist.includes(entry.name)) continue;

    const appPath = path.join(appsDir, entry.name);
    const versions = fs.readdirSync(appPath, { withFileTypes: true })
      .filter(d => d.isDirectory() && parseSemver(d.name))
      .map(d => d.name)
      .sort(compareSemver);

    if (versions.length === 0) continue;

    const latest = versions[versions.length - 1];
    const metaFile = path.join(appPath, latest, 'metadata.yaml');
    if (!fs.existsSync(metaFile)) continue;

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
      type: meta.type || 'custom',
      certifications: meta.certifications || [],
      readme,
    });
  }

  return apps.sort((a, b) => a.displayName.localeCompare(b.displayName));
}

// --- CLI ---

const args = process.argv.slice(2);
let outputPath = path.resolve(__dirname, '..', '..', 'source', 'catalog-data.json');
const repoPaths = {};

for (let i = 0; i < args.length; i++) {
  if (args[i] === '-o' || args[i] === '--output') {
    outputPath = path.resolve(args[++i]);
  } else if (args[i].includes('=')) {
    const eq = args[i].indexOf('=');
    repoPaths[args[i].slice(0, eq)] = path.resolve(args[i].slice(eq + 1));
  }
}

if (Object.keys(repoPaths).length === 0) {
  console.error('No repos specified. Usage: generate-catalog.js <id>=</path> ...');
  process.exit(1);
}

const catalogs = [];

for (const [id, repoPath] of Object.entries(repoPaths)) {
  if (!fs.existsSync(repoPath)) {
    console.warn(`Skipping ${id}: ${repoPath} does not exist`);
    continue;
  }
  const info = KNOWN_REPOS[id] || { name: id, slug: id, repo: '', color: '#6B778C' };
  console.log(`Scanning ${info.name} (${id}) at ${repoPath} ...`);

  const apps = scanApps(repoPath, info.whitelist);
  console.log(`  Found ${apps.length} application(s)`);

  catalogs.push({
    id,
    name: info.name,
    slug: info.slug,
    repo: info.repo,
    color: info.color,
    appCount: apps.length,
    apps,
  });
}

const data = {
  generatedAt: new Date().toISOString(),
  totalApps: catalogs.reduce((s, c) => s + c.appCount, 0),
  catalogs,
};

fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, JSON.stringify(data, null, 2));
console.log(`\nWrote ${outputPath} — ${data.totalApps} app(s) across ${catalogs.length} catalog(s)`);

// ---------------------------------------------------------------------------
// Generate per-app MDX pages under source/applications/<slug>/
// ---------------------------------------------------------------------------

const pagesRoot = path.resolve(path.dirname(outputPath), 'applications');

// Clean previous generated app pages
if (fs.existsSync(pagesRoot)) {
  fs.rmSync(pagesRoot, { recursive: true });
}

fs.mkdirSync(pagesRoot, { recursive: true });
fs.writeFileSync(
  path.join(pagesRoot, '_category_.json'),
  JSON.stringify({ label: 'Applications', position: 2, className: 'hidden' }, null, 2) + '\n',
);

// Landing page for /docs/applications
fs.writeFileSync(
  path.join(pagesRoot, 'index.mdx'),
  [
    '---',
    'title: App Catalog',
    'unlisted: true',
    '---',
    '',
    "import AppCatalog from '@site/src/components/AppCatalog';",
    '',
    '# NKP App Catalog',
    '',
    'Browse all applications across NKP catalogs. Click any card for details, overview, and README.',
    '',
    '<AppCatalog />',
    '',
  ].join('\n'),
);

let pageCount = 0;

for (const catalog of catalogs) {
  const catDir = path.join(pagesRoot, catalog.slug);
  fs.mkdirSync(catDir, { recursive: true });

  fs.writeFileSync(
    path.join(catDir, '_category_.json'),
    JSON.stringify({ label: catalog.name, position: catalogs.indexOf(catalog) + 1 }, null, 2) + '\n',
  );

  for (const app of catalog.apps) {
    const appData = {
      ...app,
      catalogName: catalog.name,
      catalogSlug: catalog.slug,
      catalogColor: catalog.color,
      catalogRepo: catalog.repo,
    };

    // Write data as a sibling JSON file; MDX imports it to avoid acorn parse issues.
    fs.writeFileSync(
      path.join(catDir, `${app.name}.json`),
      JSON.stringify(appData, null, 2),
    );

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

    fs.writeFileSync(path.join(catDir, `${app.name}.mdx`), mdx);
    pageCount++;
  }
}

console.log(`Generated ${pageCount} app page(s) under ${pagesRoot}`);
