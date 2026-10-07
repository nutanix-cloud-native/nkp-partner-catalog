import React, {useCallback, useMemo, useRef, useState} from 'react';

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

/** Highlight a single YAML line (preserves leading indent). */
export function highlightYamlLine(line) {
  const commentIdx = line.indexOf('#');
  let code = line;
  let comment = '';
  if (commentIdx >= 0) {
    const before = line.slice(0, commentIdx);
    const quotes = (before.match(/"/g) || []).length;
    if (quotes % 2 === 0) {
      code = before;
      comment = line.slice(commentIdx);
    }
  }

  let out = code.replace(
    /^(\s*)([\w.-]+)(:)(\s*)(.*)$/,
    (_, ind, key, colon, sp, rest) => {
      let value = rest;
      if (/^(true|false|null)\s*$/.test(rest)) {
        value = `<span class="cat-y-bool">${escapeHtml(rest)}</span>`;
      } else if (/^-?\d+(\.\d+)?\s*$/.test(rest)) {
        value = `<span class="cat-y-num">${escapeHtml(rest)}</span>`;
      } else if (rest.length) {
        value = `<span class="cat-y-str">${escapeHtml(rest)}</span>`;
      }
      return `${ind}<span class="cat-y-key">${escapeHtml(key)}</span><span class="cat-y-punct">${colon}</span>${sp}${value}`;
    },
  );

  if (out === code) {
    out = code.replace(
      /^(\s*)(-)(\s+)(.*)$/,
      (_, ind, dash, sp, rest) => {
        const kv = rest.match(/^([\w.-]+)(:)(\s*)(.*)$/);
        if (kv) {
          const [, key, colon, ksp, kval] = kv;
          let value = kval;
          if (/^(true|false|null)\s*$/.test(kval)) {
            value = `<span class="cat-y-bool">${escapeHtml(kval)}</span>`;
          } else if (/^-?\d+(\.\d+)?\s*$/.test(kval)) {
            value = `<span class="cat-y-num">${escapeHtml(kval)}</span>`;
          } else if (kval.length) {
            value = `<span class="cat-y-str">${escapeHtml(kval)}</span>`;
          }
          return `${ind}<span class="cat-y-punct">${dash}</span>${sp}<span class="cat-y-key">${escapeHtml(key)}</span><span class="cat-y-punct">${colon}</span>${ksp}${value}`;
        }
        return `${ind}<span class="cat-y-punct">${dash}</span>${sp}<span class="cat-y-str">${escapeHtml(rest)}</span>`;
      },
    );
  }

  if (out === code) {
    out = escapeHtml(code);
  }

  if (comment) {
    out += `<span class="cat-y-comment">${escapeHtml(comment)}</span>`;
  }
  return out;
}

export function highlightYaml(src) {
  if (!src) return '';
  return String(src).split('\n').map(highlightYamlLine).join('\n');
}

async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    try {
      const ta = document.createElement('textarea');
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      ta.remove();
      return true;
    } catch {
      return false;
    }
  }
}

function indentLevel(line, indentWidth = 2) {
  if (!String(line).trim()) return -1; // blank
  const m = String(line).match(/^[ \t]*/);
  if (!m) return 0;
  const raw = m[0].replace(/\t/g, ' '.repeat(indentWidth));
  return Math.floor(raw.length / indentWidth);
}

/**
 * Build fold metadata: which lines can fold, and parent chain for hiding.
 * Blank lines inherit the previous content indent for parenting.
 */
function buildFoldMeta(lines, indentWidth) {
  const n = lines.length;
  const rawLevels = lines.map((l) => indentLevel(l, indentWidth));
  const levels = rawLevels.map((lvl, i) => {
    if (lvl >= 0) return lvl;
    for (let j = i - 1; j >= 0; j--) {
      if (rawLevels[j] >= 0) return rawLevels[j];
    }
    return 0;
  });

  const foldable = new Array(n).fill(false);
  const childEnd = Array.from({length: n}, (_, i) => i + 1);

  for (let i = 0; i < n; i++) {
    if (rawLevels[i] < 0) continue; // blank never foldable
    const level = levels[i];
    let end = i + 1;
    let hasChild = false;
    for (let j = i + 1; j < n; j++) {
      if (rawLevels[j] < 0) {
        end = j + 1;
        continue;
      }
      if (levels[j] > level) {
        hasChild = true;
        end = j + 1;
        continue;
      }
      break;
    }
    if (hasChild) {
      foldable[i] = true;
      childEnd[i] = end;
    }
  }

  // parent index for each line (nearest prior foldable/content with lower indent)
  const parent = new Array(n).fill(-1);
  for (let i = 0; i < n; i++) {
    const level = levels[i];
    for (let j = i - 1; j >= 0; j--) {
      if (rawLevels[j] < 0) continue;
      if (levels[j] < level) {
        parent[i] = j;
        break;
      }
    }
  }

  return {levels, rawLevels, foldable, childEnd, parent};
}

function isLineHiddenByFold(index, folded, parent) {
  let p = parent[index];
  while (p >= 0) {
    if (folded.has(p)) return true;
    p = parent[p];
  }
  return false;
}

function YamlFileIcon() {
  return (
    <svg
      className="cat-editor-tab-icon"
      width="14"
      height="14"
      viewBox="0 0 16 16"
      aria-hidden="true"
    >
      <path
        fill="#CB171E"
        d="M2.5 1.5h7.086L13.5 5.414V14.5a.5.5 0 0 1-.5.5H3a.5.5 0 0 1-.5-.5v-13a.5.5 0 0 1 .5-.5z"
        opacity="0.15"
      />
      <path
        fill="none"
        stroke="#CB171E"
        strokeWidth="1.1"
        d="M9.25 1.5H3a.5.5 0 0 0-.5.5v13a.5.5 0 0 0 .5.5h10a.5.5 0 0 0 .5-.5V5.75"
      />
      <path fill="none" stroke="#CB171E" strokeWidth="1.1" d="M9 1.5v4h4.5" />
      <text
        x="8"
        y="12.2"
        textAnchor="middle"
        fill="#CB171E"
        fontSize="5.2"
        fontFamily="ui-sans-serif, system-ui, sans-serif"
        fontWeight="700"
      >
        Y
      </text>
    </svg>
  );
}

/**
 * Theme-aware YAML panel (VS Code–style editor chrome):
 * - Optional multi-file tab bar (switch only; no close / no edit)
 * - Fixed-width right-justified line-number gutter
 * - Per-field fold/unfold
 * - Panel show more / show less at the bottom
 *
 * @param {{ id: string, label: string, primary?: boolean }[]} [tabs]
 */
export default function YamlCodePanel({
  source,
  label = 'values',
  tabs,
  activeTabIndex = 0,
  onTabChange,
  collapsedLines = 14,
  indentWidth = 2,
}) {
  const [panelCollapsed, setPanelCollapsed] = useState(true);
  const [folded, setFolded] = useState(() => new Set());
  const [copied, setCopied] = useState(false);
  const panelRef = useRef(null);

  const tabList = Array.isArray(tabs) && tabs.length > 0 ? tabs : null;
  const activeTab =
    tabList && tabList[Math.min(activeTabIndex, tabList.length - 1)];
  const ariaLabel = (activeTab && activeTab.label) || label;

  const lines = useMemo(() => String(source || '').split('\n'), [source]);
  const meta = useMemo(
    () => buildFoldMeta(lines, indentWidth),
    [lines, indentWidth],
  );

  // Reset folds when source changes (version / tab switch).
  const sourceKey = source;
  const [prevSource, setPrevSource] = useState(sourceKey);
  if (prevSource !== sourceKey) {
    setPrevSource(sourceKey);
    setFolded(new Set());
    setPanelCollapsed(true);
  }

  const lnDigits = Math.max(2, String(lines.length).length);
  const canPanelCollapse = lines.length > collapsedLines;

  const visibleIndexes = useMemo(() => {
    const out = [];
    for (let i = 0; i < lines.length; i++) {
      if (isLineHiddenByFold(i, folded, meta.parent)) continue;
      out.push(i);
      if (panelCollapsed && canPanelCollapse && out.length >= collapsedLines) {
        break;
      }
    }
    return out;
  }, [
    lines.length,
    folded,
    meta.parent,
    panelCollapsed,
    canPanelCollapse,
    collapsedLines,
  ]);

  const hiddenByPanel =
    panelCollapsed && canPanelCollapse
      ? Math.max(0, lines.length - collapsedLines)
      : 0;

  const toggleFold = useCallback((index) => {
    setFolded((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  }, []);

  async function onCopy() {
    const ok = await copyText(source || '');
    if (!ok) return;
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  }

  function togglePanelCollapsed() {
    const next = !panelCollapsed;
    setPanelCollapsed(next);
    if (next && panelRef.current) {
      panelRef.current.scrollIntoView({behavior: 'smooth', block: 'nearest'});
    }
  }

  function onTabKeyDown(e, index) {
    if (!tabList || !onTabChange) return;
    let next = null;
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      next = (index + 1) % tabList.length;
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      next = (index - 1 + tabList.length) % tabList.length;
    } else if (e.key === 'Home') {
      next = 0;
    } else if (e.key === 'End') {
      next = tabList.length - 1;
    }
    if (next == null) return;
    e.preventDefault();
    onTabChange(next);
  }

  if (!source) return null;

  return (
    <div
      className="cat-code-panel cat-code-panel--editor"
      ref={panelRef}
      style={{'--yaml-ln-digits': String(lnDigits)}}
    >
      <div className="cat-editor-titlebar">
        <div
          className="cat-editor-tabs"
          role="tablist"
          aria-label="HelmRelease values files"
        >
          {(tabList || [{id: 'default', label, primary: true}]).map(
            (tab, i) => {
              const selected = tabList
                ? i === Math.min(activeTabIndex, tabList.length - 1)
                : true;
              return (
                <button
                  key={tab.id || i}
                  type="button"
                  role="tab"
                  id={`cat-editor-tab-${tab.id || i}`}
                  aria-selected={selected}
                  tabIndex={selected ? 0 : -1}
                  className={`cat-editor-tab${selected ? ' is-active' : ''}${
                    tab.primary ? ' is-primary' : ''
                  }`}
                  onClick={() => tabList && onTabChange && onTabChange(i)}
                  onKeyDown={(e) => onTabKeyDown(e, i)}
                >
                  <YamlFileIcon />
                  <span className="cat-editor-tab-label">{tab.label}</span>
                </button>
              );
            },
          )}
        </div>
        <div className="cat-editor-titlebar-actions">
          <button type="button" className="cat-code-action" onClick={onCopy}>
            {copied ? 'Copied' : 'Copy'}
          </button>
        </div>
      </div>

      <div
        className={`cat-yaml-wrap${
          panelCollapsed && canPanelCollapse ? ' is-collapsed' : ''
        }`}
      >
        <div
          className="cat-yaml-body"
          role="tabpanel"
          aria-label={ariaLabel}
          aria-labelledby={
            activeTab ? `cat-editor-tab-${activeTab.id}` : undefined
          }
        >
          {visibleIndexes.map((i) => {
            const line = lines[i];
            const level = meta.levels[i];
            const guideLevel = meta.rawLevels[i] < 0 ? 0 : level;
            const isFoldable = meta.foldable[i];
            const isFolded = folded.has(i);
            return (
              <div
                className={`cat-yaml-line${isFolded ? ' is-folded' : ''}`}
                key={i}
                role="row"
              >
                <span className="cat-yaml-ln" role="rowheader">
                  {i + 1}
                </span>
                <span className="cat-yaml-fold">
                  {isFoldable ? (
                    <button
                      type="button"
                      className="cat-yaml-fold-btn"
                      aria-expanded={!isFolded}
                      aria-label={isFolded ? 'Expand' : 'Collapse'}
                      onClick={() => toggleFold(i)}
                    >
                      {isFolded ? '▶' : '▼'}
                    </button>
                  ) : null}
                </span>
                <span className="cat-yaml-code" role="cell">
                  {guideLevel > 0 ? (
                    <span className="cat-yaml-guides" aria-hidden="true">
                      {Array.from({length: guideLevel}, (_, g) => (
                        <span
                          key={g}
                          className="cat-yaml-guide"
                          style={{left: `${g * indentWidth + 0.15}ch`}}
                        />
                      ))}
                    </span>
                  ) : null}
                  <span
                    className="cat-yaml-text"
                    dangerouslySetInnerHTML={{
                      __html: highlightYamlLine(line),
                    }}
                  />
                </span>
              </div>
            );
          })}
        </div>
        {panelCollapsed && canPanelCollapse ? (
          <div className="cat-yaml-fade" aria-hidden="true" />
        ) : null}
      </div>

      {canPanelCollapse ? (
        <div className="cat-code-footer">
          <button
            type="button"
            className="cat-code-action cat-code-action--footer"
            onClick={togglePanelCollapsed}
          >
            {panelCollapsed
              ? `Show more (${hiddenByPanel} lines)`
              : 'Show less'}
          </button>
        </div>
      ) : null}
    </div>
  );
}

export {copyText};
