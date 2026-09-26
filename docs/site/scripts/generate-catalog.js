#!/usr/bin/env node
// Crawls applications/ for each catalog source (git sibling or OCI unpack)
// listed/expanded from docs/source/config.yaml and generates:
//   - catalog-data.json (slim listing index for AppCatalog; icon = URL)
//   - source/applications/<app>.{mdx,json} (flat detail pages; icon = URL)
//   - site/static/catalog-icons/<app>.{svg,png,...} (decoded from metadata)
//
// Usage:
//   node generate-catalog.js [--root <sibling-root>] [-o output.json]
//
// Platform hybrid sources must be fetched first (`just fetch-catalog-sources`).

'use strict';

const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

const DOCS_ROOT = path.resolve(__dirname, '..', '..');
const {
  loadConfigYaml,
  applicationsFromConfig,
  catalogsFromConfig,
  nkpSupportForMinors,
  loadResolvedNkpReleases,
} = require(path.join(DOCS_ROOT, 'scripts', 'docs-config.cjs'));
const NKP_VERSION_JSON = path.join(
  __dirname,
  '..',
  'src',
  'data',
  'nkp-version-config.json',
);

function syncApplicationsConfig() {
  const out = applicationsFromConfig(loadConfigYaml());
  fs.mkdirSync(path.dirname(NKP_VERSION_JSON), {recursive: true});
  fs.writeFileSync(NKP_VERSION_JSON, `${JSON.stringify(out, null, 2)}\n`);
  console.log(
    `Synced applications NKP filter → ${path.relative(DOCS_ROOT, NKP_VERSION_JSON)} ` +
      `(floor ${out.nkpVersionFloor}, max GA ${out.maxGaNkpVersion}, known ${out.knownNkpVersions.join(',')})`,
  );
  return out;
}

syncApplicationsConfig();

const {
  parseNkpRange,
  cardRangeFromRanges,
  unionNkpRanges,
  DEFAULT_NKP_VERSIONS,
  toMinor,
  compareMinor,
  gaNkpVersions,
} = require('../src/components/nkpVersion');

const cfg = loadConfigYaml();
const {list: LOGICAL_CATALOGS} = catalogsFromConfig(cfg, {requireResolved: true});

const DEFAULT_ROOT = path.resolve(__dirname, '..', '..', '..', '..');
const IN_CI =
  process.env.CI === 'true' || process.env.GITHUB_ACTIONS === 'true';

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

function readVersionMeta(appPath, version) {
  const metaFile = path.join(appPath, version, 'metadata.yaml');
  if (!fs.existsSync(metaFile)) return null;
  try {
    const docs = yaml.loadAll(fs.readFileSync(metaFile, 'utf8')).filter(Boolean);
    return docs[0] || null;
  } catch (err) {
    console.warn(`  WARN: failed to parse ${metaFile}: ${err.message}`);
    return null;
  }
}

/**
 * @param {string} repoPath
 * @param {{ applicationsPath?: string, nkpVersions?: string[], catalogRepo?: string, ref?: string }} source
 */
function scanApps(repoPath, source = {}) {
  const appsDir = path.join(repoPath, source.applicationsPath || 'applications');
  if (!fs.existsSync(appsDir)) {
    console.warn(`  WARN: no applications/ directory at ${appsDir}`);
    return [];
  }

  const injectedSupport = nkpSupportForMinors(source.nkpVersions || []);
  const apps = [];
  const entries = fs.readdirSync(appsDir, {withFileTypes: true});

  for (const entry of entries) {
    if (!entry.isDirectory() || entry.name.startsWith('.')) continue;

    const appPath = path.join(appsDir, entry.name);
    const versions = fs
      .readdirSync(appPath, {withFileTypes: true})
      .filter((d) => d.isDirectory() && parseSemver(d.name))
      .map((d) => d.name)
      .sort(compareSemver);

    if (versions.length === 0) {
      console.warn(`  WARN: skipping ${entry.name}: no semver version directories`);
      continue;
    }

    const latest = versions[versions.length - 1];
    const meta = readVersionMeta(appPath, latest);
    if (!meta) {
      console.warn(
        `  WARN: skipping ${entry.name}: missing or invalid ${path.join(appPath, latest, 'metadata.yaml')}`,
      );
      continue;
    }

    let readme = '';
    const readmePath = path.join(appPath, 'README.md');
    if (fs.existsSync(readmePath)) {
      readme = fs.readFileSync(readmePath, 'utf8');
    }

    const versionNkp = versions.map((v) => {
      const m = v === latest ? meta : readVersionMeta(appPath, v);
      let raw = (m && m.nkpVersionSupport) || '';
      if (!raw && injectedSupport) raw = injectedSupport;
      return {
        version: v,
        nkpVersionSupport: raw,
        nkpRange: parseNkpRange(raw),
        catalogRepo: source.catalogRepo || '',
        ref: source.ref || '',
        applicationsPath: source.applicationsPath || 'applications',
        kind: source.kind || (source.catalogRepo ? 'git' : 'oci'),
      };
    });
    const nkpCardRange = cardRangeFromRanges(versionNkp.map((e) => e.nkpRange));
    const latestSupport =
      meta.nkpVersionSupport || injectedSupport || '';

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
      nkpVersionSupport: latestSupport,
      nkpRange: parseNkpRange(latestSupport),
      versionNkp,
      nkpCardRange,
      type: meta.type || 'custom',
      certifications: meta.certifications || [],
      readme,
      catalogRepo: source.catalogRepo || '',
    });
  }

  return apps.sort((a, b) => a.displayName.localeCompare(b.displayName));
}

/** Merge same chart version seen in multiple NKP sources (union NKP range). */
function mergeVersionNkpEntries(a, b) {
  const nkpRange = unionNkpRanges(a.nkpRange, b.nkpRange);
  const nkpVersionSupport = nkpRange.raw || a.nkpVersionSupport || b.nkpVersionSupport || '';
  const aGit = a.kind === 'git' && a.catalogRepo;
  const bGit = b.kind === 'git' && b.catalogRepo;
  const kind = aGit || bGit ? 'git' : (a.kind || b.kind || 'oci');
  const catalogRepo = aGit
    ? a.catalogRepo
    : bGit
      ? b.catalogRepo
      : '';
  const ref = aGit ? (a.ref || '') : bGit ? (b.ref || '') : '';
  return {
    version: a.version,
    nkpVersionSupport,
    nkpRange,
    catalogRepo,
    ref,
    applicationsPath: a.applicationsPath || b.applicationsPath || 'applications',
    kind,
  };
}

/** Merge apps that share a directory name across sources of one logical catalog. */
function mergeApps(appLists) {
  const byName = new Map();
  for (const apps of appLists) {
    for (const app of apps) {
      const prior = byName.get(app.name);
      if (!prior) {
        byName.set(app.name, {
          ...app,
          allVersions: [...app.allVersions],
          versionNkp: [...app.versionNkp],
        });
        continue;
      }
      const versionMap = new Map(prior.versionNkp.map((e) => [e.version, e]));
      for (const e of app.versionNkp) {
        const existing = versionMap.get(e.version);
        versionMap.set(
          e.version,
          existing ? mergeVersionNkpEntries(existing, e) : e,
        );
      }
      const allVersions = [...versionMap.keys()].sort(compareSemver);
      const latest = allVersions[allVersions.length - 1];
      const latestEntry = versionMap.get(latest);
      // Prefer display metadata from the source owning the newest semver.
      const metaSource = compareSemver(app.version, prior.version) >= 0 ? app : prior;
      byName.set(app.name, {
        ...metaSource,
        version: latest,
        allVersions,
        versionNkp: allVersions.map((v) => versionMap.get(v)),
        nkpCardRange: cardRangeFromRanges(
          allVersions.map((v) => versionMap.get(v).nkpRange),
        ),
        nkpVersionSupport: latestEntry.nkpVersionSupport,
        nkpRange: latestEntry.nkpRange,
        catalogRepo: latestEntry.catalogRepo || metaSource.catalogRepo || '',
      });
    }
  }
  return [...byName.values()].sort((a, b) =>
    a.displayName.localeCompare(b.displayName),
  );
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

  return {outputPath, root, repoOverrides};
}

function sourcePathFor(sourceId, root, repoOverrides) {
  if (repoOverrides[sourceId]) return repoOverrides[sourceId];
  return path.join(root, sourceId);
}

function loadNkpVersions(partnerRepoPath) {
  const resolved = loadResolvedNkpReleases();
  if (resolved && resolved.minors.length) {
    return gaNkpVersions(resolved.minors.map((m) => m.minor));
  }
  const specPath = path.join(partnerRepoPath, '.release', 'stable.yaml');
  if (!fs.existsSync(specPath)) return DEFAULT_NKP_VERSIONS.slice();
  try {
    const spec = yaml.load(fs.readFileSync(specPath, 'utf8'));
    const versions = (spec.releases || [])
      .map((r) => toMinor((r.constraints && r.constraints.nkpVersion) || r.tagName))
      .filter(Boolean);
    const unique = [...new Set(versions)].sort(compareMinor);
    return unique.length ? gaNkpVersions(unique) : DEFAULT_NKP_VERSIONS.slice();
  } catch (err) {
    console.warn(`  WARN: failed to read ${specPath}: ${err.message}`);
    return DEFAULT_NKP_VERSIONS.slice();
  }
}

function toListingApp(app) {
  const listingApp = {...app};
  delete listingApp.overview;
  delete listingApp.readme;
  delete listingApp.catalogAppNames;
  return listingApp;
}

function writeJson(filePath, value) {
  fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`);
}

function adaptSvgForLightBackground(svgText) {
  // Upstream icons (e.g. Ollama favicon) are white-on-transparent for dark UIs.
  // On our light catalog pages those become invisible — recolor pure-white SVGs.
  const attrFills = [...svgText.matchAll(/\bfill\s*=\s*["']([^"']+)["']/gi)].map(
    (m) => m[1].trim().toLowerCase(),
  );
  const styleFills = [...svgText.matchAll(/fill\s*:\s*([^;}]+)/gi)].map((m) =>
    m[1].trim().toLowerCase(),
  );
  const colors = [...attrFills, ...styleFills].filter(
    (c) => c && c !== 'none' && c !== 'transparent' && c !== 'currentcolor',
  );
  if (!colors.length) return svgText;
  const isWhite = (c) =>
    /^(#fff(?:fff)?|white|rgb\(\s*255\s*,\s*255\s*,\s*255\s*\))$/i.test(c);
  if (!colors.every(isWhite)) return svgText;
  return svgText
    .replace(/\bfill\s*=\s*["'](?:white|#fff(?:fff)?)["']/gi, 'fill="#111111"')
    .replace(
      /fill\s*:\s*(?:white|#fff(?:fff)?|rgb\(\s*255\s*,\s*255\s*,\s*255\s*\))/gi,
      'fill:#111111',
    );
}

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
  else if (buf.length >= 12 && buf.slice(8, 12).toString('ascii') === 'WEBP') {
    ext = 'webp';
  }

  const fileName = `${appName}.${ext}`;
  let out = buf;
  if (ext === 'svg') {
    let text = buf
      .toString('utf8')
      .replace(/[ \t]+$/gm, '')
      .replace(/\s*$/, '\n');
    text = adaptSvgForLightBackground(text);
    out = Buffer.from(text, 'utf8');
  }
  fs.writeFileSync(path.join(iconsRoot, fileName), out);
  return `/catalog-icons/${fileName}`;
}

const {outputPath, root, repoOverrides} = parseArgs(process.argv.slice(2));

const catalogs = [];
const missingRequired = [];

for (const logical of LOGICAL_CATALOGS) {
  const perSourceApps = [];
  for (const source of logical.sources) {
    const repoPath = sourcePathFor(source.id, root, repoOverrides);
    if (!fs.existsSync(repoPath)) {
      const msg = `${source.id} missing at ${repoPath}`;
      if (IN_CI || source.kind === 'oci') {
        missingRequired.push(msg);
      } else {
        console.warn(`Skipping ${msg}`);
      }
      continue;
    }
    console.log(
      `Scanning ${logical.name} / ${source.id} (${source.kind}) at ${repoPath} ...`,
    );
    const apps = scanApps(repoPath, source);
    console.log(`  Found ${apps.length} application(s)`);
    perSourceApps.push(apps);
  }

  if (!perSourceApps.length) {
    console.warn(`Skipping logical catalog ${logical.id}: no sources available`);
    continue;
  }

  const merged = mergeApps(perSourceApps);
  const apps = merged.filter((app) => {
    if (app.type === 'internal') return false;
    if (/deprecated/i.test(String(app.displayName || ''))) return false;
    return true;
  });
  const skipped = merged.length - apps.length;
  if (skipped) {
    console.log(`  Published ${apps.length} (skipped ${skipped} internal/deprecated)`);
  }
  catalogs.push({
    id: logical.id,
    name: logical.name,
    slug: logical.slug,
    repo: logical.repo,
    appCount: apps.length,
    apps,
  });
}

if (missingRequired.length) {
  console.error(`Missing required catalog sources:\n  - ${missingRequired.join('\n  - ')}`);
  process.exit(1);
}

if (catalogs.length === 0) {
  console.error(
    `No catalog repositories found under ${root}. Run just fetch-catalog-sources / clone siblings.`,
  );
  process.exit(1);
}

const versionsSource = LOGICAL_CATALOGS.find((c) => c.nkpVersionsSource);
const nkpVersions = loadNkpVersions(
  sourcePathFor(
    versionsSource ? versionsSource.id : catalogs[0].id,
    root,
    repoOverrides,
  ),
);

const iconsRoot = path.resolve(__dirname, '..', 'static', 'catalog-icons');
if (fs.existsSync(iconsRoot)) {
  fs.rmSync(iconsRoot, {recursive: true});
}
fs.mkdirSync(iconsRoot, {recursive: true});

const seenNames = new Map();
const flatApps = [];
let iconCount = 0;
const listingCatalogs = catalogs.map((catalog) => {
  const apps = catalog.apps.map((app) => {
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
      catalogRepo: app.catalogRepo || catalog.repo,
    };
    flatApps.push(fullApp);
    return toListingApp(fullApp);
  });

  return {...catalog, apps};
});

flatApps.sort((a, b) => a.displayName.localeCompare(b.displayName));

const data = {
  totalApps: catalogs.reduce((s, c) => s + c.appCount, 0),
  nkpVersions,
  catalogs: listingCatalogs,
};

fs.mkdirSync(path.dirname(outputPath), {recursive: true});
writeJson(outputPath, data);
console.log(
  `\nWrote ${outputPath} — ${data.totalApps} app(s) across ${catalogs.length} catalog(s)`,
);

const pagesRoot = path.resolve(path.dirname(outputPath), 'applications');

if (fs.existsSync(pagesRoot)) {
  fs.rmSync(pagesRoot, {recursive: true});
}

fs.mkdirSync(pagesRoot, {recursive: true});
writeJson(path.join(pagesRoot, '_category_.json'), {
  label: 'Applications',
  position: 2,
  className: 'hidden',
  collapsible: false,
  link: {type: 'doc', id: 'applications/index'},
});

fs.writeFileSync(
  path.join(pagesRoot, 'index.mdx'),
  [
    '---',
    'title: Applications',
    'hide_title: true',
    'hide_table_of_contents: true',
    '---',
    '',
    "import AppCatalog from '@site/src/components/AppCatalog';",
    '',
    '<AppCatalog />',
    '',
  ].join('\n'),
);

let pageCount = 0;
const catalogAppNames = flatApps.map((a) => a.name).sort();
for (const app of flatApps) {
  app.catalogAppNames = catalogAppNames;
}

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
