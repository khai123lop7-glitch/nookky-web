import { NextResponse } from "next/server";
import { appendOrderRow } from "@/lib/googleSheets";
import { notifyOwner } from "@/lib/notify";

export const runtime = "nodejs";

interface PaymentReportedPayload {
  orderId: string;
  total?: number;
  paymentMethod?: string;
  customer?: {
    fullName?: string;
    phone?: string;
    email?: string;
  };
}

function formatVndPlain(value?: number) {
  return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(value || 0);
}

/**
 * Ghi nhận sự kiện khách bấm "Tôi đã chuyển tiền / thanh toán xong" ở trang
 * /checkout/payment. LƯU Ý QUAN TRỌNG: đây KHÔNG phải xác nhận đã nhận tiền
 * thật (chưa có cổng thanh toán/webhook nào xác minh giao dịch ngân hàng),
 * đây chỉ là khách TỰ KHAI. Chủ shop vẫn cần tự đối soát bằng app ngân hàng
 * trước khi đóng gói/giao hàng thật.
 */
export async function POST(request: Request) {
  let body: PaymentReportedPayload;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Payload không phải JSON hợp lệ" }, { status: 400 });
  }

  if (!body?.orderId) {
    return NextResponse.json({ ok: false, error: "Thiếu orderId" }, { status: 400 });
  }

  const row = [
    new Date().toISOString(),
    "payment_reported_by_customer",
    body.orderId,
    body.customer?.fullName || "",
    body.customer?.phone || "",
    body.customer?.email || "",
    "",
    "",
    body.total ?? "",
    body.paymentMethod || "",
    "khách báo đã chuyển - CẦN ĐỐI SOÁT NGÂN HÀNG TRƯỚC KHI GIAO",
    "",
  ];

  const sheetResult = await appendOrderRow(row);

  await notifyOwner(
    [
      `💰 Khách báo ĐÃ CHUYỂN TIỀN cho đơn #${body.orderId}`,
      `Số tiền cần đối chiếu: ${formatVndPlain(body.total)}`,
      `Phương thức: ${body.paymentMethod || "?"}`,
      `⚠️ Đây là khách tự báo, chưa xác minh tự động. Vui lòng kiểm tra app ngân hàng trước khi đóng gói/giao hàng.`,
    ].join("\n")
  );

  return NextResponse.json({ ok: true, sheet: sheetResult });
}
