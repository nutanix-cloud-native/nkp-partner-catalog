import React, {useEffect, useMemo, useState} from 'react';
import CliCommandBrowser from './CliCommandBrowser';
import CliVersionSelect from './CliVersionSelect';
import {defaultMinor, publicMinors} from './cliVersions';

const STORAGE_KEY = 'nkp-cli-minor';

export default function CliLanding() {
  const publics = useMemo(() => publicMinors(), []);
  const [minor, setMinor] = useState(defaultMinor());

  useEffect(() => {
    try {
      const saved = sessionStorage.getItem(STORAGE_KEY);
      if (saved && publics.some((m) => m.minor === saved)) setMinor(saved);
    } catch {
      /* ignore */
    }
  }, [publics]);

  const onChange = (next) => {
    setMinor(next);
    try {
      sessionStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* ignore */
    }
  };

  return (
    <div className="cli-landing">
      <CliVersionSelect minor={minor} onMinorChange={onChange} />
      <h2 className="cli-landing__commands-heading">Available commands</h2>
      <CliCommandBrowser minor={minor} />
    </div>
  );
}
