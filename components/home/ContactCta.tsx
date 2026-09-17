"use client";

import { useState } from "react";
import { track } from "@/lib/analytics";
import styles from "./ContactCta.module.css";

export function ContactCta() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    interest: "corporate",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email) return;
    track("newsletter_subscribe", {
      name: formData.name,
      email: formData.email,
      interest: formData.interest,
      message: formData.message,
    });
    setSubmitted(true);
  };

  return (
    <section
      className={styles.ctaSection}
      id="lien-he-tu-van"
      aria-labelledby="nk-contact-title"
    >
      <div className={styles.innerContainer}>
        {/* Left Column: Brand Connection & Perks */}
        <div className={styles.infoCol} data-nk-reveal="left" data-nk-delay="1">
          <h2 id="nk-contact-title" className={styles.title}>
            <span className={styles.titleLine1}>
              Đem một góc <span className={styles.goldText}>ký ức</span>
            </span>
            <span className={styles.titleLine2}>
              vào <span className={styles.accentWord}>không gian</span> của bạn.
            </span>
          </h2>
          <p className={styles.desc}>
            Đăng ký để nhận sớm thông tin về <strong className={styles.goldEmphasis}>bộ sưu tập mới</strong>, <strong className={styles.goldEmphasis}>ưu đãi đặc biệt</strong> hoặc trao đổi hợp tác, đặt hàng <strong className={styles.goldEmphasis}>quà tặng doanh nghiệp</strong> và <strong className={styles.goldEmphasis}>dự án thiết kế theo yêu cầu</strong>.
          </p>

          <div className={styles.contactPerks}>
            {/* Perk 1 */}
            <div className={styles.perk} data-nk-reveal data-nk-delay="2">
              <div className={styles.perkIcon}>
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="3" y="8" width="18" height="4" rx="1" />
                  <path d="M12 8v13" />
                  <path d="M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7" />
                  <path d="M7.5 8a2.5 2.5 0 0 1 0-5A4.8 8 0 0 1 12 8a4.8 8 0 0 1 4.5-5 2.5 2.5 0 0 1 0 5" />
                </svg>
              </div>
              <div className={styles.perkText}>
                <strong className={styles.perkTitle}>Ưu đãi riêng</strong>
                <span className={styles.perkSub}>
                  Dành cho khách đăng ký sớm
                </span>
              </div>
            </div>

            {/* Perk 2 */}
            <div className={styles.perk} data-nk-reveal data-nk-delay="3">
              <div className={styles.perkIcon}>
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
              </div>
              <div className={styles.perkText}>
                <strong className={styles.perkTitle}>Bảo hành trọn đời</strong>
                <span className={styles.perkSub}>
                  Đèn và linh kiện, yên tâm sử dụng
                </span>
              </div>
            </div>

            {/* Perk 3 */}
            <div className={styles.perk} data-nk-reveal data-nk-delay="4">
              <div className={styles.perkIcon}>
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
                  <line x1="8" y1="12" x2="8" y2="12.01" />
                  <line x1="12" y1="12" x2="12" y2="12.01" />
                  <line x1="16" y1="12" x2="16" y2="12.01" />
                </svg>
              </div>
              <div className={styles.perkText}>
                <strong className={styles.perkTitle}>Tư vấn trực tiếp</strong>
                <span className={styles.perkSub}>
                  Từ đội ngũ nghệ nhân Nook Ký
                </span>
              </div>
            </div>
          </div>

          {/* Bottom Quote */}
          <div className={styles.bottomQuoteWrap} aria-hidden="true" data-nk-reveal data-nk-delay="5">
            <p className={styles.bottomQuote}>
              “Những điều nhỏ bé
              <br />
              cũng có thể lưu giữ cả một thời thanh xuân.”
            </p>
          </div>
        </div>

        {/* Right Column: Glassmorphism Form */}
        <div className={styles.formCol} data-nk-reveal="right" data-nk-delay="2">
          <div className={styles.formHeader}>
            <h3 className={styles.formTitle}>
              Gửi thông tin cho <span className={styles.formTitleBrand}>Nook Ký</span>
            </h3>
            <p className={styles.formSubtitle}>
              Chúng tôi sẽ phản hồi sớm nhất để cùng bạn
              <br />
              hiện thực hóa những <span className={styles.formSubGold}>ý tưởng ý nghĩa</span>.
            </p>
          </div>

          {submitted ? (
            <div className={styles.successBox}>
              <div className={styles.successIcon}>✓</div>
              <h4 className={styles.successTitle}>
                Cảm ơn bạn đã kết nối cùng Nook Ký!
              </h4>
              <p className={styles.successDesc}>
                Chúng tôi đã ghi nhận thông tin và sẽ gửi phản hồi cùng ưu đãi
                riêng qua email của bạn trong thời gian sớm nhất.
              </p>
              <button
                type="button"
                className={styles.resetBtn}
                onClick={() => setSubmitted(false)}
              >
                Gửi thêm lời nhắn khác
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.inputGroup}>
                <label htmlFor="user-name">Họ và tên của bạn</label>
                <input
                  id="user-name"
                  type="text"
                  required
                  placeholder="Ví dụ: Nguyễn An"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="user-email">Địa chỉ Email</label>
                <input
                  id="user-email"
                  type="email"
                  required
                  placeholder="ban@example.com"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="user-interest">Bạn quan tâm đến điều gì?</label>
                <div className={styles.selectWrapper}>
                  <select
                    id="user-interest"
                    value={formData.interest}
                    onChange={(e) =>
                      setFormData({ ...formData, interest: e.target.value })
                    }
                  >
                    <option value="corporate">
                      Quà tặng doanh nghiệp / Đối tác
                    </option>
                    <option value="custom">
                      Thiết kế Book Nook theo yêu cầu
                    </option>
                    <option value="buying">
                      Mua lẻ sản phẩm / Nhận ưu đãi sớm
                    </option>
                    <option value="collaborate">
                      Hợp tác nghệ thuật & truyền thông
                    </option>
                  </select>
                </div>
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="user-msg">
                  Lời nhắn hoặc câu hỏi (không bắt buộc)
                </label>
                <textarea
                  id="user-msg"
                  rows={2}
                  placeholder="Bạn muốn chia sẻ điều gì với Nook Ký?"
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                />
              </div>

              <button type="submit" className={styles.submitBtn}>
                <span>Gửi thông tin kết nối</span>
                <span aria-hidden="true">&rarr;</span>
              </button>

              <div className={styles.privacyNote}>
                <svg
                  width="13"
                  height="13"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
                <span>
                  Thông tin của bạn được bảo mật và chỉ sử dụng cho mục đích
                  liên hệ.
                </span>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
