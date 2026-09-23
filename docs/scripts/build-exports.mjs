#!/usr/bin/env node
/**
 * Build offline exports:
 *   nkp-catalog-docs.pdf  (preferred)
 *   nkp-catalog-docs.html (secondary)
 *
 * Usage: node scripts/build-exports.mjs [--out-dir DIR]
 */
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DOCS_ROOT = path.resolve(__dirname, '..');
const SOURCE_ROOT = path.join(DOCS_ROOT, 'source');
const SITE_ROOT = path.join(DOCS_ROOT, 'site');
const PDF_NAME = 'nkp-catalog-docs.pdf';
const HTML_NAME = 'nkp-catalog-docs.html';

const {loadPortalVersion} = require('./docs-config.cjs');

const portal = loadPortalVersion(SITE_ROOT);
const NKP_VERSION = String(portal.nkpVersion);
const NKP_DOCS_BASE = String(portal.nkpDocsBaseUrl);

function parseArgs(argv) {
  const out = { outDir: path.join(SITE_ROOT, 'static', 'offline') };
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === '--out-dir') out.outDir = path.resolve(argv[++i]);
  }
  return out;
}

function readFrontMatter(raw) {
  if (!raw.startsWith('---')) return { data: {}, body: raw };
  const end = raw.indexOf('\n---', 3);
  if (end === -1) return { data: {}, body: raw };
  const fm = raw.slice(3, end).trim();
  const body = raw.slice(end + 4).replace(/^\r?\n/, '');
  const data = {};
  for (const line of fm.split('\n')) {
    const m = line.match(/^([\w-]+):\s*(.*)$/);
    if (!m) continue;
    let v = m[2].trim();
    if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
      v = v.slice(1, -1);
    }
    if (v === 'true') v = true;
    else if (v === 'false') v = false;
    else if (/^\d+$/.test(v)) v = Number(v);
    data[m[1]] = v;
  }
  return { data, body };
}

function slugify(text) {
  return String(text)
    .toLowerCase()
    .replace(/<[^>]+>/g, '')
    .replace(/&[a-z]+;/gi, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 96);
}

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function loadMarked() {
  try {
    return require(path.join(SITE_ROOT, 'node_modules', 'marked'));
  } catch {
    try {
      return require('marked');
    } catch {
      console.error('Missing marked. Run: cd docs/site && npm install marked');
      process.exit(1);
    }
  }
}

function preprocessMdx(body, filePath) {
  let text = body;
  text = text.replace(/^import\s.+;?\s*$/gm, '');
  text = text.replace(/\$\{siteConfig\.customFields\.nkpDocsBaseUrl\}/g, NKP_DOCS_BASE);
  text = text.replace(/\{siteConfig\.customFields\.nkpVersion\}/g, NKP_VERSION);
  text = text.replace(/\{siteConfig\.customFields\.nkpDocsBaseUrl\}/g, NKP_DOCS_BASE);
  text = text.replace(
    /href=\{`\$\{siteConfig\.customFields\.nkpDocsBaseUrl\}([^`]*)`\}/g,
    `href="${NKP_DOCS_BASE}$1"`,
  );
  text = text.replace(/\$\{siteConfig\.customFields\.nkpVersion\}/g, NKP_VERSION);
  text = text.replace(
    /<Link\s+to="([^"]+)"[^>]*>\s*([\s\S]*?)\s*<\/Link>/g,
    (_, to, inner) => {
      const label = inner.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim() || to;
      return `[${label}](${to})`;
    },
  );
  text = text.replace(
    /<SchemaValidator[\s\S]*?\/>/g,
    '\n\n> **Note:** The interactive schema validator is only on the live docs site. Use the schema JSON link above when working offline.\n',
  );
  text = text.replace(/<Tabs>[\s\S]*?<\/Tabs>/g, (block) => {
    const items = [];
    const re = /<TabItem\b([^>]*)>([\s\S]*?)<\/TabItem>/g;
    let m;
    while ((m = re.exec(block))) {
      const labelMatch = m[1].match(/label="([^"]+)"/);
      items.push(`#### ${labelMatch ? labelMatch[1] : 'Tab'}\n\n${m[2].trim()}\n`);
    }
    return items.join('\n');
  });
  text = text.replace(/\{useBaseUrl\('([^']+)'\)\}/g, '$1');
  text = text.replace(/\{useBaseUrl\("([^"]+)"\)\}/g, '$1');
  text = text.replace(
    /:::(info|note|tip|warning|danger|caution)[^\n]*\n([\s\S]*?):::/g,
    (_, kind, content) =>
      `> **${kind.toUpperCase()}:** ${content.trim().replace(/\n/g, '\n> ')}\n`,
  );
  text = text.replace(/<\/?(?:div|span|p|main|section|header|footer|Fragment)[^>]*>/gi, '\n');
  text = text.replace(/data-internal="true"/g, '');
  text = text.replace(/\{\/\*[\s\S]*?\*\//g, '');
  text = text.replace(/\n{3,}/g, '\n\n').trim();
  if (/<[A-Z][A-Za-z0-9]*\b/.test(text)) {
    console.warn(`warn: residual JSX in ${path.relative(SOURCE_ROOT, filePath)}`);
  }
  return text;
}

function listDocFiles(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const categoryPath = path.join(dir, '_category_.json');
  let category = { label: path.basename(dir), position: 999 };
  if (fs.existsSync(categoryPath)) {
    try {
      category = { ...category, ...JSON.parse(fs.readFileSync(categoryPath, 'utf8')) };
    } catch {
      /* ignore */
    }
  }
  const files = [];
  const dirs = [];
  for (const ent of entries) {
    if (ent.name.startsWith('.') || ent.name === '_category_.json') continue;
    if (ent.name === 'schemas') continue;
    const full = path.join(dir, ent.name);
    if (ent.isDirectory()) {
      // Per-version nkp help dumps are large; the CLI landing page is enough offline.
      if (path.basename(dir) === 'cli' && /^\d+\.\d+/.test(ent.name)) continue;
      dirs.push(listDocFiles(full));
    } else if (/\.mdx?$/.test(ent.name)) {
      const raw = fs.readFileSync(full, 'utf8');
      const { data, body } = readFrontMatter(raw);
      if (data.internal === true || data.draft === true || data.unlisted === true) continue;
      if (data.cli_generated === true) continue;
      const title =
        data.title ||
        data.sidebar_label ||
        ent.name.replace(/\.mdx?$/, '').replace(/-/g, ' ');
      files.push({
        type: 'doc',
        file: full,
        title,
        position: data.sidebar_position ?? 999,
        body,
      });
    }
  }
  files.sort((a, b) => a.position - b.position || a.title.localeCompare(b.title));
  dirs.sort(
    (a, b) => (a.position ?? 999) - (b.position ?? 999) || a.label.localeCompare(b.label),
  );
  return {
    type: 'category',
    label: category.label || path.basename(dir),
    position: category.position ?? 999,
    children: [...files, ...dirs],
  };
}

function collectDocs() {
  const rootFiles = [];
  const categories = [];
  for (const ent of fs.readdirSync(SOURCE_ROOT, { withFileTypes: true })) {
    if (ent.name.startsWith('.') || ent.name === 'schemas') continue;
    // Application pages are generated SPA shells and do not contain useful offline content.
    if (ent.name === 'applications') continue;
    const full = path.join(SOURCE_ROOT, ent.name);
    if (ent.isDirectory()) {
      categories.push(listDocFiles(full));
    } else if (/\.mdx?$/.test(ent.name)) {
      const raw = fs.readFileSync(full, 'utf8');
      const { data, body } = readFrontMatter(raw);
      if (data.internal === true || data.draft === true || data.unlisted === true) continue;
      rootFiles.push({
        type: 'doc',
        file: full,
        title: data.title || 'NKP Catalog',
        position: data.sidebar_position ?? 1,
        body,
      });
    }
  }
  rootFiles.sort((a, b) => a.position - b.position);
  categories.sort((a, b) => (a.position ?? 999) - (b.position ?? 999));
  return [...rootFiles, ...categories];
}

function flattenTree(nodes, acc = []) {
  for (const n of nodes) {
    if (n.type === 'doc') acc.push(n);
    else if (n.type === 'category') {
      acc.push({ type: 'category', label: n.label });
      flattenTree(n.children || [], acc);
    }
  }
  return acc;
}

function shiftHeadings(md, shift) {
  return md.replace(/^(#{1,6})\s/gm, (_, hashes) => {
    const level = Math.min(hashes.length + shift, 6);
    return `${'#'.repeat(level)} `;
  });
}

function buildBookMarkdown(tree) {
  const parts = [];
  parts.push('# NKP Catalog documentation\n');
  parts.push(
    'Offline export of the NKP Catalog docs. Prefer the **PDF** for airgapped use; the companion **HTML** file is a secondary option.\n',
  );
  parts.push(`Generated: ${new Date().toISOString()}\n`);
  for (const item of flattenTree(tree)) {
    if (item.type === 'category') {
      parts.push(`\n# ${item.label}\n`);
      continue;
    }
    let content = shiftHeadings(preprocessMdx(item.body, item.file), 2);
    content = content.replace(/^#{1,3}\s+.+?\n+/, '');
    const id = slugify(path.relative(SOURCE_ROOT, item.file).replace(/\.mdx?$/, ''));
    parts.push(`\n## ${item.title} {#${id}}\n\n${content}\n`);
  }
  return parts.join('\n');
}

function markdownToHtml(md, marked) {
  const renderer = new marked.Renderer();
  const usedIds = new Set();
  renderer.heading = function heading(textOrToken, level) {
    let text;
    let depth;
    if (typeof textOrToken === 'object' && textOrToken !== null) {
      text = this.parser.parseInline(textOrToken.tokens);
      depth = textOrToken.depth;
    } else {
      text = textOrToken;
      depth = level;
    }
    const plain = String(text).replace(/<[^>]+>/g, '');
    let id;
    const idMatch = plain.match(/\s*\{#([a-zA-Z0-9_-]+)\}\s*$/);
    if (idMatch) {
      id = idMatch[1];
      text = String(text).replace(/\s*\{#[a-zA-Z0-9_-]+\}\s*$/, '');
    } else {
      id = slugify(plain);
    }
    if (usedIds.has(id)) {
      let i = 2;
      while (usedIds.has(`${id}-${i}`)) i++;
      id = `${id}-${i}`;
    }
    usedIds.add(id);
    return `<h${depth} id="${id}">${text}</h${depth}>\n`;
  };
  marked.setOptions({ renderer, gfm: true, breaks: false });
  return marked.parse(md);
}

function extractToc(html) {
  const items = [];
  const re = /<h([12]) id="([^"]+)">([\s\S]*?)<\/h\1>/g;
  let m;
  while ((m = re.exec(html))) {
    items.push({
      level: Number(m[1]),
      id: m[2],
      text: m[3].replace(/<[^>]+>/g, '').trim(),
    });
  }
  return items;
}

function wrapHtmlDocument(bodyHtml, toc) {
  const tocHtml = toc
    .map((item) => {
      const cls = item.level === 1 ? 'toc-h1' : 'toc-h2';
      return `<li class="${cls}"><a href="#${item.id}">${escapeHtml(item.text)}</a></li>`;
    })
    .join('\n');

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1"/>
<title>NKP Catalog documentation</title>
<style>
  :root {
    --text: #1b1f24; --muted: #5b6570; --border: #d8dee4; --link: #0b6bcb;
    --bg: #fff; --code-bg: #f5f7fa; --nav-bg: #f0f3f6;
  }
  * { box-sizing: border-box; }
  html { scroll-behavior: smooth; }
  body {
    margin: 0;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif;
    color: var(--text); background: var(--bg); line-height: 1.55;
  }
  .layout { display: flex; min-height: 100vh; }
  nav.toc {
    position: sticky; top: 0; align-self: flex-start; width: 280px;
    max-height: 100vh; overflow: auto; padding: 1.25rem 1rem;
    background: var(--nav-bg); border-right: 1px solid var(--border); flex-shrink: 0;
  }
  nav.toc h1 { font-size: 0.95rem; margin: 0 0 0.75rem; }
  nav.toc ol { list-style: none; padding: 0; margin: 0; }
  nav.toc li { margin: 0.2rem 0; }
  nav.toc a {
    color: var(--text); text-decoration: none; font-size: 0.82rem;
    display: block; padding: 0.15rem 0.25rem; border-radius: 4px;
  }
  nav.toc a:hover { background: #e4e9ef; color: var(--link); }
  nav.toc .toc-h2 { padding-left: 0.85rem; }
  nav.toc .toc-h2 a { color: var(--muted); }
  main { flex: 1; max-width: 920px; padding: 2rem 2.25rem 4rem; }
  main h1 {
    font-size: 1.75rem; border-bottom: 1px solid var(--border);
    padding-bottom: 0.35rem; page-break-before: always; break-before: page;
  }
  main h1:first-of-type { page-break-before: avoid; break-before: avoid; }
  main h2 { font-size: 1.35rem; margin-top: 2rem; page-break-after: avoid; }
  main h3 { font-size: 1.15rem; margin-top: 1.5rem; }
  a { color: var(--link); }
  code, pre { font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; font-size: 0.88em; }
  code { background: var(--code-bg); padding: 0.1em 0.35em; border-radius: 4px; }
  pre {
    background: var(--code-bg); padding: 0.9rem 1rem; overflow: auto;
    border-radius: 8px; border: 1px solid var(--border);
  }
  pre code { background: none; padding: 0; }
  table { border-collapse: collapse; width: 100%; margin: 1rem 0; font-size: 0.92rem; }
  th, td { border: 1px solid var(--border); padding: 0.45rem 0.6rem; text-align: left; vertical-align: top; }
  th { background: var(--nav-bg); }
  blockquote {
    margin: 1rem 0; padding: 0.5rem 0.9rem; border-left: 4px solid var(--link); background: #f3f8fd;
  }
  img { max-width: 100%; }
  .banner {
    background: #fff8e6; border: 1px solid #f0d78c; padding: 0.75rem 1rem;
    border-radius: 8px; margin-bottom: 1.5rem; font-size: 0.92rem;
  }
  @media print {
    nav.toc { display: none !important; }
    .layout { display: block; }
    main { max-width: none; padding: 0; }
    main h1 { page-break-before: always; }
    main h1:first-of-type { page-break-before: avoid; }
    a[href^="#"] { text-decoration: none; color: inherit; }
  }
  @media screen and (max-width: 900px) {
    .layout { flex-direction: column; }
    nav.toc {
      position: relative; width: 100%; max-height: none;
      border-right: 0; border-bottom: 1px solid var(--border);
    }
  }
</style>
</head>
<body>
<div class="layout">
<nav class="toc" aria-label="Table of contents">
  <h1>Contents</h1>
  <ol>
${tocHtml}
  </ol>
</nav>
<main>
<div class="banner">
  <strong>Offline export.</strong> Prefer the <strong>PDF</strong> for airgapped handoff
  (section headings preserve navigation). This single HTML file is secondary:
  open it directly in a browser (<code>file://</code>). Interactive features
  (schema validator, in-site search) are not included.
</div>
${bodyHtml}
</main>
</div>
</body>
</html>
`;
}

function findChrome() {
  const candidates = [
    process.env.CHROME_PATH,
    process.env.GOOGLE_CHROME_SHIM,
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    '/Applications/Chromium.app/Contents/MacOS/Chromium',
    '/usr/bin/google-chrome',
    '/usr/bin/google-chrome-stable',
    '/usr/bin/chromium',
    '/usr/bin/chromium-browser',
    '/usr/local/bin/chromium',
  ].filter(Boolean);
  for (const c of candidates) {
    if (fs.existsSync(c)) return c;
  }
  return null;
}

function printPdfWithChrome(chromePath, htmlPath, pdfPath) {
  const absHtml = path.resolve(htmlPath);
  const absPdf = path.resolve(pdfPath);
  const fileUrl = `file://${absHtml}`;
  const baseArgs = [
    '--headless=new',
    '--disable-gpu',
    '--no-first-run',
    '--disable-extensions',
    '--no-pdf-header-footer',
    `--print-to-pdf=${absPdf}`,
  ];
  let result = spawnSync(
    chromePath,
    [...baseArgs, '--generate-pdf-document-outline', fileUrl],
    { encoding: 'utf8' },
  );
  if (result.status !== 0 || !fs.existsSync(absPdf)) {
    result = spawnSync(chromePath, [...baseArgs, fileUrl], { encoding: 'utf8' });
  }
  if (result.status !== 0 || !fs.existsSync(absPdf)) {
    console.error(result.stderr || result.stdout || 'Chrome PDF export failed');
    process.exit(1);
  }
  if (fs.statSync(absPdf).size < 1000) {
    console.error('PDF was not written or is empty:', absPdf);
    process.exit(1);
  }
}

function main() {
  const { outDir } = parseArgs(process.argv.slice(2));
  fs.mkdirSync(outDir, { recursive: true });

  const markedMod = loadMarked();
  const marked = markedMod.marked || markedMod;

  const tree = collectDocs();
  const bookMd = buildBookMarkdown(tree);
  const workDir = path.join(DOCS_ROOT, '.export-work');
  fs.mkdirSync(workDir, { recursive: true });
  fs.writeFileSync(path.join(workDir, 'book.md'), bookMd);

  const bodyHtml = markdownToHtml(bookMd, marked);
  const toc = extractToc(bodyHtml);
  const html = wrapHtmlDocument(bodyHtml, toc);
  const htmlPath = path.join(outDir, HTML_NAME);
  fs.writeFileSync(htmlPath, html);
  console.log(`Wrote ${htmlPath} (${(fs.statSync(htmlPath).size / 1024).toFixed(1)} KiB)`);

  const chrome = findChrome();
  if (!chrome) {
    console.error(
      'Chrome/Chromium not found. Set CHROME_PATH or install Chrome to build the PDF export.',
    );
    process.exit(1);
  }
  const pdfPath = path.join(outDir, PDF_NAME);
  printPdfWithChrome(chrome, htmlPath, pdfPath);
  console.log(`Wrote ${pdfPath} (${(fs.statSync(pdfPath).size / 1024).toFixed(1)} KiB)`);
  console.log(`Using browser: ${chrome}`);
}

main();
