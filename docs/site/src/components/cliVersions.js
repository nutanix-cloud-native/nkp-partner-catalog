'use strict';

const versionsConfig = require('../data/cli-versions.json');

function compareMinor(a, b) {
  const pa = String(a)
    .split('.')
    .map((n) => parseInt(n, 10) || 0);
  const pb = String(b)
    .split('.')
    .map((n) => parseInt(n, 10) || 0);
  for (let i = 0; i < 2; i++) {
    if ((pa[i] || 0) !== (pb[i] || 0)) return (pa[i] || 0) - (pb[i] || 0);
  }
  return 0;
}

function publicMinors() {
  return (versionsConfig.minors || [])
    .filter((m) => !m.unlisted)
    .slice()
    .sort((a, b) => compareMinor(b.minor, a.minor));
}

function allMinors() {
  return (versionsConfig.minors || []).slice().sort((a, b) => compareMinor(b.minor, a.minor));
}

function defaultMinor() {
  return versionsConfig.defaultMinor || publicMinors()[0]?.minor || '2.18';
}

function labelFor(entry) {
  return entry.label || entry.minor;
}

function findMinor(minor) {
  return (versionsConfig.minors || []).find((m) => m.minor === minor) || null;
}

function parseCliPath(pathname) {
  const m = String(pathname || '').match(/\/cli\/(\d+\.\d+)(?:\/([^/?#]*))?/);
  if (!m) return null;
  const minor = m[1];
  const rest = (m[2] || '').replace(/\/$/, '');
  const commandId =
    !rest || rest === 'index' ? 'nkp' : rest.replace(/\.md$/, '');
  return { minor, commandId, slug: rest === 'index' ? '' : rest };
}

module.exports = {
  versionsConfig,
  compareMinor,
  publicMinors,
  allMinors,
  defaultMinor,
  labelFor,
  findMinor,
  parseCliPath,
};
