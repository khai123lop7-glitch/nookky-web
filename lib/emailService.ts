/**
 * Dịch vụ xử lý và lưu trữ Email xác nhận đơn hàng của Nook Ký
 */

export interface SentEmail {
  id: string;
  orderId: string;
  recipientEmail: string;
  recipientName: string;
  subject: string;
  sentAt: string;
  htmlContent: string;
  totalAmount: number;
  paymentMethod: string;
}

export function generateOrderConfirmationEmailHtml(order: {
  orderId: string;
  createdAt: string;
  customer: {
    fullName: string;
    phone: string;
    email?: string;
    city: string;
    district?: string;
    address: string;
    note?: string;
  };
  items: Array<{
    name: string;
    price: number;
    quantity: number;
    image?: string;
  }>;
  subtotal: number;
  discountAmount?: number;
  promoCode?: string | null;
  shippingFee: number;
  total: number;
  paymentMethod: string;
}): string {
  const paymentMethodLabel =
    order.paymentMethod === "bank_transfer"
      ? "Chuyển khoản VietQR (MB Bank)"
      : order.paymentMethod === "momo"
      ? "Ví điện tử MoMo"
      : order.paymentMethod === "zalopay"
      ? "Ví điện tử ZaloPay"
      : "Thanh toán khi nhận hàng (COD)";

  const formatMoney = (val: number) =>
    new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(val);

  const itemsRows = order.items
    .map(
      (item) => `
    <tr>
      <td style="padding: 12px 0; border-bottom: 1px solid #f0e7dc; vertical-align: middle;">
        ${
          item.image
            ? `<img src="${item.image}" alt="${item.name}" width="52" height="52" style="border-radius: 4px; object-fit: cover; vertical-align: middle; margin-right: 12px; display: inline-block;" />`
            : ""
        }
        <span style="font-weight: 600; color: #2f1607; font-size: 14px;">${item.name}</span>
        <span style="color: #745d4f; font-size: 13px;"> × ${item.quantity}</span>
      </td>
      <td style="padding: 12px 0; border-bottom: 1px solid #f0e7dc; text-align: right; font-weight: 700; color: #2f1607; font-size: 14px; vertical-align: middle;">
        ${formatMoney(item.price * item.quantity)}
      </td>
    </tr>
  `
    )
    .join("");

  return `
<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <title>Xác nhận đơn hàng Nook Ký #${order.orderId}</title>
</head>
<body style="margin: 0; padding: 24px 0; background-color: #f7f2ea; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #2f1607; line-height: 1.6;">
  <div style="max-width: 620px; margin: 0 auto; background: #ffffff; border: 1px solid #e8decb; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 18px rgba(47, 22, 7, 0.06);">
    <!-- Header -->
    <div style="background: #193c32; padding: 32px 28px; text-align: center; color: #fcf4e9;">
      <h1 style="margin: 0 0 6px; font-size: 26px; letter-spacing: 0.06em; font-weight: 700; text-transform: uppercase;">NOOK KÝ</h1>
      <p style="margin: 0; font-size: 14px; color: #d9953b; font-weight: 500;">GÓC NHỎ KÝ ỨC VIỆT NAM</p>
    </div>

    <!-- Main Message -->
    <div style="padding: 32px 28px;">
      <div style="background: #edf7f2; border: 1px solid #c7e8d7; border-radius: 6px; padding: 16px; margin-bottom: 24px; text-align: center;">
        <span style="display: block; font-size: 18px; font-weight: 700; color: #193c32; margin-bottom: 4px;">✓ Xác nhận thanh toán & Đặt hàng thành công</span>
        <span style="font-size: 13px; color: #3d6858;">Mã đơn hàng của bạn: <strong>${order.orderId}</strong></span>
      </div>

      <p style="font-size: 15px; margin: 0 0 16px; color: #2f1607;">
        Chào bạn <strong>${order.customer.fullName}</strong>,
      </p>
      <p style="font-size: 14px; margin: 0 0 24px; color: #5a4537; line-height: 1.6;">
        Cảm ơn bạn đã tin chọn tác phẩm thủ công của <strong>Nook Ký</strong>. Đơn hàng của bạn đã được xác nhận thanh toán và đang được nghệ nhân Nook Ký chuẩn bị đóng gói cẩn thận để gửi tới bạn sớm nhất.
      </p>

      <!-- Order Details -->
      <h3 style="font-size: 16px; color: #2f1607; margin: 0 0 12px; padding-bottom: 8px; border-bottom: 2px solid #193c32;">
        CHI TIẾT ĐƠN HÀNG
      </h3>
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
        ${itemsRows}
      </table>

      <!-- Calculations -->
      <div style="background: #faf6f0; border-radius: 6px; padding: 16px; margin-bottom: 24px;">
        <div style="display: flex; justify-content: space-between; font-size: 13px; margin-bottom: 6px; color: #5a4537;">
          <span>Tạm tính:</span>
          <strong>${formatMoney(order.subtotal)}</strong>
        </div>
        ${
          order.discountAmount && order.discountAmount > 0
            ? `<div style="display: flex; justify-content: space-between; font-size: 13px; margin-bottom: 6px; color: #193c32;">
                <span>Ưu đãi ${order.promoCode ? `(${order.promoCode})` : ""}:</span>
                <strong>-${formatMoney(order.discountAmount)}</strong>
              </div>`
            : ""
        }
        <div style="display: flex; justify-content: space-between; font-size: 13px; margin-bottom: 10px; color: #5a4537;">
          <span>Phí vận chuyển:</span>
          <strong>${order.shippingFee === 0 ? "Miễn phí (0₫)" : formatMoney(order.shippingFee)}</strong>
        </div>
        <div style="display: flex; justify-content: space-between; font-size: 16px; padding-top: 10px; border-top: 1px dashed #d6c7b2; color: #2f1607; font-weight: 700;">
          <span>Tổng thanh toán:</span>
          <span style="color: #c93b2b; font-size: 18px;">${formatMoney(order.total)}</span>
        </div>
      </div>

      <!-- Shipping Information -->
      <h3 style="font-size: 16px; color: #2f1607; margin: 0 0 12px; padding-bottom: 8px; border-bottom: 2px solid #193c32;">
        ĐỊA CHỈ & THÔNG TIN GIAO HÀNG
      </h3>
      <div style="font-size: 13px; color: #5a4537; line-height: 1.8; margin-bottom: 28px;">
        <div><strong>Người nhận:</strong> ${order.customer.fullName} · ${order.customer.phone}</div>
        <div><strong>Địa chỉ:</strong> ${order.customer.address}${order.customer.district ? `, ${order.customer.district}` : ""}${order.customer.city ? `, ${order.customer.city}` : ""}</div>
        <div><strong>Phương thức thanh toán:</strong> ${paymentMethodLabel}</div>
        <div><strong>Trạng thái thanh toán:</strong> <span style="color: #193c32; font-weight: 700;">ĐÃ THANH TOÁN THÀNH CÔNG</span></div>
        ${order.customer.note ? `<div><strong>Ghi chú:</strong> ${order.customer.note}</div>` : ""}
      </div>

      <!-- Live Tracking Info -->
      <div style="background: #fdfaf5; border: 1px solid #dfd1be; border-radius: 6px; padding: 18px; text-align: center;">
        <p style="margin: 0 0 8px; font-weight: 700; color: #2f1607; font-size: 14px;">
          🚚 Đơn hàng đang được điều phối vận chuyển
        </p>
        <p style="margin: 0 0 14px; font-size: 12px; color: #745d4f;">
          Bạn có thể theo dõi trực tiếp vị trí đơn hàng và bưu tá giao vận bất kỳ lúc nào trên website Nook Ký.
        </p>
        <span style="display: inline-block; padding: 6px 14px; background: #193c32; color: #fff; font-size: 12px; font-weight: 600; border-radius: 4px; text-decoration: none;">
          Mã vận đơn: GHN-${order.orderId.replace(/[^0-9]/g, "") || "982341"}VN
        </span>
      </div>
    </div>

    <!-- Footer -->
    <div style="background: #f4ecdf; padding: 20px 28px; text-align: center; font-size: 12px; color: #745d4f; border-top: 1px solid #e8decb;">
      <p style="margin: 0 0 6px;">Nook Ký Studio — Nơi thu nhỏ ký ức và không gian sống Việt Nam.</p>
      <p style="margin: 0;">Hotline: 0909 283 678 · Email: support@nookky.vn</p>
    </div>
  </div>
</body>
</html>
`;
}

/**
 * Gửi email xác nhận (Lưu vào localStorage và trả về thông tin email đã gửi)
 */
export function sendOrderConfirmationEmail(order: any): SentEmail {
  const recipientEmail = order.customer.email || "khachhang@nookky.vn";
  const emailId = `mail-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`;
  const subject = `[Nook Ký] Xác nhận thanh toán & đặt hàng thành công #${order.orderId}`;
  const htmlContent = generateOrderConfirmationEmailHtml(order);

  const sentEmail: SentEmail = {
    id: emailId,
    orderId: order.orderId,
    recipientEmail,
    recipientName: order.customer.fullName,
    subject,
    sentAt: new Date().toISOString(),
    htmlContent,
    totalAmount: order.total,
    paymentMethod: order.paymentMethod,
  };

  if (typeof window !== "undefined") {
    try {
      const existing = window.localStorage.getItem("nookky_sent_emails");
      const list: SentEmail[] = existing ? JSON.parse(existing) : [];
      list.unshift(sentEmail);
      // Keep last 10 emails
      window.localStorage.setItem("nookky_sent_emails", JSON.stringify(list.slice(0, 10)));
      window.localStorage.setItem("nookky_latest_sent_email", JSON.stringify(sentEmail));
    } catch {
      // Ignore localStorage errors
    }
  }

  return sentEmail;
}
