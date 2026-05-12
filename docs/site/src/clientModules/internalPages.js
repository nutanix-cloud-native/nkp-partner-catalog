/**
 * Client module that hides pages marked with data-internal="true" unless
 * the URL contains ?internal=true (or &internal=true).
 *
 * Pages opt in by adding `internal: true` to their frontmatter.
 * The theme wrapper (swizzled DocItem or a simple MDX guard) adds the
 * data attribute. As a fallback this module hides sidebar links whose
 * href contains "/end-to-end-workflow" (and any future internal slugs)
 * unless the flag is present.
 */
import ExecutionEnvironment from '@docusaurus/ExecutionEnvironment';

const INTERNAL_SLUGS = ['/end-to-end-workflow'];

function isInternalMode() {
  if (!ExecutionEnvironment.canUseDOM) return false;
  const params = new URLSearchParams(window.location.search);
  return params.get('internal') === 'true';
}

function hideInternalItems() {
  if (!ExecutionEnvironment.canUseDOM) return;
  if (isInternalMode()) return;

  INTERNAL_SLUGS.forEach((slug) => {
    document.querySelectorAll(`a[href*="${slug}"]`).forEach((link) => {
      const li = link.closest('li');
      if (li) li.style.display = 'none';
    });
  });

  document.querySelectorAll('[data-internal="true"]').forEach((el) => {
    el.style.display = 'none';
  });
}

export function onRouteDidUpdate() {
  if (!ExecutionEnvironment.canUseDOM) return;
  setTimeout(hideInternalItems, 50);
  setTimeout(hideInternalItems, 300);
}

if (ExecutionEnvironment.canUseDOM) {
  hideInternalItems();
  setTimeout(hideInternalItems, 500);
}
