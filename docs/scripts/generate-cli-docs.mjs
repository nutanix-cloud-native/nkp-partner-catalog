#!/usr/bin/env node
/**
 * Download released nkp CLIs and build versioned Docusaurus pages under
 * docs/source/cli/<minor>/ (MAJOR.MINOR path; content from latest patch tag).
 *
 * Published tarball (note the `v` prefix on both the directory and filename):
 *   https://downloads.d2iq.com/dkp/v<tag>/nkp_v<tag>_<linux|darwin>_amd64.tar.gz
 *
 * Then:
 *   nkp help --output markdown --tree --output-dir <raw-dir>
 *
 * Usage:
 *   node docs/scripts/generate-cli-docs.mjs
 *   node docs/scripts/generate-cli-docs.mjs --from-dir /tmp/help-md --minor 2.18 --patch 2.18.0
 *
 * Env:
 *   NKP_CLI_OS / NKP_CLI_ARCH / NKP_CLI_URL / NKP_CLI
 */
import { execFileSync, spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DOCS_ROOT = path.resolve(__dirname, '..');
const SOURCE_CLI = path.join(DOCS_ROOT, 'source', 'cli');
const DEFAULT_CACHE = path.join(DOCS_ROOT, '.cache', 'nkp-cli');
const {
  loadConfigYaml,
  cliVersionsFromConfig,
} = require('./docs-config.cjs');

/** @type {string} filled when config is loaded */
let cliDownloadUrlTemplate = '';

function parseArgs(argv) {
  const out = {
    fromDir: '',
    minor: '',
    patch: '',
    cacheDir: DEFAULT_CACHE,
    forceDownload: false,
    binary: process.env.NKP_CLI || '',
  };
  if (
    typeof process !== 'undefined' &&
    process.env &&
    (process.env.NKP_CLI_FORCE_DOWNLOAD === '1' ||
      process.env.NKP_CLI_FORCE_DOWNLOAD === 'true')
  ) {
    out.forceDownload = true;
  }
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--from-dir') out.fromDir = path.resolve(argv[++i]);
    else if (a === '--minor') out.minor = String(argv[++i] || '').trim();
    else if (a === '--patch' || a === '--version') out.patch = String(argv[++i] || '').trim();
    else if (a === '--cache-dir') out.cacheDir = path.resolve(argv[++i]);
    else if (a === '--force-download') out.forceDownload = true;
    else if (a === '--binary') out.binary = path.resolve(argv[++i]);
    else if (a === '--help' || a === '-h') {
      console.log(`Usage: node generate-cli-docs.mjs [options]

  (default) read docs/source/config.yaml → cliDocs and generate all minors
  --from-dir DIR --minor 2.18 --patch 2.18.0
  --binary PATH --minor 2.18 --patch 2.18.0
  --cache-dir DIR
  --force-download
`);
      process.exit(0);
    } else {
      console.error(`Unknown argument: ${a}`);
      process.exit(1);
    }
  }
  return out;
}

function readVersionsConfig() {
  const data = cliVersionsFromConfig(loadConfigYaml());
  cliDownloadUrlTemplate = data.downloadUrl;
  return data;
}

function compareMinor(a, b) {
  const pa = String(a).split('.').map((n) => parseInt(n, 10) || 0);
  const pb = String(b).split('.').map((n) => parseInt(n, 10) || 0);
  for (let i = 0; i < 2; i++) {
    if ((pa[i] || 0) !== (pb[i] || 0)) return (pa[i] || 0) - (pb[i] || 0);
  }
  return 0;
}

function detectOs() {
  const override = (process.env.NKP_CLI_OS || '').trim();
  if (override) return override;
  if (process.platform === 'darwin') return 'darwin';
  if (process.platform === 'linux') return 'linux';
  throw new Error(
    `Unsupported platform ${process.platform}. Set NKP_CLI_OS=linux|darwin.`,
  );
}

function detectArch() {
  return (process.env.NKP_CLI_ARCH || 'amd64').trim() || 'amd64';
}

function downloadUrl(tag, osName, arch) {
  if (!cliDownloadUrlTemplate && !process.env.NKP_CLI_URL) {
    readVersionsConfig();
  }
  const template = (process.env.NKP_CLI_URL || cliDownloadUrlTemplate).trim();
  return template
    .replaceAll('{version}', tag)
    .replaceAll('{os}', osName)
    .replaceAll('{arch}', arch);
}

function findNkpBinary(dir) {
  const direct = path.join(dir, 'nkp');
  if (fs.existsSync(direct) && fs.statSync(direct).isFile()) return direct;
  const stack = [dir];
  while (stack.length) {
    const cur = stack.pop();
    for (const ent of fs.readdirSync(cur, { withFileTypes: true })) {
      const full = path.join(cur, ent.name);
      if (ent.isDirectory()) {
        if (ent.name !== '.' && ent.name !== '..') stack.push(full);
      } else if (ent.name === 'nkp') {
        return full;
      }
    }
  }
  return '';
}

function downloadCli(tag, cacheDir, forceDownload) {
  const destDir = path.join(cacheDir, tag);
  const cached = path.join(destDir, 'nkp');
  if (!forceDownload && fs.existsSync(cached)) {
    console.log(`[${tag}] using cached ${path.relative(DOCS_ROOT, cached)}`);
    return cached;
  }

  fs.mkdirSync(destDir, { recursive: true });
  const osName = detectOs();
  const arch = detectArch();
  const url = downloadUrl(tag, osName, arch);
  const tarball = path.join(destDir, `nkp_${tag}.tar.gz`);
  console.log(`[${tag}] downloading ${url}`);
  execFileSync('curl', ['-fL', '--retry', '3', '--retry-delay', '2', '-o', tarball, url], {
    stdio: 'inherit',
  });
  console.log(`[${tag}] extracting`);
  execFileSync('tar', ['-xzf', tarball, '-C', destDir], { stdio: 'inherit' });
  fs.rmSync(tarball, { force: true });

  const binary = findNkpBinary(destDir);
  if (!binary) {
    throw new Error(`[${tag}] tarball did not contain an nkp binary`);
  }
  fs.chmodSync(binary, 0o755);
  if (path.resolve(binary) !== path.resolve(cached)) {
    fs.copyFileSync(binary, cached);
    fs.chmodSync(cached, 0o755);
  }
  return cached;
}

function dumpHelpMarkdown(binary, rawDir, tag) {
  fs.rmSync(rawDir, { recursive: true, force: true });
  fs.mkdirSync(rawDir, { recursive: true });
  console.log(`[${tag}] nkp help --output markdown --tree --output-dir`);
  try {
    execFileSync(
      binary,
      ['help', '--output', 'markdown', '--tree', '--output-dir', rawDir],
      { stdio: 'inherit', timeout: 180_000 },
    );
  } catch (err) {
    throw new Error(
      `[${tag}] nkp help --output markdown --tree failed.\n${err.message}`,
    );
  }
  const files = fs.readdirSync(rawDir).filter((n) => n.endsWith('.md'));
  if (files.length === 0) {
    throw new Error(`[${tag}] nkp help wrote no markdown files to ${rawDir}`);
  }
  return files;
}

function parseCommandFile(filename) {
  if (!filename.endsWith('.md')) return null;
  const base = filename.slice(0, -3);
  if (base === 'nkp') {
    return {
      filename,
      id: 'nkp',
      command: 'nkp',
      outName: 'index.md',
      parent: null,
      segments: ['nkp'],
      depth: 0,
    };
  }
  if (!base.startsWith('nkp_')) return null;
  const parts = base.slice(4).split('_').filter(Boolean);
  const segments = ['nkp', ...parts];
  const parent =
    parts.length <= 1 ? 'nkp' : ['nkp', ...parts.slice(0, -1)].join('_');
  return {
    filename,
    id: base,
    command: segments.join(' '),
    outName: filename,
    parent,
    segments,
    depth: segments.length - 1,
  };
}

function yamlScalar(value) {
  const s = String(value);
  // Quote empties, YAML-special chars, and numeric-looking values (e.g. 2.20 → 2.2).
  if (
    s === '' ||
    /[:#\[\]{},&*!|>%@`]/.test(s) ||
    s !== s.trim() ||
    /^-?\d+(\.\d+)*$/.test(s)
  ) {
    return JSON.stringify(s);
  }
  return s;
}

function rewriteLinks(body) {
  return body.replace(/\]\((?:\.\.\/|\.\/)?nkp\.md(#[^)]*)?\)/g, '](index.md$1)');
}

function labelUnlabeledFences(text) {
  let inFence = false;
  return text
    .split('\n')
    .map((line) => {
      if (!line.startsWith('```')) return line;
      if (inFence) {
        inFence = false;
        return '```';
      }
      inFence = true;
      return line.trim() === '```' ? '```bash' : line;
    })
    .join('\n');
}

function fenceTabIndentedExamples(text) {
  const lines = text.split('\n');
  const out = [];
  let i = 0;
  let inFence = false;
  while (i < lines.length) {
    if (lines[i].startsWith('```')) {
      inFence = !inFence;
      out.push(lines[i]);
      i += 1;
      continue;
    }
    if (!inFence && /^\t/.test(lines[i])) {
      const block = [];
      while (i < lines.length && /^\t/.test(lines[i])) {
        block.push(lines[i].replace(/^\t/, ''));
        i += 1;
      }
      out.push('```bash', ...block, '```');
      continue;
    }
    out.push(lines[i]);
    i += 1;
  }
  return out.join('\n');
}

function escapeMdxOutsideFences(text) {
  let inFence = false;
  return text
    .split('\n')
    .map((line) => {
      if (line.startsWith('```')) {
        inFence = !inFence;
        return line;
      }
      if (inFence) return line;
      // Intentional HTML from enrichCliMarkdown — do not entity-escape these tags.
      if (/^\s*<\/?(details|summary|dl|dt|dd)\b/.test(line)) return line;
      // Prefer HTML entities over {'{'} so MDX stays valid.
      return line
        .replace(/\{/g, '&#123;')
        .replace(/\}/g, '&#125;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
    })
    .join('\n');
}

/** Escape text embedded inside generated HTML option blocks (MDX-safe). */
function escapeHtmlText(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\{/g, '&#123;')
    .replace(/\}/g, '&#125;')
    // MDX still parses markdown emphasis/links/strikethrough inside raw HTML text nodes.
    .replace(/\*/g, '&#42;')
    .replace(/_/g, '&#95;')
    .replace(/`/g, '&#96;')
    .replace(/\[/g, '&#91;')
    .replace(/\]/g, '&#93;')
    // Lone `~` (e.g. ~/.kommander/config) starts mdast strikethrough and
    // conflicts with nested </code> → Docusaurus end-tag-mismatch.
    .replace(/~/g, '&#126;');
}

/** Rewrite CI home paths (e.g. /home/runner/…) to ~/… for docs. */
function sanitizeDefault(def) {
  if (!def) return '';
  return String(def).replace(/^\/home\/[^/]+/, '~');
}

function normalizeBody(body) {
  let text = body.replace(/\r\n/g, '\n');
  // Restructure before tab→fence so Examples captions stay prose.
  text = restructureCliMarkdown(text);
  text = fenceTabIndentedExamples(text);
  text = labelUnlabeledFences(text);
  text = escapeMdxOutsideFences(text);
  text = text.replace(/[ \t]+$/gm, '');
  text = text.replace(/\n{3,}/g, '\n\n').trim();
  return `${text}\n`;
}

/** Parse a Cobra options fence line into flag / shorthand / type / description / default. */
function parseOptionLine(line) {
  const trimmed = line.replace(/\t/g, '  ').trimEnd();
  if (!trimmed.trim() || trimmed.trim().startsWith('#')) return null;

  // "  -c, --name string   Desc (default "x")" or "      --flag   Desc"
  const m = trimmed.match(
    /^(\s*)(?:(-[A-Za-z0-9]),\s*)?(--[A-Za-z0-9][\w-]*)(?:\s+(\S+))?\s{2,}(.+)$/,
  );
  if (!m) return null;
  const shorthand = m[2] || '';
  const flag = m[3];
  const typeOrRest = m[4] || '';
  let desc = m[5].trim();
  // If type token looks like part of description (no double-space split worked oddly), keep as-is.
  const knownTypes = new Set([
    'string',
    'strings',
    'int',
    'int32',
    'int64',
    'uint',
    'bool',
    'float',
    'float32',
    'float64',
    'duration',
    'ip',
    'url',
    'name',
    'files',
    'value',
  ]);
  let type = '';
  if (typeOrRest && knownTypes.has(typeOrRest.toLowerCase())) {
    type = typeOrRest;
  } else if (typeOrRest) {
    desc = `${typeOrRest} ${desc}`.trim();
  }
  let def = '';
  const defMatch = desc.match(/\s*\(default\s+(.+)\)\s*$/);
  if (defMatch) {
    def = defMatch[1].replace(/^"|"$/g, '');
    desc = desc.slice(0, defMatch.index).trim();
  }
  return {
    flag,
    shorthand,
    type,
    description: desc,
    default: sanitizeDefault(def),
  };
}

function formatOptionDt(row) {
  const parts = [];
  if (row.shorthand) {
    parts.push(`<code>${escapeHtmlText(row.shorthand)}</code>`, ', ');
  }
  parts.push(`<code>${escapeHtmlText(row.flag)}</code>`);
  if (row.type) {
    parts.push(
      ` <span class="cli-opt__type">${escapeHtmlText(row.type)}</span>`,
    );
  }
  if (row.default) {
    parts.push(
      ` <span class="cli-opt__default">default <code>${escapeHtmlText(row.default)}</code></span>`,
    );
  }
  return `<dt>${parts.join('')}</dt>`;
}

function parseOptionRows(fenceBody) {
  const rows = [];
  for (const line of fenceBody.split('\n')) {
    const row = parseOptionLine(line);
    if (row) rows.push(row);
  }
  return rows;
}

/** Dedupe by long flag (first wins), sort ascending for scanning. */
function mergeOptionRows(rows) {
  const byFlag = new Map();
  for (const r of rows) {
    if (!byFlag.has(r.flag)) byFlag.set(r.flag, r);
  }
  return [...byFlag.values()].sort((a, b) => a.flag.localeCompare(b.flag));
}

/** Turn option rows into stacked &lt;dl class="cli-opts"&gt; blocks. */
function optionRowsToBlocks(rows) {
  const merged = mergeOptionRows(rows);
  if (merged.length === 0) return null;
  const lines = ['<dl class="cli-opts">'];
  for (const r of merged) {
    lines.push(formatOptionDt(r));
    lines.push(`<dd>${escapeHtmlText(r.description)}</dd>`);
  }
  lines.push('</dl>');
  return lines.join('\n');
}

function readOptionsFence(lines, startIdx) {
  let i = startIdx;
  while (i < lines.length && !lines[i].trim()) i += 1;
  if (i >= lines.length || !lines[i].startsWith('```')) {
    return {rows: [], next: i};
  }
  i += 1;
  const fence = [];
  while (i < lines.length && !lines[i].startsWith('```')) {
    fence.push(lines[i]);
    i += 1;
  }
  if (i < lines.length) i += 1;
  return {rows: parseOptionRows(fence.join('\n')), next: i};
}

function readFence(lines, startIdx) {
  let i = startIdx;
  if (i >= lines.length || !lines[i].startsWith('```')) {
    return {body: '', next: i};
  }
  i += 1;
  const fence = [];
  while (i < lines.length && !lines[i].startsWith('```')) {
    fence.push(lines[i]);
    i += 1;
  }
  if (i < lines.length) i += 1;
  return {body: fence.join('\n'), next: i};
}

function normPara(s) {
  return String(s || '')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();
}

function isUsageFenceBody(body) {
  const t = body.trim();
  if (!t) return false;
  // Prefer the canonical single-line usage.
  if (!t.includes('\n') && /^nkp\b/.test(t)) return true;
  return false;
}

function looksLikeShellExample(body) {
  const t = body.trim();
  if (!t) return false;
  if (/^nkp\b/m.test(t)) return true;
  if (/^\$\s*nkp\b/m.test(t)) return true;
  return false;
}

function usageScore(body) {
  const t = body.trim();
  let score = 0;
  if (/\[flags\]/.test(t)) score += 10;
  if (!t.includes('\n')) score += 5;
  if (/^nkp\b/.test(t)) score += 1;
  return score;
}

/**
 * Parse tab-indented Cobra "Examples:" region into caption/code blocks.
 */
function consumeTabExampleSection(lines, startIdx) {
  let i = startIdx;
  const blocks = [];
  if (i < lines.length && /^Examples:\s*$/i.test(lines[i].trim())) {
    i += 1;
  }

  while (i < lines.length) {
    if (/^###\s+/.test(lines[i]) || lines[i].startsWith('```')) break;
    if (!lines[i].trim()) {
      i += 1;
      continue;
    }

    if (/^\t/.test(lines[i])) {
      const rawLines = [];
      while (i < lines.length) {
        if (/^###\s+/.test(lines[i]) || lines[i].startsWith('```')) break;
        if (!lines[i].trim()) {
          // Blank: keep if more tab content follows, else end block group.
          if (i + 1 < lines.length && /^\t/.test(lines[i + 1])) {
            rawLines.push('');
            i += 1;
            continue;
          }
          i += 1;
          break;
        }
        if (!/^\t/.test(lines[i])) break;
        // Strip all leading tabs so continuation lines stay inside one fence.
        rawLines.push(lines[i].replace(/^\t+/, ''));
        i += 1;
      }
      const chunk = rawLines.join('\n').trimEnd();
      for (const sub of chunk.split(/\n\n+/)) {
        const s = sub.trim();
        if (!s) continue;
        if (looksLikeShellExample(s)) {
          blocks.push({kind: 'code', text: s});
        } else {
          blocks.push({kind: 'caption', text: s});
        }
      }
      continue;
    }

    // Non-tab line under examples (rare).
    blocks.push({kind: 'caption', text: lines[i].trim()});
    i += 1;
  }
  return {blocks, next: i};
}

/**
 * Rebuild leaf body: no H2 (Doc title owns it), no Synopsis heading,
 * order Description → Options → Usage → Examples.
 */
function restructureCliMarkdown(text) {
  const lines = text.split('\n');
  let i = 0;

  while (i < lines.length && !lines[i].trim()) i += 1;
  if (i < lines.length && /^##\s+/.test(lines[i])) i += 1;

  const leadChunks = [];
  const synopsisChunks = [];
  let optionRows = [];
  let usageBody = null;
  let usageBodyScore = -1;
  const exampleBlocks = [];
  let mode = 'lead'; // lead | synopsis | examples

  while (i < lines.length) {
    const line = lines[i];

    if (/^###\s+SEE ALSO\b/i.test(line)) {
      break;
    }

    if (/^###\s+Synopsis\s*$/i.test(line)) {
      mode = 'synopsis';
      i += 1;
      continue;
    }

    if (/^###\s+Examples\s*$/i.test(line)) {
      mode = 'examples';
      i += 1;
      continue;
    }

    if (/^Examples:\s*$/i.test(line.trim())) {
      mode = 'examples';
      const {blocks, next} = consumeTabExampleSection(lines, i);
      exampleBlocks.push(...blocks);
      i = next;
      continue;
    }

    const isOptions = /^###\s+Options\s*$/i.test(line);
    const isInherited =
      /^###\s+Options inherited from parent commands\s*$/i.test(line);
    if (isOptions || isInherited) {
      i += 1;
      {
        const {rows, next} = readOptionsFence(lines, i);
        optionRows.push(...rows);
        i = next;
      }
      if (isOptions) {
        while (i < lines.length && !lines[i].trim()) i += 1;
        if (
          i < lines.length &&
          /^###\s+Options inherited from parent commands\s*$/i.test(lines[i])
        ) {
          i += 1;
          const {rows, next} = readOptionsFence(lines, i);
          optionRows.push(...rows);
          i = next;
        }
      }
      mode = 'lead';
      continue;
    }

    if (line.startsWith('```')) {
      const {body, next} = readFence(lines, i);
      i = next;
      const trimmed = body.trim();
      if (isUsageFenceBody(trimmed)) {
        const score = usageScore(trimmed);
        if (score >= usageBodyScore) {
          usageBody = trimmed;
          usageBodyScore = score;
        }
      } else if (looksLikeShellExample(trimmed)) {
        exampleBlocks.push({kind: 'code', text: trimmed});
      } else if (trimmed) {
        exampleBlocks.push({kind: 'caption', text: trimmed});
      }
      continue;
    }

    // Tab-indented content that appears before "Examples:" label (rare).
    if (/^\t/.test(line) && mode === 'synopsis') {
      mode = 'examples';
      const {blocks, next} = consumeTabExampleSection(lines, i);
      exampleBlocks.push(...blocks);
      i = next;
      continue;
    }

    if (mode === 'examples') {
      if (!line.trim()) {
        i += 1;
        continue;
      }
      if (/^\t/.test(line)) {
        const {blocks, next} = consumeTabExampleSection(lines, i);
        exampleBlocks.push(...blocks);
        i = next;
        continue;
      }
      exampleBlocks.push({kind: 'caption', text: line.trim()});
      i += 1;
      continue;
    }

    if (mode === 'synopsis') {
      synopsisChunks.push(line);
      i += 1;
      continue;
    }

    // lead
    leadChunks.push(line);
    i += 1;
  }

  const leadText = leadChunks.join('\n').trim();
  let synopsisText = synopsisChunks.join('\n').trim();
  // Drop synopsis when it only restates the lead.
  if (
    synopsisText &&
    leadText &&
    normPara(synopsisText) === normPara(leadText)
  ) {
    synopsisText = '';
  } else if (
    synopsisText &&
    leadText &&
    normPara(synopsisText).startsWith(normPara(leadText))
  ) {
    // Keep longer synopsis; lead stays as short blurb.
  }

  const out = [];
  if (leadText) {
    out.push(leadText, '');
  }
  if (synopsisText) {
    out.push(synopsisText, '');
  }

  const optBlocks = optionRowsToBlocks(optionRows);
  if (optBlocks) {
    out.push('### Options', '', optBlocks, '');
  }

  if (usageBody) {
    out.push('### Usage', '', '```bash', usageBody, '```', '');
  }

  if (exampleBlocks.length) {
    out.push('### Examples', '');
    for (const b of exampleBlocks) {
      if (b.kind === 'code') {
        out.push('```bash', b.text, '```', '');
      } else {
        out.push(b.text, '');
      }
    }
  }

  return out.join('\n').trim() + '\n';
}

function extractSummary(raw) {
  const lines = raw.replace(/\r\n/g, '\n').split('\n');
  let afterHeading = false;
  for (const line of lines) {
    if (/^##\s+/.test(line)) {
      afterHeading = true;
      continue;
    }
    if (!afterHeading) continue;
    const t = line.trim();
    if (!t || t.startsWith('#') || t.startsWith('```') || t.startsWith('<')) continue;
    if (t.startsWith('|') || t.startsWith('-') || t.startsWith('*')) continue;
    if (/^(-[A-Za-z0-9],\s*)?--/.test(t)) continue;
    return t.slice(0, 200);
  }
  return '';
}

function stripSeeAlso(text) {
  return text.replace(/\n###\s+SEE ALSO\b[\s\S]*$/i, '\n').trim() + '\n';
}

function escapeMdLinkText(s) {
  return String(s).replace(/\|/g, '\\|').replace(/\[/g, '\\[').replace(/\]/g, '\\]');
}

function buildHubBody(item, children, summaryById) {
  const desc = summaryById.get(item.id) || '';
  const lines = [];
  if (desc) {
    lines.push(desc, '');
  }
  lines.push('### Available commands', '');
  const sorted = [...children].sort((a, b) => a.command.localeCompare(b.command));
  for (const child of sorted) {
    const link = child.outName === 'index.md' ? 'index.md' : child.outName;
    const childSummary = summaryById.get(child.id) || '';
    const label = escapeMdLinkText(child.command);
    if (childSummary) {
      lines.push(
        `* [${label}](${link}) — ${escapeMdLinkText(childSummary)}`,
      );
    } else {
      lines.push(`* [${label}](${link})`);
    }
  }
  lines.push('');
  return rewriteLinks(escapeMdxOutsideFences(lines.join('\n')));
}

function buildLeafBody(item, raw, parentItem, summaryById) {
  let body = stripSeeAlso(rewriteLinks(normalizeBody(raw)));
  if (parentItem) {
    const link =
      parentItem.outName === 'index.md' ? 'index.md' : parentItem.outName;
    const parentSum = summaryById.get(parentItem.id) || '';
    body += [
      '',
      '### Parent command',
      '',
      parentSum
        ? `* [${escapeMdLinkText(parentItem.command)}](${link}) — ${escapeMdLinkText(parentSum)}`
        : `* [${escapeMdLinkText(parentItem.command)}](${link})`,
      '',
    ].join('\n');
  }
  return body.endsWith('\n') ? body : `${body}\n`;
}

function writeCategory(dir, spec) {
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(`${dir}/_category_.json`, `${JSON.stringify(spec, null, 2)}\n`);
}

function processMinor({ minor, patch, unlisted, rawDir, destDir, position }) {
  const names = fs.readdirSync(rawDir).filter((n) => n.endsWith('.md'));
  const items = names
    .map(parseCommandFile)
    .filter(Boolean)
    .sort((a, b) => a.command.localeCompare(b.command));

  if (items.length === 0) {
    throw new Error(`[${minor}] no nkp_*.md files in ${rawDir}`);
  }

  const byId = new Map(items.map((it) => [it.id, it]));
  const childrenOf = new Map();
  for (const it of items) {
    if (!it.parent) continue;
    if (!childrenOf.has(it.parent)) childrenOf.set(it.parent, []);
    childrenOf.get(it.parent).push(it);
  }

  const summaryById = new Map();
  const rawById = new Map();
  for (const it of items) {
    const raw = fs.readFileSync(path.join(rawDir, it.filename), 'utf8');
    rawById.set(it.id, raw);
    summaryById.set(it.id, extractSummary(raw));
  }

  const staging = `${destDir}.tmp`;
  fs.rmSync(staging, { recursive: true, force: true });
  fs.mkdirSync(staging, { recursive: true });

  writeCategory(staging, {
    label: minor,
    position,
    className: 'hidden',
    collapsed: true,
    link: { type: 'doc', id: `cli/${minor}/index` },
  });

  const commands = [];

  for (const item of items) {
    const outAbs = path.join(staging, item.outName);
    const raw = rawById.get(item.id);
    const heading = (raw.match(/^##\s+(.+)$/m) || [])[1] || item.command;
    const summary = summaryById.get(item.id) || '';
    const kids = childrenOf.get(item.id) || [];
    const isBranch = kids.length > 0;

    let body;
    if (isBranch) {
      body = buildHubBody(item, kids, summaryById);
    } else {
      const parentItem = item.parent ? byId.get(item.parent) : null;
      body = buildLeafBody(item, raw, parentItem, summaryById);
    }

    const page = [
      '---',
      `title: ${yamlScalar(heading)}`,
      `sidebar_label: ${yamlScalar(item.command)}`,
      `sidebar_position: ${item.outName === 'index.md' ? 0 : 10}`,
      'cli_generated: true',
      'unlisted: true',
      'hide_table_of_contents: true',
      // Keep the shared docs left nav on unlisted command pages (not in sidebars.js).
      'displayed_sidebar: tutorialSidebar',
      `nkp_minor: ${yamlScalar(minor)}`,
      `nkp_patch: ${yamlScalar(patch)}`,
      `nkp_command_id: ${yamlScalar(item.id)}`,
      `nkp_command_kind: ${isBranch ? 'parent' : 'leaf'}`,
      '---',
      '',
      '<div class="cli-doc-ref" aria-hidden="true"></div>',
      '',
      body,
    ].join('\n');
    fs.writeFileSync(outAbs, page);

    commands.push({
      id: item.id,
      command: item.command,
      title: heading,
      summary,
      file: item.outName,
      slug: item.outName === 'index.md' ? '' : item.outName.replace(/\.md$/, ''),
      parentId: item.parent,
      depth: item.depth,
      segments: item.segments,
      kind: isBranch ? 'parent' : 'leaf',
    });
  }

  const index = {
    minor,
    patch,
    unlisted: !!unlisted,
    commands,
  };

  // Browser fetches from static/ so version switching does not need webpack imports.
  // Do not also write commands.json under source/cli/<minor>/ (gitignored / not dual-copied).
  const staticDir = path.join(DOCS_ROOT, 'site', 'static', 'cli', minor);
  fs.mkdirSync(staticDir, { recursive: true });
  fs.writeFileSync(
    path.join(staticDir, 'commands.json'),
    `${JSON.stringify(index, null, 2)}\n`,
  );

  fs.rmSync(destDir, { recursive: true, force: true });
  fs.renameSync(staging, destDir);
  console.log(
    `[${minor}] wrote ${items.length} page(s) from ${patch} under ${path.relative(DOCS_ROOT, destDir)}`,
  );
}

function removeStaleVersionDirs(keepMinors) {
  const keep = new Set(keepMinors);
  for (const ent of fs.readdirSync(SOURCE_CLI, { withFileTypes: true })) {
    if (!ent.isDirectory()) continue;
    // Drop old patch-named trees (2.16.0) and minors no longer in config.
    if (/^\d+\.\d+(\.\d+.*)?$/.test(ent.name) && !keep.has(ent.name)) {
      const full = path.join(SOURCE_CLI, ent.name);
      console.log(`removing stale ${path.relative(DOCS_ROOT, full)}`);
      fs.rmSync(full, { recursive: true, force: true });
    }
  }
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const config = readVersionsConfig();
  let minors = config.minors;

  if (args.fromDir || args.binary) {
    if (!args.minor || !args.patch) {
      throw new Error('--from-dir/--binary require --minor and --patch');
    }
    minors = [{ minor: args.minor, latest: args.patch, unlisted: false }];
  }

  const ranked = [...minors]
    .map((m) => m.minor)
    .sort(compareMinor)
    .reverse();

  console.log(
    `CLI docs minors: ${minors.map((m) => `${m.minor}←${m.latest}`).join(', ')} (default ${config.defaultMinor})`,
  );
  fs.mkdirSync(SOURCE_CLI, { recursive: true });
  // site/src/data/*.json is owned by sync-docs-data (prepare); refresh here too
  // so a standalone generate-cli-docs keeps the browser config current.
  const sync = spawnSync(
    process.execPath,
    [path.join(DOCS_ROOT, 'scripts', 'sync-docs-data.mjs')],
    {stdio: 'inherit'},
  );
  if (sync.status !== 0) {
    throw new Error('sync-docs-data.mjs failed');
  }
  removeStaleVersionDirs(minors.map((m) => m.minor));

  for (const entry of minors) {
    const { minor, latest: patch, unlisted } = entry;
    const destDir = path.join(SOURCE_CLI, minor);
    const position = ranked.indexOf(minor) + 1;

    if (args.fromDir) {
      processMinor({
        minor,
        patch,
        unlisted,
        rawDir: args.fromDir,
        destDir,
        position,
      });
      continue;
    }

    const binary = args.binary || downloadCli(patch, args.cacheDir, args.forceDownload);
    const rawDir = path.join(os.tmpdir(), `nkp-help-${patch}-${process.pid}`);
    try {
      dumpHelpMarkdown(binary, rawDir, patch);
      processMinor({ minor, patch, unlisted, rawDir, destDir, position });
    } finally {
      fs.rmSync(rawDir, { recursive: true, force: true });
    }
  }
}

try {
  main();
} catch (err) {
  console.error(err.message || err);
  process.exit(1);
}
