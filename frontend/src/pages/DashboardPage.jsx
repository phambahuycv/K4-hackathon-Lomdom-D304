import React from 'react';
import { useNavigate } from '../router';
import { BookOpen, Activity, ArrowRight } from 'lucide-react';

export default function DashboardPage() {
  const navigate = useNavigate();

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '36px 40px 60px 40px' }}>
      {/* Top Header Section */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px' }}>
        <div>
          <span style={{ fontSize: '12.5px', fontWeight: 800, color: '#d32027', letterSpacing: '0.5px' }}>
            VLEARN · VINUNI AI THỰC CHIẾN
          </span>
          <h1 style={{ fontSize: '26px', fontWeight: 800, color: '#0e2439', margin: '4px 0 8px 0' }}>
            Không gian học tập VLearn
          </h1>
          <p style={{ fontSize: '14px', color: '#64748b' }}>
            Theo dõi tiến độ, học liệu và phần kiến thức cần củng cố tại VinUni AI Thực Chiến.
          </p>
        </div>

        {/* Top Right Pill */}
        <div style={{
          backgroundColor: '#ffffff',
          border: '1px solid #cbd5e1',
          borderRadius: '20px',
          padding: '6px 16px',
          fontSize: '13px',
          fontWeight: 600,
          color: '#475569',
          boxShadow: '0 1px 2px rgba(0,0,0,0.02)'
        }}>
          1 khóa học đang theo học
        </div>
      </div>

      {/* Hero Welcome Card */}
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '18px',
        borderTop: '5px solid #0e2439',
        boxShadow: '0 2px 18px rgba(0,0,0,0.04)',
        position: 'relative',
        overflow: 'hidden',
        padding: '32px 40px',
        marginBottom: '28px'
      }}>
        {/* Right Red Ribbon Graphic Accent */}
        <div style={{
          position: 'absolute',
          top: 0,
          right: 0,
          bottom: 0,
          width: '68px',
          backgroundColor: '#d32027',
          transform: 'skewX(-14deg) translateX(18px)',
          transformOrigin: 'top right'
        }} />

        <div style={{ position: 'relative', zIndex: 2, maxWidth: '760px' }}>
          <span style={{ fontSize: '12px', fontWeight: 800, color: '#d32027', letterSpacing: '0.5px' }}>
            VLEARN · VINUNI AI THỰC CHIẾN
          </span>
          <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#0e2439', margin: '6px 0 12px 0' }}>
            Chào mừng trở lại, BÙI ĐỨC HIẾU!
          </h2>
          <p style={{ fontSize: '14px', lineHeight: '1.6', color: '#475569', marginBottom: '22px' }}>
            VLearn đang tổng hợp tiến độ đọc và các tín hiệu học tập. Mở Khóa học của tôi để tiếp tục ngày học hoặc trao đổi cùng VLearn Tutor.
          </p>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{
              backgroundColor: '#e0f2fe',
              color: '#0284c7',
              padding: '6px 16px',
              borderRadius: '9999px',
              fontSize: '12.5px',
              fontWeight: 600,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#0284c7' }}></span>
              Tín hiệu học tập đang hoạt động
            </span>

            <span style={{
              backgroundColor: '#fff1f2',
              color: '#e11d48',
              border: '1px solid #fecdd3',
              padding: '6px 16px',
              borderRadius: '9999px',
              fontSize: '12.5px',
              fontWeight: 700
            }}>
              Đã đọc 0/6 ngày học
            </span>
          </div>
        </div>
      </div>

      {/* Middle Row Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
        {/* Card 1: Khóa học */}
        <div className="vlearn-card" style={{ padding: '24px 28px', display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            backgroundColor: '#f8fafc',
            border: '1px solid #e2e8f0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#0e2439'
          }}>
            <BookOpen size={22} />
          </div>
          <div>
            <div style={{ fontSize: '11px', fontWeight: 800, color: '#94a3b8', letterSpacing: '0.5px' }}>
              KHÓA HỌC
            </div>
            <div style={{ fontSize: '26px', fontWeight: 800, color: '#0e2439', marginTop: '2px' }}>
              1
            </div>
          </div>
        </div>

        {/* Card 2: Câu hỏi với Tutor */}
        <div className="vlearn-card" style={{ padding: '24px 28px', display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            backgroundColor: '#f8fafc',
            border: '1px solid #e2e8f0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#0e2439'
          }}>
            <Activity size={22} />
          </div>
          <div>
            <div style={{ fontSize: '11px', fontWeight: 800, color: '#94a3b8', letterSpacing: '0.5px' }}>
              CÂU HỎI VỚI TUTOR
            </div>
            <div style={{ fontSize: '26px', fontWeight: 800, color: '#0e2439', marginTop: '2px' }}>
              2
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Main Action Card: Xem khóa học của tôi */}
      <div
        className="vlearn-card"
        onClick={() => navigate('/my-courses')}
        style={{
          padding: '24px 28px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          cursor: 'pointer',
          border: '1px solid #e2e8f0'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            backgroundColor: '#f8fafc',
            border: '1px solid #e2e8f0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#0e2439'
          }}>
            <BookOpen size={22} />
          </div>
          <div>
            <h3 style={{ fontSize: '16.5px', fontWeight: 700, color: '#0e2439', marginBottom: '4px' }}>
              Xem khóa học của tôi
            </h3>
            <p style={{ fontSize: '13.5px', color: '#64748b' }}>
              Mở danh sách đầy đủ các lớp bạn đang theo học.
            </p>
          </div>
        </div>

        <ArrowRight size={20} color="#64748b" />
      </div>
    </div>
  );
}
