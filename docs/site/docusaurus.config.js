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

const baseUrl = normalizeBaseUrl();

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'NKP Catalog',
  tagline: 'Documentation for NKP Catalog',

  // Set BASE_URL to match where the site is served (e.g. / or /nkp-partner-catalog/).
  // All internal links are baseUrl-relative; no content changes needed when baseUrl changes.
  url: process.env.SITE_URL ?? 'https://nutanix-cloud-native.github.io',
  baseUrl,
  organizationName: 'nutanix-cloud-native',
  projectName: 'nkp-partner-catalog',

  customFields: {
    nkpVersion: '2.19',
    nkpDocsBaseUrl:
      'https://portal.nutanix.com/page/documents/details?targetId=Nutanix-Kubernetes-Platform-v2_19',
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
            return `https://github.com/nutanix-cloud-native/nkp-partner-catalog/tree/main/docs/source/${docPath}`;
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
          customCss: './src/css/custom.css',
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
        title: 'NKP Catalog',
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
            items: [
              { label: 'Nutanix Product Catalog', href: 'https://github.com/nutanix-cloud-native/nkp-nutanix-product-catalog' },
              { label: 'Partner Catalog', href: 'https://github.com/nutanix-cloud-native/nkp-partner-catalog' },
              { label: 'AI Applications Catalog', href: 'https://github.com/nutanix-cloud-native/nkp-ai-applications-catalog' },
            ],
          },
          {
            title: 'Community',
            items: [
              { label: 'GitHub', href: 'https://github.com/nutanix-cloud-native/nkp-partner-catalog' },
              { label: 'Nutanix Portal', href: 'https://portal.nutanix.com' },
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
