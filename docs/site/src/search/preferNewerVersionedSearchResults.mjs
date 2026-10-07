/**
 * Local search indexes versioned pages (e.g. /cli/2.12/..., /ai-conformance/2.18)
 * from oldest minor to newest. Equal-scoring copies of the same page therefore
 * show older versions first. Group those copies by unversioned path and list
 * the newest major.minor first, while leaving other pages in relevance order.
 */

// A path segment that looks like an NKP/docs minor version: /2.18 or /2.18/...
const PATH_VERSION = /\/(\d+)\.(\d+)(?=\/|$)/;

function pathVersion(url) {
  const match = String(url || '').match(PATH_VERSION);
  if (!match) return null;
  return [Number(match[1]), Number(match[2])];
}

function versionGroup(url) {
  // Collapse any major.minor path segment so copies of the same page group together.
  return String(url || '').replace(PATH_VERSION, '/@v');
}

function compareVersionDesc(a, b) {
  if (a[0] !== b[0]) return b[0] - a[0];
  return b[1] - a[1];
}

export function preferNewerVersionedSearchResults(results, limit) {
  const rows = results.map((item, index) => {
    const url = item?.document?.u || '';
    const version = pathVersion(url);
    return {
      item,
      index,
      version,
      group: version ? versionGroup(url) : `row:${index}`,
      score: item?.score ?? 0,
    };
  });

  const groups = new Map();
  for (const row of rows) {
    let group = groups.get(row.group);
    if (!group) {
      group = {rows: [], score: -Infinity, anchor: Infinity};
      groups.set(row.group, group);
    }
    group.rows.push(row);
    if (row.score > group.score) group.score = row.score;
    if (row.index < group.anchor) group.anchor = row.index;
  }

  const ordered = [];
  for (const group of [...groups.values()].sort((a, b) => {
    if (a.score !== b.score) return b.score - a.score;
    return a.anchor - b.anchor;
  })) {
    group.rows.sort((a, b) => {
      if (a.version && b.version) {
        const byVersion = compareVersionDesc(a.version, b.version);
        if (byVersion !== 0) return byVersion;
      }
      return a.index - b.index;
    });
    for (const row of group.rows) ordered.push(row.item);
  }

  return typeof limit === 'number' ? ordered.slice(0, limit) : ordered;
}

/**
 * The search plugin fills its result cap from the title index first, so a
 * page that exists in every version crowds out newer copies. Gather a wider
 * set, then keep that title-first behavior after newest-version ordering.
 */
export function presentVersionedSearchResults(results, limit) {
  const cap = Number.isFinite(limit) ? limit : results.length;
  const titles = preferNewerVersionedSearchResults(
    results.filter((item) => item.type === 0),
  );
  if (titles.length >= cap) {
    return titles.slice(0, cap);
  }

  const extras = preferNewerVersionedSearchResults(
    results.filter((item) => item.type !== 0),
  );
  const titleIds = new Set(titles.map((item) => item.document.i));
  const extrasByParent = new Map();
  const orphans = [];
  for (const item of extras) {
    const parentId = item.page && item.page.i;
    if (parentId != null && titleIds.has(parentId)) {
      const list = extrasByParent.get(parentId);
      if (list) list.push(item);
      else extrasByParent.set(parentId, [item]);
    } else {
      orphans.push(item);
    }
  }

  const merged = [];
  for (const title of titles) {
    merged.push(title);
    const children = extrasByParent.get(title.document.i);
    if (children) merged.push(...children);
  }
  merged.push(...orphans);
  return merged.slice(0, cap);
}
