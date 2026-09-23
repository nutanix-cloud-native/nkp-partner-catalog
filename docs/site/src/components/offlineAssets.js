export const OFFLINE_PDF_PATH = '/offline/nkp-catalog-docs.pdf';
export const OFFLINE_HTML_PATH = '/offline/nkp-catalog-docs.html';

/** Static-file href that Docusaurus does not treat as a missing docs route. */
export function staticFileHref(path) {
  const normalized = path.startsWith('/') ? path : `/${path}`;
  return `pathname://${normalized}`;
}

export function useOfflineAssets() {
  return {
    pdfUrl: staticFileHref(OFFLINE_PDF_PATH),
    htmlUrl: staticFileHref(OFFLINE_HTML_PATH),
  };
}
