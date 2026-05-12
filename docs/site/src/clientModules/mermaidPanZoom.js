/**
 * Client module that enables pan/zoom/drag on Mermaid diagrams.
 * Finds all .docusaurus-mermaid-container elements with an SVG and applies svg-pan-zoom.
 */
import ExecutionEnvironment from '@docusaurus/ExecutionEnvironment';

const MERMAID_CONTAINER_CLASS = 'docusaurus-mermaid-container';
const DATA_INIT = 'data-mermaid-panzoom-init';

function initMermaidPanZoom() {
  if (!ExecutionEnvironment.canUseDOM || typeof document === 'undefined') return;
  const containers = document.querySelectorAll(`.${MERMAID_CONTAINER_CLASS}`);
  containers.forEach((container) => {
    if (container.getAttribute(DATA_INIT) === 'true') return;
    const svg = container.querySelector('svg');
    if (!svg) return;
    try {
      // eslint-disable-next-line global-require
      const svgPanZoom = require('svg-pan-zoom');
      const applySize = () => {
        const w = container.clientWidth || 800;
        const h = Math.max(
          container.clientHeight,
          typeof window !== 'undefined' ? window.innerHeight - 140 : 400,
          400
        );
        svg.setAttribute('width', String(w));
        svg.setAttribute('height', String(h));
        if (container._mermaidPanZoomInstance) {
          container._mermaidPanZoomInstance.resize();
          container._mermaidPanZoomInstance.fit();
          container._mermaidPanZoomInstance.center();
        }
      };
      requestAnimationFrame(() => {
        applySize();
        const instance = svgPanZoom(svg, {
          panEnabled: true,
          zoomEnabled: true,
          dblClickZoomEnabled: true,
          mouseWheelZoomEnabled: true,
          controlIconsEnabled: true,
          fit: true,
          center: true,
          minZoom: 0.2,
          maxZoom: 15,
        });
        instance.resize();
        instance.fit();
        instance.center();
        container.setAttribute(DATA_INIT, 'true');
        container._mermaidPanZoomInstance = instance;
        const onResize = debounce(() => applySize(), 100);
        window.addEventListener('resize', onResize);
        container._mermaidPanZoomResizeCleanup = () =>
          window.removeEventListener('resize', onResize);
      });
    } catch (e) {
      // Ignore errors (e.g. SVG not ready)
    }
  });
}

function debounce(fn, ms) {
  let timeout;
  return function debounced() {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn(), ms);
  };
}

export function onRouteDidUpdate() {
  if (!ExecutionEnvironment.canUseDOM) return;
  initMermaidPanZoom();
  setTimeout(initMermaidPanZoom, 300);
  setTimeout(initMermaidPanZoom, 1000);
}

if (ExecutionEnvironment.canUseDOM) {
  initMermaidPanZoom();
  setTimeout(initMermaidPanZoom, 500);
  setTimeout(initMermaidPanZoom, 1500);
  const debouncedInit = debounce(initMermaidPanZoom, 150);
  const observer = new MutationObserver(debouncedInit);
  observer.observe(document.body, { childList: true, subtree: true });
}
