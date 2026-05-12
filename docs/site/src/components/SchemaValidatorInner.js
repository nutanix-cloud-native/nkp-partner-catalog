import React, { useState, useCallback, useEffect } from 'react';
import useBaseUrl from '@docusaurus/useBaseUrl';
import { useColorMode } from '@docusaurus/theme-common';
import JSONSchemaViewer from '@theme/JSONSchemaViewer';
import JSONSchemaEditor from '@theme/JSONSchemaEditor';
import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import yaml from 'js-yaml';

const DEFAULT_SCHEMA_OPTIONS = [
  { label: 'Application metadata', path: 'schemas/v1/applicationmetadata.schema.json' },
  { label: 'Application user inputs', path: 'schemas/v1/applicationuserinputs.schema.json' },
];

const EDITOR_HEIGHT = '60vh';

/**
 * Build a sample object from a JSON Schema with empty/minimal values (no fake data).
 * Handles object, array, string, number, integer, boolean; uses $defs for $ref when root provided.
 */
function schemaToEmptySample(schema, rootSchema = schema) {
  if (schema == null || typeof schema !== 'object') return null;
  if (schema.$ref && typeof schema.$ref === 'string') {
    const path = schema.$ref.replace(/^#\/?/, '').split('/').filter(Boolean);
    let target = rootSchema;
    for (let i = 0; i < path.length && target != null; i++) {
      target = target[path[i]];
    }
    return target != null ? schemaToEmptySample(target, rootSchema) : null;
  }
  if (schema.oneOf?.[0]) return schemaToEmptySample(schema.oneOf[0], rootSchema);
  if (schema.anyOf?.[0]) return schemaToEmptySample(schema.anyOf[0], rootSchema);
  if (schema.allOf?.length) return schemaToEmptySample(schema.allOf[0], rootSchema);
  const type = Array.isArray(schema.type) ? schema.type[0] : schema.type;
  switch (type) {
    case 'object': {
      const obj = {};
      const props = schema.properties || {};
      const required = new Set(schema.required || []);
      const keys = new Set([...Object.keys(props), ...required]);
      keys.forEach((key) => {
        if (props[key]) obj[key] = schemaToEmptySample(props[key], rootSchema);
        else obj[key] = null;
      });
      return obj;
    }
    case 'array':
      return [];
    case 'string':
      return '';
    case 'number':
    case 'integer':
      return 0;
    case 'boolean':
      return false;
    case 'null':
      return null;
    default:
      if (schema.enum?.length) return schema.enum[0];
      if (schema.properties) return schemaToEmptySample({ ...schema, type: 'object' }, rootSchema);
      return null;
  }
}

export default function SchemaValidatorInner({
  schemaOptions = DEFAULT_SCHEMA_OPTIONS,
  showSchemaList = false,
  schemaListOptions = DEFAULT_SCHEMA_OPTIONS,
}) {
  const baseUrl = useBaseUrl('/');
  const { colorMode } = useColorMode();
  const [input, setInput] = useState('');
  const [editorFormat, setEditorFormat] = useState('yaml'); // 'json' | 'yaml'
  const [selectedSchema, setSelectedSchema] = useState(schemaOptions[0]?.path ?? '');
  const [schemaObject, setSchemaObject] = useState(null);
  const [schemaLoadError, setSchemaLoadError] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [schemaByPath, setSchemaByPath] = useState({});

  // When showSchemaList: fetch all schemas for the collapsible reference section
  useEffect(() => {
    if (!showSchemaList || !schemaListOptions?.length) return;
    const base = baseUrl.endsWith('/') ? baseUrl : baseUrl + '/';
    setSchemaByPath((prev) => {
      const next = { ...prev };
      schemaListOptions.forEach((opt) => {
        next[opt.path] = next[opt.path] ?? 'loading';
      });
      return next;
    });
    schemaListOptions.forEach((opt) => {
      const pathPart = opt.path.startsWith('/') ? opt.path.slice(1) : opt.path;
      const url = opt.path.startsWith('http') ? opt.path : base + pathPart;
      fetch(url)
        .then((res) => (res.ok ? res.json() : Promise.reject(new Error(`${res.status}`))))
        .then((json) => setSchemaByPath((prev) => ({ ...prev, [opt.path]: json })))
        .catch(() => setSchemaByPath((prev) => ({ ...prev, [opt.path]: null })));
    });
  }, [showSchemaList, baseUrl, schemaListOptions]);

  useEffect(() => {
    if (!selectedSchema) {
      setSchemaObject(null);
      setSchemaLoadError(null);
      return;
    }
    const base = baseUrl.endsWith('/') ? baseUrl : baseUrl + '/';
    const pathPart = selectedSchema.startsWith('/') ? selectedSchema.slice(1) : selectedSchema;
    const schemaUrl = selectedSchema.startsWith('http') ? selectedSchema : base + pathPart;
    setSchemaLoadError(null);
    setSchemaObject(null);
    fetch(schemaUrl)
      .then((res) => {
        if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
        return res.json();
      })
      .then((json) => setSchemaObject(json))
      .catch((e) => {
        setSchemaObject(null);
        setSchemaLoadError(e.message || 'Failed to load schema');
      });
  }, [selectedSchema, baseUrl]);

  // When the selected schema loads (or changes), reset the editor to that schema's empty sample (YAML by default)
  useEffect(() => {
    if (schemaObject) {
      try {
        const sample = schemaToEmptySample(schemaObject);
        setInput(yaml.dump(sample != null ? sample : {}));
      } catch (_) {
        // ignore
      }
    }
  }, [schemaObject]);

  const validate = useCallback(async () => {
    setResult(null);
    if (!input.trim()) {
      setResult({ valid: false, error: 'Paste YAML or JSON to validate.' });
      return;
    }

    let data;
    try {
      const trimmed = input.trim();
      if (trimmed.startsWith('{') || trimmed.startsWith('[')) {
        data = JSON.parse(trimmed);
      } else {
        data = yaml.load(trimmed);
      }
    } catch (e) {
      setResult({ valid: false, error: `Parse error: ${e.message}` });
      return;
    }

    if (!selectedSchema) {
      setResult({ valid: true, message: 'Parsed successfully. No schema selected for validation.' });
      return;
    }

    setLoading(true);
    try {
      const base = baseUrl.endsWith('/') ? baseUrl : baseUrl + '/';
      const pathPart = selectedSchema.startsWith('/') ? selectedSchema.slice(1) : selectedSchema;
      const schemaUrl = selectedSchema.startsWith('http') ? selectedSchema : base + pathPart;
      const res = await fetch(schemaUrl);
      if (!res.ok) {
        setResult({ valid: false, error: `Failed to load schema: ${res.status} ${res.statusText}` });
        return;
      }
      const schema = await res.json();
      const ajv = new Ajv({ allErrors: true, validateSchema: false });
      addFormats(ajv);
      const validateFn = ajv.compile(schema);
      const valid = validateFn(data);
      if (valid) {
        setResult({ valid: true, message: 'Valid against the selected schema.' });
      } else {
        setResult({
          valid: false,
          error: 'Validation failed.',
          details: validateFn.errors,
        });
      }
    } catch (e) {
      setResult({ valid: false, error: e.message || 'Validation failed.' });
    } finally {
      setLoading(false);
    }
  }, [input, selectedSchema, baseUrl]);

  return (
    <div className="schema-validator" style={{ marginTop: '0.75rem', marginBottom: '0.75rem' }}>
      {/* Optional: both schemas in collapsible sections (default collapsed) */}
      {showSchemaList && schemaListOptions?.length > 0 && (
        <div style={{ marginBottom: '2rem' }}>
          <h2 id="schema-reference" style={{ fontSize: '1.25rem', marginBottom: '0.75rem' }}>
            Schema reference
          </h2>
          {schemaListOptions.map((opt) => (
            <details
              key={opt.path}
              style={{
                marginBottom: '0.75rem',
                border: '1px solid var(--ifm-color-emphasis-200)',
                borderRadius: '6px',
                overflow: 'hidden',
              }}
            >
              <summary
                style={{
                  padding: '0.5rem 0.75rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  listStyle: 'none',
                }}
              >
                {opt.label}
              </summary>
              <div style={{ padding: '0.75rem 1rem' }}>
                {schemaByPath[opt.path] === 'loading' && <span>Loading…</span>}
                {schemaByPath[opt.path] === null && (
                  <span style={{ color: 'var(--ifm-color-danger)' }}>Failed to load schema.</span>
                )}
                {schemaByPath[opt.path] &&
                  schemaByPath[opt.path] !== 'loading' &&
                  schemaByPath[opt.path] !== null && (
                    <JSONSchemaViewer schema={schemaByPath[opt.path]} />
                  )}
              </div>
            </details>
          ))}
        </div>
      )}

      {showSchemaList && (
        <h2 id="validator" style={{ fontSize: '1.25rem', marginBottom: '0.75rem' }}>
          Validator
        </h2>
      )}

      {/* Schema load error */}
      {schemaLoadError && (
        <div
          style={{
            marginBottom: '0.75rem',
            padding: '0.75rem',
            border: '1px solid var(--ifm-color-danger)',
            borderRadius: '4px',
            color: 'var(--ifm-color-danger)',
          }}
        >
          {schemaLoadError}
        </div>
      )}

      {/* Full-width editor (JSON or YAML, theme-aware) */}
      <div style={{ marginBottom: '1rem', width: '100%' }} className="schema-validator__panels">
        <div className="schema-validator__editor-wrap">
          <div className="schema-validator__editor-bar" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <span className="schema-validator__editor-tab">
                document.{editorFormat}
              </span>
              <label htmlFor="editor-format" style={{ fontSize: '0.75rem', color: 'var(--ifm-color-emphasis-600)' }}>
                Format:
              </label>
              <select
                id="editor-format"
                value={editorFormat}
                onChange={(e) => setEditorFormat(e.target.value)}
                style={{
                  padding: '0.2rem 0.5rem',
                  fontSize: '0.8125rem',
                  border: '1px solid var(--ifm-color-emphasis-300)',
                  borderRadius: '4px',
                  background: 'var(--ifm-background-color)',
                  color: 'var(--ifm-font-color-base)',
                }}
              >
                <option value="json">JSON</option>
                <option value="yaml">YAML</option>
              </select>
            </div>
            <button
              type="button"
              onClick={validate}
              disabled={loading}
              className="button button--primary"
              style={{ flexShrink: 0 }}
            >
              {loading ? 'Validating…' : 'Validate'}
            </button>
          </div>
          <div className="schema-validator__editor-body">
            <JSONSchemaEditor
              theme={colorMode === 'dark' ? 'vs-dark' : 'vs'}
              schema={editorFormat === 'json' ? (schemaObject || {}) : {}}
              value={input}
              onChange={(v) => setInput(v || '')}
              height={EDITOR_HEIGHT}
              language={editorFormat}
              options={{
                lineNumbers: 'on',
                minimap: { enabled: false },
                folding: true,
                scrollBeyondLastLine: false,
                padding: { top: 14, bottom: 14 },
                renderLineHighlight: 'line',
                glyphMargin: false,
                fontSize: 14,
                lineHeight: 22,
                fontFamily: 'Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
                fontLigatures: false,
                cursorBlinking: 'smooth',
                smoothScrolling: true,
                scrollbar: {
                  verticalScrollbarSize: 10,
                  horizontalScrollbarSize: 10,
                  useShadows: false,
                },
              }}
            />
          </div>
        </div>
      </div>

      {/* Result */}
      {result && (
        <div style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center' }}>
          <span
            role="alert"
            style={{
              padding: '0.25rem 0.5rem',
              borderRadius: '4px',
              fontSize: '0.875rem',
              backgroundColor: result.valid
                ? 'var(--ifm-color-success-contrast-background)'
                : 'var(--ifm-color-danger-contrast-background)',
              color: result.valid
                ? 'var(--ifm-color-success-contrast-foreground)'
                : 'var(--ifm-color-danger-contrast-foreground)',
            }}
          >
            {result.valid ? result.message : result.error}
          </span>
        </div>
      )}
      {result && !result.valid && result.details && (
        <pre
          style={{
            marginBottom: '1rem',
            padding: '0.75rem',
            fontSize: '12px',
            overflow: 'auto',
            border: '1px solid var(--ifm-color-emphasis-300)',
            borderRadius: '4px',
          }}
        >
          {JSON.stringify(result.details, null, 2)}
        </pre>
      )}
    </div>
  );
}
