import React, {useEffect, useMemo, useState} from 'react';
import {copyText} from './YamlCodePanel';
import airgappedTemplate from '@site/src/data/catalog-airgapped-bundle.json';

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

export function substituteVars(template, vars) {
  return String(template).replace(/\{\{(\w+)\}\}/g, (_, key) =>
    vars[key] != null ? String(vars[key]) : `{{${key}}}`,
  );
}

function renderCommandHtml(cmdTemplate, vars) {
  return escapeHtml(cmdTemplate).replace(/\{\{(\w+)\}\}/g, (_, key) => {
    const val = vars[key] != null ? String(vars[key]) : `{{${key}}}`;
    return `<span class="cat-cmd-var">${escapeHtml(val)}</span>`;
  });
}

/** https://github.com/org/repo → git@github.com:org/repo.git */
export function httpsToGitClone(repoUrl) {
  const m = String(repoUrl || '').match(
    /^https?:\/\/github\.com\/([^/]+)\/([^/.]+?)(?:\.git)?\/?$/i,
  );
  if (m) return `git@github.com:${m[1]}/${m[2]}.git`;
  return String(repoUrl || '');
}

export function catalogDirFromRepo(repoUrl, catalogId) {
  const m = String(repoUrl || '').match(/\/([^/]+?)(?:\.git)?\/?$/);
  if (m) return m[1];
  return catalogId || 'catalog';
}

export function buildAirgappedVars({
  name,
  version,
  displayName,
  catalogRepo,
  catalogId,
}) {
  const catalogCloneUrl = httpsToGitClone(catalogRepo);
  const catalogDir = catalogDirFromRepo(catalogRepo, catalogId);
  return {
    name,
    version,
    displayName: displayName || name,
    catalogCloneUrl,
    catalogDir,
    bundleFile: `./${name}-${version}.tar`,
    registry: 'oci://<registry>/<org>',
    ociAppUrl: `oci://<registry>/<org>/${catalogDir}/${name}`,
    workspace: '<workspace>',
  };
}

function StepCopyButton({text}) {
  const [copied, setCopied] = useState(false);
  async function onCopy() {
    const ok = await copyText(text);
    if (!ok) return;
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  }
  return (
    <button
      type="button"
      className={`cat-step-copy${copied ? ' is-copied' : ''}`}
      onClick={onCopy}
      aria-label={copied ? 'Copied' : 'Copy to clipboard'}
      title={copied ? 'Copied' : 'Copy to clipboard'}
    >
      {copied ? (
        <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
          <path
            fill="currentColor"
            d="M13.78 4.22a.75.75 0 0 1 0 1.06l-7.25 7.25a.75.75 0 0 1-1.06 0L2.22 9.28a.75.75 0 0 1 1.06-1.06L6 10.94l6.72-6.72a.75.75 0 0 1 1.06 0z"
          />
        </svg>
      ) : (
        <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
          <path
            fill="currentColor"
            d="M0 6.75C0 5.784.784 5 1.75 5h1.5a.75.75 0 0 1 0 1.5h-1.5a.25.25 0 0 0-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 0 0 .25-.25v-1.5a.75.75 0 0 1 1.5 0v1.5A1.75 1.75 0 0 1 9.25 16h-7.5A1.75 1.75 0 0 1 0 14.25Z"
          />
          <path
            fill="currentColor"
            d="M5 1.75C5 .784 5.784 0 6.75 0h7.5C15.216 0 16 .784 16 1.75v7.5A1.75 1.75 0 0 1 14.25 11h-7.5A1.75 1.75 0 0 1 5 9.25Zm1.75-.25a.25.25 0 0 0-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 0 0 .25-.25v-7.5a.25.25 0 0 0-.25-.25Z"
          />
        </svg>
      )}
    </button>
  );
}

/**
 * OperatorHub-style modal for airgapped bundle build / push / register steps.
 */
export default function AirgappedBundleModal({
  open,
  onClose,
  displayName,
  vars,
}) {
  const steps = useMemo(() => {
    const list = (airgappedTemplate && airgappedTemplate.steps) || [];
    return list.map((step) => {
      const plain = substituteVars(step.command, vars);
      return {
        ...step,
        plain,
        html: renderCommandHtml(step.command, vars),
      };
    });
  }, [vars]);

  useEffect(() => {
    if (!open) return undefined;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    function onKey(e) {
      if (e.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener('keydown', onKey);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="cat-modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="cat-airgap-modal-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="cat-modal">
        <div className="cat-modal-header">
          <div className="cat-modal-heading">
            <h2 id="cat-airgap-modal-title">Build airgapped bundle</h2>
            {displayName ? (
              <p className="cat-modal-subtitle">{displayName}</p>
            ) : null}
          </div>
          <button
            type="button"
            className="cat-modal-close"
            aria-label="Close"
            onClick={onClose}
          >
            ×
          </button>
        </div>
        <div className="cat-modal-body">
          <p className="cat-modal-note">
            Copy each command in order to build, push, and register a catalog
            bundle. Highlighted values are filled for this app and version;
            replace <code>&lt;angle brackets&gt;</code> with your own.
          </p>
          {steps.map((step, i) => (
            <div
              key={`${step.title}-${i}`}
              className={`cat-step${step.optional ? ' cat-step--optional' : ''}`}
            >
              <div className="cat-step-label">
                {i + 1}. {step.title}
                {step.optional ? (
                  <span className="cat-step-optional">Optional</span>
                ) : null}
              </div>
              {step.note ? (
                <div className="cat-step-note">{step.note}</div>
              ) : null}
              <div className="cat-step-row">
                <pre
                  className="cat-step-cmd"
                  dangerouslySetInnerHTML={{__html: step.html}}
                />
                <StepCopyButton text={step.plain} />
              </div>
            </div>
          ))}
        </div>
        <div className="cat-modal-footer">
          <button type="button" className="cat-btn cat-btn--primary" onClick={onClose}>
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
