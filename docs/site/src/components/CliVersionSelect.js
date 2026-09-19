import React, {useMemo} from 'react';
import {useHistory, useLocation} from '@docusaurus/router';
import {
  defaultMinor,
  findMinor,
  labelFor,
  parseCliPath,
  publicMinors,
} from './cliVersions';

/** Newest N GA minors stay as pills; older public minors go in the Older control. */
const PILL_COUNT = 3;

function commandPath(minor, commandId) {
  if (!commandId || commandId === 'nkp') return `/docs/cli/${minor}/`;
  return `/docs/cli/${minor}/${commandId}`;
}

/**
 * Version pills + Older select when public minors exceed the pill window.
 * Pass `onMinorChange` on the landing to switch tree version without navigating.
 */
export default function CliVersionSelect({
  minor: minorProp,
  commandId: commandIdProp,
  onMinorChange,
}) {
  const history = useHistory();
  const location = useLocation();
  const parsed = parseCliPath(location.pathname);
  const minor = minorProp || parsed?.minor || defaultMinor();
  const commandId = commandIdProp || parsed?.commandId || 'nkp';
  const options = useMemo(() => publicMinors(), []);
  const currentEntry = findMinor(minor);

  const {pillEntries, olderEntries, showOlder} = useMemo(() => {
    let listed = options;
    if (currentEntry?.unlisted && !options.some((o) => o.minor === minor)) {
      listed = [currentEntry, ...options];
    }
    const useOlder = options.length > PILL_COUNT;
    if (!useOlder) {
      return {pillEntries: listed, olderEntries: [], showOlder: false};
    }
    const pills = listed.slice(0, PILL_COUNT);
    const older = listed.slice(PILL_COUNT);
    if (
      currentEntry &&
      !pills.some((o) => o.minor === minor) &&
      !older.some((o) => o.minor === minor)
    ) {
      older.push(currentEntry);
    }
    return {pillEntries: pills, olderEntries: older, showOlder: older.length > 0};
  }, [currentEntry, options, minor]);

  const go = (nextMinor) => {
    if (!nextMinor || nextMinor === minor) return;
    if (typeof onMinorChange === 'function') {
      onMinorChange(nextMinor);
      return;
    }
    history.push(commandPath(nextMinor, commandId));
  };

  const olderActive = showOlder && olderEntries.some((o) => o.minor === minor);

  return (
    <div className="cli-version-pills" role="group" aria-label="NKP CLI version">
      <span className="cli-version-pills__label">Version</span>
      <div className="cli-version-pills__list">
        {pillEntries.map((entry) => {
          const active = entry.minor === minor;
          return (
            <button
              key={entry.minor}
              type="button"
              className={
                active
                  ? 'cli-version-pills__btn is-active'
                  : 'cli-version-pills__btn'
              }
              aria-pressed={active}
              onClick={() => go(entry.minor)}
            >
              {labelFor(entry)}
            </button>
          );
        })}
        {showOlder ? (
          <label className="cli-version-pills__older">
            <span className="cli-version-pills__older-label">Older</span>
            <select
              className={
                olderActive
                  ? 'cli-version-pills__older-select is-active'
                  : 'cli-version-pills__older-select'
              }
              aria-label="Older NKP CLI versions"
              value={olderActive ? minor : ''}
              onChange={(e) => {
                const v = e.target.value;
                if (v) go(v);
              }}
            >
              <option value="">Older…</option>
              {olderEntries.map((entry) => (
                <option key={entry.minor} value={entry.minor}>
                  {labelFor(entry)}
                </option>
              ))}
            </select>
          </label>
        ) : null}
      </div>
    </div>
  );
}
