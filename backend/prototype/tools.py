"""
Khai báo các công cụ (Tools) cho VLearn ReAct Agent
"""

def respond_directly(message: str) -> dict:
    """Trả lời trực tiếp sinh viên không cần tra cứu slide (Dành cho chào hỏi/xã giao)."""
    return {
        "tool_used": "respond_directly",
        "result": message
    }

def get_current_page_text(current_page: int, pdf_text_map: dict) -> dict:
    """Lấy nội dung văn bản của trang slide hiện tại."""
    text = pdf_text_map.get(current_page, "(Trang slide này không có văn bản)")
    return {
        "tool_used": "get_current_page_text",
        "page": current_page,
        "content": text
    }

def search_slide_content(query: str, pdf_text_map: dict) -> dict:
    """Tìm kiếm từ khóa trong tất cả các trang slide PDF."""
    results = []
    query_lower = query.lower()
    
    for page_num, text in pdf_text_map.items():
        if query_lower in text.lower():
            snippet = text.replace('\n', ' ')[:200]
            results.append({
                "page": page_num,
                "snippet": snippet
            })
            
    return {
        "tool_used": "search_slide_content",
        "query": query,
        "matches": results
    }

def navigate_to_page(page_number: int) -> dict:
    """Tạo lệnh điều hướng trình đọc slide đến trang chỉ định."""
    return {
        "tool_used": "navigate_to_page",
        "target_page": page_number,
        "citation": f"[Trang {page_number}]"
    }

def download_slide_file(file_name: str, download_url: str) -> dict:
    """Tạo công cụ hỗ trợ sinh viên tải về tệp slide PDF bài học."""
    return {
        "tool_used": "download_slide_file",
        "file_name": file_name,
        "download_url": download_url,
        "action": "trigger_download"
    }
