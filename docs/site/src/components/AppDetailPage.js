import React, { useMemo, useState, useCallback, useEffect } from 'react';
import Link from '@docusaurus/Link';
import DOMPurify from 'isomorphic-dompurify';
import { marked } from 'marked';
import { categoryLabel, categoryTone, scopeLabel, certTone, certLabel, certDescription, supportBadges, appLicenses, licenseDescription, NKP_LICENSE_OPTIONS_URL, isPreferredPartnerApp, isCorePlatformApp, corePlatformLabel, corePlatformDescription, corePlatformTone } from './categoryStyles';
import { AppIcon, Tag } from './catalogUi';
import nkpVersion from './nkpVersion';
import YamlCodePanel from './YamlCodePanel';
import AirgappedBundleModal, { buildAirgappedVars } from './AirgappedBundleModal';

const { parseNkpRange } = nkpVersion;

marked.setOptions({ gfm: true, breaks: false });

const markdownLinkRenderer = {
  link({href, title, text}) {
    const url = href || '';
    const titleAttr = title ? ` title="${title}"` : '';
    const external = /^(https?:|mailto:|\/\/)/i.test(url);
    const target = external
      ? ' target="_blank" rel="noopener noreferrer"'
      : '';
    return `<a href="${url}"${titleAttr}${target}>${text}</a>`;
  },
};
marked.use({renderer: markdownLinkRenderer});

function renderMarkdown(md) {
  if (!md) return '';
  // Keep target/rel so overview & getting-started links can open externally.
  return DOMPurify.sanitize(marked.parse(md), {
    ADD_ATTR: ['target'],
  });
}

export default function AppDetailPage({ data }) {
  const [selectedVersion, setSelectedVersion] = useState(data.version);
  const [airgapOpen, setAirgapOpen] = useState(false);
  const closeAirgap = useCallback(() => setAirgapOpen(false), []);
  const knownApps = useMemo(
    () => new Set(data.catalogAppNames || []),
    [data.catalogAppNames],
  );
  const range = useMemo(() => {
    const hit = (data.versionNkp || []).find((e) => e.version === selectedVersion);
    if (hit && hit.nkpRange) return hit.nkpRange;
    if (selectedVersion === data.version && data.nkpRange) return data.nkpRange;
    return parseNkpRange((hit && hit.nkpVersionSupport) || data.nkpVersionSupport || '');
  }, [data, selectedVersion]);
  const overviewHtml = useMemo(() => renderMarkdown(data.overview), [data.overview]);
  const readmeHtml = useMemo(() => renderMarkdown(data.readme), [data.readme]);
  const badges = supportBadges(data).filter((c) => c !== 'preferred-partner');
  const githubHref = useMemo(() => {
    const hit = (data.versionNkp || []).find((e) => e.version === selectedVersion);
    // Per-version source only — do not fall back to top-level catalogRepo
    // (OCI rows intentionally leave catalogRepo empty; fallback would wrongly
    // reuse a sibling git repo URL from another NKP minor).
    if (hit && (hit.kind === 'oci' || hit.sourceKind === 'oci')) return '';
    const repo = hit ? (hit.catalogRepo || '') : (data.catalogRepo || '');
    if (!repo || !/^https?:\/\/(www\.)?github\.com\//i.test(repo)) return '';
    const ref = (hit && hit.ref) || 'main';
    const appsPath = (hit && hit.applicationsPath) || 'applications';
    return `${repo}/tree/${ref}/${appsPath}/${data.name}/${selectedVersion}`;
  }, [data, selectedVersion]);

  const showConfigDefaults = !!data.configDefaults;
  const showAirgappedBundle = !!data.airgappedBundle;
  const defaultValuesPanels = useMemo(() => {
    if (!showConfigDefaults) return [];
    const hit = (data.versionNkp || []).find((e) => e.version === selectedVersion);
    const panels =
      (hit && Array.isArray(hit.defaultValuesPanels) && hit.defaultValuesPanels) ||
      (selectedVersion === data.version &&
        Array.isArray(data.defaultValuesPanels) &&
        data.defaultValuesPanels) ||
      [];
    if (panels.length) {
      return panels.filter((p) => p && String(p.valuesYaml || '').trim());
    }
    // Legacy single-string payloads
    let yaml = '';
    if (hit && hit.defaultValuesYaml != null) yaml = String(hit.defaultValuesYaml);
    else if (selectedVersion === data.version && data.defaultValuesYaml != null) {
      yaml = String(data.defaultValuesYaml);
    }
    if (!yaml.trim()) return [];
    return [
      {
        name: data.name,
        primary: true,
        valuesYaml: yaml,
        overrideConfigMaps: [],
      },
    ];
  }, [data, selectedVersion, showConfigDefaults]);

  const [valuesTab, setValuesTab] = useState(0);
  const activeValuesPanel =
    defaultValuesPanels[
      Math.min(valuesTab, Math.max(defaultValuesPanels.length - 1, 0))
    ] || null;

  useEffect(() => {
    setValuesTab(0);
  }, [selectedVersion, data.name]);

  const airgapVars = useMemo(
    () =>
      buildAirgappedVars({
        name: data.name,
        version: selectedVersion,
        displayName: data.displayName,
        catalogRepo: data.catalogRepo,
        catalogId: data.catalogId || data.catalogSlug,
      }),
    [data, selectedVersion],
  );

  function depTag(name, required) {
    const label = required ? `${name} (required)` : name;
    const to = knownApps.has(name) ? `/docs/applications/${name}` : undefined;
    return (
      <Tag key={`${required ? 'req' : 'dep'}-${name}`} tone={required ? 'warning' : 'neutral'} to={to}>
        {label}
      </Tag>
    );
  }

  return (
    <div className="cat-page">
      <div className="cat-page-back">
        <Link to="/docs/applications/">Back to catalog</Link>
      </div>

      <div className="cat-page-header">
        <AppIcon icon={data.icon} name={data.displayName} size={72} />
        <div className="cat-page-header-text">
          <div className="cat-page-version-row">
            <Tag tone="neutral">v{selectedVersion}</Tag>
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
              {[...data.category]
                .sort((a, b) =>
                  String(categoryLabel(a)).localeCompare(String(categoryLabel(b))),
                )
                .map(c => (
                <Tag key={c} tone={categoryTone(c)}>{categoryLabel(c)}</Tag>
              ))}
            </div>
          </div>
        )}
        {data.scope?.length > 0 && (
          <div className="cat-detail-meta-item">
            <span className="cat-detail-meta-label">Scope</span>
            <div className="cat-detail-meta-value">
              {data.scope.map((s) => (
                <Tag key={s} tone="neutral">{scopeLabel(s)}</Tag>
              ))}
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
        {isPreferredPartnerApp(data) && (
          <div className="cat-detail-meta-item">
            <span className="cat-detail-meta-label">Partner</span>
            <div className="cat-detail-meta-value">
              <Tag tone={certTone('preferred-partner')} tip={certDescription('preferred-partner')}>
                {certLabel('preferred-partner')}
              </Tag>
            </div>
          </div>
        )}
        {isCorePlatformApp(data) && (
          <div className="cat-detail-meta-item">
            <span className="cat-detail-meta-label">Platform</span>
            <div className="cat-detail-meta-value">
              <Tag tone={corePlatformTone()} tip={corePlatformDescription()}>
                {corePlatformLabel()}
              </Tag>
            </div>
          </div>
        )}
        <div className="cat-detail-meta-item">
          <span className="cat-detail-meta-label">NKP version</span>
          <div className="cat-detail-meta-value">
            <Tag tone="info">{range.label}</Tag>
          </div>
        </div>
        {data.allVersions?.length > 0 && (
          <div className="cat-detail-meta-item">
            <span className="cat-detail-meta-label">
              {data.allVersions.length > 1 ? 'All versions' : 'Version'}
            </span>
            <div className="cat-detail-meta-value">
              {data.allVersions.slice().reverse().map(v => {
                const selected = v === selectedVersion;
                return (
                  <button
                    key={v}
                    type="button"
                    className={`cat-tag cat-tag--${selected ? 'info' : 'neutral'}`}
                    aria-pressed={selected}
                    onClick={() => setSelectedVersion(v)}
                  >
                    {v}
                  </button>
                );
              })}
              {githubHref ? (
                <a href={githubHref} target="_blank" rel="noopener noreferrer">
                  View on GitHub
                </a>
              ) : null}
            </div>
          </div>
        )}
        {(data.dependencies?.length > 0 || data.requiredDependencies?.length > 0) && (
          <div className="cat-detail-meta-item">
            <span className="cat-detail-meta-label">Dependencies</span>
            <div className="cat-detail-meta-value">
              {(data.requiredDependencies || []).map(d => depTag(d, true))}
              {(data.dependencies || []).map(d => depTag(d, false))}
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
        {showAirgappedBundle ? (
          <div className="cat-install-row">
            <div className="cat-install-copy">
              <span className="cat-detail-meta-label">Install</span>
              <p>
                On connected clusters, enable this app from the NKP UI. For
                airgapped environments, build a catalog bundle for the selected
                version.
              </p>
            </div>
            <button
              type="button"
              className="cat-btn"
              onClick={() => setAirgapOpen(true)}
            >
              Build airgapped bundle
            </button>
          </div>
        ) : null}
      </div>

      {showConfigDefaults && defaultValuesPanels.length > 0 && activeValuesPanel ? (
        <div className="cat-page-section" id="default-configuration">
          <h2 className="cat-page-section-title">Default configuration</h2>
          <p className="cat-page-section-lead">
            Default Helm values for the selected version. All of these values
            can be customized at deploy time.
          </p>
          {defaultValuesPanels.length > 1 &&
          !activeValuesPanel.primary &&
          activeValuesPanel.overrideConfigMaps?.length > 0 ? (
            <p className="cat-yaml-overrides-hint">
              Customize by creating ConfigMap
              {activeValuesPanel.overrideConfigMaps.length > 1 ? 's' : ''}{' '}
              {activeValuesPanel.overrideConfigMaps.map((cm, i) => (
                <React.Fragment key={cm}>
                  {i > 0
                    ? i === activeValuesPanel.overrideConfigMaps.length - 1
                      ? ' or '
                      : ', '
                    : null}
                  <code>{cm}</code>
                </React.Fragment>
              ))}
              .
            </p>
          ) : null}
          <YamlCodePanel
            key={selectedVersion}
            source={activeValuesPanel.valuesYaml}
            tabs={defaultValuesPanels.map((panel, i) => ({
              id: panel.name || String(i),
              label: panel.name || 'values',
              primary: !!panel.primary,
            }))}
            activeTabIndex={Math.min(
              valuesTab,
              Math.max(defaultValuesPanels.length - 1, 0),
            )}
            onTabChange={setValuesTab}
          />
        </div>
      ) : null}

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

      {showAirgappedBundle ? (
        <AirgappedBundleModal
          open={airgapOpen}
          onClose={closeAirgap}
          displayName={data.displayName}
          vars={airgapVars}
        />
      ) : null}
    </div>
  );
}
