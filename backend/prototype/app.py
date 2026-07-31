"""
Core App ghép nối vòng lặp ReAct & Guardrails cho VLearn Tutor Agent
"""

import json
import re
from .prompts import REACT_SYSTEM_PROMPT, INTENT_CLASSIFIER_PROMPT
from .tools import (
    get_current_page_text,
    navigate_to_page,
    respond_directly,
    search_slide_content,
)

class VLearnReActAgent:
    def __init__(self, api_key: str = None):
        self.api_key = api_key

    def classify_intent(self, user_input: str) -> str:
        """Guardrail phân loại ý định để chặn gọi tool vô tội vạ."""
        clean_input = user_input.strip().lower()
        
        # Danh sách từ chào hỏi phổ biến
        greetings = ['alo', 'hi', 'hello', 'chào', 'chào bạn', 'xin chào', 'ad ơi', 'tutor ơi', 'hey']
        if clean_input in greetings or len(clean_input) <= 4 and clean_input in ['alo', 'hi', 'helo']:
            return 'GREETING'
            
        # Kiểm tra yêu cầu chuyển trang
        if re.search(r'(chuyển|mở|đến|xem)\s*(sang|tới)?\s*trang\s*\d+', clean_input):
            return 'NAVIGATION'
            
        return 'SLIDE_QUERY'

    def run(self, user_input: str, current_page: int = 1, pdf_text_map: dict = None) -> dict:
        """Vòng lặp thực thi ReAct Agent kèm Guardrail."""
        pdf_text_map = pdf_text_map or {}
        intent = self.classify_intent(user_input)

        # GUARDRAIL 1: Nếu sinh viên chỉ chào hỏi -> Phản hồi trực tiếp, KHÔNG tra slide
        if intent == 'GREETING':
            thought = "Ý định: GREETING. Sinh viên chỉ chào hỏi xã giao. Trả lời thân thiện trực tiếp, KHÔNG gọi tool tra cứu slide."
            answer = "Chào bạn! Mình nghe đây 👋\n\nMình là **VLearn Tutor**, rất vui được đồng hành cùng bạn trong môn học **COMP2010**. Bạn có thắc mắc gì về bài học hoặc cần hỗ trợ tra cứu slide không?"
            return {
                "thought": thought,
                "action": "respond_directly",
                "final_answer": answer,
                "target_page": None
            }

        # GUARDRAIL 2: Nếu sinh viên yêu cầu chuyển trang
        if intent == 'NAVIGATION':
            match = re.search(r'trang\s*(\d+)', user_input, re.IGNORECASE)
            target_p = int(match.group(1)) if match else current_page
            thought = f"Ý định: NAVIGATION. Sinh viên muốn chuyển đến trang {target_p}. Thực thi công cụ điều hướng."
            answer = f"Đã hiểu! Mình chuyển ngay cho bạn tới [Trang {target_p}] nhé."
            return {
                "thought": thought,
                "action": "navigate_to_page",
                "final_answer": answer,
                "target_page": target_p
            }

        # GUARDRAIL 3: Hỏi đáp bài học slide PDF
        thought = f"Ý định: SLIDE_QUERY. Đọc dữ liệu trang {current_page} và tra cứu thông tin slide."
        current_text = get_current_page_text(current_page, pdf_text_map)
        
        answer = f"Dựa trên nội dung tại [Trang {current_page}], thông tin liên quan đến câu hỏi của bạn như sau:\n\n{current_text.get('content', '')[:300]}"
        return {
            "thought": thought,
            "action": "get_current_page_text",
            "final_answer": answer,
            "target_page": current_page
        }

if __name__ == '__main__':
    agent = VLearnReActAgent()
    # Test thử lời gọi 'alo'
    result = agent.run("alo", current_page=1)
    print(json.dumps(result, ensure_ascii=True, indent=2))
