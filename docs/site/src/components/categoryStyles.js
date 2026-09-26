'use strict';

/** Token → display form for category slug words (case-insensitive match). */
const CATEGORY_WORD_LABELS = {
  api: 'API',
  ai: 'AI',
  ml: 'ML',
  gpu: 'GPU',
  crd: 'CRD',
  csi: 'CSI',
  and: 'and',
  of: 'of',
  for: 'for',
  the: 'the',
  to: 'to',
};

function categoryWordLabel(word, index) {
  const key = String(word || '').toLowerCase();
  if (Object.prototype.hasOwnProperty.call(CATEGORY_WORD_LABELS, key)) {
    const mapped = CATEGORY_WORD_LABELS[key];
    // Keep small words lowercase unless first token.
    if (index > 0 && mapped === mapped.toLowerCase()) return mapped;
    if (mapped === mapped.toLowerCase()) {
      return mapped.charAt(0).toUpperCase() + mapped.slice(1);
    }
    return mapped;
  }
  return key.charAt(0).toUpperCase() + key.slice(1);
}

function categoryLabel(cat) {
  return String(cat || '')
    .split('-')
    .filter(Boolean)
    .map((w, i) => categoryWordLabel(w, i))
    .join(' ');
}

const CATEGORY_TONES = {
  security: 'warning',
  backup: 'info',
  observability: 'info',
  monitoring: 'info',
  'inferencing-and-serving': 'info',
  'model-development-and-training': 'info',
  'data-and-agents': 'info',
  'artificial-intelligence': 'info',
  'ai-ml': 'info',
};

const CERT_TONES = {
  qualified: 'warning',
  'nutanix-supported': 'success',
  'preferred-partner': 'neutral',
};

/** Fixed facet order for Support status (All stays first in the UI). */
const SUPPORT_STATUS_ORDER = [
  'nutanix-supported',
  'qualified',
  'preferred-partner',
];

/** Fixed Support status facet keys (All stays first in the UI). Always shown. */
function supportStatusKeys() {
  return SUPPORT_STATUS_ORDER.slice();
}

function categoryTone(cat) {
  return CATEGORY_TONES[cat] || 'neutral';
}

function certTone(cert) {
  return CERT_TONES[cert] || 'neutral';
}

const APPLICATION_PANEL_INFO = {
  qualified: {
    title: 'Qualified',
    description:
      'This open source software is curated and supported by Nutanix as part of the NKP platform. As an open source project, Nutanix cannot guarantee that it is bug free nor that bugs will be fixed in a timely manner.',
  },
  'nutanix-supported': {
    title: 'Nutanix Supported',
    description:
      "This application is developed and maintained by Nutanix, and is fully covered under Nutanix's standard support terms and SLAs, including failure assistance and bug fixes.",
  },
  'preferred-partner': {
    title: 'Preferred Partner',
    description:
      'This app is provided by a third-party and is governed by separate terms of service, privacy policy, support policy and support documentation. Consult the third party vendor for questions on their support policies and documentation.',
  },
};

function panelTitle(key) {
  return (APPLICATION_PANEL_INFO[key] && APPLICATION_PANEL_INFO[key].title) || categoryLabel(key);
}

function panelDescription(key) {
  return (APPLICATION_PANEL_INFO[key] && APPLICATION_PANEL_INFO[key].description) || '';
}

function certLabel(cert) {
  return panelTitle(cert);
}

function certDescription(cert) {
  return panelDescription(cert);
}

const TYPED_CATALOG_APPS = new Set([
  'preferred-partner',
  'nkp-core-platform',
  'nkp-catalog',
]);

function isTypedCatalogApp(app) {
  return Boolean(app && TYPED_CATALOG_APPS.has(app.type));
}

function isPreferredPartnerApp(app) {
  return (app && app.type) === 'preferred-partner';
}

/** Certification badge from `certifications` — only for typed catalog apps. */
function certificationBadge(app) {
  if (!isTypedCatalogApp(app)) return '';
  const certs = app.certifications || [];
  if (certs.includes('nutanix-supported')) return 'nutanix-supported';
  if (certs.includes('qualified')) return 'qualified';
  return '';
}

function supportPanelKey(app) {
  return certificationBadge(app);
}

function appHasCertFacet(app, key) {
  if (!key || key === 'all') return true;
  if (key === 'preferred-partner') return isPreferredPartnerApp(app);
  return certificationBadge(app) === key;
}

/** Support-status chips on cards/facets: preferred-partner (type) + cert. */
function supportBadges(app) {
  const badges = [];
  if (isPreferredPartnerApp(app)) badges.push('preferred-partner');
  const cert = certificationBadge(app);
  if (cert) badges.push(cert);
  return badges;
}

function canonicalLicense(name) {
  return name === 'Enterprise' ? 'Ultimate' : name;
}

function appLicenses(app) {
  const seen = new Set();
  const licenses = [];
  for (const name of app.licensing || []) {
    const key = canonicalLicense(name);
    if (key && !seen.has(key)) {
      seen.add(key);
      licenses.push(key);
    }
  }
  return licenses;
}

function appHasLicense(app, license) {
  if (!license || license === 'all') return true;
  return appLicenses(app).includes(canonicalLicense(license));
}

const NKP_LICENSE_OPTIONS_URL =
  'https://www.nutanix.com/products/cloud-platform/software-options#nkp';

const LICENSE_INFO = {
  Starter: 'The fastest, easiest way to run Kubernetes on Nutanix.',
  Pro: 'An enterprise-ready stack ready to take applications in a cluster to production.',
  Ultimate: 'True fleet management for clusters running on premises, in the cloud, or anywhere.',
};

function licenseDescription(name) {
  return LICENSE_INFO[canonicalLicense(name)] || '';
}

const CORE_PLATFORM_TYPE = 'nkp-core-platform';

const CORE_PLATFORM_DESCRIPTION =
  'This is a core platform application and will be upgraded by default when the cluster undergoes an upgrade.';

function isCorePlatformApp(app) {
  return (app && app.type) === CORE_PLATFORM_TYPE;
}

function corePlatformLabel() {
  return 'NKP Core Platform';
}

function corePlatformDescription() {
  return CORE_PLATFORM_DESCRIPTION;
}

function corePlatformTone() {
  return 'info';
}

/** Apps shown in the public catalog browser (and generated detail pages). */
function isPublishedCatalogApp(app) {
  if (!app) return false;
  if (app.type === 'internal') return false;
  if (/deprecated/i.test(String(app.displayName || ''))) return false;
  return true;
}

export {
  categoryLabel,
  categoryTone,
  certTone,
  certLabel,
  certDescription,
  panelTitle,
  panelDescription,
  supportPanelKey,
  certificationBadge,
  appHasCertFacet,
  supportBadges,
  isPreferredPartnerApp,
  supportStatusKeys,
  SUPPORT_STATUS_ORDER,
  canonicalLicense,
  appLicenses,
  appHasLicense,
  licenseDescription,
  NKP_LICENSE_OPTIONS_URL,
  CORE_PLATFORM_TYPE,
  isCorePlatformApp,
  corePlatformLabel,
  corePlatformDescription,
  corePlatformTone,
  isPublishedCatalogApp,
};
