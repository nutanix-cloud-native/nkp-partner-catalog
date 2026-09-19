import React, {useEffect, useMemo, useState} from 'react';
import Link from '@docusaurus/Link';
import useBaseUrl from '@docusaurus/useBaseUrl';

function commandHref(minor, cmd) {
  if (!cmd || !cmd.slug) return `/docs/cli/${minor}/`;
  return `/docs/cli/${minor}/${cmd.slug}`;
}

function buildTree(commands) {
  const byId = new Map();
  for (const c of commands || []) {
    byId.set(c.id, {
      ...c,
      children: [],
      label:
        Array.isArray(c.segments) && c.segments.length
          ? c.segments[c.segments.length - 1]
          : c.command.split(/\s+/).pop(),
    });
  }
  const roots = [];
  for (const node of byId.values()) {
    const parentId = node.parentId;
    if (parentId && byId.has(parentId)) {
      byId.get(parentId).children.push(node);
    } else if (node.id === 'nkp') {
      roots.push(node);
    } else {
      roots.push(node);
    }
  }
  const sortRec = (nodes) => {
    nodes.sort((a, b) => a.label.localeCompare(b.label));
    nodes.forEach((n) => sortRec(n.children));
  };
  sortRec(roots);

  // Binary name is obvious; surface top-level verbs (attach, create, …) directly.
  let displayRoots = roots;
  if (
    roots.length === 1 &&
    roots[0].id === 'nkp' &&
    roots[0].children.length > 0
  ) {
    displayRoots = roots[0].children;
  }

  return {roots: displayRoots, byId};
}

function collectBranchIds(nodes, into = new Set()) {
  for (const n of nodes) {
    if (n.children?.length) {
      into.add(n.id);
      collectBranchIds(n.children, into);
    }
  }
  return into;
}

function nodeMatches(node, needle) {
  if (!needle) return true;
  const hay = `${node.command} ${node.summary || ''} ${node.title || ''}`.toLowerCase();
  if (hay.includes(needle)) return true;
  return (node.children || []).some((c) => nodeMatches(c, needle));
}

function filterTree(nodes, needle) {
  if (!needle) return nodes;
  const out = [];
  for (const n of nodes) {
    if (!nodeMatches(n, needle)) continue;
    out.push({
      ...n,
      children: filterTree(n.children || [], needle),
    });
  }
  return out;
}

function collectAncestorIds(byId, activeId) {
  const open = new Set();
  let cur = byId.get(activeId);
  while (cur) {
    open.add(cur.id);
    cur = cur.parentId ? byId.get(cur.parentId) : null;
  }
  return open;
}

function TreeNode({node, minor, activeId, expanded, toggle, depth, compact}) {
  const hasKids = node.children && node.children.length > 0;
  const isOpen = expanded.has(node.id);
  const isActive = node.id === activeId;
  const pad = {paddingLeft: `${depth * 0.9}rem`};

  return (
    <li className={isActive ? 'is-active' : undefined}>
      <div className="cli-tree__row" style={pad}>
        {hasKids ? (
          <button
            type="button"
            className={isOpen ? 'cli-tree__twist is-open' : 'cli-tree__twist'}
            aria-expanded={isOpen}
            aria-label={
              isOpen
                ? `Collapse ${node.label}`
                : `Expand ${node.label}`
            }
            title={isOpen ? 'Collapse' : 'Expand'}
            onClick={() => toggle(node.id)}
          >
            <span className="cli-tree__chevron" aria-hidden="true" />
          </button>
        ) : (
          <span className="cli-tree__twist cli-tree__twist--spacer" />
        )}
        <Link
          to={commandHref(minor, node)}
          className="cli-tree__link"
          title={node.command}
        >
          <code>{node.label}</code>
          {!compact && node.summary ? (
            <span className="cli-tree__summary">{node.summary}</span>
          ) : null}
        </Link>
      </div>
      {hasKids && isOpen ? (
        <ul className="cli-tree__children">
          {node.children.map((child) => (
            <TreeNode
              key={child.id}
              node={child}
              minor={minor}
              activeId={activeId}
              expanded={expanded}
              toggle={toggle}
              depth={depth + 1}
              compact={compact}
            />
          ))}
        </ul>
      ) : null}
    </li>
  );
}

const EXPAND_PREF_KEY = 'nkp-cli-tree-expand';

function readExpandPref() {
  try {
    const v = sessionStorage.getItem(EXPAND_PREF_KEY);
    if (v === 'collapsed' || v === 'expanded') return v;
  } catch {
    /* ignore */
  }
  return 'expanded';
}

function writeExpandPref(pref) {
  try {
    sessionStorage.setItem(EXPAND_PREF_KEY, pref);
  } catch {
    /* ignore */
  }
}

export default function CliCommandBrowser({
  minor,
  activeId = '',
  compact = false,
}) {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [q, setQ] = useState('');
  const [expanded, setExpanded] = useState(() => new Set());
  const url = useBaseUrl(`/cli/${minor}/commands.json`);

  useEffect(() => {
    let cancelled = false;
    setData(null);
    setError('');
    fetch(url)
      .then((r) => {
        if (!r.ok) throw new Error(`Failed to load commands (${r.status})`);
        return r.json();
      })
      .then((json) => {
        if (!cancelled) setData(json);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message || String(err));
      });
    return () => {
      cancelled = true;
    };
  }, [url]);

  const {roots, byId} = useMemo(
    () => buildTree(data?.commands || []),
    [data],
  );

  // Landing: honor Expand/Collapse-all preference across version switches.
  // Detail rail: ancestors of active only.
  useEffect(() => {
    if (!roots.length) return;
    if (compact) {
      if (!activeId) return;
      setExpanded(collectAncestorIds(byId, activeId));
      return;
    }
    if (readExpandPref() === 'collapsed') {
      setExpanded(new Set());
    } else {
      setExpanded(collectBranchIds(roots));
    }
  }, [roots, byId, compact, activeId, minor]);

  const needle = q.trim().toLowerCase();
  const visible = useMemo(
    () => filterTree(roots, needle),
    [roots, needle],
  );

  useEffect(() => {
    if (!needle || !visible.length) return;
    setExpanded(collectBranchIds(visible));
  }, [needle, visible]);

  const toggle = (id) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const branchIds = useMemo(() => collectBranchIds(roots), [roots]);
  const allExpanded =
    branchIds.size > 0 && [...branchIds].every((id) => expanded.has(id));

  const expandAll = () => {
    writeExpandPref('expanded');
    setExpanded(collectBranchIds(roots));
  };
  const collapseAll = () => {
    writeExpandPref('collapsed');
    setExpanded(new Set());
  };

  return (
    <div
      className={
        compact
          ? 'cli-command-browser cli-command-browser--compact'
          : 'cli-command-browser'
      }
    >
      <div className="cli-command-browser__toolbar">
        <div className="cli-command-browser__search">
          <input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search commands…"
            aria-label="Search CLI commands"
          />
        </div>
        {!compact && roots.length > 0 ? (
          <div
            className="cli-command-browser__tree-actions"
            role="group"
            aria-label="Command tree"
          >
            <button
              type="button"
              className="cli-command-browser__tree-btn"
              aria-label="Expand all commands"
              disabled={allExpanded}
              onClick={expandAll}
            >
              Expand all
            </button>
            <button
              type="button"
              className="cli-command-browser__tree-btn"
              aria-label="Collapse all commands"
              disabled={expanded.size === 0}
              onClick={collapseAll}
            >
              Collapse all
            </button>
          </div>
        ) : null}
      </div>
      {error ? <p className="cli-command-browser__error">{error}</p> : null}
      {!error && !data ? (
        <p className="cli-command-browser__hint">Loading…</p>
      ) : null}
      {data ? (
        <ul className="cli-tree">
          {visible.map((node) => (
            <TreeNode
              key={node.id}
              node={node}
              minor={minor}
              activeId={activeId}
              expanded={expanded}
              toggle={toggle}
              depth={0}
              compact={compact}
            />
          ))}
          {visible.length === 0 ? (
            <li className="cli-command-browser__empty">No matching commands</li>
          ) : null}
        </ul>
      ) : null}
    </div>
  );
}
