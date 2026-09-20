/**
 * Persist ?dev=true / ?unlisted=true for the browser tab so sidebar filtering
 * survives in-app navigation without keeping the query string on every link.
 */
import ExecutionEnvironment from '@docusaurus/ExecutionEnvironment';
import {syncDevModeFromSearch} from '@site/src/utils/devMode';

if (ExecutionEnvironment.canUseDOM) {
  syncDevModeFromSearch(window.location.search);
}
