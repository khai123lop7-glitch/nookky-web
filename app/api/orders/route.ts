import { NextResponse } from "next/server";
import { appendOrderRow } from "@/lib/googleSheets";
import { notifyOwner } from "@/lib/notify";

// Cần Node.js runtime (không phải edge) vì lib/googleSheets.ts dùng module
// "crypto" của Node để tự ký JWT khi xin access token từ Google.
export const runtime = "nodejs";

interface OrderItemPayload {
  slug?: string;
  name?: string;
  price?: number;
  quantity?: number;
}

interface OrderPayload {
  orderId: string;
  createdAt?: string;
  customer: {
    fullName: string;
    phone: string;
    email?: string;
    city: string;
    district?: string;
    address: string;
    note?: string;
  };
  items?: OrderItemPayload[];
  subtotal?: number;
  discountAmount?: number;
  promoCode?: string | null;
  shippingFee?: number;
  total: number;
  paymentMethod: string;
  status: string;
}

function formatVndPlain(value: number) {
  return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(value || 0);
}

/**
 * Ghi nhận một đơn hàng mới ngay khi khách bấm "Xác nhận đặt hàng" ở trang
 * checkout. Đây là điểm nối server-side đầu tiên của luồng thanh toán: trước
 * khi có route này, đơn hàng chỉ tồn tại trong localStorage của trình duyệt
 * khách và chủ shop không bao giờ nhận được.
 */
export async function POST(request: Request) {
  let body: OrderPayload;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Payload không phải JSON hợp lệ" }, { status: 400 });
  }

  if (!body?.orderId || !body?.customer?.fullName || !body?.customer?.phone) {
    return NextResponse.json(
      { ok: false, error: "Thiếu orderId hoặc thông tin khách hàng" },
      { status: 400 }
    );
  }

  const itemsSummary = (body.items || [])
    .map((item) => `${item.name || item.slug || "?"} x${item.quantity ?? 1}`)
    .join(", ");

  const addressFull = [body.customer.address, body.customer.district, body.customer.city]
    .filter(Boolean)
    .join(", ");

  const row = [
    new Date().toISOString(),
    "order_placed",
    body.orderId,
    body.customer.fullName,
    body.customer.phone,
    body.customer.email || "",
    addressFull,
    itemsSummary,
    body.total ?? "",
    body.paymentMethod,
    body.status,
    body.customer.note || "",
  ];

  const sheetResult = await appendOrderRow(row);

  await notifyOwner(
    [
      `🛎️ Đơn hàng mới #${body.orderId}`,
      `Khách: ${body.customer.fullName} - ${body.customer.phone}`,
      `Tổng tiền: ${formatVndPlain(body.total)}`,
      `Thanh toán: ${body.paymentMethod}`,
      `Địa chỉ: ${addressFull}`,
      itemsSummary ? `Sản phẩm: ${itemsSummary}` : null,
    ]
      .filter(Boolean)
      .join("\n")
  );

  return NextResponse.json({ ok: true, sheet: sheetResult });
}
