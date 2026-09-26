'use strict';

// NKP product versions are major.minor only. Patch is ignored on ingest.
// Floor / GA ceiling / known list: docs/source/config.yaml → applications
// (synced to ../data/nkp-version-config.json by generate-catalog / _docs-prepare).

function loadFileConfig() {
  try {
    return require('../data/nkp-version-config.json');
  } catch {
    throw new Error(
      'Missing site/src/data/nkp-version-config.json — run `just _docs-prepare` or `just generate-catalog` (edit source/config.yaml, not hardcoded versions)',
    );
  }
}

const fileConfig = loadFileConfig();

if (!fileConfig.nkpVersionFloor || !fileConfig.maxGaNkpVersion) {
  throw new Error(
    'nkp-version-config.json missing nkpVersionFloor/maxGaNkpVersion — re-run sync from source/config.yaml',
  );
}

const ALL_NKP_VERSIONS = (
  Array.isArray(fileConfig.knownNkpVersions) && fileConfig.knownNkpVersions.length
    ? fileConfig.knownNkpVersions
    : []
).map(String);

if (!ALL_NKP_VERSIONS.length) {
  throw new Error(
    'nkp-version-config.json knownNkpVersions is empty — set applications.knownNkpVersions in source/config.yaml',
  );
}

// Assumed floor when metadata omits nkpVersionSupport (or leaves it empty).
// Unspecified apps are treated as NKP floor+ — not "any version".
const DEFAULT_NKP_FLOOR = String(fileConfig.nkpVersionFloor);

// Highest generally-available NKP major.minor shown in the catalog version filter.
// Pre-GA entries may still exist in .release/stable.yaml; bump maxGaNkpVersion in
// docs/source/config.yaml when a version GAs. Env overrides the file value.
const MAX_GA_NKP_VERSION =
  (typeof process !== 'undefined' && process.env && process.env.MAX_GA_NKP_VERSION) ||
  String(fileConfig.maxGaNkpVersion);

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

  // Upper-bound-only ("<2.17") still respects the global NKP floor as lower bound.
  if (!min && maxExclusive) {
    min = DEFAULT_NKP_FLOOR;
  }

  return {
    raw: text,
    min,
    maxExclusive,
    label: labelFor(min, maxExclusive),
  };
}

/** Oldest floor across version ranges, labeled `NKP {min}+` (listing cards). */
function cardRangeFromRanges(ranges) {
  const list = (ranges || []).filter(Boolean);
  if (!list.length) return parseNkpRange('');
  let min = '';
  for (const r of list) {
    min = pickMin(min, r.min || DEFAULT_NKP_FLOOR);
  }
  if (!min) min = DEFAULT_NKP_FLOOR;
  return {
    raw: '',
    min,
    maxExclusive: '',
    label: labelFor(min, ''),
  };
}

/** Union two NKP ranges (e.g. same chart version in 2.19 and 2.20 OCI). */
function unionNkpRanges(a, b) {
  if (!a && !b) return parseNkpRange('');
  if (!a) return b;
  if (!b) return a;
  const min = pickMin(a.min || DEFAULT_NKP_FLOOR, b.min || DEFAULT_NKP_FLOOR);
  let maxExclusive = '';
  if (a.maxExclusive && b.maxExclusive) {
    maxExclusive = pickMax(a.maxExclusive, b.maxExclusive);
  } else {
    // Either side open-ended → union is open-ended.
    maxExclusive = '';
  }
  return {
    raw: supportStringFromRange({min, maxExclusive}),
    min,
    maxExclusive,
    label: labelFor(min, maxExclusive),
  };
}

function supportStringFromRange(range) {
  if (!range) return '';
  const parts = [];
  if (range.min) parts.push(`>=${range.min}`);
  if (range.maxExclusive) parts.push(`<${range.maxExclusive}`);
  return parts.join(' ');
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
  cardRangeFromRanges,
  unionNkpRanges,
  matchesNkpVersion,
  gaNkpVersions,
};

module.exports = api;
module.exports.default = api;
