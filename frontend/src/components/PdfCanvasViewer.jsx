import React, { useEffect, useRef, useState } from 'react';
import { Loader2, AlertCircle } from 'lucide-react';
import * as pdfjsLib from 'pdfjs-dist/build/pdf.mjs';
import 'pdfjs-dist/web/pdf_viewer.css';

pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url
).toString();

export default function PdfCanvasViewer({ 
  pdfUrl, 
  zoomLevel = 100, 
  watermarkText = '26AI.HIEUBD@VINUNI.EDU.VN',
  onPdfLoaded,
  onPageVisible,
  onTextSelected
}) {
  const containerRef = useRef(null);
  const scrollContainerRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);
  const [renderedCount, setRenderedCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);

  // Render PDF, TextLayer (chuẩn tỉ lệ --scale-factor) và trích xuất văn bản
  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setErrorMsg(null);
    setRenderedCount(0);
    setTotalCount(0);

    const container = containerRef.current;
    if (container) {
      container.innerHTML = '';
    }

    const loadAndRenderPdf = async () => {
      try {
        // Fetch PDF binary data
        const response = await fetch(pdfUrl);
        if (!response.ok) {
          throw new Error(`Không thể nạp file PDF (${response.status} ${response.statusText})`);
        }
        const arrayBuffer = await response.arrayBuffer();
        const byteArray = new Uint8Array(arrayBuffer);
        if (byteArray.length === 0) {
          throw new Error('File PDF trống (0 bytes).');
        }

        if (!isMounted) return;

        // Load PDF Document
        const loadingTask = pdfjsLib.getDocument({ data: byteArray });
        const pdf = await loadingTask.promise;

        if (!isMounted) return;
        setTotalCount(pdf.numPages);

        const extractedTextMap = {};
        // Tỉ lệ scale thu nhỏ slide vừa vặn màn hình (1.05x thay vì 1.35x)
        const fixedScale = (zoomLevel / 100) * 1.05;

        // Render từng trang slide
        for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
          if (!isMounted) break;

          const page = await pdf.getPage(pageNum);
          const viewport = page.getViewport({ scale: fixedScale });

          // Trích xuất văn bản từ trang slide
          let textContent = null;
          try {
            textContent = await page.getTextContent();
            const pageText = textContent.items.map(item => item.str).join(' ');
            extractedTextMap[pageNum] = pageText;
          } catch (textErr) {
            console.warn(`Không thể đọc văn bản trang ${pageNum}:`, textErr);
            extractedTextMap[pageNum] = '';
          }

          // Khung chứa slide thu nhỏ với bo góc 16px mịn đẹp & viền nhẹ
          const pageWrapper = document.createElement('div');
          pageWrapper.id = `pdf-page-${pageNum}`;
          pageWrapper.setAttribute('data-page-num', pageNum.toString());
          pageWrapper.className = 'pdf-page-wrapper';
          pageWrapper.style.position = 'relative';
          pageWrapper.style.width = `${viewport.width}px`;
          pageWrapper.style.height = `${viewport.height}px`;
          pageWrapper.style.marginBottom = '24px';
          pageWrapper.style.backgroundColor = '#ffffff';
          pageWrapper.style.borderRadius = '16px';
          pageWrapper.style.border = '1px solid #cbd5e1';
          pageWrapper.style.boxShadow = '0 6px 20px rgba(0,0,0,0.07)';
          pageWrapper.style.overflow = 'hidden';

          // Canvas vẽ slide bo góc
          const canvas = document.createElement('canvas');
          const context = canvas.getContext('2d');
          canvas.height = viewport.height;
          canvas.width = viewport.width;
          canvas.style.display = 'block';
          canvas.style.width = '100%';
          canvas.style.height = '100%';
          canvas.style.borderRadius = '16px';

          const renderContext = {
            canvasContext: context,
            viewport: viewport
          };
          await page.render(renderContext).promise;

          pageWrapper.appendChild(canvas);

          // Render TextLayer với biến --scale-factor khớp 100% tỉ lệ Canvas
          if (textContent) {
            try {
              const textLayerDiv = document.createElement('div');
              textLayerDiv.className = 'textLayer';
              textLayerDiv.style.setProperty('--scale-factor', viewport.scale.toString());
              textLayerDiv.style.position = 'absolute';
              textLayerDiv.style.left = '0';
              textLayerDiv.style.top = '0';
              textLayerDiv.style.width = `${viewport.width}px`;
              textLayerDiv.style.height = `${viewport.height}px`;
              textLayerDiv.style.borderRadius = '16px';

              pageWrapper.appendChild(textLayerDiv);

              const textLayer = new pdfjsLib.TextLayer({
                textContentSource: textContent,
                container: textLayerDiv,
                viewport: viewport
              });
              await textLayer.render();
            } catch (textLayerErr) {
              console.warn(`Không thể render TextLayer trang ${pageNum}:`, textLayerErr);
            }
          }

          // Watermark
          if (watermarkText) {
            const watermark = document.createElement('div');
            watermark.innerText = watermarkText;
            watermark.style.position = 'absolute';
            watermark.style.top = '50%';
            watermark.style.left = '50%';
            watermark.style.transform = 'translate(-50%, -50%) rotate(-25deg)';
            watermark.style.fontSize = '15px';
            watermark.style.fontWeight = '800';
            watermark.style.color = 'rgba(2, 132, 199, 0.12)';
            watermark.style.pointerEvents = 'none';
            watermark.style.whiteSpace = 'nowrap';
            watermark.style.letterSpacing = '1px';
            watermark.style.zIndex = '5';
            pageWrapper.appendChild(watermark);
          }

          if (container && isMounted) {
            container.appendChild(pageWrapper);
            setRenderedCount(pageNum);
          }
        }

        if (isMounted) {
          setLoading(false);
          if (onPdfLoaded) {
            onPdfLoaded({
              numPages: pdf.numPages,
              pdfTextMap: extractedTextMap
            });
          }
        }
      } catch (err) {
        console.error('Error rendering PDF:', err);
        if (isMounted) {
          setErrorMsg(err.message || 'Không thể hiển thị file PDF.');
          setLoading(false);
        }
      }
    };

    loadAndRenderPdf();

    return () => {
      isMounted = false;
    };
  }, [pdfUrl, zoomLevel, watermarkText]);

  // Observer phát hiện trang slide đang cuộn xem
  useEffect(() => {
    if (loading || !containerRef.current || !onPageVisible) return;

    const observerOptions = {
      root: scrollContainerRef.current,
      threshold: 0.3
    };

    const observer = new IntersectionObserver((entries) => {
      let maxRatio = 0;
      let mostVisiblePage = null;

      entries.forEach(entry => {
        if (entry.isIntersecting && entry.intersectionRatio > maxRatio) {
          maxRatio = entry.intersectionRatio;
          const pageNum = entry.target.getAttribute('data-page-num');
          if (pageNum) {
            mostVisiblePage = parseInt(pageNum, 10);
          }
        }
      });

      if (mostVisiblePage) {
        onPageVisible(mostVisiblePage);
      }
    }, observerOptions);

    const wrappers = containerRef.current.querySelectorAll('.pdf-page-wrapper');
    wrappers.forEach(el => observer.observe(el));

    return () => {
      observer.disconnect();
    };
  }, [loading, onPageVisible]);

  // Lắng nghe hành vi bôi đen văn bản (mouse selection)
  useEffect(() => {
    const handleMouseUp = () => {
      const selection = window.getSelection();
      const selectedText = selection ? selection.toString().trim() : '';
      if (onTextSelected) {
        onTextSelected(selectedText);
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      if (container) {
        container.removeEventListener('mouseup', handleMouseUp);
      }
    };
  }, [onTextSelected]);

  return (
    <div 
      ref={scrollContainerRef}
      style={{
        flex: 1,
        width: '100%',
        height: '100%',
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '24px 0 80px 0'
      }}
    >
      {loading && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '300px', gap: '12px', color: '#0284c7' }}>
          <Loader2 size={32} style={{ animation: 'spin 1s linear infinite' }} />
          <span style={{ fontSize: '13px', fontWeight: 600, color: '#475569' }}>
            Đang hiển thị slide bo góc ({renderedCount}/{totalCount || '...'})
          </span>
        </div>
      )}

      {errorMsg && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px', gap: '12px', color: '#ef4444', backgroundColor: '#ffffff', borderRadius: '14px', border: '1px solid #fecdd3' }}>
          <AlertCircle size={32} />
          <span style={{ fontSize: '14px', fontWeight: 600 }}>{errorMsg}</span>
        </div>
      )}

      {/* Stack trang Canvas kèm TextLayer */}
      <div ref={containerRef} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingBottom: '40px' }} />
    </div>
  );
}
