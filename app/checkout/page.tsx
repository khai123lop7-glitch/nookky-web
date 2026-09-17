"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/site/Header";
import { formatVnd, products } from "@/data/products";
import { track } from "@/lib/analytics";
import { useCart } from "@/components/commerce/CartProvider";
import { PromoBox } from "@/components/commerce/PromoBox";
import {
  CENTRAL_CITIES,
  OTHER_PROVINCES,
  DISTRICTS_BY_PROVINCE,
} from "@/data/vietnamLocations";
import { sendOrderConfirmationEmail } from "@/lib/emailService";
import styles from "./CheckoutForm.module.css";

type PaymentMethod = "cod" | "bank_transfer" | "momo" | "zalopay";

export default function CheckoutPage() {
  const router = useRouter();
  const {
    items,
    clearCart,
    hydrated,
    appliedPromo,
    discountAmount,
    isFreeShipping,
  } = useCart();

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [city, setCity] = useState("");
  const [district, setDistrict] = useState("");
  const [address, setAddress] = useState("");
  const [note, setNote] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cod");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const currentDistricts = city ? DISTRICTS_BY_PROVINCE[city] || [] : [];

  const lines = items
    .map((item) => {
      const product = products.find((entry) => entry.slug === item.slug);
      return product ? { ...item, product } : null;
    })
    .filter((line): line is NonNullable<typeof line> => Boolean(line));

  const subtotal = lines.reduce((sum, line) => sum + line.product.price * line.quantity, 0);
  const shippingFee = isFreeShipping || subtotal === 0 ? 0 : 30000;
  const total = Math.max(0, subtotal - discountAmount) + shippingFee;

  useEffect(() => {
    if (hydrated && lines.length > 0) {
      track("begin_checkout", {
        item_count: lines.length,
        value: total,
        currency: "VND",
      });
    }
  }, [hydrated, lines.length, total]);

  const validate = () => {
    const nextErrors: Record<string, string> = {};
    if (!fullName.trim()) nextErrors.fullName = "Vui lòng nhập họ và tên";
    if (!phone.trim()) {
      nextErrors.phone = "Vui lòng nhập số điện thoại";
    } else if (!/(03|05|07|08|09|01[2|6|8|9])+([0-9]{8})\b/.test(phone.trim())) {
      nextErrors.phone = "Số điện thoại không hợp lệ (10 chữ số)";
    }
    if (!address.trim()) nextErrors.address = "Vui lòng nhập địa chỉ nhận hàng cụ thể";
    if (!city.trim()) nextErrors.city = "Vui lòng chọn Tỉnh/Thành phố";

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    if (lines.length === 0) return;

    setSubmitting(true);
    const orderId = `NK-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;

    const orderData = {
      orderId,
      createdAt: new Date().toISOString(),
      customer: {
        fullName: fullName.trim(),
        phone: phone.trim(),
        email: email.trim(),
        city: city.trim(),
        district: district.trim(),
        address: address.trim(),
        note: note.trim(),
      },
      items: lines.map((l) => ({
        slug: l.product.slug,
        name: l.product.name,
        price: l.product.price,
        quantity: l.quantity,
        image: l.product.media.cover,
        location: l.product.location,
      })),
      subtotal,
      discountAmount,
      promoCode: appliedPromo?.code || null,
      shippingFee,
      total,
      paymentMethod,
      status: paymentMethod === "cod" ? "confirmed" : "awaiting_payment",
    };

    try {
      window.localStorage.setItem("nookky_last_order", JSON.stringify(orderData));
      if (paymentMethod === "cod") {
        sendOrderConfirmationEmail(orderData);
      }
    } catch {
      // Ignore localStorage write error if private browsing quota exceeded
    }

    // Ghi đơn hàng vào backend (Google Sheet) + báo cho chủ shop ngay lập tức.
    // localStorage ở trên chỉ phục vụ hiển thị lại đơn trên trình duyệt của
    // chính khách hàng đó; fetch này mới là nơi dữ liệu thực sự "thoát" khỏi
    // trình duyệt khách và đến được với chủ shop. Dùng keepalive để request
    // vẫn hoàn tất kể cả khi router.push() điều hướng trang ngay sau đó.
    fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(orderData),
      keepalive: true,
    }).catch((error) => {
      // Không chặn trải nghiệm khách hàng nếu ghi nhận nội bộ thất bại,
      // nhưng log lại để không âm thầm mất đơn.
      console.error("Không ghi được đơn hàng vào backend:", error);
    });

    track("purchase", {
      transaction_id: orderId,
      value: total,
      currency: "VND",
      shipping: shippingFee,
      item_count: lines.length,
      email: email.trim(),
      phone: phone.trim(),
      fullName: fullName.trim(),
      items: lines.map((l) => ({
        item_id: l.product.slug,
        item_name: l.product.name,
        price: l.product.price,
        quantity: l.quantity,
      })),
    });

    clearCart();
    if (paymentMethod === "cod") {
      router.push(`/checkout/success?orderId=${orderId}&status=confirmed`);
    } else {
      router.push(`/checkout/payment?orderId=${orderId}`);
    }
  };

  if (!hydrated) {
    return (
      <>
        <Header />
        <main className="nk-inner-page">
          <section className="nk-container" style={{ padding: "80px 0" }}>
            <p className="nk-eyebrow">THANH TOÁN</p>
            <h1>Đang tải thông tin đơn hàng...</h1>
          </section>
        </main>
      </>
    );
  }

  if (lines.length === 0) {
    return (
      <>
        <Header />
        <main className="nk-inner-page">
          <section className="nk-cart-shell nk-container">
            <p className="nk-eyebrow">THANH TOÁN</p>
            <h1>Giỏ hàng của bạn đang trống.</h1>
            <p>Vui lòng chọn ít nhất một tác phẩm Nook Ký để tiến hành đặt hàng.</p>
            <a className="nk-button" href="/shop">Khám phá bộ sưu tập →</a>
          </section>
        </main>
      </>
    );
  }

  return (
    <>
      <Header />
      <main id="main-content" tabIndex={-1} className="nk-inner-page">
        <div className={`${styles.checkoutPage} nk-container-wide`}>
          <header className={styles.header}>
            <p className="nk-eyebrow">ĐẶT HÀNG & THANH TOÁN</p>
            <h1>Hoàn tất góc nhỏ của bạn.</h1>
          </header>

          <form onSubmit={handleSubmit} noValidate>
            <div className={styles.layout}>
              {/* Form information */}
              <div className={styles.formSection}>
                {/* Step 1: Customer details */}
                <div className={styles.card}>
                  <h2 className={styles.cardTitle}>
                    <span className={styles.stepNumber}>1</span> Thông tin giao hàng
                  </h2>

                  <div className={styles.fieldsGrid}>
                    <div className={styles.field}>
                      <label className={styles.label} htmlFor="fullName">
                        Họ và tên <span className={styles.required}>*</span>
                      </label>
                      <input
                        id="fullName"
                        type="text"
                        className={`${styles.input} ${errors.fullName ? styles.inputError : ""}`}
                        placeholder="Nguyễn Văn A"
                        value={fullName}
                        onChange={(e) => {
                          setFullName(e.target.value);
                          if (errors.fullName) setErrors((prev) => ({ ...prev, fullName: "" }));
                        }}
                      />
                      {errors.fullName && <p className={styles.errorMessage}>{errors.fullName}</p>}
                    </div>

                    <div className={styles.field}>
                      <label className={styles.label} htmlFor="phone">
                        Số điện thoại <span className={styles.required}>*</span>
                      </label>
                      <input
                        id="phone"
                        type="tel"
                        className={`${styles.input} ${errors.phone ? styles.inputError : ""}`}
                        placeholder="0912 345 678"
                        value={phone}
                        onChange={(e) => {
                          setPhone(e.target.value);
                          if (errors.phone) setErrors((prev) => ({ ...prev, phone: "" }));
                        }}
                      />
                      {errors.phone && <p className={styles.errorMessage}>{errors.phone}</p>}
                    </div>

                    <div className={styles.fieldFull}>
                      <div className={styles.field}>
                        <label className={styles.label} htmlFor="email">
                          Email nhận xác nhận đơn hàng (không bắt buộc)
                        </label>
                        <input
                          id="email"
                          type="email"
                          className={styles.input}
                          placeholder="email@example.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className={styles.field}>
                      <label className={styles.label} htmlFor="city">
                        Tỉnh / Thành phố <span className={styles.required}>*</span>
                      </label>
                      <select
                        id="city"
                        className={`${styles.select} ${errors.city ? styles.inputError : ""}`}
                        value={city}
                        onChange={(e) => {
                          const newCity = e.target.value;
                          setCity(newCity);
                          setDistrict("");
                          if (errors.city) setErrors((prev) => ({ ...prev, city: "" }));
                        }}
                      >
                        <option value="">-- Chọn Tỉnh / Thành phố --</option>
                        <optgroup label="Thành phố trực thuộc Trung ương">
                          {CENTRAL_CITIES.map((c) => (
                            <option key={c} value={c}>
                              {c}
                            </option>
                          ))}
                        </optgroup>
                        <optgroup label="Các Tỉnh / Thành phố (A - Z)">
                          {OTHER_PROVINCES.map((p) => (
                            <option key={p} value={p}>
                              {p}
                            </option>
                          ))}
                        </optgroup>
                      </select>
                      {errors.city && <p className={styles.errorMessage}>{errors.city}</p>}
                    </div>

                    <div className={styles.field}>
                      <label className={styles.label} htmlFor="district">
                        Quận / Huyện
                      </label>
                      <input
                        id="district"
                        type="text"
                        list="district-list"
                        className={styles.input}
                        placeholder={
                          currentDistricts.length > 0
                            ? "Chọn hoặc nhập Quận / Huyện"
                            : "Quận / Huyện"
                        }
                        value={district}
                        onChange={(e) => setDistrict(e.target.value)}
                        autoComplete="off"
                      />
                      {currentDistricts.length > 0 && (
                        <datalist id="district-list">
                          {currentDistricts.map((d) => (
                            <option key={d} value={d} />
                          ))}
                        </datalist>
                      )}
                    </div>

                    <div className={styles.fieldFull}>
                      <div className={styles.field}>
                        <label className={styles.label} htmlFor="address">
                          Địa chỉ nhận hàng cụ thể <span className={styles.required}>*</span>
                        </label>
                        <input
                          id="address"
                          type="text"
                          className={`${styles.input} ${errors.address ? styles.inputError : ""}`}
                          placeholder="Số nhà, tên đường, ngõ ngách, toà nhà..."
                          value={address}
                          onChange={(e) => {
                            setAddress(e.target.value);
                            if (errors.address) setErrors((prev) => ({ ...prev, address: "" }));
                          }}
                        />
                        {errors.address && <p className={styles.errorMessage}>{errors.address}</p>}
                      </div>
                    </div>

                    <div className={styles.fieldFull}>
                      <div className={styles.field}>
                        <label className={styles.label} htmlFor="note">
                          Ghi chú đơn hàng (nếu có)
                        </label>
                        <textarea
                          id="note"
                          className={styles.textarea}
                          placeholder="Ghi chú về thời gian giao hàng hoặc chỉ dẫn thêm cho shipper..."
                          value={note}
                          onChange={(e) => setNote(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Step 2: Payment method */}
                <div className={styles.card}>
                  <h2 className={styles.cardTitle}>
                    <span className={styles.stepNumber}>2</span> Phương thức thanh toán
                  </h2>

                  <div className={styles.paymentOptions}>
                    <label
                      className={`${styles.paymentOption} ${paymentMethod === "cod" ? styles.paymentOptionActive : ""}`}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="cod"
                        className={styles.paymentRadio}
                        checked={paymentMethod === "cod"}
                        onChange={() => setPaymentMethod("cod")}
                      />
                      <div className={styles.paymentInfo}>
                        <div className={styles.paymentTitleRow}>
                          <span className={styles.paymentTitle}>Thanh toán khi nhận hàng (COD)</span>
                          <span className={`${styles.paymentBadge} ${styles.badgeCod}`}>Tiền mặt</span>
                        </div>
                        <span className={styles.paymentDesc}>
                          Nhận hàng, kiểm tra kiện hàng và thanh toán tiền mặt trực tiếp cho nhân viên giao vận.
                        </span>
                      </div>
                    </label>

                    <label
                      className={`${styles.paymentOption} ${paymentMethod === "bank_transfer" ? styles.paymentOptionActive : ""}`}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="bank_transfer"
                        className={styles.paymentRadio}
                        checked={paymentMethod === "bank_transfer"}
                        onChange={() => setPaymentMethod("bank_transfer")}
                      />
                      <div className={styles.paymentInfo}>
                        <div className={styles.paymentTitleRow}>
                          <span className={styles.paymentTitle}>Chuyển khoản ngân hàng 24/7 (VietQR)</span>
                          <span className={`${styles.paymentBadge} ${styles.badgeBank}`}>Mã QR</span>
                        </div>
                        <span className={styles.paymentDesc}>
                          Mã QR động tự động điền số tiền và nội dung. Hỗ trợ tất cả ứng dụng ngân hàng tại Việt Nam.
                        </span>
                        {paymentMethod === "bank_transfer" && (
                          <span className={styles.qrNotice}>
                            ✓ Mã QR thanh toán chuẩn VietQR sẽ hiển thị ngay khi xác nhận đơn
                          </span>
                        )}
                      </div>
                    </label>

                    <label
                      className={`${styles.paymentOption} ${paymentMethod === "momo" ? styles.paymentOptionActive : ""}`}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="momo"
                        className={styles.paymentRadio}
                        checked={paymentMethod === "momo"}
                        onChange={() => setPaymentMethod("momo")}
                      />
                      <div className={styles.paymentInfo}>
                        <div className={styles.paymentTitleRow}>
                          <span className={styles.paymentTitle}>Ví điện tử MoMo</span>
                          <span className={`${styles.paymentBadge} ${styles.badgeMomo}`}>MoMo QR</span>
                        </div>
                        <span className={styles.paymentDesc}>
                          Quét mã MoMo QR hoặc chuyển tiền trực tiếp qua ứng dụng MoMo chỉ trong 3 giây.
                        </span>
                        {paymentMethod === "momo" && (
                          <span className={styles.qrNotice}>
                            ✓ Mã QR ví MoMo sẽ hiển thị ngay khi xác nhận đơn
                          </span>
                        )}
                      </div>
                    </label>

                    <label
                      className={`${styles.paymentOption} ${paymentMethod === "zalopay" ? styles.paymentOptionActive : ""}`}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="zalopay"
                        className={styles.paymentRadio}
                        checked={paymentMethod === "zalopay"}
                        onChange={() => setPaymentMethod("zalopay")}
                      />
                      <div className={styles.paymentInfo}>
                        <div className={styles.paymentTitleRow}>
                          <span className={styles.paymentTitle}>Ví điện tử ZaloPay</span>
                          <span className={`${styles.paymentBadge} ${styles.badgeZalo}`}>ZaloPay QR</span>
                        </div>
                        <span className={styles.paymentDesc}>
                          Quét mã QR qua ví ZaloPay hoặc tính năng quét mã trực tiếp trên ứng dụng Zalo.
                        </span>
                        {paymentMethod === "zalopay" && (
                          <span className={styles.qrNotice}>
                            ✓ Mã QR ví ZaloPay sẽ hiển thị ngay khi xác nhận đơn
                          </span>
                        )}
                      </div>
                    </label>
                  </div>
                </div>
              </div>

              {/* Step 3: Order Summary Sidebar */}
              <aside className={styles.summaryCard} aria-label="Tóm tắt đơn hàng">
                <h2 className={styles.summaryTitle}>Đơn hàng ({lines.length} sản phẩm)</h2>

                <div className={styles.summaryItems}>
                  {lines.map(({ product, quantity }) => (
                    <div className={styles.summaryItem} key={product.slug}>
                      <div className={styles.summaryThumb}>
                        <img src={product.media.cover} alt={product.name} />
                      </div>
                      <div className={styles.summaryItemInfo}>
                        <p className={styles.summaryItemName}>{product.name}</p>
                        <p className={styles.summaryItemMeta}>
                          {product.location} · SL: {quantity}
                        </p>
                      </div>
                      <span className={styles.summaryItemPrice}>
                        {formatVnd(product.price * quantity)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className={styles.summaryCalculations}>
                  <div className={styles.calcRow}>
                    <span>Tạm tính</span>
                    <strong>{formatVnd(subtotal)}</strong>
                  </div>
                  {appliedPromo && discountAmount > 0 && (
                    <div className={styles.discountRow}>
                      <span>Ưu đãi ({appliedPromo.code})</span>
                      <strong>-{formatVnd(discountAmount)}</strong>
                    </div>
                  )}
                  <div className={styles.calcRow}>
                    <span>Phí vận chuyển</span>
                    {shippingFee === 0 ? (
                      <strong className={styles.freeShipText}>
                        Miễn phí (0₫) {appliedPromo?.type === "freeship" ? "(Mã FREESHIP)" : ""}
                      </strong>
                    ) : (
                      <strong>{formatVnd(shippingFee)}</strong>
                    )}
                  </div>
                </div>

                <PromoBox />

                <div className={styles.totalRow}>
                  <span>Tổng thanh toán</span>
                  <strong className={styles.totalAmount}>{formatVnd(total)}</strong>
                </div>

                <button
                  type="submit"
                  className={`nk-button ${styles.submitBtn}`}
                  disabled={submitting}
                >
                  {submitting ? "Đang xử lý đơn..." : "Xác nhận đặt hàng →"}
                </button>

                <p className={styles.securityNote}>
                  🔒 Thông tin của bạn được bảo mật tuyệt đối
                </p>
              </aside>
            </div>
          </form>
        </div>
      </main>
    </>
  );
}
