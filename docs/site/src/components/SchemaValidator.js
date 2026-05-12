import React from 'react';
import BrowserOnly from '@docusaurus/BrowserOnly';

const boxStyle = {
  fontFamily: 'monospace',
  fontSize: '13px',
  padding: '0.75rem',
  border: '1px solid var(--ifm-color-emphasis-300)',
  borderRadius: '4px',
  background: 'var(--ifm-background-surface-color)',
  minHeight: '60vh',
};

export default function SchemaValidator(props) {
  return (
    <BrowserOnly
      fallback={
        <div className="schema-validator" style={{ marginTop: '0.75rem', marginBottom: '0.75rem' }}>
          <div style={{ ...boxStyle, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            Loading schema validator…
          </div>
        </div>
      }
    >
      {() => {
        const SchemaValidatorInner = require('./SchemaValidatorInner').default;
        return <SchemaValidatorInner {...props} />;
      }}
    </BrowserOnly>
  );
}
