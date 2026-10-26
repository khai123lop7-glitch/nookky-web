# BÁO CÁO CUỐI KỲ

**Phân tích hành vi người dùng và cải thiện giao diện website Nook Ký (nookky.shop)**

Nhóm: [CẦN BỔ SUNG: tên nhóm, lớp học phần, giảng viên hướng dẫn]

> **Trạng thái bản này: KHUNG BÁO CÁO.** Chưa có export GA4 của property gắn với nookky.shop. Mọi ô "CHƯA CÓ DỮ LIỆU" là dữ liệu còn thiếu, **không phải giá trị 0**. Không dùng số liệu của website photobooth (PhotoBuzz) cho Nook Ký. Các phát hiện ghi "rà soát mã nguồn" là kiểm tra code, chưa phải kết quả đo trên production.

**Bảng 0. Thành viên và vai trò**

| Thành viên | MSSV | Vai trò chính | Đầu việc cụ thể |
| --- | --- | --- | --- |
| [CẦN BỔ SUNG] | [CẦN BỔ SUNG] | Quản trị website | [CẦN BỔ SUNG] |
| [CẦN BỔ SUNG] | [CẦN BỔ SUNG] | Phân tích dữ liệu | [CẦN BỔ SUNG] |
| [CẦN BỔ SUNG] | [CẦN BỔ SUNG] | Thiết kế giao diện | [CẦN BỔ SUNG] |
| [CẦN BỔ SUNG] | [CẦN BỔ SUNG] | Viết báo cáo, thuyết trình | [CẦN BỔ SUNG] |

---

## 1. Bối cảnh

**Ngành hàng.** Nook Ký kinh doanh Book Nook: mô hình thu nhỏ dạng hộp đặt vừa kệ sách, người mua tự lắp ráp rồi giữ lại làm vật décor. Đây là nhánh nhỏ trong ngành quà tặng và đồ thủ công DIY (do it yourself, tự làm).

**Bảng 1. Danh mục sản phẩm (metadata, không phải số GA4)**

| item_id (slug) | Tên sản phẩm | Địa danh | Giá hiện tại (VND) | Giá gốc (VND) |
| --- | --- | --- | ---: | ---: |
| pho-vua-len-den-hoi-an | Phố Vừa Lên Đèn | Hội An | 899.000 | 949.000 |
| mua-qua-san-gach-hue | Mưa Qua Sân Gạch | Huế | 929.000 | |
| sang-tren-pho-cu-ha-noi | Sáng Trên Phố Cũ | Hà Nội | 849.000 | 899.000 |
| hem-con-sang-den-sai-gon | Hẻm Còn Sáng Đèn | Sài Gòn | 1.099.000 | |
| den-am-tren-doc-da-lat | Đèn Ấm Trên Dốc | Đà Lạt | 849.000 | |
| song-vua-thuc-giac-mien-tay | Sông Vừa Thức Giấc | Miền Tây | 749.000 | 799.000 |

*Nguồn: data/products.ts của website, ngày đối chiếu 26/10/2026. Giá niêm yết, không phải doanh thu.*

**Lý do chọn.** [CẦN BỔ SUNG: lý do nhóm chọn ngành hàng này]. Về mặt đồ án, sản phẩm có giá trị đơn cao (749.000đ đến 1.099.000đ) và quyết định mua cần nhiều hình ảnh, câu chuyện, nên phù hợp để quan sát hành vi duyệt trang trước khi mua.

**Định vị website.** Mô hình bán hàng trực tiếp (D2C, direct to consumer) với thông điệp "Bản sắc Việt thu nhỏ": mỗi sản phẩm gắn với một ký ức nơi chốn thay vì chỉ là bộ kit lắp ráp. Cấu trúc trang: trang chủ dạng kể chuyện (video Hội An, mẫu nổi bật, quy trình chế tác, form liên hệ), /shop, /collections, trang chi tiết sản phẩm (PDP, product detail page) /product/[slug], /cart, /checkout, /checkout/payment, /studio ("Tự ráp Nook", đang hoàn thiện) và /about. Thanh toán hỗ trợ COD, chuyển khoản, MoMo, ZaloPay. USP chính thức: [CẦN BỔ SUNG].

**Nền tảng.** Website được xây dựng ban đầu trên WordPress/WooCommerce (bản V3.2), sau đó nhóm chuyển sang Next.js triển khai trên Vercel để làm việc theo nhánh và xem trước từng thay đổi. Ngày chuyển đổi và nền tảng trong kỳ đo: [CẦN BỔ SUNG].

**Khách hàng mục tiêu (persona tóm tắt).**

| Thuộc tính | Mô tả |
| --- | --- |
| Ai | [CẦN BỔ SUNG]. Giả định của nhóm: người trẻ đi làm hoặc sinh viên năm cuối tại thành phố lớn, thích đồ décor có câu chuyện và hoạt động thủ công |
| Cần gì | Một món quà hoặc vật trang trí mang dấu ấn Việt, có trải nghiệm tự tay làm; cần xem kỹ hình ảnh, kích thước, độ khó trước khi chi khoảng 750.000đ đến 1.100.000đ |
| Thiết bị | CHƯA CÓ DỮ LIỆU (sẽ lấy từ GA4 Tech > Device category, Bảng 5) |

*Ghi chú: các dòng "giả định" là suy luận từ định vị sản phẩm, chưa có khảo sát khách hàng.*

---

## 2. Dữ liệu & phương pháp

### 2.1 Công cụ

**Bảng 2. Công cụ thu thập dữ liệu**

| Công cụ | Dùng để đo gì |
| --- | --- |
| Google Analytics 4 (GA4), property gắn với nookky.shop | Sessions, users, engagement, kênh nguồn, thiết bị, lượt xem trang, landing page, sự kiện thương mại điện tử (view_item_list, select_item, view_item, add_to_cart, view_cart, begin_checkout) và sự kiện tương tác (hero_primary_click, newsletter_subscribe...) |
| GA4 DebugView, Realtime | Kiểm tra event có thực sự đến GA4 trước khi dùng số liệu phễu |
| Google Sheet order log (backend) | Đối soát đơn đặt (dòng order_placed) và khách tự báo đã thanh toán (dòng payment_reported_by_customer) |
| Rà soát giao diện và mã nguồn | Đối chiếu số liệu với thành phần giao diện thực tế và cách gắn tracking |

*Nguồn: nhóm tổng hợp. Nhóm chỉ dùng GA4 làm công cụ đo hành vi.*

### 2.2 Thời gian thu thập

| Giai đoạn | Kỳ đo | Mục đích |
| --- | --- | --- |
| 0. Chuẩn hóa đo lường | [CẦN BỔ SUNG: ngày] | Sửa các lỗi tracking P0 (mục 2.4), bật lọc traffic nội bộ, kiểm tra DebugView |
| 1. Baseline (trước thay đổi) | [CẦN BỔ SUNG: từ ngày ... đến ngày ..., tối thiểu 7 ngày] | Số liệu cho Phần 3 |
| 2. Triển khai 3 thay đổi | [CẦN BỔ SUNG: ngày] | Phần 4 |
| 3. Đo lại (sau thay đổi) | [CẦN BỔ SUNG: cùng độ dài với giai đoạn 1] | Số liệu cho Phần 5 |

*Múi giờ báo cáo: Asia/Ho_Chi_Minh. Ghi lại thời điểm xuất mỗi export vì GA4 có thể cập nhật số muộn.*

### 2.3 Cách thức thu thập và cỡ mẫu

Traffic tự nhiên và traffic từ kênh nhóm chủ động phân phối [CẦN BỔ SUNG: kênh nào, có gắn UTM không]. Cỡ mẫu: CHƯA CÓ DỮ LIỆU (sessions, users của giai đoạn 1). Nhóm tự kiểm thử website nên cần loại traffic nội bộ và các domain preview của Vercel trước khi phân tích.

### 2.4 Kiểm soát chất lượng dữ liệu (rà soát mã nguồn ngày 26/10/2026)

**Bảng 3. Vấn đề đo lường phát hiện trong code**

| Mức | Vấn đề | Căn cứ trong code | Tác động lên báo cáo | Xử lý |
| --- | --- | --- | --- | --- |
| P0 | Sự kiện purchase bắn trước khi xác nhận đơn | app/checkout/page.tsx: gọi fetch("/api/orders") không chờ kết quả, ngay sau đó track("purchase") | Purchase có thể cao hơn số đơn thật; không dùng purchase làm số đơn | Thêm order_placed sau khi server trả kết quả; đối chiếu order_id với order log |
| P0 | Gửi dữ liệu cá nhân (PII) vào GA4 | Payload purchase chứa email, phone, fullName; track() đẩy nguyên payload vào gtag | Vi phạm chính sách GA4 về PII | Xóa PII khỏi payload GA4 và dataLayer |
| P0 | "Đã thanh toán" do khách tự báo | app/checkout/payment/page.tsx đặt trạng thái paid khi khách bấm xác nhận | Không chứng minh đã nhận tiền | Tách payment_reported (tự khai) với payment_verified (đối soát ngân hàng/COD) |
| P1 | Có thể đếm trùng | track() gửi cả gtag trình duyệt và GA4 Measurement Protocol từ server cho event quan trọng | Event count có thể gấp đôi | Chọn 1 nguồn GA4 chính hoặc kiểm thử khử trùng lặp |
| P1 | Chưa xác nhận GA4 đang nhận dữ liệu | Measurement ID đọc từ biến môi trường Vercel, không có trong repo | Có thể chưa có dữ liệu nào | Kiểm tra env Vercel và GA4 Realtime |
| P2 | Traffic nội bộ | Nhóm QA nhiều lần trên site | Méo engagement rate, Direct, tỷ lệ chuyển đổi | Bật bộ lọc internal traffic |

*Nguồn: rà soát mã nguồn repo nookky-web nhánh main. Đây không phải kết quả kiểm thử GA4 production; mức độ ảnh hưởng thực tế cần xác nhận bằng DebugView.*

---

## 3. Phát hiện chính

### 3.1 Traffic

**Bảng 4. Traffic theo kênh (GA4 > Acquisition > Traffic acquisition, giai đoạn 1)**

| Kênh | Sessions | % tổng sessions | Engaged sessions | Engagement rate |
| --- | --- | --- | --- | --- |
| Direct | CHƯA CÓ DỮ LIỆU | | | |
| Organic Search | CHƯA CÓ DỮ LIỆU | | | |
| Organic Social | CHƯA CÓ DỮ LIỆU | | | |
| Paid Social / Paid Search | CHƯA CÓ DỮ LIỆU | | | |
| Referral | CHƯA CÓ DỮ LIỆU | | | |
| Unassigned / khác | CHƯA CÓ DỮ LIỆU | | | |
| **Tổng** | **CHƯA CÓ DỮ LIỆU** | 100% | | |

**Bảng 5. Traffic theo thiết bị (GA4 > Tech, giai đoạn 1)**

| Thiết bị | Sessions | Users | Engagement rate |
| --- | --- | --- | --- |
| Desktop | CHƯA CÓ DỮ LIỆU | | |
| Mobile | CHƯA CÓ DỮ LIỆU | | |
| Tablet | CHƯA CÓ DỮ LIỆU | | |

*Công thức: % tổng sessions = sessions kênh / tổng sessions; Engagement rate (ER, tỷ lệ phiên có tương tác) = engaged sessions / sessions. Gợi ý Hình 1: cột chồng sessions theo kênh theo tuần, đường ER trên trục phụ.*

**Nhận xét.** [CẦN BỔ SUNG sau khi có số liệu]. Các điểm cần đọc: kênh chiếm tỉ trọng lớn nhất; kênh có ER cao nhất; tỉ trọng mobile so với desktop; Direct có bị phình bởi traffic nội bộ hay không.

**Kết luận:** [CẦN BỔ SUNG: 1 câu, ví dụ dạng "Kênh X chiếm Y% sessions nhưng kênh Z có ER cao nhất (W%)"].

### 3.2 Phiên truy cập (Sessions)

**Bảng 6. Chỉ số phiên truy cập (giai đoạn 1)**

| Chỉ số | Giá trị | Cách lấy |
| --- | --- | --- |
| Sessions | CHƯA CÓ DỮ LIỆU | GA4 Traffic acquisition |
| Total users / New users / Returning users | CHƯA CÓ DỮ LIỆU | GA4 User acquisition |
| Engaged sessions, Engagement rate | CHƯA CÓ DỮ LIỆU | Engaged sessions / Sessions |
| Thời gian tương tác trung bình | CHƯA CÓ DỮ LIỆU | Giây/session; không so với giây/user |
| Views/session | CHƯA CÓ DỮ LIỆU | Views / Sessions |
| Tỉ lệ returning users | CHƯA CÓ DỮ LIỆU | Returning users / Total users |

**Nhận xét.** [CẦN BỔ SUNG]. Cần đọc: phiên có đủ dài để xem PDP không (sản phẩm giá cao cần thời gian cân nhắc); khách quay lại chiếm bao nhiêu; kênh nào giữ chân tốt nhất.

**Kết luận:** [CẦN BỔ SUNG: 1 câu].

### 3.3 Luồng di chuyển (User flow)

**Bảng 7. Lượt xem và landing page theo trang (GA4 > Engagement > Pages and screens, Landing page)**

| Trang | Vai trò | Views | Landing sessions |
| --- | --- | --- | --- |
| / | Trang chủ | CHƯA CÓ DỮ LIỆU | CHƯA CÓ DỮ LIỆU |
| /shop | Danh mục 6 mẫu | CHƯA CÓ DỮ LIỆU | CHƯA CÓ DỮ LIỆU |
| /collections | Chọn địa danh | CHƯA CÓ DỮ LIỆU | CHƯA CÓ DỮ LIỆU |
| /product/[slug] (gộp 6 PDP) | Chi tiết sản phẩm | CHƯA CÓ DỮ LIỆU | CHƯA CÓ DỮ LIỆU |
| /cart | Giỏ hàng | CHƯA CÓ DỮ LIỆU | CHƯA CÓ DỮ LIỆU |
| /checkout | Thông tin đặt hàng | CHƯA CÓ DỮ LIỆU | |
| /studio | Tự ráp Nook (đang hoàn thiện) | CHƯA CÓ DỮ LIỆU | CHƯA CÓ DỮ LIỆU |
| /about | Câu chuyện thương hiệu | CHƯA CÓ DỮ LIỆU | CHƯA CÓ DỮ LIỆU |

*Chỉ số dẫn xuất cần tính: Views /shop / Views trang chủ; Views /studio / Views trang chủ; Views PDP / Views /shop. Nếu có thể, dùng GA4 Path exploration bắt đầu từ / và từ /studio. Gợi ý Hình 2: sơ đồ luồng Trang chủ → /shop → PDP → /cart.*

**Đối chiếu giao diện (rà soát mã nguồn).**
- Trên trang chủ, nút CTA (call to action, lời kêu gọi hành động) chính của Hero "Khám phá bộ sưu tập →" trỏ đến neo #shop-all, nhưng trang chủ hiện không có khối nào mang định danh này (components/home/Hero.tsx). Bấm nút không cuộn và không chuyển trang.
- Trang /studio chỉ có tiêu đề, đoạn giới thiệu và trạng thái "Trải nghiệm tùy chỉnh đang được hoàn thiện", không có liên kết dẫn tiếp; trong khi menu chính và nút phụ của Hero đều dẫn vào đây.

**Nhận xét.** [CẦN BỔ SUNG]. Hai giả thuyết cần kiểm chứng bằng số liệu: (H1) tỉ lệ đi tiếp từ trang chủ sang /shop thấp so với lượng xem trang chủ; (H2) /studio có lượng xem đáng kể nhưng là điểm thoát.

**Kết luận:** [CẦN BỔ SUNG: 1 câu].

### 3.4 Điểm nghẽn (Bottlenecks)

**Bảng 8. Phễu thương mại điện tử (GA4 Funnel exploration, đơn vị: users hoặc sessions, chọn 1 và ghi rõ)**

| Bước | Sự kiện | Số thực tế | Tỉ lệ rớt so với bước trước |
| --- | --- | --- | --- |
| 1. Truy cập | session_start | CHƯA CÓ DỮ LIỆU | |
| 2. Xem danh mục | view_item_list | CHƯA CÓ DỮ LIỆU | 1 - bước 2 / bước 1 |
| 3. Chọn sản phẩm | select_item | CHƯA CÓ DỮ LIỆU | 1 - bước 3 / bước 2 |
| 4. Xem chi tiết | view_item | CHƯA CÓ DỮ LIỆU | 1 - bước 4 / bước 3 |
| 5. Thêm giỏ | add_to_cart | CHƯA CÓ DỮ LIỆU | 1 - bước 5 / bước 4 |
| 6. Xem giỏ | view_cart | CHƯA CÓ DỮ LIỆU | 1 - bước 6 / bước 5 |
| 7. Bắt đầu checkout | begin_checkout | CHƯA CÓ DỮ LIỆU | 1 - bước 7 / bước 6 |
| 8. Đặt đơn thành công | order_id duy nhất trong order log | CHƯA CÓ DỮ LIỆU | 1 - bước 8 / bước 7 |
| 9. Khách tự báo đã trả | payment_reported_by_customer | CHƯA CÓ DỮ LIỆU | Tự khai, chưa đối soát |

**Bảng 9. Micro-conversion trên trang chủ**

| Sự kiện | Số lượt (event count) | Users |
| --- | --- | --- |
| hero_primary_click | CHƯA CÓ DỮ LIỆU | CHƯA CÓ DỮ LIỆU |
| hero_secondary_click | CHƯA CÓ DỮ LIỆU | CHƯA CÓ DỮ LIỆU |
| form_start (form liên hệ) | CHƯA CÓ DỮ LIỆU | CHƯA CÓ DỮ LIỆU |
| newsletter_subscribe (gửi form liên hệ) | CHƯA CÓ DỮ LIỆU | CHƯA CÓ DỮ LIỆU |

*Không dùng purchase của GA4 làm số đơn (xem Bảng 3, P0). Gợi ý Hình 3: biểu đồ phễu ngang.*

**Đối chiếu giao diện (rà soát mã nguồn).** Form liên hệ cuối trang chủ có 4 trường (họ tên, email, mối quan tâm, lời nhắn); sự kiện newsletter_subscribe chưa được xác nhận là key event trong GA4.

**Nhận xét.** [CẦN BỔ SUNG]. Xác định bước có tỉ lệ rớt cao nhất và so với tỉ lệ form_start sang newsletter_subscribe.

**Kết luận:** [CẦN BỔ SUNG: 1 câu nêu bước nghẽn lớn nhất và tỉ lệ rớt].

### 3.5 Liên kết 4 mảng: nguyên nhân gốc

[CẦN BỔ SUNG sau khi có số liệu]. Giả thuyết làm việc của nhóm, cần số liệu để xác nhận hoặc bác bỏ: website có thể thu hút người xem bằng phần kể chuyện ở trang chủ nhưng chưa dẫn họ đến hành động, vì hai lối chính từ trang chủ đều có vấn đề (CTA chính không hoạt động, /studio là trang cụt). Nếu số liệu cho thấy views /shop thấp so với trang chủ và /studio có lượng xem cao, giả thuyết được củng cố; nếu không, nhóm điều chỉnh lại Phần 4.

---

## 4. Đề xuất & thay đổi đã thực hiện

Các thay đổi sắp theo ma trận tác động/công sức. Mỗi "Vấn đề" gồm bằng chứng giao diện (đã có) và bằng chứng số liệu (điền từ Phần 3). Thay đổi chỉ được giữ trong báo cáo nếu số liệu giai đoạn 1 ủng hộ.

**Bảng 10. Thứ tự ưu tiên**

| # | Thay đổi | Trang | Tác động | Công sức | Trạng thái |
| --- | --- | --- | --- | --- | --- |
| 1 | Sửa CTA chính ở Hero | Trang chủ | Cao | Thấp | [CẦN BỔ SUNG: ngày triển khai] |
| 2 | Thêm lối đi tiếp cho Studio | /studio | Cao | Trung bình | [CẦN BỔ SUNG: ngày triển khai] |
| 3 | Rút gọn form liên hệ, gắn key event | Trang chủ | Trung bình | Trung bình | [CẦN BỔ SUNG: ngày triển khai] |

### 4.1 Thay đổi 1: Sửa nút CTA chính ở Hero trang chủ

- **Vấn đề:** Nút "Khám phá bộ sưu tập →" trỏ đến neo #shop-all không tồn tại trên trang chủ nên không đưa người dùng đi đâu (rà soát mã nguồn). Số liệu (mục 3.3, 3.4): views trang chủ [CẦN BỔ SUNG], views /shop / views trang chủ = [CẦN BỔ SUNG]%, hero_primary_click [CẦN BỔ SUNG].
- **Thay đổi:** Khối Hero trang chủ: đổi đích nút chính từ #shop-all sang /shop; giữ sự kiện hero_primary_click. [CẦN BỔ SUNG: xác nhận nội dung đã làm]
- **Ảnh Trước-Sau:** [Hình 4: Trước | Sau. Chụp Hero trang chủ nookky.shop trên desktop 1440px; ảnh Trước kèm thanh địa chỉ sau khi bấm (URL thành /#shop-all, trang không cuộn); ảnh Sau là trang /shop mở ra.]
  *Hình 4. Nút CTA chính trước và sau khi sửa đích liên kết.*
- **Lý do dữ liệu:** CTA chính nằm ở vị trí nổi bật nhất của trang chủ; nếu trang chủ là trang có lượng xem lớn nhất (cần xác nhận ở Bảng 7) thì lỗi này ảnh hưởng phần lớn phiên. Công sửa gần như bằng 0. Chỉ số kỳ vọng cải thiện: views /shop / views trang chủ, view_item_list, select_item.

### 4.2 Thay đổi 2: Thêm lối đi tiếp cho trang Studio

- **Vấn đề:** /studio đang thông báo "đang được hoàn thiện" và không có liên kết dẫn tiếp, trong khi menu chính và nút phụ Hero đều dẫn vào (rà soát mã nguồn). Số liệu (mục 3.3): views /studio [CẦN BỔ SUNG], landing sessions /studio [CẦN BỔ SUNG], exit rate /studio [CẦN BỔ SUNG].
- **Thay đổi:** Trên /studio bổ sung: (1) nút "Xem 6 mẫu có sẵn để tự ráp" dẫn đến /shop; (2) dải 3 sản phẩm nổi bật dẫn đến PDP; (3) form 1 trường email "Nhận tin khi Studio mở". [CẦN BỔ SUNG: xác nhận nội dung đã làm]
- **Ảnh Trước-Sau:** [Hình 5: Trước | Sau. Chụp toàn trang nookky.shop/studio trên desktop và mobile 390px; Trước chỉ có tiêu đề và dòng trạng thái; Sau có nút sang /shop, dải 3 sản phẩm và form email.]
  *Hình 5. Trang Studio trước và sau khi bổ sung lối đi tiếp.*
- **Lý do dữ liệu:** Nếu /studio có lượng xem đáng kể so với trang chủ, biến trang cụt thành điểm trung chuyển giữ lại luồng traffic đó; form email biến nhu cầu chờ tính năng thành danh sách khách tiềm năng đo được. Chỉ số kỳ vọng cải thiện: exit rate /studio giảm, views PDP có trang trước là /studio, số đăng ký email.

### 4.3 Thay đổi 3: Rút gọn form liên hệ và gắn key event

- **Vấn đề:** Form liên hệ có 4 trường và sự kiện gửi form chưa là key event (rà soát mã nguồn). Số liệu (mục 3.4): form_start [CẦN BỔ SUNG] users, newsletter_subscribe [CẦN BỔ SUNG] users, tỉ lệ hoàn tất = newsletter_subscribe / form_start = [CẦN BỔ SUNG]%.
- **Thay đổi:** Khối form cuối trang chủ: giảm từ 4 xuống 2 trường bắt buộc (email, mối quan tâm); họ tên và lời nhắn thành tùy chọn; thêm thông báo gửi thành công. Trong GA4, đánh dấu newsletter_subscribe là key event. [CẦN BỔ SUNG: xác nhận nội dung đã làm]
- **Ảnh Trước-Sau:** [Hình 6: Trước | Sau. Chụp khối form cuối trang chủ trên mobile 390px; Trước có 4 trường; Sau có 2 trường và trạng thái gửi thành công; kèm ảnh GA4 Admin > Events với newsletter_subscribe đã bật key event.]
  *Hình 6. Form liên hệ trước và sau khi rút gọn, kèm cấu hình key event.*
- **Lý do dữ liệu:** Mỗi trường bắt buộc thêm vào là thêm một điểm có thể bỏ dở; nếu tỉ lệ hoàn tất ở giai đoạn 1 thấp, rút gọn form nhắm thẳng vào bước rớt đó. Gắn key event giúp đo được lead hợp lệ. Chỉ số kỳ vọng cải thiện: newsletter_subscribe / form_start.

---

## 5. Kết quả kỳ vọng & hạn chế

### 5.1 Tác động dự kiến

**Bảng 11. Tác động dự kiến và kế hoạch đo lại**

| Thay đổi | Chỉ số chính | Trước (giai đoạn 1) | Sau (giai đoạn 3) | Cách đo lại |
| --- | --- | --- | --- | --- |
| 1. CTA Hero | Views /shop / views trang chủ; hero_primary_click | CHƯA CÓ DỮ LIỆU | CHƯA CÓ DỮ LIỆU | GA4 Pages and screens, Events; cùng độ dài kỳ đo |
| 2. Studio | Exit rate /studio; views PDP từ /studio; đăng ký email | CHƯA CÓ DỮ LIỆU | CHƯA CÓ DỮ LIỆU | GA4 Path exploration bắt đầu từ /studio |
| 3. Form | newsletter_subscribe / form_start | CHƯA CÓ DỮ LIỆU | CHƯA CÓ DỮ LIỆU | GA4 Funnel exploration form_start → newsletter_subscribe |

Nguyên tắc so sánh: cùng độ dài kỳ đo trước và sau, đã loại traffic nội bộ, ghi lại các sự kiện kéo traffic khác trong kỳ (đăng bài, khuyến mãi) để không gán nhầm hiệu quả cho thay đổi. Nếu đến hạn nộp chưa có đủ dữ liệu giai đoạn 3, ghi rõ tác động là dự kiến.

### 5.2 Hạn chế của đồ án

1. **Dữ liệu GA4 của Nook Ký chưa được thu thập/xuất tại thời điểm viết khung:** toàn bộ Phần 3 phụ thuộc vào giai đoạn 1.
2. **Lỗi đo lường trong code (Bảng 3):** purchase bắn trước khi xác nhận đơn, PII trong payload, khả năng đếm trùng; số liệu trước khi sửa các lỗi này cần đọc thận trọng.
3. **Cỡ mẫu nhỏ, thời gian ngắn:** site mới, traffic tự nhiên ít; các bước cuối phễu có thể chỉ vài users, không đủ kiểm định thống kê.
4. **Chỉ dùng GA4:** không có heatmap, scroll map hay quan sát người dùng, nên luồng di chuyển được suy luận từ lượt xem trang kết hợp rà soát giao diện.
5. **Traffic nội bộ** từ quá trình QA có thể làm méo engagement và Direct nếu chưa lọc.
6. **Kết luận ở mức tương quan:** so sánh trước và sau không phải thử nghiệm có đối chứng; yếu tố ngoại cảnh chưa được kiểm soát.

### 5.3 Hướng phát triển tiếp theo

1. **Hoàn thiện đo lường thương mại:** thêm order_placed sau phản hồi server, tách payment_reported và payment_verified, xóa PII khỏi GA4, đối soát order log với GA4 theo transaction_id.
2. **A/B test CTA Hero:** biến thể A "Khám phá bộ sưu tập" → /shop, biến thể B "Chọn nơi chốn của bạn" → PDP mẫu Hội An. Chỉ số chính: users có view_item / users vào trang chủ; tính trước cỡ mẫu theo mức hiệu ứng tối thiểu mong muốn.
3. **Gắn UTM cho mọi link phân phối** (mạng xã hội, QR, đối tác) và đưa link về thẳng PDP tương ứng, để so sánh chất lượng kênh bằng add_to_cart và đơn đặt chứ không chỉ sessions.

---

## Phụ lục: Danh sách ảnh chụp màn hình cần chèn

| Hình | Nội dung | Trang/nguồn cần chụp |
| --- | --- | --- |
| Hình 1 | Sessions theo kênh theo tuần và đường ER | Dựng từ GA4 Traffic acquisition |
| Hình 2 | Sơ đồ luồng Trang chủ → /shop → PDP → /cart | GA4 Path exploration |
| Hình 3 | Biểu đồ phễu thương mại điện tử | GA4 Funnel exploration (Bảng 8) |
| Hình 4 | Nút CTA Hero trước và sau | nookky.shop trang chủ, desktop 1440px |
| Hình 5 | Trang Studio trước và sau | nookky.shop/studio, desktop và mobile 390px |
| Hình 6 | Form liên hệ trước và sau, cấu hình key event | Trang chủ (mobile 390px); GA4 Admin > Events |
| Hình 7 | GA4 Traffic acquisition | GA4 > Reports > Acquisition |
| Hình 8 | GA4 Pages and screens | GA4 > Reports > Engagement |
| Hình 9 | GA4 Tech > Device category | GA4 > Reports > Tech |
| Hình 10 | GA4 DebugView xác nhận event sau khi sửa tracking | GA4 > Admin > DebugView |
