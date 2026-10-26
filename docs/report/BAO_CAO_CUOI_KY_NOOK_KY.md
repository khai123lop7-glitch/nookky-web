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

**Ngành hàng.** Nook Ký kinh doanh Book Nook: mô hình thu nhỏ dạng hộp đặt vừa kệ sách, người mua tự lắp ráp rồi giữ lại làm vật décor. Đây là nhánh nhỏ trong ngành quà tặng và đồ thủ công DIY (do it yourself, tự làm). Danh mục hiện có 6 SKU (mã sản phẩm), mỗi mẫu tái hiện một nơi chốn Việt Nam: Hội An, Huế, Hà Nội, Sài Gòn, Đà Lạt và miền Tây, giá niêm yết từ 749.000đ đến 1.099.000đ (nguồn: dữ liệu sản phẩm trên website).

**Lý do chọn.** [CẦN BỔ SUNG: lý do nhóm chọn ngành hàng này, ví dụ khoảng trống thị trường, sở thích, khả năng tự sản xuất nội dung hình ảnh]. Về mặt đồ án, sản phẩm có giá trị đơn hàng trung bình cao và quyết định mua cần nhiều hình ảnh, câu chuyện, nên phù hợp để quan sát hành vi duyệt trang trước khi mua.

**Định vị website.** Mô hình bán hàng trực tiếp (D2C, direct to consumer) với thông điệp "Bản sắc Việt thu nhỏ": mỗi sản phẩm gắn với một ký ức nơi chốn thay vì chỉ là bộ kit lắp ráp. Website gồm trang chủ dạng kể chuyện (video Hội An, mẫu nổi bật, quy trình chế tác, form liên hệ), trang Sản phẩm, Bộ sưu tập, trang chi tiết sản phẩm (PDP, product detail page), giỏ hàng, thanh toán và trang "Tự ráp Nook" (Studio). USP (lợi điểm bán hàng độc nhất) mà nhóm muốn truyền tải: [CẦN BỔ SUNG: nhóm xác nhận 1 câu USP chính thức].

**Nền tảng.** Website được xây dựng ban đầu trên WordPress/WooCommerce (bản V3.2), sau đó nhóm chuyển sang Next.js triển khai trên Vercel để làm việc nhóm theo nhánh (branch) và xem trước từng thay đổi trước khi đưa lên bản chính. Giai đoạn thu thập dữ liệu GA4 (05/09 đến 30/09/2026) chạy trên nền tảng: [CẦN BỔ SUNG: WordPress hay Next.js, ngày chuyển đổi chính thức]. Thông tin này ảnh hưởng trực tiếp đến cách đọc số liệu nên cần ghi rõ.

**Khách hàng mục tiêu (persona tóm tắt).**

| Thuộc tính | Mô tả |
| --- | --- |
| Ai | [CẦN BỔ SUNG: độ tuổi, nghề nghiệp, khu vực]. Giả định của nhóm: người trẻ đi làm hoặc sinh viên năm cuối tại thành phố lớn, thích đồ décor có câu chuyện và hoạt động thủ công |
| Cần gì | Một món quà hoặc vật trang trí mang dấu ấn Việt, có trải nghiệm tự tay làm; cần xem kỹ hình ảnh, kích thước, độ khó trước khi chi khoảng 750.000đ đến 1.100.000đ |
| Thiết bị | Dữ liệu GA4 cho thấy desktop chiếm 68,2% sessions có xác định thiết bị (Bảng 3), nhưng tỷ lệ này có thể bị đẩy lên bởi traffic nội bộ của nhóm (mục 2.4). Thiết bị thực của khách hàng cần kiểm chứng thêm |

*Ghi chú: các dòng ghi "giả định" là suy luận từ định vị sản phẩm, chưa có khảo sát khách hàng.*

---

## 2. Dữ liệu & phương pháp

### 2.1 Công cụ

**Bảng 1. Công cụ thu thập dữ liệu**

| Công cụ | Dùng để đo gì |
| --- | --- |
| Google Analytics 4 (GA4) | Traffic, kênh nguồn, thiết bị, sessions, engagement, lượt xem trang, landing page, sự kiện (event) và phễu người dùng |
| Supermetrics (connector) | Trích xuất dữ liệu GA4 dạng bảng để tổng hợp theo kênh, theo tuần |
| Giao diện GA4 trên trình duyệt | Đọc báo cáo theo người dùng (users), lượt xem trang và thời gian tương tác |
| Rà soát giao diện và mã nguồn | Đối chiếu số liệu với thành phần giao diện thực tế (nút, liên kết, form) để xác định nguyên nhân |

*Nguồn: nhóm tổng hợp. Nhóm không dùng công cụ heatmap (Clarity, Hotjar) hay PageSpeed Insights trong kỳ đo.*

### 2.2 Thời gian thu thập

Dữ liệu được chia thành hai bộ, không cộng gộp và không so sánh trực tiếp:

**Bảng 2. Hai bộ dữ liệu GA4**

| Bộ | Kỳ đo | Cách lấy | Đơn vị chính |
| --- | --- | --- | --- |
| Bộ A | 05/09 đến 30/09/2026 (Measurement ID gắn ngày 05/09) | Supermetrics, xuất ngày 30/09 và truy vấn lại ngày 01/10 | Sessions |
| Bộ B | 27/08 đến 23/09/2026 (28 ngày, theo giao diện GA4) | Đọc trực tiếp giao diện GA4 | Users, lượt xem trang |

*Nguồn: GA4. Số sessions chuẩn dùng trong báo cáo là 839 (truy vấn ngày 01/10). Một số bảng dùng số nền 825 hoặc 848 của bản xuất 30/09 và được ghi rõ.*

### 2.3 Cách thức thu thập và cỡ mẫu

Toàn bộ là traffic tự nhiên đến website trong kỳ đo, không chạy quảng cáo trả phí. Nguồn traffic gồm tìm kiếm Google, truy cập trực tiếp, bài đăng mạng xã hội của nhóm, và mã QR [CẦN BỔ SUNG: mã QR được đặt ở đâu, ví dụ sự kiện, ấn phẩm in]. Nhóm có tự duyệt và kiểm thử website nhiều lần trong kỳ [CẦN BỔ SUNG: có nhờ bạn bè test không, bao nhiêu người, kịch bản nhiệm vụ]. Cỡ mẫu: 839 sessions, 401 users (Bộ A).

### 2.4 Kiểm soát chất lượng dữ liệu

Nhóm ghi nhận 5 vấn đề có thể làm lệch kết quả:

1. **Traffic nội bộ chưa lọc:** 60 user desktop quay lại tạo 333 sessions, tương đương 333 / 839 = 39,7% tổng sessions. Bộ lọc IP nội bộ chưa được bật.
2. **26 session Unassigned ngày 29/09** có 0 tương tác, kéo engagement rate tuần cuối xuống.
3. **Năm cách đếm sessions** cho cùng kỳ (819 đến 848), chênh tối đa 29 sessions (3,5%), không đổi thứ hạng kênh.
4. **Measurement ID bị đổi ngày 12/09** rồi khôi phục trong ngày, có thể gián đoạn thu thập.
5. **Chưa cấu hình key event (sự kiện chuyển đổi):** GA4 ghi 0 key event, nên các số liệu chuyển đổi phản ánh thiếu đo lường trước khi phản ánh hành vi.

Ngoài ra, một số nhãn trang trong bản xuất (ví dụ trang studio ghi đường dẫn /app, các trang /share, /join) chưa khớp với cấu trúc URL hiện tại của Nook Ký. Nhóm chỉ dùng các số liệu xác định được trang tương ứng; phần còn lại để ở trạng thái chờ xác nhận [CẦN BỔ SUNG: đối chiếu URL trong GA4 với site].

---

## 3. Phát hiện chính

### 3.1 Traffic

**Bảng 3. Traffic theo kênh và thiết bị (Bộ A, 05/09 đến 30/09/2026)**

| Kênh | Sessions | Tỉ trọng | Engagement rate | Giây tương tác/session |
| --- | --- | --- | --- | --- |
| Direct (truy cập trực tiếp) | 387 | 46,1% | 53,0% | 69 |
| Organic Search (tìm kiếm tự nhiên) | 235 | 28,0% | 74,9% | 121 |
| Organic Social (mạng xã hội tự nhiên) | 137 | 16,3% | 63,5% | 64 |
| Referral (giới thiệu, chủ yếu mã QR) | 55 | 6,6% | 61,8% | 52 |
| Còn lại (Unassigned, kênh khác) | 25 | 3,0% | không tách được | không tách được |
| **Tổng** | **839** | **100%** | **63,1%** | |

| Thiết bị | Sessions | Tỉ trọng (trên 796 sessions có xác định thiết bị) |
| --- | --- | --- |
| Desktop | 543 | 68,2% |
| Mobile | 250 | 31,4% |
| Tablet | 3 | 0,4% |

*Nguồn: GA4 qua Supermetrics, truy vấn 01/10/2026. Tỉ trọng thiết bị = sessions thiết bị / 796; còn 43 sessions không xác định thiết bị. Engagement rate (ER, tỷ lệ phiên có tương tác) = engaged sessions / sessions; tổng: 529 / 839 = 63,1%.*

**Bảng 4. Xu hướng theo tuần (Bộ A, bản xuất 30/09, số nền 848)**

| Tuần | Sessions | ER | Search | Social | Direct | Referral |
| --- | --- | --- | --- | --- | --- | --- |
| 05 đến 10/09 (6 ngày) | 198 | 61,1% | 48 | 38 | 107 | 4 |
| 11 đến 17/09 | 201 | 63,7% | 74 | 40 | 85 | 2 |
| 18 đến 24/09 | 225 | 66,7% | 58 | 31 | 109 | 27 |
| 25 đến 30/09 | 224 | 47,8% | 56 | 30 | 86 | 22 |

*Nguồn: GA4 qua Supermetrics. Gợi ý Hình 1: biểu đồ cột chồng sessions theo kênh từng tuần, đường ER trên trục phụ.*

**Nhận xét.**
- Direct chiếm gần một nửa traffic (46,1%) nhưng có ER thấp nhất (53,0%). Một phần Direct nhiều khả năng là traffic nội bộ (mục 2.4) và lượt từ ứng dụng mạng xã hội bị mất nguồn khi mở bằng trình duyệt trong ứng dụng. Đây là giả thuyết, chưa kiểm chứng.
- Organic Search là kênh chất lượng nhất: ER 74,9% (khoảng tin cậy 95% Wilson: 69,0% đến 80,0%), cao hơn Direct 21,9 điểm phần trăm (p < 0,001) và gấp 1,75 lần thời gian tương tác của Direct (121 / 69). Search cũng là kênh duy nhất tăng mạnh trong tuần 2 (48 lên 74 sessions, +54%).
- Referral tăng từ 2 lên 27 sessions ở tuần 3, khớp với 25 sessions từ qr1.me-qr.com, cho thấy kênh offline qua mã QR có tác dụng kéo traffic.
- ER tuần 4 giảm còn 47,8%, trùng với 26 session Unassigned không tương tác ngày 29/09, nên đây là bất thường dữ liệu hơn là suy giảm hành vi.

**Kết luận:** Traffic của Nook Ký phụ thuộc vào Direct về lượng nhưng Organic Search mới là kênh mang lại người dùng chất lượng cao nhất.

### 3.2 Phiên truy cập (Sessions)

**Bảng 5. Chỉ số phiên truy cập**

| Chỉ số | Giá trị | Kỳ đo, nguồn |
| --- | --- | --- |
| Sessions | 839 | Bộ A, truy vấn 01/10 |
| Engaged sessions | 529 (ER 63,1%) | Bộ A, truy vấn 01/10 |
| Thời gian tương tác trung bình | 83 giây/session | Bộ A, bản xuất 30/09 |
| Pages/session | 3.036 / 825 = 3,68 trang | Bộ A, bản xuất 30/09 |
| Events/session | 5.660 / 825 = 6,86 sự kiện | Bộ A, bản xuất 30/09 |
| Returning users | 90 / 395 = 22,8% users | Bộ A, bản xuất 30/09 |
| Thời gian tương tác trung bình/user | 2 phút 56 giây | Bộ B |
| Engaged sessions/user | 1,31 | Bộ B |

**Bảng 6. Người dùng mới và quay lại theo kênh (Bộ B, 27/08 đến 23/09/2026)**

| Kênh | New users | Returning users | Tỉ trọng returning | Thời gian tương tác/user |
| --- | --- | --- | --- | --- |
| Direct | 130 | 29 | 43% | 3 phút 56 giây |
| Organic Search | 79 | 29 | 43% | 3 phút 53 giây |
| Organic Social | 70 | 4 | 6% | 31 giây |
| Referral | 17 | 5 | 7% | 34 giây |
| Tổng | 296 | 67 | 100% | |

*Nguồn: giao diện GA4. Bộ B tính thời gian theo user, Bộ A tính theo session; không so trực tiếp hai đơn vị.*

**Nhận xét.**
- Phiên trung bình xem 3,68 trang, nghĩa là người dùng có duyệt sâu chứ không thoát ngay; 63,1% phiên có tương tác.
- Organic Social mang về 70 new users (24% người dùng mới) nhưng chỉ giữ chân 31 giây/user và có 4 lượt quay lại (6%). Direct và Search chiếm 58 / 67 = 86,6% lượt quay lại.
- Độ sâu phiên cao có thể một phần đến từ nhóm tự kiểm thử website (333 sessions từ 60 user desktop quay lại), nên số 3,68 trang/phiên có thể cao hơn hành vi khách thật. Đây là giới hạn cần ghi nhận.

**Kết luận:** Người dùng có tương tác và duyệt nhiều trang trong phiên, nhưng traffic từ mạng xã hội gần như không ở lại và không quay lại.

### 3.3 Luồng di chuyển (User flow)

**Bảng 7. Lượt xem trang và landing page**

| Trang | Lượt xem (Bộ B) | Sessions bắt đầu tại trang (Bộ A) |
| --- | --- | --- |
| Trang chủ | 1.100 | [CẦN BỔ SUNG] |
| Trang Studio "Tự ráp Nook" | 434 | 71 |
| Blog/Journal | 149 | 28 (trang chỉ mục) |
| Trang Sản phẩm, PDP, Giỏ hàng | [CẦN BỔ SUNG] | [CẦN BỔ SUNG] |

*Nguồn: GA4. Trang Studio được bản xuất ghi nhãn /app; nhóm cần xác nhận đây là /studio trên Nook Ký. Các landing page /share (khoảng 33), /join (17) và một số tiêu đề bài blog chưa khớp với site nên không đưa vào phân tích.*

**Tính toán.**
- Tỉ lệ lượt xem Studio trên trang chủ = 434 / 1.100 = 39,5%.
- Tỉ trọng sessions vào thẳng Studio = 71 / 839 = 8,5%.

**Nhận xét.**
- Trang chủ là điểm tập trung lớn nhất (1.100 lượt xem, gấp 2,5 lần Studio), nên mọi lối đi tiếp từ trang chủ đều quyết định luồng còn lại của phiên.
- Studio là trang được xem nhiều thứ hai và là landing page riêng lẻ lớn nhất trong dữ liệu đã xác định. Tuy nhiên, rà soát giao diện cho thấy trang này hiện chỉ có tiêu đề, một đoạn giới thiệu và trạng thái "Trải nghiệm tùy chỉnh đang được hoàn thiện", không có liên kết hay nút dẫn tiếp sang sản phẩm. Nhóm suy luận Studio đang là trang cụt (dead end) trong luồng: người dùng tò mò về tính năng tự ráp đến nơi nhưng không có đường đi tiếp. Suy luận này cần kiểm chứng bằng chỉ số thoát (exit) của trang [CẦN BỔ SUNG: exits hoặc exit rate của /studio trong GA4 Explorations].
- Chưa có số liệu lượt xem trang Sản phẩm, PDP và Giỏ hàng nên chưa vẽ được đường đi đầy đủ Trang chủ → Sản phẩm → PDP → Giỏ hàng.

**Kết luận:** Luồng chính đi qua trang chủ rồi rẽ mạnh sang Studio, nhưng Studio chưa có lối đi tiếp nên có nguy cơ trở thành điểm thoát của phiên.

### 3.4 Điểm nghẽn (Bottlenecks)

**Bảng 8. Phễu người dùng và sự kiện (Bộ A, 05/09 đến 30/09/2026)**

| Bước | Users | Tỉ lệ so với users truy cập | Tỉ lệ rớt so với bước trước |
| --- | --- | --- | --- |
| Có truy cập | 394 | 100% | |
| Cuộn trang (scroll) | 250 | 63,5% | 1 - 250 / 394 = 36,5% |
| Có tương tác | 204 | 51,8% | 1 - 204 / 250 = 18,4% |
| Có sự kiện click | 10 | 2,5% | 1 - 10 / 204 = **95,1%** |
| Bắt đầu điền form (form_start) | 4 | 1,0% | 1 - 4 / 10 = 60,0% |
| Hoàn tất key event | 0 | 0% | **100%** |

*Nguồn: GA4 truy vấn 01/10/2026. Số sự kiện: click 24 lượt, form_start 6 lượt. Các bước không bắt buộc lồng nhau tuyệt đối (một user có thể form_start mà không click), nên tỉ lệ rớt dùng để định vị điểm nghẽn, không phải tỉ lệ chuyển đổi chính xác. Gợi ý Hình 2: biểu đồ phễu ngang.*

**Đối chiếu với giao diện.** Rà soát mã nguồn trang chủ phát hiện nút CTA (call to action, lời kêu gọi hành động) chính ở Hero "Khám phá bộ sưu tập →" trỏ đến neo #shop-all, trong khi trang chủ hiện không có khối nào mang định danh này. Khi bấm, trang không cuộn đến đâu và không chuyển trang. Đây là một nút "chết" (dead click) ngay tại vị trí nổi bật nhất của trang được xem nhiều nhất [CẦN BỔ SUNG: xác nhận lỗi tồn tại trên bản live trong kỳ đo].

**Nhận xét.**
- Điểm rớt lớn nhất nằm giữa "có tương tác" và "click": 204 users có tương tác nhưng chỉ 10 users phát sinh click (4,9%). Lưu ý sự kiện click trong GA4 Enhanced Measurement chủ yếu ghi nhận click ra liên kết ngoài, nên con số 10 không đo hết mọi lượt bấm trong site; tuy vậy, kết hợp với nút CTA chính không hoạt động, nhóm đánh giá trang chủ đang thiếu một lối hành động rõ ràng.
- Điểm rớt thứ hai: 4 users bắt đầu điền form nhưng 0 hoàn tất. Form liên hệ ở cuối trang chủ có 4 trường (họ tên, email, mối quan tâm, lời nhắn). Có hai giả thuyết song song: (a) form dài làm người dùng bỏ dở; (b) sự kiện gửi form (newsletter_subscribe) chưa được đánh dấu là key event nên GA4 ghi 0. Với 4 users, chưa thể phân biệt hai giả thuyết.
- GA4 chưa ghi nhận các sự kiện thương mại (add_to_cart, begin_checkout, purchase) trong dữ liệu tổng hợp, nên chưa đo được phễu mua hàng.

**Kết luận:** Điểm nghẽn lớn nhất là bước chuyển từ "xem" sang "hành động" trên trang chủ (rớt 95,1%), trùng với vị trí nút CTA chính không hoạt động.

### 3.5 Liên kết 4 mảng: nguyên nhân gốc

Bốn mảng cùng chỉ về một vấn đề: website thu hút được người xem nhưng chưa dẫn họ đến hành động. Traffic có chất lượng (ER 63,1%, Search 74,9%), phiên duyệt sâu (3,68 trang/phiên), nhưng luồng di chuyển tập trung ở trang chủ và Studio, hai nơi đều thiếu lối đi tiếp: trang chủ có CTA chính không hoạt động, Studio là trang cụt chưa có tính năng. Hệ quả là phễu rớt 95,1% ở bước chuyển sang click và 0 hoàn tất form. Mạng xã hội càng khuếch đại vấn đề vì khách từ đây chỉ ở lại 31 giây, không đủ thời gian tự tìm đường khi lối chính bị gãy. Lớp nguyên nhân thứ hai là đo lường: thiếu key event và chưa lọc traffic nội bộ khiến mọi tỷ lệ chuyển đổi hiện mới ở mức tín hiệu, chưa phải kết luận.

---

## 4. Đề xuất & thay đổi đã thực hiện

Các thay đổi được sắp theo ma trận tác động/công sức: tác động cao, công sức thấp lên trước.

**Bảng 9. Thứ tự ưu tiên**

| # | Thay đổi | Trang | Tác động | Công sức | Trạng thái |
| --- | --- | --- | --- | --- | --- |
| 1 | Sửa CTA chính ở Hero | Trang chủ | Cao | Thấp | [CẦN BỔ SUNG: ngày triển khai] |
| 2 | Biến Studio từ trang cụt thành trang có lối đi tiếp | /studio | Cao | Trung bình | [CẦN BỔ SUNG: ngày triển khai] |
| 3 | Rút gọn form liên hệ và gắn key event | Trang chủ | Trung bình | Trung bình | [CẦN BỔ SUNG: ngày triển khai] |

### 4.1 Thay đổi 1: Sửa nút CTA chính ở Hero trang chủ

- **Vấn đề:** Phễu rớt 95,1% từ "có tương tác" (204 users) sang "click" (10 users) (mục 3.4). Trang chủ là trang được xem nhiều nhất (1.100 lượt, mục 3.3), nhưng nút "Khám phá bộ sưu tập →" trỏ đến neo #shop-all không tồn tại nên không đưa người dùng đi đâu.
- **Thay đổi:** Trên trang chủ, khối Hero: đổi đích của nút chính từ #shop-all sang trang /shop (danh sách 6 sản phẩm); giữ sự kiện hero_primary_click để đo. Nút phụ "Tự ráp Nook (Studio)" giữ nguyên nhưng gắn thêm sự kiện hero_secondary_click để so sánh hai lối. [CẦN BỔ SUNG: nhóm xác nhận nội dung thực tế đã sửa]
- **Ảnh Trước-Sau:** [Hình 3: Trước | Sau. Chụp Hero trang chủ nookky.shop trên desktop 1440px; ảnh Trước kèm thanh địa chỉ sau khi bấm nút (URL chỉ đổi thành /#shop-all, trang không cuộn); ảnh Sau là trang /shop mở ra sau khi bấm.]
  *Hình 3. Nút CTA chính trước và sau khi sửa đích liên kết.*
- **Lý do dữ liệu:** CTA chính nằm trên trang chiếm lượng xem lớn nhất, nên một nút hỏng tại đây ảnh hưởng trực tiếp đến phần lớn phiên. Sửa lỗi gần như không tốn công nhưng mở lại lối đi chính Trang chủ → Sản phẩm. Chỉ số kỳ vọng cải thiện: số lượt hero_primary_click, tỉ lệ lượt xem /shop trên lượt xem trang chủ, và lượt xem PDP.

### 4.2 Thay đổi 2: Thêm lối đi tiếp cho trang Studio

- **Vấn đề:** Studio nhận 434 lượt xem (bằng 39,5% lượt xem trang chủ) và 71 sessions vào thẳng (8,5% tổng sessions) (mục 3.3), nhưng trang chỉ hiển thị trạng thái "đang được hoàn thiện", không có liên kết nào dẫn tiếp. Người dùng quan tâm đến trải nghiệm tự ráp không có hành động khả thi nào sau khi đến.
- **Thay đổi:** Trên trang /studio, dưới phần giới thiệu, bổ sung: (1) nút "Xem 6 mẫu có sẵn để tự ráp" dẫn đến /shop; (2) dải 3 sản phẩm nổi bật (Hội An, Huế, Hà Nội) dẫn đến PDP; (3) form 1 trường email "Nhận tin khi Studio mở" thay cho dòng trạng thái tĩnh. [CẦN BỔ SUNG: nhóm xác nhận nội dung thực tế đã làm]
- **Ảnh Trước-Sau:** [Hình 4: Trước | Sau. Chụp toàn trang nookky.shop/studio trên desktop và mobile 390px; ảnh Trước chỉ có tiêu đề và dòng trạng thái; ảnh Sau có nút sang /shop, dải 3 sản phẩm và form email.]
  *Hình 4. Trang Studio trước và sau khi bổ sung lối đi tiếp.*
- **Lý do dữ liệu:** Studio là trang có lượng xem lớn thứ hai, nên biến nó từ điểm cụt thành điểm trung chuyển giúp giữ lại một luồng traffic đáng kể. Form email cũng biến nhu cầu "chờ tính năng" thành danh sách khách tiềm năng đo được. Chỉ số kỳ vọng cải thiện: exit rate của /studio giảm, lượt xem /shop và PDP có trang trước là /studio tăng, số lượt đăng ký email từ Studio.

### 4.3 Thay đổi 3: Rút gọn form liên hệ và gắn key event

- **Vấn đề:** 4 users bắt đầu điền form (6 lượt form_start) nhưng 0 key event hoàn tất (mục 3.4). Form cuối trang chủ có 4 trường, trong đó có ô lời nhắn tự do.
- **Thay đổi:** Trên trang chủ, khối form liên hệ: giảm từ 4 xuống 2 trường bắt buộc (email, mối quan tâm); họ tên và lời nhắn chuyển thành tùy chọn, thu gọn mặc định; thêm thông báo xác nhận ngay sau khi gửi. Trong GA4, đánh dấu sự kiện newsletter_subscribe là key event. [CẦN BỔ SUNG: nhóm xác nhận nội dung thực tế đã làm]
- **Ảnh Trước-Sau:** [Hình 5: Trước | Sau. Chụp khối form cuối trang chủ trên mobile 390px; ảnh Trước có 4 trường; ảnh Sau có 2 trường và trạng thái gửi thành công. Kèm ảnh màn hình GA4 Admin > Events với newsletter_subscribe đã bật "Mark as key event".]
  *Hình 5. Form liên hệ trước và sau khi rút gọn, kèm cấu hình key event.*
- **Lý do dữ liệu:** Thay đổi xử lý cùng lúc cả hai giả thuyết ở mục 3.4: rút gọn form xử lý giả thuyết form dài, gắn key event xử lý giả thuyết thiếu đo lường. Nếu sau thay đổi vẫn có form_start nhưng 0 key event, nhóm loại được giả thuyết đo lường. Chỉ số kỳ vọng cải thiện: tỉ lệ hoàn tất form = key event / form_start (hiện 0 / 4 users).

---

## 5. Kết quả kỳ vọng & hạn chế

### 5.1 Tác động dự kiến

Nhóm chưa có số liệu GA4 sau thay đổi vì quyền truy cập connector hết hạn ngày 09/10/2026 và chưa đọc lại giao diện GA4 sau mốc 30/09. Toàn bộ tác động dưới đây là **dự kiến**, kèm cách đo lại.

**Bảng 10. Tác động dự kiến và kế hoạch đo lại**

| Thay đổi | Chỉ số chính | Trước (thực đo) | Sau | Cách đo lại |
| --- | --- | --- | --- | --- |
| 1. CTA Hero | Users có click/users tương tác; lượt xem /shop trên lượt xem trang chủ | 10 / 204 = 4,9%; /shop: [CẦN BỔ SUNG] | [CẦN BỔ SUNG hoặc "chưa có"] | GA4 Explorations, sự kiện hero_primary_click, 14 đến 28 ngày sau triển khai |
| 2. Studio | Exit rate /studio; lượt xem PDP từ /studio; đăng ký email | Exit rate: [CẦN BỔ SUNG]; email: 0 | [CẦN BỔ SUNG hoặc "chưa có"] | GA4 Path exploration bắt đầu từ /studio, cùng thời lượng |
| 3. Form | Key event / form_start | 0 / 4 users | [CẦN BỔ SUNG hoặc "chưa có"] | GA4 Funnel exploration form_start → newsletter_subscribe |

Nguyên tắc so sánh: dùng cùng độ dài kỳ đo trước và sau, loại traffic nội bộ trước khi so, và không gán cải thiện cho thay đổi nếu cùng lúc có sự kiện kéo traffic khác (đăng bài mạng xã hội, đặt mã QR mới).

### 5.2 Hạn chế của đồ án

1. **Cỡ mẫu nhỏ:** 839 sessions, 401 users trong 26 ngày; phễu chỉ còn 10 users ở bước click và 4 users ở form_start, không đủ để kiểm định thống kê các bước cuối.
2. **Traffic nội bộ chưa lọc:** khoảng 39,7% sessions có thể đến từ nhóm, làm lệch ER, thời gian tương tác, pages/session và tỷ trọng desktop. Các kiểm định ở mục 3.1 chưa hiệu chỉnh cho yếu tố này.
3. **Thiếu đo lường hành vi:** không có key event, chưa thấy sự kiện thương mại trong dữ liệu, không có heatmap hay scroll map, nên luồng di chuyển và điểm nghẽn được suy luận từ lượt xem trang kết hợp rà soát giao diện, không phải quan sát trực tiếp.
4. **Dữ liệu không nhất quán:** hai bộ số khác kỳ và khác đơn vị; năm cách đếm sessions; một số nhãn trang trong bản xuất chưa khớp URL của site; Measurement ID bị đổi ngày 12/09.
5. **Thời gian ngắn và chưa đo lại:** chưa có dữ liệu sau thay đổi, nên mọi tác động ở Bảng 10 là kỳ vọng. Yếu tố ngoại cảnh (Trung Thu, lịch đăng bài) chưa được kiểm soát.
6. **Kết luận ở mức tương quan:** các liên hệ như "CTA hỏng dẫn đến rớt phễu" là suy luận hợp lý từ dữ liệu và giao diện, chưa phải quan hệ nhân quả đã kiểm chứng.

### 5.3 Hướng phát triển tiếp theo

1. **Chuẩn hóa đo lường trước khi tối ưu tiếp:** bật bộ lọc traffic nội bộ, kiểm tra các sự kiện view_item, add_to_cart, begin_checkout, purchase trong GA4 DebugView, đánh dấu key event; cài Microsoft Clarity để có heatmap, rage click và dead click trên trang chủ và Studio.
2. **A/B test CTA Hero:** biến thể A "Khám phá bộ sưu tập" dẫn đến /shop, biến thể B "Chọn nơi chốn của bạn" dẫn thẳng đến PDP mẫu Hội An. Chỉ số chính: tỉ lệ users xem PDP trên users vào trang chủ. Chạy đến khi mỗi nhánh đủ cỡ mẫu tính trước theo mức hiệu ứng tối thiểu mong muốn.
3. **Tối ưu traffic mạng xã hội:** gắn UTM cho từng bài đăng và đưa link về thẳng PDP tương ứng thay vì trang chủ, sau đó so thời gian tương tác/user của Organic Social với mức 31 giây hiện tại.

---

## Phụ lục: Danh sách ảnh chụp màn hình cần chèn

| Hình | Nội dung | Trang/nguồn cần chụp |
| --- | --- | --- |
| Hình 1 | Biểu đồ sessions theo kênh từng tuần và đường ER | Dựng từ Bảng 4 (Excel/Google Sheets) |
| Hình 2 | Biểu đồ phễu users từ truy cập đến key event | Dựng từ Bảng 8 hoặc GA4 Funnel exploration |
| Hình 3 | Nút CTA Hero trước và sau khi sửa | nookky.shop trang chủ, desktop 1440px |
| Hình 4 | Trang Studio trước và sau khi thêm lối đi tiếp | nookky.shop/studio, desktop và mobile 390px |
| Hình 5 | Form liên hệ trước và sau khi rút gọn, cấu hình key event | Trang chủ (mobile 390px); GA4 Admin > Events |
| Hình 6 | Báo cáo GA4 Traffic acquisition (kênh) | GA4 > Reports > Acquisition |
| Hình 7 | Báo cáo GA4 Pages and screens | GA4 > Reports > Engagement |
| Hình 8 | Báo cáo GA4 Tech > Device category | GA4 > Reports > Tech |
