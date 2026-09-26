// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const path = require('path');

/**
 * Normalize baseUrl so the site works regardless of how BASE_URL is set.
 * Docusaurus expects baseUrl to start with / and end with / (root is '/').
 */
function normalizeBaseUrl(value) {
  const raw = (value || process.env.BASE_URL || '/').trim();
  const withLeading = raw.startsWith('/') ? raw : `/${raw}`;
  if (withLeading === '/') return '/';
  return withLeading.endsWith('/') ? withLeading : `${withLeading}/`;
}

function loadDocsBundle() {
  try {
    return {
      portal: require('./src/data/portal-version.json'),
      site: require('./src/data/site-config.json'),
      catalogs: require('./src/data/catalogs.json'),
    };
  } catch {
    // Before first `_docs-prepare`: read human config.
    const cfg = require('../scripts/docs-config.cjs');
    const raw = cfg.loadConfigYaml();
    return {
      portal: cfg.portalFromConfig(raw),
      site: cfg.siteFromConfig(raw),
      catalogs: cfg.catalogsFromConfig(raw).list,
    };
  }
}

const baseUrl = normalizeBaseUrl();
const {portal, site, catalogs} = loadDocsBundle();

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: site.title,
  tagline: site.tagline,

  // Set BASE_URL to match where the site is served (e.g. / or /nkp-partner-catalog/).
  // All internal links are baseUrl-relative; no content changes needed when baseUrl changes.
  url: process.env.SITE_URL ?? site.siteUrl,
  baseUrl,
  organizationName: site.organization,
  projectName: site.project,

  customFields: {
    nkpVersion: portal.nkpVersion,
    nkpDocsBaseUrl: portal.nkpDocsBaseUrl,
  },

  favicon: 'img/nutanix-logo.svg',
  onBrokenLinks: 'throw',
  markdown: {
    mermaid: true,
    hooks: {
      onBrokenMarkdownLinks: 'warn',
    },
  },

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          path: path.resolve(__dirname, '..', 'source'),
          sidebarPath: './config/sidebars.js',
          editUrl: ({docPath}) => {
            // Generated catalog pages — no meaningful source file in this repo.
            if (docPath.startsWith('applications/')) {
              return undefined;
            }
            // Generated per-version nkp help dumps.
            if (/^cli\/\d+\.\d+/.test(docPath)) {
              return undefined;
            }
            return `${site.githubRepo}/${site.editPath}/${docPath}`;
          },
          lastVersion: 'current',
          versions: {
            current: {
              label: 'v1',
              path: '/',
              banner: 'none',
            },
          },
        },
        blog: false,
        theme: {
          customCss: ['./src/css/custom.css', './src/css/catalog.css'],
        },
      }),
    ],
  ],

  plugins: [
    [
      require.resolve('docusaurus-plugin-search-local'),
      {
        indexDocs: true,
        indexPages: false,
        indexBlog: false,
        docsRouteBasePath: '/docs',
        highlightSearchTermsOnTargetPage: false,
        searchResultLimits: 8,
      },
    ],
  ],

  themes: [['docusaurus-json-schema-plugin', {}], '@docusaurus/theme-mermaid'],

  clientModules: [
    require.resolve('./src/clientModules/mermaidPanZoom.js'),
    require.resolve('./src/clientModules/devMode.js'),
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      docs: {
        sidebar: {
          autoCollapseCategories: false,
        },
      },
      navbar: {
        title: site.title,
        style: 'dark',
        logo: {
          alt: 'Nutanix Kubernetes Platform - NKP',
          src: 'img/nutanix-logo.svg',
        },
        items: [
          {
            to: '/docs/applications/',
            label: 'Applications',
            position: 'left',
            activeBaseRegex: '/docs/applications(/|$)',
          },
          {
            to: '/docs/',
            label: 'Docs',
            position: 'left',
            // Active on docs pages, but not on the Applications surface.
            activeBaseRegex: '/docs(?:/?$|/(?!applications(?:/|$)))',
          },
          {
            type: 'custom-export',
            position: 'right',
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Docs',
            items: [
              { label: 'Applications', to: '/docs/applications/' },
              { label: 'Getting started', to: '/docs/getting-started/creating-nkp-cluster' },
              { label: 'Guides', to: '/docs/workflows/initialize-catalog-repo' },
              { label: 'CLI', to: '/docs/cli' },
            ],
          },
          {
            title: 'Catalogs',
            items: catalogs.map((c) => ({
              label: c.name,
              href: c.repo,
            })),
          },
          {
            title: 'Community',
            items: [
              { label: 'GitHub', href: site.githubRepo },
              { label: 'Nutanix Portal', href: site.portalHomeUrl },
            ],
          },
        ],
        copyright: `© ${new Date().getFullYear()} Nutanix. NKP Catalog documentation.`,
      },
      prism: {
        theme: require('prism-react-renderer').themes.github,
        darkTheme: require('prism-react-renderer').themes.dracula,
      },
      mermaid: {
        theme: { light: 'neutral', dark: 'dark' },
      },
    }),
};

module.exports = config;
