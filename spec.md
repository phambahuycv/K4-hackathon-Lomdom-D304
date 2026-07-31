# AI SPEC — Slide-aware VLearn Tutor · Nhóm 04 · Zone A
Hướng: [x] A — VLearn  [ ] B — Trợ lý Học viên  [ ] C — Làn mở
Loại: [x] Tối ưu tính năng có sẵn  [ ] Tính năng mới

## §1. User & Job
- Job executor + workflow: Sinh viên đang học trong buổi học/ôn tập trên VLearn, đang nhìn một slide cụ thể, muốn hiểu ngay nội dung của trang đó hoặc tóm tắt nội dung để tiếp tục học. Workflow: mở slide → đặt câu hỏi về trang hiện tại/slide đang xem → hệ thống dùng ngữ cảnh trang hiện tại để trả lời → nếu không chắc, hỏi lại hoặc thu hẹp phạm vi.
- Core JTBD: Khi đang xem một slide trong buổi học, tôi muốn hiểu ngay nội dung của trang đang nhìn để tiếp tục học mà không cần tốn công mô tả lại slide cho AI.
- Problem statement: Học viên phải tự mô tả lại trang slide mình đang xem và AI thường không hiểu đúng ngữ cảnh đang hiển thị, dẫn đến câu trả lời sai, thiếu căn cứ hoặc phải hỏi ngược lại.
- Evidence (Đường B — mining):
  - Số liệu mining: trên 105 cặp student–tutor lọc từ 91 conversation của 85 user, 56/105 (53%) học viên yêu cầu tóm tắt nội dung slide/trang cụ thể; 53/105 (50%) tutor báo không tìm thấy nội dung trang/slide; 51/105 (49%) tutor hỏi ngược lại người dùng cung cấp thêm ngữ cảnh; 9/105 (9%) có rating down.
  - ≥5 quote nguyên văn + nguồn:
    1. Case C0076: "tóm tắt slide này" → tutor trả lời: "tôi đã tra cứu ... chưa tìm thấy nội dung cụ thể của Trang 33". Nguồn: mining-log.md.
    2. Case C0031: "tóm tắt các chủ đề chính của slide day05-lecture-slides-batch03.pdf này" → tutor không truy cập được file. Nguồn: mining-log.md.
    3. Case C0414: "Tổng hợp thông tin của toàn bộ bài giảng hôm nay" → tutor không thể truy xuất nội dung tổng hợp. Nguồn: mining-log.md.
    4. Case C0001: "tóm tắt nội dung chính trong slide này" → tutor trả lời không tìm thấy nội dung cho slide 37. Nguồn: mining-log.md.
    5. Case C0021: "giải thích nghĩa chi tiết của trang 4" → tutor lại hỏi người dùng cung cấp nội dung. Nguồn: mining-log.md.
    6. Case C0165: "Tóm tắt slide pdf day2 cho tôi" → tutor xác nhận không truy cập được PDF trực tiếp. Nguồn: mining-log.md.

## §2. Impact & quyết định chọn
- Bảng impact (3 ứng viên):

| Ứng viên | Bao nhiêu người gặp | Tần suất | Mỗi lần tốn gì | Khả thi | Trạng thái |
|---|---:|---:|---|---|---|
| Tutor hiểu ngay trang đang xem và tóm tắt/giải thích nội dung đó | 56+ học viên trong mẫu mining, cộng với các lượt hỏi trang cụ thể | 53% của mẫu có intent tóm tắt trang cụ thể; 28% hỏi giải thích trang | Tốn 1–2 phút và làm gián đoạn flow học vì phải mô tả lại slide | Cao | Chọn |
| Tutor tóm tắt toàn bộ bài giảng từ trang hiện tại | 13/105 (12%) trong mẫu | Thấp hơn nhưng vẫn có nhu cầu review | Tốn nhiều thời gian và dễ sai vì quá rộng | Trung bình | Loại |
| Tutor trả lời câu hỏi về “slide này là gì” khi không có ngữ cảnh | 23/105 (22%) trong mẫu | Tần suất vừa phải | Cần người dùng mô tả lại lại slide | Cao nhưng phụ thuộc vào cùng root cause | Chọn như một nhánh con của feature |

- Ứng viên ĐÃ LOẠI: Tóm tắt toàn bộ bài giảng từ đầu đến cuối, vì nhu cầu xuất hiện ít hơn, phạm vi quá rộng và dễ dẫn đến trả lời dài, thiếu độ chính xác.
- Ứng viên CHỌN: Tutor có khả năng hiểu trang đang xem trong VLearn và trả lời câu hỏi về nội dung trang đó bằng căn cứ, không cần học viên mô tả lại slide. Lý do bằng số: 56/105 lượt hỏi tóm tắt trang cụ thể + 53/105 lượt fail do không biết slide context + 51/105 lượt bị hỏi ngược lại.

## §3. Giải pháp tương tự đã nghiên cứu
- ChatGPT Study Mode: mạnh ở việc giải thích nhưng không tự biết ngữ cảnh trang đang mở trong một hệ thống học tập cụ thể; đáng học ở cách giải thích từng bước, đáng né ở việc không có nguồn/slide context.
- NotebookLM: đáng học ở chỗ luôn gắn câu trả lời với nguồn; đáng né ở chỗ yêu cầu upload tài liệu và không tự lẫn vào flow học hiện tại của VLearn.
- Khanmigo / Quizlet AI: có thể hỗ trợ học tập, nhưng thường không thể trực tiếp hiểu trạng thái “người dùng đang xem trang nào trong bài giảng”. Điểm khác của mình là tích hợp trực tiếp vào flow đọc slide hiện tại của VLearn.

## §4. Thiết kế
- Lát cắt MỘT CÂU: Khi sinh viên đang xem một slide trong VLearn và hỏi về nội dung trang đó, hệ thống tự dùng ngữ cảnh trang đang mở để trả lời ngay bằng căn cứ, và nếu không chắc hoặc ngoài phạm vi thì hỏi lại/thu hẹp phạm vi thay vì bịa.
- Non-goals (không build trong vòng này):
  - Không tự chấm bài/quiz cho học viên.
  - Không hỗ trợ toàn bộ khoá học bằng tìm kiếm tự do ngoài dữ liệu slide đã cung cấp.
  - Không thay thế TA/giảng viên khi câu hỏi cần thẩm quyền chuyên môn.
  - Không xây dựng hệ thống upload và index tài liệu mới ngoài slide hiện có.
  - Không đọc hoặc giải thích biểu đồ, hình ảnh hay vùng khoanh annotation khi request chỉ có text; tutor phải báo rõ giới hạn này thay vì đoán.
- Mức prototype nhắm tới: [x] Working — phần core “dùng slide context hiện tại để trả lời câu hỏi” gọi Gemini thật; điều hướng, guardrail tài liệu và fallback cục bộ là logic hỗ trợ. Vùng khoanh/biểu đồ ảnh không thuộc scope của phiên bản này.
- Automation: [x] conditional — phần lớn trường hợp có ngữ cảnh slide rõ ràng sẽ tự trả lời; khi không chắc, thiếu căn cứ hoặc ngoài phạm vi thì chuyển sang hỏi lại/thu hẹp phạm vi. Lý do theo cost-of-error: sai ở đây có thể khiến học viên hiểu sai kiến thức, nên AI không được làm liều; cần có đường lui rõ.
- §4b. Nguyên tắc đã áp dụng:

| Nguyên tắc | Áp cụ thể vào đâu trong prototype |
|---|---|
| G1 — Làm rõ hệ thống làm được gì | Trên giao diện đầu tiên, hiện rõ: “Mình có thể giải thích nội dung trang hiện tại dựa trên slide đang mở.” |
| G10 — Thu hẹp phạm vi khi nghi ngờ | Nếu không tìm thấy nội dung trang hoặc không có ngữ cảnh đủ, hệ thống trả lời: “Mình không chắc trang này; bạn có thể mở đúng trang hoặc cho mình biết câu hỏi cụ thể hơn.” |
| G9 — Sửa dễ dàng | Người dùng có thể hỏi lại ngay bằng câu ngắn như “không, trang này là…” hoặc “giải thích ngắn hơn”. |
| G11 — Giải thích vì sao | Mỗi câu trả lời có gợi ý “dựa trên [Trang X]” và, khi cần, nêu lý do vì sao không chắc.
| PAIR — Explainability + Trust | Hiển thị trích dẫn [Trang X] và chỉ trả lời khi có căn cứ từ slide đang mở.
| PAIR — Feedback + Control | Người dùng có thể bỏ qua/đổi câu hỏi/đặt câu hỏi tiếp theo bất cứ lúc nào. |

## §5. Kiểu lỗi — 4 lớp chỗ khó + kịch bản (8+)

| Tình huống cụ thể | Lớp | Hành vi mong muốn | Nguyên tắc áp |
|---|---|---|---|
| Học viên hỏi “tóm tắt slide này” nhưng hệ thống không có nội dung trang hiện tại | Nguồn sự thật | Trả lời rõ rằng không có slide context để dùng; không bịa; cho phép mở lại trang đúng | G10, G11 |
| Học viên đang ở trang 33 nhưng hệ thống nhầm sang trang khác do mapping sai | Nguồn sự thật | Nhận diện lỗi, nêu “mình đang dùng trang X”, cho phép người dùng chỉnh lại | G10, G9 |
| Học viên hỏi Day 2 khi request chỉ có `pdf_name` và `pdfTextMap` của Day 1 | Nguồn sự thật | Nêu rõ đang mở Day 1, đề nghị/chuyển sang Day 2; tuyệt đối không tóm tắt Day 1 như Day 2 | G10, G11, PAIR — Explainability + Trust |
| Học viên hỏi “giải thích trang 4” nhưng không có đúng page context | Mơ hồ / thiếu thông tin | Hỏi lại 1 câu ngắn: “Bạn đang xem trang nào?” hoặc “Bạn muốn tóm tắt hay giải thích khái niệm?” | G10 |
| Học viên hỏi về một câu hỏi quá rộng như “tóm tắt toàn bộ bài giảng” | Ngoài phạm vi / thẩm quyền | Thu hẹp phạm vi: “Mình có thể tóm tắt trang hiện tại hoặc một phần slide đã chọn” | G10, G11 |
| Học viên hỏi về thời tiết/đời sống thay vì môn học | Ngoài phạm vi / thẩm quyền | Lịch sự chuyển hướng về nội dung học tập, không lẫn sang đời sống | G1 |
| Học viên hỏi về khái niệm khó và AI hiểu sai vì slide không đủ chi tiết | Đặc thù domain | Trả lời bằng cách nêu “dựa trên slide hiện tại” và lưu ý nếu cần hỏi TA/giảng viên | G11 |
| Học viên khoanh đỏ biểu đồ/chữ trên slide nhưng hệ thống không nhận ảnh hoặc tọa độ annotation | Đặc thù domain | Nêu rõ không thấy vùng khoanh; không đoán biểu đồ/chữ; hướng dẫn bôi text hoặc mô tả nhãn/số liệu | G10, G11, PAIR — Errors + Graceful Failure |
| Học viên không đồng ý với câu trả lời: “không, trang này là…” | Correction / sửa sai | Chấp nhận sửa, cập nhật context và phản hồi lại | G9 |
| Học viên đưa một câu hỏi có nhiều nghĩa (ví dụ “giải thích slide này”) | Mơ hồ / thiếu thông tin | Yêu cầu làm rõ bằng một câu hỏi ngắn, không đoán | G10 |

## §6. Bốn đường đi của trải nghiệm
- Happy path: Học viên đang xem slide, hỏi “tóm tắt nội dung chính của trang này”, hệ thống đọc trang hiện tại, trả lời ngắn gọn, có trích dẫn [Trang X].
- Low-confidence (②): Học viên hỏi về trang nhưng ngữ cảnh thiếu hoặc không đủ rõ; hệ thống nói rõ “mình chưa chắc” và hỏi thêm một câu ngắn thay vì đoán.
- Failure/không căn cứ (①): Không có nội dung trang, mapping page lỗi hoặc user hỏi Day 2 khi context đang là Day 1; hệ thống nói rõ tài liệu/trang hiện có, không bịa và cho phép người dùng chỉnh lại.
- Correction (user sửa): Người dùng phản hồi “không, mình đang xem trang 14” hoặc chuyển sang đúng tài liệu Day 2; hệ thống cập nhật context và phản hồi lại.
- Khi bị đòi ngoài phạm vi (③): Học viên hỏi chuyện ngoài môn học hoặc yêu cầu làm quá phạm vi; hệ thống chuyển hướng ngắn gọn.
- Case đặc thù domain (④): Nếu câu hỏi cần chuyên môn sâu, biểu đồ ảnh hoặc vùng khoanh không được gửi vào request, hệ thống nêu giới hạn và đề xuất bôi text/mô tả nhãn-số liệu hoặc hỏi TA/giảng viên.

## §7. Kiểm thử
- Chiều chất lượng + định nghĩa kiểm chứng được:
  - Groundedness: câu trả lời có căn cứ từ slide hiện tại hoặc nói rõ không có căn cứ.
  - Relevance: câu trả lời đúng câu hỏi về trang/slide hiện tại.
  - Safety/clarity: không bịa, không vượt phạm vi, không làm học viên hiểu sai.
- Golden set: `eval/golden-set.csv` gồm 20 case: 8 case thường, 8 case khó/biên, 4 case hiếm; trong đó 10 case phát triển từ chatlog thật. Cách chấm nằm tại `eval/scoring-rubric.md`.
- Quality bar (chốt từ 23:59 N1 và giữ nguyên): “Đạt khi ít nhất 17/20 case (85%) pass, và 0 lỗi grounding/an toàn ở GS09, GS10, GS13, GS15, GS16.”
- Kết quả các lượt chạy:

| Lượt chạy | Groundedness | Relevance | Safety | Ghi chú |
|---|---:|---:|---:|---|
| Lượt 1 (manual) | 17/18 case đã chạy (94,4%) | 14/18 (77,8%) | 14/18 (77,8%) | `eval/run-01.csv`: 14/20 pass theo toàn bộ golden set; GS09 và GS17 chưa chạy đúng fixture; chưa đạt quality bar |
| Lượt 2 | TBD | TBD | TBD | Chạy lại đủ 20 case sau khi sửa guardrail vùng khoanh và guardrail tài liệu Day 2 |

- Failure analysis Run 01: `eval/run-01.md`. Failure chính là Gemini tóm tắt Day 1 như Day 2 (GS18), phản hồi chưa minh bạch về giới hạn vùng khoanh (GS10, GS16) và chưa hỏi lại input mơ hồ “Trang 8” (GS12). Không đạt quality bar không làm mất toàn bộ điểm R4 nếu kết quả, case fail và phân tích nguyên nhân được giữ đầy đủ; tuy nhiên Run 01 chưa đủ điều kiện đóng CP3 vì GS09 và GS17 chưa chạy đúng fixture.

## §8. Phân công & kế hoạch
- Phân công có tên:
  - Phạm Bá Huy — PM/spec: hoàn thiện spec, bảng impact, kế hoạch validation, slide và điều phối checkpoint.
  - Trần Văn Đông — Backend Engineer: FastAPI `/api/tutor`, quản lý biến môi trường Gemini, guardrail tài liệu Day 1/Day 2 và fallback backend.
  - Hoàng Văn Thành — Frontend Engineer: PDF viewer, trạng thái tài liệu/trang đang mở, trích xuất text, selection và điều hướng UI.
  - Bùi Đức Hiếu — AI Engineer: system prompt, phân loại intent, structured response Gemini và guardrail groundedness.
  - Lăng Nhật Minh — Data & QA: mining evidence, golden set, scoring rubric, Run 01/Run 02 và phân tích failure.
  - Demo/dry run: Phạm Bá Huy điều phối; cả nhóm chuẩn bị phần mình giải thích được, gồm một happy path và một case failure.
- Willing users (≥3 người): Cao Nam, Phương Nam và An. Cả ba đã tham gia validation CP5, được đánh dấu trong `validation/feedback-log.md`. Kế hoạch validation: 1) giao task thật “hãy dùng trợ lý này để hiểu nội dung trang đang mở”; 2) quan sát chỗ bấm, chỗ khó hiểu; 3) hỏi đúng 3 câu: “Điều gì khó hiểu nhất?”, “Kết quả này có tin không?”, “Bạn có dùng thật không?”. Mỗi người thử được log thành 1 dòng trong `validation/`.
- Multi-prototype (nếu làm): hai phương án sẽ được thử trước khi chốt: (1) trả lời ngay khi có slide context, (2) hỏi trước “bạn muốn tóm tắt hay giải thích?” trước khi trả lời. Chọn phương án 1 vì ít gây friction và khớp trực tiếp với pain trong mining log.

## §9. Changelog
| Thời điểm | Đổi gì | Vì sao |
|---|---|---|
| 2026-07-31 | Hoàn thiện spec cho feature “slide-aware VLearn Tutor” | Dựa trên bằng chứng mining log và hiện trạng code trong repo |
| 2026-07-31 | Chốt automation ở mức conditional | Vì sai có thể làm học viên hiểu sai kiến thức, nên cần đường lui rõ |
| 2026-07-31 | Chốt không hỗ trợ đọc biểu đồ ảnh/vùng khoanh annotation | Run 01 cho thấy request không gửi ảnh/crop/toạ độ; GS10 và GS16 chuyển sang kiểm tra graceful failure |
| 2026-07-31 | Ghi nhận Run 01 chưa đạt quality bar | `eval/run-01.csv`: 14/20 pass, 4 fail, 2 case chưa chạy đúng fixture; cần guardrail Day 2 và vùng khoanh trước Run 02 |
| 2026-07-31 | Hoàn thành validation CP5 với 5 học viên ngoài nhóm | `validation/feedback-log.md`: 3 willing user và 2 feedback cao xác nhận cần guardrail Day 2 cùng thông báo rõ giới hạn vùng khoanh |
