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
    nkpVersion: '2.17',
    nkpDocsBaseUrl:
      'https://portal.nutanix.com/page/documents/details?targetId=Nutanix-Kubernetes-Platform-v2_17',
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
          editUrl: 'https://github.com/nutanix-cloud-native/nkp-partner-catalog/tree/main/docs/source/',
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
    require.resolve('./src/clientModules/internalPages.js'),
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      docs: {
        sidebar: {
          autoCollapseCategories: true,
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
            type: 'docSidebar',
            sidebarId: 'tutorialSidebar',
            position: 'left',
            label: 'Documentation',
          },
          {
            type: 'dropdown',
            label: 'v1',
            position: 'left',
            items: [
              { label: 'v1 (current)', to: '/docs' },
            ],
          },
          {
            href: 'https://github.com/nutanix-cloud-native/nkp-partner-catalog',
            label: 'GitHub',
            position: 'right',
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Documentation',
            items: [
              { label: 'Getting started', to: '/docs/getting-started/creating-nkp-cluster' },
              { label: 'Workflows', to: '/docs/workflows/initialize-catalog-repo' },
              { label: 'CLI Reference', to: '/docs/cli' },
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
