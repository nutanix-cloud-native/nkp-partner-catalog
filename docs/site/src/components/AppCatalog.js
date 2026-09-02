import React, { useState, useMemo, useEffect } from 'react';
import useBaseUrl from '@docusaurus/useBaseUrl';
import Link from '@docusaurus/Link';
import '../css/catalog.css';

const CATEGORY_COLORS = {
  'artificial-intelligence': '#7855FA',
  'ai-ml': '#7855FA',
  'networking': '#024DA1',
  'api-gateway': '#024DA1',
  'application-and-data-management': '#22A06B',
  'observability': '#E56910',
  'security': '#E34935',
  'storage': '#0065FF',
  'compute': '#00B8D9',
  'gpu': '#5243AA',
  'ml-infrastructure': '#5243AA',
};


function categoryColor(cat) {
  return CATEGORY_COLORS[cat] || '#6B778C';
}

function categoryLabel(cat) {
  return cat
    .split('-')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

function AppIcon({ icon, name, size = 48 }) {
  if (!icon) {
    return (
      <div className="cat-icon-placeholder" style={{ width: size, height: size }}>
        {name.charAt(0).toUpperCase()}
      </div>
    );
  }
  return (
    <img
      className="cat-icon-img"
      src={`data:image/svg+xml;base64,${icon}`}
      alt={name}
      width={size}
      height={size}
      onError={(e) => {
        e.target.style.display = 'none';
      }}
    />
  );
}

function Badge({ label, color, outline }) {
  const style = outline
    ? { color, borderColor: color, background: 'transparent' }
    : { background: color, color: '#fff' };
  return (
    <span className={`cat-badge ${outline ? 'cat-badge--outline' : ''}`} style={style}>
      {label}
    </span>
  );
}

function AppCard({ app, catalog }) {
  const href = useBaseUrl(`/docs/applications/${catalog.slug}/${app.name}`);
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
        <div className="cat-card-categories">
          {app.category.map(c => (
            <Badge key={c} label={categoryLabel(c)} color={categoryColor(c)} />
          ))}
        </div>
      </div>
      <div className="cat-card-footer">
        <span className="cat-card-catalog" style={{ color: catalog.color }}>
          {catalog.name}
        </span>
        {app.allVersions.length > 1 && (
          <span className="cat-card-versions-count">
            {app.allVersions.length} versions
          </span>
        )}
      </div>
    </Link>
  );
}

export default function AppCatalog() {
  const dataUrl = useBaseUrl('/catalog-data.json');
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [activeCatalog, setActiveCatalog] = useState('all');
  const [activeCategory, setActiveCategory] = useState('all');

  useEffect(() => {
    fetch(dataUrl)
      .then(r => {
        if (!r.ok) throw new Error(`${r.status} ${r.statusText}`);
        return r.json();
      })
      .then(setData)
      .catch(e => setError(e.message));
  }, [dataUrl]);

  const allCategories = useMemo(() => {
    if (!data) return [];
    const set = new Set();
    for (const c of data.catalogs) {
      for (const a of c.apps) {
        a.category.forEach(cat => set.add(cat));
      }
    }
    return [...set].sort();
  }, [data]);

  const filtered = useMemo(() => {
    if (!data) return [];
    const q = search.toLowerCase();
    const results = [];
    for (const catalog of data.catalogs) {
      if (activeCatalog !== 'all' && catalog.id !== activeCatalog) continue;
      for (const app of catalog.apps) {
        if (activeCategory !== 'all' && !app.category.includes(activeCategory)) continue;
        if (
          q &&
          !app.displayName.toLowerCase().includes(q) &&
          !app.description.toLowerCase().includes(q) &&
          !app.name.toLowerCase().includes(q) &&
          !app.category.some(c => c.toLowerCase().includes(q))
        ) {
          continue;
        }
        results.push({ app, catalog });
      }
    }
    return results;
  }, [data, search, activeCatalog, activeCategory]);

  if (error) {
    return (
      <div className="cat-error">
        <h3>Failed to load catalog data</h3>
        <p>{error}</p>
        <p>
          Run <code>just generate-catalog</code> from the <code>docs/</code> directory, then
          rebuild the site.
        </p>
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

  return (
    <div className="cat-container">
      <div className="cat-topbar">
        <div className="cat-stats">
          <span className="cat-stats-count">{data.totalApps}</span> applications across{' '}
          <span className="cat-stats-count">{data.catalogs.length}</span> catalogs
        </div>
        <div className="cat-generated">
          Generated {new Date(data.generatedAt).toLocaleDateString()}
        </div>
      </div>

      <div className="cat-controls">
        <div className="cat-search-wrap">
          <svg className="cat-search-icon" viewBox="0 0 20 20" fill="currentColor" width="18" height="18">
            <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
          </svg>
          <input
            className="cat-search"
            type="text"
            placeholder="Search applications..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          {search && (
            <button className="cat-search-clear" onClick={() => setSearch('')} type="button">
              &times;
            </button>
          )}
        </div>

        <div className="cat-tabs">
          <button
            className={`cat-tab ${activeCatalog === 'all' ? 'active' : ''}`}
            onClick={() => setActiveCatalog('all')}
            type="button"
          >
            All
          </button>
          {data.catalogs.map(c => (
            <button
              key={c.id}
              className={`cat-tab ${activeCatalog === c.id ? 'active' : ''}`}
              onClick={() => setActiveCatalog(c.id)}
              style={activeCatalog === c.id ? { borderColor: c.color, color: c.color } : {}}
              type="button"
            >
              {c.name}
              <span className="cat-tab-count">{c.appCount}</span>
            </button>
          ))}
        </div>

        {allCategories.length > 0 && (
          <div className="cat-category-bar">
            <button
              className={`cat-category-pill ${activeCategory === 'all' ? 'active' : ''}`}
              onClick={() => setActiveCategory('all')}
              type="button"
            >
              All categories
            </button>
            {allCategories.map(c => (
              <button
                key={c}
                className={`cat-category-pill ${activeCategory === c ? 'active' : ''}`}
                onClick={() => setActiveCategory(c)}
                style={activeCategory === c ? { background: categoryColor(c), color: '#fff' } : {}}
                type="button"
              >
                {categoryLabel(c)}
              </button>
            ))}
          </div>
        )}
      </div>

      {filtered.length === 0 ? (
        <div className="cat-empty">
          <p>No applications match your filters.</p>
          <button
            type="button"
            className="cat-empty-reset"
            onClick={() => {
              setSearch('');
              setActiveCatalog('all');
              setActiveCategory('all');
            }}
          >
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
  );
}
