'use strict';

function categoryLabel(cat) {
  return cat
    .split('-')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
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
  qualified: 'success',
  'nutanix-supported': 'success',
  'preferred-partner': 'neutral',
};

/** Fixed facet order for Support status (All stays first in the UI). */
const SUPPORT_STATUS_ORDER = [
  'nutanix-supported',
  'preferred-partner',
  'qualified',
];

function supportStatusKeys(counts) {
  return SUPPORT_STATUS_ORDER.filter(key => (counts[key] || 0) > 0);
}

function categoryTone(cat) {
  return CATEGORY_TONES[cat] || 'neutral';
}

function certTone(cert) {
  return CERT_TONES[cert] || 'neutral';
}

const APPLICATION_PANEL_INFO = {
  qualified: {
    title: 'Qualified by Nutanix',
    description:
      'This open source software is curated and supported by Nutanix as part of the NKP platform. As an open source project, Nutanix cannot guarantee that it is bug free nor that bugs will be fixed in a timely manner.',
  },
  'nutanix-supported': {
    title: 'Supported by Nutanix',
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

function supportPanelKey(app) {
  if (!app) return '';
  if (app.type === 'preferred-partner') {
    return app.type;
  }
  if (app.type === 'nkp-catalog') {
    if ((app.certifications || []).includes('nutanix-supported')) {
      return 'nutanix-supported';
    }
    return 'qualified';
  }
  return '';
}

function appHasCertFacet(app, key) {
  if (!key || key === 'all') return true;
  return supportPanelKey(app) === key;
}

function supportBadges(app) {
  const panel = supportPanelKey(app);
  return panel ? [panel] : [];
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

export {
  categoryLabel,
  categoryTone,
  certTone,
  certLabel,
  certDescription,
  panelTitle,
  panelDescription,
  supportPanelKey,
  appHasCertFacet,
  supportBadges,
  supportStatusKeys,
  SUPPORT_STATUS_ORDER,
  canonicalLicense,
  appLicenses,
  appHasLicense,
  licenseDescription,
  NKP_LICENSE_OPTIONS_URL,
};
