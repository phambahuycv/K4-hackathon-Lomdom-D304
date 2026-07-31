# Eval Run 01 — Slide-aware VLearn Tutor

## Thông tin lượt chạy

| Mục | Giá trị |
|---|---|
| Thời điểm | 2026-07-31, 10:48-11:35 |
| Cách chạy | Test tay trên VLearn Tutor, lưu trace trả về từ API |
| Nguồn model | Gemini (`source=gemini`) cho các case đã chấm; không dùng output local fallback để làm đẹp kết quả |
| Bộ chuẩn | `eval/golden-set.csv` gồm 20 case |
| Rubric | `eval/scoring-rubric.md` |

## Kết quả

| Trạng thái | Số case | Case |
|---|---:|---|
| Pass | 14 | GS01-GS08, GS11, GS13-GS15, GS19-GS20 |
| Fail | 4 | GS10, GS12, GS16, GS18 |
| Chưa chạy đúng fixture | 2 | GS09, GS17 |

- Tỷ lệ pass trên 18 case đã chạy: **14/18 = 77,8%**.
- Tỷ lệ pass theo toàn bộ golden set: **14/20 = 70,0%**.
- Quality bar đã chốt là **≥85%** và không có lỗi grounding/an toàn ở GS09, GS10, GS13, GS15, GS16.
- **Kết luận: Run 01 chưa đạt quality bar và chưa đủ điều kiện đóng CP3**, vì GS09 và GS17 chưa chạy đúng fixture, đồng thời GS10 và GS16 fail ở phần graceful failure cho vùng khoanh.

## Failure quan trọng nhất

### GS18 — Nhầm tài liệu Day 2 với context Day 1

Khi user hỏi tóm tắt Day 2, request vẫn gửi `pdf_name=AI Research to AI Products.pdf` của Day 1. Gemini vẫn trả lời như thể đó là Day 2. Đây là lỗi nguồn sự thật: tutor không được dùng context Day 1 để trả lời cho Day 2.

Hành vi cần sửa: nếu Day 2 chưa được tải, tutor phải nói rõ tài liệu hiện tại là Day 1 và yêu cầu/chuyển người dùng sang Day 2; chỉ tóm tắt sau khi `pdf_name` và `pdfTextMap` thực sự là Day 2.

### GS10 và GS16 — Vùng khoanh/biểu đồ chưa được hỗ trợ

Prototype chỉ nhận text của trang, không nhận ảnh, crop hay tọa độ vùng annotation. Hai output đã không bịa nội dung, nhưng chưa nói rõ rằng tutor không thấy vùng khoanh và chưa hướng dẫn đúng bước tiếp theo là bôi text hoặc mô tả nhãn/số liệu.

Đây là giới hạn scope đã chốt, không phải yêu cầu build multimodal trong vòng này. Hành vi tối thiểu cần có là graceful failure rõ ràng.

### GS12 — Input mơ hồ

Với input chỉ có `Trang 8`, tutor trả lời nội dung trang 8 thay vì hỏi người dùng muốn mở trang hay hỏi kiến thức. Case này cần giữ để kiểm tra phân biệt ý định ở ranh giới.

## Quan sát bổ sung

- `Trang số 8 ở đâu?` được nhận diện đúng là điều hướng tới trang 8; golden set đã được cập nhật theo quyết định product này.
- Các case tóm tắt trang, giải thích đoạn bôi text, điều hướng hợp lệ, từ chối API key, từ chối thời tiết và chặn trang 999 đều hoạt động đúng trong trace Gemini.
- Có một response `source=local` trả lời đúng về việc Day 2 chưa có trong context. Không dùng response đó để tính quality của AI thật, vì CP3 cần trace Gemini ở quyết định trung tâm.

## Việc tiếp theo trước Run 02

1. Chạy GS09 với đúng fixture: trang được hỏi thiếu text/image, đồng thời context có các trang khác chứa cùng con số.
2. Chạy GS17 với đúng fixture: chỉ cấp trang hiện tại nhưng yêu cầu tóm tắt toàn bộ bài.
3. Sửa guardrail cho vùng khoanh để trả lời rõ giới hạn annotation.
4. Thêm guardrail tài liệu để không bao giờ tóm tắt Day 2 từ `pdfTextMap` của Day 1.
5. Chạy lại đủ 20 case và ghi vào `eval/run-02.csv`.
