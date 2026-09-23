#!/usr/bin/env node
/**
 * Refresh docs/source/config.yaml before catalog/CLI generation (best-effort).
 *
 * For each cliDocs.minor, probe downloads.d2iq.com for a newer publishable
 * tag and rewrite `latest:` in place (preserves comments and other keys).
 *
 * Prefer a numeric GA patch (2.19.0) over any -dev tag when a GA exists for
 * that minor. Use -dev only when no GA tag is published yet.
 * Does not add/remove minors, and does not bump maxGaNkpVersion / defaultMinor
 * (those stay human-edited so pre-GA like 2.20 can stay hidden).
 *
 * Probe / write failures are logged and skipped by default (exit 0) so CI can
 * still generate docs from the committed config. Pass --strict to fail hard.
 *
 * Usage:
 *   node docs/scripts/update-docs-config.mjs
 *   node docs/scripts/update-docs-config.mjs --dry-run
 *   node docs/scripts/update-docs-config.mjs --strict
 *
 * Env:
 *   NKP_CLI_OS / NKP_CLI_ARCH / NKP_CLI_URL  (same as generate-cli-docs)
 */
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DOCS_ROOT = path.resolve(__dirname, '..');
const CONFIG_FILE = path.join(DOCS_ROOT, 'source', 'config.yaml');
const DEFAULT_URL =
  'https://downloads.d2iq.com/dkp/v{version}/nkp_v{version}_{os}_{arch}.tar.gz';
const MAX_PATCH_SCAN = 30;

function loadYaml() {
  try {
    return require(path.join(DOCS_ROOT, 'site', 'node_modules', 'js-yaml'));
  } catch {
    throw new Error(
      'Missing js-yaml. From docs/: just update-docs-config (installs site deps) or cd site && npm ci',
    );
  }
}

function parseArgs(argv) {
  const out = { dryRun: false, strict: false };
  for (const a of argv) {
    if (a === '--dry-run') out.dryRun = true;
    else if (a === '--strict') out.strict = true;
    else if (a === '--help' || a === '-h') {
      console.log(`Usage: node update-docs-config.mjs [--dry-run] [--strict]

  Probe downloads.d2iq.com and refresh cliDocs.minors[].latest in
  docs/source/config.yaml (comments preserved). Best-effort by default
  (warnings + exit 0 on probe failures). --strict fails the process instead.
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

function downloadUrl(tag, osName, arch) {
  const template = (process.env.NKP_CLI_URL || DEFAULT_URL).trim();
  return template
    .replaceAll('{version}', tag)
    .replaceAll('{os}', osName)
    .replaceAll('{arch}', arch);
}

/** True when the tarball URL responds with HTTP 200. */
function tagExists(tag, osName, arch) {
  const url = downloadUrl(tag, osName, arch);
  try {
    const out = execFileSync(
      'curl',
      ['-sI', '-o', '/dev/null', '-w', '%{http_code}', '--max-time', '20', url],
      { encoding: 'utf8' },
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

/** Prefer higher patch; for the same patch prefer no prerelease over -dev. */
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

/**
 * Discover the best available tag for MAJOR.MINOR on downloads.d2iq.com.
 * Scans upward from the configured patch; prefers GA over -dev.
 */
function discoverLatest(minor, currentLatest, osName, arch) {
  const parts = String(minor).split('.');
  if (parts.length !== 2) {
    throw new Error(`expected MAJOR.MINOR, got ${minor}`);
  }
  const [maj, min] = parts;
  const cur = parseTag(currentLatest);
  const startPatch =
    cur && String(cur.major) === maj && String(cur.minor) === min ? cur.patch : 0;

  const ga = [];
  const pre = [];

  // Confirm the configured tag still exists.
  if (currentLatest && tagExists(currentLatest, osName, arch)) {
    if (cur?.pre) pre.push(currentLatest);
    else ga.push(currentLatest);
  }

  // Scan upward for newer GA patches. Only probe -dev when this minor has no GA yet
  // (pre-GA line such as 2.19.0-dev).
  let misses = 0;
  for (let patch = startPatch; patch <= MAX_PATCH_SCAN; patch++) {
    const tag = `${maj}.${min}.${patch}`;
    let hit = false;
    if (tagExists(tag, osName, arch)) {
      ga.push(tag);
      hit = true;
    } else if (!ga.length) {
      const dev = `${tag}-dev`;
      if (tagExists(dev, osName, arch)) {
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
  if (!pool.length) return currentLatest;
  pool.sort(compareTags);
  return pool[pool.length - 1];
}

function setMinorLatest(yamlText, minor, newLatest) {
  const escaped = minor.replace(/\./g, '\\.');
  const re = new RegExp(
    `(-\\s*minor:\\s*"${escaped}"\\s*\\n\\s*latest:\\s*")[^"]*(")`,
  );
  if (!re.test(yamlText)) {
    throw new Error(`could not find cliDocs entry for minor ${minor} in config.yaml`);
  }
  return yamlText.replace(re, `$1${newLatest}$2`);
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  try {
    run(args);
  } catch (err) {
    const msg = err && err.message ? err.message : String(err);
    if (args.strict) {
      console.error(`update-docs-config failed: ${msg}`);
      process.exit(1);
    }
    console.warn(`WARN: update-docs-config skipped (${msg}); keeping committed config.yaml`);
    process.exit(0);
  }
}

function run(args) {
  if (!fs.existsSync(CONFIG_FILE)) {
    throw new Error(`Missing ${path.relative(DOCS_ROOT, CONFIG_FILE)}`);
  }

  const yaml = loadYaml();
  const text = fs.readFileSync(CONFIG_FILE, 'utf8');
  const root = yaml.load(text) || {};
  const minors = root.cliDocs && root.cliDocs.minors;
  if (!Array.isArray(minors) || minors.length === 0) {
    throw new Error('config.yaml cliDocs.minors is empty');
  }

  const osName = detectOs();
  const arch = detectArch();
  console.log(`Probing ${osName}/${arch} for ${minors.length} CLI minor(s)…`);

  let next = text;
  const changes = [];
  const skipped = [];
  for (const entry of minors) {
    const minor = String(entry.minor);
    const current = String(entry.latest);
    process.stdout.write(`  ${minor} (was ${current}) … `);
    let discovered;
    try {
      discovered = discoverLatest(minor, current, osName, arch);
    } catch (err) {
      const msg = err && err.message ? err.message : String(err);
      console.log(`skipped (${msg})`);
      skipped.push({ minor, reason: msg });
      continue;
    }
    if (discovered === current) {
      console.log('unchanged');
      continue;
    }
    console.log(`→ ${discovered}`);
    next = setMinorLatest(next, minor, discovered);
    changes.push({ minor, from: current, to: discovered });
  }

  if (skipped.length) {
    console.warn(
      `WARN: skipped ${skipped.length} minor(s): ${skipped
        .map((s) => `${s.minor} (${s.reason})`)
        .join('; ')}`,
    );
    if (args.strict) {
      throw new Error(`probe failed for ${skipped.length} minor(s)`);
    }
  }

  if (!changes.length) {
    console.log('config.yaml already up to date');
    return;
  }

  if (args.dryRun) {
    console.log(`[dry-run] would update ${changes.length} latest tag(s); not writing`);
    return;
  }

  fs.writeFileSync(CONFIG_FILE, next);
  console.log(
    `Updated ${path.relative(DOCS_ROOT, CONFIG_FILE)}: ${changes
      .map((c) => `${c.minor} ${c.from}→${c.to}`)
      .join(', ')}`,
  );
}

main();
