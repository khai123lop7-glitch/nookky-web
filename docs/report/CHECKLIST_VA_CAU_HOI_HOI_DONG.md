# Ghi chú nội bộ (không nộp)

## a. Checklist tự kiểm tra

| Hạng mục | Trạng thái |
| --- | --- |
| Đủ 5 phần, đúng tên gốc | Đạt |
| Không dùng số liệu PhotoBuzz | Đạt (đã xóa toàn bộ) |
| Traffic: số liệu + 1 kết luận | CHƯA: chờ export GA4 Nook Ký |
| Phiên truy cập: số liệu + 1 kết luận | CHƯA: chờ export GA4 Nook Ký |
| Luồng di chuyển: số liệu + 1 kết luận | CHƯA có số liệu; đã có bằng chứng giao diện (#shop-all, /studio) |
| Điểm nghẽn: số liệu + 1 kết luận | CHƯA có số liệu; đã có bằng chứng giao diện (form 4 trường) |
| Mỗi thay đổi đủ 4 mục | Đủ khung; chưa có số liệu, chưa triển khai, chưa chụp ảnh |
| Tối thiểu 3 thay đổi làm thật trên web | CHƯA |
| Vai trò thành viên | CHƯA: Bảng 0 trống |
| Không dùng dấu gạch dài trong nội dung nộp | Đạt |
| Số trang ước tính | Khoảng 8 trang A4 khi điền đủ số liệu, không tính phụ lục ảnh |

**Việc cần làm theo thứ tự**

1. Xác nhận biến NEXT_PUBLIC_GA4_MEASUREMENT_ID trên Vercel và GA4 Realtime có dữ liệu từ nookky.shop.
2. Sửa tracking P0 (Bảng 3), bật lọc internal traffic.
3. Thu dữ liệu giai đoạn 1 tối thiểu 7 ngày, xuất: Traffic acquisition, Tech, Pages and screens, Landing page, Events, Funnel exploration.
4. Điền Phần 3; kiểm tra số liệu có ủng hộ 3 thay đổi không.
5. Triển khai 3 thay đổi, chụp ảnh Trước và Sau.
6. Thu dữ liệu giai đoạn 3 cùng độ dài, điền Bảng 11.
7. Điền: thành viên, lý do chọn ngành, USP, persona, ngày chuyển nền tảng, kênh phân phối.

## b. 3 câu hỏi hội đồng có thể hỏi

**1. "Vì sao purchase trong GA4 không được dùng làm số đơn hàng?"**
Gợi ý: Vì code bắn purchase ngay khi gửi yêu cầu ghi đơn, không chờ server xác nhận, và với chuyển khoản thì lúc đó khách chưa chắc đã trả tiền. Nhóm dùng order_id duy nhất trong order log làm số đơn, và tách "khách tự báo đã trả" với "đã đối soát nhận tiền".

**2. "Các thay đổi được đề xuất trước khi có số liệu, vậy có phải cảm tính không?"**
Gợi ý: Bằng chứng ban đầu là lỗi chức năng kiểm tra được (nút trỏ đến neo không tồn tại, trang cụt không có liên kết), không phải sở thích thẩm mỹ. Sau đó mỗi thay đổi được kiểm chứng bằng số liệu baseline (views /shop / views trang chủ, exit rate /studio, tỉ lệ hoàn tất form) và chỉ giữ lại nếu số liệu ủng hộ.

**3. "Cỡ mẫu nhỏ như vậy, làm sao biết thay đổi có tác dụng?"**
Gợi ý: Nhóm không kết luận nhân quả. So sánh trước và sau cùng độ dài kỳ, đã lọc traffic nội bộ, ghi lại yếu tố ngoại cảnh; báo cáo rõ đây là tương quan. Bước tiếp theo để kiểm chứng là A/B test CTA Hero với cỡ mẫu tính trước.
