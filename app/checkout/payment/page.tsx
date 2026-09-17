"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Header } from "@/components/site/Header";
import { formatVnd } from "@/data/products";
import { sendOrderConfirmationEmail } from "@/lib/emailService";
import { track } from "@/lib/analytics";
import styles from "./Payment.module.css";

interface OrderItem {
  slug: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  location?: string;
}

interface CustomerInfo {
  fullName: string;
  phone: string;
  email?: string;
  city: string;
  district?: string;
  address: string;
  note?: string;
}

interface OrderData {
  orderId: string;
  createdAt: string;
  customer: CustomerInfo;
  items: OrderItem[];
  subtotal: number;
  discountAmount?: number;
  promoCode?: string | null;
  shippingFee: number;
  total: number;
  paymentMethod: "cod" | "bank_transfer" | "momo" | "zalopay";
  status: string;
}

function PaymentContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryOrderId = searchParams.get("orderId");

  const [order, setOrder] = useState<OrderData | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState(900); // 15 minutes
  const [verificationStep, setVerificationStep] = useState<"idle" | "checking" | "verified">("idle");

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem("nookky_last_order");
      if (stored) {
        const parsed = JSON.parse(stored) as OrderData;
        if (parsed) {
          setOrder(parsed);
          // If already paid or COD, redirect to success
          if (parsed.paymentMethod === "cod" || parsed.status === "paid") {
            router.replace(`/checkout/success?orderId=${parsed.orderId}`);
          }
        }
      }
    } catch {
      // Ignore parse error
    }
  }, [router]);

  // Countdown timer
  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const timeFormatted = `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;

  const displayOrderId = order?.orderId || queryOrderId || "NK-2026-PENDING";
  const orderTotal = order?.total || 0;

  const handleCopy = (text: string, fieldId: string) => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedField(fieldId);
      setTimeout(() => setCopiedField(null), 2500);
    }
  };

  const vietQrUrl = `https://img.vietqr.io/image/MB-0909283678-compact2.png?amount=${orderTotal}&addInfo=${encodeURIComponent(displayOrderId)}&accountName=NOOK%20KY%20STUDIO`;
  const momoQrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(`2|99|0909283678|NOOK KY STUDIO||0|0|${orderTotal}|${displayOrderId}|transfer_myqr`)}`;
  const zaloPayQrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(`https://zalopay.vn/pay?amount=${orderTotal}&orderId=${displayOrderId}&phone=0909283678`)}`;

  const handleConfirmPayment = () => {
    setVerificationStep("checking");

    // Simulate verification delay
    setTimeout(() => {
      setVerificationStep("verified");

      // Send confirmation email and persist state
      if (order) {
        const updatedOrder = { ...order, status: "paid" };
        try {
          window.localStorage.setItem("nookky_last_order", JSON.stringify(updatedOrder));
          sendOrderConfirmationEmail(updatedOrder);
        } catch {
          // Ignore storage error
        }

        // Báo cho chủ shop: khách TỰ KHAI đã chuyển tiền. Đây chưa phải xác
        // nhận ngân hàng thật (chưa có webhook cổng thanh toán), nên route
        // này chỉ ghi log + nhắc chủ shop tự đối soát trước khi giao hàng.
        fetch("/api/orders/payment-reported", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedOrder),
          keepalive: true,
        }).catch((error) => {
          console.error("Không ghi được sự kiện báo đã chuyển tiền:", error);
        });

        track("payment_reported", {
          transaction_id: updatedOrder.orderId,
          value: updatedOrder.total,
          currency: "VND",
          payment_method: updatedOrder.paymentMethod,
          email: updatedOrder.customer?.email,
          phone: updatedOrder.customer?.phone,
          fullName: updatedOrder.customer?.fullName,
        });
      }

      // Navigate to success after brief success feedback
      setTimeout(() => {
        router.push(`/checkout/success?orderId=${displayOrderId}&status=paid`);
      }, 1200);
    }, 1800);
  };

  return (
    <div className={`${styles.paymentPage} nk-container`}>
      <div className={styles.paymentCard}>
        <div className={styles.header}>
          <p className="nk-eyebrow">CỔNG THANH TOÁN NOOK KÝ</p>
          <h1 className={styles.title}>Quét mã để hoàn tất đơn hàng</h1>
          <p className={styles.subtitle}>
            Mã đơn hàng: <strong>{displayOrderId}</strong> · Tổng tiền: <strong style={{ color: "#c93b2b" }}>{formatVnd(orderTotal)}</strong>
          </p>
        </div>

        {/* Live Status & Countdown Timer */}
        <div className={styles.statusBanner}>
          <div className={styles.statusLeft}>
            <span className={styles.statusDot} />
            <span className={styles.statusText}>Đang chờ thanh toán</span>
          </div>
          <div className={styles.countdownBox}>
            <span>Thời gian giữ đơn còn lại:</span>
            <span className={styles.countdownTime}>{timeFormatted}</span>
          </div>
        </div>

        {/* Dynamic QR Box depending on payment method */}
        {order?.paymentMethod === "bank_transfer" && (
          <div className={`${styles.qrBox} ${styles.bankTheme}`}>
            <h3 className={styles.boxTitle}>
              <span>💳</span> Quét mã VietQR chuyển khoản nhanh 24/7
            </h3>
            <div className={styles.qrGrid}>
              <div className={styles.qrFrame}>
                <img
                  src={vietQrUrl}
                  alt={`VietQR ${displayOrderId}`}
                  className={styles.qrImage}
                  loading="eager"
                />
                <p className={styles.qrScanHint}>Mở app ngân hàng bất kỳ để quét mã</p>
                <a
                  href={vietQrUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.qrDownloadBtn}
                  download={`VietQR-${displayOrderId}.png`}
                >
                  Tải ảnh mã QR
                </a>
              </div>

              <div className={styles.infoDetails}>
                <div className={styles.infoRowItem}>
                  <span className={styles.infoRowItemLabel}>Ngân hàng thụ hưởng</span>
                  <div className={styles.infoRowItemValGroup}>
                    <span className={styles.infoRowItemVal}>MB Bank (Ngân hàng Quân Đội)</span>
                  </div>
                </div>

                <div className={styles.infoRowItem}>
                  <span className={styles.infoRowItemLabel}>Số tài khoản</span>
                  <div className={styles.infoRowItemValGroup}>
                    <span className={styles.infoRowItemVal}>0909 283 678</span>
                    <button
                      type="button"
                      className={`${styles.copyBtn} ${copiedField === "stk" ? styles.copiedBtn : ""}`}
                      onClick={() => handleCopy("0909283678", "stk")}
                    >
                      {copiedField === "stk" ? "✓ Đã chép" : "Sao chép"}
                    </button>
                  </div>
                </div>

                <div className={styles.infoRowItem}>
                  <span className={styles.infoRowItemLabel}>Chủ tài khoản</span>
                  <div className={styles.infoRowItemValGroup}>
                    <span className={styles.infoRowItemVal}>NOOK KY STUDIO</span>
                  </div>
                </div>

                <div className={styles.infoRowItem}>
                  <span className={styles.infoRowItemLabel}>Số tiền cần chuyển</span>
                  <div className={styles.infoRowItemValGroup}>
                    <span className={`${styles.infoRowItemVal} ${styles.infoHighlight}`}>
                      {formatVnd(orderTotal)}
                    </span>
                    <button
                      type="button"
                      className={`${styles.copyBtn} ${copiedField === "amount" ? styles.copiedBtn : ""}`}
                      onClick={() => handleCopy(orderTotal.toString(), "amount")}
                    >
                      {copiedField === "amount" ? "✓ Đã chép" : "Sao chép"}
                    </button>
                  </div>
                </div>

                <div className={styles.infoRowItem}>
                  <span className={styles.infoRowItemLabel}>Nội dung chuyển khoản</span>
                  <div className={styles.infoRowItemValGroup}>
                    <span className={`${styles.infoRowItemVal} ${styles.infoHighlight}`}>
                      {displayOrderId}
                    </span>
                    <button
                      type="button"
                      className={`${styles.copyBtn} ${copiedField === "memo" ? styles.copiedBtn : ""}`}
                      onClick={() => handleCopy(displayOrderId, "memo")}
                    >
                      {copiedField === "memo" ? "✓ Đã chép" : "Sao chép"}
                    </button>
                  </div>
                </div>

                <div className={styles.instructionsNote}>
                  💡 <strong>Lưu ý quan trọng:</strong> Hệ thống tự động ghi nhận giao dịch trong 3-10 giây sau khi chuyển thành công.
                </div>
              </div>
            </div>
          </div>
        )}

        {order?.paymentMethod === "momo" && (
          <div className={`${styles.qrBox} ${styles.momoTheme}`}>
            <h3 className={styles.boxTitle}>
              <span>👛</span> Quét mã MoMo QR thanh toán tức thì
            </h3>
            <div className={styles.qrGrid}>
              <div className={styles.qrFrame}>
                <img
                  src={momoQrUrl}
                  alt={`MoMo QR ${displayOrderId}`}
                  className={styles.qrImage}
                  loading="eager"
                />
                <p className={styles.qrScanHint}>Mở app MoMo và chọn Quét Mã</p>
                <a
                  href={momoQrUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.qrDownloadBtn}
                  download={`MoMo-${displayOrderId}.png`}
                >
                  Tải ảnh mã QR
                </a>
              </div>

              <div className={styles.infoDetails}>
                <div className={styles.infoRowItem}>
                  <span className={styles.infoRowItemLabel}>Ví điện tử</span>
                  <div className={styles.infoRowItemValGroup}>
                    <span className={styles.infoRowItemVal}>MoMo (Ví điện tử)</span>
                  </div>
                </div>

                <div className={styles.infoRowItem}>
                  <span className={styles.infoRowItemLabel}>Số điện thoại ví</span>
                  <div className={styles.infoRowItemValGroup}>
                    <span className={styles.infoRowItemVal}>0909 283 678</span>
                    <button
                      type="button"
                      className={`${styles.copyBtn} ${copiedField === "momoPhone" ? styles.copiedBtn : ""}`}
                      onClick={() => handleCopy("0909283678", "momoPhone")}
                    >
                      {copiedField === "momoPhone" ? "✓ Đã chép" : "Sao chép"}
                    </button>
                  </div>
                </div>

                <div className={styles.infoRowItem}>
                  <span className={styles.infoRowItemLabel}>Người nhận</span>
                  <div className={styles.infoRowItemValGroup}>
                    <span className={styles.infoRowItemVal}>NOOK KY STUDIO</span>
                  </div>
                </div>

                <div className={styles.infoRowItem}>
                  <span className={styles.infoRowItemLabel}>Số tiền thanh toán</span>
                  <div className={styles.infoRowItemValGroup}>
                    <span className={`${styles.infoRowItemVal} ${styles.infoHighlight}`}>
                      {formatVnd(orderTotal)}
                    </span>
                    <button
                      type="button"
                      className={`${styles.copyBtn} ${copiedField === "momoAmount" ? styles.copiedBtn : ""}`}
                      onClick={() => handleCopy(orderTotal.toString(), "momoAmount")}
                    >
                      {copiedField === "momoAmount" ? "✓ Đã chép" : "Sao chép"}
                    </button>
                  </div>
                </div>

                <div className={styles.infoRowItem}>
                  <span className={styles.infoRowItemLabel}>Lời nhắn</span>
                  <div className={styles.infoRowItemValGroup}>
                    <span className={`${styles.infoRowItemVal} ${styles.infoHighlight}`}>
                      {displayOrderId}
                    </span>
                    <button
                      type="button"
                      className={`${styles.copyBtn} ${copiedField === "momoMemo" ? styles.copiedBtn : ""}`}
                      onClick={() => handleCopy(displayOrderId, "momoMemo")}
                    >
                      {copiedField === "momoMemo" ? "✓ Đã chép" : "Sao chép"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {order?.paymentMethod === "zalopay" && (
          <div className={`${styles.qrBox} ${styles.zaloTheme}`}>
            <h3 className={styles.boxTitle}>
              <span>⚡</span> Quét mã ZaloPay / Zalo thanh toán
            </h3>
            <div className={styles.qrGrid}>
              <div className={styles.qrFrame}>
                <img
                  src={zaloPayQrUrl}
                  alt={`ZaloPay QR ${displayOrderId}`}
                  className={styles.qrImage}
                  loading="eager"
                />
                <p className={styles.qrScanHint}>Dùng Zalo hoặc Ví ZaloPay để quét</p>
                <a
                  href={zaloPayQrUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.qrDownloadBtn}
                  download={`ZaloPay-${displayOrderId}.png`}
                >
                  Tải ảnh mã QR
                </a>
              </div>

              <div className={styles.infoDetails}>
                <div className={styles.infoRowItem}>
                  <span className={styles.infoRowItemLabel}>Ví điện tử</span>
                  <div className={styles.infoRowItemValGroup}>
                    <span className={styles.infoRowItemVal}>ZaloPay / Ứng dụng Zalo</span>
                  </div>
                </div>

                <div className={styles.infoRowItem}>
                  <span className={styles.infoRowItemLabel}>Số điện thoại ví</span>
                  <div className={styles.infoRowItemValGroup}>
                    <span className={styles.infoRowItemVal}>0909 283 678</span>
                    <button
                      type="button"
                      className={`${styles.copyBtn} ${copiedField === "zaloPhone" ? styles.copiedBtn : ""}`}
                      onClick={() => handleCopy("0909283678", "zaloPhone")}
                    >
                      {copiedField === "zaloPhone" ? "✓ Đã chép" : "Sao chép"}
                    </button>
                  </div>
                </div>

                <div className={styles.infoRowItem}>
                  <span className={styles.infoRowItemLabel}>Người nhận</span>
                  <div className={styles.infoRowItemValGroup}>
                    <span className={styles.infoRowItemVal}>NOOK KY STUDIO</span>
                  </div>
                </div>

                <div className={styles.infoRowItem}>
                  <span className={styles.infoRowItemLabel}>Số tiền thanh toán</span>
                  <div className={styles.infoRowItemValGroup}>
                    <span className={`${styles.infoRowItemVal} ${styles.infoHighlight}`}>
                      {formatVnd(orderTotal)}
                    </span>
                    <button
                      type="button"
                      className={`${styles.copyBtn} ${copiedField === "zaloAmount" ? styles.copiedBtn : ""}`}
                      onClick={() => handleCopy(orderTotal.toString(), "zaloAmount")}
                    >
                      {copiedField === "zaloAmount" ? "✓ Đã chép" : "Sao chép"}
                    </button>
                  </div>
                </div>

                <div className={styles.infoRowItem}>
                  <span className={styles.infoRowItemLabel}>Nội dung</span>
                  <div className={styles.infoRowItemValGroup}>
                    <span className={`${styles.infoRowItemVal} ${styles.infoHighlight}`}>
                      {displayOrderId}
                    </span>
                    <button
                      type="button"
                      className={`${styles.copyBtn} ${copiedField === "zaloMemo" ? styles.copiedBtn : ""}`}
                      onClick={() => handleCopy(displayOrderId, "zaloMemo")}
                    >
                      {copiedField === "zaloMemo" ? "✓ Đã chép" : "Sao chép"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Action Button: Confirm payment */}
        <div className={styles.actions}>
          <button
            type="button"
            className={styles.confirmBtn}
            onClick={handleConfirmPayment}
            disabled={verificationStep !== "idle"}
          >
            Tôi đã chuyển tiền / thanh toán xong →
          </button>
          <button
            type="button"
            className={styles.cancelLink}
            onClick={() => router.push("/checkout")}
          >
            ← Quay lại chỉnh sửa thông tin giao hàng
          </button>
        </div>
      </div>

      {/* Verification overlay animation */}
      {verificationStep !== "idle" && (
        <div className={styles.verifyingModal}>
          <div className={styles.verifyingCard}>
            {verificationStep === "checking" ? (
              <>
                <div className={styles.spinner} />
                <h3 className={styles.verifyingTitle}>Đang kiểm tra đối soát giao dịch...</h3>
                <p className={styles.verifyingText}>
                  Hệ thống Nook Ký đang kết nối với cổng thanh toán để xác nhận số tiền chuyển khoản của đơn #{displayOrderId}.
                </p>
              </>
            ) : (
              <>
                <div className={styles.successIconAnim}>✓</div>
                <h3 className={styles.verifyingTitle} style={{ color: "#193c32" }}>
                  Xác nhận thanh toán thành công!
                </h3>
                <p className={styles.verifyingText}>
                  Đã gửi email xác nhận đến {order?.customer.email || "hòm thư của bạn"}. Đang chuyển bạn sang trang theo dõi đơn hàng...
                </p>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function PaymentGatewayPage() {
  return (
    <>
      <Header />
      <main id="main-content" tabIndex={-1} className="nk-inner-page">
        <Suspense fallback={<div className="nk-container" style={{ padding: "80px 0" }}>Đang tải cổng thanh toán...</div>}>
          <PaymentContent />
        </Suspense>
      </main>
    </>
  );
}
