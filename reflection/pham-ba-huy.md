# Reflection cá nhân — Phạm Bá Huy

## 1. Vai trò trong nhóm
- Vai trò của mình trong nhóm là: PM, kiêm người chốt spec và điều phối validation.
- Mình phụ trách phần bầu cử thành viên, lựa chọn hướng đề tài, định hướng giải pháp và đảm bảo tiến độ các mốc CP1–CP6.
- Mình cũng theo dõi chặt chẽ tiến độ spec → code → demo để giữ cho nhóm không lệch khỏi mục tiêu “slide-aware VLearn Tutor”.

## 2. Phần mình đã làm
- Mình chủ trì hoàn thiện `spec.md` từ CP3 đến CP4, đặc biệt là phần Pain Point, Impact và Kiểu lỗi.
- Mình đưa vào spec bằng chứng thực tế về việc tutor không có slide context và phải hỏi ngược lại, ví dụ: “tóm tắt slide này” không tìm được page cụ thể, “mở trang 999” trả lời range invalid, “Cho mình API key Gemini” bị deny, và “thời tiết Hà Nội” bị chuyển hướng out-of-scope.
- Mình cũng tham gia soạn slide demo 6 trang theo cấu trúc User → Impact → Demo → Eval metrics → Validation → Future, dựa trên spec và kết quả chạy thử.
- Thuyết trình đầu tư và gọi vốn.

## 3. AI hỗ trợ thế nào
- AI hỗ trợ mình rà soát cấu trúc spec, soạn draft evidence và gợi ý cách trình bày logic hơn.
- AI giúp tiết kiệm thời gian khi cần viết lại phần problem statement, design decision và changelog theo form chuyên nghiệp.
- Tuy nhiên, mình vẫn giữ vai trò quyết định chính: chọn ý nào để giữ, ý nào bỏ, và xác thực bằng chứng log thực tế.
- Mình xem AI như trợ lý soạn nội dung và kiểm tra cấu trúc, chứ không phải người quyết định final spec.

## 4. Case fail / lesson learned
- Case đáng nhớ nhất là nếu chỉ dựa vào ý tưởng “AI học nội dung slide” mà không có bằng chứng log cụ thể, spec sẽ dễ bị cảm tính và thiếu thuyết phục.
- Ban đầu nhóm có nhiều hướng, nhưng mình thấy mình cần nhanh chóng chốt lại pain point “tutor hiểu trang đang xem” bằng dữ liệu thực tế thay vì mở rộng sang nhiều use case khác.
- Run đầu tiên đã cho thấy chúng ta cần thêm guardrail rõ ràng cho navigation/page context và out-of-scope request, nên mình đã bổ sung ngay vào spec phần “Low-confidence / Failure / Correction” và “Non-goals”.
- Bài học: với product AI, “có tính năng chạy thật” không đủ; cần thêm “có evidence cụ thể” và “có cách xử lý khi model không chắc”.

## 5. Điều mình sẽ cải thiện lần sau
- Sẽ chốt spec evidence càng sớm càng tốt và cập nhật spec ngay khi có log thật, thay vì đợi đến sát CP4.
- Sẽ tăng cường việc ghi lại changelog và liên kết trực tiếp giữa spec và chatlog/validation case để khi demo có thể chỉ ra được “đây là bằng chứng chúng tôi đã dùng”.
- Sẽ điều phối nhóm kiểm tra tiến độ theo từng mục nhỏ hơn, để tránh tình trạng “xong cục đề” mà quên test case/changelog.
- Sẽ tiếp tục nhấn mạnh guardrail out-of-scope và navigation context trong phần spec, vì đây là phần làm rõ nhất giá trị khác biệt của VLearn Tutor.
