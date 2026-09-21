import React, {useEffect, useState} from 'react';
import useBaseUrl from '@docusaurus/useBaseUrl';
import CliVersionSelect from './CliVersionSelect';
import CliBreadcrumbs from './CliBreadcrumbs';
import CliCommandBrowser from './CliCommandBrowser';

function titleFrom(commandId, segments, commandTitle) {
  if (commandTitle) return commandTitle;
  if (segments?.length) return segments.join(' ');
  if (!commandId || commandId === 'nkp') return 'nkp';
  return String(commandId).replace(/_/g, ' ');
}

/** Top chrome for generated CLI command pages — matches CliLanding layout. */
export default function CliDocChrome({minor, commandId}) {
  const [segments, setSegments] = useState([]);
  const [commandTitle, setCommandTitle] = useState('');
  const url = useBaseUrl(`/cli/${minor}/commands.json`);

  useEffect(() => {
    let cancelled = false;
    setSegments([]);
    setCommandTitle('');
    fetch(url)
      .then((r) => (r.ok ? r.json() : null))
      .then((json) => {
        if (cancelled || !json) return;
        const cmd = (json.commands || []).find((c) => c.id === commandId);
        if (cmd?.segments) setSegments(cmd.segments);
        else if (commandId === 'nkp') setSegments(['nkp']);
        else setSegments(String(commandId).split('_'));
        if (cmd?.title) setCommandTitle(cmd.title);
        else if (cmd?.command) setCommandTitle(cmd.command);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [url, commandId]);

  const title = titleFrom(commandId, segments, commandTitle);

  return (
    <div className="cli-doc-chrome">
      <CliBreadcrumbs minor={minor} segments={segments} />
      <div className="nkp-page-header">
        <h1 className="nkp-page-header__title">{title}</h1>
        <CliVersionSelect minor={minor} commandId={commandId} />
      </div>
      <div className="cli-doc-chrome__mobile-nav">
        <CliCommandBrowser minor={minor} activeId={commandId} compact />
      </div>
    </div>
  );
}
