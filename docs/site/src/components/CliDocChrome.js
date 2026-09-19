import React, {useEffect, useState} from 'react';
import useBaseUrl from '@docusaurus/useBaseUrl';
import CliVersionSelect from './CliVersionSelect';
import CliBreadcrumbs from './CliBreadcrumbs';
import CliCommandBrowser from './CliCommandBrowser';

/** Top chrome for generated CLI command pages. */
export default function CliDocChrome({minor, commandId}) {
  const [segments, setSegments] = useState(null);
  const url = useBaseUrl(`/cli/${minor}/commands.json`);

  useEffect(() => {
    let cancelled = false;
    fetch(url)
      .then((r) => (r.ok ? r.json() : null))
      .then((json) => {
        if (cancelled || !json) return;
        const cmd = (json.commands || []).find((c) => c.id === commandId);
        if (cmd?.segments) setSegments(cmd.segments);
        else if (commandId === 'nkp') setSegments(['nkp']);
        else setSegments(String(commandId).split('_'));
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [url, commandId]);

  return (
    <div className="cli-doc-chrome">
      <CliVersionSelect minor={minor} commandId={commandId} />
      {segments ? (
        <CliBreadcrumbs minor={minor} segments={segments} />
      ) : null}
      <div className="cli-doc-chrome__mobile-nav">
        <CliCommandBrowser minor={minor} activeId={commandId} compact />
      </div>
    </div>
  );
}
