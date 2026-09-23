import React from 'react';
import clsx from 'clsx';
import {useWindowSize} from '@docusaurus/theme-common';
import {useDoc} from '@docusaurus/plugin-content-docs/client';
import DocItemPaginator from '@theme/DocItem/Paginator';
import DocVersionBanner from '@theme/DocVersionBanner';
import DocVersionBadge from '@theme/DocVersionBadge';
import DocItemFooter from '@theme/DocItem/Footer';
import DocItemTOCMobile from '@theme/DocItem/TOC/Mobile';
import DocItemTOCDesktop from '@theme/DocItem/TOC/Desktop';
import DocItemContent from '@theme/DocItem/Content';
import DocBreadcrumbs from '@theme/DocBreadcrumbs';
import ContentVisibility from '@theme/ContentVisibility';
import CliDocChrome from '@site/src/components/CliDocChrome';
import CliCommandBrowser from '@site/src/components/CliCommandBrowser';
import {isDevDocFrontMatter} from '@site/src/utils/devMode';
import styles from './styles.module.css';

function useDocTOC() {
  const {frontMatter, toc} = useDoc();
  const windowSize = useWindowSize();
  const hidden = frontMatter.hide_table_of_contents;
  const canRender = !hidden && toc.length > 0;
  const mobile = canRender ? <DocItemTOCMobile /> : undefined;
  const desktop =
    canRender && (windowSize === 'desktop' || windowSize === 'ssr') ? (
      <DocItemTOCDesktop />
    ) : undefined;
  return {
    hidden,
    mobile,
    desktop,
  };
}

export default function DocItemLayout({children}) {
  const docTOC = useDocTOC();
  const {metadata, frontMatter} = useDoc();
  const isApplicationsSurface = (metadata.id || '').startsWith('applications/');
  const isOverview = metadata.id === 'index';
  const isCliGenerated = frontMatter.cli_generated === true;
  const cliMinor = frontMatter.nkp_minor;
  const cliCommandId = frontMatter.nkp_command_id || 'nkp';
  // Listing keeps a full-width filter layout; detail pages are a reading column.
  const isAppDetail =
    isApplicationsSurface && metadata.id !== 'applications/index';
  const narrowArticle = !docTOC.hidden && !isAppDetail && !isCliGenerated;

  return (
    <div className="row">
      <div
        className={clsx(
          'col',
          !isCliGenerated && narrowArticle && styles.docItemCol,
          isAppDetail && styles.appDetailCol,
          isCliGenerated && 'col--9',
        )}
      >
        {!isCliGenerated ? <ContentVisibility metadata={metadata} /> : null}
        {!isCliGenerated && isDevDocFrontMatter(frontMatter) ? (
          <div className="theme-doc-version-banner alert alert--warning margin-bottom--md" role="alert">
            Dev-only page — visible in the sidebar when{' '}
            <code>?dev=true</code> (or <code>?unlisted=true</code>) is set. Direct
            URL always works.
          </div>
        ) : null}
        <DocVersionBanner />
        <div className={styles.docItemContainer}>
          <article>
            {/* CLI landing uses CliBreadcrumbs inside CliLanding; generated pages use CliDocChrome. */}
            {!isCliGenerated && !(metadata.id || '').startsWith('cli/') ? (
              <DocBreadcrumbs />
            ) : null}
            {!isCliGenerated ? <DocVersionBadge /> : null}
            {isCliGenerated && cliMinor ? (
              <CliDocChrome minor={cliMinor} commandId={cliCommandId} />
            ) : null}
            {docTOC.mobile}
            <DocItemContent>{children}</DocItemContent>
            <DocItemFooter />
          </article>
          {!isApplicationsSurface &&
            !isCliGenerated &&
            !isOverview &&
            !isDevDocFrontMatter(frontMatter) && <DocItemPaginator />}
        </div>
      </div>
      {isCliGenerated && cliMinor ? (
        <div className="col col--3">
          <div className="cli-command-browser-rail">
            <CliCommandBrowser
              minor={cliMinor}
              activeId={cliCommandId}
              compact
            />
          </div>
        </div>
      ) : (
        docTOC.desktop && <div className="col col--3">{docTOC.desktop}</div>
      )}
    </div>
  );
}
