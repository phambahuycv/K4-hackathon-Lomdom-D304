import React from 'react';
import { useNavigate } from '../router';
import { BookOpen, ArrowRight, Notebook, Sparkles } from 'lucide-react';

export default function MyCoursesPage() {
  const navigate = useNavigate();

  return (
    <div style={{ maxWidth: '1320px', margin: '0 auto', padding: '28px 64px 48px 64px' }}>
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
        <div>
          <span style={{ fontSize: '11px', fontWeight: 800, color: '#d32027', letterSpacing: '0.5px' }}>
            VLEARN · VINUNI AI THỰC CHIẾN
          </span>
          <h1 style={{ fontSize: '22px', fontWeight: 800, color: '#0e2439', margin: '2px 0 4px 0' }}>
            Khóa học của tôi
          </h1>
          <p style={{ fontSize: '13px', color: '#64748b' }}>
            Mỗi khóa học lưu trữ tài liệu, giáo án và phần ghi chú tương tác của riêng bạn.
          </p>
        </div>

        {/* Top Right Pill */}
        <div style={{
          backgroundColor: '#ffffff',
          border: '1px solid #cbd5e1',
          borderRadius: '16px',
          padding: '5px 14px',
          fontSize: '12px',
          fontWeight: 600,
          color: '#475569',
          boxShadow: '0 1px 2px rgba(0,0,0,0.02)'
        }}>
          1 khóa học đang theo học
        </div>
      </div>

      {/* Main Course Card */}
      <div style={{ maxWidth: '380px', marginBottom: '24px' }}>
        <div className="vlearn-card" style={{ padding: '20px', border: '1px solid #e2e8f0' }}>
          {/* Header Row */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              backgroundColor: '#f8fafc',
              border: '1px solid #e2e8f0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#0e2439'
            }}>
              <BookOpen size={18} />
            </div>

            <span style={{
              backgroundColor: '#dcfce7',
              color: '#166534',
              padding: '3px 10px',
              borderRadius: '9999px',
              fontSize: '11px',
              fontWeight: 700
            }}>
              0% đọc
            </span>
          </div>

          {/* Titles */}
          <span style={{ fontSize: '10px', fontWeight: 800, color: '#94a3b8', letterSpacing: '0.5px' }}>
            COMP2010
          </span>
          <h2 style={{ fontSize: '17px', fontWeight: 800, color: '#0e2439', margin: '2px 0 4px 0' }}>
            Khoá 3 + 4 Phase 1
          </h2>
          <p style={{ fontSize: '12px', color: '#64748b', marginBottom: '18px' }}>
            Khóa học Khoá 3 + 4 Phase 1
          </p>

          <hr style={{ border: 'none', borderTop: '1px solid #f1f5f9', margin: '0 0 16px 0' }} />

          {/* Bottom Actions */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{
              fontSize: '12px',
              fontWeight: 600,
              color: '#10b981',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}>
              <Sparkles size={13} color="#10b981" />
              Sẵn sàng học
            </span>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <button style={{
                backgroundColor: '#ffffff',
                border: '1px solid #cbd5e1',
                borderRadius: '16px',
                padding: '4px 10px',
                fontSize: '12px',
                fontWeight: 600,
                color: '#334155',
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                cursor: 'pointer'
              }}>
                <Notebook size={13} />
                Sổ tay học tập
              </button>

              <button
                onClick={() => navigate('/course/comp2010')}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '13px',
                  fontWeight: 800,
                  color: '#d32027',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  cursor: 'pointer',
                  padding: '2px 0'
                }}
              >
                Mở khóa học <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Sổ tay học tập Card */}
      <div
        className="vlearn-card"
        style={{
          padding: '18px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          cursor: 'pointer',
          border: '1px solid #e2e8f0',
          maxWidth: '540px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '10px',
            backgroundColor: '#f8fafc',
            border: '1px solid #e2e8f0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#0e2439'
          }}>
            <Notebook size={18} />
          </div>
          <div>
            <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#0e2439', marginBottom: '2px' }}>
              Sổ tay học tập
            </h3>
            <p style={{ fontSize: '12px', color: '#64748b' }}>
              Ghi chú, Flashcard và phần kiến thức cần củng cố của bạn.
            </p>
          </div>
        </div>

        <ArrowRight size={18} color="#64748b" />
      </div>
    </div>
  );
}
