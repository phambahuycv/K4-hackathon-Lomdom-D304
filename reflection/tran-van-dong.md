# Reflection cá nhân — Trần Văn Đông

## 1. Vai trò trong nhóm
- Vai trò của mình trong nhóm là: Backend Engineer.
- Mình phụ trách xây dựng backend cho AI Tutor, kết nối giao diện VLearn với mô hình Gemini và đảm bảo luồng hỏi đáp chạy được từ frontend đến backend.

## 2. Phần mình đã làm
- Mình tham gia chuyển prototype về một luồng chạy chính gồm frontend React/Vite và backend FastAPI, thay cho việc duy trì đồng thời nhiều giao diện thử nghiệm khác nhau.
- Mình tích hợp Gemini API ở phía backend để API key không bị đưa xuống trình duyệt, đồng thời tạo API `/api/health` để kiểm tra trạng thái cấu hình.
- Mình cấu hình CORS, file `.env.example`, `requirements.txt` và lệnh chạy chung frontend/backend để các thành viên có thể cài đặt và chạy prototype trên máy cá nhân.
- Mình sắp xếp lại các file Python cũ vào `backend/prototype/`, bao gồm phần agent, prompt và các công cụ hỗ trợ như lấy nội dung trang hiện tại, tìm nội dung slide, điều hướng trang và tải file PDF.
- Mình bổ sung xử lý intent cho các trường hợp chào hỏi, hỏi nội dung slide, yêu cầu chuyển trang, tải tài liệu, câu hỏi ngoài phạm vi và yêu cầu lấy thông tin nhạy cảm.
- Mình hỗ trợ xử lý quá trình tích hợp code lên nhánh `Dong`, kiểm tra các thay đổi sau khi pull từ `main` và đảm bảo file chứa API key thật không được commit lên repository.
- Phần mình làm hiệu quả nhất là kết nối được toàn bộ luồng: học viên đặt câu hỏi trong giao diện đọc PDF → frontend gửi ngữ cảnh trang → FastAPI gọi Gemini → trả về câu trả lời hoặc hành động tương ứng cho giao diện.

## 3. AI hỗ trợ thế nào
- Mình dùng AI để hỗ trợ đọc cấu trúc code, rà soát luồng request/response giữa frontend và backend, tìm lỗi cấu hình môi trường và đề xuất cách tổ chức lại project.
- AI giúp mình tiết kiệm thời gian khi viết API schema, cấu hình FastAPI, kiểm tra các trường hợp intent và chuẩn bị lệnh cài đặt cho Windows/PowerShell.
- Tuy nhiên, mình nhận ra code do AI đề xuất không thể được dùng ngay mà không kiểm tra. Có những lúc lệnh chạy đúng về mặt cú pháp nhưng sai thư mục, hoặc backend trả HTTP 200 nhưng câu trả lời thực tế chỉ là fallback chứ chưa chắc đã đến từ Gemini.

## 4. Case fail / lesson learned
- Một case đáng nhớ là sau khi pull code, frontend vẫn chạy nhưng AI Tutor trả lời bằng cách lặp lại một đoạn tiếng Anh trên slide thay vì tóm tắt bằng tiếng Việt. Log backend vẫn hiện `200 OK`, khiến mình ban đầu nghĩ rằng Gemini đang hoạt động bình thường.
- Nguyên nhân là backend có cơ chế fallback cục bộ khi thiếu API key hoặc khi lời gọi Gemini gặp lỗi. Vì fallback cũng trả HTTP 200 nên nếu chỉ nhìn status code thì không phân biệt được câu trả lời đến từ model thật hay từ xử lý cục bộ.
- Bài học mình rút ra là một hệ thống AI cần khả năng quan sát rõ ràng hơn một API thông thường. Ngoài việc endpoint chạy được, cần kiểm tra model có thực sự được gọi hay không, dữ liệu trang nào đã được gửi vào và fallback xảy ra vì lý do gì. Đồng thời, hướng dẫn cài đặt phải ghi rõ thư mục chạy lệnh để các thành viên có thể tái hiện môi trường giống nhau.

## 5. Điều mình sẽ cải thiện lần sau
- Nếu làm lại, mình sẽ thiết kế logging và response metadata ngay từ đầu để phân biệt rõ kết quả từ Gemini với kết quả xử lý cục bộ.
- Mình sẽ viết test cho các luồng quan trọng như tóm tắt trang hiện tại, tìm đúng trang, điều hướng, tải slide, thiếu API key và model bị gián đoạn.
- Mình muốn cải thiện thêm khả năng retrieval để chỉ gửi các trang liên quan nhất vào model, thay vì gửi quá nhiều nội dung PDF. Điều này sẽ giúp câu trả lời bám sát câu hỏi hơn, giảm chi phí và hạn chế việc AI trích dẫn sai trang.
