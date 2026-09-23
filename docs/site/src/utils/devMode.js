'use strict';

const STORAGE_KEY = 'nkp-docs-dev';

function readParam(search) {
  const params = new URLSearchParams(search || '');
  const dev = params.get('dev');
  const unlisted = params.get('unlisted');
  if (dev === 'true' || unlisted === 'true') return true;
  if (dev === 'false' || unlisted === 'false') return false;
  return null;
}

/** Sync ?dev= / ?unlisted= into sessionStorage. Call on navigation. */
function syncDevModeFromSearch(search) {
  if (typeof window === 'undefined') return;
  const flagged = readParam(search);
  if (flagged === true) {
    window.sessionStorage.setItem(STORAGE_KEY, '1');
  } else if (flagged === false) {
    window.sessionStorage.removeItem(STORAGE_KEY);
  }
}

function isDevMode(search) {
  if (typeof window === 'undefined') return false;
  const flagged = readParam(search ?? window.location.search);
  if (flagged === true) return true;
  if (flagged === false) return false;
  try {
    return window.sessionStorage.getItem(STORAGE_KEY) === '1';
  } catch {
    return false;
  }
}

function isDevSidebarItem(item) {
  return !!(item && item.customProps && item.customProps.dev);
}

/** Drop sidebar items marked customProps.dev (caller skips when dev mode on). */
function filterDevSidebarItems(items) {
  if (!items || !items.length) return items || [];
  return items
    .map((item) => {
      if (item.type === 'category') {
        const nested = filterDevSidebarItems(item.items || []);
        if (!nested.length && !item.link) return null;
        if (isDevSidebarItem(item) && !nested.length) return null;
        return {...item, items: nested};
      }
      if (isDevSidebarItem(item)) return null;
      return item;
    })
    .filter(Boolean);
}

function isDevDocFrontMatter(frontMatter) {
  if (!frontMatter) return false;
  if (frontMatter.dev === true) return true;
  const props = frontMatter.sidebar_custom_props;
  return !!(props && props.dev);
}

module.exports = {
  STORAGE_KEY,
  syncDevModeFromSearch,
  isDevMode,
  filterDevSidebarItems,
  isDevDocFrontMatter,
};
