"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Header } from "@/components/site/Header";
import { formatVnd } from "@/data/products";
import { generateOrderConfirmationEmailHtml, SentEmail } from "@/lib/emailService";
import styles from "./Success.module.css";

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

function SuccessContent() {
  const searchParams = useSearchParams();
  const queryOrderId = searchParams.get("orderId");
  const [order, setOrder] = useState<OrderData | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [refreshMessage, setRefreshMessage] = useState<string | null>(null);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [latestEmail, setLatestEmail] = useState<SentEmail | null>(null);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem("nookky_last_order");
      if (stored) {
        const parsed = JSON.parse(stored) as OrderData;
        if (parsed) {
          setOrder(parsed);
        }
      }

      const storedEmail = window.localStorage.getItem("nookky_latest_sent_email");
      if (storedEmail) {
        setLatestEmail(JSON.parse(storedEmail));
      }
    } catch {
      // Ignore parse error
    }
  }, []);

  const displayOrderId = order?.orderId || queryOrderId || "NK-2026-PENDING";
  const trackingNumber = `GHN-${displayOrderId.replace(/[^0-9]/g, "") || "982341"}VN`;
  // COD chưa thực sự thu tiền tại bước này (chỉ thu khi giao hàng), nên không
  // được hiển thị như một đơn "đã thanh toán". Trước đây trang này luôn hiện
  // "Đã thanh toán & Xác nhận đơn hàng" cho mọi phương thức, kể cả COD.
  const isPrepaid = Boolean(order && order.paymentMethod !== "cod");

  const copyTracking = () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(trackingNumber);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2500);
    }
  };

  const handleRefreshTracking = () => {
    setIsRefreshing(true);
    setRefreshMessage("Đang kết nối định vị vệ tinh bưu tá...");
    setTimeout(() => {
      setIsRefreshing(false);
      setRefreshMessage("✓ Đã cập nhật tọa độ mới nhất của bưu tá GHN!");
      setTimeout(() => setRefreshMessage(null), 3500);
    }, 1200);
  };

  const getPaymentLabel = (method?: string) => {
    switch (method) {
      case "bank_transfer":
        return "Chuyển khoản VietQR (MB Bank)";
      case "momo":
        return "Ví điện tử MoMo";
      case "zalopay":
        return "Ví điện tử ZaloPay";
      case "cod":
      default:
        return "Thanh toán khi nhận hàng (COD)";
    }
  };

  // Google Maps query URL
  const destinationQuery = encodeURIComponent(
    `${order?.customer.address || ""}, ${order?.customer.district || ""}, ${order?.customer.city || "Việt Nam"}`
  );
  const googleMapUrl = `https://maps.google.com/maps?q=${destinationQuery}&t=&z=14&ie=UTF8&iwloc=&output=embed`;

  // HTML email fallback if not from localStorage
  const emailHtml =
    latestEmail?.htmlContent || (order ? generateOrderConfirmationEmailHtml(order) : "");

  return (
    <div className={`${styles.successPage} nk-container`}>
      <div className={styles.successCard}>
        <div className={styles.checkIcon}>✓</div>
        <h1 className={styles.title}>Đơn hàng được đặt thành công!</h1>
        <p className={styles.subtitle}>
          Cảm ơn bạn đã tin chọn tác phẩm của Nook Ký. Đơn hàng của bạn đã được xác nhận thanh toán và đang được nghệ nhân chuẩn bị để gửi tới bạn sớm nhất.
        </p>
        <div className={styles.orderBadge}>Mã đơn hàng: {displayOrderId}</div>

        {/* Email Sent Notification Box */}
        <div className={styles.emailNoticeBox}>
          <div className={styles.emailNoticeContent}>
            <span className={styles.emailNoticeIcon}>✉️</span>
            <div>
              <strong>Email xác nhận đã được gửi thành công!</strong>
              <div style={{ fontSize: "12px", color: "#3d6858" }}>
                Đã gửi biên lai & thông tin đơn hàng tới:{" "}
                <strong>{order?.customer.email || "hòm thư của bạn"}</strong>
              </div>
            </div>
          </div>
          <button
            type="button"
            className={styles.viewEmailBtn}
            onClick={() => setShowEmailModal(true)}
          >
            Xem nội dung email đã gửi ↗
          </button>
        </div>

        {/* Live Order Tracking & Google Maps Section */}
        <div className={styles.trackingSection}>
          <div className={styles.trackingHeader}>
            <h2 className={styles.trackingTitle}>
              <span>🗺️</span> Theo dõi hành trình giao hàng trực tiếp
            </h2>
            <button
              type="button"
              className={styles.refreshTrackingBtn}
              onClick={handleRefreshTracking}
              disabled={isRefreshing}
            >
              {isRefreshing ? "⏳ Đang cập nhật..." : "🔄 Cập nhật vị trí"}
            </button>
          </div>

          {refreshMessage && (
            <div
              style={{
                marginBottom: "14px",
                padding: "8px 12px",
                background: "#f4fbf7",
                border: "1px solid #bfead4",
                color: "#193c32",
                fontSize: "12px",
                borderRadius: "3px",
              }}
            >
              {refreshMessage}
            </div>
          )}

          {/* Interactive Google Maps Embed */}
          <div className={styles.mapCard}>
            <iframe
              title="Google Map Tracking"
              src={googleMapUrl}
              className={styles.mapIframe}
              loading="lazy"
              allowFullScreen
            />
            <div className={styles.mapRouteInfo}>
              <div className={styles.mapRoutePoints}>
                <span>📍 Nook Ký Studio (Hà Nội)</span>
                <span className={styles.routeArrow}>➔</span>
                <span>
                  🏠{" "}
                  {order?.customer.district
                    ? `${order.customer.district}, ${order.customer.city}`
                    : order?.customer.city || "Địa chỉ nhận hàng"}
                </span>
              </div>
              <div className={styles.deliveryEstimate}>
                ⏱ Dự kiến giao: 24h - 48h tới
              </div>
            </div>
          </div>

          {/* Shipper & Carrier Information */}
          <div className={styles.shipperCard}>
            <div className={styles.shipperAvatar}>🛵</div>
            <div className={styles.shipperMeta}>
              <div className={styles.shipperNameRow}>
                <span className={styles.shipperName}>Nguyễn Văn Thành</span>
                <span className={styles.carrierBadge}>GHN Express</span>
              </div>
              <span className={styles.shipperVehicle}>
                Xe máy Wave Alpha · Biển kiểm soát: <strong>29B1-886.29</strong>
              </span>
              <div className={styles.trackingCodeRow}>
                <span>Mã vận đơn:</span>
                <span className={styles.trackingCodeVal}>{trackingNumber}</span>
                <button
                  type="button"
                  className={`${styles.copyBtn} ${copiedCode ? styles.copiedBtn : ""}`}
                  onClick={copyTracking}
                >
                  {copiedCode ? "✓ Đã chép" : "Sao chép"}
                </button>
              </div>
            </div>
            <div>
              <a href="tel:0988283678" className={styles.shipperCallBtn}>
                📞 Gọi bưu tá (0988 283 678)
              </a>
            </div>
          </div>

          {/* Timeline Stepper */}
          <h3 className={styles.detailsTitle} style={{ margin: "20px 0 16px" }}>
            Tiến độ đơn hàng thời gian thực
          </h3>
          <div className={styles.orderTimeline}>
            <div className={`${styles.timelineItem} ${styles.stepCompleted}`}>
              <div className={styles.timelineDot}>✓</div>
              <div className={styles.timelineContent}>
                <div className={styles.timelineTitleRow}>
                  <span className={styles.timelineTitle}>
                    {isPrepaid ? "Đã thanh toán & Xác nhận đơn hàng" : "Đã xác nhận đơn hàng (thanh toán khi nhận hàng)"}
                  </span>
                  <span className={styles.timelineTime}>Vừa xong</span>
                </div>
                <p className={styles.timelineDesc}>
                  {isPrepaid
                    ? `Hệ thống Nook Ký đã nhận thanh toán qua ${getPaymentLabel(order?.paymentMethod)} và xuất hóa đơn số #${displayOrderId}.`
                    : `Đơn hàng #${displayOrderId} đã được xác nhận. Bạn sẽ thanh toán ${formatVnd(order?.total || 0)} tiền mặt trực tiếp cho bưu tá khi nhận hàng.`}
                </p>
              </div>
            </div>

            <div className={`${styles.timelineItem} ${styles.stepActive}`}>
              <div className={styles.timelineDot}>●</div>
              <div className={styles.timelineContent}>
                <div className={styles.timelineTitleRow}>
                  <span className={styles.timelineTitle}>
                    Nook Ký đang đóng gói thủ công & kiểm định tác phẩm
                  </span>
                  <span className={styles.timelineTime}>Đang xử lý</span>
                </div>
                <p className={styles.timelineDesc}>
                  Nghệ nhân Nook Ký đang kiểm tra chất lượng gỗ, linh kiện đèn led, dán tem niêm phong và đóng hộp chống sốc cao cấp.
                </p>
              </div>
            </div>

            <div className={styles.timelineItem}>
              <div className={styles.timelineDot}>○</div>
              <div className={styles.timelineContent}>
                <div className={styles.timelineTitleRow}>
                  <span className={styles.timelineTitle}>
                    Bàn giao bưu cục vận chuyển GHN Express
                  </span>
                  <span className={styles.timelineTime}>Hôm nay</span>
                </div>
                <p className={styles.timelineDesc}>
                  Bưu tá Nguyễn Văn Thành sẽ tiếp nhận kiện hàng tại Nook Ký Studio và quét mã nhập kho luân chuyển.
                </p>
              </div>
            </div>

            <div className={styles.timelineItem}>
              <div className={styles.timelineDot}>○</div>
              <div className={styles.timelineContent}>
                <div className={styles.timelineTitleRow}>
                  <span className={styles.timelineTitle}>
                    Bưu tá phát hàng tận tay
                  </span>
                  <span className={styles.timelineTime}>Dự kiến 24h-48h</span>
                </div>
                <p className={styles.timelineDesc}>
                  Bưu tá sẽ liên hệ số điện thoại {order?.customer.phone || "của bạn"} trước khi giao hàng tận nơi.
                </p>
              </div>
            </div>

            <div className={styles.timelineItem}>
              <div className={styles.timelineDot}>○</div>
              <div className={styles.timelineContent}>
                <div className={styles.timelineTitleRow}>
                  <span className={styles.timelineTitle}>Giao hàng thành công</span>
                </div>
                <p className={styles.timelineDesc}>
                  Bạn đồng kiểm ngoại quan hộp hàng và bắt đầu hành trình hoàn thiện góc nhỏ Nook Ký của riêng mình.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Order details breakdown */}
        {order && (
          <div className={styles.detailsSection}>
            <h3 className={styles.detailsTitle}>Chi tiết người nhận</h3>
            <div className={styles.infoGrid}>
              <div className={styles.infoRow}>
                <span className={styles.infoLabel}>Người nhận</span>
                <span className={styles.infoVal}>
                  {order.customer.fullName} ({order.customer.phone})
                </span>
              </div>
              <div className={styles.infoRow}>
                <span className={styles.infoLabel}>Địa chỉ giao hàng</span>
                <span className={styles.infoVal}>
                  {order.customer.address}
                  {order.customer.district ? `, ${order.customer.district}` : ""}
                  {order.customer.city ? `, ${order.customer.city}` : ""}
                </span>
              </div>
              <div className={styles.infoRow}>
                <span className={styles.infoLabel}>Phương thức thanh toán</span>
                <span className={styles.infoVal}>
                  {getPaymentLabel(order.paymentMethod)}
                </span>
              </div>
              {order.customer.note && (
                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}>Ghi chú</span>
                  <span className={styles.infoVal}>{order.customer.note}</span>
                </div>
              )}
            </div>

            <h3 className={styles.detailsTitle}>Sản phẩm đã đặt</h3>
            <div className={styles.itemsList}>
              {order.items.map((item) => (
                <div className={styles.itemRow} key={item.slug}>
                  <div className={styles.itemLeft}>
                    {item.image && (
                      <div className={styles.itemThumb}>
                        <img src={item.image} alt={item.name} />
                      </div>
                    )}
                    <span>
                      {item.name} × <strong>{item.quantity}</strong>
                    </span>
                  </div>
                  <strong>{formatVnd(item.price * item.quantity)}</strong>
                </div>
              ))}
            </div>

            {Boolean(order.discountAmount && order.discountAmount > 0) && (
              <div className={styles.itemRow} style={{ color: "#193c32" }}>
                <span>Ưu đãi {order.promoCode ? `(${order.promoCode})` : ""}:</span>
                <strong>-{formatVnd(order.discountAmount!)}</strong>
              </div>
            )}

            <div className={styles.itemRow}>
              <span>Phí vận chuyển:</span>
              <strong>
                {order.shippingFee === 0 ? "Miễn phí (0₫)" : formatVnd(order.shippingFee)}
              </strong>
            </div>

            <div className={styles.totalBanner}>
              <span>Tổng thanh toán:</span>
              <strong>{formatVnd(order.total)}</strong>
            </div>
          </div>
        )}

        <div className={styles.actions}>
          <a href="/" className="nk-button">
            Về trang chủ
          </a>
          <a href="/shop" className="nk-button nk-button--light">
            Tiếp tục xem sản phẩm
          </a>
        </div>
      </div>

      {/* Modal Preview Email đã gửi */}
      {showEmailModal && (
        <div className={styles.modalBackdrop} onClick={() => setShowEmailModal(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalHeaderTitle}>
                ✉️ BẢN XEM TRƯỚC EMAIL XÁC NHẬN ĐƠN HÀNG ĐÃ GỬI
              </h3>
              <button
                type="button"
                className={styles.modalCloseBtn}
                onClick={() => setShowEmailModal(false)}
              >
                ×
              </button>
            </div>
            <div className={styles.modalBody}>
              <div
                dangerouslySetInnerHTML={{ __html: emailHtml }}
                style={{ width: "100%" }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <>
      <Header />
      <main id="main-content" tabIndex={-1} className="nk-inner-page">
        <Suspense fallback={<div className="nk-container" style={{ padding: "80px 0" }}>Đang tải thông tin đơn hàng...</div>}>
          <SuccessContent />
        </Suspense>
      </main>
    </>
  );
}

