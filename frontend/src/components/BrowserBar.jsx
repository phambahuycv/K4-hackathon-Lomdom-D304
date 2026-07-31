import React from 'react';
import { useLocation } from '../router';
import { Lock, RotateCw, ArrowLeft, ArrowRight, Plus, ExternalLink, Moon } from 'lucide-react';

export default function BrowserBar() {
  const location = useLocation();
  const currentPath = location.pathname + location.search;

  return (
    <div style={{
      backgroundColor: '#f1f5f9',
      borderBottom: '1px solid #e2e8f0',
      fontSize: '13px',
      color: '#475569',
      userSelect: 'none'
    }}>
      {/* Top Browser Tab Bar */}
      <div style={{ display: 'flex', alignItems: 'center', padding: '6px 12px 0 12px', gap: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginRight: '8px' }}>
          <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#ef4444' }}></div>
          <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#f59e0b' }}></div>
          <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#10b981' }}></div>
        </div>

        {/* Browser Tab */}
        <div style={{
          backgroundColor: '#ffffff',
          padding: '6px 16px',
          borderRadius: '8px 8px 0 0',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontSize: '12px',
          fontWeight: 500,
          color: '#1e293b',
          borderTop: '1px solid #cbd5e1',
          borderLeft: '1px solid #cbd5e1',
          borderRight: '1px solid #cbd5e1',
          maxWidth: '240px'
        }}>
          <img src="/icon/faviconV2.png" alt="favicon" style={{ width: '14px', height: '14px', objectFit: 'contain' }} onError={(e) => { e.target.style.display = 'none'; }} />
          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            VLearn - VinUni AI...
          </span>
        </div>

        <button style={{ border: 'none', background: 'none', cursor: 'pointer', padding: '4px', color: '#64748b' }}>
          <Plus size={14} />
        </button>
      </div>

      {/* URL Address Bar */}
      <div style={{
        backgroundColor: '#ffffff',
        padding: '6px 12px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        borderTop: '1px solid #e2e8f0'
      }}>
        <div style={{ display: 'flex', gap: '8px', color: '#94a3b8' }}>
          <ArrowLeft size={16} style={{ cursor: 'pointer' }} />
          <ArrowRight size={16} style={{ cursor: 'pointer' }} />
          <RotateCw size={15} style={{ cursor: 'pointer' }} />
        </div>

        {/* Input Bar */}
        <div style={{
          flex: 1,
          backgroundColor: '#f8fafc',
          borderRadius: '20px',
          padding: '4px 14px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          border: '1px solid #e2e8f0',
          fontSize: '13px'
        }}>
          <Lock size={12} color="#16a34a" />
          <span style={{ color: '#0f172a', fontWeight: 500 }}>vlearn.dev</span>
          <span style={{ color: '#64748b' }}>{currentPath}</span>
        </div>
      </div>
    </div>
  );
}
