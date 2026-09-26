import React, {useMemo} from 'react';
import Link from '@docusaurus/Link';

const DEFAULT_PILL_COUNT = 3;

/**
 * Shared NKP version chrome: pills for the newest N options, Older <select>
 * for the rest. Used by Applications (filter) and CLI (docs minor).
 *
 * @param {string} value — selected id (e.g. "2.18" or "all")
 * @param {(next: string) => void} onChange
 * @param {{id: string, label?: string}[]} options — newest-first preferred
 * @param {boolean} [includeAll] — leading "All" pill with id "all"
 * @param {string} [ariaLabel]
 * @param {number} [pillCount]
 * @param {string} [label] — visible group label (default "Version")
 * @param {(id: string) => string} [itemTo] — when set, pills are Links (baseUrl-safe)
 */
export default function NkpVersionSwitch({
  value,
  onChange,
  options = [],
  includeAll = false,
  ariaLabel = 'NKP version',
  pillCount = DEFAULT_PILL_COUNT,
  label = 'Version',
  className = '',
  itemTo,
}) {
  const listed = useMemo(() => {
    const base = (options || []).map((o) => ({
      id: o.id,
      label: o.label || o.id,
    }));
    if (!includeAll) return base;
    if (base.some((o) => o.id === 'all')) return base;
    return [{id: 'all', label: 'All'}, ...base];
  }, [options, includeAll]);

  const {pillEntries, olderEntries, showOlder} = useMemo(() => {
    const allOpt = listed.find((o) => o.id === 'all');
    const versions = listed.filter((o) => o.id !== 'all');
    const useOlder = versions.length > pillCount;
    if (!useOlder) {
      return {
        pillEntries: listed,
        olderEntries: [],
        showOlder: false,
      };
    }
    const pills = [
      ...(allOpt ? [allOpt] : []),
      ...versions.slice(0, pillCount),
    ];
    const older = versions.slice(pillCount);
    if (
      value &&
      value !== 'all' &&
      !pills.some((o) => o.id === value) &&
      !older.some((o) => o.id === value)
    ) {
      const orphan = listed.find((o) => o.id === value);
      if (orphan) older.push(orphan);
    }
    return {
      pillEntries: pills,
      olderEntries: older,
      showOlder: older.length > 0,
    };
  }, [listed, pillCount, value]);

  const go = (next) => {
    if (!next || next === value) return;
    onChange(next);
  };

  const olderActive = showOlder && olderEntries.some((o) => o.id === value);
  const rootClass = ['nkp-version-switch', className].filter(Boolean).join(' ');
  const useLinks = typeof itemTo === 'function';

  return (
    <div className={rootClass} role="group" aria-label={ariaLabel}>
      <span className="nkp-version-switch__label">{label}</span>
      <div className="nkp-version-switch__list">
        {pillEntries.map((entry) => {
          const active = entry.id === value;
          const classNameBtn = active
            ? 'nkp-version-switch__btn is-active'
            : 'nkp-version-switch__btn';
          if (useLinks) {
            return (
              <Link
                key={entry.id}
                to={itemTo(entry.id)}
                className={classNameBtn}
                aria-current={active ? 'page' : undefined}
                onClick={(e) => {
                  if (active) e.preventDefault();
                }}
              >
                {entry.label}
              </Link>
            );
          }
          return (
            <button
              key={entry.id}
              type="button"
              className={classNameBtn}
              aria-pressed={active}
              onClick={() => go(entry.id)}
            >
              {entry.label}
            </button>
          );
        })}
        {showOlder ? (
          <label className="nkp-version-switch__older">
            <span className="nkp-version-switch__older-label">Older</span>
            <select
              className={
                olderActive
                  ? 'nkp-version-switch__older-select is-active'
                  : 'nkp-version-switch__older-select'
              }
              aria-label={`Older ${ariaLabel}`}
              value={olderActive ? value : ''}
              onChange={(e) => {
                const v = e.target.value;
                if (v) go(v);
              }}
            >
              <option value="">Older…</option>
              {olderEntries.map((entry) => (
                <option key={entry.id} value={entry.id}>
                  {entry.label}
                </option>
              ))}
            </select>
          </label>
        ) : null}
      </div>
    </div>
  );
}
