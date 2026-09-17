import { NextResponse } from "next/server";
import { appendOrderRow } from "@/lib/googleSheets";
import { notifyOwner } from "@/lib/notify";
import { products } from "@/data/products";
import { quotePromotion } from "@/lib/promotions";

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

  const verifiedItems = (body.items || []).map((item) => {
    const product = products.find((entry) => entry.slug === item.slug);
    const quantity = Number(item.quantity);
    return product && Number.isInteger(quantity) && quantity >= 1 && quantity <= 99
      ? { product, quantity }
      : null;
  });

  if (verifiedItems.length === 0 || verifiedItems.some((item) => item === null)) {
    return NextResponse.json(
      { ok: false, error: "Đơn hàng có sản phẩm hoặc số lượng không hợp lệ" },
      { status: 400 }
    );
  }

  const validItems = verifiedItems.filter((item): item is NonNullable<typeof item> => Boolean(item));
  const subtotal = validItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const quote = quotePromotion(subtotal, body.promoCode);
  if (body.promoCode && quote.error) {
    return NextResponse.json({ ok: false, error: quote.error }, { status: 400 });
  }

  const itemsSummary = validItems
    .map((item) => `${item.product.name} x${item.quantity}`)
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
    quote.total,
    body.paymentMethod,
    body.status,
    body.customer.note || "",
  ];

  const sheetResult = await appendOrderRow(row);

  await notifyOwner(
    [
      `🛎️ Đơn hàng mới #${body.orderId}`,
      `Khách: ${body.customer.fullName} - ${body.customer.phone}`,
      `Tổng tiền: ${formatVndPlain(quote.total)}`,
      quote.promotion ? `Ưu đãi: ${quote.promotion.code} (-${formatVndPlain(quote.discountAmount)})` : null,
      `Thanh toán: ${body.paymentMethod}`,
      `Địa chỉ: ${addressFull}`,
      itemsSummary ? `Sản phẩm: ${itemsSummary}` : null,
    ]
      .filter(Boolean)
      .join("\n")
  );

  return NextResponse.json({
    ok: true,
    sheet: sheetResult,
    pricing: {
      subtotal,
      discountAmount: quote.discountAmount,
      shippingFee: quote.shippingFee,
      total: quote.total,
      promoCode: quote.promotion?.code || null,
    },
  });
}
