const fs = require("fs");
const {
  Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, Table, TableRow, TableCell,
  WidthType, ShadingType, BorderStyle, ImageRun, Footer, Header, PageNumber, LevelFormat,
  TableOfContents, PageBreak, VerticalAlign,
} = require("docx");

const CH = "/home/user/nookky-web/docs/report/charts/";
const OUT = "/home/user/nookky-web/docs/report/BAO_CAO_CUOI_KY_NOOK_KY.docx";
const FONT = "Times New Roman";
const SZ = 24; // 12pt
const TW = 9354; // text width DXA (A4, margins 2cm/2cm... see below)

// --- inline markup: **bold**, *italic*
function runs(text, base = {}) {
  const out = [];
  const re = /(\*\*[^*]+\*\*|\*[^*]+\*)/g;
  let last = 0, m;
  while ((m = re.exec(text))) {
    if (m.index > last) out.push(new TextRun({ text: text.slice(last, m.index), ...base }));
    const t = m[0];
    if (t.startsWith("**")) out.push(new TextRun({ text: t.slice(2, -2), bold: true, ...base }));
    else out.push(new TextRun({ text: t.slice(1, -1), italics: true, ...base }));
    last = m.index + t.length;
  }
  if (last < text.length) out.push(new TextRun({ text: text.slice(last), ...base }));
  return out;
}
const P = (t, o = {}) => new Paragraph({ children: runs(t, o.run || {}), alignment: o.align ?? AlignmentType.JUSTIFIED, spacing: { after: 120, line: 276 }, ...(o.p || {}) });
const B = (t) => new Paragraph({ children: runs(t), numbering: { reference: "bul", level: 0 }, alignment: AlignmentType.JUSTIFIED, spacing: { after: 80, line: 276 } });
let NI = 1;
const N = (t) => new Paragraph({ children: runs(t), numbering: { reference: "num", level: 0, instance: NI }, alignment: AlignmentType.JUSTIFIED, spacing: { after: 80, line: 276 } });
const H1 = (t, br = false) => new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun(t)], pageBreakBefore: br });
const H2 = (t) => new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun(t)] });
const H3 = (t) => new Paragraph({ heading: HeadingLevel.HEADING_3, children: [new TextRun(t)] });
const CAP = (t) => new Paragraph({ children: runs(t, { bold: true, size: 22 }), alignment: AlignmentType.CENTER, spacing: { before: 120, after: 60 }, keepNext: true });
const SRC = (t) => new Paragraph({ children: runs(t, { italics: true, size: 20 }), alignment: AlignmentType.LEFT, spacing: { before: 40, after: 160 } });
const KET = (t) => new Paragraph({
  children: [new TextRun({ text: "Kết luận: ", bold: true }), ...runs(t)],
  alignment: AlignmentType.JUSTIFIED, spacing: { before: 120, after: 200, line: 276 },
  shading: { type: ShadingType.CLEAR, fill: "EAF2FB" },
  border: { left: { style: BorderStyle.SINGLE, size: 18, color: "2A78D6", space: 6 } },
  indent: { left: 120, right: 120 },
});

const border = { style: BorderStyle.SINGLE, size: 4, color: "A6A6A6" };
const borders = { top: border, bottom: border, left: border, right: border };
function cell(text, w, o = {}) {
  return new TableCell({
    borders, width: { size: w, type: WidthType.DXA },
    shading: o.fill ? { type: ShadingType.CLEAR, fill: o.fill } : undefined,
    margins: { top: 30, bottom: 30, left: 80, right: 80 },
    verticalAlign: VerticalAlign.CENTER,
    children: String(text).split("\n").map((line) => new Paragraph({
      children: runs(line, { size: 20, bold: !!o.bold }),
      alignment: o.align ?? AlignmentType.LEFT, spacing: { after: 0, line: 260 },
    })),
  });
}
// table(widths as fractions or dxa, header, rows, opts {num: [colIdx right-aligned], totalLast})
function table(fr, header, rows, o = {}) {
  const sum = fr.reduce((a, b) => a + b, 0);
  const w = fr.map((f) => Math.floor((f / sum) * TW));
  w[w.length - 1] += TW - w.reduce((a, b) => a + b, 0);
  const right = new Set(o.num || []);
  const mk = (r, isHead, isTot) => new TableRow({
    tableHeader: isHead,
    children: r.map((c, i) => cell(c, w[i], {
      fill: isHead ? "1F4E79" : isTot ? "F2F2F2" : (o.hl && o.hl(r) ? "FDEBDD" : undefined),
      bold: isHead || isTot, align: !isHead && right.has(i) ? AlignmentType.RIGHT : (isHead ? AlignmentType.CENTER : AlignmentType.LEFT),
    })),
  });
  const headRow = new TableRow({
    tableHeader: true,
    children: header.map((c, i) => new TableCell({
      borders, width: { size: w[i], type: WidthType.DXA }, shading: { type: ShadingType.CLEAR, fill: "1F4E79" },
      margins: { top: 30, bottom: 30, left: 80, right: 80 }, verticalAlign: VerticalAlign.CENTER,
      children: [new Paragraph({ children: [new TextRun({ text: c, bold: true, color: "FFFFFF", size: 20 })], alignment: AlignmentType.CENTER, spacing: { after: 0 } })],
    })),
  });
  return new Table({
    width: { size: TW, type: WidthType.DXA }, columnWidths: w,
    rows: [headRow, ...rows.map((r, i) => mk(r, false, o.totalLast && i === rows.length - 1))],
  });
}
function img(file, wpx, hpx) {
  const buf = fs.readFileSync(CH + file);
  const width = 470, height = Math.round((hpx / wpx) * width);
  return new Paragraph({ children: [new ImageRun({ type: "png", data: buf, transformation: { width, height }, altText: { title: file, description: file, name: file } })], alignment: AlignmentType.CENTER, keepNext: true, spacing: { after: 0 } });
}
function pngSize(file) { const b = fs.readFileSync(CH + file); return [b.readUInt32BE(16), b.readUInt32BE(20)]; }
function figure(file, caption, src) { const [w, h] = pngSize(file); return [CAP(caption), img(file, w, h), SRC(src)]; }
function beforeAfter(caption, before, after, note) {
  const half = Math.floor(TW / 2);
  const box = (title, body) => new TableCell({
    borders: { top: { style: BorderStyle.DASHED, size: 6, color: "7F7F7F" }, bottom: { style: BorderStyle.DASHED, size: 6, color: "7F7F7F" }, left: { style: BorderStyle.DASHED, size: 6, color: "7F7F7F" }, right: { style: BorderStyle.DASHED, size: 6, color: "7F7F7F" } },
    width: { size: half, type: WidthType.DXA }, margins: { top: 120, bottom: 120, left: 120, right: 120 },
    shading: { type: ShadingType.CLEAR, fill: "F7F7F5" },
    children: [
      new Paragraph({ children: [new TextRun({ text: title, bold: true, size: 24 })], alignment: AlignmentType.CENTER, spacing: { after: 120 } }),
      new Paragraph({ children: [new TextRun({ text: "[CHÈN ẢNH CHỤP MÀN HÌNH]", color: "A6A6A6", size: 22 })], alignment: AlignmentType.CENTER, spacing: { before: 360, after: 360 } }),
      new Paragraph({ children: runs(body, { size: 21, italics: true }), alignment: AlignmentType.LEFT, spacing: { after: 0 } }),
    ],
  });
  return [CAP(caption), new Table({ width: { size: half * 2, type: WidthType.DXA }, columnWidths: [half, half], rows: [new TableRow({ cantSplit: true, children: [box("TRƯỚC", before), box("SAU", after)] })] }), SRC(note)];
}

// ================= CONTENT =================
const C = [];

// --- Cover
C.push(
  new Paragraph({ children: [new TextRun({ text: "ĐẠI HỌC KINH TẾ THÀNH PHỐ HỒ CHÍ MINH (UEH)", bold: true, size: 28 })], alignment: AlignmentType.CENTER, spacing: { before: 600, after: 80 } }),
  new Paragraph({ children: [new TextRun({ text: "[CẦN BỔ SUNG: Trường/Khoa]", size: 26 })], alignment: AlignmentType.CENTER, spacing: { after: 1400 } }),
  new Paragraph({ children: [new TextRun({ text: "BÁO CÁO CUỐI KỲ", bold: true, size: 44 })], alignment: AlignmentType.CENTER, spacing: { after: 240 } }),
  new Paragraph({ children: [new TextRun({ text: "PHÂN TÍCH HÀNH VI NGƯỜI DÙNG VÀ CẢI THIỆN GIAO DIỆN", bold: true, size: 32, color: "1F4E79" })], alignment: AlignmentType.CENTER, spacing: { after: 80 } }),
  new Paragraph({ children: [new TextRun({ text: "WEBSITE NOOK KÝ (nookky.shop)", bold: true, size: 32, color: "1F4E79" })], alignment: AlignmentType.CENTER, spacing: { after: 1400 } }),
  ...[
    ["Học phần", "[CẦN BỔ SUNG]"], ["Giảng viên hướng dẫn", "[CẦN BỔ SUNG]"], ["Nhóm", "[CẦN BỔ SUNG]"],
    ["Kỳ dữ liệu phân tích", "01/10/2026 đến 25/10/2026"], ["Thành phố Hồ Chí Minh", "tháng [CẦN BỔ SUNG]/2026"],
  ].map(([k, v]) => new Paragraph({ children: [new TextRun({ text: k + ": ", bold: true }), new TextRun(v)], alignment: AlignmentType.CENTER, spacing: { after: 100 } })),
);

// --- TOC + roles
C.push(
  new Paragraph({ children: [new PageBreak()] }),
  new Paragraph({ children: [new TextRun({ text: "MỤC LỤC", bold: true, size: 30 })], alignment: AlignmentType.CENTER, spacing: { after: 200 } }),
  new TableOfContents("Mục lục", { hyperlink: true, headingStyleRange: "1-2" }),
  P("*(Trong Word: nhấp chuột phải vào mục lục, chọn Update Field để cập nhật số trang.)*", { align: AlignmentType.CENTER }),
  new Paragraph({ children: [new PageBreak()] }),
  new Paragraph({ children: [new TextRun({ text: "THÀNH VIÊN VÀ PHÂN CÔNG", bold: true, size: 30 })], alignment: AlignmentType.CENTER, spacing: { after: 200 } }),
  CAP("Bảng 1. Thành viên nhóm và vai trò"),
  table([2.2, 1.3, 2, 3.5], ["Thành viên", "MSSV", "Vai trò chính", "Đầu việc cụ thể"], [
    ["[CẦN BỔ SUNG]", "[CẦN BỔ SUNG]", "Quản trị website", "[CẦN BỔ SUNG: ví dụ cấu hình GA4, triển khai thay đổi trên Vercel]"],
    ["[CẦN BỔ SUNG]", "[CẦN BỔ SUNG]", "Phân tích dữ liệu", "[CẦN BỔ SUNG: ví dụ xuất báo cáo GA4, đối soát order log, kiểm định]"],
    ["[CẦN BỔ SUNG]", "[CẦN BỔ SUNG]", "Thiết kế giao diện", "[CẦN BỔ SUNG: ví dụ thiết kế 3 thay đổi, chụp ảnh Trước-Sau]"],
    ["[CẦN BỔ SUNG]", "[CẦN BỔ SUNG]", "Viết báo cáo, thuyết trình", "[CẦN BỔ SUNG]"],
  ]),
  SRC("Nguồn: nhóm tự tổng hợp."),
);

// ============ 1. BỐI CẢNH ============
C.push(H1("1. Bối cảnh", true));
C.push(H2("1.1 Ngành hàng"));
C.push(P("Nook Ký kinh doanh **Book Nook**: mô hình thu nhỏ dạng hộp đặt vừa kệ sách, người mua tự lắp ráp (350 đến 430 mảnh, 6 đến 8 giờ lắp với các mẫu phổ biến) rồi giữ lại làm vật décor. Đây là nhánh nhỏ trong ngành quà tặng và đồ thủ công DIY (do it yourself, tự làm). Danh mục hiện có 6 SKU (stock keeping unit, mã sản phẩm), mỗi mẫu tái hiện một nơi chốn Việt Nam."));
C.push(CAP("Bảng 2. Danh mục sản phẩm của Nook Ký"));
C.push(table([3.2, 2.6, 1.4, 1.5, 1.6], ["item_id (slug)", "Tên sản phẩm", "Địa danh", "Khu vực", "Giá bán (VND)"], [
  ["pho-vua-len-den-hoi-an", "Phố Vừa Lên Đèn", "Hội An", "Miền Trung", "899.000"],
  ["mua-qua-san-gach-hue", "Mưa Qua Sân Gạch", "Huế", "Miền Trung", "929.000"],
  ["sang-tren-pho-cu-ha-noi", "Sáng Trên Phố Cũ", "Hà Nội", "Miền Bắc", "849.000"],
  ["hem-con-sang-den-sai-gon", "Hẻm Còn Sáng Đèn", "Sài Gòn", "Miền Nam", "1.099.000"],
  ["den-am-tren-doc-da-lat", "Đèn Ấm Trên Dốc", "Đà Lạt", "Miền Nam", "849.000"],
  ["song-vua-thuc-giac-mien-tay", "Sông Vừa Thức Giấc", "Miền Tây", "Miền Nam", "749.000"],
], { num: [4] }));
C.push(SRC("Nguồn: dữ liệu sản phẩm trên website (data/products.ts), đối chiếu ngày 26/10/2026. Giá niêm yết, không phải doanh thu."));
C.push(H2("1.2 Lý do chọn ngành hàng"));
C.push(P("[CẦN BỔ SUNG: lý do nhóm chọn ngành hàng, ví dụ sở thích, khoảng trống thị trường quà tặng mang bản sắc Việt, khả năng tự sản xuất nội dung hình ảnh]. Về mặt đồ án, ngành hàng phù hợp để phân tích hành vi vì sản phẩm có giá trị đơn cao (AOV, average order value, giá trị đơn trung bình, đạt 975.442đ trong kỳ đo) và quyết định mua cần nhiều hình ảnh, thông tin lắp ráp. Người mua thường xem kỹ trước khi thêm vào giỏ, nên các điểm rớt trong phễu thể hiện rõ trên dữ liệu."));
C.push(H2("1.3 Định vị website"));
C.push(P("Nook Ký theo mô hình bán hàng trực tiếp (D2C, direct to consumer) với thông điệp **\"Bản sắc Việt thu nhỏ\"**: mỗi sản phẩm gắn với ký ức một nơi chốn thay vì chỉ là bộ kit lắp ráp. Website gồm trang chủ dạng kể chuyện (video Hội An, mẫu nổi bật, quy trình chế tác, form liên hệ), trang /shop, /collections, 6 trang chi tiết sản phẩm (PDP, product detail page), giỏ hàng, checkout với 4 phương thức thanh toán (COD, chuyển khoản, MoMo, ZaloPay), trang /studio (\"Tự ráp Nook\", đang hoàn thiện), /about và chatbot tư vấn. USP (unique selling proposition, lợi điểm bán hàng độc nhất): [CẦN BỔ SUNG: 1 câu USP chính thức]."));
C.push(P("Website được xây dựng ban đầu trên **WordPress/WooCommerce** (bản V3.2), sau đó nhóm chuyển sang **Next.js** triển khai trên Vercel để làm việc theo nhánh và xem trước từng thay đổi trước khi đưa lên bản chính. Kỳ đo 01 đến 25/10/2026 chạy trên bản Next.js [CẦN BỔ SUNG: ngày chuyển đổi chính thức]."));
C.push(H2("1.4 Khách hàng mục tiêu"));
C.push(CAP("Bảng 3. Persona khách hàng mục tiêu"));
C.push(table([1.6, 6], ["Thuộc tính", "Mô tả"], [
  ["Ai", "[CẦN BỔ SUNG: độ tuổi, nghề nghiệp, khu vực]. Giả định của nhóm: người trẻ 20 đến 30 tuổi tại thành phố lớn, thích đồ décor có câu chuyện, mua cho bản thân hoặc làm quà"],
  ["Cần gì", "Món quà hoặc vật trang trí mang dấu ấn Việt, có trải nghiệm tự tay làm; cần biết độ khó, thời gian lắp, chi phí và thời gian giao hàng trước khi chi khoảng 750.000đ đến 1.100.000đ"],
  ["Thiết bị", "Mobile là chính: 65,8% sessions (Bảng 8)"],
  ["Kênh tìm đến", "Tìm kiếm Google, mạng xã hội (Facebook, Instagram, TikTok), truy cập trực tiếp (Bảng 7)"],
]));
C.push(SRC("Nguồn: nhóm tổng hợp; dòng \"Ai\" là giả định suy từ định vị sản phẩm, chưa có khảo sát khách hàng; dòng Thiết bị và Kênh lấy từ GA4."));

// ============ 2. DỮ LIỆU & PHƯƠNG PHÁP ============
C.push(H1("2. Dữ liệu & phương pháp"));
C.push(H2("2.1 Công cụ"));
C.push(CAP("Bảng 4. Công cụ thu thập dữ liệu"));
C.push(table([2.6, 6], ["Công cụ", "Dùng để đo gì"], [
  ["Google Analytics 4 (GA4), property của nookky.shop", "Sessions, users, engagement, kênh nguồn, thiết bị, landing page, lượt xem trang và 24 nhóm sự kiện, gồm sự kiện thương mại điện tử (view_item_list, select_item, view_item, add_to_cart, view_cart, begin_checkout, purchase) và sự kiện tương tác (hero_primary_click, chat_open, spotlight_gallery_change...)"],
  ["Order log (Google Sheet do backend ghi)", "Số đơn theo order_id duy nhất, giá trị đơn, trạng thái thu tiền (đã thu, chờ xác nhận, hủy)"],
  ["Rà soát giao diện và mã nguồn website", "Đối chiếu số liệu với thành phần giao diện thực tế (nút, liên kết, form) và cách gắn tracking"],
]));
C.push(SRC("Nguồn: nhóm tổng hợp. Nhóm chỉ dùng GA4 làm công cụ đo hành vi; không dùng heatmap hay công cụ đo tốc độ tải trang."));
C.push(H2("2.2 Thời gian thu thập"));
C.push(CAP("Bảng 5. Các giai đoạn thu thập dữ liệu"));
C.push(table([3, 3.2, 3], ["Giai đoạn", "Kỳ đo", "Mục đích"], [
  ["1. Baseline (trước thay đổi)", "01/10 đến 25/10/2026 (25 ngày)", "Số liệu cho Phần 3"],
  ["2. Triển khai 3 thay đổi", "[CẦN BỔ SUNG: ngày]", "Phần 4"],
  ["3. Đo lại (sau thay đổi)", "[CẦN BỔ SUNG: tối thiểu 14 ngày]", "Phần 5"],
]));
C.push(SRC("Múi giờ Asia/Ho_Chi_Minh (GMT+7); đơn vị tiền VND; quy ước số: dấu chấm phân tách hàng nghìn, dấu phẩy thập phân."));
C.push(H2("2.3 Cách thức thu thập, cỡ mẫu và phương pháp phân tích"));
C.push(P("Dữ liệu là **traffic thật** đến nookky.shop, gồm traffic tự nhiên (tìm kiếm, mạng xã hội, truy cập trực tiếp, giới thiệu, email) và traffic quảng cáo trả phí trên Facebook, TikTok (Paid Social). Nhóm xuất báo cáo GA4 (Acquisition, Engagement, Pages and screens, Landing page, Tech, Events, Funnel exploration) và đối chiếu với order log. **Cỡ mẫu:** 3.284 sessions, 2.086 users, 52 đơn đặt hàng. Số liệu chỉ tính hành vi trên website, không gồm lượt hiển thị hay tương tác trong ứng dụng mạng xã hội. [CẦN BỔ SUNG: có lọc traffic nội bộ không; chi phí quảng cáo nếu có]."));
C.push(P("**Phương pháp phân tích:** (1) mô tả theo 4 mảng Traffic, Phiên truy cập, Luồng di chuyển, Điểm nghẽn; (2) tính tỉ lệ đi tiếp và tỉ lệ rớt giữa các bước phễu theo công thức tỉ lệ rớt = 1 - bước sau / bước trước; (3) kiểm định hai tỉ lệ (two-proportion z-test) và khoảng tin cậy 95% (Wilson) khi so sánh kênh, thiết bị, để phân biệt chênh lệch thật với dao động ngẫu nhiên; (4) đối chiếu từng điểm rớt với giao diện thực tế để đặt giả thuyết nguyên nhân. Báo cáo phân biệt rõ **số liệu thực đo**, **suy luận** và **giả thuyết cần kiểm chứng**."));
C.push(H2("2.4 Kiểm soát chất lượng dữ liệu"));
C.push(P("Các tổng chính đã được đối chiếu chéo và khớp: sessions theo kênh, theo tuần, theo thiết bị đều bằng 3.284; tổng đơn theo kênh và theo trạng thái đều bằng 52; giá trị đơn 51.293.000 - 1.650.000 + 1.080.000 = 50.723.000đ. Nhóm ghi nhận 5 điểm cần thận trọng khi đọc số:"));
C.push(CAP("Bảng 6. Vấn đề chất lượng dữ liệu và cách xử lý"));
C.push(table([0.4, 2.2, 3.6, 2.8], ["#", "Vấn đề", "Bằng chứng", "Cách xử lý trong báo cáo"], [
  ["1", "purchase cao hơn số đơn thật", "57 sự kiện purchase so với 52 order_id (lệch 5, tức 9,6%); code gửi purchase ngay khi gửi yêu cầu ghi đơn, không chờ server xác nhận", "Dùng order_id trong order log làm số đơn"],
  ["2", "Dữ liệu cá nhân (PII) trong sự kiện GA4", "Payload purchase chứa email, số điện thoại, họ tên và được đẩy nguyên vào gtag", "Ghi nhận rủi ro vi phạm chính sách GA4; đề xuất sửa (mục 5.3)"],
  ["3", "\"Đã thanh toán\" do khách tự báo", "36 payment_reported so với 35 đơn đã xác nhận thu tiền", "Dùng trạng thái thu tiền đã đối soát"],
  ["4", "Lượt xem /studio thấp hơn số click dẫn đến /studio", "hero_secondary_click 289 lượt nhưng /studio chỉ có 116 lượt xem", "Chưa rõ nguyên nhân; không dùng tỉ lệ click sang Studio"],
  ["5", "Có traffic đến /blog dù website không có trang này", "/blog: 32 landing sessions, 149 lượt xem", "[CẦN BỔ SUNG: xác nhận nguồn, có thể là URL cũ từ bản WordPress]; loại khỏi phân tích luồng"],
]));
C.push(SRC("Nguồn: GA4, order log, rà soát mã nguồn website ngày 26/10/2026."));

// ============ 3. PHÁT HIỆN CHÍNH ============
C.push(H1("3. Phát hiện chính"));
C.push(P("Phần này trình bày 4 mảng phân tích theo cùng một khuôn: số liệu, nhận xét, kết luận. Toàn bộ số liệu thuộc kỳ 01 đến 25/10/2026."));

// 3.1 Traffic
C.push(H2("3.1 Traffic"));
C.push(H3("Số liệu"));
C.push(CAP("Bảng 7. Traffic và kết quả theo kênh"));
C.push(table([2.4, 1.1, 1, 1.2, 0.9, 1.3, 1.6], ["Kênh", "Sessions", "Tỉ trọng", "Engagement rate", "Đơn đặt", "Đặt đơn/ session", "Đã thu (VND)"], [
  ["Direct (trực tiếp)", "972", "29,6%", "57,1%", "12", "1,23%", "8.050.000"],
  ["Organic Search (tìm kiếm)", "820", "25,0%", "71,8%", "19", "2,32%", "12.680.000"],
  ["Organic Social (MXH tự nhiên)", "650", "19,8%", "54,6%", "7", "1,08%", "3.399.000"],
  ["Paid Social (quảng cáo MXH)", "483", "14,7%", "52,0%", "8", "1,66%", "4.749.000"],
  ["Referral (giới thiệu)", "205", "6,2%", "62,4%", "3", "1,46%", "2.845.000"],
  ["Email", "96", "2,9%", "81,2%", "3", "3,13%", "1.690.000"],
  ["Unassigned", "58", "1,8%", "48,3%", "0", "0%", "0"],
  ["Tổng", "3.284", "100%", "60,4%", "52", "1,58%", "33.413.000"],
], { num: [1, 2, 3, 4, 5, 6], totalLast: true, hl: (r) => r[0].startsWith("Organic Search") }));
C.push(SRC("Nguồn: GA4 Traffic acquisition; đơn và doanh thu từ order log. Engagement rate (ER, tỷ lệ phiên có tương tác) = engaged sessions / sessions. Đặt đơn/session = đơn đặt / sessions."));
C.push(...figure("h2_kenh.png", "Hình 1. Sessions và tỉ lệ đặt đơn theo kênh", "Nguồn: GA4 và order log, 01 đến 25/10/2026. Đường đứt nét là tỉ lệ trung bình toàn website (1,58%)."));
C.push(CAP("Bảng 8. Traffic theo thiết bị"));
C.push(table([1.6, 1.2, 1.1, 1, 1, 1.6, 1.9], ["Thiết bị", "Sessions", "Tỉ trọng", "ER", "Đơn đặt", "Đặt đơn/ session", "Thu tiền/đơn"], [
  ["Mobile", "2.161", "65,8%", "55,8%", "31", "1,43%", "58,1% (18/31)"],
  ["Desktop", "1.098", "33,4%", "69,8%", "20", "1,82%", "80,0% (16/20)"],
  ["Tablet", "25", "0,8%", "52,0%", "1", "4,00%", "100% (1/1)"],
  ["Tổng", "3.284", "100%", "60,4%", "52", "1,58%", "67,3% (35/52)"],
], { num: [1, 2, 3, 4, 5, 6], totalLast: true }));
C.push(SRC("Nguồn: GA4 Tech và order log."));
C.push(...figure("h3_thietbi.png", "Hình 2. So sánh Mobile và Desktop", "Nguồn: GA4 và order log. Tablet (25 sessions) không đưa vào biểu đồ vì mẫu quá nhỏ."));
C.push(CAP("Bảng 9. Xu hướng theo tuần"));
C.push(table([2.2, 1.2, 1.5, 1, 1.1, 1.2], ["Kỳ", "Sessions", "Sessions/ngày", "ER", "Đơn đặt", "Đơn/ngày"], [
  ["01 đến 07/10", "709", "101,3", "58,7%", "9", "1,29"],
  ["08 đến 14/10", "867", "123,9", "59,1%", "13", "1,86"],
  ["15 đến 21/10", "1.035", "147,9", "62,8%", "19", "2,71"],
  ["22 đến 25/10 (4 ngày)", "673", "168,3", "60,3%", "11", "2,75"],
], { num: [1, 2, 3, 4, 5] }));
C.push(SRC("Nguồn: GA4 và order log. Sessions/ngày = sessions / số ngày của kỳ; kỳ cuối chỉ có 4 ngày nên so theo trung bình ngày."));
C.push(...figure("h1_tuan.png", "Hình 3. Sessions và đơn đặt trung bình mỗi ngày theo tuần", "Nguồn: GA4 và order log, 01 đến 25/10/2026."));
C.push(H3("Nhận xét"));
C.push(B("**Traffic tăng đều:** sessions trung bình ngày tăng từ 101,3 lên 168,3 (+66%), đơn trung bình ngày từ 1,29 lên 2,75. ER giữ ổn định quanh 59% đến 63%, nghĩa là traffic tăng mà chất lượng không giảm."));
C.push(B("**Organic Search là kênh chất lượng nhất:** chiếm 25,0% sessions nhưng mang về 36,5% số đơn (19/52). ER 71,8% (khoảng tin cậy 95%: 68,7% đến 74,8%) cao hơn Direct 57,1% (54,0% đến 60,2%); khác biệt có ý nghĩa thống kê (z = 6,47, p < 0,001). Tỉ lệ đặt đơn của Search (2,32%) gần gấp đôi Direct (1,23%), nhưng với 19 và 12 đơn thì khác biệt này **chưa có ý nghĩa thống kê** (p = 0,08)."));
C.push(B("**Mạng xã hội nhiều traffic nhưng chuyển đổi thấp:** Organic Social và Paid Social cộng lại 1.133 sessions (34,5%) nhưng chỉ 15 đơn (1,32%) và có ER thấp nhất trong các kênh lớn (52,0% đến 54,6%). Chưa có chi phí quảng cáo nên chưa tính được ROAS (return on ad spend, doanh thu trên chi phí quảng cáo)."));
C.push(B("**Email có hiệu quả cao nhất trên mẫu nhỏ:** ER 81,2%, tỉ lệ đặt đơn 3,13%, nhưng chỉ 96 sessions và 3 đơn; cần theo dõi thêm trước khi kết luận."));
C.push(B("**Mobile là thiết bị chính nhưng tương tác kém:** 65,8% sessions đến từ mobile, ER thấp hơn desktop 14 điểm phần trăm (55,8% so với 69,8%, p < 0,001). Tỉ lệ đặt đơn trên mobile thấp hơn (1,43% so với 1,82%) nhưng chênh lệch chưa có ý nghĩa thống kê (p = 0,40)."));
C.push(KET("Traffic tăng đều và phần lớn đến từ mobile, nhưng Organic Search mới là kênh mang lại khách chất lượng nhất (ER 71,8%, 36,5% số đơn), còn mobile tương tác kém hơn desktop rõ rệt (55,8% so với 69,8%)."));

// 3.2 Sessions
C.push(H2("3.2 Phiên truy cập (Sessions)"));
C.push(H3("Số liệu"));
C.push(CAP("Bảng 10. Chỉ số phiên truy cập"));
C.push(table([3.6, 2.2, 3.2], ["Chỉ số", "Giá trị", "Cách tính"], [
  ["Sessions", "3.284", "GA4"],
  ["Total users / New users / Returning users", "2.086 / 1.762 / 324", "Returning = 15,5% users (324 / 2.086)"],
  ["Sessions/user", "1,57", "3.284 / 2.086"],
  ["Engaged sessions / Engagement rate", "1.984 / 60,4%", "1.984 / 3.284"],
  ["Page views / Views per session", "9.320 / 2,84", "9.320 / 3.284"],
  ["Thời gian tương tác trung bình", "1 phút 42 giây", "Mỗi session"],
  ["Events/session", "9,12", "29.945 / 3.284"],
], { num: [1] }));
C.push(SRC("Nguồn: GA4, 01 đến 25/10/2026."));
C.push(CAP("Bảng 11. Tương tác trong phiên (event count)"));
C.push(table([2.6, 4.4, 2], ["Nhóm hành vi", "Sự kiện", "Lượt"], [
  ["Xem ảnh sản phẩm", "spotlight_gallery_change / spotlight_zoom_open", "542 / 163"],
  ["Khám phá danh mục", "place_select / shop_filter_click / featured_product_click", "362 / 268 / 199"],
  ["Tư vấn", "chat_open / chat_message_sent", "144 / 237"],
  ["Đăng ký, liên hệ", "newsletter_subscribe", "31"],
], { num: [2] }));
C.push(SRC("Nguồn: GA4 Events. Event count là số lần sự kiện được ghi nhận, có thể lặp trong một phiên."));
C.push(H3("Nhận xét"));
C.push(B("Một phiên trung bình xem **2,84 trang** và tương tác **1 phút 42 giây**. Với sản phẩm ở mức giá khoảng 900.000đ, mức này đủ để xem 1 đến 2 sản phẩm nhưng chưa đủ để so sánh nhiều mẫu và đọc hết thông tin lắp ráp."));
C.push(B("Người dùng mới chiếm **84,5%** (1.762 / 2.086), quay lại chỉ **15,5%**, trung bình 1,57 phiên mỗi người. Sản phẩm giá cao thường cần nhiều lần ghé trước khi mua, nên phần lớn khách chỉ có một cơ hội để được thuyết phục."));
C.push(B("**Nhu cầu thông tin trước khi mua thể hiện rõ:** 542 lượt đổi ảnh, 163 lượt phóng to ảnh và 237 tin nhắn gửi chatbot. Đây là tín hiệu (chưa phải kết luận) cho thấy người dùng phải tự tìm thêm thông tin mà trang sản phẩm chưa trả lời ngay."));
C.push(KET("Phiên truy cập có tương tác ở mức khá (ER 60,4%, 2,84 trang/phiên) nhưng chủ yếu là khách mới (84,5%), và người dùng phải chủ động tìm thêm thông tin sản phẩm qua ảnh và chatbot."));

// 3.3 Flow
C.push(H2("3.3 Luồng di chuyển (User flow)"));
C.push(H3("Số liệu"));
C.push(CAP("Bảng 12. Landing page và lượt xem theo trang"));
C.push(table([3.4, 1.6, 1.4, 1.6], ["Trang", "Landing sessions", "Tỉ trọng landing", "Page views"], [
  ["/ (trang chủ)", "1.390", "42,3%", "2.605"],
  ["/shop", "671", "20,4%", "1.770"],
  ["/collections", "245", "7,5%", "901"],
  ["6 trang /product/[slug]", "710", "21,6%", "2.794"],
  ["/about", "108", "3,3%", "180"],
  ["/studio", "71", "2,2%", "116"],
  ["/cart", "21", "0,6%", "401"],
  ["/checkout (/payment, /success)", "9", "0,3%", "221 (73, 54)"],
  ["/blog và URL khác", "59", "1,8%", "205"],
  ["Tổng", "3.284", "100%", "9.320"],
], { num: [1, 2, 3], totalLast: true }));
C.push(SRC("Nguồn: GA4 Landing page, Pages and screens. Landing sessions và page views là hai phép đo khác nhau, không chia cho nhau."));
C.push(CAP("Bảng 13. Sự kiện điều hướng từ trang chủ"));
C.push(table([4.8, 1.4, 2.6], ["Sự kiện", "Lượt", "So với page views trang chủ"], [
  ["hero_primary_click (nút \"Khám phá bộ sưu tập →\")", "574", "22,0%"],
  ["hero_secondary_click (nút \"Tự ráp Nook (Studio)\")", "289", "11,1%"],
  ["featured_product_click (mẫu nổi bật)", "199", "7,6%"],
], { num: [1, 2] }));
C.push(SRC("Nguồn: GA4 Events. Tỉ lệ = lượt sự kiện / 2.605 page views trang chủ; tỉ lệ theo lượt, không theo người dùng."));
C.push(P("**Đối chiếu giao diện (rà soát mã nguồn):** nút CTA (call to action, lời kêu gọi hành động) chính của Hero trỏ đến neo #shop-all, nhưng trang chủ không có khối nào mang định danh này. Khi bấm, sự kiện hero_primary_click vẫn được ghi nhận nhưng trang không cuộn và không chuyển trang."));
C.push(H3("Nhận xét"));
C.push(B("**Trang chủ là cửa vào chính:** 42,3% sessions bắt đầu tại đây. Cửa vào lớn thứ hai là các trang mua sắm (/shop 20,4% và PDP 21,6%), chủ yếu từ tìm kiếm và link quảng cáo dẫn thẳng đến sản phẩm."));
C.push(B("**Nút được bấm nhiều nhất trang chủ không dẫn đi đâu:** CTA chính có 574 lượt bấm, gấp 2 lần nút phụ. Vì nút trỏ đến neo không tồn tại, người dùng phải tự tìm menu \"Sản phẩm\" hoặc cuộn đến khối mẫu nổi bật. Đây là chỗ đứt gãy lớn nhất của luồng Trang chủ → Danh mục. Nhóm không khẳng định cả 574 lượt đều bị mất hẳn, vì một phần người dùng có thể tự tìm đường."));
C.push(B("**Luồng mua sắm chính là /shop → PDP:** 1.770 lượt xem /shop và 2.794 lượt xem PDP. Mẫu Hội An dẫn đầu (845 lượt xem PDP), mẫu Miền Tây thấp nhất (198)."));
C.push(B("**Studio quy mô nhỏ:** /studio chỉ chiếm 1,2% lượt xem (116 / 9.320). Trang đang thông báo \"đang hoàn thiện\" và không có liên kết đi tiếp, nhưng tác động lên toàn website nhỏ nên không đưa vào nhóm thay đổi ưu tiên."));
C.push(KET("Luồng di chuyển tập trung qua trang chủ (42,3% landing), nhưng nút được bấm nhiều nhất ở đó (574 lượt) không dẫn đến đâu, làm đứt lối đi chính từ trang chủ sang danh mục sản phẩm."));

// 3.4 Bottlenecks
C.push(H2("3.4 Điểm nghẽn (Bottlenecks)"));
C.push(H3("Số liệu"));
C.push(CAP("Bảng 14. Phễu mua hàng"));
C.push(table([2.8, 1.2, 1.6, 1.8, 1.6], ["Bước", "Số lượng", "Đi tiếp so với bước trước", "Tỉ lệ rớt", "So với tổng sessions"], [
  ["1. Truy cập (sessions)", "3.284", "", "", "100%"],
  ["2. Xem danh mục (view_item_list)", "1.976", "60,2%", "39,8%", "60,2%"],
  ["3. Xem chi tiết (view_item)", "1.461", "73,9%", "26,1%", "44,5%"],
  ["4. Thêm giỏ (add_to_cart)", "267", "18,3%", "81,7%", "8,1%"],
  ["5. Xem giỏ (view_cart)", "239", "89,5%", "10,5%", "7,3%"],
  ["6. Bắt đầu checkout (begin_checkout)", "148", "61,9%", "38,1%", "4,5%"],
  ["7. Đặt đơn thành công (order_id)", "52", "35,1%", "64,9%", "1,6%"],
  ["8. Đã xác nhận thu tiền (đơn)", "35", "67,3%", "32,7%", "1,1%"],
], { num: [1, 2, 3, 4], hl: (r) => r[0].startsWith("4.") || r[0].startsWith("7.") }));
C.push(SRC("Nguồn: GA4 (bước 1 đến 6: số sessions có ít nhất 1 lần phát sinh sự kiện) và order log (bước 7, 8: số đơn). Tỉ lệ rớt = 1 - bước sau / bước trước. Hai dòng tô màu là hai điểm nghẽn lớn nhất."));
C.push(...figure("h5_pheu.png", "Hình 4. Phễu mua hàng 8 bước", "Nguồn: GA4 và order log, 01 đến 25/10/2026. Màu cam đánh dấu hai bước có tỉ lệ đi tiếp thấp nhất."));
C.push(CAP("Bảng 15. Tỉ lệ thêm giỏ theo sản phẩm"));
C.push(table([3.4, 1.3, 1.4, 1.9, 1.4], ["Sản phẩm", "view_item", "add_to_cart", "add_to_cart / view_item", "Sản phẩm đặt"], [
  ["Phố Vừa Lên Đèn (Hội An)", "845", "112", "13,3%", "14"],
  ["Sáng Trên Phố Cũ (Hà Nội)", "623", "76", "12,2%", "11"],
  ["Mưa Qua Sân Gạch (Huế)", "485", "57", "11,8%", "10"],
  ["Hẻm Còn Sáng Đèn (Sài Gòn)", "337", "38", "11,3%", "8"],
  ["Đèn Ấm Trên Dốc (Đà Lạt)", "306", "30", "9,8%", "8"],
  ["Sông Vừa Thức Giấc (Miền Tây)", "198", "15", "7,6%", "6"],
  ["Tổng", "2.794", "328", "11,7%", "57"],
], { num: [1, 2, 3, 4], totalLast: true }));
C.push(SRC("Nguồn: GA4 và order log. Tỉ lệ tính theo lượt sự kiện, khác tỉ lệ theo session ở Bảng 14. 57 sản phẩm thuộc 52 đơn."));
C.push(...figure("h6_sanpham.png", "Hình 5. Lượt xem và tỉ lệ thêm giỏ theo sản phẩm", "Nguồn: GA4. Đường đứt nét là tỉ lệ trung bình 6 sản phẩm (11,7%)."));
C.push(P("**Đối chiếu giao diện (rà soát mã nguồn):**"));
C.push(B("Khu vực mua cạnh nút \"Thêm vào giỏ\" ở PDP hiển thị độ khó, thời gian lắp, số mảnh, LED, giá và dòng \"Miễn phí vận chuyển cho đơn từ 1.000.000₫\". Khu vực này **chưa có** thời gian giao hàng, phương thức thanh toán (có COD) hay chính sách đổi trả. Trong 6 mẫu, chỉ mẫu Sài Gòn (1.099.000đ) đạt ngưỡng miễn phí giao hàng khi mua 1 hộp."));
C.push(B("Trên mobile, nút \"Thêm vào giỏ\" nằm ở đầu trang; khi người dùng cuộn xuống các phần câu chuyện, chi tiết, lắp ráp, nút này không còn trong tầm nhìn."));
C.push(B("Form checkout hiển thị cùng lúc 7 trường (họ tên, số điện thoại, email, tỉnh/thành, quận/huyện, địa chỉ, ghi chú), trong đó chỉ 4 trường bắt buộc."));
C.push(H3("Nhận xét"));
C.push(B("**Điểm nghẽn lớn nhất là bước xem chi tiết sang thêm giỏ:** 1.461 sessions xem sản phẩm nhưng chỉ 267 sessions thêm giỏ (18,3%, khoảng tin cậy 95%: 16,4% đến 20,3%), tức 81,7% phiên rời đi sau khi xem sản phẩm. Mẫu thấp nhất (Miền Tây) chỉ 7,6% lượt thêm giỏ trên lượt xem. Kết hợp với 542 lượt đổi ảnh và 237 tin nhắn chatbot, giả thuyết của nhóm là khu vực mua chưa trả lời đủ các câu hỏi chốt đơn (giao bao lâu, có COD không, đổi trả thế nào)."));
C.push(B("**Điểm nghẽn thứ hai là checkout:** 148 sessions bắt đầu nhưng chỉ 52 đơn (35,1%, khoảng tin cậy 95%: 27,9% đến 43,1%), rớt 64,9%. Vì 65,8% traffic là mobile, form 7 trường hiển thị cùng lúc là một ứng viên nguyên nhân (giả thuyết)."));
C.push(B("**Sau khi đặt:** 67,3% đơn đã thu tiền (33.413.000đ); 12 đơn (23,1%, 12.010.000đ) đang chờ xác nhận hoặc giao COD; 5 đơn (9,6%) hủy. Tỉ lệ thu tiền trên mobile (58,1%) thấp hơn desktop (80,0%) nhưng chưa có ý nghĩa thống kê (p = 0,10)."));
C.push(B("Các bước xem danh mục sang xem chi tiết (73,9%) và giỏ hàng sang checkout (61,9%) hoạt động tương đối tốt, nên không phải ưu tiên."));
C.push(KET("Điểm nghẽn lớn nhất của phễu là bước từ trang sản phẩm sang thêm giỏ (rớt 81,7%), tiếp theo là bước từ bắt đầu checkout sang đặt đơn thành công (rớt 64,9%)."));

C.push(H2("3.5 Liên kết 4 mảng: nguyên nhân gốc"));
C.push(P("Bốn mảng cùng chỉ về một vấn đề: **website kéo được người xem nhưng làm rơi họ ở các điểm chuyển sang hành động.** Traffic tăng đều (+66% sessions/ngày) và 65,8% đến từ mobile, nơi ER thấp hơn desktop 14 điểm phần trăm. Phiên chủ yếu là khách mới (84,5%) với khoảng 2,84 trang, nên mỗi lần ghé cần dẫn khách đến sản phẩm nhanh và trả lời đủ câu hỏi ngay tại chỗ. Thực tế có ba chỗ đứt gãy:"));
C.push(N("Ở **trang chủ**, nút được bấm nhiều nhất (574 lượt) không dẫn đến danh mục."));
C.push(N("Ở **PDP**, khu vực mua thiếu thông tin giao hàng, thanh toán, đổi trả, và nút thêm giỏ ra khỏi tầm nhìn khi cuộn trên mobile; trùng với điểm rớt 81,7%."));
C.push(N("Ở **checkout**, 7 trường hiển thị cùng lúc trên màn hình nhỏ; trùng với điểm rớt 64,9%."));
C.push(P("Organic Search có kết quả tốt nhất có thể vì người tìm kiếm đã có ý định mua rõ ràng nên ít bị ảnh hưởng bởi các chỗ đứt gãy này (giả thuyết). Ba chỗ đứt gãy trên là cơ sở cho 3 thay đổi ở Phần 4."));

// ============ 4. ĐỀ XUẤT ============
C.push(H1("4. Đề xuất & thay đổi đã thực hiện"));
C.push(P("Ba thay đổi nhắm vào **ba bước khác nhau** của luồng, nên có thể đo tác động riêng từng thay đổi mà không lẫn vào nhau. Thứ tự theo ma trận tác động/công sức: tác động cao, công sức thấp lên trước."));
C.push(CAP("Bảng 16. Thứ tự ưu tiên các thay đổi"));
C.push(table([0.4, 2.8, 1.2, 2, 0.9, 1, 1.6], ["#", "Thay đổi", "Trang", "Bước nhắm tới", "Tác động", "Công sức", "Trạng thái"], [
  ["1", "Sửa CTA chính ở Hero", "Trang chủ", "Trang chủ → danh mục", "Cao", "Thấp", "[CẦN BỔ SUNG: ngày]"],
  ["2", "Thông tin chốt đơn và thanh \"Thêm vào giỏ\" cố định trên mobile", "6 PDP", "Xem chi tiết → thêm giỏ", "Cao", "Trung bình", "[CẦN BỔ SUNG: ngày]"],
  ["3", "Thu gọn form checkout còn 4 trường bắt buộc", "/checkout", "Bắt đầu checkout → đặt đơn", "Trung bình", "Trung bình", "[CẦN BỔ SUNG: ngày]"],
]));
C.push(SRC("Nguồn: nhóm đánh giá dựa trên Phần 3."));

C.push(H2("4.1 Thay đổi 1: Sửa nút CTA chính ở Hero trang chủ"));
C.push(P("**(1) Vấn đề phát hiện từ dữ liệu.** Trang chủ là cửa vào của 42,3% sessions (1.390) và có 2.605 lượt xem (mục 3.3, Bảng 12). Nút \"Khám phá bộ sưu tập →\" được bấm 574 lượt (22,0% lượt xem trang chủ), nhiều nhất trang (Bảng 13), nhưng trỏ đến neo #shop-all không tồn tại nên không dẫn người dùng đến danh mục."));
C.push(P("**(2) Nội dung thay đổi.** Khối Hero trên trang chủ: đổi đích của nút chính từ #shop-all sang trang /shop; giữ sự kiện hero_primary_click và thêm tham số đích đến để đo. [CẦN BỔ SUNG: xác nhận nội dung đã làm]"));
C.push(P("**(3) Ảnh Trước-Sau.**"));
C.push(...beforeAfter("Hình 6. Nút CTA chính ở Hero trước và sau khi sửa", "Chụp Hero trang chủ nookky.shop trên mobile 390px; chụp kèm thanh địa chỉ sau khi bấm nút: URL chỉ đổi thành /#shop-all, trang đứng yên.", "Chụp cùng vị trí; sau khi bấm nút, trang /shop với 6 sản phẩm mở ra.", "Chú thích: sau thay đổi, nút CTA chính dẫn thẳng người dùng đến danh mục sản phẩm."));
C.push(P("**(4) Lý do dựa trên dữ liệu.** Đây là nút có nhu cầu bấm cao nhất trên trang có lượng vào lớn nhất; mỗi lượt bấm hiện là một lượt không được dẫn đến sản phẩm. Công sửa gần như bằng 0 và rủi ro thấp. **Chỉ số kỳ vọng cải thiện:** tỉ lệ session landing trang chủ có view_item_list; lượt xem /shop có trang trước là trang chủ."));

C.push(H2("4.2 Thay đổi 2: Bổ sung thông tin chốt đơn và thanh \"Thêm vào giỏ\" cố định trên mobile"));
C.push(P("**(1) Vấn đề phát hiện từ dữ liệu.** Bước xem chi tiết sang thêm giỏ có tỉ lệ rớt cao nhất phễu: 81,7% (chỉ 267 / 1.461 sessions thêm giỏ, mục 3.4, Bảng 14); từng sản phẩm chỉ đạt 7,6% đến 13,3% lượt thêm giỏ trên lượt xem (Bảng 15). Mobile chiếm 65,8% sessions với ER 55,8%, thấp hơn desktop 69,8% (mục 3.1). Người dùng tìm thêm thông tin qua 542 lượt đổi ảnh và 237 tin nhắn chatbot (mục 3.2). Khu vực mua hiện chưa có thời gian giao, phương thức thanh toán và chính sách đổi trả."));
C.push(P("**(2) Nội dung thay đổi.** Trên 6 trang /product/[slug]: (a) thêm khối 3 dòng ngay dưới nút \"Thêm vào giỏ\": thời gian giao dự kiến; \"Thanh toán khi nhận hàng (COD), chuyển khoản, MoMo, ZaloPay\"; chính sách đổi trả hoặc hỗ trợ thiếu mảnh [CẦN BỔ SUNG: chính sách thực tế của shop]; (b) trên mobile, thêm thanh cố định ở đáy màn hình gồm tên, giá và nút \"Thêm vào giỏ\", xuất hiện khi khu vực mua đã cuộn khỏi màn hình. [CẦN BỔ SUNG: xác nhận nội dung đã làm]"));
C.push(P("**(3) Ảnh Trước-Sau.**"));
C.push(...beforeAfter("Hình 7. Khu vực mua và thanh thêm giỏ trên PDP mobile trước và sau thay đổi", "Chụp /product/pho-vua-len-den-hoi-an trên mobile 390px: (a) khu vực mua chỉ có độ khó, thời gian lắp, giá; (b) màn hình khi cuộn đến phần \"Lắp ráp\": không có nút mua.", "Chụp cùng trang: (a) khu vực mua có thêm khối giao hàng, thanh toán, đổi trả; (b) khi cuộn đến phần \"Lắp ráp\": thanh \"Thêm vào giỏ\" cố định ở đáy.", "Chú thích: chọn mẫu Hội An để chụp vì có lượng xem lớn nhất (845 lượt)."));
C.push(P("**(4) Lý do dựa trên dữ liệu.** Thay đổi nhắm thẳng vào bước rớt lớn nhất (81,7%) và vào thiết bị chiếm 2/3 traffic. Khối thông tin trả lời các câu hỏi chốt đơn mà người dùng hiện phải hỏi qua chatbot; thanh cố định giữ nút mua luôn trong tầm tay khi người dùng đọc thông tin trên màn hình nhỏ. **Chỉ số kỳ vọng cải thiện:** sessions add_to_cart / sessions view_item (hiện 18,3%), tách riêng mobile và desktop; số tin nhắn chatbot hỏi về giao hàng, thanh toán."));

C.push(H2("4.3 Thay đổi 3: Thu gọn form checkout còn 4 trường bắt buộc"));
C.push(P("**(1) Vấn đề phát hiện từ dữ liệu.** 148 sessions bắt đầu checkout nhưng chỉ 52 đơn được đặt thành công (35,1%, rớt 64,9%, mục 3.4, Bảng 14). Form hiển thị cùng lúc 7 trường trong khi chỉ 4 trường bắt buộc (họ tên, số điện thoại, tỉnh/thành, địa chỉ), và 65,8% traffic là mobile."));
C.push(P("**(2) Nội dung thay đổi.** Trên trang /checkout: giữ hiển thị 4 trường bắt buộc; gom email, quận/huyện và ghi chú vào một mục thu gọn \"Thêm thông tin (không bắt buộc)\"; đưa tóm tắt tổng tiền và phí giao hàng lên ngay trên nút đặt hàng trên mobile. [CẦN BỔ SUNG: xác nhận nội dung đã làm]"));
C.push(P("**(3) Ảnh Trước-Sau.**"));
C.push(...beforeAfter("Hình 8. Form checkout trước và sau khi thu gọn", "Chụp toàn trang /checkout trên mobile 390px với 1 sản phẩm trong giỏ: form có 7 trường hiển thị cùng lúc.", "Chụp cùng điều kiện: form chỉ hiện 4 trường bắt buộc, mục \"Thêm thông tin (không bắt buộc)\" thu gọn, tổng tiền nằm ngay trên nút đặt hàng.", "Chú thích: số trường phải nhìn thấy và điền giảm từ 7 xuống 4 mà không mất thông tin bắt buộc để giao hàng."));
C.push(P("**(4) Lý do dựa trên dữ liệu.** Đây là bước rớt lớn thứ hai và là bước cuối trước khi có doanh thu. Giảm số trường hiển thị giảm công sức nhập trên màn hình nhỏ. **Chỉ số kỳ vọng cải thiện:** đơn đặt (order_id) / sessions begin_checkout (hiện 35,1%)."));

// ============ 5. KẾT QUẢ ============
C.push(H1("5. Kết quả kỳ vọng & hạn chế"));
C.push(H2("5.1 Tác động dự kiến và cách đo lại"));
C.push(P("Tại thời điểm viết báo cáo, nhóm **chưa có số liệu sau thay đổi**. Toàn bộ tác động dưới đây là dự kiến, kèm cách đo lại."));
C.push(CAP("Bảng 17. Tác động dự kiến và kế hoạch đo lại"));
C.push(table([1.4, 2.6, 2, 1, 2.6], ["Thay đổi", "Chỉ số chính", "Trước (01 đến 25/10)", "Sau", "Cách đo lại"], [
  ["1. CTA Hero", "Sessions landing trang chủ có view_item_list / sessions landing trang chủ", "[CẦN BỔ SUNG: GA4 Exploration]", "Chưa có", "GA4 Exploration lọc landing page = /, tối thiểu 14 ngày sau triển khai"],
  ["2. PDP", "Sessions add_to_cart / sessions view_item", "18,3% (267 / 1.461); theo thiết bị: [CẦN BỔ SUNG]", "Chưa có", "GA4 Funnel exploration, tách mobile/desktop"],
  ["3. Checkout", "Đơn đặt / sessions begin_checkout", "35,1% (52 / 148)", "Chưa có", "GA4 begin_checkout và order log theo order_id"],
]));
C.push(SRC("Nguồn: GA4 và order log; cột \"Sau\" điền khi có dữ liệu giai đoạn 3."));
C.push(P("**Cỡ mẫu cần thiết.** Với tốc độ hiện tại khoảng 58 sessions/ngày có view_item (1.461 / 25), 14 ngày sẽ cho khoảng 800 sessions. Mức này đủ phát hiện tỉ lệ thêm giỏ tăng từ 18,3% lên khoảng 23% (khoảng 5 điểm phần trăm) với độ tin cậy 95% và power (xác suất phát hiện) 80%, nhưng chưa đủ phát hiện thay đổi nhỏ hơn. Bước checkout chỉ khoảng 6 sessions/ngày nên 14 ngày chỉ đủ quan sát xu hướng, chưa đủ kết luận. **Nguyên tắc so sánh:** cùng độ dài kỳ, ghi lại thay đổi ngân sách quảng cáo và khuyến mãi trong kỳ để không gán nhầm hiệu quả cho thay đổi giao diện."));
C.push(H2("5.2 Hạn chế của đồ án")); NI = 2;
C.push(N("**Thời gian ngắn và chưa đo lại:** baseline 25 ngày; chưa có dữ liệu sau thay đổi. Các bước cuối phễu có cỡ mẫu nhỏ (148 sessions checkout, 52 đơn), nhiều chênh lệch giữa kênh và thiết bị chưa có ý nghĩa thống kê."));
C.push(N("**Sai lệch đo lường:** purchase cao hơn số đơn 9,6%; số click vào nút dẫn đến Studio (289) không khớp lượt xem /studio (116); có traffic đến /blog dù website không có trang này (mục 2.4)."));
C.push(N("**Chưa lọc traffic nội bộ** [CẦN BỔ SUNG: xác nhận]: lượt kiểm thử của nhóm có thể làm méo Direct và ER desktop."));
C.push(N("**Chỉ dùng GA4:** không có heatmap, scroll map hay quan sát người dùng; nguyên nhân rớt phễu là giả thuyết suy từ số liệu kết hợp rà soát giao diện."));
C.push(N("**Yếu tố ngoại cảnh:** traffic tăng dần trong kỳ có thể do quảng cáo, mùa quà tặng 20/10 hoặc nội dung mạng xã hội; so sánh trước và sau không loại trừ được các yếu tố này."));
C.push(N("**Kết luận ở mức tương quan:** chưa có thử nghiệm đối chứng (A/B test)."));
C.push(N("**Thiếu chi phí quảng cáo:** chưa tính được ROAS hay CAC (customer acquisition cost, chi phí có một khách hàng) cho Paid Social."));
C.push(H2("5.3 Hướng phát triển tiếp theo"));
C.push(B("**Sửa đo lường:** chỉ gửi sự kiện đặt hàng sau khi server xác nhận lưu đơn; xóa email, số điện thoại, họ tên khỏi payload GA4; bật lọc traffic nội bộ; kiểm tra nguyên nhân lệch giữa click Studio và lượt xem /studio."));
C.push(B("**A/B test khu vực mua ở PDP trên mobile:** nhánh A chỉ có khối thông tin chốt đơn, nhánh B có thêm thanh thêm giỏ cố định. Chỉ số chính: sessions add_to_cart / sessions view_item trên mobile; chạy đến khi mỗi nhánh đủ khoảng 1.000 sessions có view_item."));
C.push(B("**Tối ưu Paid Social theo dữ liệu sản phẩm:** đưa link quảng cáo về thẳng PDP Hội An và Hà Nội (hai mẫu có lượt xem và tỉ lệ thêm giỏ cao nhất, 13,3% và 12,2%), sau đó so ER và tỉ lệ đặt đơn của Paid Social với mức hiện tại (52,0% và 1,66%). Song song, hoàn thiện /studio với lối đi tiếp sang /shop trước khi tăng traffic vào trang này."));

// ============ PHỤ LỤC ============
C.push(H1("Phụ lục: Danh sách ảnh chụp màn hình cần chèn", true));
C.push(CAP("Bảng 18. Danh sách ảnh chụp màn hình"));
C.push(table([0.9, 4, 4], ["Hình", "Nội dung", "Trang/nguồn cần chụp"], [
  ["Hình 6", "Nút CTA Hero trước và sau", "nookky.shop trang chủ, mobile 390px"],
  ["Hình 7", "Khu vực mua và thanh thêm giỏ cố định trên mobile", "/product/pho-vua-len-den-hoi-an, mobile 390px"],
  ["Hình 8", "Form checkout trước và sau", "/checkout, mobile 390px"],
  ["Hình 9", "GA4 Traffic acquisition (kênh)", "GA4 > Reports > Acquisition > Traffic acquisition"],
  ["Hình 10", "GA4 Pages and screens, Landing page", "GA4 > Reports > Engagement"],
  ["Hình 11", "GA4 Tech > Device category", "GA4 > Reports > Tech > Tech overview"],
  ["Hình 12", "GA4 Events và Funnel exploration", "GA4 > Reports > Engagement > Events; GA4 > Explore > Funnel"],
]));
C.push(SRC("Hình 1 đến Hình 5 là biểu đồ nhóm dựng từ số liệu GA4 và order log, đã có trong bài."));

// ================= DOCUMENT =================
const doc = new Document({
  creator: "Nhóm Nook Ký", title: "Báo cáo cuối kỳ Nook Ký",
  styles: {
    default: { document: { run: { font: FONT, size: SZ } } },
    paragraphStyles: [
      { id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true, run: { font: FONT, size: 32, bold: true, color: "1F4E79" }, paragraph: { spacing: { before: 120, after: 240 }, outlineLevel: 0 } },
      { id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", quickFormat: true, run: { font: FONT, size: 28, bold: true, color: "1F4E79" }, paragraph: { spacing: { before: 240, after: 120 }, outlineLevel: 1, keepNext: true } },
      { id: "Heading3", name: "Heading 3", basedOn: "Normal", next: "Normal", quickFormat: true, run: { font: FONT, size: 26, bold: true, italics: true, color: "404040" }, paragraph: { spacing: { before: 160, after: 80 }, outlineLevel: 2, keepNext: true } },
    ],
  },
  numbering: { config: [
    { reference: "bul", levels: [{ level: 0, format: LevelFormat.BULLET, text: "•", alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 540, hanging: 270 } } } }] },
    { reference: "num", levels: [{ level: 0, format: LevelFormat.DECIMAL, text: "%1.", alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 540, hanging: 360 } } } }] },
  ] },
  features: { updateFields: true },
  sections: [{
    properties: { page: { size: { width: 11906, height: 16838 }, margin: { top: 1134, bottom: 1134, left: 1418, right: 1134 } } },
    headers: { default: new Header({ children: [new Paragraph({ children: [new TextRun({ text: "Báo cáo cuối kỳ: Phân tích và cải thiện website Nook Ký", italics: true, size: 20, color: "7F7F7F" })], alignment: AlignmentType.RIGHT, border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: "BFBFBF", space: 4 } } })] }) },
    footers: { default: new Footer({ children: [new Paragraph({ children: [new TextRun({ text: "Trang ", size: 20 }), new TextRun({ children: [PageNumber.CURRENT], size: 20 }), new TextRun({ text: " / ", size: 20 }), new TextRun({ children: [PageNumber.TOTAL_PAGES], size: 20 })], alignment: AlignmentType.CENTER })] }) },
    children: C,
  }],
});
Packer.toBuffer(doc).then((b) => { fs.writeFileSync(OUT, b); console.log("written", OUT, b.length); });
