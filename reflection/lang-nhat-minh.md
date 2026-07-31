# Reflection cá nhân — Lăng Nhật Minh

## 1. Vai trò trong nhóm
- Vai trò của mình trong nhóm là Data & QA.
- Mình phụ trách mining chatlog để xác định pain point, xây golden set, định nghĩa cách chấm và ghi nhận kết quả eval của VLearn Tutor.

## 2. Phần mình đã làm
- Mình lọc và phân tích chatlog VLearn Tutor, tạo `mining-log.md` với 105 cặp student–tutor từ 91 conversation và 85 user. Kết quả cho thấy 53/105 lượt tutor không tìm thấy nội dung trang/slide, còn 51/105 lượt tutor hỏi ngược lại học viên cung cấp thêm ngữ cảnh.
- Mình tạo `chat_history_slide_context_mining.csv` để giữ các cặp hội thoại phục vụ evidence và xây test case.
- Mình xây `eval/golden-set.csv` gồm 20 case: 8 case thường, 8 case khó phủ bốn lớp rủi ro và 4 case hiếm; trong đó có 10 case phát triển từ chatlog thật.
- Mình viết `eval/scoring-rubric.md` để định nghĩa groundedness, hoàn thành task, an toàn/tin cậy và quality bar cho lượt đo đầu.
- Mình test tay flow AI thật và ghi nhận các hành vi cần tiếp tục kiểm thử, đặc biệt là việc hỏi Day 2 khi context đang là Day 1 và các câu hỏi về vùng khoanh trên slide.
- Mình tổng hợp trace test tay thành `eval/run-01.csv` và `eval/run-01.md`. Lượt đo đầu có 14/20 case pass theo toàn bộ golden set, 4 case fail và 2 case chưa chạy đúng fixture; vì vậy mình ghi nhận trung thực là chưa đạt quality bar thay vì loại bỏ các case fail.
- Ở CP5, mình phối hợp tổng hợp validation từ 5 học viên ngoài nhóm, trong đó có 3 willing user đã khai từ CP1. Mình ghi nhận feedback nguyên văn, phân loại mức độ và viết `validation/summary.md` để chuyển feedback thành thay đổi trước demo và backlog.

## 3. AI hỗ trợ thế nào
- Mình dùng AI để hỗ trợ rà soát các pattern trong chatlog, nhóm các kiểu failure và draft cấu trúc golden set/rubric.
- AI giúp tiết kiệm thời gian khi tổng hợp số liệu, liên kết các case mining với tiêu chí chấm và diễn đạt các hành vi mong muốn cho từng test case.
- Tuy nhiên, mình không dùng AI để tự kết luận pass/fail. Với các case grounding, AI có thể viết câu trả lời nghe hợp lý nhưng vẫn sai trang hoặc bịa nội dung, nên mình cần kiểm tra fixture, citation và output thật bằng rubric.

## 4. Case fail / lesson learned
- Một case đáng nhớ là khi học viên hỏi tóm tắt tài liệu Day 2 nhưng request đang gửi `pdf_name` và `pdfTextMap` của Day 1. Tutor vẫn trả lời bằng nội dung Day 1 thay vì nói rõ tài liệu Day 2 chưa có trong context.
- Nguyên nhân không nằm ở việc model không gọi được, vì response có nguồn `gemini`, mà ở chỗ source of truth của tài liệu đang mở chưa được ràng buộc với ý định hỏi Day 2. Tương tự, tutor chưa nhận ảnh hoặc tọa độ vùng khoanh nên không thể giải thích biểu đồ được khoanh một cách có căn cứ.
- Bài học rút ra là một AI tutor không chỉ cần prompt tốt. Hệ thống phải truyền đúng tài liệu, đúng trang và đúng vùng người học đang chỉ vào; nếu thiếu dữ liệu, nó cần nói rõ giới hạn và đưa bước tiếp theo thay vì suy đoán.
- Từ GS10 và GS16, mình chốt rằng prototype hiện tại không hỗ trợ đọc vùng khoanh hoặc biểu đồ ảnh. Vì vậy, cách chấm đúng là kiểm tra graceful failure: tutor phải nói rõ không thấy annotation và hướng dẫn người học bôi text hoặc mô tả nhãn/số liệu.

## 5. Điều mình sẽ cải thiện lần sau
- Nếu làm lại, mình sẽ chốt fixture và contract dữ liệu giữa frontend, backend và runner sớm hơn: tài liệu nào đang mở, trang nào, text/ảnh nào được gửi vào model và khi nào cần đổi tài liệu.
- Mình sẽ chạy đủ golden set sớm hơn, lưu đầy đủ output và nhờ một thành viên khác chấm độc lập các case khó trước khi chốt quality bar.
- Mình muốn nâng cấp thêm phần eval cho dữ liệu trực quan: tách case không có ảnh để kiểm tra graceful failure và case có ảnh/vùng khoanh để kiểm tra khả năng giải thích biểu đồ khi prototype hỗ trợ multimodal.
