import React, { useState } from 'react';
import { useNavigate } from '../router';
import { ChevronDown, FileText, CheckCircle } from 'lucide-react';

export default function CourseDetailPage() {
  const navigate = useNavigate();
  // Open Day01 by default
  const [openDays, setOpenDays] = useState({ Day01: true });

  const toggleDay = (dayKey) => {
    setOpenDays((prev) => ({
      ...prev,
      [dayKey]: !prev[dayKey]
    }));
  };

  const daysList = [
    {
      id: 'Day01',
      dayNum: '01',
      title: 'Day01',
      subtitle: 'Ngày 1 · AI Research to AI Products',
      files: [
        { name: 'AI Research to AI Products.pdf', path: 'slide=D01-S01' }
      ]
    },
    {
      id: 'Day02',
      dayNum: '02',
      title: 'Day02',
      subtitle: 'Ngày 2 · Customer Analytics and Product Lifecycle',
      files: [
        { name: 'Customer Analytics and Product Lifecycle.pdf', path: 'slide=D02-S01' }
      ]
    },
    {
      id: 'Day03',
      dayNum: '03',
      title: 'Day03',
      subtitle: 'Ngày 3 · Chatbot & Agentic AI Systems',
      files: [
        { name: 'day03_chatbot_agent.pdf', path: 'slide=D03-S01' }
      ]
    },
    {
      id: 'Day04',
      dayNum: '04',
      title: 'Day04',
      subtitle: 'Ngày 4 · Prompt Engineering & Workflows',
      files: [
        { name: 'day04_prompt_engineering.pdf', path: 'slide=D04-S01' }
      ]
    },
    {
      id: 'Day05',
      dayNum: '05',
      title: 'Day05',
      subtitle: 'Ngày 5 · Advanced LLM Optimization',
      files: [
        { name: 'day05_optimization.pdf', path: 'slide=D05-S01' }
      ]
    },
    {
      id: 'Day06',
      dayNum: '06',
      title: 'Day06',
      subtitle: 'Ngày 6 · Capstone Presentation & Demo',
      files: [
        { name: 'day06_demo_presentation.pdf', path: 'slide=D06-S01' }
      ]
    }
  ];

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 40px 60px 40px' }}>
      {/* Course Detail Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '28px' }}>
        <div>
          <span style={{ fontSize: '11.5px', fontWeight: 800, color: '#d32027', letterSpacing: '0.5px' }}>
            VLEARN · VINUNI AI THỰC CHIẾN
          </span>
          <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#0e2439', margin: '3px 0 6px 0' }}>
            COMP2010 - Khoá 3 + 4 Phase 1
          </h1>
          <p style={{ fontSize: '13.5px', color: '#64748b' }}>
            1074 học viên cùng lớp
          </p>
        </div>

        {/* Top Right Reading Progress & CTA */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12.5px', color: '#475569', fontWeight: 600 }}>
            <CheckCircle size={16} color="#10b981" />
            <span>Đã đọc 0/6 ngày học</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{ width: '70px', height: '6px', backgroundColor: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
              <div style={{ width: '0%', height: '100%', backgroundColor: '#0284c7' }}></div>
            </div>
            <span style={{ fontSize: '11.5px', fontWeight: 700, color: '#64748b' }}>0%</span>
          </div>

          <button
            onClick={() => navigate('/course/comp2010/reader?slide=D01-S01')}
            style={{
              backgroundColor: '#0e2439',
              color: '#ffffff',
              border: 'none',
              borderRadius: '20px',
              padding: '8px 20px',
              fontSize: '13px',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            Bắt đầu đọc
          </button>
        </div>
      </div>

      {/* Accordion Days List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {daysList.map((day) => {
          const isOpen = !!openDays[day.id];

          return (
            <div
              key={day.id}
              className="vlearn-card accordion-item"
              style={{
                borderRadius: '14px',
                border: '1px solid #e2e8f0',
                overflow: 'hidden'
              }}
            >
              {/* Accordion Header */}
              <div
                onClick={() => toggleDay(day.id)}
                style={{
                  padding: '20px 24px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  cursor: 'pointer',
                  userSelect: 'none'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                  {/* Day Badge Circle */}
                  <div style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '12px',
                    backgroundColor: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    lineHeight: '1.1'
                  }}>
                    <span style={{ fontSize: '8.5px', fontWeight: 800, color: '#94a3b8', letterSpacing: '0.5px' }}>DAY</span>
                    <span style={{ fontSize: '15px', fontWeight: 800, color: '#0e2439' }}>{day.dayNum}</span>
                  </div>

                  {/* Day Title & Info */}
                  <div>
                    <h3 style={{ fontSize: '15.5px', fontWeight: 700, color: '#0e2439', marginBottom: '2px' }}>
                      {day.title}
                    </h3>
                    <p style={{ fontSize: '13px', color: '#64748b' }}>
                      {day.subtitle}
                    </p>
                  </div>
                </div>

                {/* Animated Chevron */}
                <div style={{
                  color: '#94a3b8',
                  transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: 'transform 0.3s ease'
                }}>
                  <ChevronDown size={20} />
                </div>
              </div>

              {/* Accordion Expanded Content (Files List) */}
              <div
                className="accordion-body"
                style={{
                  maxHeight: isOpen ? '300px' : '0px',
                  opacity: isOpen ? 1 : 0,
                  padding: isOpen ? '0 24px 20px 24px' : '0 24px',
                  borderTop: isOpen ? '1px solid #f1f5f9' : 'none'
                }}
              >
                <div style={{ paddingTop: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {day.files && day.files.length > 0 ? (
                    day.files.map((file, idx) => (
                      <div
                        key={idx}
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/course/comp2010/reader?${file.path}`);
                        }}
                        style={{
                          backgroundColor: '#ffffff',
                          border: '1px solid #e2e8f0',
                          borderRadius: '10px',
                          padding: '12px 18px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px',
                          cursor: 'pointer',
                          transition: 'all 0.15s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.borderColor = '#0284c7';
                          e.currentTarget.style.backgroundColor = '#f8fafc';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.borderColor = '#e2e8f0';
                          e.currentTarget.style.backgroundColor = '#ffffff';
                        }}
                      >
                        <FileText size={18} color="#0284c7" />
                        <span style={{ fontSize: '13.5px', fontWeight: 600, color: '#1e293b' }}>
                          {file.name}
                        </span>
                      </div>
                    ))
                  ) : (
                    <div style={{ fontSize: '13px', color: '#94a3b8', fontStyle: 'italic', padding: '6px 0' }}>
                      Đang cập nhật tài liệu cho ngày này...
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
