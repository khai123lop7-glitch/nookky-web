"use client";

import styles from "./BrandStory.module.css";

export function BrandStory() {
  return (
    <section
      className={styles.giftSection}
      data-nk-scene
      data-nk-gift-scene
      aria-labelledby="gift-heading"
    >
      <div className={styles.bgWrapper} aria-hidden="true">
        <img
          src="/media/editorial/corporate-gifts-product.webp"
          alt="Quà tặng doanh nghiệp Nook Ký"
          className={styles.bgImage}
          data-nk-parallax
          data-nk-parallax-speed="0.05"
        />
        <div className={styles.mediaRibbon}>
          <span>Một góc Việt trong từng món quà</span>
          <i />
        </div>
      </div>
      <div className={styles.seal} aria-hidden="true">TINH<br />HOA<br />VIỆT</div>
      <p className={styles.sideNote} aria-hidden="true">THỦ CÔNG KẾT NỐI KÝ ỨC VIỆT</p>
      <svg className={styles.landscape} viewBox="0 0 800 150" preserveAspectRatio="none" aria-hidden="true">
        <path d="M0 118 75 106 135 112 212 91 272 104 345 75 395 93 467 68 525 92 595 79 650 95 720 83 800 111v39H0Z" fill="currentColor" opacity=".28" />
        <path d="M0 133c107-8 205 8 307 0s220-2 325 0 130 3 168-3M0 142c96-4 169 3 264 1s178-4 286 0 179 2 250-1" fill="none" stroke="currentColor" strokeWidth="2" opacity=".32" />
        <path d="M609 119c19 5 39 5 58 0l-8 8h-43zM636 119V84l23 31h-23" fill="currentColor" opacity=".55" />
        <path d="M-5 103C35 80 58 49 96 13M13 91C9 59 16 48 39 41c7 24-2 38-26 50ZM38 70c0-29 10-44 39-45-1 26-13 41-39 45ZM63 48C57 24 68 9 92 3c7 22-3 39-29 45Z" fill="currentColor" opacity=".6" />
      </svg>

      {/* Content Container aligned on the left with Scroll Reveal */}
      <div className={styles.contentContainer}>
        {/* Eyebrow */}
        <p className={styles.eyebrow} data-nk-reveal data-nk-delay="1">
          CUSTOM GIFTS
        </p>

        {/* Main Heading */}
        <h2 id="gift-heading" className={styles.heading} data-nk-reveal data-nk-delay="2">
          <span className={styles.headingLine1}>Quà tặng mang</span>
          <span className={styles.headingLine2}>
            <em>dấu ấn</em> Việt Nam.
          </span>
        </h2>

        {/* Description */}
        <p className={styles.description} data-nk-reveal data-nk-delay="3">
          Những món quà thủ công tinh tế, kể câu chuyện văn hoá Việt Nam thông
          qua ánh sáng, kiến trúc và ký ức. Lựa chọn ý nghĩa dành cho đối tác, sự
          kiện và những dịp đặc biệt.
        </p>

        {/* Feature Grid / 3 Pillars */}
        <div className={styles.featuresGrid} data-nk-reveal data-nk-delay="4">
          {/* Feature 1 */}
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </div>
            <h3 className={styles.featureTitle}>Quà tặng đối tác</h3>
            <p className={styles.featureDesc}>
              Tinh tế, khác biệt, thể hiện sự trân trọng.
            </p>
          </div>

          {/* Feature 2 */}
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="3" y="8" width="18" height="4" rx="1" />
                <path d="M12 8v13" />
                <path d="M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7" />
                <path d="M7.5 8a2.5 2.5 0 0 1 0-5A4.8 8 0 0 1 12 8a4.8 8 0 0 1 4.5-5 2.5 2.5 0 0 1 0 5" />
              </svg>
            </div>
            <h3 className={styles.featureTitle}>Bộ quà cho sự kiện</h3>
            <p className={styles.featureDesc}>
              Giải pháp quà tặng đồng bộ, mang bản sắc Việt.
            </p>
          </div>

          {/* Feature 3 */}
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                <path d="m15 5 4 4" />
              </svg>
            </div>
            <h3 className={styles.featureTitle}>Thiết kế theo yêu cầu</h3>
            <p className={styles.featureDesc}>
              Cá nhân hoá ý tưởng, thổi hồn câu chuyện riêng của bạn.
            </p>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className={styles.ctaGroup} data-nk-reveal data-nk-delay="5">
          <a href="#lien-he-tu-van" className={styles.primaryBtn}>
            <span>Nhận tư vấn</span>
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </a>

          <a href="#quy-trinh-che-tac" className={styles.secondaryBtn}>
            <span>Xem quy trình</span>
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="3" width="7" height="7" />
              <rect x="14" y="3" width="7" height="7" />
              <rect x="14" y="14" width="7" height="7" />
              <rect x="3" y="14" width="7" height="7" />
            </svg>
          </a>
        </div>

        {/* Bottom Quote */}
        <div className={styles.quoteWrap} data-nk-reveal data-nk-delay="5">
          <p className={styles.quoteText}>
            “Những món quà nhỏ
            <br />
            có thể kể những câu chuyện lớn.”
          </p>
        </div>
      </div>
    </section>
  );
}
