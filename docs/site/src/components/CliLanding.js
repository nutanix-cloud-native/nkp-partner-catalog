import React, {useEffect, useMemo, useState} from 'react';
import CliBreadcrumbs from './CliBreadcrumbs';
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
      <CliBreadcrumbs segments={[]} />
      <div className="nkp-page-header">
        <h1 className="nkp-page-header__title">nkp</h1>
        <CliVersionSelect minor={minor} onMinorChange={onChange} />
      </div>
      <p className="cli-landing__lede">
        Command-line interface for Nutanix Kubernetes Platform (NKP). Browse
        commands below, or run <code>nkp &lt;command&gt; --help</code> in your
        terminal for the binary you have installed.
      </p>
      <h2 className="cli-landing__commands-heading">Available commands</h2>
      <CliCommandBrowser minor={minor} />
    </div>
  );
}
