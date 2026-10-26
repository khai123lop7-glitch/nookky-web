# Ghi chú nội bộ (không nộp)

File nộp chính thức: `BAO_CAO_CUOI_KY_NOOK_KY.docx` (bản xem trước: `BAO_CAO_CUOI_KY_NOOK_KY_preview.pdf`). Bài thuyết trình: https://claude.ai/artifact/X75aUdGFxrBBtH5xhEkE97

## a. Đối chiếu yêu cầu đề bài

| Yêu cầu | Trạng thái | Ở đâu |
| --- | --- | --- |
| Sản phẩm 1: website TMĐT | Đạt, kèm rủi ro: đề yêu cầu WordPress/WooCommerce, website đang chạy Next.js (đã ghi rõ quá trình chuyển ở mục 1.2) | nookky.shop |
| Sản phẩm 2: báo cáo cuối kỳ | Đủ khung và số liệu; còn [CẦN BỔ SUNG] thông tin nhóm | file .docx |
| Sản phẩm 3: bài thuyết trình | Có, 17 slide; CHƯA có slide về phản hồi của lớp | link trên |
| Vai trò từng thành viên | Đủ vai trò, trách nhiệm, sản phẩm bàn giao; CHƯA có tên, MSSV | Bảng 1 |
| ≥ 3 thay đổi làm thật trên website | Đã code và chụp ảnh ngày 26/10/2026; chỉ lên production sau khi merge PR | Phần 4 |
| Mỗi thay đổi đủ Vấn đề, Thay đổi, Ảnh Trước-Sau, Lý do dữ liệu | Đạt cả 3 (mục 4.1 đến 4.3) và 2 hạng mục xử lý theo phản hồi lớp (mục 4.4, riêng dòng chữ nhỏ còn thiếu ảnh và nguồn) | Hình 5 đến 8 |
| Phần 1 Bối cảnh | Đạt; lý do chọn, USP, persona còn [CẦN BỔ SUNG] | Phần 1 |
| Phần 2 Công cụ, thời gian, cách thu thập | Đạt (GA4, order log, tự duyệt web, mã nguồn, phản hồi lớp học) | Bảng 2 |
| Phần 3 Đủ 4 mảng, mỗi mảng có số liệu và kết luận | Đạt; thêm mục 3.5 phản hồi lớp và 3.6 nguyên nhân gốc | Mục 3.1 đến 3.6 |
| Phần 5 Tác động dự kiến, đo lại, hạn chế | Đạt; chưa có số liệu sau thay đổi | Phần 5 |
| Độ dài 6 đến 10 trang (không tính phụ lục ảnh) | Đạt: phần 1 đến 5 chiếm 10 trang (trang 3 đến 12 khi mở bằng LibreOffice); thêm trang bìa, mục lục kèm bảng vai trò (2 trang) và phụ lục (3 trang). Mở bằng Word có thể lệch vài dòng | |
| Đánh số trang, font nhất quán | Đạt: Times New Roman 11,5, giãn dòng 1,1, "Trang x / y" | |

## b. Việc cần làm theo thứ tự

1. **Sửa 8 yêu cầu ảnh trả mã 404 ở trang chủ** (Hình 12): thiếu `craft-step-01..04.webp`, `craft-sketch.webp`, `craft-main.webp`; hai CSS còn trỏ `brand-story-bg.png` và `craft-process-bg.png` dù đã đổi sang `.webp`. Cần tệp ảnh gốc từ nhóm. Sau khi sửa, chụp lại Hình 12 làm ảnh "Sau".
2. Chuyển 30 ảnh sản phẩm đang tải từ Google Drive sang WebP lưu trong website (cần tải từ Drive về).
3. Xác nhận 3 điểm trong mục 4.4: nguồn nghiên cứu về cỡ chữ, ảnh Trước-Sau của lỗi chữ bị thanh điều hướng che, và việc "căn lề cuộn 72px" có đúng là cách nhóm đã xử lý.
4. Merge PR để 3 thay đổi lên nookky.shop; ghi ngày merge vào Phần 4. Sau 14 ngày, điền cột "Sau" của Bảng 11.
5. Điền: tên, MSSV, lý do chọn ngành, USP, persona, ngày chuyển nền tảng, lọc traffic nội bộ, chi phí quảng cáo, thời điểm và cách thu thập phản hồi lớp.
6. Chụp 4 ảnh GA4 (Hình 14 đến 17) cho Phụ lục A; xác nhận nguồn traffic /blog và 289 lượt hero_secondary_click.

## c. Số liệu mới trong mục 3.5 và 4.4 (có thể kiểm lại)

| Số liệu | Giá trị | Cách kiểm |
| --- | --- | --- |
| Dung lượng ảnh trong đợt tối ưu 18/09 | 142,1 MB (38 tệp PNG/JPG) → 10,6 MB (WebP), giảm 92,6% | `git show --stat 34f956b` và kích thước blob |
| Ảnh sản phẩm tải ngoài | 30 ảnh từ drive.google.com; 11 đến 12 yêu cầu ngoài mỗi trang /shop, PDP | `data/products.ts`; đo bằng Playwright |
| Video | 10 tệp, 58,2 MB | `public/media/editorial/*.mp4` |
| Chatbot trước và sau | nút mở 242x112 → 161x74 px; khung 380x580 → 345x505 px | Playwright, 1440x900 |
| Yêu cầu 404 trên trang chủ | 8 | Playwright, cuộn hết trang |
| Khai báo cỡ chữ ≤ 11,5px | 134 trên 364 | grep `font-size` trong CSS của `main` |

## d. Câu hỏi hội đồng có thể hỏi

**1. "Đề yêu cầu WordPress/WooCommerce, sao website lại là Next.js?"**
Gợi ý: Nhóm dựng bản WordPress/WooCommerce V3.2 trước, sau đó chuyển giao diện sang Next.js trên Vercel để mỗi thay đổi có link xem trước riêng, kiểm thử được trước khi lên bản chính. [Chuẩn bị bằng chứng bản WordPress nếu giảng viên yêu cầu.]

**2. "Phản hồi nói web nặng, nhóm đã làm gì và còn gì chưa làm?"**
Gợi ý: Đã đổi 38 ảnh PNG/JPG sang WebP, giảm 92,6% dung lượng (142,1 MB còn 10,6 MB). Nhóm ghi nhận 30 ảnh sản phẩm vẫn tải từ Google Drive và có 10 video 58,2 MB; chưa đo PageSpeed nên chưa kết luận về thời gian tải. Đây là bước tiếp theo.

**3. "Vì sao một số ảnh ở phần Hành trình tạo nên một Nook không hiển thị?"**
Gợi ý: Nhóm phát hiện khi đối chiếu kỹ thuật: 8 yêu cầu ảnh trả mã 404 do tệp chưa có trong thư mục media và 2 tham chiếu còn đuôi .png sau khi đổi sang WebP. Nhóm đã xác định nguyên nhân và bổ sung tệp [cập nhật khi đã sửa].

**4. "Lấy gì chứng minh thay đổi dựa trên dữ liệu chứ không phải cảm tính?"**
Gợi ý: Mỗi thay đổi gắn với một con số và một lỗi kiểm chứng được: CTA có 574 lượt bấm nhưng trỏ đến neo không tồn tại; PDP rớt 81,7% và thông tin giao hàng, bảo hành chỉ có trong chatbot; checkout rớt 64,9% với 7 trường hiển thị trong khi chỉ 4 bắt buộc. Mỗi thay đổi có chỉ số đo lại cụ thể (Bảng 11).

**5. "Organic Search có thật sự tốt hơn Direct không?"**
Gợi ý: Về tương tác thì có: ER 71,8% so với 57,1%, p < 0,001. Về tỉ lệ đặt đơn (2,32% so với 1,23%) thì chưa khẳng định được, p = 0,08 vì chỉ 19 và 12 đơn.
