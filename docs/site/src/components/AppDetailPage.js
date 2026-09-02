import React from 'react';
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
  return cat.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
}

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/<[^>]+>/g, '')
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

function renderMarkdown(md) {
  if (!md) return '';
  let html = md
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
  html = html.replace(/```[\w]*\n([\s\S]*?)```/g, '<pre class="cat-code-block">$1</pre>');
  html = html.replace(/`([^`]+)`/g, '<code class="cat-inline-code">$1</code>');
  html = html.replace(/^#### (.+)$/gm, (_, t) => `<h4 id="${slugify(t)}">${t}</h4>`);
  html = html.replace(/^### (.+)$/gm, (_, t) => `<h3 id="${slugify(t)}">${t}</h3>`);
  html = html.replace(/^## (.+)$/gm, (_, t) => `<h2 id="${slugify(t)}">${t}</h2>`);
  html = html.replace(/^# (.+)$/gm, (_, t) => `<h1 id="${slugify(t)}">${t}</h1>`);
  html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/(?<!\*)\*([^*]+)\*(?!\*)/g, '<em>$1</em>');
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_, text, url) => {
    if (/^https?:\/\//.test(url)) {
      return `<a href="${url}" target="_blank" rel="noopener noreferrer">${text}</a>`;
    }
    return `<a href="${url}">${text}</a>`;
  });
  html = html.replace(/^- (.+)$/gm, '<li>$1</li>');
  html = html.replace(/(<li>[\s\S]*?<\/li>)/g, '<ul>$1</ul>');
  html = html.replace(/<\/ul>\s*<ul>/g, '');
  html = html.replace(/^\|(.+)\|$/gm, (_, row) => {
    const cells = row.split('|').map(c => c.trim());
    return '<tr>' + cells.map(c => `<td>${c}</td>`).join('') + '</tr>';
  });
  html = html.replace(/(<tr>[\s\S]*?<\/tr>)/g, '<table class="cat-table">$1</table>');
  html = html.replace(/<\/table>\s*<table class="cat-table">/g, '');
  html = html.replace(/<tr><td>\s*-+\s*<\/td>.*?<\/tr>/g, '');
  html = html.replace(/\n{2,}/g, '</p><p>');
  html = `<p>${html}</p>`;
  html = html.replace(/<p>\s*<(h[1-4]|pre|ul|table)/g, '<$1');
  html = html.replace(/<\/(h[1-4]|pre|ul|table)>\s*<\/p>/g, '</$1>');
  return html;
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

function AppIcon({ icon, name, size = 64 }) {
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
    />
  );
}

export default function AppDetailPage({ data }) {
  return (
    <div className="cat-page">
      <div className="cat-page-back">
        <Link to="/docs/applications/">&larr; Back to catalog</Link>
      </div>

      <div className="cat-page-header">
        <AppIcon icon={data.icon} name={data.displayName} size={72} />
        <div className="cat-page-header-text">
          <div className="cat-page-version-row">
            <Badge label={`v${data.version}`} color="#172B4D" />
            <span className="cat-detail-catalog" style={{ color: data.catalogColor }}>
              {data.catalogName}
            </span>
            {data.type && data.type !== 'custom' && (
              <Badge label={data.type.replace(/-/g, ' ')} color="#6B778C" outline />
            )}
          </div>
        </div>
      </div>

      <p className="cat-page-desc">{data.description}</p>

      <div className="cat-detail-meta-grid">
        {data.category?.length > 0 && (
          <div className="cat-detail-meta-item">
            <span className="cat-detail-meta-label">Category</span>
            <div className="cat-detail-meta-value">
              {data.category.map(c => (
                <Badge key={c} label={categoryLabel(c)} color={categoryColor(c)} />
              ))}
            </div>
          </div>
        )}
        {data.scope?.length > 0 && (
          <div className="cat-detail-meta-item">
            <span className="cat-detail-meta-label">Scope</span>
            <div className="cat-detail-meta-value">
              {data.scope.map(s => <Badge key={s} label={s} color="#6B778C" outline />)}
            </div>
          </div>
        )}
        {data.allVersions?.length > 1 && (
          <div className="cat-detail-meta-item">
            <span className="cat-detail-meta-label">All versions</span>
            <div className="cat-detail-meta-value">
              {data.allVersions.slice().reverse().map(v => (
                <Badge
                  key={v}
                  label={v}
                  color={v === data.version ? '#172B4D' : '#DFE1E6'}
                  outline={v !== data.version}
                />
              ))}
            </div>
          </div>
        )}
        {(data.dependencies?.length > 0 || data.requiredDependencies?.length > 0) && (
          <div className="cat-detail-meta-item">
            <span className="cat-detail-meta-label">Dependencies</span>
            <div className="cat-detail-meta-value">
              {(data.requiredDependencies || []).map(d => (
                <Badge key={d} label={`${d} (required)`} color="#E34935" outline />
              ))}
              {(data.dependencies || []).map(d => (
                <Badge key={d} label={d} color="#6B778C" outline />
              ))}
            </div>
          </div>
        )}
        {data.supportLink && (
          <div className="cat-detail-meta-item">
            <span className="cat-detail-meta-label">Support</span>
            <div className="cat-detail-meta-value">
              <a href={data.supportLink} target="_blank" rel="noopener noreferrer">
                {data.supportLink}
              </a>
            </div>
          </div>
        )}
        {data.nkpVersionSupport && (
          <div className="cat-detail-meta-item">
            <span className="cat-detail-meta-label">NKP version</span>
            <div className="cat-detail-meta-value">
              <code>{data.nkpVersionSupport}</code>
            </div>
          </div>
        )}
        {data.certifications?.length > 0 && (
          <div className="cat-detail-meta-item">
            <span className="cat-detail-meta-label">Certifications</span>
            <div className="cat-detail-meta-value">
              {data.certifications.map(c => (
                <Badge key={c} label={categoryLabel(c)} color="#22A06B" outline />
              ))}
            </div>
          </div>
        )}
        {data.catalogRepo && (
          <div className="cat-detail-meta-item">
            <span className="cat-detail-meta-label">Source</span>
            <div className="cat-detail-meta-value">
              <a href={`${data.catalogRepo}/tree/main/applications/${data.name}`} target="_blank" rel="noopener noreferrer">
                {`${data.catalogRepo.replace('https://github.com/', '')}/applications/${data.name}`}
              </a>
            </div>
          </div>
        )}
      </div>

      {data.overview && (
        <div className="cat-page-section" id="overview">
          <div
            className="cat-markdown"
            dangerouslySetInnerHTML={{ __html: renderMarkdown(data.overview) }}
          />
        </div>
      )}

      {data.readme && (
        <div className="cat-page-section">
          <hr className="cat-page-divider" />
          <h2 className="cat-page-section-title" id="getting-started">Getting Started</h2>
          <div
            className="cat-markdown"
            dangerouslySetInnerHTML={{ __html: renderMarkdown(data.readme) }}
          />
        </div>
      )}
    </div>
  );
}
