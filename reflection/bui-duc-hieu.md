# Reflection cá nhân — Bùi Đức Hiếu

## 1. Vai trò trong nhóm
- Vai trò của mình trong nhóm là: AI Engineer.
- Mình phụ trách phần: Thiết kế prompt, xây dựng Backend API cho VLearn Tutor, tích hợp Gemini LLM, xây dựng cơ chế Fallback an toàn và thiết kế bộ kiểm thử Golden Set (`golden-set.csv`).

## 2. Phần mình đã làm
- Mình đã tham gia vào việc:
  1. Xây dựng dịch vụ Backend trên FastAPI (`backend/main.py`) cho trợ lý học tập VLearn Tutor, xử lý phân loại ý định (Intent Classification) và tạo phản hồi dựa trên slide context.
  2. Thiết kế `SYSTEM_PROMPT` và cấu hình tham số sinh của Gemini để ép phản hồi ra đúng cấu trúc JSON, luôn tự động đính kèm trích dẫn nguồn `[Trang X]` hoặc `[Day02 - Trang X]`.
  3. Lập trình cơ chế fallback dự phòng `local_answer()` bằng rule-based khi Gemini API gặp sự cố, bị trễ mạng hoặc hết quota, giúp hệ thống hoạt động ổn định 100% không bị crash.
  4. Xây dựng bộ 20 test case chuẩn `golden-set.csv` bao gồm đủ 4 lớp rủi ro (Nguồn sự thật, Mơ hồ, Ngoài phạm vi, Đặc thù domain) và ghi log đánh giá kết quả chạy vào `eval/run-01.csv`.
- Một việc mình làm hiệu quả nhất là: Thiết kế cơ chế xử lý trường hợp thiếu ngữ cảnh (missing context) cho các case khó như GS18 và GS20 (khi học viên hỏi tài liệu Day 02 / Trang 33 trong khi chỉ mở Day 01), giúp AI từ chối bịa thông tin một cách lịch sự và đưa ra hướng dẫn chuyển file chính xác.

## 3. AI hỗ trợ thế nào
- Mình dùng AI để: Hỗ trợ viết và tinh chỉnh `SYSTEM_PROMPT`, tối ưu hóa đoạn code xử lý JSON output, và sinh các kịch bản thử nghiệm giả lập (synthetic test cases) cho Golden Set.
- AI giúp mình tiết kiệm thời gian ở chỗ: Tự động hóa việc tạo khung dữ liệu test nhanh chóng, viết các đoạn regex trích xuất trang và hỗ trợ refactor code backend sạch sẽ hơn.
- Tuy nhiên, mình cũng nhận ra: Các mô hình LLM thuần túy rất dễ bị "suy đoán quá đà" (hallucination) hoặc bỏ qua quy tắc khi prompt quá dài. Không thể trông chờ hoàn toàn vào AI tự xử lý an toàn mà phải xây dựng các lớp bọc kiểm soát (guardrails) và rule-based fallback ở Backend.

## 4. Case fail / lesson learned
- Một case đáng nhớ của nhóm là: Khi thử nghiệm case hỏi "Đọc trang 33, slide ở Day02, tìm cho tôi 3 lỗi" trong khi người dùng chỉ mở tài liệu Day 01, ban đầu AI vẫn cố gắng đọc nội dung Day 01 để tự bịa ra 3 lỗi cho người dùng.
- Nguyên nhân là: Hệ thống chưa có bộ lọc kiểm tra khớp tên tài liệu (Document Scope Check) trước khi truyền toàn bộ context vào cho Gemini xử lý.
- Bài học rút ra là: Khi làm AI product phục vụ học tập, tính chính xác và căn cứ (Groundedness & Source of Truth) là quan trọng nhất. Nếu chưa có đủ dữ liệu, AI phải thà báo chưa có và hướng dẫn người dùng hành động tiếp theo, tuyệt đối không được trả lời liều gây sai lệch kiến thức.

## 5. Điều mình sẽ cải thiện lần sau
- Nếu làm lại, mình sẽ: Tối ưu hóa dung lượng context gửi sang API (ví dụ chỉ lấy trang hiện tại và 2 trang lân cận thay vì gom toàn bộ 55.000 ký tự slide), giúp giảm đáng kể latency từ vài giây xuống dưới 1 giây.
- Mình muốn nâng cấp thêm ở chỗ: Xây dựng pipeline kiểm thử tự động (Automated Eval) bằng `promptfoo` hoặc `pytest` để tự động chấm điểm % Pass của Golden Set mỗi khi thay đổi prompt hoặc cập nhật model Gemini mới.
