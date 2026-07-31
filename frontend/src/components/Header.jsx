import React from 'react';
import { useNavigate, useLocation } from '../router';
import { Moon, Globe } from 'lucide-react';
import VLearnLogo from './VLearnLogo';

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();

  const isMyCourses = location.pathname === '/my-courses';
  const isDashboard = location.pathname === '/dashboard' || location.pathname === '/';

  return (
    <header className="vlearn-header-exact">
      {/* Left Brand Logo: V (Red) + Learn (Blue) */}
      <VLearnLogo onClick={() => navigate('/dashboard')} size={32} />

      {/* Center Navigation Links */}
      <nav style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
        <button
          onClick={() => navigate('/dashboard')}
          style={{
            border: 'none',
            background: 'none',
            fontSize: '15px',
            fontFamily: '"Be Vietnam Pro", sans-serif',
            fontWeight: isDashboard ? 700 : 500,
            color: isDashboard ? '#0e2439' : '#64748b',
            cursor: 'pointer',
            padding: '8px 4px',
            borderBottom: isDashboard ? '2.5px solid #0e2439' : '2.5px solid transparent'
          }}
        >
          Trang chủ
        </button>

        <button
          onClick={() => navigate('/my-courses')}
          style={{
            border: 'none',
            background: 'none',
            fontSize: '15px',
            fontFamily: '"Be Vietnam Pro", sans-serif',
            fontWeight: isMyCourses ? 700 : 500,
            color: isMyCourses ? '#0e2439' : '#64748b',
            cursor: 'pointer',
            padding: '8px 4px',
            borderBottom: isMyCourses ? '2.5px solid #0e2439' : '2.5px solid transparent'
          }}
        >
          Khóa học của tôi
        </button>
      </nav>

      {/* Right Controls & User Profile */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
        {/* Language Pill */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          backgroundColor: '#f1f5f9',
          border: '1px solid #e2e8f0',
          borderRadius: '16px',
          padding: '4px 12px',
          fontSize: '13px',
          fontFamily: '"Be Vietnam Pro", sans-serif',
          fontWeight: 600,
          color: '#475569',
          cursor: 'pointer'
        }}>
          <Globe size={15} />
          <span>VI</span>
        </div>

        {/* Dark Mode Icon */}
        <button style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          color: '#64748b',
          display: 'flex',
          alignItems: 'center'
        }}>
          <Moon size={20} />
        </button>

        {/* User Avatar */}
        <div style={{
          width: '36px',
          height: '36px',
          borderRadius: '50%',
          backgroundColor: '#0284c7',
          color: '#ffffff',
          fontWeight: 700,
          fontSize: '14px',
          fontFamily: '"Be Vietnam Pro", sans-serif',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          boxShadow: '0 2px 6px rgba(2,132,199,0.3)'
        }}>
          H
        </div>
      </div>
    </header>
  );
}
