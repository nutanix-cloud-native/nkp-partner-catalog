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

function HomeIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="cli-breadcrumb-home"
      width="1.125rem"
      height="1.125rem"
      aria-hidden="true"
    >
      <path
        d="M10 19v-5h4v5c0 .55.45 1 1 1h3c.55 0 1-.45 1-1v-7h1.7c.46 0 .68-.57.33-.87L12.67 3.6c-.38-.34-.96-.34-1.34 0l-8.36 7.53c-.34.3-.13.87.33.87H5v7c0 .55.45 1 1 1h3c.55 0 1-.45 1-1z"
        fill="currentColor"
      />
    </svg>
  );
}

function Sep() {
  return (
    <span className="cli-breadcrumbs__sep" aria-hidden="true">
      ›
    </span>
  );
}

/**
 * Flat trail matching docs chrome: Home › CLI › nkp › create › …
 * Explicit separators (no Infima pill / ::after hacks).
 */
export default function CliBreadcrumbs({minor, segments}) {
  const segs = Array.isArray(segments) ? segments.filter(Boolean) : [];

  return (
    <nav className="cli-breadcrumbs" aria-label="Breadcrumbs">
      <ol>
        <li>
          <Link to="/" className="cli-breadcrumbs__home" aria-label="Home page">
            <HomeIcon />
          </Link>
        </li>
        <li>
          <Sep />
          {segs.length === 0 ? (
            <span className="cli-breadcrumbs__current">CLI</span>
          ) : (
            <Link to="/docs/cli/">CLI</Link>
          )}
        </li>
        {segs.map((label, index) => {
          const id = crumbId(segs, index);
          const isLast = index === segs.length - 1;
          return (
            <li key={`${id}-${index}`}>
              <Sep />
              {isLast ? (
                <span className="cli-breadcrumbs__current" aria-current="page">
                  {label}
                </span>
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
