# Ghi chú nội bộ (không nộp)

File nộp chính thức: `BAO_CAO_CUOI_KY_NOOK_KY.docx` (bản xem trước: `BAO_CAO_CUOI_KY_NOOK_KY_preview.pdf`).

## a. Đối chiếu yêu cầu đề bài

| Yêu cầu | Trạng thái | Ở đâu |
| --- | --- | --- |
| Sản phẩm 1: website TMĐT | Đạt, kèm rủi ro: đề yêu cầu WordPress/WooCommerce, website đang chạy Next.js (đã ghi rõ quá trình chuyển trong mục 1.2) | nookky.shop |
| Sản phẩm 2: báo cáo cuối kỳ | Đạt khung và số liệu; còn [CẦN BỔ SUNG] thông tin nhóm | file .docx |
| Sản phẩm 3: bài thuyết trình | Đã có | `../presentation/` |
| Vai trò từng thành viên trong báo cáo | Đủ vai trò, trách nhiệm, sản phẩm bàn giao; CHƯA có tên, MSSV | Bảng 1 |
| ≥ 3 thay đổi làm thật trên website | Đã code, kiểm thử (test, typecheck, build), chụp ảnh ngày 26/10/2026; chỉ lên production sau khi merge PR | Phần 4 |
| Mỗi thay đổi đủ: Vấn đề, Thay đổi, Ảnh Trước-Sau, Lý do dữ liệu | Đạt cả 3 | Mục 4.1, 4.2, 4.3; Hình 5, 6, 7 |
| Phần 1 Bối cảnh: ngành hàng, lý do, định vị, khách hàng | Đạt; lý do chọn, USP, persona còn [CẦN BỔ SUNG] | Phần 1 |
| Phần 2: công cụ, thời gian, cách thu thập | Đạt (GA4, order log, tự duyệt web có kịch bản, rà soát mã nguồn) | Bảng 3 |
| Phần 3: đủ 4 mảng, mỗi mảng có số liệu + kết luận | Đạt | Mục 3.1 đến 3.4 |
| Phần 5: tác động dự kiến, đo lại, hạn chế | Đạt; chưa có số liệu sau thay đổi | Phần 5 |
| Độ dài 6 đến 10 trang (không tính phụ lục) | Đạt: phần 1 đến 5 chiếm 9 trang (trang 4 đến 12) | |
| Font, định dạng nhất quán, đánh số trang | Đạt: Times New Roman 12, giãn dòng 1,15, "Trang x / y" | |

## b. Việc còn lại theo thứ tự

1. Merge PR để 3 thay đổi lên nookky.shop; ghi ngày merge vào mục 4 và Bảng 10.
2. Điền Bảng 1 (tên, MSSV), lý do chọn ngành, USP, persona, ngày chuyển nền tảng, lọc traffic nội bộ, chi phí quảng cáo.
3. Chụp 4 ảnh GA4 (Hình 8 đến 11) cho Phụ lục A.
4. Xác nhận nguồn traffic /blog và 289 lượt hero_secondary_click.
5. Sau 14 ngày kể từ ngày merge: điền cột "Sau" của Bảng 10.

## c. 3 câu hỏi hội đồng có thể hỏi

**1. "Đề yêu cầu WordPress/WooCommerce, sao website lại là Next.js?"**
Gợi ý: Nhóm dựng bản WordPress/WooCommerce V3.2 trước, sau đó chuyển giao diện sang Next.js trên Vercel để mỗi thay đổi có link xem trước riêng, kiểm thử được trước khi đưa lên bản chính, phù hợp với vòng phân tích, thay đổi, đo lại của đồ án. [Nhóm cần chuẩn bị bằng chứng bản WordPress nếu giảng viên yêu cầu.]

**2. "Organic Search có thật sự tốt hơn Direct không?"**
Gợi ý: Về tương tác thì có: ER 71,8% so với 57,1%, khoảng tin cậy 95% không chồng nhau, p < 0,001. Về tỉ lệ đặt đơn (2,32% so với 1,23%) thì chưa khẳng định được, p = 0,08 vì chỉ 19 và 12 đơn.

**3. "Lấy gì chứng minh thay đổi dựa trên dữ liệu chứ không phải cảm tính?"**
Gợi ý: Mỗi thay đổi gắn với một con số và một lỗi kiểm chứng được: CTA có 574 lượt bấm nhưng trỏ đến neo không tồn tại (Hình 5); PDP rớt 81,7% và thông tin giao hàng, bảo hành chỉ có trong chatbot (237 tin nhắn); checkout rớt 64,9% với 7 trường hiển thị trong khi chỉ 4 trường bắt buộc. Mỗi thay đổi có chỉ số đo lại cụ thể (Bảng 10).
