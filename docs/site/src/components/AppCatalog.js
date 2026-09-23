import React, { useState, useMemo, useEffect, useCallback } from 'react';
import useBaseUrl from '@docusaurus/useBaseUrl';
import Link from '@docusaurus/Link';
import { useHistory, useLocation } from '@docusaurus/router';
import { categoryLabel, certTone, certLabel, certDescription, supportBadges, appHasCertFacet, supportStatusKeys } from './categoryStyles';
import { AppIcon, Tag } from './catalogUi';
import nkpVersion from './nkpVersion';
import NkpVersionSwitch from './NkpVersionSwitch';

const { matchesNkpVersion, DEFAULT_NKP_VERSIONS, DEFAULT_NKP_FLOOR, gaNkpVersions } = nkpVersion;

function isUserFacing(app) {
  return app.type !== 'internal';
}

function nkpLabel(app) {
  return (app.nkpCardRange && app.nkpCardRange.label)
    || (app.nkpRange && app.nkpRange.label)
    || `NKP ${DEFAULT_NKP_FLOOR}+`;
}

function appMatchesNkp(app, selected) {
  const entries = app.versionNkp;
  if (entries && entries.length) {
    return entries.some((e) => matchesNkpVersion(e.nkpRange, selected));
  }
  return matchesNkpVersion(app.nkpRange, selected);
}

function AppCard({ app, catalog }) {
  const href = useBaseUrl(`/docs/applications/${app.name}`);
  const rangeLabel = nkpLabel(app);
  return (
    <Link className="cat-card" to={href}>
      <div className="cat-card-header">
        <AppIcon icon={app.icon} name={app.displayName} />
        <div className="cat-card-title">
          <h3 className="cat-card-name">{app.displayName}</h3>
          <span className="cat-card-version">v{app.version}</span>
        </div>
      </div>
      <p className="cat-card-desc">{app.description}</p>
      <div className="cat-card-meta">
        <Tag tone="info">{rangeLabel}</Tag>
        {supportBadges(app).map(c => (
          <Tag key={c} tone={certTone(c)} tip={certDescription(c)}>{certLabel(c)}</Tag>
        ))}
      </div>
      <div className="cat-card-footer">
        <span className="cat-card-catalog">{catalog.name}</span>
        {app.allVersions.length > 1 && (
          <span className="cat-card-versions-count">
            {app.allVersions.length} versions
          </span>
        )}
      </div>
    </Link>
  );
}

function readFilters(search) {
  const p = new URLSearchParams(search);
  return {
    category: p.get('category') || 'all',
    nkp: p.get('nkp') || 'all',
    cert: p.get('cert') || 'all',
    q: p.get('q') || '',
  };
}

function filtersToSearch(filters) {
  const p = new URLSearchParams();
  if (filters.category && filters.category !== 'all') p.set('category', filters.category);
  if (filters.nkp && filters.nkp !== 'all') p.set('nkp', filters.nkp);
  if (filters.cert && filters.cert !== 'all') p.set('cert', filters.cert);
  if (filters.q) p.set('q', filters.q);
  const qs = p.toString();
  return qs ? `?${qs}` : '';
}

function appMatches(app, catalog, filters, except) {
  if (!isUserFacing(app)) return false;
  if (except !== 'category' && filters.category !== 'all' && !(app.category || []).includes(filters.category)) return false;
  if (except !== 'nkp' && !appMatchesNkp(app, filters.nkp)) return false;
  if (except !== 'cert' && filters.cert !== 'all' && !appHasCertFacet(app, filters.cert)) return false;
  if (except !== 'q' && filters.q) {
    const q = filters.q.toLowerCase();
    const hay = [
      app.displayName,
      app.description,
      app.name,
      ...(app.category || []),
    ].join(' ').toLowerCase();
    if (!hay.includes(q)) return false;
  }
  return true;
}

function FacetGroup({ title, options, preview = 6 }) {
  const extra = Math.max(0, options.length - preview);
  const [expanded, setExpanded] = useState(false);
  let visible = extra === 0 || expanded ? options : options.slice(0, preview);
  if (extra > 0 && !expanded) {
    const hiddenActive = options.slice(preview).find(option => option.active);
    if (hiddenActive) {
      visible = [...options.slice(0, Math.max(preview - 1, 1)), hiddenActive];
    }
  }
  return (
    <div className="cat-facet">
      <h3 className="cat-facet-title">{title}</h3>
      {visible.map(option => (
        <FacetOption
          key={option.key}
          label={option.label}
          count={option.count}
          active={option.active}
          onClick={option.onClick}
          tip={option.tip}
        />
      ))}
      {extra > 0 && (
        <button
          type="button"
          className="cat-facet-more"
          onClick={() => setExpanded(on => !on)}
        >
          {expanded ? 'Show less' : `Show ${extra} more`}
        </button>
      )}
    </div>
  );
}

function keysByCountThenLabel(counts, labelFn = k => k) {
  return Object.keys(counts).sort((a, b) => {
    const diff = (counts[b] || 0) - (counts[a] || 0);
    if (diff !== 0) return diff;
    return String(labelFn(a)).localeCompare(String(labelFn(b)));
  });
}

function FacetOption({ label, count, active, onClick, tip }) {
  return (
    <button
      type="button"
      className={`cat-facet-option ${active ? 'active' : ''}${tip ? ' cat-tip' : ''}`}
      data-tip={tip}
      aria-label={tip ? `${label}. ${tip}` : undefined}
      onClick={onClick}
    >
      <span className="cat-facet-option-label">{label}</span>
      <span className="cat-facet-option-count">{count}</span>
    </button>
  );
}

export default function AppCatalog() {
  const dataUrl = useBaseUrl('/catalog-data.json');
  const history = useHistory();
  const location = useLocation();
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState(() => readFilters(location.search));
  const [searchQuery, setSearchQuery] = useState(() => readFilters(location.search).q);

  useEffect(() => {
    fetch(dataUrl)
      .then(r => {
        if (!r.ok) throw new Error(`${r.status} ${r.statusText}`);
        return r.json();
      })
      .then(setData)
      .catch(e => {
        console.error(
          'Failed to load catalog data. Regenerate it with "just generate-catalog" from docs/ before rebuilding.',
          e,
        );
        setError(true);
      });
  }, [dataUrl]);

  useEffect(() => {
    const next = readFilters(location.search);
    setFilters(next);
    setSearchQuery(next.q);
  }, [location.search]);

  const effectiveFilters = useMemo(
    () => ({ ...filters, q: searchQuery }),
    [filters, searchQuery],
  );

  const updateFilters = useCallback((patch) => {
    const next = { ...effectiveFilters, ...patch };
    const search = filtersToSearch(next);
    const target = `${location.pathname}${search}`;
    const current = `${location.pathname}${location.search}`;
    if (target !== current) history.replace(target);
  }, [effectiveFilters, history, location.pathname, location.search]);

  useEffect(() => {
    const locationFilters = readFilters(location.search);
    if (searchQuery === locationFilters.q) return undefined;

    const timeout = setTimeout(() => {
      const search = filtersToSearch({ ...locationFilters, q: searchQuery });
      const target = `${location.pathname}${search}`;
      const current = `${location.pathname}${location.search}`;
      if (target !== current) history.replace(target);
    }, 300);

    return () => clearTimeout(timeout);
  }, [history, location.pathname, location.search, searchQuery]);

  const nkpVersions = gaNkpVersions((data && data.nkpVersions) || DEFAULT_NKP_VERSIONS);

  const nkpSwitchOptions = useMemo(
    () =>
      [...nkpVersions]
        .slice()
        .reverse()
        .map((v) => ({id: v, label: v})),
    [nkpVersions],
  );

  const cataloged = useMemo(() => {
    if (!data) return [];
    const rows = [];
    for (const catalog of data.catalogs) {
      for (const app of catalog.apps) {
        rows.push({ app, catalog });
      }
    }
    return rows;
  }, [data]);

  const filtered = useMemo(
    () => cataloged.filter(({ app, catalog }) => appMatches(app, catalog, effectiveFilters)),
    [cataloged, effectiveFilters],
  );

  const facetCounts = useMemo(() => {
    const categories = {};
    const certs = {};
    let allForCert = 0;
    let allForCategory = 0;
    for (const { app, catalog } of cataloged) {
      if (appMatches(app, catalog, effectiveFilters, 'category')) {
        allForCategory += 1;
        for (const c of app.category || []) {
          categories[c] = (categories[c] || 0) + 1;
        }
      }
      if (appMatches(app, catalog, effectiveFilters, 'cert')) {
        allForCert += 1;
        for (const c of supportBadges(app)) {
          certs[c] = (certs[c] || 0) + 1;
        }
      }
    }
    return {
      categories,
      certs,
      allForCert,
      allForCategory,
    };
  }, [cataloged, effectiveFilters]);

  const resetFilters = () => {
    setSearchQuery('');
    updateFilters({
      category: 'all',
      nkp: 'all',
      cert: 'all',
      q: '',
    });
  };

  if (error) {
    return (
      <div className="cat-error">
        <h3>Failed to load catalog data</h3>
        <p>Catalog data is unavailable. Try again later.</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="cat-loading">
        <div className="cat-spinner" />
        <p>Loading catalog data&hellip;</p>
      </div>
    );
  }

  const publicTotal = cataloged.filter(({ app }) => isUserFacing(app)).length;

  const facetRail = (
    <aside className="cat-facets" aria-label="Catalog filters">
      {Object.keys(facetCounts.certs).length > 0 && (
        <FacetGroup
          title="Support status"
          options={[
            {
              key: 'all',
              label: 'All',
              count: facetCounts.allForCert,
              active: effectiveFilters.cert === 'all',
              onClick: () => updateFilters({ cert: 'all' }),
            },
            ...supportStatusKeys(facetCounts.certs).map(c => ({
              key: c,
              label: certLabel(c),
              count: facetCounts.certs[c],
              active: effectiveFilters.cert === c,
              onClick: () => updateFilters({ cert: c }),
              tip: certDescription(c),
            })),
          ]}
        />
      )}

      <FacetGroup
        title="Category"
        options={[
          {
            key: 'all',
            label: 'All',
            count: facetCounts.allForCategory,
            active: effectiveFilters.category === 'all',
            onClick: () => updateFilters({ category: 'all' }),
          },
          ...keysByCountThenLabel(facetCounts.categories, categoryLabel).map(c => ({
            key: c,
            label: categoryLabel(c),
            count: facetCounts.categories[c],
            active: effectiveFilters.category === c,
            onClick: () => updateFilters({ category: c }),
          })),
        ]}
      />
    </aside>
  );

  return (
    <div className="cat-layout">
      {facetRail}
      <div className="cat-main">
        <div className="nkp-page-header nkp-page-header--end">
          <NkpVersionSwitch
            value={effectiveFilters.nkp}
            onChange={(nkp) => updateFilters({nkp})}
            options={nkpSwitchOptions}
            includeAll
            ariaLabel="NKP version"
          />
        </div>
        <div className="cat-toolbar">
          <div className="cat-search-wrap">
            <svg className="cat-search-icon" viewBox="0 0 20 20" fill="currentColor" width="18" height="18" aria-hidden="true">
              <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
            </svg>
            <input
              className="cat-search"
              type="search"
              placeholder="Search applications"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              aria-label="Search applications"
            />
          </div>
          <div className="cat-stats">
            <span className="cat-stats-count">{filtered.length}</span>
            {' '}of {publicTotal} applications
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="cat-empty">
            <p>No applications match these filters.</p>
            <button type="button" className="cat-empty-reset" onClick={resetFilters}>
              Reset filters
            </button>
          </div>
        ) : (
          <div className="cat-grid">
            {filtered.map(({ app, catalog }) => (
              <AppCard
                key={`${catalog.id}/${app.name}`}
                app={app}
                catalog={catalog}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
