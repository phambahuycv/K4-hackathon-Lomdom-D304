import React from 'react';

export default function VLearnLogo({ onClick, size = 32 }) {
  return (
    <div
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        cursor: onClick ? 'pointer' : 'default',
        userSelect: 'none'
      }}
    >
      {/* Icon V */}
      <img
        src="/icon/faviconV2.png"
        alt="VLearn Icon"
        style={{ height: `${size}px`, width: 'auto', display: 'block', objectFit: 'contain' }}
      />

      {/* Styled Brand Text: V (Red) + Learn (Navy-Dark #0e2439) */}
      <span style={{
        fontSize: `${size * 0.72}px`,
        fontWeight: 800,
        fontFamily: '"Be Vietnam Pro", sans-serif',
        letterSpacing: '-0.5px',
        lineHeight: 1
      }}>
        <span style={{ color: '#d32027' }}>V</span>
        <span style={{ color: '#0e2439' }}>Learn</span>
      </span>
    </div>
  );
}
