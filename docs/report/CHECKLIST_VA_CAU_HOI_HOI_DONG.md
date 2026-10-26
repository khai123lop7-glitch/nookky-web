# Ghi chú nội bộ (không nộp)

## a. Checklist tự kiểm tra

| Hạng mục | Trạng thái |
| --- | --- |
| Đủ 5 phần, đúng tên gốc | Đạt |
| Traffic: số liệu + 1 kết luận | Đạt (Bảng 3, 4) |
| Phiên truy cập: số liệu + 1 kết luận | Đạt (Bảng 5, 6) |
| Luồng di chuyển: số liệu + 1 kết luận | Đạt một phần: thiếu lượt xem /shop, PDP, giỏ hàng và exit rate /studio |
| Điểm nghẽn: số liệu + 1 kết luận | Đạt (Bảng 8) |
| Mỗi thay đổi đủ 4 mục (Vấn đề, Thay đổi, Ảnh Trước-Sau, Lý do dữ liệu) | Đủ khung; thay đổi CHƯA triển khai, ảnh chưa chụp |
| Tối thiểu 3 thay đổi làm thật trên web | CHƯA: cần nhóm triển khai cả 3 rồi chụp ảnh |
| Vai trò thành viên | CHƯA: Bảng 0 trống |
| Không dùng dấu gạch dài | Đạt (0 lần) |
| Số trang ước tính | Khoảng 8 đến 9 trang A4 (font 12pt, giãn dòng 1,15, tính cả bảng), không tính phụ lục ảnh |

**Danh sách [CẦN BỔ SUNG] còn lại**

1. Tên nhóm, lớp học phần, giảng viên; bảng thành viên, MSSV, vai trò, đầu việc.
2. Lý do chọn ngành hàng; câu USP chính thức.
3. Persona: độ tuổi, nghề nghiệp, khu vực (hiện là giả định).
4. Nền tảng trong kỳ đo 05/09 đến 30/09: WordPress hay Next.js, ngày chuyển đổi.
5. Mã QR đặt ở đâu; có nhờ bạn bè test không (số người, kịch bản).
6. Đối chiếu URL trong GA4: /app có phải /studio không; /share, /join và các bài blog "photostrip", "photocard K-pop", "Trung Thu" là trang nào của Nook Ký.
7. Sessions landing tại trang chủ; lượt xem /shop, PDP, giỏ hàng; exits hoặc exit rate của /studio.
8. Xác nhận lỗi nút #shop-all có trên bản live trong kỳ đo.
9. Ngày triển khai và nội dung thực tế của 3 thay đổi; ảnh Hình 3, 4, 5.
10. Số liệu sau thay đổi (hoặc ghi "chưa có").

## b. 3 câu hỏi hội đồng có thể hỏi

**1. "Direct chiếm 46,1% mà nhóm lại nói Organic Search mới là kênh tốt nhất, căn cứ đâu?"**
Gợi ý: ER Search 74,9% (KTC 95%: 69,0% đến 80,0%) so với Direct 53,0% (48,0% đến 57,9%), hai khoảng không chồng nhau, p < 0,001; thời gian tương tác 121 so với 69 giây/session. Thừa nhận Direct có thể lẫn traffic nội bộ (333 sessions từ 60 user desktop), nên chênh lệch thật có thể khác, nhưng chiều hướng khó đảo ngược vì Search ít bị traffic nội bộ ảnh hưởng hơn.

**2. "0 key event có phải nghĩa là website không bán được gì không?"**
Gợi ý: Không. GA4 chưa đánh dấu key event nào, nên 0 là thiếu đo lường. Đó là lý do Thay đổi 3 vừa rút gọn form vừa bật key event: nếu sau đó vẫn 0 hoàn tất trên số form_start tăng lên, mới kết luận được vấn đề nằm ở form.

**3. "Lấy gì chứng minh nút CTA hỏng gây ra rớt phễu 95,1%?"**
Gợi ý: Nhóm không khẳng định nhân quả. Bằng chứng gồm (a) phễu rớt mạnh nhất ở bước tương tác sang click, (b) nút chính của trang được xem nhiều nhất trỏ đến neo không tồn tại. Đây là tương quan có cơ chế hợp lý. Cách kiểm chứng: so lượt hero_primary_click và tỉ lệ xem /shop trên trang chủ trước và sau khi sửa, cùng độ dài kỳ đo và đã lọc traffic nội bộ; tiếp theo là A/B test ở mục 5.3.
