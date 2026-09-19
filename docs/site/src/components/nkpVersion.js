'use strict';

// NKP product versions are major.minor only. Patch is ignored on ingest.
// Floor / GA ceiling / known list: docs/source/config.yaml → applications
// (synced to ../data/nkp-version-config.json by generate-catalog / _docs-prepare).

function loadFileConfig() {
  try {
    return require('../data/nkp-version-config.json');
  } catch {
    return {};
  }
}

const fileConfig = loadFileConfig();

const ALL_NKP_VERSIONS = (
  Array.isArray(fileConfig.knownNkpVersions) && fileConfig.knownNkpVersions.length
    ? fileConfig.knownNkpVersions
    : ['2.16', '2.17', '2.18', '2.19', '2.20']
).map(String);

// Assumed floor when metadata omits nkpVersionSupport (or leaves it empty).
// Unspecified apps are treated as NKP floor+ — not "any version".
const DEFAULT_NKP_FLOOR = String(fileConfig.nkpVersionFloor || '2.16');

// Highest generally-available NKP major.minor shown in the catalog version filter.
// Pre-GA entries may still exist in .release/stable.yaml; bump maxGaNkpVersion in
// docs/source/config.yaml when a version GAs. Env overrides the file value.
const MAX_GA_NKP_VERSION =
  (typeof process !== 'undefined' && process.env && process.env.MAX_GA_NKP_VERSION) ||
  String(fileConfig.maxGaNkpVersion || '2.19');

function toMinor(input) {
  if (input == null || input === '') return '';
  const m = String(input).trim().replace(/^v/i, '').match(/^(\d+)\.(\d+)/);
  if (!m) return '';
  return `${parseInt(m[1], 10)}.${parseInt(m[2], 10)}`;
}

function parseMinorParts(v) {
  const [maj, min] = String(v).split('.').map(n => parseInt(n, 10));
  return [maj, min];
}

function compareMinor(a, b) {
  const [am, ai] = parseMinorParts(a);
  const [bm, bi] = parseMinorParts(b);
  if (am !== bm) return am - bm;
  return ai - bi;
}

function nextMinor(v) {
  const [maj, min] = parseMinorParts(v);
  return `${maj}.${min + 1}`;
}

function previousMinor(v) {
  const [maj, min] = parseMinorParts(v);
  if (min > 0) return `${maj}.${min - 1}`;
  return maj > 0 ? `${maj - 1}.0` : '0.0';
}

function pickMax(a, b) {
  if (!a) return b;
  if (!b) return a;
  return compareMinor(a, b) >= 0 ? a : b;
}

function pickMin(a, b) {
  if (!a) return b;
  if (!b) return a;
  return compareMinor(a, b) <= 0 ? a : b;
}

function labelFor(min, maxExclusive) {
  if (!min && !maxExclusive) return `NKP ${DEFAULT_NKP_FLOOR}+`;
  if (min && !maxExclusive) return `NKP ${min}+`;
  if (!min && maxExclusive) return `NKP before ${maxExclusive}`;
  const end = previousMinor(maxExclusive);
  if (end === min) return `NKP ${min}`;
  return `NKP ${min}–${end}`;
}

function parseNkpRange(raw) {
  const text = (raw || '').trim();
  if (!text) {
    return {
      raw: '',
      min: DEFAULT_NKP_FLOOR,
      maxExclusive: '',
      label: labelFor(DEFAULT_NKP_FLOOR, ''),
    };
  }

  let min = '';
  let maxExclusive = '';
  const re = /(>=?|<=?)\s*v?(\d+)\.(\d+)(?:\.\d+)?/g;
  let m;
  while ((m = re.exec(text)) !== null) {
    const op = m[1];
    const minor = `${parseInt(m[2], 10)}.${parseInt(m[3], 10)}`;
    if (op === '>=') {
      min = pickMax(min, minor);
    } else if (op === '>') {
      min = pickMax(min, nextMinor(minor));
    } else if (op === '<') {
      maxExclusive = pickMin(maxExclusive, minor);
    } else if (op === '<=') {
      maxExclusive = pickMin(maxExclusive, nextMinor(minor));
    }
  }

  // Bare "2.18" / "2.18.0" with no operator: treat as min bound.
  if (!min && !maxExclusive) {
    const bare = toMinor(text);
    if (bare) min = bare;
  }

  // Unparseable / operator-less junk with no bounds → same floor as empty metadata.
  if (!min && !maxExclusive) {
    min = DEFAULT_NKP_FLOOR;
  }

  return {
    raw: text,
    min,
    maxExclusive,
    label: labelFor(min, maxExclusive),
  };
}

function matchesNkpVersion(range, selected) {
  if (!selected || selected === 'all') return true;
  const sel = toMinor(selected);
  if (!sel) return true;
  const effective = range && (range.min || range.maxExclusive)
    ? range
    : { min: DEFAULT_NKP_FLOOR, maxExclusive: '' };
  if (effective.min && compareMinor(effective.min, sel) > 0) return false;
  if (effective.maxExclusive && compareMinor(sel, effective.maxExclusive) >= 0) return false;
  return true;
}

function gaNkpVersions(versions) {
  const max = toMinor(MAX_GA_NKP_VERSION);
  const list = (versions && versions.length) ? versions : ALL_NKP_VERSIONS;
  return [...new Set(list.map(toMinor).filter(Boolean))]
    .filter(v => !max || compareMinor(v, max) <= 0)
    .sort(compareMinor);
}

const DEFAULT_NKP_VERSIONS = gaNkpVersions(ALL_NKP_VERSIONS);

const api = {
  ALL_NKP_VERSIONS,
  DEFAULT_NKP_FLOOR,
  MAX_GA_NKP_VERSION,
  DEFAULT_NKP_VERSIONS,
  toMinor,
  compareMinor,
  parseNkpRange,
  matchesNkpVersion,
  gaNkpVersions,
};

module.exports = api;
module.exports.default = api;
