#!/usr/bin/env node
/**
 * Resolve NKP release tags from the lower of cliDocs / applications floors.
 *
 * Probes downloads.d2iq.com (same GA-over-dev logic as the old CLI updater).
 * Writes gitignored docs/.cache/nkp-releases.json — never commits patch pins.
 *
 * Stops after STOP_AFTER_MISS consecutive minors with no publishable tag.
 *
 * Usage:
 *   node docs/scripts/resolve-nkp-releases.mjs
 *   node docs/scripts/resolve-nkp-releases.mjs --dry-run
 *   node docs/scripts/resolve-nkp-releases.mjs --strict   (default in CI)
 *
 * Env: NKP_CLI_OS / NKP_CLI_ARCH / NKP_CLI_URL
 */
import {execFileSync} from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import {createRequire} from 'node:module';
import {fileURLToPath} from 'node:url';

const require = createRequire(import.meta.url);
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DOCS_ROOT = path.resolve(__dirname, '..');
const {
  loadConfigYaml,
  applicationsFromConfig,
  NKP_RELEASES_CACHE,
  nextMinor,
  compareMinor,
} = require('./docs-config.cjs');

const MAX_PATCH_SCAN = 30;
const STOP_AFTER_MISS = 2;

function parseArgs(argv) {
  const out = {dryRun: false, strict: false};
  // CI defaults to strict so missing floor fails the job.
  if (process.env.CI === 'true' || process.env.GITHUB_ACTIONS === 'true') {
    out.strict = true;
  }
  for (const a of argv) {
    if (a === '--dry-run') out.dryRun = true;
    else if (a === '--strict') out.strict = true;
    else if (a === '--best-effort') out.strict = false;
    else if (a === '--help' || a === '-h') {
      console.log(`Usage: node resolve-nkp-releases.mjs [--dry-run] [--strict|--best-effort]

  Probe downloads.d2iq.com from the lower of cliDocs.nkpVersionFloor /
  applications.nkpVersionFloor upward and write
  ${path.relative(DOCS_ROOT, NKP_RELEASES_CACHE)}.
`);
      process.exit(0);
    } else {
      console.error(`Unknown argument: ${a}`);
      process.exit(1);
    }
  }
  return out;
}

function detectOs() {
  const env = (process.env.NKP_CLI_OS || '').trim();
  if (env) return env;
  return process.platform === 'darwin' ? 'darwin' : 'linux';
}

function detectArch() {
  return (process.env.NKP_CLI_ARCH || 'amd64').trim() || 'amd64';
}

function downloadUrl(tag, osName, arch, template) {
  const urlTemplate = (process.env.NKP_CLI_URL || template).trim();
  return urlTemplate
    .replaceAll('{version}', tag)
    .replaceAll('{os}', osName)
    .replaceAll('{arch}', arch);
}

function tagExists(tag, osName, arch, template) {
  const url = downloadUrl(tag, osName, arch, template);
  try {
    const out = execFileSync(
      'curl',
      ['-sI', '-o', '/dev/null', '-w', '%{http_code}', '--max-time', '20', url],
      {encoding: 'utf8'},
    ).trim();
    return out === '200';
  } catch {
    return false;
  }
}

function parseTag(tag) {
  const m = String(tag || '').match(/^(\d+)\.(\d+)\.(\d+)(?:-(.+))?$/);
  if (!m) return null;
  return {
    major: Number(m[1]),
    minor: Number(m[2]),
    patch: Number(m[3]),
    pre: m[4] || '',
    raw: tag,
  };
}

function compareTags(a, b) {
  const pa = parseTag(a);
  const pb = parseTag(b);
  if (!pa && !pb) return 0;
  if (!pa) return -1;
  if (!pb) return 1;
  if (pa.patch !== pb.patch) return pa.patch - pb.patch;
  if (!pa.pre && pb.pre) return 1;
  if (pa.pre && !pb.pre) return -1;
  return String(pa.pre).localeCompare(String(pb.pre));
}

/** Best tag for MAJOR.MINOR; empty string if none. */
function discoverLatest(minor, osName, arch, template) {
  const parts = String(minor).split('.');
  if (parts.length !== 2) {
    throw new Error(`expected MAJOR.MINOR, got ${minor}`);
  }
  const [maj, min] = parts;
  const ga = [];
  const pre = [];
  let misses = 0;
  for (let patch = 0; patch <= MAX_PATCH_SCAN; patch++) {
    const tag = `${maj}.${min}.${patch}`;
    let hit = false;
    if (tagExists(tag, osName, arch, template)) {
      ga.push(tag);
      hit = true;
    } else if (!ga.length) {
      const dev = `${tag}-dev`;
      if (tagExists(dev, osName, arch, template)) {
        pre.push(dev);
        hit = true;
      }
    }
    if (!hit) {
      misses += 1;
      if (misses >= 3) break;
    } else {
      misses = 0;
    }
  }
  const pool = ga.length ? ga : pre;
  if (!pool.length) return '';
  pool.sort(compareTags);
  return pool[pool.length - 1];
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  try {
    run(args);
  } catch (err) {
    const msg = err && err.message ? err.message : String(err);
    if (args.strict) {
      console.error(`resolve-nkp-releases failed: ${msg}`);
      process.exit(1);
    }
    if (fs.existsSync(NKP_RELEASES_CACHE)) {
      console.warn(
        `WARN: resolve-nkp-releases failed (${msg}); keeping existing cache`,
      );
      process.exit(0);
    }
    console.error(
      `resolve-nkp-releases failed (${msg}) and no cache at ${path.relative(DOCS_ROOT, NKP_RELEASES_CACHE)}`,
    );
    process.exit(1);
  }
}

function run(args) {
  const cfg = loadConfigYaml();
  const apps = applicationsFromConfig(cfg);
  const catalogFloor = apps.nkpVersionFloor;
  const cliFloor = String(
    (cfg.cliDocs && cfg.cliDocs.nkpVersionFloor) || catalogFloor,
  );
  // Probe from the older floor so CLI can cover history; Platform filters later.
  const floor =
    compareMinor(cliFloor, catalogFloor) <= 0 ? cliFloor : catalogFloor;
  const maxGa = apps.maxGaNkpVersion;
  const downloadTemplate = String(
    (cfg.cliDocs && cfg.cliDocs.downloadUrl) || '',
  ).trim();
  if (!downloadTemplate) {
    throw new Error('config.yaml cliDocs.downloadUrl is required for probing');
  }

  const osName = detectOs();
  const arch = detectArch();
  console.log(
    `Resolving NKP releases from floor ${floor} (cli ${cliFloor}, catalog ${catalogFloor}; ${osName}/${arch}); stop after ${STOP_AFTER_MISS} miss(es)…`,
  );

  const minors = [];
  let consecutiveMiss = 0;
  let minor = floor;
  // Safety cap so a probe bug cannot loop forever.
  for (let i = 0; i < 40; i++) {
    process.stdout.write(`  ${minor} … `);
    const latest = discoverLatest(minor, osName, arch, downloadTemplate);
    if (!latest) {
      console.log('none');
      consecutiveMiss += 1;
      if (consecutiveMiss >= STOP_AFTER_MISS) break;
      minor = nextMinor(minor);
      continue;
    }
    consecutiveMiss = 0;
    console.log(latest);
    minors.push({minor, latest});
    minor = nextMinor(minor);
  }

  if (!minors.length) {
    throw new Error(`no NKP tags found at or above floor ${floor}`);
  }
  if (minors[0].minor !== floor) {
    throw new Error(
      `floor ${floor} has no publishable tag (first hit was ${minors[0].minor})`,
    );
  }

  const payload = {
    floor,
    cliFloor,
    catalogFloor,
    maxGa,
    minors,
    generatedAt: new Date().toISOString(),
  };

  if (args.dryRun) {
    console.log('[dry-run] would write', payload);
    return;
  }

  fs.mkdirSync(path.dirname(NKP_RELEASES_CACHE), {recursive: true});
  fs.writeFileSync(NKP_RELEASES_CACHE, `${JSON.stringify(payload, null, 2)}\n`);
  console.log(
    `Wrote ${path.relative(DOCS_ROOT, NKP_RELEASES_CACHE)} — ${minors.length} minor(s): ${minors
      .map((m) => `${m.minor}@${m.latest}`)
      .join(', ')}`,
  );
}

main();
