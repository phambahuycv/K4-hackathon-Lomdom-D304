# Reflection cá nhân — Hoàng Văn Thành 

## 1. Vai trò trong nhóm
- Vai trò của mình trong nhóm là: **Frontend Engineer
- Mình phụ trách phần: Xây dựng toàn bộ giao diện người dùng (UI) cho ứng dụng VLearn, đặc biệt là không gian học tập (viewer hiển thị slide) và tích hợp các tính năng trợ lý AI (Tóm tắt, Highlight, và Hỏi đáp).

## 2. Phần mình đã làm
- Mình đã tham gia vào việc: 
  - Lập trình layout chính phân chia màn hình (Split-pane) giữa bài giảng và khung Chat AI.
  - Xây dựng các tính năng cốt lõi: Tab tóm tắt nội dung (theo từng slide và toàn bộ file) và Tab note lại các điểm chú ý/quan trọng.
  - Xử lý logic truyền dữ liệu (state management) để đồng bộ số trang người dùng đang xem với khung chat AI.
- Một việc mình làm hiệu quả nhất là: Tìm ra giải pháp xử lý triệt để lỗi "mất ngữ cảnh" của AI bằng cách bắt (capture) state `currentPage` ngầm dưới background và đính kèm vào mỗi request người dùng gửi đi.

## 3. AI hỗ trợ thế nào
- Mình dùng AI để: Gen nhanh các đoạn boilerplate code React, viết cấu trúc class Tailwind CSS cho UI, và sinh dữ liệu giả (mock data) để test các tab Tóm tắt/Chú ý trước khi có API thực tế.
- AI giúp mình tiết kiệm thời gian ở chỗ: Rút ngắn 70% thời gian code giao diện tĩnh. Thay vì ngồi căn chỉnh từng pixel bằng CSS, mình chỉ cần mô tả layout mong muốn bằng text, giúp mình tập trung hơn vào phần xử lý logic chuyển trang.
- Tuy nhiên, mình cũng nhận ra: AI đôi khi đưa ra các giải pháp quản lý state quá phức tạp (như lạm dụng Redux cho các logic nhỏ) hoặc code sinh ra bị lỗi re-render liên tục nếu không rà soát lại kỹ các hooks (useEffect).

## 4. Case fail / lesson learned
- Một case đáng nhớ của nhóm là: Lỗi **"AI trả lời thiếu ngữ cảnh"**. Ban đầu, khi học viên đang ở slide 15 và nhắn một câu đơn rất tự nhiên như: *"Giải thích kỹ hơn phần này"*, AI lập tức bị ngợp và phản hồi *"Bạn đang hỏi về phần nào?"* hoặc trả lời lan man sang kiến thức của chương khác.
- Nguyên nhân là: Về mặt Frontend, mình chỉ gửi duy nhất đoạn text input của người dùng lên API mà quên không "gói" thêm metadata (ngữ cảnh hiện tại). AI không hề có con mắt để nhìn thấy màn hình UI như con người.
- Bài học rút ra là: Trong phát triển sản phẩm AI, **ngữ cảnh (Context) quan trọng hơn cả prompt**. Frontend không chỉ làm nhiệm vụ hiển thị, mà còn phải đóng vai trò là "đôi mắt" của AI, âm thầm thu thập mọi bối cảnh UI (đang mở file nào, ở trang số mấy, đang bôi đen dòng nào) để gửi kèm luồng chat.

## 5. Điều mình sẽ cải thiện lần sau
- Nếu làm lại, mình sẽ: Áp dụng các thư viện quản lý Global State (như Zustand hoặc Context API) ngay từ đầu để dễ dàng mở rộng các loại ngữ cảnh (ví dụ: không chỉ truyền `currentPage` mà còn truyền cả `currentTime` nếu học viên đang xem video bài giảng).
- Mình muốn nâng cấp thêm ở chỗ: Bổ sung tính năng **"Text Selection Context"** — cho phép sinh viên bôi đen một đoạn text bất kỳ trên slide, UI sẽ hiện popup "Hỏi AI câu này" và tự động nhúng chính xác đoạn text đó vào làm ngữ cảnh, giúp các câu hỏi đơn của học viên càng thêm chuẩn xác.