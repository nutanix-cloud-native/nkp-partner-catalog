import React, {useState} from 'react';
import Link from '@docusaurus/Link';
import {useOfflineAssets} from './offlineAssets';

function DownloadItems({className}) {
  const {pdfUrl, htmlUrl} = useOfflineAssets();

  return (
    <>
      <li>
        <Link
          className={className}
          href={pdfUrl}
          download="nkp-catalog-docs.pdf"
          target="_self">
          Single PDF (preferred)
        </Link>
      </li>
      <li>
        <Link
          className={className}
          href={htmlUrl}
          download="nkp-catalog-docs.html"
          target="_self">
          Single HTML
        </Link>
      </li>
    </>
  );
}

function ExportDesktop() {
  return (
    <div className="navbar__item dropdown dropdown--hoverable dropdown--right navbar-export">
      <span className="navbar__link" role="button" tabIndex={0} aria-haspopup="true">
        Export
      </span>
      <ul className="dropdown__menu">
        <DownloadItems className="dropdown__link" />
      </ul>
    </div>
  );
}

function ExportMobile() {
  const [open, setOpen] = useState(false);
  return (
    <li className={`menu__list-item${open ? '' : ' menu__list-item--collapsed'}`}>
      <div className="menu__list-item-collapsible">
        <button
          type="button"
          className="menu__link menu__link--sublist"
          aria-expanded={open}
          onClick={() => setOpen((value) => !value)}>
          Export
        </button>
      </div>
      <ul className="menu__list" hidden={!open}>
        <DownloadItems className="menu__link" />
      </ul>
    </li>
  );
}

export default function ExportNavbarItem({mobile}) {
  return mobile ? <ExportMobile /> : <ExportDesktop />;
}
