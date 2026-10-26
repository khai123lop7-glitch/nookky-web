# Ghi chú nội bộ (không nộp)

## a. Checklist tự kiểm tra

| Hạng mục | Trạng thái |
| --- | --- |
| Đủ 5 phần, đúng tên gốc | Đạt |
| Chỉ dùng số liệu GA4 Nook Ký 01 đến 25/10/2026 | Đạt |
| Traffic: số liệu + 1 kết luận | Đạt (Bảng 4, 5, 6) |
| Phiên truy cập: số liệu + 1 kết luận | Đạt (Bảng 7, 8) |
| Luồng di chuyển: số liệu + 1 kết luận | Đạt (Bảng 9, 10) |
| Điểm nghẽn: số liệu + 1 kết luận | Đạt (Bảng 11, 12) |
| Mỗi thay đổi đủ 4 mục | Đủ khung; chưa triển khai, chưa chụp ảnh |
| Tối thiểu 3 thay đổi làm thật trên web | CHƯA |
| Vai trò thành viên | CHƯA: Bảng 0 trống |
| Không dùng dấu gạch dài | Đạt |
| Số trang ước tính | Khoảng 9 đến 10 trang A4 (font 12pt, giãn dòng 1,15, tính cả bảng), không tính phụ lục ảnh. Nếu vượt 10 trang, chuyển Bảng 8 và Bảng 12 xuống phụ lục |

**Danh sách [CẦN BỔ SUNG] còn lại**

1. Tên nhóm, lớp, giảng viên; Bảng 0 thành viên.
2. Lý do chọn ngành hàng; USP chính thức; persona (độ tuổi, nghề nghiệp, khu vực).
3. Ngày chuyển từ WordPress sang Next.js.
4. Có lọc traffic nội bộ không; chi phí quảng cáo Paid Social.
5. Nguồn của traffic /blog (32 landing, 149 lượt xem).
6. Chính sách đổi trả, thời gian giao thực tế (cho Thay đổi 2).
7. Ngày triển khai, xác nhận nội dung và ảnh Hình 4, 5, 6.
8. Baseline Thay đổi 1 (GA4 Exploration lọc landing = /) và tỉ lệ thêm giỏ theo thiết bị.
9. Số liệu sau thay đổi.

## b. 3 câu hỏi hội đồng có thể hỏi

**1. "Organic Search có thật sự tốt hơn Direct không, hay chỉ do may mắn?"**
Gợi ý: Về mức độ tương tác thì có: ER 71,8% so với 57,1%, khoảng tin cậy 95% không chồng nhau, z = 6,47, p < 0,001. Về tỉ lệ đặt đơn (2,32% so với 1,23%) thì chưa khẳng định được, p = 0,08 vì chỉ có 19 và 12 đơn. Nhóm trình bày đúng mức độ chắc chắn này.

**2. "574 lượt bấm vào nút CTA hỏng, làm sao biết người dùng bị mất?"**
Gợi ý: GA4 ghi nhận lượt bấm nhưng nút trỏ đến neo không tồn tại nên trang không đổi; đây là lỗi kiểm tra được bằng thao tác trực tiếp (Hình 4). Nhóm không khẳng định 574 lượt đều mất hẳn vì người dùng có thể tự tìm menu. Cách đo: so tỉ lệ session landing trang chủ có view_item_list trước và sau khi sửa.

**3. "Vì sao không dùng purchase của GA4 làm số đơn?"**
Gợi ý: purchase (57) cao hơn số order_id duy nhất (52) vì code gửi sự kiện trước khi server xác nhận lưu đơn. Nhóm dùng order_id trong order log làm số đơn, và tách 35 đơn đã thu tiền khỏi 52 đơn đặt; doanh thu báo cáo là 33.413.000đ đã thu, không phải 50.723.000đ giá trị đặt.
