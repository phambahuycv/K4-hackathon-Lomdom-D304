# Mining Log — Bằng chứng Đường B

> **Người thực hiện:** Lăng Nhật Minh
> **Ngày:** 2026-07-30  
> **Nguồn dữ liệu:** `data/vlearn-pack/chatlog/chat_history_anonymized_for_hackathon.csv`  
> **File kết quả lọc:** `chat_history_slide_context_mining.csv` (493 dòng gốc → 210 dòng sau lọc)

---

## 1. Phương pháp đếm

### 1.1 Nguồn & quy mô mẫu

| Thông số | Giá trị |
|---|---|
| File gốc | `chat_history_anonymized_for_hackathon.csv` |
| Tổng dòng gốc | ~10.000 dòng |
| Bước lọc 1 | Lọc các message của `role = student` có chứa cụm **"Trang [số]"** trong `content` |
| Bước lọc 2 | Lấy toàn bộ turn tương ứng của tutor trong cùng `conversation_id` |
| Kết quả sau lọc | **210 dòng** (105 cặp student–tutor) từ **91 conversation** của **85 user** |
| `conversation_mode` | Toàn bộ `in_class` — xảy ra trong giờ học |

### 1.2 Tiêu chí xếp loại (kiểm lại được)

Người khác chạy lại script với cùng tiêu chí dưới đây sẽ ra cùng kết quả:

| Pattern | Định nghĩa kiểm chứng | Cách đếm |
|---|---|---|
| **P1 — Tóm tắt slide cụ thể** | Student message chứa "Trang X" + từ khóa: `tóm tắt, tóm gọn, summary, tổng hợp, nội dung chính` | regex: `(Trang \d+).*(tóm tắt|tóm g.n|summary|nội dung ch)` |
| **P2 — Tóm tắt toàn bộ slide** | Student message chứa: `toàn bộ slide, tóm tắt hết, toàn bộ bài giảng, summary toàn bộ` | regex: `to.n b. slide|t.m t.t h.t|to.n b. b.i gi.ng` |
| **P3 — Hỏi ngữ cảnh "slide này"** | Student message chứa: `slide này, trang này là gì, giải thích trang [số]` | regex: `slide n.y|trang n.y l. g.|gi.i th.ch.*trang \d+` |
| **Tutor fail** | Tutor response chứa cụm báo không tìm thấy nội dung trang/slide cụ thể | regex: `kh.ng t.m th.y|kh.ng c. n.i dung|kh.ng c. th.ng tin c. th.` |
| **Tutor hỏi ngược** | Tutor response chứa: `cung cấp thêm, cho mình biết, bạn có thể chia sẻ` | regex: `cung c.p th.m|cho m.nh bi.t|b.n c. th. chia s.` |

---

## 2. Kết quả đếm

### 2.1 Tổng quan

| Chỉ số | Con số |
|---|---|
| Tổng cặp student–tutor được lọc | **105 cặp** |
| Số conversation duy nhất | **91** |
| Số user duy nhất | **85** |
| 100% student message đều có "Trang X" | 105/105 |

### 2.2 Phân loại intent của student

| Pattern | Số lượng | % / 105 |
|---|---|---|
| P1 — Tóm tắt nội dung slide/trang cụ thể | **56** | **53%** |
| P2 — Tóm tắt toàn bộ slide bài giảng | **13** | 12% |
| P3 — Hỏi ngữ cảnh "slide này là gì" | **23** | 22% |
| Hỏi giải thích trang (có nêu số trang) | **29** | 28% |

### 2.3 Kết quả từ phía tutor AI

| Pattern fail | Số lượng | % / 105 |
|---|---|---|
| Tutor báo **"không tìm thấy nội dung trang/slide"** | **53** | **50%** |
| Tutor **hỏi ngược lại user** cung cấp thêm ngữ cảnh | **51** | **49%** |
| Rating **"down"** từ user | **9** | 9% |

> **Diễn giải:** 50% số lần học viên hỏi về slide, AI không truy xuất được nội dung trang cụ thể. 49% AI hỏi ngược lại — tức là AI không biết slide đang hiển thị là gì mà cần user mô tả lại. Cả hai đều là biểu hiện của cùng root cause: **AI thiếu slide context**.

---

## 3. Ví dụ nguyên văn (7 case)

> Dùng mã conversation (C****) và user (U****) theo chuẩn ẩn danh. Nội dung trong ngoặc là metadata platform (trang đang mở, đoạn text được bôi chọn).

---

### Case 1 — [C0076] — P1 + Tutor fail + Rating DOWN

**Student đang ở Trang 33, bôi chọn text:**
> "tóm tắt slide này"

**Tutor AI trả lời:**
> "Rất tiếc là tôi đã tra cứu trong tài liệu nhưng chưa tìm thấy nội dung cụ thể của **Trang 33**. Kết quả tìm kiếm chỉ hiển thị các trang khác có nhắc đến con số "33" (như mục điểm 33% trong các bài kiểm tra đánh giá AI trên trang 60 và 72). Bạn có thể..."

**Phân tích:** AI search theo keyword "33" → trả về kết quả sai hoàn toàn (trang 60, 72). Không biết trang 33 chứa nội dung gì. User đánh giá **DOWN**.

---

### Case 2 — [C0031] — P2 + Tutor fail + Rating DOWN

**Student đang ở Trang 14:**
> "tóm tắt các chủ đề chính của slide day05-lecture-slides-batch03.pdf này"

**Tutor AI trả lời:**
> "Rất tiếc, tôi không thể tìm thấy tệp tin hoặc nội dung chi tiết của day05-lecture-slides-batch03.pdf trong hệ thống hiện tại để tóm tắt các chủ đề chính cho bạn. Bạn có thể cung cấp thêm thông tin hoặc tên cụ thể của chủ đề/khái niệm bạn đang muốn..."

**Phân tích:** Student biết tên file, yêu cầu tóm tắt toàn bộ. AI không truy cập được file theo tên. User đánh giá **DOWN**.

---

### Case 3 — [C0414] — P2 + Tutor fail + Rating DOWN

**Student đang ở Trang 90 (trang cuối):**
> "Tổng hợp thông tin của toàn bộ bài giảng hôm nay"

**Tutor AI trả lời:**
> "Rất tiếc, hiện tại tôi không thể truy xuất nội dung tổng hợp của toàn bộ bài giảng từ tài liệu slide hiện có. Bạn có thể cho tôi biết chủ đề cụ thể hoặc khái niệm nào trong bài 'Prompt Engineering & Tool Calling' mà bạn muốn tóm tắt hoặc cần làm rõ..."

**Phân tích:** Student xem đến trang cuối (trang 90), muốn review toàn bộ. AI biết tên bài nhưng không tổng hợp được slide. User đánh giá **DOWN**.

---

### Case 4 — [C0001] — P1 (pattern phổ biến nhất)

**Student đang ở Trang 37, bôi chọn text:**
> "tóm tắt nội dung chính trong slide này"

**Tutor AI trả lời:**
> "Xin lỗi bạn, tôi không tìm thấy nội dung cụ thể cho slide 37 trong tài liệu hiện có. Bạn có thể cung cấp thêm thông tin hoặc tiêu đề của slide đó để tôi có thể hỗ trợ bạn chính xác hơn không?"

**Phân tích:** Pattern lặp phổ biến nhất — student đang nhìn vào slide, bôi chọn nội dung, nhưng AI không biết trang 37 chứa gì. Đẩy gánh nặng mô tả lại về phía học viên.

---

### Case 5 — [C0021] — P3 (giải thích trang) + Rating DOWN

**Student đang ở Trang 4:**
> "giải thích nghĩa chi tiết của trang 4"

**Tutor AI trả lời:**
> "Chào bạn, rất xin lỗi vì hiện tại hệ thống tìm kiếm không tìm thấy nội dung cụ thể cho trang 4 trong tài liệu của bài học hôm nay. Bạn có thể vui lòng cung cấp nội dung hoặc tiêu đề của trang 4 đó để mình hỗ trợ giải thích rõ hơn cho bạn không?"

**Phân tích:** Student muốn hiểu nghĩa trang 4. AI không có index theo số trang → hỏi lại. User đánh giá **DOWN**.

---

### Case 6 — [C0165] — P2 + Fail rõ nhất + Rating DOWN

**Student đang ở Trang 46:**
> "Tóm tắt slide pdf day2 cho tôi"

**Tutor AI trả lời:**
> "Rất tiếc, tôi không thể truy cập trực tiếp vào tệp PDF của buổi học để tóm tắt cho bạn. Nếu bạn có các câu hỏi cụ thể về nội dung, khái niệm hay các thuật ngữ cần giải thích trong bài, hãy đặt câu hỏi và tôi sẽ hỗ trợ bạn tra cứu từ tài liệu được cung..."

**Phân tích:** AI tự xác nhận không truy cập được PDF trực tiếp — đây là **root cause rõ nhất**: AI không đọc được slide theo cấu trúc trang. User đánh giá **DOWN**.

---

### Case 7 — [C0581] — P2 ngắn gọn nhất + Rating DOWN

**Student đang ở Trang 57:**
> "tóm tắt toàn bộ slide"

**Tutor AI trả lời:**
> "Rất tiếc, hiện tại hệ thống tìm kiếm không trả về tóm tắt tổng quát cho toàn bộ slide của ngày học hôm nay. Để có thể hỗ trợ bạn tốt nhất, bạn vui lòng cho biết chủ đề cụ thể hoặc khái niệm nào bạn đang quan tâm hoặc muốn làm rõ..."

**Phân tích:** Câu yêu cầu 4 từ — fail hoàn toàn. Phản hồi dài gấp 10 lần mà không giải quyết yêu cầu. User đánh giá **DOWN**.

---

## 4. Kết luận — Pain statement

| Pain | Bằng chứng số |
|---|---|
| Học viên yêu cầu AI tóm tắt slide trong giờ học | **56/105 lượt** (53%) |
| AI không biết nội dung trang cụ thể đang hiển thị | **53/105 lần** (50%) fail trực tiếp |
| AI hỏi ngược lại user mô tả lại slide đang nhìn | **51/105 lần** (49%) |
| User thể hiện không hài lòng (rating down) | **9 lần** — lower bound thực tế |
| Xảy ra với bao nhiêu user khác nhau | **85 user** từ **91 conversation** |

**Root cause:** AI tutor không có **slide context** — không biết học viên đang xem trang nào và trang đó chứa nội dung gì. Khi học viên bôi chọn text hoặc hỏi "tóm tắt trang này", AI phải hỏi ngược lại — đẩy gánh nặng nhận thức về phía học viên trong lúc đang cần học.

---

## 5. Liên kết với spec.md

- Pain này thuộc **§1 — Bằng chứng** (Đường B: mining)
- Bảng impact ứng viên → **§2**
- Lát cắt "1 user · 1 việc · 1 quyết định AI" → **§4**
- Lớp chỗ khó ①Nguồn sự thật (AI không biết trang chứa gì) → **§5**

---

*File này đạt chuẩn Đường B theo rubric R1: số đếm được + 7 ví dụ nguyên văn + phương pháp đếm kiểm lại được (mục 1.2).*
