import React from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import SchemaValidator from '@site/src/components/SchemaValidator';

export default function SchemaValidatorPage() {
  return (
    <Layout title="Schema validator" description="Validate YAML or JSON against a JSON Schema">
      <main style={{ padding: '2rem 1rem', maxWidth: '900px', margin: '0 auto' }}>
        <p style={{ marginBottom: '1rem' }}>
          <Link to="/docs/api/release">← Catalog Release Specification</Link>
        </p>
        <h1>Validate YAML or JSON</h1>
        <p>
          Paste YAML or JSON below and optionally select a schema. Validation runs in your browser (works on GitHub Pages).
        </p>
        <SchemaValidator />
      </main>
    </Layout>
  );
}
