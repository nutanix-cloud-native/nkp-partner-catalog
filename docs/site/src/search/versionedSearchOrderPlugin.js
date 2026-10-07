const path = require('path');

const FACTORY_FILE = 'docusaurus-plugin-search-local/lib/client/utils/SearchSourceFactory.js';

/**
 * Swap the local-search result builder for one that lists newer major.minor
 * path versions first (CLI, ai-conformance, and any future versioned docs).
 * The wrapper imports the original file, so that import must not be swapped too.
 */
function versionedSearchOrderPlugin() {
  const wrapper = path.resolve(__dirname, 'SearchSourceFactory.mjs');
  return {
    name: 'versioned-search-order',
    configureWebpack() {
      return {
        plugins: [
          {
            apply(compiler) {
              compiler.hooks.normalModuleFactory.tap('VersionedSearchOrder', (nmf) => {
                nmf.hooks.afterResolve.tap('VersionedSearchOrder', (resolveData) => {
                  const createData = resolveData.createData;
                  const resource = createData && createData.resource;
                  if (!resource) return undefined;
                  const normalized = resource.split('\\').join('/');
                  if (!normalized.endsWith(FACTORY_FILE)) return undefined;
                  const issuer = (
                    (resolveData.contextInfo && resolveData.contextInfo.issuer) || ''
                  )
                    .split('\\')
                    .join('/');
                  if (issuer.endsWith('/src/search/SearchSourceFactory.mjs')) {
                    return undefined;
                  }
                  const from = createData.resource;
                  createData.resource = wrapper;
                  createData.context = path.dirname(wrapper);
                  if (typeof createData.request === 'string') {
                    createData.request = createData.request.split(from).join(wrapper);
                  }
                  if (typeof createData.userRequest === 'string') {
                    createData.userRequest = createData.userRequest
                      .split(from)
                      .join(wrapper);
                  }
                  return undefined;
                });
              });
            },
          },
        ],
      };
    },
  };
}

module.exports = versionedSearchOrderPlugin;
