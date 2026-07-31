import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from '../router';
import {
  ArrowLeft, FileText, ChevronDown, ChevronLeft, ChevronRight,
  Minus, Plus, Download, Bookmark, Printer, Grid,
  Clock, PlusCircle, Send, Moon, Sparkles, Bot, Loader2, Compass, BookOpen, X
} from 'lucide-react';
import PdfCanvasViewer from '../components/PdfCanvasViewer';
import VLearnLogo from '../components/VLearnLogo';
import { sendTutorMessage } from '../services/aiTutorService';

export default function ReaderPage() {
  const navigate = useNavigate();
  const location = useLocation();

  // State management cho tệp active
  const [activeFile, setActiveFile] = useState(
    location.search.includes('D02') ? 'day02' : 'day01'
  );

  const [zoomLevel, setZoomLevel] = useState(100);

  // Sidebars open states
  const [leftSidebarOpen, setLeftSidebarOpen] = useState(true);
  const [rightSidebarOpen, setRightSidebarOpen] = useState(true);

  // Resizable AI Tutor Sidebar Width (Default 380px)
  const [tutorWidth, setTutorWidth] = useState(380);
  const [isResizing, setIsResizing] = useState(false);

  // PDF & Page Navigation states
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [pdfTextMap, setPdfTextMap] = useState({});

  // Bôi đen văn bản slide (Text selection state)
  const [selectedText, setSelectedText] = useState('');

  // Chat states
  const [chatInput, setChatInput] = useState('');
  const [isAiThinking, setIsAiThinking] = useState(false);
  const chatBottomRef = useRef(null);

  const [chatMessages, setChatMessages] = useState([
    {
      sender: 'ai',
      context: 'Hệ thống VLearn Tutor',
      text: 'Xin chào! Mình là VLearn Tutor. Bạn có thể bôi đen một đoạn trên slide để hỏi hoặc gửi câu hỏi tự do nhé!',
      rawText: 'Xin chào! Mình là VLearn Tutor. Bạn có thể bôi đen một đoạn trên slide để hỏi hoặc gửi câu hỏi tự do nhé!'
    }
  ]);

  // Điều chỉnh độ rộng thanh AI Tutor bằng chuột
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isResizing) return;
      const newWidth = window.innerWidth - e.clientX;
      const minW = 300;
      const maxW = Math.floor(window.innerWidth * 0.45);
      setTutorWidth(Math.min(maxW, Math.max(minW, newWidth)));
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    if (isResizing) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing]);

  // Cuộn khung chat xuống dưới cùng khi có tin nhắn mới
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, isAiThinking]);

  // Hàm cuộn tới trang PDF cụ thể
  const scrollToPage = (pageNum) => {
    const pageNumInt = parseInt(pageNum, 10);
    if (isNaN(pageNumInt)) return;

    const pageEl = document.getElementById(`pdf-page-${pageNumInt}`);
    if (pageEl) {
      pageEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setCurrentPage(pageNumInt);
    }
  };

  // Accordions in left sidebar
  const [openDays, setOpenDays] = useState({
    Day01: activeFile === 'day01',
    Day02: activeFile === 'day02'
  });

  const toggleDay = (dayKey) => {
    setOpenDays(prev => ({ ...prev, [dayKey]: !prev[dayKey] }));
  };

  // Metadata của file PDF đang xem
  const currentFileData = activeFile === 'day01' ? {
    id: 'day01',
    name: 'AI Research to AI Products.pdf',
    dayTitle: 'Day 01',
    pdfUrl: '/slides/day01.dat'
  } : {
    id: 'day02',
    name: 'Customer Analytics and Product Lifecycle.pdf',
    dayTitle: 'Day 02',
    pdfUrl: '/slides/day02.dat'
  };

  // Xử lý gửi tin nhắn cho AI Tutor
  const handleSendMessage = async (customPrompt) => {
    let rawQuery = typeof customPrompt === 'string' ? customPrompt : chatInput;
    if (!rawQuery.trim() && !selectedText) return;

    // Nếu không nhập câu hỏi mà có bôi đen, mặc định là hỏi giải thích đoạn văn bôi đen
    if (!rawQuery.trim() && selectedText) {
      rawQuery = 'Giải thích đoạn văn bản này giúp mình.';
    }

    // Đóng gói câu hỏi kèm văn bản bôi đen theo chuẩn dataset VLearn
    let fullPromptWithSelection = rawQuery;
    if (selectedText) {
      fullPromptWithSelection = `(Trang ${currentPage}, đoạn được chọn: "${selectedText}")\n${rawQuery}`;
    }

    const userMsg = {
      sender: 'user',
      text: fullPromptWithSelection
    };

    const updatedHistory = [...chatMessages, userMsg];
    setChatMessages(updatedHistory);

    if (typeof customPrompt !== 'string') {
      setChatInput('');
    }
    // Clear đoạn bôi đen sau khi đã gửi
    setSelectedText('');
    setIsAiThinking(true);

    try {
      const response = await sendTutorMessage({
        message: fullPromptWithSelection,
        currentPage: currentPage,
        pdfTextMap: pdfTextMap,
        pdfName: currentFileData.name,
        history: updatedHistory
      });

      const aiMsg = {
        sender: 'ai',
        context: response.context,
        text: response.text,
        rawText: response.text,
        downloadUrl: response.downloadUrl
      };

      setChatMessages(prev => [...prev, aiMsg]);

      // Tự động cuộn slide nếu AI phát hiện nhu cầu chuyển trang
      if (response.targetPage) {
        scrollToPage(response.targetPage);
      }

    } catch (err) {
      setChatMessages(prev => [
        ...prev,
        {
          sender: 'ai',
          context: 'Lỗi hệ thống',
          text: `⚠️ Không thể kết nối với AI Tutor (${err.message || 'Lỗi không xác định'}). Vui lòng kiểm tra lại kết nối mạng.`,
          rawText: 'Lỗi hệ thống'
        }
      ]);
    } finally {
      setIsAiThinking(false);
    }
  };

  // Trình hiển thị nội dung tin nhắn có nhận diện Markdown & trích dẫn [Trang X]
  const renderFormattedMessage = (text) => {
    if (!text) return null;

    // Tiền xử lý: Xóa bỏ các dấu in đậm ** bị bọc lỗi quanh trích dẫn [Trang X]
    const cleanText = text
      .replace(/\*\*\s*(\[Trang\s*\d+\])\s*\*\*/gi, '$1')
      .replace(/\*\*\s*(\[Trang\s*\d+\])/gi, '$1')
      .replace(/(\[Trang\s*\d+\])\s*\*\*/gi, '$1');

    // 1. Tách các dải trích dẫn [Trang X]
    const citationRegex = /\[Trang\s*(\d+)\]/gi;
    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = citationRegex.exec(cleanText)) !== null) {
      if (match.index > lastIndex) {
        parts.push({ type: 'markdown', content: cleanText.substring(lastIndex, match.index) });
      }
      parts.push({ type: 'citation', pageNum: parseInt(match[1], 10), raw: match[0] });
      lastIndex = citationRegex.lastIndex;
    }

    if (lastIndex < cleanText.length) {
      parts.push({ type: 'markdown', content: cleanText.substring(lastIndex) });
    }

    // Helper render Markdown inline (in đậm **...**, nghiêng *...*, danh sách, xuống dòng)
    const renderMarkdownBlock = (rawMdText) => {
      const lines = rawMdText.split('\n');
      return lines.map((line, lIdx) => {
        // Tách các từ in đậm **text** hoặc __text__
        const boldRegex = /(\*\*|__)(.*?)\1/g;
        const lineTokens = [];
        let bLast = 0;
        let bMatch;

        while ((bMatch = boldRegex.exec(line)) !== null) {
          if (bMatch.index > bLast) {
            lineTokens.push({ type: 'text', content: line.substring(bLast, bMatch.index) });
          }
          lineTokens.push({ type: 'bold', content: bMatch[2] });
          bLast = boldRegex.lastIndex;
        }

        if (bLast < line.length) {
          lineTokens.push({ type: 'text', content: line.substring(bLast) });
        }

        const isBullet = line.trim().startsWith('- ') || line.trim().startsWith('* ');

        return (
          <React.Fragment key={lIdx}>
            {lIdx > 0 && <br />}
            <span style={{ paddingLeft: isBullet ? '12px' : '0' }}>
              {lineTokens.map((tok, tIdx) => {
                if (tok.type === 'bold') {
                  return (
                    <strong key={tIdx} style={{ fontWeight: 700, color: '#0e2439' }}>
                      {tok.content}
                    </strong>
                  );
                }
                return <span key={tIdx}>{tok.content}</span>;
              })}
            </span>
          </React.Fragment>
        );
      });
    };

    return (
      <div style={{ wordBreak: 'break-word', lineHeight: '1.6' }}>
        {parts.map((part, idx) => {
          if (part.type === 'citation') {
            return (
              <button
                key={idx}
                onClick={() => scrollToPage(part.pageNum)}
                title={`Bấm để chuyển ngay đến Slide trang ${part.pageNum}`}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  backgroundColor: '#e0f2fe',
                  color: '#0284c7',
                  border: '1px solid #bae6fd',
                  borderRadius: '12px',
                  padding: '2px 8px',
                  margin: '0 3px',
                  fontSize: '12.5px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  verticalAlign: 'baseline'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#0284c7';
                  e.currentTarget.style.color = '#ffffff';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#e0f2fe';
                  e.currentTarget.style.color = '#0284c7';
                }}
              >
                <BookOpen size={12} />
                Trang {part.pageNum}
              </button>
            );
          }
          return <React.Fragment key={idx}>{renderMarkdownBlock(part.content)}</React.Fragment>;
        })}
      </div>
    );
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', maxHeight: '100vh', backgroundColor: '#f1f5f9', overflow: 'hidden' }}>

      {/* Reader Top Bar */}
      <div className="vlearn-header-exact">
        {/* Left: Back & Title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button
            onClick={() => navigate('/course/comp2010')}
            style={{
              background: 'none',
              border: '1px solid #e2e8f0',
              borderRadius: '50%',
              width: '34px',
              height: '34px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: '#475569'
            }}
          >
            <ArrowLeft size={17} />
          </button>

          {/* Brand Logo */}
          <VLearnLogo onClick={() => navigate('/dashboard')} size={30} />

          <div style={{ height: '22px', width: '1px', backgroundColor: '#cbd5e1' }} />

          {/* Active File Title */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <FileText size={18} color="#0284c7" />
            <div>
              <div style={{ fontSize: '14.5px', fontWeight: 700, color: '#0e2439', lineHeight: '1.2' }}>
                {currentFileData.name}
              </div>
              <div style={{ fontSize: '12px', color: '#94a3b8' }}>
                COMP2010 · Lecture_material_ms2039d0_hnxpxy
              </div>
            </div>
          </div>
        </div>

        {/* Right Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <span style={{
            backgroundColor: '#f1f5f9',
            border: '1px solid #e2e8f0',
            borderRadius: '6px',
            padding: '3px 9px',
            fontSize: '13px',
            fontWeight: 700,
            color: '#475569'
          }}>
            VI
          </span>
          <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}>
            <Moon size={20} />
          </button>
        </div>
      </div>

      {/* Main Workspace Container */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden', position: 'relative' }}>

        {/* Column 1: Left Outline Sidebar */}
        <div
          className="sidebar-panel"
          style={{
            width: leftSidebarOpen ? '280px' : '0px',
            opacity: leftSidebarOpen ? 1 : 0,
            overflow: 'hidden',
            backgroundColor: '#ffffff',
            borderRight: leftSidebarOpen ? '1px solid rgba(14, 36, 57, 0.15)' : 'none',
            display: 'flex',
            flexDirection: 'column',
            zIndex: 10,
            height: '100%'
          }}
        >
          {/* Header */}
          <div style={{ padding: '16px 20px', borderBottom: '1px solid #f1f5f9', flexShrink: 0 }}>
            <h3 style={{ fontSize: '15.5px', fontWeight: 700, color: '#0e2439', marginBottom: '3px' }}>
              Học liệu môn học
            </h3>
            <p style={{ fontSize: '12.5px', color: '#94a3b8' }}>
              Chương, slide và tài liệu đã upload
            </p>
          </div>

          {/* Accordion List */}
          <div style={{ padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: '12px', overflowY: 'auto', flex: 1 }}>
            {/* Day 01 */}
            <div style={{ border: '1px solid #e2e8f0', borderRadius: '12px', overflow: 'hidden' }}>
              <div
                onClick={() => toggleDay('Day01')}
                style={{
                  padding: '12px 16px',
                  backgroundColor: '#f8fafc',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  fontSize: '13.5px',
                  fontWeight: 700,
                  color: '#0e2439',
                  cursor: 'pointer'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: '#0284c7' }}></span>
                  Day01
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ backgroundColor: '#e0f2fe', color: '#0284c7', fontSize: '10.5px', fontWeight: 800, padding: '3px 8px', borderRadius: '5px' }}>
                    STUDYING
                  </span>
                  <ChevronDown size={16} color="#94a3b8" style={{ transform: openDays.Day01 ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }} />
                </div>
              </div>

              {/* Day 01 Files */}
              <div
                className="accordion-body"
                style={{
                  maxHeight: openDays.Day01 ? '110px' : '0px',
                  opacity: openDays.Day01 ? 1 : 0,
                  padding: openDays.Day01 ? '10px' : '0 10px'
                }}
              >
                <div
                  onClick={() => {
                    setActiveFile('day01');
                    setSelectedText('');
                  }}
                  style={{
                    padding: '10px 14px',
                    borderRadius: '10px',
                    border: activeFile === 'day01' ? '1.5px solid #0284c7' : '1px solid #e2e8f0',
                    backgroundColor: activeFile === 'day01' ? '#f0f9ff' : '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <FileText size={17} color={activeFile === 'day01' ? '#0284c7' : '#64748b'} />
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: activeFile === 'day01' ? 700 : 500, color: '#0e2439', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '180px' }}>
                      AI Research to AI Products.pdf
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Day 02 */}
            <div style={{ border: '1px solid #e2e8f0', borderRadius: '12px', overflow: 'hidden' }}>
              <div
                onClick={() => toggleDay('Day02')}
                style={{
                  padding: '12px 16px',
                  backgroundColor: '#f8fafc',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  fontSize: '13.5px',
                  fontWeight: 700,
                  color: '#0e2439',
                  cursor: 'pointer'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: '#0284c7' }}></span>
                  Day02
                </div>
                <ChevronDown size={16} color="#94a3b8" style={{ transform: openDays.Day02 ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }} />
              </div>

              {/* Day 02 Files */}
              <div
                className="accordion-body"
                style={{
                  maxHeight: openDays.Day02 ? '110px' : '0px',
                  opacity: openDays.Day02 ? 1 : 0,
                  padding: openDays.Day02 ? '10px' : '0 10px'
                }}
              >
                <div
                  onClick={() => {
                    setActiveFile('day02');
                    setSelectedText('');
                  }}
                  style={{
                    padding: '10px 14px',
                    borderRadius: '10px',
                    border: activeFile === 'day02' ? '1.5px solid #0284c7' : '1px solid #e2e8f0',
                    backgroundColor: activeFile === 'day02' ? '#f0f9ff' : '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <FileText size={17} color={activeFile === 'day02' ? '#0284c7' : '#64748b'} />
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: activeFile === 'day02' ? 700 : 500, color: '#0e2439', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '180px' }}>
                      Customer Analytics and Product Lifecycle.pdf
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Days 03 to 06 */}
            {['Day03', 'Day04', 'Day05', 'Day06'].map((dayName, idx) => (
              <div
                key={idx}
                style={{
                  padding: '12px 16px',
                  backgroundColor: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  fontSize: '13.5px',
                  fontWeight: 600,
                  color: '#475569',
                  cursor: 'pointer'
                }}
              >
                <span>{dayName}</span>
                <ChevronDown size={16} color="#94a3b8" />
              </div>
            ))}
          </div>
        </div>


        {/* ANCHORED EDGE TOGGLE BUTTON - LEFT SIDEBAR */}
        <button
          onClick={() => setLeftSidebarOpen(!leftSidebarOpen)}
          className="edge-toggle-btn"
          title={leftSidebarOpen ? "Đóng Học liệu môn học" : "Mở Học liệu môn học"}
          style={{
            position: 'absolute',
            left: leftSidebarOpen ? '280px' : '0px',
            top: '50%',
            transform: 'translateY(-50%)',
            zIndex: 40,
            backgroundColor: '#ffffff',
            border: '1px solid #cbd5e1',
            borderLeft: leftSidebarOpen ? '1px solid #cbd5e1' : 'none',
            borderRadius: '0 12px 12px 0',
            width: '24px',
            height: '52px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: '#475569'
          }}
        >
          {leftSidebarOpen ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
        </button>


        {/* Column 2: Center PDF Viewer Pane */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', backgroundColor: '#e2e8f0', overflow: 'hidden', position: 'relative', height: '100%' }}>

          {/* FLOATING PILL TOOLBAR */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '12px 0 8px 0',
            backgroundColor: 'transparent',
            zIndex: 20,
            flexShrink: 0
          }}>
            <div style={{
              backgroundColor: '#ffffff',
              border: '1px solid #cbd5e1',
              borderRadius: '28px',
              padding: '6px 20px',
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              boxShadow: '0 2px 14px rgba(0,0,0,0.06)'
            }}>
              {/* Group 1: Tools */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <button style={{ backgroundColor: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '18px', padding: '5px 14px', fontSize: '13.5px', fontWeight: 600, color: '#0284c7', display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer' }}>
                  📌 Đọc (Bôi đen)
                </button>
                <button style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '18px', padding: '5px 14px', fontSize: '13.5px', color: '#64748b', display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer' }}>
                  ✏️ Bút
                </button>
                <button style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '18px', padding: '5px 14px', fontSize: '13.5px', color: '#64748b', display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer' }}>
                  🖍️ Highlight
                </button>
                <button style={{ border: 'none', background: 'none', color: '#94a3b8', fontSize: '13.5px', cursor: 'pointer', padding: '0 4px' }}>...</button>
              </div>

              <div style={{ height: '18px', width: '1px', backgroundColor: '#e2e8f0' }} />

              {/* Group 2: Zoom */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '13.5px', color: '#0284c7', fontWeight: 600 }}>
                <span>Xem cuộn chuột</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#64748b' }}>
                  <Minus size={15} style={{ cursor: 'pointer' }} onClick={() => setZoomLevel(Math.max(50, zoomLevel - 10))} />
                  <span style={{ fontSize: '13.5px', fontWeight: 600, width: '45px', textAlign: 'center' }}>{zoomLevel}%</span>
                  <Plus size={15} style={{ cursor: 'pointer' }} onClick={() => setZoomLevel(Math.min(200, zoomLevel + 10))} />
                </div>
              </div>

              <div style={{ height: '18px', width: '1px', backgroundColor: '#e2e8f0' }} />

              {/* Group 3: Actions & Page Quick Switch */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#64748b' }}>
                <span style={{ fontSize: '13px', color: '#475569', fontWeight: 600 }}>
                  Trang {currentPage} / {totalPages || 1}
                </span>
                <Download size={17} style={{ cursor: 'pointer' }} />
                <Bookmark size={17} style={{ cursor: 'pointer' }} />
                <Printer size={17} style={{ cursor: 'pointer' }} />
              </div>
            </div>
          </div>

          {/* REAL PDF CANVAS VIEWER WITH TEXT SELECTION LAYER */}
          <div style={{ flex: 1, width: '100%', height: '100%', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            <PdfCanvasViewer
              key={currentFileData.id}
              pdfUrl={currentFileData.pdfUrl}
              zoomLevel={zoomLevel}
              onPdfLoaded={({ numPages, pdfTextMap }) => {
                setTotalPages(numPages);
                setPdfTextMap(pdfTextMap);
              }}
              onPageVisible={(pageNum) => {
                setCurrentPage(pageNum);
              }}
              onTextSelected={(text) => {
                setSelectedText(text);
              }}
            />
          </div>
        </div>


        {/* ANCHORED EDGE TOGGLE BUTTON - RIGHT TUTOR SIDEBAR */}
        <button
          onClick={() => setRightSidebarOpen(!rightSidebarOpen)}
          className="edge-toggle-btn"
          title={rightSidebarOpen ? "Đóng VLearn Tutor" : "Mở VLearn Tutor"}
          style={{
            position: 'absolute',
            right: rightSidebarOpen ? `${tutorWidth}px` : '0px',
            top: '50%',
            transform: 'translateY(-50%)',
            zIndex: 40,
            backgroundColor: '#ffffff',
            border: '1px solid #cbd5e1',
            borderRight: rightSidebarOpen ? '1px solid #cbd5e1' : 'none',
            borderRadius: '12px 0 0 12px',
            width: '24px',
            height: '52px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: '#475569'
          }}
        >
          {rightSidebarOpen ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>


        {/* Column 3: Right VLearn Tutor Chat Sidebar */}
        <div
          className="sidebar-panel"
          style={{
            width: rightSidebarOpen ? `${tutorWidth}px` : '0px',
            opacity: rightSidebarOpen ? 1 : 0,
            overflow: 'hidden',
            backgroundColor: '#ffffff',
            borderLeft: rightSidebarOpen ? '1px solid rgba(14, 36, 57, 0.15)' : 'none',
            display: 'flex',
            flexDirection: 'column',
            position: 'relative',
            zIndex: 10,
            height: '100%'
          }}
        >
          {/* MOUSE RESIZER HANDLE BAR ON LEFT EDGE OF TUTOR SIDEBAR */}
          {rightSidebarOpen && (
            <div
              onMouseDown={(e) => {
                e.preventDefault();
                setIsResizing(true);
              }}
              title="Kéo sang trái/phải để điều chỉnh độ rộng khung chat"
              style={{
                position: 'absolute',
                left: 0,
                top: 0,
                bottom: 0,
                width: '6px',
                cursor: 'col-resize',
                backgroundColor: isResizing ? '#0284c7' : 'transparent',
                zIndex: 50,
                transition: 'background-color 0.15s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#0284c7'}
              onMouseLeave={(e) => { if (!isResizing) e.currentTarget.style.backgroundColor = 'transparent'; }}
            />
          )}

          {/* Header */}
          <div style={{
            padding: '16px 20px',
            borderBottom: '1px solid #f1f5f9',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexShrink: 0
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              {/* Robot Badge */}
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '12px',
                backgroundColor: '#e0f2fe',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#0284c7'
              }}>
                <Bot size={22} />
              </div>

              <div>
                <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#0e2439' }}>
                  VLearn Tutor
                </h3>
                {/* Subtitle with Fading Pulsing Green Radar Dot */}
                <div style={{ display: 'flex', alignItems: 'center', marginTop: '2px' }}>
                  <span className="pulsing-green-dot-wrapper">
                    <span className="pulsing-green-dot-core" />
                    <span className="pulsing-green-dot-ring" />
                  </span>
                  <span style={{ fontSize: '12px', color: '#10b981', fontWeight: 600 }}>
                    Trợ lý học theo ngữ cảnh
                  </span>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div
                title="Bấm để cuộn lên vị trí trang hiện tại"
                onClick={() => scrollToPage(currentPage)}
                style={{
                  fontSize: '12px',
                  backgroundColor: '#f0f9ff',
                  border: '1px solid #bae6fd',
                  borderRadius: '18px',
                  padding: '5px 12px',
                  color: '#0284c7',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                <Compass size={14} />
                Slide: {currentPage}{totalPages ? `/${totalPages}` : ''}
              </div>
            </div>
          </div>

          {/* Chat Messages Log */}
          <div style={{
            flex: 1,
            overflowY: 'auto',
            padding: '18px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            backgroundColor: '#fafcfd'
          }}>
            {chatMessages.map((msg, index) => (
              <div key={index} style={{ display: 'flex', flexDirection: 'column', alignItems: msg.sender === 'user' ? 'flex-end' : 'flex-start' }}>
                {msg.context && (
                  <span style={{ fontSize: '11.5px', color: '#94a3b8', marginBottom: '4px', fontStyle: 'italic' }}>
                    {msg.context}
                  </span>
                )}

                <div style={{
                  maxWidth: '92%',
                  padding: msg.sender === 'user' ? '12px 18px' : '14px 18px',
                  borderRadius: msg.sender === 'user' ? '20px 20px 4px 20px' : '18px',
                  backgroundColor: msg.sender === 'user' ? '#0e2439' : '#ffffff',
                  color: msg.sender === 'user' ? '#ffffff' : '#1e293b',
                  fontSize: '14.5px',
                  lineHeight: '1.55',
                  border: msg.sender === 'user' ? 'none' : '1px solid #e2e8f0',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
                }}>
                  {msg.sender === 'user' ? msg.text : renderFormattedMessage(msg.text)}

                  {/* Nút bấm Tải Slide PDF khi người dùng yêu cầu */}
                  {msg.downloadUrl && (
                    <div style={{ marginTop: '12px', paddingTop: '10px', borderTop: '1px solid #e2e8f0' }}>
                      <a
                        href={msg.downloadUrl}
                        download={currentFileData.name}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '8px',
                          backgroundColor: '#0284c7',
                          color: '#ffffff',
                          borderRadius: '12px',
                          padding: '8px 16px',
                          fontSize: '13px',
                          fontWeight: 700,
                          textDecoration: 'none',
                          boxShadow: '0 2px 8px rgba(2,132,199,0.25)',
                          transition: 'all 0.15s ease'
                        }}
                      >
                        <Download size={16} />
                        📥 Tải về tệp {currentFileData.name}
                      </a>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* Indicator AI đang suy nghĩ */}
            {isAiThinking && (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                <span style={{ fontSize: '11.5px', color: '#0284c7', marginBottom: '4px', fontStyle: 'italic', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Loader2 size={12} style={{ animation: 'spin 1s linear infinite' }} /> VLearn Tutor đang suy nghĩ...
                </span>
                <div style={{
                  padding: '12px 18px',
                  borderRadius: '18px',
                  backgroundColor: '#ffffff',
                  border: '1px solid #e0f2fe',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  color: '#0284c7',
                  fontSize: '13.5px'
                }}>
                  <Sparkles size={16} style={{ animation: 'pulse 1.5s ease-in-out infinite' }} />
                  Đang xử lý câu hỏi...
                </div>
              </div>
            )}

            <div ref={chatBottomRef} />
          </div>

          {/* Quick Action Chips & Selection Banner */}
          <div style={{
            padding: '8px 18px 0 18px',
            backgroundColor: '#ffffff',
            display: 'flex',
            flexDirection: 'column',
            gap: '6px',
            flexShrink: 0
          }}>
            {/* Banner thông báo đoạn văn bản bôi đen */}
            {selectedText && (
              <div style={{
                backgroundColor: '#f0f9ff',
                border: '1.5px solid #0284c7',
                borderRadius: '12px',
                padding: '8px 12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                fontSize: '12.5px',
                color: '#0369a1',
                boxShadow: '0 2px 8px rgba(2,132,199,0.12)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', overflow: 'hidden' }}>
                  <span style={{ fontWeight: 800, backgroundColor: '#0284c7', color: '#ffffff', padding: '2px 6px', borderRadius: '6px', fontSize: '11px' }}>
                    Đã bôi đen (T.{currentPage})
                  </span>
                  <span style={{ fontStyle: 'italic', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '170px' }}>
                    "{selectedText}"
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <button
                    onClick={() => handleSendMessage()}
                    style={{
                      backgroundColor: '#0284c7',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '8px',
                      padding: '3px 9px',
                      fontSize: '11.5px',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    Hỏi AI ngay
                  </button>
                  <button
                    onClick={() => setSelectedText('')}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', padding: '2px' }}
                  >
                    <X size={15} />
                  </button>
                </div>
              </div>
            )}

            {/* Chips gợi ý nhanh */}
            <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
              {selectedText ? (
                <button
                  onClick={() => handleSendMessage(`Giải thích chi tiết đoạn văn bản này giúp mình.`)}
                  disabled={isAiThinking}
                  style={{
                    backgroundColor: '#e0f2fe',
                    border: '1px solid #bae6fd',
                    borderRadius: '16px',
                    padding: '5px 12px',
                    fontSize: '12px',
                    fontWeight: 700,
                    color: '#0284c7',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap'
                  }}
                >
                  ✨ Giải thích đoạn bôi đen
                </button>
              ) : (
                <button
                  onClick={() => handleSendMessage(`Hãy tóm tắt các điểm chính của nội dung trang slide ${currentPage} này.`)}
                  disabled={isAiThinking}
                  style={{
                    backgroundColor: '#f0f9ff',
                    border: '1px solid #bae6fd',
                    borderRadius: '16px',
                    padding: '5px 12px',
                    fontSize: '12px',
                    fontWeight: 600,
                    color: '#0284c7',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap'
                  }}
                >
                  💡 Tóm tắt trang {currentPage}
                </button>
              )}

              <button
                onClick={() => handleSendMessage(`Giải thích cho mình các khái niệm cốt lõi ở trang slide ${currentPage} này.`)}
                disabled={isAiThinking}
                style={{
                  backgroundColor: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '16px',
                  padding: '5px 12px',
                  fontSize: '12px',
                  fontWeight: 600,
                  color: '#475569',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap'
                }}
              >
                🔍 Giải thích khái niệm
              </button>

              <button
                onClick={() => handleSendMessage('Vui lòng tổng quan tài liệu này gồm có những nội dung chính nào và nằm ở các trang bao nhiêu?')}
                disabled={isAiThinking}
                style={{
                  backgroundColor: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '16px',
                  padding: '5px 12px',
                  fontSize: '12px',
                  fontWeight: 600,
                  color: '#475569',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap'
                }}
              >
                🗺️ Mục lục slide
              </button>
            </div>
          </div>

          {/* Chat Input Footer */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            style={{
              padding: '10px 18px 16px 18px',
              backgroundColor: '#ffffff',
              flexShrink: 0
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <input
                type="text"
                placeholder={selectedText ? `Hỏi về đoạn bôi đen...` : `Hỏi AI về trang ${currentPage} hoặc bôi đen văn bản slide...`}
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                disabled={isAiThinking}
                style={{
                  flex: 1,
                  backgroundColor: selectedText ? '#f0f9ff' : '#f8fafc',
                  border: selectedText ? '1.5px solid #0284c7' : '1px solid #cbd5e1',
                  borderRadius: '26px',
                  padding: '12px 20px',
                  fontSize: '13.5px',
                  color: '#0f172a',
                  outline: 'none'
                }}
              />
              <button
                type="submit"
                disabled={(!chatInput.trim() && !selectedText) || isAiThinking}
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  backgroundColor: ((chatInput.trim() || selectedText) && !isAiThinking) ? '#0284c7' : '#cbd5e1',
                  color: '#ffffff',
                  border: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: ((chatInput.trim() || selectedText) && !isAiThinking) ? 'pointer' : 'default',
                  boxShadow: ((chatInput.trim() || selectedText) && !isAiThinking) ? '0 2px 6px rgba(2,132,199,0.3)' : 'none',
                  transition: 'all 0.15s ease'
                }}
              >
                <Send size={17} />
              </button>
            </div>
          </form>
        </div>

      </div>
    </div>
  );
}
