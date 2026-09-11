"use client";

import styles from "./TableOfContents.module.css";

export function TableOfContents() {
  return (
    <section className={styles.tocSection} id="muc-luc" aria-labelledby="toc-heading">
      <div className={styles.innerContainer}>
        {/* ── TOP SECTION: Brand Header & Philosophy ── */}
        <div className={styles.brandHeader} data-nk-reveal data-nk-delay="1">
          <h2 id="toc-heading" className={styles.brandName}>
            NOOK KÝ
          </h2>
          <p className={styles.eyebrow}>BẢN SẮC VIỆT NAM THU NHỎ</p>

          <h3 className={styles.philosophyHeading}>
            Xây một góc nhỏ, giữ một ký ức riêng.
          </h3>

          <p className={styles.brandDesc}>
            Book Nook lấy cảm hứng từ những nơi chốn Việt Nam quen thuộc,
            được thu nhỏ để bạn tự tay hoàn thiện và giữ lại trong không gian sống.
          </p>
        </div>

        {/* ── MIDDLE ROW: 3 Navigation Columns ── */}
        <div className={styles.navRow}>
          {/* Column 1: Khám Phá Thế Giới */}
          <div className={styles.navColWithDivider} data-nk-reveal data-nk-delay="2">
            <h4 className={styles.colHeader}>KHÁM PHÁ THẾ GIỚI</h4>
            <ul className={styles.navList}>
              <li>
                <a href="/shop" className={styles.navLink}>
                  Tất cả sản phẩm
                </a>
              </li>
              <li>
                <a href="#collections" className={styles.navLink}>
                  Bộ sưu tập 3 miền
                </a>
              </li>
              <li>
                <a href="#qua-tang-doanh-nghiep" className={styles.navLink}>
                  Câu chuyện Nook Ký
                </a>
              </li>
              <li>
                <a href="#journal" className={styles.navLink}>
                  Ký sự & Cẩm nang
                </a>
              </li>
            </ul>
          </div>

          {/* Column 2: Trải Nghiệm & Hỗ Trợ */}
          <div className={styles.navColWithDivider} data-nk-reveal data-nk-delay="3">
            <h4 className={styles.colHeader}>TRẢI NGHIỆM & HỖ TRỢ</h4>
            <ul className={styles.navList}>
              <li>
                <a href="/studio" className={styles.navLink}>
                  Tự ráp Nook (Studio)
                </a>
              </li>
              <li>
                <a href="#quy-trinh-che-tac" className={styles.navLink}>
                  Quy trình chế tác
                </a>
              </li>
              <li>
                <a href="#lien-he-tu-van" className={styles.navLink}>
                  Tư vấn quà tặng & hợp tác
                </a>
              </li>
              <li>
                <a href="/cart" className={styles.navLink}>
                  Tra cứu đơn hàng
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Kết Nối */}
          <div className={styles.navCol} data-nk-reveal data-nk-delay="4">
            <h4 className={styles.colHeader}>KẾT NỐI</h4>

            <div className={styles.contactDetails}>
              {/* Location */}
              <div className={styles.contactItem}>
                <svg
                  className={styles.contactIcon}
                  width="17"
                  height="17"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                </svg>
                <span>Xưởng sáng tạo Phố cổ Hội An & Hà Nội</span>
              </div>

              {/* Email */}
              <div className={styles.contactItem}>
                <svg
                  className={styles.contactIcon}
                  width="17"
                  height="17"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="2" y="4" width="20" height="16" rx="2" />
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                </svg>
                <a href="mailto:lienhe@nookky.vn" className={styles.contactLink}>
                  lienhe@nookky.vn
                </a>
              </div>

              {/* Phone */}
              <div className={styles.contactItem}>
                <svg
                  className={styles.contactIcon}
                  width="17"
                  height="17"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
                </svg>
                <span>0987 654 321 (8:30 – 21:00)</span>
              </div>
            </div>

            {/* Social Links */}
            <div className={styles.socialRow}>
              {/* Facebook */}
              <a href="#" className={styles.socialItem} aria-label="Facebook">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2.04c-5.5 0-10 4.49-10 10.02 0 5 3.66 9.15 8.44 9.9v-7H7.9v-2.9h2.54V9.85c0-2.51 1.49-3.89 3.78-3.89 1.09 0 2.23.19 2.23.19v2.47h-1.26c-1.24 0-1.63.77-1.63 1.56v1.88h2.78l-.45 2.9h-2.33v7a10 10 0 0 0 8.44-9.9c0-5.53-4.5-10.02-10-10.02z" />
                </svg>
                <span>Facebook</span>
              </a>

              {/* Instagram */}
              <a href="#" className={styles.socialItem} aria-label="Instagram">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
                <span>Instagram</span>
              </a>

              {/* TikTok */}
              <a href="#" className={styles.socialItem} aria-label="TikTok">
                <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.298-.002.595.042.88.13V9.4a6.33 6.33 0 0 0-1-.08A6.34 6.34 0 0 0 3 15.66a6.34 6.34 0 0 0 10.86 4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-3.04-1.52z" />
                </svg>
                <span>TikTok</span>
              </a>

              {/* YouTube */}
              <a href="#" className={styles.socialItem} aria-label="YouTube">
                <svg width="19" height="19" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
                <span>YouTube</span>
              </a>
            </div>
          </div>
        </div>

        {/* ── BOTTOM BAR: Copyright & Heritage ── */}
        <div className={styles.bottomBar} data-nk-reveal data-nk-delay="5">
          <div className={styles.bottomContent}>
            {/* Heritage Flower Icon */}
            <div className={styles.heritageIcon} aria-hidden="true">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#ebc082" strokeWidth="1.2">
                <circle cx="12" cy="12" r="9" strokeDasharray="1 2" />
                <path d="M12 3c2.5 3 2.5 6 0 9-2.5-3-2.5-6 0-9z" fill="rgba(235,192,130,0.15)" />
                <path d="M12 21c2.5-3 2.5-6 0-9-2.5 3-2.5 6 0 9z" fill="rgba(235,192,130,0.15)" />
                <path d="M3 12c3-2.5 6-2.5 9 0-3 2.5-6 2.5-9 0z" fill="rgba(235,192,130,0.15)" />
                <path d="M21 12c-3-2.5-6-2.5-9 0 3 2.5 6 2.5 9 0z" fill="rgba(235,192,130,0.15)" />
                <circle cx="12" cy="12" r="2.5" fill="#ebc082" />
              </svg>
            </div>

            <div className={styles.copyrightText}>
              <p>&copy; 2026 Nook Ký &bull; Tác phẩm thủ công Việt Nam. Đã đăng ký bản quyền.</p>
              <p>Thiết kế và phát triển với niềm tự hào di sản văn hóa.</p>
            </div>
          </div>

          <div className={styles.bottomOrnament}>
            <div className={styles.bottomDividerRight} />
            <span className={styles.ornamentSymbol}>✧</span>
          </div>
        </div>
      </div>
    </section>
  );
}
