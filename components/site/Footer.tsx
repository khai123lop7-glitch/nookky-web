const navGroups = [
  {
    title: "Khám phá thế giới",
    links: [
      ["Tất cả sản phẩm", "/shop"],
      ["Bộ sưu tập 3 miền", "/collections"],
      ["Câu chuyện Nook Ký", "#brand-story"],
      ["Ký sự & Cẩm nang", "#journal-guides"],
    ],
  },
  {
    title: "Trải nghiệm & Hỗ trợ",
    links: [
      ["Tự ráp Nook (Studio)", "/studio"],
      ["Quy trình chế tác", "#crafting-process"],
      ["Không gian thực tế", "#real-spaces"],
      ["Tra cứu đơn hàng", "/cart"],
    ],
  },
  {
    title: "Chính sách thương hiệu",
    links: [
      ["Bảo hành bóng đèn & linh kiện", "#"],
      ["Chính sách vận chuyển toàn quốc", "#"],
      ["Chính sách đổi trả 7 ngày", "#"],
      ["Bảo mật thông tin khách hàng", "#"],
    ],
  },
];

export function Footer() {
  return (
    <footer className="nk-footer" id="site-footer">
      <div className="nk-container-wide nk-footer__top">
        {/* Brand & Mission Column */}
        <div className="nk-footer__brand">
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
            <img
              src="/media/brand/logo-symbol-light.png"
              alt="Nook Ký symbol"
              style={{ width: "32px", height: "32px", objectFit: "contain" }}
            />
            <span style={{ fontFamily: "NookOrtland", fontSize: "24px", color: "var(--nk-v3-cream)", letterSpacing: "-0.02em" }}>
              NOOK KÝ
            </span>
          </div>
          <p className="nk-eyebrow" style={{ color: "#efbd72", marginBottom: "12px" }}>BẢN SẮC VIỆT THU NHỎ</p>
          <h2 style={{ fontSize: "28px", lineHeight: "1.15", margin: "0 0 16px" }}>
            Xây một góc nhỏ,<br />giữ một ký ức riêng.
          </h2>
          <p style={{ maxWidth: "420px", color: "rgba(252,244,233,0.75)", fontSize: "13px", lineHeight: "1.7" }}>
            Book Nook lấy cảm hứng từ những nơi chốn Việt Nam quen thuộc, được thu nhỏ để bạn tự tay hoàn thiện và giữ lại trong không gian sống.
          </p>

          {/* Contact Details */}
          <div style={{ marginTop: "24px", display: "flex", flexDirection: "column", gap: "10px", fontSize: "13px", color: "rgba(252,244,233,0.85)", fontFamily: "var(--nk-v3-ui)" }}>
            <div><span style={{ color: "#efbd72", fontWeight: 700 }}>Địa chỉ:</span> Xưởng sáng tạo Phố cổ Hội An & Hà Nội</div>
            <div><span style={{ color: "#efbd72", fontWeight: 700 }}>Thư điện tử:</span> lienhe@nookky.vn</div>
            <div><span style={{ color: "#efbd72", fontWeight: 700 }}>Hotline:</span> 0987 654 321 (8:30 – 21:00)</div>
          </div>

          {/* Social Links */}
          <div style={{ marginTop: "20px", display: "flex", gap: "14px" }}>
            <a href="#" style={{ color: "#efbd72", fontSize: "12px", fontWeight: 600 }}>Facebook ↗</a>
            <a href="#" style={{ color: "#efbd72", fontSize: "12px", fontWeight: 600 }}>Instagram ↗</a>
            <a href="#" style={{ color: "#efbd72", fontSize: "12px", fontWeight: 600 }}>TikTok ↗</a>
            <a href="#" style={{ color: "#efbd72", fontSize: "12px", fontWeight: 600 }}>YouTube ↗</a>
          </div>
        </div>

        {/* Navigation Columns */}
        <div className="nk-footer__nav" aria-label="Liên kết cuối trang">
          {navGroups.map((group) => (
            <div className="nk-footer__group" key={group.title}>
              <p style={{ color: "#efbd72", fontWeight: 700, fontSize: "12px", letterSpacing: "0.06em", textTransform: "uppercase" }}>
                {group.title}
              </p>
              {group.links.map(([label, href]) => (
                <a href={href} key={label} style={{ fontSize: "13px", opacity: 0.85, transition: "opacity 0.2s ease" }}>
                  {label}
                </a>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="nk-container-wide nk-footer__bottom" style={{ borderTop: "1px solid rgba(252,244,233,0.12)", paddingTop: "24px", marginTop: "40px" }}>
        <span>© 2026 Nook Ký · Tác phẩm thủ công Việt Nam. Đã đăng ký bản quyền.</span>
        <span>Thiết kế và phát triển với niềm tự hào di sản văn hóa</span>
      </div>
    </footer>
  );
}
