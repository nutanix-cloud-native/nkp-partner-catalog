import React, {useMemo} from 'react';
import {useHistory, useLocation} from '@docusaurus/router';
import NkpVersionSwitch from './NkpVersionSwitch';
import {
  defaultMinor,
  findMinor,
  labelFor,
  parseCliPath,
  publicMinors,
} from './cliVersions';

function commandPath(minor, commandId) {
  if (!commandId || commandId === 'nkp') return `/docs/cli/${minor}/`;
  return `/docs/cli/${minor}/${commandId}`;
}

/**
 * CLI adapter over shared NkpVersionSwitch.
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
  const publics = useMemo(() => publicMinors(), []);
  const currentEntry = findMinor(minor);

  const options = useMemo(() => {
    const list = publics.map((e) => ({
      id: e.minor,
      label: labelFor(e),
    }));
    if (
      currentEntry?.unlisted &&
      !list.some((o) => o.id === minor)
    ) {
      return [{id: currentEntry.minor, label: labelFor(currentEntry)}, ...list];
    }
    return list;
  }, [publics, currentEntry, minor]);

  const go = (nextMinor) => {
    if (!nextMinor || nextMinor === minor) return;
    if (typeof onMinorChange === 'function') {
      onMinorChange(nextMinor);
      return;
    }
    history.push(commandPath(nextMinor, commandId));
  };

  return (
    <NkpVersionSwitch
      value={minor}
      onChange={go}
      options={options}
      ariaLabel="NKP CLI version"
    />
  );
}
