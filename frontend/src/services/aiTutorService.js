/**
 * AI Tutor client.
 *
 * Khóa Gemini không được đặt trong Vite hoặc gửi xuống trình duyệt.
 * Trong dev, Vite proxy /api sang FastAPI tại localhost:8000.
 */

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '');

export async function sendTutorMessage({
  message,
  currentPage = 1,
  pdfTextMap = {},
  pdfName = 'Slide',
  history = []
}) {
  const response = await fetch(`${API_BASE_URL}/api/tutor`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message,
      currentPage,
      pdfTextMap,
      pdfName,
      history: history.slice(-6).map((item) => ({
        sender: item.sender,
        text: item.text || '',
        rawText: item.rawText || item.text || ''
      }))
    })
  });

  if (!response.ok) {
    const detail = await response.json().catch(() => null);
    throw new Error(detail?.detail || `AI Tutor HTTP ${response.status}`);
  }

  return response.json();
}
