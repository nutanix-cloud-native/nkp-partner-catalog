import React, {useMemo} from 'react';
import DocSidebarItems from '@theme-original/DocSidebarItems';
import {useLocation} from '@docusaurus/router';
import {
  syncDevModeFromSearch,
  isDevMode,
  filterDevSidebarItems,
} from '@site/src/utils/devMode';

/**
 * Hide sidebar entries with customProps.dev unless ?dev=true / ?unlisted=true
 * (persisted for the tab via sessionStorage).
 */
export default function DocSidebarItemsWrapper(props) {
  const location = useLocation();
  syncDevModeFromSearch(location.search);
  const items = useMemo(() => {
    if (isDevMode(location.search)) return props.items;
    return filterDevSidebarItems(props.items);
  }, [location.search, props.items]);

  return <DocSidebarItems {...props} items={items} />;
}
