import React from 'react';
import useBaseUrl from '@docusaurus/useBaseUrl';

export function Tag({ children, tone = 'neutral', tip, href }) {
  const className = `cat-tag cat-tag--${tone}${tip ? ' cat-tip' : ''}`;
  if (href) {
    return (
      <a
        className={className}
        data-tip={tip}
        href={href}
        target="_blank"
        rel="noopener noreferrer"
      >
        {children}
      </a>
    );
  }
  return (
    <span className={className} data-tip={tip}>
      {children}
    </span>
  );
}

export function AppIcon({ icon, name, size = 48 }) {
  // Hooks must run unconditionally; unused path is ignored when icon is absent/base64.
  const staticIcon = useBaseUrl(icon && icon.startsWith('/') ? icon : '/');

  if (!icon) {
    return (
      <div className="cat-icon-placeholder" style={{ width: size, height: size }}>
        {name.charAt(0).toUpperCase()}
      </div>
    );
  }

  let src;
  if (icon.startsWith('http://') || icon.startsWith('https://')) {
    src = icon;
  } else if (icon.startsWith('/')) {
    src = staticIcon;
  } else {
    // Legacy inline base64 from older catalog-data.
    const mime = icon.startsWith('iVBORw0KGgo') ? 'image/png' : 'image/svg+xml';
    src = `data:${mime};base64,${icon}`;
  }

  return (
    <img
      className="cat-icon-img"
      src={src}
      alt=""
      width={size}
      height={size}
      onError={(event) => {
        event.currentTarget.style.display = 'none';
      }}
    />
  );
}
