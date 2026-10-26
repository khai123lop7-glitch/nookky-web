# BÁO CÁO CUỐI KỲ

**Phân tích hành vi người dùng và cải thiện giao diện website Nook Ký (nookky.shop)**

Nhóm: [CẦN BỔ SUNG: tên nhóm, lớp học phần, giảng viên hướng dẫn]

**Bảng 0. Thành viên và vai trò**

| Thành viên | MSSV | Vai trò chính | Đầu việc cụ thể |
| --- | --- | --- | --- |
| [CẦN BỔ SUNG] | [CẦN BỔ SUNG] | Quản trị website | [CẦN BỔ SUNG] |
| [CẦN BỔ SUNG] | [CẦN BỔ SUNG] | Phân tích dữ liệu | [CẦN BỔ SUNG] |
| [CẦN BỔ SUNG] | [CẦN BỔ SUNG] | Thiết kế giao diện | [CẦN BỔ SUNG] |
| [CẦN BỔ SUNG] | [CẦN BỔ SUNG] | Viết báo cáo, thuyết trình | [CẦN BỔ SUNG] |

---

## 1. Bối cảnh

**Ngành hàng.** Nook Ký kinh doanh Book Nook: mô hình thu nhỏ dạng hộp đặt vừa kệ sách, người mua tự lắp ráp (350 đến 430 mảnh, 6 đến 8 giờ lắp với các mẫu phổ biến) rồi giữ lại làm vật décor. Đây là nhánh nhỏ trong ngành quà tặng và đồ thủ công DIY (do it yourself, tự làm).

**Bảng 1. Danh mục sản phẩm**

| item_id (slug) | Tên sản phẩm | Địa danh | Khu vực | Giá bán (VND) |
| --- | --- | --- | --- | ---: |
| pho-vua-len-den-hoi-an | Phố Vừa Lên Đèn | Hội An | Miền Trung | 899.000 |
| mua-qua-san-gach-hue | Mưa Qua Sân Gạch | Huế | Miền Trung | 929.000 |
| sang-tren-pho-cu-ha-noi | Sáng Trên Phố Cũ | Hà Nội | Miền Bắc | 849.000 |
| hem-con-sang-den-sai-gon | Hẻm Còn Sáng Đèn | Sài Gòn | Miền Nam | 1.099.000 |
| den-am-tren-doc-da-lat | Đèn Ấm Trên Dốc | Đà Lạt | Miền Nam | 849.000 |
| song-vua-thuc-giac-mien-tay | Sông Vừa Thức Giấc | Miền Tây | Miền Nam | 749.000 |

*Nguồn: dữ liệu sản phẩm trên website (data/products.ts), đối chiếu 26/10/2026.*

**Lý do chọn.** [CẦN BỔ SUNG: lý do nhóm chọn ngành hàng]. Về mặt đồ án, sản phẩm có giá trị đơn cao (AOV, average order value, giá trị đơn trung bình, đạt 975.442đ trong kỳ đo) và quyết định mua cần nhiều hình ảnh, thông tin lắp ráp, nên phù hợp để quan sát hành vi duyệt trang trước khi mua.

**Định vị website.** Mô hình bán hàng trực tiếp (D2C, direct to consumer) với thông điệp "Bản sắc Việt thu nhỏ": mỗi sản phẩm gắn với ký ức một nơi chốn Việt Nam thay vì chỉ là bộ kit lắp ráp. Cấu trúc: trang chủ dạng kể chuyện (video Hội An, mẫu nổi bật, quy trình chế tác, form liên hệ), /shop, /collections, 6 trang chi tiết sản phẩm (PDP, product detail page), giỏ hàng, checkout với 4 phương thức (COD, chuyển khoản, MoMo, ZaloPay), /studio ("Tự ráp Nook", đang hoàn thiện), /about và chatbot tư vấn. USP chính thức: [CẦN BỔ SUNG].

**Nền tảng.** Website được xây dựng ban đầu trên WordPress/WooCommerce (bản V3.2), sau đó chuyển sang Next.js triển khai trên Vercel để làm việc theo nhánh và xem trước từng thay đổi trước khi đưa lên bản chính. Kỳ đo 01 đến 25/10/2026 chạy trên bản Next.js. [CẦN BỔ SUNG: ngày chuyển đổi chính thức]

**Khách hàng mục tiêu (persona tóm tắt).**

| Thuộc tính | Mô tả |
| --- | --- |
| Ai | [CẦN BỔ SUNG: độ tuổi, nghề nghiệp, khu vực]. Giả định của nhóm: người trẻ 20 đến 30 tuổi tại thành phố lớn, thích đồ décor có câu chuyện, mua cho bản thân hoặc làm quà |
| Cần gì | Món quà hoặc vật trang trí mang dấu ấn Việt, có trải nghiệm tự tay làm; cần xem kỹ hình ảnh, độ khó, thời gian lắp, chi phí giao hàng trước khi chi khoảng 750.000đ đến 1.100.000đ |
| Thiết bị | Mobile là chính: 65,8% sessions (Bảng 5) |
| Kênh tìm đến | Tìm kiếm Google, mạng xã hội (Facebook, Instagram, TikTok) và truy cập trực tiếp (Bảng 3) |

---

## 2. Dữ liệu & phương pháp

### 2.1 Công cụ

**Bảng 2. Công cụ thu thập dữ liệu**

| Công cụ | Dùng để đo gì |
| --- | --- |
| Google Analytics 4 (GA4), property của nookky.shop | Sessions, users, engagement, kênh nguồn, thiết bị, landing page, lượt xem trang, 24 nhóm sự kiện gồm sự kiện thương mại điện tử (view_item_list, select_item, view_item, add_to_cart, view_cart, begin_checkout, purchase) và sự kiện tương tác (hero_primary_click, chat_open...) |
| Order log (Google Sheet do backend ghi) | Số đơn theo order_id duy nhất, giá trị đơn, trạng thái thu tiền |
| Rà soát giao diện và mã nguồn website | Đối chiếu số liệu với thành phần giao diện thực tế và cách gắn tracking |

*Nguồn: nhóm tổng hợp. Nhóm chỉ dùng GA4 làm công cụ đo hành vi; không dùng heatmap hay công cụ đo tốc độ.*

### 2.2 Thời gian thu thập

| Giai đoạn | Kỳ đo | Mục đích |
| --- | --- | --- |
| 1. Baseline (trước thay đổi) | 01/10 đến 25/10/2026 (25 ngày) | Số liệu cho Phần 3 |
| 2. Triển khai 3 thay đổi | [CẦN BỔ SUNG: ngày] | Phần 4 |
| 3. Đo lại (sau thay đổi) | [CẦN BỔ SUNG: tối thiểu 14 ngày] | Phần 5 |

*Múi giờ Asia/Ho_Chi_Minh, đơn vị tiền VND.*

### 2.3 Cách thức thu thập và cỡ mẫu

Toàn bộ là traffic thật đến nookky.shop, gồm traffic tự nhiên (tìm kiếm, mạng xã hội, truy cập trực tiếp, giới thiệu, email) và traffic quảng cáo trả phí trên Facebook, TikTok (Paid Social). Cỡ mẫu: 3.284 sessions, 2.086 users, 52 đơn đặt hàng. Số liệu chỉ tính trên website, không gồm lượt hiển thị hay tương tác diễn ra trong ứng dụng mạng xã hội. Đơn hàng được đếm theo order_id duy nhất trong order log, không theo sự kiện purchase của GA4 (lý do ở mục 2.4). [CẦN BỔ SUNG: có lọc traffic nội bộ của nhóm không; chi phí quảng cáo Paid Social nếu có]

### 2.4 Kiểm soát chất lượng dữ liệu

Các tổng chính đã được đối chiếu chéo và khớp: sessions theo kênh, theo tuần, theo thiết bị đều bằng 3.284; tổng đơn theo kênh và theo trạng thái đều bằng 52; giá trị đơn 51.293.000 - 1.650.000 + 1.080.000 = 50.723.000đ. Bên cạnh đó, nhóm ghi nhận 5 điểm cần thận trọng:

**Bảng 3. Vấn đề chất lượng dữ liệu**

| # | Vấn đề | Bằng chứng | Cách xử lý trong báo cáo |
| --- | --- | --- | --- |
| 1 | purchase cao hơn số đơn thật | 57 sự kiện purchase so với 52 order_id (lệch 5, tức 9,6%). Code gửi purchase ngay khi gửi yêu cầu ghi đơn, không chờ server xác nhận | Dùng order_id làm số đơn |
| 2 | Dữ liệu cá nhân (PII) trong sự kiện GA4 | Payload purchase chứa email, số điện thoại, họ tên và được đẩy nguyên vào gtag | Ghi nhận là rủi ro tuân thủ chính sách GA4; đề xuất sửa (mục 5.3) |
| 3 | "Đã thanh toán" do khách tự báo | 36 payment_reported so với 35 đơn đã xác nhận thu tiền | Dùng trạng thái thu tiền đã đối soát |
| 4 | Lượt xem /studio thấp hơn số click vào nút dẫn đến /studio | hero_secondary_click 289 lượt nhưng /studio chỉ có 116 lượt xem | Chưa rõ nguyên nhân (đo page_view hay đo click); không dùng tỉ lệ click sang Studio |
| 5 | Có traffic đến /blog dù website hiện không có trang /blog | /blog: 32 landing sessions, 149 lượt xem | [CẦN BỔ SUNG: xác nhận nguồn, có thể là URL cũ từ bản WordPress]; loại khỏi phân tích luồng |

*Nguồn: GA4, order log, rà soát mã nguồn ngày 26/10/2026.*

---

## 3. Phát hiện chính

### 3.1 Traffic

**Bảng 4. Traffic và kết quả theo kênh (GA4 + order log, 01 đến 25/10/2026)**

| Kênh | Sessions | Tỉ trọng | Engagement rate | Đơn đặt | Tỉ lệ đặt đơn/session | Đã thu (VND) |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| Direct (truy cập trực tiếp) | 972 | 29,6% | 57,1% | 12 | 1,23% | 8.050.000 |
| Organic Search (tìm kiếm tự nhiên) | 820 | 25,0% | 71,8% | 19 | 2,32% | 12.680.000 |
| Organic Social (mạng xã hội tự nhiên) | 650 | 19,8% | 54,6% | 7 | 1,08% | 3.399.000 |
| Paid Social (quảng cáo mạng xã hội) | 483 | 14,7% | 52,0% | 8 | 1,66% | 4.749.000 |
| Referral (giới thiệu) | 205 | 6,2% | 62,4% | 3 | 1,46% | 2.845.000 |
| Email | 96 | 2,9% | 81,2% | 3 | 3,13% | 1.690.000 |
| Unassigned | 58 | 1,8% | 48,3% | 0 | 0% | 0 |
| **Tổng** | **3.284** | **100%** | **60,4%** | **52** | **1,58%** | **33.413.000** |

*Nguồn: GA4 Traffic acquisition; đơn và doanh thu từ order log. Engagement rate (ER, tỷ lệ phiên có tương tác) = engaged sessions / sessions. Tỉ lệ đặt đơn/session = đơn đặt / sessions.*

**Bảng 5. Traffic theo thiết bị**

| Thiết bị | Sessions | Tỉ trọng | ER | Đơn đặt | Tỉ lệ đặt đơn/session | Tỉ lệ thu tiền/đơn |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| Mobile | 2.161 | 65,8% | 55,8% | 31 | 1,43% | 58,1% (18/31) |
| Desktop | 1.098 | 33,4% | 69,8% | 20 | 1,82% | 80,0% (16/20) |
| Tablet | 25 | 0,8% | 52,0% | 1 | 4,00% | 100% (1/1) |

**Bảng 6. Xu hướng theo tuần**

| Kỳ | Sessions | Sessions/ngày | ER | Đơn đặt | Đơn/ngày |
| --- | ---: | ---: | ---: | ---: | ---: |
| 01 đến 07/10 | 709 | 101,3 | 58,7% | 9 | 1,29 |
| 08 đến 14/10 | 867 | 123,9 | 59,1% | 13 | 1,86 |
| 15 đến 21/10 | 1.035 | 147,9 | 62,8% | 19 | 2,71 |
| 22 đến 25/10 (4 ngày) | 673 | 168,3 | 60,3% | 11 | 2,75 |

*Sessions/ngày = sessions / số ngày của kỳ; kỳ cuối chỉ có 4 ngày nên so theo trung bình ngày. Gợi ý Hình 1: cột sessions/ngày theo tuần, đường ER trên trục phụ.*

**Nhận xét.**
- Traffic tăng đều: sessions trung bình ngày từ 101,3 lên 168,3 (+66%), đơn trung bình ngày từ 1,29 lên 2,75.
- Organic Search là kênh chất lượng nhất: 25,0% sessions nhưng 36,5% số đơn (19/52); ER 71,8% (khoảng tin cậy 95%: 68,7% đến 74,8%) cao hơn Direct 57,1% (54,0% đến 60,2%), khác biệt có ý nghĩa thống kê (kiểm định hai tỉ lệ, z = 6,47, p < 0,001). Tỉ lệ đặt đơn của Search (2,32%) gần gấp đôi Direct (1,23%), nhưng với 19 và 12 đơn thì khác biệt này chưa có ý nghĩa thống kê (p = 0,08).
- Mạng xã hội (Organic + Paid) mang về 1.133 sessions (34,5%) nhưng chỉ 15 đơn (tỉ lệ 1,32%) và có ER thấp nhất trong các kênh lớn (52,0% đến 54,6%). Chưa có chi phí quảng cáo nên chưa tính được ROAS (return on ad spend, doanh thu trên chi phí quảng cáo) cho Paid Social.
- Mobile chiếm 65,8% sessions nhưng ER thấp hơn desktop 14 điểm phần trăm (55,8% so với 69,8%, p < 0,001). Tỉ lệ đặt đơn trên mobile thấp hơn (1,43% so với 1,82%) nhưng chênh lệch này chưa có ý nghĩa thống kê (p = 0,40).

**Kết luận:** Traffic tăng đều và phần lớn đến từ mobile, nhưng Organic Search mới là kênh mang lại khách chất lượng nhất (ER 71,8%, 36,5% số đơn), còn mobile tương tác kém hơn desktop rõ rệt (55,8% so với 69,8%).

### 3.2 Phiên truy cập (Sessions)

**Bảng 7. Chỉ số phiên truy cập (01 đến 25/10/2026)**

| Chỉ số | Giá trị | Ghi chú |
| --- | ---: | --- |
| Sessions | 3.284 | |
| Total users / New users / Returning users | 2.086 / 1.762 / 324 | Returning chiếm 15,5% users (324/2.086) |
| Sessions/user | 1,57 | 3.284 / 2.086 |
| Engaged sessions / Engagement rate | 1.984 / 60,4% | 1.984 / 3.284 |
| Page views / Views per session | 9.320 / 2,84 | 9.320 / 3.284 |
| Thời gian tương tác trung bình | 1 phút 42 giây/session | |
| Events / session | 9,12 | 29.945 / 3.284 |

*Nguồn: GA4.*

**Bảng 8. Tương tác trong phiên (event count)**

| Nhóm hành vi | Sự kiện | Lượt |
| --- | --- | ---: |
| Xem ảnh sản phẩm | spotlight_gallery_change / spotlight_zoom_open | 542 / 163 |
| Khám phá danh mục | place_select / shop_filter_click / featured_product_click | 362 / 268 / 199 |
| Tư vấn | chat_open / chat_message_sent | 144 / 237 |
| Đăng ký, liên hệ | newsletter_subscribe | 31 |

**Nhận xét.**
- Một phiên trung bình xem 2,84 trang và tương tác 1 phút 42 giây. Với sản phẩm cần cân nhắc ở mức giá khoảng 900.000đ, đây là mức đủ để xem 1 đến 2 sản phẩm nhưng chưa đủ để so sánh nhiều mẫu.
- Người dùng mới chiếm 84,5% (1.762/2.086). Website đang thu hút người mới tốt nhưng tỉ lệ quay lại thấp (15,5%), trong khi sản phẩm giá cao thường cần nhiều lần ghé trước khi mua.
- Nhu cầu thông tin trước khi mua thể hiện rõ: 542 lượt đổi ảnh trong gallery, 163 lượt phóng to ảnh và 237 tin nhắn gửi chatbot. Đây là tín hiệu (chưa phải kết luận) cho thấy người dùng tìm thêm thông tin mà trang sản phẩm chưa trả lời ngay.

**Kết luận:** Phiên truy cập có tương tác ở mức khá (ER 60,4%, 2,84 trang/phiên) nhưng chủ yếu là khách mới (84,5%), và người dùng chủ động tìm thêm thông tin sản phẩm qua ảnh và chatbot.

### 3.3 Luồng di chuyển (User flow)

**Bảng 9. Landing page và lượt xem theo trang**

| Trang | Landing sessions | Tỉ trọng landing | Page views |
| --- | ---: | ---: | ---: |
| / (trang chủ) | 1.390 | 42,3% | 2.605 |
| /shop | 671 | 20,4% | 1.770 |
| /collections | 245 | 7,5% | 901 |
| 6 trang /product/[slug] | 710 | 21,6% | 2.794 |
| /about | 108 | 3,3% | 180 |
| /studio | 71 | 2,2% | 116 |
| /cart | 21 | 0,6% | 401 |
| /checkout (gồm /payment, /success) | 9 | 0,3% | 221 / 73 / 54 |
| /blog và URL khác | 59 | 1,8% | 205 |
| **Tổng** | **3.284** | **100%** | **9.320** |

**Bảng 10. Sự kiện điều hướng từ trang chủ**

| Sự kiện | Lượt | So với page views trang chủ |
| --- | ---: | ---: |
| hero_primary_click (nút "Khám phá bộ sưu tập →") | 574 | 22,0% |
| hero_secondary_click (nút "Tự ráp Nook (Studio)") | 289 | 11,1% |
| featured_product_click | 199 | 7,6% |

*Nguồn: GA4. Tỉ lệ = lượt sự kiện / 2.605 page views trang chủ; là tỉ lệ theo lượt, không theo người dùng.*

**Đối chiếu giao diện (rà soát mã nguồn).** Nút CTA (call to action, lời kêu gọi hành động) chính của Hero trỏ đến neo #shop-all, nhưng trang chủ không có khối nào mang định danh này. Khi bấm, sự kiện hero_primary_click vẫn được ghi nhận nhưng trang không cuộn và không chuyển trang.

**Nhận xét.**
- Trang chủ là cửa vào chính: 42,3% sessions bắt đầu tại đây. Cửa vào lớn thứ hai là các trang mua sắm (/shop 20,4% và PDP 21,6%), chủ yếu từ tìm kiếm và link quảng cáo.
- CTA chính là nút được bấm nhiều nhất trang chủ (574 lượt, gấp 2 nút phụ). Nhưng vì nút trỏ đến neo không tồn tại, cả 574 lượt bấm đều không đưa người dùng đến danh mục. Người dùng phải tự tìm menu "Sản phẩm" hoặc cuộn đến khối mẫu nổi bật. Đây là chỗ đứt gãy lớn nhất trong luồng Trang chủ → Danh mục.
- Luồng mua sắm chính là /shop → PDP: 1.770 lượt xem /shop và 2.794 lượt xem PDP. Mẫu Hội An dẫn đầu (845 lượt xem PDP, 14 sản phẩm được đặt); mẫu Miền Tây thấp nhất (198 lượt xem, 6 sản phẩm).
- /studio chỉ chiếm 1,2% lượt xem (116/9.320). Trang đang thông báo "đang hoàn thiện" và không có liên kết đi tiếp, nhưng với quy mô này tác động lên toàn website nhỏ.

**Kết luận:** Luồng di chuyển tập trung qua trang chủ (42,3% landing), nhưng nút được bấm nhiều nhất ở đó (574 lượt) không dẫn đến đâu, làm đứt lối đi chính từ trang chủ sang danh mục sản phẩm.

### 3.4 Điểm nghẽn (Bottlenecks)

**Bảng 11. Phễu mua hàng (01 đến 25/10/2026)**

| Bước | Số lượng | Tỉ lệ đi tiếp so với bước trước | Tỉ lệ rớt = 1 - bước sau / bước trước | So với tổng sessions |
| --- | ---: | ---: | ---: | ---: |
| 1. Truy cập (sessions) | 3.284 | | | 100% |
| 2. Xem danh mục (view_item_list) | 1.976 | 60,2% | 39,8% | 60,2% |
| 3. Xem chi tiết (view_item) | 1.461 | 73,9% | 26,1% | 44,5% |
| 4. Thêm giỏ (add_to_cart) | 267 | **18,3%** | **81,7%** | 8,1% |
| 5. Xem giỏ (view_cart) | 239 | 89,5% | 10,5% | 7,3% |
| 6. Bắt đầu checkout (begin_checkout) | 148 | 61,9% | 38,1% | 4,5% |
| 7. Đặt đơn thành công (order_id) | 52 | **35,1%** | **64,9%** | 1,6% |
| 8. Đã xác nhận thu tiền (đơn) | 35 | 67,3% | 32,7% | 1,1% |

*Nguồn: GA4 (bước 1 đến 6, số sessions có ít nhất 1 lần phát sinh sự kiện) và order log (bước 7, 8, số đơn). Gợi ý Hình 3: biểu đồ phễu ngang.*

**Bảng 12. Tỉ lệ thêm giỏ theo sản phẩm (event count)**

| Sản phẩm | view_item | add_to_cart | add_to_cart / view_item | Sản phẩm đặt |
| --- | ---: | ---: | ---: | ---: |
| Phố Vừa Lên Đèn (Hội An) | 845 | 112 | 13,3% | 14 |
| Sáng Trên Phố Cũ (Hà Nội) | 623 | 76 | 12,2% | 11 |
| Mưa Qua Sân Gạch (Huế) | 485 | 57 | 11,8% | 10 |
| Hẻm Còn Sáng Đèn (Sài Gòn) | 337 | 38 | 11,3% | 8 |
| Đèn Ấm Trên Dốc (Đà Lạt) | 306 | 30 | 9,8% | 8 |
| Sông Vừa Thức Giấc (Miền Tây) | 198 | 15 | 7,6% | 6 |
| **Tổng** | **2.794** | **328** | **11,7%** | **57** |

*Nguồn: GA4. Tỉ lệ tính theo lượt sự kiện, khác tỉ lệ theo session ở Bảng 11.*

**Đối chiếu giao diện (rà soát mã nguồn).**
- Khu vực mua ngay cạnh nút "Thêm vào giỏ" ở PDP hiển thị độ khó, thời gian lắp, số mảnh, LED, giá và dòng "Miễn phí vận chuyển cho đơn từ 1.000.000₫". Khu vực này chưa có thời gian giao hàng, phương thức thanh toán (có COD) hay chính sách đổi trả. Trong 6 mẫu, chỉ mẫu Sài Gòn (1.099.000đ) đạt ngưỡng miễn phí giao hàng khi mua 1 hộp.
- Trên mobile, nút "Thêm vào giỏ" nằm trong khu vực mua ở đầu trang. Khi người dùng cuộn xuống các phần câu chuyện, chi tiết, lắp ráp, nút này không còn trong tầm nhìn.
- Form checkout hiển thị cùng lúc 7 trường (họ tên, số điện thoại, email, tỉnh/thành, quận/huyện, địa chỉ, ghi chú), trong đó chỉ 4 trường bắt buộc.

**Nhận xét.**
- Điểm nghẽn lớn nhất là bước xem chi tiết sang thêm giỏ: 1.461 sessions xem sản phẩm nhưng chỉ 267 sessions thêm giỏ (18,3%, khoảng tin cậy 95%: 16,4% đến 20,3%), tức 81,7% phiên rời đi sau khi xem sản phẩm. Kết hợp với lượng xem ảnh (542 lượt đổi ảnh) và 237 tin nhắn chatbot, giả thuyết của nhóm là khu vực mua chưa trả lời đủ các câu hỏi chốt đơn (giao bao lâu, có COD không, đổi trả thế nào). Giả thuyết này cần kiểm chứng sau thay đổi.
- Điểm nghẽn thứ hai là checkout: 148 sessions bắt đầu nhưng chỉ 52 đơn (35,1%, khoảng tin cậy 95%: 27,9% đến 43,1%), rớt 64,9%. Vì 65,8% traffic là mobile, form hiển thị 7 trường cùng lúc là một ứng viên nguyên nhân (giả thuyết).
- Sau khi đặt, 67,3% đơn đã thu tiền; 12 đơn (23,1%) đang chờ xác nhận hoặc giao COD; 5 đơn (9,6%) hủy. Tỉ lệ thu tiền trên mobile (58,1%) thấp hơn desktop (80,0%) nhưng chưa có ý nghĩa thống kê (p = 0,10).
- Các bước xem danh mục sang xem chi tiết (73,9%) và giỏ hàng sang checkout (61,9%) hoạt động tương đối tốt.

**Kết luận:** Điểm nghẽn lớn nhất của phễu là bước từ trang sản phẩm sang thêm giỏ (rớt 81,7%), tiếp theo là bước từ bắt đầu checkout sang đặt đơn thành công (rớt 64,9%).

### 3.5 Liên kết 4 mảng: nguyên nhân gốc

Bốn mảng cùng chỉ về một vấn đề: website kéo được người xem nhưng làm rơi họ ở các điểm chuyển sang hành động. Traffic tăng đều (+66% sessions/ngày) và 65,8% đến từ mobile, nơi ER thấp hơn desktop 14 điểm phần trăm. Phiên chủ yếu là khách mới (84,5%) với khoảng 2,84 trang, nên mỗi lần ghé cần dẫn khách đến sản phẩm nhanh và trả lời đủ câu hỏi ngay tại chỗ. Thực tế có ba chỗ đứt gãy: (1) ở trang chủ, nút được bấm nhiều nhất (574 lượt) không dẫn đến danh mục; (2) ở PDP, khu vực mua thiếu thông tin giao hàng, thanh toán, đổi trả, và nút thêm giỏ ra khỏi tầm nhìn khi cuộn trên mobile, trùng với điểm rớt 81,7%; (3) ở checkout, 7 trường hiển thị cùng lúc trên màn hình nhỏ, trùng với điểm rớt 64,9%. Organic Search có kết quả tốt nhất có thể vì người tìm kiếm đã có ý định mua rõ ràng nên ít bị ảnh hưởng bởi các chỗ đứt gãy này (giả thuyết).

---

## 4. Đề xuất & thay đổi đã thực hiện

Ba thay đổi nhắm vào ba bước khác nhau của luồng, nên có thể đo tác động riêng từng thay đổi. Thứ tự theo ma trận tác động/công sức.

**Bảng 13. Thứ tự ưu tiên**

| # | Thay đổi | Trang | Bước nhắm tới | Tác động | Công sức | Trạng thái |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | Sửa CTA chính ở Hero | Trang chủ | Trang chủ → danh mục | Cao | Thấp | [CẦN BỔ SUNG: ngày triển khai] |
| 2 | Bổ sung thông tin chốt đơn và thanh "Thêm vào giỏ" cố định trên mobile | 6 PDP | Xem chi tiết → thêm giỏ | Cao | Trung bình | [CẦN BỔ SUNG: ngày triển khai] |
| 3 | Thu gọn form checkout còn 4 trường bắt buộc | /checkout | Bắt đầu checkout → đặt đơn | Trung bình | Trung bình | [CẦN BỔ SUNG: ngày triển khai] |

### 4.1 Thay đổi 1: Sửa nút CTA chính ở Hero trang chủ

- **Vấn đề:** Trang chủ là cửa vào của 42,3% sessions (1.390) và có 2.605 lượt xem (mục 3.3). Nút "Khám phá bộ sưu tập →" được bấm 574 lượt (22,0% lượt xem trang chủ), nhiều nhất trang, nhưng trỏ đến neo #shop-all không tồn tại nên không dẫn người dùng đến danh mục.
- **Thay đổi:** Khối Hero trang chủ: đổi đích nút chính từ #shop-all sang trang /shop; giữ sự kiện hero_primary_click và thêm tham số đích đến để đo. [CẦN BỔ SUNG: xác nhận nội dung đã làm]
- **Ảnh Trước-Sau:** [Hình 4: Trước | Sau. Chụp Hero trang chủ nookky.shop trên mobile 390px và desktop 1440px; ảnh Trước kèm thanh địa chỉ sau khi bấm nút (URL chỉ thành /#shop-all, trang đứng yên); ảnh Sau là trang /shop mở ra sau khi bấm.]
  *Hình 4. Nút CTA chính trước và sau khi sửa đích liên kết.*
- **Lý do dữ liệu:** Đây là nút có nhu cầu bấm cao nhất trên trang có lượng vào lớn nhất; mỗi lượt bấm hiện là một lượt mất. Công sửa gần như bằng 0 và rủi ro thấp. Chỉ số kỳ vọng cải thiện: tỉ lệ session landing trang chủ có view_item_list; số lượt xem /shop có trang trước là trang chủ.

### 4.2 Thay đổi 2: Bổ sung thông tin chốt đơn và thanh "Thêm vào giỏ" cố định trên mobile ở PDP

- **Vấn đề:** Bước xem chi tiết sang thêm giỏ có tỉ lệ rớt cao nhất phễu: 81,7% (chỉ 267/1.461 sessions thêm giỏ, mục 3.4). Từng sản phẩm chỉ đạt 7,6% đến 13,3% lượt thêm giỏ/lượt xem. Mobile chiếm 65,8% sessions với ER 55,8%, thấp hơn desktop 69,8% (mục 3.1). Người dùng tìm thêm thông tin qua 542 lượt đổi ảnh và 237 tin nhắn chatbot (mục 3.2). Khu vực mua hiện chưa có thời gian giao, phương thức thanh toán và đổi trả.
- **Thay đổi:** Trên 6 trang /product/[slug]: (1) thêm khối 3 dòng ngay dưới nút "Thêm vào giỏ": thời gian giao dự kiến, "Thanh toán khi nhận hàng (COD), chuyển khoản, MoMo, ZaloPay", chính sách đổi trả hoặc hỗ trợ thiếu mảnh [CẦN BỔ SUNG: chính sách thực tế của shop]; (2) trên màn hình mobile, thêm thanh cố định ở đáy hiển thị tên, giá và nút "Thêm vào giỏ" khi khu vực mua đã cuộn khỏi màn hình. [CẦN BỔ SUNG: xác nhận nội dung đã làm]
- **Ảnh Trước-Sau:** [Hình 5: Trước | Sau. Chụp PDP Phố Vừa Lên Đèn (/product/pho-vua-len-den-hoi-an) trên mobile 390px: (a) khu vực mua trước và sau khi thêm khối thông tin; (b) màn hình sau khi cuộn xuống phần "Lắp ráp", ảnh Trước không có nút mua, ảnh Sau có thanh cố định.]
  *Hình 5. Khu vực mua và thanh thêm giỏ cố định trên mobile trước và sau thay đổi.*
- **Lý do dữ liệu:** Thay đổi nhắm thẳng vào bước rớt lớn nhất (81,7%) và vào thiết bị chiếm 2/3 traffic. Chọn mẫu Hội An để chụp vì có lượng xem lớn nhất (845). Chỉ số kỳ vọng cải thiện: tỉ lệ sessions add_to_cart / sessions view_item (hiện 18,3%), so riêng theo mobile và desktop.

### 4.3 Thay đổi 3: Thu gọn form checkout còn 4 trường bắt buộc

- **Vấn đề:** 148 sessions bắt đầu checkout nhưng chỉ 52 đơn được đặt thành công (35,1%, rớt 64,9%, mục 3.4). Form hiển thị cùng lúc 7 trường trong khi chỉ 4 trường bắt buộc (họ tên, số điện thoại, tỉnh/thành, địa chỉ), và 65,8% traffic là mobile.
- **Thay đổi:** Trên /checkout: giữ hiển thị 4 trường bắt buộc; gom email, quận/huyện và ghi chú vào một mục thu gọn "Thêm thông tin (không bắt buộc)"; đưa tóm tắt tổng tiền và phí giao hàng lên ngay trên nút đặt hàng trên mobile. [CẦN BỔ SUNG: xác nhận nội dung đã làm]
- **Ảnh Trước-Sau:** [Hình 6: Trước | Sau. Chụp toàn trang /checkout trên mobile 390px với 1 sản phẩm trong giỏ; ảnh Trước có 7 trường; ảnh Sau có 4 trường và mục thu gọn.]
  *Hình 6. Form checkout trước và sau khi thu gọn.*
- **Lý do dữ liệu:** Đây là bước rớt lớn thứ hai và là bước cuối trước khi có doanh thu. Giảm số trường hiển thị giảm công sức nhập trên màn hình nhỏ mà không mất dữ liệu bắt buộc để giao hàng. Chỉ số kỳ vọng cải thiện: đơn đặt (order_id) / sessions begin_checkout (hiện 35,1%).

---

## 5. Kết quả kỳ vọng & hạn chế

### 5.1 Tác động dự kiến

Tại thời điểm viết, nhóm chưa có số liệu sau thay đổi. Toàn bộ tác động dưới đây là **dự kiến**, kèm cách đo lại.

**Bảng 14. Tác động dự kiến và kế hoạch đo lại**

| Thay đổi | Chỉ số chính | Trước (01 đến 25/10) | Sau | Cách đo lại |
| --- | --- | --- | --- | --- |
| 1. CTA Hero | Sessions landing trang chủ có view_item_list / sessions landing trang chủ | [CẦN BỔ SUNG: lấy từ GA4 Exploration] | Chưa có | GA4 Exploration lọc landing page = /, tối thiểu 14 ngày sau triển khai |
| 2. PDP | Sessions add_to_cart / sessions view_item | 18,3% (267/1.461); theo thiết bị: [CẦN BỔ SUNG] | Chưa có | GA4 Funnel exploration, tách mobile/desktop |
| 3. Checkout | Đơn đặt / sessions begin_checkout | 35,1% (52/148) | Chưa có | GA4 begin_checkout + order log theo order_id |

Để có ý nghĩa thống kê, cỡ mẫu cần đủ lớn. Với tốc độ hiện tại khoảng 58 sessions/ngày có view_item (1.461/25), 14 ngày sẽ cho khoảng 800 sessions; mức này đủ phát hiện tỉ lệ thêm giỏ tăng từ 18,3% lên khoảng 23% (hiệu ứng tuyệt đối khoảng 5 điểm phần trăm) với độ tin cậy 95% và power (xác suất phát hiện) 80%, nhưng chưa đủ phát hiện thay đổi nhỏ hơn. Bước checkout chỉ có khoảng 6 sessions/ngày nên 14 ngày chỉ đủ quan sát xu hướng, chưa đủ kết luận. Nguyên tắc so sánh: cùng độ dài kỳ, ghi lại thay đổi ngân sách quảng cáo và khuyến mãi trong kỳ để không gán nhầm hiệu quả.

### 5.2 Hạn chế của đồ án

1. **Thời gian ngắn và chưa đo lại:** baseline 25 ngày; chưa có dữ liệu sau thay đổi. Các bước cuối phễu có cỡ mẫu nhỏ (148 sessions checkout, 52 đơn), nhiều chênh lệch giữa kênh và thiết bị chưa có ý nghĩa thống kê.
2. **Sai lệch đo lường:** purchase cao hơn số đơn 9,6%; số click vào nút dẫn đến Studio (289) không khớp lượt xem /studio (116); có traffic đến /blog dù website không có trang này (mục 2.4).
3. **Chưa lọc traffic nội bộ** [CẦN BỔ SUNG: xác nhận]: lượt kiểm thử của nhóm có thể làm méo Direct và ER desktop.
4. **Chỉ dùng GA4:** không có heatmap, scroll map hay quan sát người dùng; nguyên nhân rớt phễu là giả thuyết suy từ số liệu kết hợp rà soát giao diện.
5. **Yếu tố ngoại cảnh:** traffic tăng dần trong kỳ có thể do quảng cáo, mùa quà tặng 20/10 hoặc nội dung mạng xã hội; so sánh trước và sau không loại trừ được các yếu tố này.
6. **Kết luận ở mức tương quan:** chưa có thử nghiệm đối chứng.
7. **Thiếu chi phí quảng cáo:** chưa tính được ROAS hay CAC (customer acquisition cost, chi phí có một khách hàng) cho Paid Social.

### 5.3 Hướng phát triển tiếp theo

1. **Sửa đo lường:** chỉ gửi sự kiện đặt hàng sau khi server xác nhận lưu đơn; xóa email, số điện thoại, họ tên khỏi payload GA4; bật lọc traffic nội bộ; kiểm tra nguyên nhân lệch giữa click Studio và lượt xem /studio.
2. **A/B test khu vực mua ở PDP trên mobile:** nhánh A chỉ có khối thông tin chốt đơn, nhánh B có thêm thanh thêm giỏ cố định. Chỉ số chính: sessions add_to_cart / sessions view_item trên mobile; chạy đến khi mỗi nhánh đủ khoảng 1.000 sessions có view_item.
3. **Tối ưu Paid Social theo dữ liệu sản phẩm:** đưa link quảng cáo về thẳng PDP Hội An và Hà Nội (hai mẫu có lượt xem và tỉ lệ thêm giỏ cao nhất, 13,3% và 12,2%), sau đó so ER và tỉ lệ đặt đơn của Paid Social với mức hiện tại (52,0% và 1,66%). Song song, hoàn thiện /studio với lối đi tiếp sang /shop trước khi tăng traffic vào trang này.

---

## Phụ lục: Danh sách ảnh chụp màn hình cần chèn

| Hình | Nội dung | Trang/nguồn cần chụp |
| --- | --- | --- |
| Hình 1 | Sessions/ngày theo tuần và đường ER | Dựng từ Bảng 6 |
| Hình 2 | Sessions và tỉ lệ đặt đơn theo kênh | Dựng từ Bảng 4 |
| Hình 3 | Biểu đồ phễu mua hàng 8 bước | Dựng từ Bảng 11 hoặc GA4 Funnel exploration |
| Hình 4 | Nút CTA Hero trước và sau | nookky.shop trang chủ, mobile 390px và desktop 1440px |
| Hình 5 | Khu vực mua và thanh thêm giỏ cố định trên mobile | /product/pho-vua-len-den-hoi-an, mobile 390px |
| Hình 6 | Form checkout trước và sau | /checkout, mobile 390px |
| Hình 7 | GA4 Traffic acquisition | GA4 > Reports > Acquisition |
| Hình 8 | GA4 Pages and screens, Landing page | GA4 > Reports > Engagement |
| Hình 9 | GA4 Tech > Device category | GA4 > Reports > Tech |
| Hình 10 | GA4 Events | GA4 > Reports > Engagement > Events |
