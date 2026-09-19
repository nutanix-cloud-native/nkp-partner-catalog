import React from 'react';
import Link from '@docusaurus/Link';

function hrefFor(minor, id) {
  if (!id || id === 'nkp') return `/docs/cli/${minor}/`;
  return `/docs/cli/${minor}/${id}`;
}

function crumbId(segments, index) {
  if (index === 0) return segments[0] === 'nkp' ? 'nkp' : segments[0];
  return segments.slice(0, index + 1).join('_');
}

/**
 * Clickable crumbs: nkp › create › cluster › nutanix
 * Ancestors link to their pages; current segment is plain text.
 */
export default function CliBreadcrumbs({minor, segments}) {
  const segs = Array.isArray(segments) ? segments.filter(Boolean) : [];
  if (segs.length <= 1) return null;

  return (
    <nav className="cli-breadcrumbs" aria-label="Command path">
      <ol>
        {segs.map((label, index) => {
          const id = crumbId(segs, index);
          const isLast = index === segs.length - 1;
          return (
            <li key={`${id}-${index}`}>
              {index > 0 ? (
                <span className="cli-breadcrumbs__sep" aria-hidden="true">
                  ›
                </span>
              ) : null}
              {isLast ? (
                <span aria-current="page">{label}</span>
              ) : (
                <Link to={hrefFor(minor, id)}>{label}</Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
