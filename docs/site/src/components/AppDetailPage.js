import React, { useMemo } from 'react';
import Link from '@docusaurus/Link';
import DOMPurify from 'isomorphic-dompurify';
import { marked } from 'marked';
import '../css/catalog.css';
import { categoryLabel, categoryTone, certTone, certLabel, certDescription, supportPanelKey, supportBadges, appLicenses, licenseDescription, NKP_LICENSE_OPTIONS_URL } from './categoryStyles';
import { AppIcon, Tag } from './catalogUi';
import nkpVersion from './nkpVersion';

const { parseNkpRange } = nkpVersion;

marked.setOptions({ gfm: true, breaks: false });

function renderMarkdown(md) {
  if (!md) return '';
  return DOMPurify.sanitize(marked.parse(md));
}

export default function AppDetailPage({ data }) {
  const range = data.nkpRange || parseNkpRange(data.nkpVersionSupport || '');
  const overviewHtml = useMemo(() => renderMarkdown(data.overview), [data.overview]);
  const readmeHtml = useMemo(() => renderMarkdown(data.readme), [data.readme]);
  const panel = supportPanelKey(data);
  const badges = supportBadges(data);

  return (
    <div className="cat-page">
      <div className="cat-page-back">
        <Link to="/docs/applications/">Back to catalog</Link>
      </div>

      <div className="cat-page-header">
        <AppIcon icon={data.icon} name={data.displayName} size={72} />
        <div className="cat-page-header-text">
          <div className="cat-page-version-row">
            <Tag tone="neutral">v{data.version}</Tag>
            <span className="cat-detail-catalog">{data.catalogName}</span>
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
                <Tag key={c} tone={categoryTone(c)}>{categoryLabel(c)}</Tag>
              ))}
            </div>
          </div>
        )}
        {data.scope?.length > 0 && (
          <div className="cat-detail-meta-item">
            <span className="cat-detail-meta-label">Scope</span>
            <div className="cat-detail-meta-value">
              {data.scope.map(s => <Tag key={s} tone="neutral">{s}</Tag>)}
            </div>
          </div>
        )}
        {appLicenses(data).length > 0 && (
          <div className="cat-detail-meta-item">
            <span className="cat-detail-meta-label">License</span>
            <div className="cat-detail-meta-value">
              {appLicenses(data).map(l => (
                <Tag
                  key={l}
                  tone="neutral"
                  tip={licenseDescription(l)}
                  href={NKP_LICENSE_OPTIONS_URL}
                >
                  {l}
                </Tag>
              ))}
            </div>
          </div>
        )}
        {badges.length > 0 && (
          <div className="cat-detail-meta-item">
            <span className="cat-detail-meta-label">Support status</span>
            <div className="cat-detail-meta-value">
              {badges.map(c => (
                <Tag key={c} tone={certTone(c)} tip={certDescription(c)}>{certLabel(c)}</Tag>
              ))}
            </div>
          </div>
        )}
        <div className="cat-detail-meta-item">
          <span className="cat-detail-meta-label">NKP version</span>
          <div className="cat-detail-meta-value">
            <Tag tone="info">{range.label}</Tag>
          </div>
        </div>
        {data.allVersions?.length > 0 && data.catalogRepo && (
          <div className="cat-detail-meta-item">
            <span className="cat-detail-meta-label">
              {data.allVersions.length > 1 ? 'All versions' : 'Version'}
            </span>
            <div className="cat-detail-meta-value">
              {data.allVersions.slice().reverse().map(v => {
                const isLatest = v === data.version;
                const href = `${data.catalogRepo}/tree/main/applications/${data.name}/${v}`;
                return (
                  <Tag
                    key={v}
                    tone={isLatest ? 'info' : 'neutral'}
                    href={href}
                    tip="Open this version on GitHub"
                  >
                    {v}
                  </Tag>
                );
              })}
            </div>
          </div>
        )}
        {(data.dependencies?.length > 0 || data.requiredDependencies?.length > 0) && (
          <div className="cat-detail-meta-item">
            <span className="cat-detail-meta-label">Dependencies</span>
            <div className="cat-detail-meta-value">
              {(data.requiredDependencies || []).map(d => (
                <Tag key={`req-${d}`} tone="warning">{`${d} (required)`}</Tag>
              ))}
              {(data.dependencies || []).map(d => (
                <Tag key={d} tone="neutral">{d}</Tag>
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
      </div>

      {data.overview && (
        <div className="cat-page-section" id="overview">
          <div
            className="cat-markdown"
            dangerouslySetInnerHTML={{ __html: overviewHtml }}
          />
        </div>
      )}

      {data.readme && (
        <div className="cat-page-section">
          <hr className="cat-page-divider" />
          <h2 className="cat-page-section-title" id="getting-started">Getting started</h2>
          <div
            className="cat-markdown"
            dangerouslySetInnerHTML={{ __html: readmeHtml }}
          />
        </div>
      )}
    </div>
  );
}
