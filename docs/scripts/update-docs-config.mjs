#!/usr/bin/env node
/**
 * Compatibility wrapper — tag discovery moved to resolve-nkp-releases.mjs.
 * Prefer: just resolve-nkp-releases
 */
import {spawnSync} from 'node:child_process';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const target = path.join(__dirname, 'resolve-nkp-releases.mjs');
const args = process.argv.slice(2).filter((a) => a !== '--write-config');
const r = spawnSync(process.execPath, [target, ...args], {stdio: 'inherit'});
process.exit(r.status == null ? 1 : r.status);
