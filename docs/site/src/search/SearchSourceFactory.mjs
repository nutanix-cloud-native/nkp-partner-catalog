import {SearchSourceFactory as createSearchSource} from 'docusaurus-plugin-search-local/lib/client/utils/SearchSourceFactory.js';
import {processTreeStatusOfSearchResults} from 'docusaurus-plugin-search-local/lib/client/utils/processTreeStatusOfSearchResults.js';
import {presentVersionedSearchResults} from './preferNewerVersionedSearchResults.mjs';

// Wide enough to include every versioned copy before the dropdown cap is applied.
const GATHER_LIMIT = 200;

function finalize(results) {
  for (const item of results) {
    delete item.isInterOfTree;
    delete item.isLastOfTree;
  }
  processTreeStatusOfSearchResults(results);
  return results;
}

export function SearchSourceFactory(props) {
  const displayLimit = Number.isFinite(props.resultsLimit)
    ? props.resultsLimit
    : GATHER_LIMIT;
  const search = createSearchSource({
    ...props,
    resultsLimit: Math.max(displayLimit, GATHER_LIMIT),
    onResults(query, results) {
      props.onResults(
        query,
        finalize(presentVersionedSearchResults(results, displayLimit)),
      );
    },
  });
  return function searchSource(input, callback) {
    search(input, (results) => {
      callback(finalize(presentVersionedSearchResults(results, displayLimit)));
    });
  };
}
