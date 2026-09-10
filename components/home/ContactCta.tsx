"use client";

import { useState } from "react";
import { track } from "@/lib/analytics";
import styles from "./ContactCta.module.css";

export function ContactCta() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    interest: "buying",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email) return;
    track("newsletter_subscribe", { interest: formData.interest });
    setSubmitted(true);
  };

  return (
    <section className={styles.ctaSection} id="contact-community" aria-labelledby="nk-contact-title">
      <div className="nk-container">
        <div className={styles.ctaCard}>
          {/* Left Column: Brand Invitation */}
          <div className={styles.infoCol}>
            <p className="nk-eyebrow">KẾT NỐI & ĐỒNG HÀNH</p>
            <h2 id="nk-contact-title" className={styles.title}>
              Đem một góc ký ức<br />vào không gian của bạn.
            </h2>
            <p className={styles.desc}>
              Đăng ký để nhận sớm bản tin ra mắt các thế giới Nook Ký mới, cẩm nang lắp ráp độc quyền hoặc gửi yêu cầu đặt hàng quà tặng doanh nghiệp & hợp tác thiết kế.
            </p>

            <div className={styles.contactPerks}>
              <div className={styles.perk}>
                <span className={styles.perkBullet}>—</span>
                <span>Ưu đãi 10% cho đơn hàng đầu tiên</span>
              </div>
              <div className={styles.perk}>
                <span className={styles.perkBullet}>—</span>
                <span>Bảo hành bóng đèn & linh kiện trọn đời</span>
              </div>
              <div className={styles.perk}>
                <span className={styles.perkBullet}>—</span>
                <span>Hỗ trợ tư vấn trực tiếp từ nghệ nhân</span>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Form */}
          <div className={styles.formCol}>
            {submitted ? (
              <div className={styles.successBox}>
                <div className={styles.successSeal}>HOÀN TẤT</div>
                <h3>Cảm ơn bạn đã kết nối cùng Nook Ký!</h3>
                <p>Chúng tôi đã ghi nhận thông tin và sẽ gửi quà tặng chào mừng cùng câu chuyện nơi chốn qua email của bạn sớm nhất.</p>
                <button
                  type="button"
                  className="nk-button nk-button--light"
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
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>

                <div className={styles.inputGroup}>
                  <label htmlFor="user-interest">Bạn quan tâm đến điều gì?</label>
                  <select
                    id="user-interest"
                    value={formData.interest}
                    onChange={(e) => setFormData({ ...formData, interest: e.target.value })}
                  >
                    <option value="buying">Mua lẻ sản phẩm / Nhận ưu đãi</option>
                    <option value="custom">Đặt làm Nook theo yêu cầu riêng</option>
                    <option value="corporate">Quà tặng doanh nghiệp / Đối tác</option>
                    <option value="collaborate">Hợp tác nghệ thuật & truyền thông</option>
                  </select>
                </div>

                <div className={styles.inputGroup}>
                  <label htmlFor="user-msg">Lời nhắn hoặc câu hỏi (không bắt buộc)</label>
                  <textarea
                    id="user-msg"
                    rows={3}
                    placeholder="Bạn muốn lưu giữ ký ức về vùng đất nào?"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  />
                </div>

                <button type="submit" className={`nk-button ${styles.submitBtn}`}>
                  Gửi thông tin kết nối
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
