#!/usr/bin/env node
/**
 * Fetch catalog crawl sources under --root (git clones + OCI pulls).
 *
 * Platform hybrid sources expand from .cache/nkp-releases.json:
 *   git  mesosphere/kommander-applications @ v{latest}  (minor < ociFromMinor)
 *   oci  ghcr.io/mesosphere/kommander-applications-full:{tag}  (minor >= ociFromMinor)
 *
 * Legacy catalogs (partner / ai / nutanix) are expected as existing sibling
 * checkouts (CI checks them out separately); this script skips git sources
 * whose directory already exists unless --force.
 *
 * Usage:
 *   node docs/scripts/fetch-catalog-sources.mjs [--root DIR] [--force]
 *
 * Requires: git, oras (for OCI sources). CI=true fails if a required source is missing.
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
  allCatalogSources,
} = require('./docs-config.cjs');

const IN_CI =
  process.env.CI === 'true' || process.env.GITHUB_ACTIONS === 'true';

function parseArgs(argv) {
  const out = {
    root: path.resolve(DOCS_ROOT, '..', '..'),
    force: false,
  };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--root') out.root = path.resolve(argv[++i]);
    else if (a === '--force') out.force = true;
    else if (a === '--help' || a === '-h') {
      console.log(
        'Usage: node fetch-catalog-sources.mjs [--root DIR] [--force]',
      );
      process.exit(0);
    } else {
      console.error(`Unknown argument: ${a}`);
      process.exit(1);
    }
  }
  return out;
}

function which(cmd) {
  try {
    return execFileSync('which', [cmd], {encoding: 'utf8'}).trim();
  } catch {
    return '';
  }
}

/** Prefer PATH oras; else download a release binary under docs/.cache/bin. */
function ensureOras() {
  const existing = which('oras');
  if (existing) return existing;
  const cacheBin = path.join(DOCS_ROOT, '.cache', 'bin');
  const local = path.join(cacheBin, 'oras');
  if (fs.existsSync(local)) return local;

  const ver = '1.2.3';
  let arch = process.arch === 'arm64' ? 'arm64' : 'amd64';
  let osName = process.platform === 'darwin' ? 'darwin' : 'linux';
  const url = `https://github.com/oras-project/oras/releases/download/v${ver}/oras_${ver}_${osName}_${arch}.tar.gz`;
  console.log(`  downloading oras ${ver} → ${local}`);
  fs.mkdirSync(cacheBin, {recursive: true});
  const tarPath = path.join(cacheBin, `oras-${ver}.tgz`);
  execFileSync('curl', ['-sSL', '-o', tarPath, url], {stdio: 'inherit'});
  execFileSync('tar', ['xzf', tarPath, '-C', cacheBin, 'oras'], {stdio: 'inherit'});
  fs.chmodSync(local, 0o755);
  try {
    fs.unlinkSync(tarPath);
  } catch {
    /* ignore */
  }
  return local;
}

function run(cmd, args, opts = {}) {
  execFileSync(cmd, args, {stdio: 'inherit', ...opts});
}

function fetchGit(src, dest, force) {
  if (fs.existsSync(dest) && !force) {
    console.log(`  skip git ${src.id} (exists; use --force to refresh)`);
    return;
  }
  if (fs.existsSync(dest) && force) {
    fs.rmSync(dest, {recursive: true, force: true});
  }
  const args = ['clone', '--depth', '1'];
  if (src.ref) {
    args.push('--branch', src.ref);
  }
  args.push(src.repo, dest);
  console.log(`  git clone ${src.repo} ${src.ref ? `@ ${src.ref}` : ''} → ${src.id}`);
  run('git', args);
}

function fetchOci(src, dest, force) {
  const oras = ensureOras();
  if (fs.existsSync(dest) && !force) {
    // Still refresh OCI in CI so nightly picks up new tags.
    if (!IN_CI) {
      console.log(`  skip oci ${src.id} (exists; use --force to refresh)`);
      return;
    }
  }
  if (fs.existsSync(dest)) {
    fs.rmSync(dest, {recursive: true, force: true});
  }
  fs.mkdirSync(dest, {recursive: true});
  const ref = `${src.oci}:${src.tag}`;
  console.log(`  oras pull ${ref} → ${src.id}`);
  run(oras, ['pull', ref, '-o', dest]);
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const cfg = loadConfigYaml();
  let sources;
  try {
    sources = allCatalogSources(cfg, {requireResolved: true});
  } catch (err) {
    console.error(err.message || err);
    process.exit(1);
  }

  console.log(`Fetching ${sources.length} catalog source(s) under ${args.root}`);
  const missing = [];

  for (const src of sources) {
    const dest = path.join(args.root, src.id);
    try {
      if (src.kind === 'git') {
        // Partner catalog is this docs repo checkout — do not re-clone over it.
        if (src.id === 'nkp-partner-catalog' && fs.existsSync(dest)) {
          console.log(`  skip git ${src.id} (docs checkout)`);
          continue;
        }
        fetchGit(src, dest, args.force);
      } else if (src.kind === 'oci') {
        fetchOci(src, dest, args.force);
      } else {
        throw new Error(`unknown kind ${src.kind}`);
      }
      if (!fs.existsSync(path.join(dest, src.applicationsPath || 'applications'))) {
        missing.push(`${src.id}: missing ${src.applicationsPath || 'applications'}/`);
      }
    } catch (err) {
      const msg = err && err.message ? err.message : String(err);
      console.error(`  ERROR ${src.id}: ${msg}`);
      missing.push(`${src.id}: ${msg}`);
    }
  }

  if (missing.length) {
    console.error(`Fetch incomplete:\n  - ${missing.join('\n  - ')}`);
    if (IN_CI) process.exit(1);
    process.exit(1);
  }
  console.log('Catalog sources ready.');
}

main();
