# Validation Summary — CP5

## Phạm vi

- Đã test với 5 học viên ngoài nhóm: 3 học viên khóa 3 và 2 học viên khóa 4; trong đó Cao Nam, Phương Nam và An là 3 willing user đã khai từ CP1.
- Mức độ feedback: 2 cao, 2 trung bình, 1 thấp.

## Feedback nổi bật

| Signal | Bằng chứng | Mức độ |
|---|---|---|
| Nhầm tài liệu Day 2 với file đang mở | Phương Nam: “Đang hỏi Day 2 nhưng mà nó vẫn nói về file đang mở, nó làm tôi hơi lầm tưởng.” | Cao |
| Không đọc được slide chủ yếu là hình/biểu đồ | Thịnh: “Slide này toàn hình nên tôi không biết phải bôi text gì cho tutor; cuối cùng vẫn phải tự đoán.” | Cao |
| Input ngắn về số trang bị hiểu lệch ý | Cao Nam muốn mở trang 8 nhưng tutor giải thích nội dung trang 8. | Trung bình |
| Thiếu tính năng bút đỏ/vùng khoanh gây kỳ vọng sai | An đánh giá tutor tóm tắt ổn nhưng tiếc tính năng bút đỏ chưa triển khai. | Trung bình |
| Giá trị cốt lõi hoạt động | Đạt: “Đúng cái tôi cần để xem lại nhanh trước khi qua trang sau.” | Thấp |

## Chủ đề lặp nhiều nhất

Tutor cần làm rõ **nguồn ngữ cảnh đang có và giới hạn của nó**: không được dùng Day 1 để trả lời Day 2, đồng thời phải nói rõ khi không nhận được ảnh hoặc vùng khoanh.

## Thay đổi làm trước demo

1. Thêm guardrail tài liệu: nếu user hỏi Day 2 khi đang mở Day 1, tutor phải nêu rõ file hiện tại và yêu cầu/chuyển sang Day 2, không được tóm tắt nhầm.
2. Thêm graceful failure cho marker “vùng bôi đỏ/khoanh đỏ”: nói rõ tutor không nhận được ảnh/vùng khoanh, hướng dẫn bôi text hoặc mô tả nhãn/số liệu.
3. Với input ngắn như “Trang 8”, hỏi lại user muốn mở trang hay hỏi nội dung.

## Giữ nguyên có lý do

- Giữ scope text-first: không build đọc ảnh, biểu đồ hoặc bút đỏ trong vòng hackathon vì request hiện chưa truyền ảnh/crop/toạ độ annotation vào model. Thay vào đó, hiển thị rõ giới hạn và đường lui cho người học.
- Giữ flow tóm tắt trang hiện tại vì feedback của Đạt xác nhận nó giúp xem lại nhanh trước khi sang trang tiếp theo.

## Backlog sau demo

- Gửi ảnh crop của trang/vùng khoanh vào model để giải thích biểu đồ và annotation.
- Thêm lựa chọn UI rõ ràng giữa “Mở trang X” và “Giải thích nội dung trang X”.
