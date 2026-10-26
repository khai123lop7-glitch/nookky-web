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
function img(file, wpx, hpx, width = 440, dir = CH) {
  const buf = fs.readFileSync(dir + file);
  const height = Math.round((hpx / wpx) * width);
  return new Paragraph({ children: [new ImageRun({ type: "png", data: buf, transformation: { width, height }, altText: { title: file, description: file, name: file } })], alignment: AlignmentType.CENTER, keepNext: true, spacing: { after: 0 } });
}
function pngSize(file, dir = CH) { const b = fs.readFileSync(dir + file); return [b.readUInt32BE(16), b.readUInt32BE(20)]; }
function figure(file, caption, src, width = 440, dir = CH) { const [w, h] = pngSize(file, dir); return [CAP(caption), img(file, w, h, width, dir), SRC(src)]; }
const SS = "/home/user/nookky-web/docs/report/screenshots/";
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
  new Paragraph({ children: [new TextRun({ text: "THÀNH VIÊN VÀ PHÂN CÔNG VAI TRÒ", bold: true, size: 30 })], alignment: AlignmentType.CENTER, spacing: { after: 200 } }),
  CAP("Bảng 1. Vai trò, trách nhiệm và sản phẩm bàn giao của từng thành viên"),
  table([1.8, 1.1, 1.6, 3.3, 2.6], ["Thành viên", "MSSV", "Vai trò", "Trách nhiệm chính", "Sản phẩm bàn giao"], [
    ["[CẦN BỔ SUNG]", "[CẦN BỔ SUNG]", "Quản trị website", "Xây dựng website (WordPress/WooCommerce, sau chuyển Next.js), gắn GA4, triển khai 3 thay đổi lên website, kiểm thử trước khi đưa lên bản chính", "Website nookky.shop; 3 thay đổi đã triển khai; cấu hình GA4"],
    ["[CẦN BỔ SUNG]", "[CẦN BỔ SUNG]", "Phân tích dữ liệu", "Xuất báo cáo GA4, đối soát order log, tính phễu và kiểm định thống kê, kiểm tra chất lượng dữ liệu", "Phần 3, Bảng 4 đến Bảng 8, Hình 1 đến Hình 4"],
    ["[CẦN BỔ SUNG]", "[CẦN BỔ SUNG]", "Thiết kế giao diện", "Đề xuất phương án cho 3 điểm nghẽn, thiết kế khối thông tin PDP, thanh mua cố định, form checkout; chụp ảnh Trước-Sau", "Phần 4, Hình 5 đến Hình 7"],
    ["[CẦN BỔ SUNG]", "[CẦN BỔ SUNG]", "Viết báo cáo, thuyết trình", "Tổng hợp báo cáo 5 phần, biên tập, làm slide và điều phối thuyết trình", "Báo cáo cuối kỳ; bài thuyết trình"],
  ]),
  SRC("Nguồn: nhóm tự tổng hợp. Mỗi thành viên có thể kiêm nhiều vai trò; ghi rõ tên người phụ trách chính."),
);

// ============ 1. BỐI CẢNH ============
C.push(H1("1. Bối cảnh", true));
C.push(H2("1.1 Ngành hàng và lý do chọn"));
C.push(P("Nook Ký kinh doanh **Book Nook**: mô hình thu nhỏ dạng hộp đặt vừa kệ sách, người mua tự lắp ráp (350 đến 430 mảnh, 6 đến 8 giờ lắp) rồi giữ lại làm vật décor. Đây là nhánh nhỏ trong ngành quà tặng và đồ thủ công DIY (do it yourself, tự làm). Danh mục có 6 SKU (mã sản phẩm), mỗi mẫu tái hiện một nơi chốn Việt Nam, giá từ 749.000đ đến 1.099.000đ (Bảng 2)."));
C.push(CAP("Bảng 2. Danh mục sản phẩm"));
C.push(table([2.6, 1.4, 1.5, 1.5], ["Tên sản phẩm", "Địa danh", "Khu vực", "Giá bán (VND)"], [
  ["Phố Vừa Lên Đèn", "Hội An", "Miền Trung", "899.000"],
  ["Mưa Qua Sân Gạch", "Huế", "Miền Trung", "929.000"],
  ["Sáng Trên Phố Cũ", "Hà Nội", "Miền Bắc", "849.000"],
  ["Hẻm Còn Sáng Đèn", "Sài Gòn", "Miền Nam", "1.099.000"],
  ["Đèn Ấm Trên Dốc", "Đà Lạt", "Miền Nam", "849.000"],
  ["Sông Vừa Thức Giấc", "Miền Tây", "Miền Nam", "749.000"],
], { num: [3] }));
C.push(SRC("Nguồn: dữ liệu sản phẩm trên website, đối chiếu ngày 26/10/2026."));
C.push(P("**Lý do chọn:** [CẦN BỔ SUNG: lý do của nhóm]. Về mặt đồ án, ngành hàng phù hợp để phân tích hành vi vì giá trị đơn cao (AOV, average order value, giá trị đơn trung bình, đạt 975.442đ trong kỳ đo) và quyết định mua cần nhiều hình ảnh, thông tin lắp ráp, nên các điểm rớt trong phễu thể hiện rõ trên dữ liệu."));
C.push(H2("1.2 Định vị website"));
C.push(P("Mô hình bán hàng trực tiếp (D2C, direct to consumer) với thông điệp **\"Bản sắc Việt thu nhỏ\"**: mỗi sản phẩm gắn với ký ức một nơi chốn thay vì chỉ là bộ kit lắp ráp. Website gồm trang chủ dạng kể chuyện, /shop, /collections, 6 trang chi tiết sản phẩm (PDP, product detail page), giỏ hàng, checkout với COD, chuyển khoản, MoMo, ZaloPay, trang /studio (đang hoàn thiện) và chatbot tư vấn. USP (lợi điểm bán hàng độc nhất): [CẦN BỔ SUNG]."));
C.push(P("Website được xây dựng trên **WordPress/WooCommerce** (bản V3.2) theo yêu cầu học phần, sau đó nhóm chuyển giao diện sang **Next.js** trên Vercel để mỗi thay đổi có link xem trước riêng trước khi đưa lên bản chính. Kỳ đo 01 đến 25/10/2026 chạy trên bản Next.js [CẦN BỔ SUNG: ngày chuyển đổi]."));
C.push(H2("1.3 Khách hàng mục tiêu"));
C.push(P("**Persona:** người trẻ 20 đến 30 tuổi tại thành phố lớn, thích đồ décor có câu chuyện, mua cho bản thân hoặc làm quà (giả định của nhóm, [CẦN BỔ SUNG: xác nhận]). Họ cần biết độ khó, thời gian lắp, chi phí và thời gian giao trước khi chi khoảng 750.000đ đến 1.100.000đ. **Thiết bị chính là mobile** (65,8% sessions); kênh tìm đến chủ yếu là truy cập trực tiếp, tìm kiếm Google và mạng xã hội (Bảng 4)."));

// ============ 2. DỮ LIỆU & PHƯƠNG PHÁP ============
C.push(H1("2. Dữ liệu & phương pháp"));
C.push(CAP("Bảng 3. Công cụ, kỳ đo và cách thu thập"));
C.push(table([2.3, 1.9, 4.8], ["Công cụ", "Kỳ đo", "Dùng để đo gì, cách thu thập"], [
  ["Google Analytics 4 (GA4)", "01 đến 25/10/2026", "Sessions, users, engagement, kênh, thiết bị, landing page, lượt xem trang, 24 nhóm sự kiện (gồm phễu view_item_list, view_item, add_to_cart, view_cart, begin_checkout). Xuất từ các báo cáo Acquisition, Engagement, Tech, Events, Funnel exploration"],
  ["Order log (Google Sheet do backend ghi)", "01 đến 25/10/2026", "Số đơn theo order_id duy nhất, giá trị đơn, trạng thái thu tiền; dùng thay sự kiện purchase của GA4 để đếm đơn"],
  ["Tự duyệt web có kịch bản (trình duyệt tự động Playwright, màn hình mobile 390px)", "26/10/2026", "Đi lại 3 luồng chính: trang chủ → danh mục; PDP → thêm giỏ; giỏ → checkout. Ghi nhận hành vi thực của từng nút, số trường form, vị trí nút mua khi cuộn; chụp ảnh Trước-Sau"],
  ["Rà soát mã nguồn website", "26/10/2026", "Đối chiếu sự kiện GA4 với cách gắn tracking và thành phần giao diện"],
]));
C.push(SRC("Nguồn: nhóm tổng hợp. Không dùng heatmap hay công cụ đo tốc độ tải trang."));
C.push(P("**Cỡ mẫu:** 3.284 sessions, 2.086 users, 52 đơn đặt hàng; toàn bộ là traffic thật, gồm traffic tự nhiên và quảng cáo trả phí trên Facebook, TikTok. Số liệu chỉ tính hành vi trên website. [CẦN BỔ SUNG: có lọc traffic nội bộ không; chi phí quảng cáo]."));
C.push(P("**Phương pháp phân tích:** (1) mô tả theo 4 mảng Traffic, Phiên truy cập, Luồng di chuyển, Điểm nghẽn; (2) tính tỉ lệ đi tiếp giữa các bước phễu, tỉ lệ rớt = 1 - bước sau / bước trước; (3) kiểm định hai tỉ lệ (two-proportion z-test) và khoảng tin cậy 95% (Wilson) khi so sánh kênh, thiết bị; (4) đối chiếu từng điểm rớt với kết quả tự duyệt web để đặt giả thuyết nguyên nhân. Báo cáo phân biệt **số liệu thực đo**, **suy luận** và **giả thuyết cần kiểm chứng**."));
C.push(P("**Kiểm soát chất lượng dữ liệu:** các tổng chính khớp chéo (sessions theo kênh, tuần, thiết bị đều bằng 3.284; đơn theo kênh và trạng thái đều bằng 52). Nhóm ghi nhận 4 điểm cần thận trọng (chi tiết ở Phụ lục B): purchase cao hơn số đơn thật 9,6% (57 so với 52); payload purchase chứa dữ liệu cá nhân; GA4 ghi 289 lượt hero_secondary_click dù mã nguồn trong kỳ đo không gửi sự kiện này; có 149 lượt xem /blog dù website không có trang này. Các số liệu liên quan không được dùng để kết luận."));

// ============ 3. PHÁT HIỆN CHÍNH ============
C.push(H1("3. Phát hiện chính"));
// 3.1
C.push(H2("3.1 Traffic"));
C.push(CAP("Bảng 4. Traffic và kết quả theo kênh"));
C.push(table([2.5, 1.1, 1, 1.2, 0.9, 1.3, 1.6], ["Kênh", "Sessions", "Tỉ trọng", "Engagement rate", "Đơn đặt", "Đặt đơn/ session", "Đã thu (VND)"], [
  ["Direct (trực tiếp)", "972", "29,6%", "57,1%", "12", "1,23%", "8.050.000"],
  ["Organic Search (tìm kiếm)", "820", "25,0%", "71,8%", "19", "2,32%", "12.680.000"],
  ["Organic Social (MXH tự nhiên)", "650", "19,8%", "54,6%", "7", "1,08%", "3.399.000"],
  ["Paid Social (quảng cáo MXH)", "483", "14,7%", "52,0%", "8", "1,66%", "4.749.000"],
  ["Referral (giới thiệu)", "205", "6,2%", "62,4%", "3", "1,46%", "2.845.000"],
  ["Email", "96", "2,9%", "81,2%", "3", "3,13%", "1.690.000"],
  ["Unassigned", "58", "1,8%", "48,3%", "0", "0%", "0"],
  ["Tổng", "3.284", "100%", "60,4%", "52", "1,58%", "33.413.000"],
], { num: [1, 2, 3, 4, 5, 6], totalLast: true, hl: (r) => r[0].startsWith("Organic Search") }));
C.push(SRC("Nguồn: GA4 Traffic acquisition và order log, 01 đến 25/10/2026. Engagement rate (ER, tỷ lệ phiên có tương tác) = engaged sessions / sessions."));
C.push(...figure("h2_kenh.png", "Hình 1. Sessions và tỉ lệ đặt đơn theo kênh", "Nguồn: GA4 và order log. Đường đứt nét là tỉ lệ trung bình toàn website (1,58%).", 430));
C.push(CAP("Bảng 5. Traffic theo thiết bị"));
C.push(table([1.6, 1.2, 1.1, 1, 1, 1.5, 1.9], ["Thiết bị", "Sessions", "Tỉ trọng", "ER", "Đơn đặt", "Đặt đơn/ session", "Thu tiền/đơn"], [
  ["Mobile", "2.161", "65,8%", "55,8%", "31", "1,43%", "58,1% (18/31)"],
  ["Desktop", "1.098", "33,4%", "69,8%", "20", "1,82%", "80,0% (16/20)"],
  ["Tablet", "25", "0,8%", "52,0%", "1", "4,00%", "100% (1/1)"],
], { num: [1, 2, 3, 4, 5, 6] }));
C.push(SRC("Nguồn: GA4 Tech và order log."));
C.push(...figure("h1_tuan.png", "Hình 2. Sessions và đơn đặt trung bình mỗi ngày theo tuần", "Nguồn: GA4 và order log. Kỳ 22 đến 25/10 chỉ có 4 ngày nên so theo trung bình ngày.", 400));
C.push(P("**Nhận xét:**", { p: { keepNext: true } }));
C.push(B("Traffic tăng đều: sessions trung bình ngày từ 101,3 lên 168,3 (+66%), đơn trung bình ngày từ 1,29 lên 2,75, ER ổn định 59% đến 63%."));
C.push(B("**Organic Search là kênh chất lượng nhất:** 25,0% sessions nhưng 36,5% số đơn (19/52); ER 71,8% (KTC 95%: 68,7% đến 74,8%) cao hơn Direct 57,1% (54,0% đến 60,2%), z = 6,47, p < 0,001. Tỉ lệ đặt đơn gần gấp đôi Direct (2,32% so với 1,23%) nhưng **chưa có ý nghĩa thống kê** (p = 0,08)."));
C.push(B("Mạng xã hội (Organic + Paid) mang 34,5% sessions nhưng chỉ 15 đơn (1,32%), ER thấp nhất (52,0% đến 54,6%); chưa có chi phí nên chưa tính được ROAS (doanh thu trên chi phí quảng cáo)."));
C.push(B("**Mobile chiếm 65,8% sessions nhưng ER thấp hơn desktop 14 điểm phần trăm** (55,8% so với 69,8%, p < 0,001). Tỉ lệ đặt đơn trên mobile thấp hơn (1,43% so với 1,82%) nhưng chưa có ý nghĩa thống kê (p = 0,40)."));
C.push(KET("Traffic tăng đều và phần lớn đến từ mobile, nhưng Organic Search mới là kênh mang lại khách chất lượng nhất (ER 71,8%, 36,5% số đơn), còn mobile tương tác kém hơn desktop rõ rệt (55,8% so với 69,8%)."));

// 3.2
C.push(H2("3.2 Phiên truy cập (Sessions)"));
C.push(CAP("Bảng 6. Chỉ số phiên truy cập và tương tác trong phiên"));
C.push(table([3.8, 2.2, 3], ["Chỉ số", "Giá trị", "Cách tính / ghi chú"], [
  ["Sessions / Users / New users", "3.284 / 2.086 / 1.762", "New users = 84,5% users"],
  ["Returning users", "324", "15,5% users; 1,57 sessions/user"],
  ["Engagement rate", "60,4%", "1.984 / 3.284"],
  ["Views per session", "2,84", "9.320 / 3.284"],
  ["Thời gian tương tác trung bình", "1 phút 42 giây", "Mỗi session"],
  ["Đổi ảnh / phóng to ảnh sản phẩm", "542 / 163", "Event count"],
  ["Mở chatbot / tin nhắn gửi chatbot", "144 / 237", "Event count"],
], { num: [1] }));
C.push(SRC("Nguồn: GA4, 01 đến 25/10/2026."));
C.push(P("**Nhận xét:**", { p: { keepNext: true } }));
C.push(B("Phiên trung bình 2,84 trang, 1 phút 42 giây: đủ xem 1 đến 2 sản phẩm nhưng chưa đủ so sánh nhiều mẫu ở mức giá khoảng 900.000đ."));
C.push(B("84,5% là khách mới, chỉ 15,5% quay lại: phần lớn khách chỉ có một lần ghé để được thuyết phục."));
C.push(B("Người dùng **phải tự tìm thêm thông tin**: 542 lượt đổi ảnh, 237 tin nhắn chatbot. Tự duyệt web cho thấy thời gian giao hàng, phí ship và bảo hành gãy mảnh **chỉ có trong câu trả lời của chatbot**, không hiển thị trên PDP."));
C.push(KET("Phiên truy cập có tương tác ở mức khá (ER 60,4%, 2,84 trang/phiên) nhưng chủ yếu là khách mới (84,5%) và phải tự tìm thông tin mua hàng qua ảnh và chatbot."));

// 3.3
C.push(H2("3.3 Luồng di chuyển (User flow)"));
C.push(CAP("Bảng 7. Landing page và lượt xem theo trang"));
C.push(table([3.4, 1.6, 1.4, 1.6], ["Trang", "Landing sessions", "Tỉ trọng landing", "Page views"], [
  ["/ (trang chủ)", "1.390", "42,3%", "2.605"],
  ["/shop", "671", "20,4%", "1.770"],
  ["6 trang /product/[slug]", "710", "21,6%", "2.794"],
  ["/collections", "245", "7,5%", "901"],
  ["/about, /studio", "179", "5,5%", "296"],
  ["/cart, /checkout (/payment, /success)", "30", "0,9%", "749"],
  ["/blog và URL khác", "59", "1,8%", "205"],
  ["Tổng", "3.284", "100%", "9.320"],
], { num: [1, 2, 3], totalLast: true }));
C.push(SRC("Nguồn: GA4 Landing page, Pages and screens."));
C.push(P("**Nhận xét:**", { p: { keepNext: true } }));
C.push(B("**Trang chủ là cửa vào chính** (42,3% landing). Cửa vào thứ hai là trang mua sắm (/shop 20,4%, PDP 21,6%), chủ yếu từ tìm kiếm và link quảng cáo dẫn thẳng đến sản phẩm."));
C.push(B("**Nút được bấm nhiều nhất trang chủ không dẫn đi đâu:** CTA (call to action, lời kêu gọi hành động) \"Khám phá bộ sưu tập →\" có 574 lượt bấm (22,0% lượt xem trang chủ), gấp 2,9 lần nút \"Xem mẫu nổi bật\" (199). Tự duyệt web xác nhận: bấm nút chỉ đổi URL thành /#shop-all, người dùng vẫn ở trang chủ vì neo #shop-all không tồn tại (Hình 5)."));
C.push(B("Luồng mua sắm chính là /shop → PDP (1.770 và 2.794 lượt xem). /studio chỉ chiếm 1,2% lượt xem nên không phải ưu tiên."));
C.push(KET("Luồng di chuyển tập trung qua trang chủ (42,3% landing), nhưng nút được bấm nhiều nhất ở đó (574 lượt) không dẫn đến danh mục, làm đứt lối đi chính từ trang chủ sang sản phẩm."));

// 3.4
C.push(H2("3.4 Điểm nghẽn (Bottlenecks)"));
C.push(CAP("Bảng 8. Phễu mua hàng"));
C.push(table([3.2, 1.2, 1.6, 1.3, 1.6], ["Bước", "Số lượng", "Đi tiếp so với bước trước", "Tỉ lệ rớt", "So với tổng sessions"], [
  ["1. Truy cập (sessions)", "3.284", "", "", "100%"],
  ["2. Xem danh mục (view_item_list)", "1.976", "60,2%", "39,8%", "60,2%"],
  ["3. Xem chi tiết (view_item)", "1.461", "73,9%", "26,1%", "44,5%"],
  ["4. Thêm giỏ (add_to_cart)", "267", "18,3%", "81,7%", "8,1%"],
  ["5. Xem giỏ (view_cart)", "239", "89,5%", "10,5%", "7,3%"],
  ["6. Bắt đầu checkout (begin_checkout)", "148", "61,9%", "38,1%", "4,5%"],
  ["7. Đặt đơn thành công (order_id)", "52", "35,1%", "64,9%", "1,6%"],
  ["8. Đã xác nhận thu tiền (đơn)", "35", "67,3%", "32,7%", "1,1%"],
], { num: [1, 2, 3, 4], hl: (r) => r[0].startsWith("4.") || r[0].startsWith("7.") }));
C.push(SRC("Nguồn: GA4 (bước 1 đến 6: số sessions có ít nhất 1 lần phát sinh sự kiện) và order log (bước 7, 8: số đơn). Tỉ lệ rớt = 1 - bước sau / bước trước."));
C.push(...figure("h5_pheu.png", "Hình 3. Phễu mua hàng 8 bước", "Nguồn: GA4 và order log. Màu cam là hai bước có tỉ lệ đi tiếp thấp nhất.", 430));
C.push(...figure("h6_sanpham.png", "Hình 4. Lượt xem và tỉ lệ thêm giỏ theo sản phẩm", "Nguồn: GA4 (event count). Đường đứt nét là trung bình 6 sản phẩm (11,7%).", 430));
C.push(P("**Nhận xét:**", { p: { keepNext: true } }));
C.push(B("**Điểm nghẽn lớn nhất là xem chi tiết → thêm giỏ:** 267 / 1.461 sessions (18,3%, KTC 95%: 16,4% đến 20,3%), rớt 81,7%; mẫu thấp nhất (Miền Tây) chỉ 7,6% lượt thêm giỏ trên lượt xem. Tự duyệt web trên mobile: khu vực mua có độ khó, thời gian lắp, giá, nhưng **không có thời gian giao, phương thức thanh toán, bảo hành**; khi cuộn xuống đọc phần câu chuyện và lắp ráp, **nút mua ra khỏi màn hình**. Giả thuyết: khu vực mua chưa trả lời đủ câu hỏi chốt đơn và nút mua không nằm trong tầm tay lúc người dùng đã đọc xong."));
C.push(B("**Điểm nghẽn thứ hai là checkout → đặt đơn:** 52 / 148 sessions (35,1%, KTC 95%: 27,9% đến 43,1%), rớt 64,9%. Tự duyệt web: form hiển thị cùng lúc 7 trường, trong đó chỉ 4 trường bắt buộc; trên mobile phải cuộn qua cả 7 trường mới đến phần thanh toán (giả thuyết nguyên nhân)."));
C.push(B("Sau khi đặt, 67,3% đơn đã thu tiền (33.413.000đ), 23,1% chờ xác nhận hoặc giao COD, 9,6% hủy. Các bước danh mục → chi tiết (73,9%) và giỏ → checkout (61,9%) hoạt động tương đối tốt."));
C.push(KET("Điểm nghẽn lớn nhất của phễu là bước từ trang sản phẩm sang thêm giỏ (rớt 81,7%), tiếp theo là bước từ bắt đầu checkout sang đặt đơn thành công (rớt 64,9%)."));

C.push(H2("3.5 Liên kết 4 mảng: nguyên nhân gốc"));
C.push(P("Bốn mảng cùng chỉ về một vấn đề: **website kéo được người xem nhưng làm rơi họ ở các điểm chuyển sang hành động.** Traffic tăng (+66% sessions/ngày), 65,8% đến từ mobile nơi ER thấp hơn desktop 14 điểm phần trăm; phiên chủ yếu là khách mới với khoảng 2,84 trang, nên mỗi lần ghé cần dẫn khách đến sản phẩm nhanh và trả lời đủ câu hỏi ngay tại chỗ. Thực tế có ba chỗ đứt gãy trùng với ba điểm rớt: (1) **trang chủ**: CTA được bấm nhiều nhất (574 lượt) không dẫn đến danh mục; (2) **PDP**: thiếu thông tin giao hàng, thanh toán, bảo hành và nút mua ra khỏi màn hình khi cuộn trên mobile, trùng điểm rớt 81,7%; (3) **checkout**: 7 trường hiển thị cùng lúc trên màn hình nhỏ, trùng điểm rớt 64,9%. Organic Search có kết quả tốt nhất có thể vì người tìm kiếm đã có ý định mua rõ ràng nên ít bị ảnh hưởng bởi các chỗ đứt gãy này (giả thuyết)."));

// ============ 4. ĐỀ XUẤT ============
C.push(H1("4. Đề xuất & thay đổi đã thực hiện"));
C.push(P("Ba thay đổi đã được **triển khai trực tiếp trên mã nguồn website ngày 26/10/2026** (kiểm thử: test, typecheck, build đều đạt) và đưa lên bản chính ngày [CẦN BỔ SUNG: ngày merge lên production]. Mỗi thay đổi nhắm vào một bước khác nhau của luồng nên có thể đo tác động riêng. Thứ tự theo ma trận tác động/công sức:"));
C.push(CAP("Bảng 9. Thứ tự ưu tiên các thay đổi"));
C.push(table([0.4, 3.2, 1.2, 2.2, 1, 1.1], ["#", "Thay đổi", "Trang", "Bước nhắm tới", "Tác động", "Công sức"], [
  ["1", "Sửa CTA chính ở Hero", "Trang chủ", "Trang chủ → danh mục", "Cao", "Thấp"],
  ["2", "Khối giao hàng, thanh toán, bảo hành và thanh \"Thêm vào giỏ\" cố định trên mobile", "6 PDP", "Xem chi tiết → thêm giỏ", "Cao", "Trung bình"],
  ["3", "Thu gọn form checkout còn 4 trường bắt buộc", "/checkout", "Checkout → đặt đơn", "Trung bình", "Trung bình"],
]));
C.push(SRC("Nguồn: nhóm đánh giá dựa trên Phần 3."));

C.push(H2("4.1 Thay đổi 1: Sửa nút CTA chính ở Hero trang chủ"));
C.push(P("**(1) Vấn đề:** trang chủ là cửa vào của 42,3% sessions; CTA \"Khám phá bộ sưu tập →\" được bấm 574 lượt, nhiều nhất trang, nhưng trỏ đến neo #shop-all không tồn tại nên không dẫn đến danh mục (mục 3.3)."));
C.push(P("**(2) Thay đổi:** đổi đích nút chính từ #shop-all sang trang /shop (6 sản phẩm); gắn thêm sự kiện hero_secondary_click cho nút \"Tự ráp Nook\" để lần đo sau có số liệu đáng tin cho cả hai nút."));
C.push(P("**(3) Ảnh Trước-Sau:** Hình 5 bên dưới, chụp trên website thật trước và sau khi triển khai.", { p: { keepNext: true } }));
C.push(...figure("tc1_cta.png", "Hình 5. Trước-Sau: kết quả khi bấm CTA chính trên mobile", "Ảnh chụp nookky.shop trên màn hình 390px. Trước: URL chỉ đổi thành /#shop-all, người dùng vẫn ở trang chủ. Sau: trang /shop mở ra.", 430, SS));
C.push(P("**(4) Lý do dữ liệu:** đây là nút có nhu cầu bấm cao nhất trên trang có lượng vào lớn nhất; mỗi lượt bấm trước đây không dẫn đến sản phẩm. Công sửa gần như bằng 0, rủi ro thấp. **Chỉ số kỳ vọng:** tỉ lệ session landing trang chủ có view_item_list; lượt xem /shop từ trang chủ."));

C.push(H2("4.2 Thay đổi 2: Thông tin chốt đơn và thanh \"Thêm vào giỏ\" cố định trên PDP"));
C.push(P("**(1) Vấn đề:** bước xem chi tiết → thêm giỏ rớt 81,7% (267 / 1.461 sessions), từng sản phẩm chỉ 7,6% đến 13,3% (mục 3.4); mobile chiếm 65,8% sessions với ER 55,8% (mục 3.1); 237 tin nhắn chatbot và thông tin giao hàng, bảo hành chỉ có trong chatbot (mục 3.2)."));
C.push(P("**(2) Thay đổi:** trên 6 PDP, (a) thêm khối 3 dòng ngay dưới nút mua, lấy đúng chính sách hiện hành của shop: *Giao hàng* 2 đến 3 ngày tại TP.HCM, Hà Nội, 3 đến 5 ngày tỉnh khác, phí 30.000đ, miễn phí từ 1.000.000đ; *Thanh toán* COD, chuyển khoản, MoMo, ZaloPay; *Bảo hành* gửi bù miễn phí mảnh gỗ gãy hoặc thất lạc trong 30 ngày. (b) Trên mobile, thanh cố định ở đáy màn hình gồm tên, giá, nút \"Thêm vào giỏ\", chỉ hiện khi khu vực mua đã cuộn khỏi màn hình; sự kiện add_to_cart ghi thêm vị trí bấm (buy_box hoặc sticky_bar) để đo riêng hiệu quả thanh này."));
C.push(P("**(3) Ảnh Trước-Sau:** Hình 6 bên dưới, chụp trên website thật trước và sau khi triển khai.", { p: { keepNext: true } }));
C.push(...figure("tc2_pdp.png", "Hình 6. Trước-Sau: khu vực mua và màn hình khi cuộn trên PDP Hội An (mobile)", "Ảnh chụp /product/pho-vua-len-den-hoi-an trên màn hình 390px. Chọn mẫu Hội An vì có lượng xem lớn nhất (845).", 450, SS));
C.push(P("**(4) Lý do dữ liệu:** thay đổi nhắm thẳng vào bước rớt lớn nhất (81,7%) và vào thiết bị chiếm 2/3 traffic; đưa câu trả lời mà người dùng đang phải hỏi chatbot lên ngay cạnh nút mua, và giữ nút mua trong tầm tay khi đọc thông tin. **Chỉ số kỳ vọng:** sessions add_to_cart / sessions view_item (hiện 18,3%) tách mobile và desktop; tỉ trọng add_to_cart có placement = sticky_bar; số tin nhắn chatbot hỏi về giao hàng."));

C.push(H2("4.3 Thay đổi 3: Thu gọn form checkout còn 4 trường bắt buộc"));
C.push(P("**(1) Vấn đề:** 148 sessions bắt đầu checkout nhưng chỉ 52 đơn (35,1%, rớt 64,9%, mục 3.4); form hiển thị 7 trường trong khi chỉ 4 trường bắt buộc; 65,8% traffic là mobile."));
C.push(P("**(2) Thay đổi:** trên /checkout, giữ hiển thị 4 trường bắt buộc (họ tên, số điện thoại, tỉnh/thành, địa chỉ); gom email, quận/huyện, ghi chú vào mục thu gọn \"Thêm thông tin (không bắt buộc)\". Dữ liệu gửi lên và quy tắc kiểm tra không đổi."));
C.push(P("**(3) Ảnh Trước-Sau:** Hình 7 bên dưới, chụp trên website thật trước và sau khi triển khai.", { p: { keepNext: true } }));
C.push(...figure("tc3_checkout.png", "Hình 7. Trước-Sau: khối \"Thông tin giao hàng\" ở checkout (mobile)", "Ảnh chụp /checkout trên màn hình 390px với 1 sản phẩm trong giỏ.", 380, SS));
C.push(P("**(4) Lý do dữ liệu:** đây là bước rớt lớn thứ hai và là bước cuối trước khi có doanh thu; giảm số trường phải nhìn và cuộn qua trên màn hình nhỏ mà không mất thông tin bắt buộc để giao hàng. **Chỉ số kỳ vọng:** đơn đặt / sessions begin_checkout (hiện 35,1%)."));

// ============ 5. KẾT QUẢ ============
C.push(H1("5. Kết quả kỳ vọng & hạn chế"));
C.push(H2("5.1 Tác động dự kiến và cách đo lại"));
C.push(P("Thay đổi mới được triển khai ngày 26/10/2026 nên **chưa có số liệu sau thay đổi**; các tác động dưới đây là dự kiến."));
C.push(CAP("Bảng 10. Tác động dự kiến và kế hoạch đo lại"));
C.push(table([1.3, 2.7, 2, 1, 2.6], ["Thay đổi", "Chỉ số chính", "Trước (01 đến 25/10)", "Sau", "Cách đo lại"], [
  ["1. CTA Hero", "Sessions landing trang chủ có view_item_list / sessions landing trang chủ", "[CẦN BỔ SUNG: GA4 Exploration]", "Chưa có", "GA4 Exploration lọc landing page = /, 14 ngày sau khi lên bản chính"],
  ["2. PDP", "Sessions add_to_cart / sessions view_item", "18,3% (267 / 1.461)", "Chưa có", "GA4 Funnel exploration tách mobile/desktop; lọc placement = sticky_bar"],
  ["3. Checkout", "Đơn đặt / sessions begin_checkout", "35,1% (52 / 148)", "Chưa có", "GA4 begin_checkout và order log theo order_id"],
]));
C.push(SRC("Nguồn: GA4 và order log; cột \"Sau\" điền khi có dữ liệu giai đoạn đo lại."));
C.push(P("**Cỡ mẫu cần thiết:** khoảng 58 sessions/ngày có view_item (1.461 / 25), nên 14 ngày cho khoảng 800 sessions; đủ phát hiện tỉ lệ thêm giỏ tăng từ 18,3% lên khoảng 23% với độ tin cậy 95% và power (xác suất phát hiện) 80%, chưa đủ cho thay đổi nhỏ hơn. Bước checkout chỉ khoảng 6 sessions/ngày nên 14 ngày chỉ đủ quan sát xu hướng. So sánh cùng độ dài kỳ và ghi lại thay đổi ngân sách quảng cáo, khuyến mãi để không gán nhầm hiệu quả."));
C.push(H2("5.2 Hạn chế của đồ án"));
C.push(N("**Thời gian ngắn, chưa đo lại:** baseline 25 ngày; cỡ mẫu cuối phễu nhỏ (148 sessions checkout, 52 đơn); nhiều chênh lệch giữa kênh, thiết bị chưa có ý nghĩa thống kê."));
C.push(N("**Sai lệch đo lường:** purchase cao hơn số đơn 9,6%; 289 lượt hero_secondary_click không khớp mã nguồn; traffic /blog không khớp cấu trúc website; chưa xác nhận lọc traffic nội bộ."));
C.push(N("**Chỉ dùng GA4 và tự duyệt web:** không có heatmap, quan sát người dùng thật; nguyên nhân rớt phễu là giả thuyết."));
C.push(N("**Yếu tố ngoại cảnh và tương quan:** traffic tăng có thể do quảng cáo, mùa quà tặng 20/10; so sánh trước và sau không phải thử nghiệm có đối chứng."));
C.push(N("**Thiếu chi phí quảng cáo:** chưa tính được ROAS hay CAC (chi phí có một khách hàng) cho Paid Social."));
C.push(H2("5.3 Hướng phát triển tiếp theo"));
C.push(B("**Sửa đo lường:** chỉ gửi sự kiện đặt hàng sau khi server xác nhận lưu đơn, xóa email, số điện thoại, họ tên khỏi payload GA4, bật lọc traffic nội bộ."));
C.push(B("**A/B test thanh mua cố định trên mobile:** nhánh A chỉ có khối thông tin, nhánh B có thêm thanh cố định; chỉ số sessions add_to_cart / sessions view_item trên mobile, mỗi nhánh khoảng 1.000 sessions có view_item."));
C.push(B("**Tối ưu Paid Social:** đưa link quảng cáo về thẳng PDP Hội An, Hà Nội (tỉ lệ thêm giỏ cao nhất, 13,3% và 12,2%), so ER và tỉ lệ đặt đơn với mức hiện tại (52,0% và 1,66%)."));

// ============ PHỤ LỤC ============
C.push(H1("Phụ lục", true));
C.push(H2("Phụ lục A. Danh sách ảnh chụp màn hình"));
C.push(CAP("Bảng 11. Ảnh chụp màn hình"));
C.push(table([0.9, 4, 4], ["Hình", "Nội dung", "Nguồn / trang"], [
  ["Hình 5", "CTA Hero: trang chủ, kết quả bấm trước và sau", "nookky.shop trang chủ, mobile 390px (đã chèn)"],
  ["Hình 6", "PDP: khu vực mua và màn hình khi cuộn, trước và sau", "/product/pho-vua-len-den-hoi-an, mobile 390px (đã chèn)"],
  ["Hình 7", "Form checkout trước và sau", "/checkout, mobile 390px (đã chèn)"],
  ["Hình 8", "GA4 Traffic acquisition", "[CẦN BỔ SUNG: chụp GA4 > Reports > Acquisition]"],
  ["Hình 9", "GA4 Pages and screens, Landing page", "[CẦN BỔ SUNG: chụp GA4 > Reports > Engagement]"],
  ["Hình 10", "GA4 Tech > Device category", "[CẦN BỔ SUNG: chụp GA4 > Reports > Tech]"],
  ["Hình 11", "GA4 Funnel exploration", "[CẦN BỔ SUNG: chụp GA4 > Explore > Funnel]"],
]));
C.push(H2("Phụ lục B. Chi tiết kiểm soát chất lượng dữ liệu"));
C.push(CAP("Bảng 12. Vấn đề chất lượng dữ liệu và cách xử lý"));
C.push(table([2.2, 3.8, 3], ["Vấn đề", "Bằng chứng", "Cách xử lý"], [
  ["purchase cao hơn số đơn thật", "57 purchase so với 52 order_id (lệch 9,6%); code gửi purchase trước khi server xác nhận lưu đơn", "Dùng order_id trong order log làm số đơn"],
  ["Dữ liệu cá nhân (PII) trong GA4", "Payload purchase chứa email, số điện thoại, họ tên, gửi nguyên vào gtag", "Đề xuất xóa PII (mục 5.3)"],
  ["\"Đã thanh toán\" do khách tự báo", "36 payment_reported so với 35 đơn đã xác nhận thu tiền", "Dùng trạng thái thu tiền đã đối soát"],
  ["hero_secondary_click không khớp mã nguồn", "GA4 ghi 289 lượt; mã nguồn trong kỳ đo không gửi sự kiện này; /studio chỉ có 116 lượt xem", "Không dùng; đã gắn sự kiện đúng trong Thay đổi 1"],
  ["Traffic /blog", "32 landing sessions, 149 lượt xem dù website không có trang /blog", "[CẦN BỔ SUNG: xác nhận nguồn]; loại khỏi phân tích"],
]));
C.push(SRC("Nguồn: GA4, order log, rà soát mã nguồn ngày 26/10/2026."));

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
