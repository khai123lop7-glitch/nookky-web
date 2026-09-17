/**
 * Ghi và đọc dữ liệu đơn hàng từ một Google Sheet dùng làm "database" tạm thời.
 *
 * Vì Vercel không có ổ đĩa bền vững cho serverless function, dữ liệu phải được
 * đẩy ra một nơi lưu trữ độc lập bên ngoài request. Google Sheet được chọn ở
 * giai đoạn này vì miễn phí, không cần đăng ký dịch vụ database riêng, và chủ
 * shop có thể mở xem/lọc đơn hàng như một bảng tính bình thường.
 *
 * Cách hoạt động: dùng một Service Account của Google Cloud (không phải tài
 * khoản Gmail cá nhân) để lấy access token qua chuẩn OAuth2 JWT Bearer, sau đó
 * gọi thẳng Google Sheets API v4 bằng fetch (không cần cài package `googleapis`
 * để giữ bundle nhẹ).
 *
 * Biến môi trường cần cấu hình trên Vercel (Project Settings → Environment
 * Variables):
 * - GOOGLE_SERVICE_ACCOUNT_EMAIL
 * - GOOGLE_PRIVATE_KEY   (giữ nguyên các ký tự \n, code bên dưới tự chuyển thành xuống dòng thật)
 * - GOOGLE_SHEET_ID      (lấy từ URL của Google Sheet)
 * - GOOGLE_SHEET_TAB_NAME (tuỳ chọn, mặc định "Orders")
 */

type AppendResult =
  | { ok: true }
  | { ok: false; skipped: true; reason: string }
  | { ok: false; skipped?: false; error: string };

export interface CleanedOrderRecord {
  orderId: string;
  orderDate: string;
  lastEvent: string;
  customerNameMasked: string;
  phoneMasked: string;
  itemsSummary: string;
  total: number;
  paymentMethod: string;
  status: string;
}

export type LookupResult =
  | { ok: true; orders: CleanedOrderRecord[] }
  | { ok: false; orders: []; skipped?: boolean; error?: string; reason?: string };

function base64url(input: Buffer | string) {
  const buff = typeof input === "string" ? Buffer.from(input) : input;
  return buff
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

async function getAccessToken(): Promise<string> {
  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const rawKey = process.env.GOOGLE_PRIVATE_KEY;
  if (!email || !rawKey) {
    throw new Error(
      "Thiếu GOOGLE_SERVICE_ACCOUNT_EMAIL hoặc GOOGLE_PRIVATE_KEY trong biến môi trường"
    );
  }
  const privateKey = rawKey.replace(/\\n/g, "\n");

  const now = Math.floor(Date.now() / 1000);
  const header = { alg: "RS256", typ: "JWT" };
  const claim = {
    iss: email,
    scope: "https://www.googleapis.com/auth/spreadsheets",
    aud: "https://oauth2.googleapis.com/token",
    exp: now + 3600,
    iat: now,
  };

  const unsigned = `${base64url(JSON.stringify(header))}.${base64url(JSON.stringify(claim))}`;

  // crypto là module built-in của Node.js, không cần cài thêm package nào.
  const { createSign } = await import("crypto");
  const signer = createSign("RSA-SHA256");
  signer.update(unsigned);
  signer.end();
  const signature = base64url(signer.sign(privateKey));

  const jwt = `${unsigned}.${signature}`;

  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: jwt,
    }),
  });

  if (!res.ok) {
    throw new Error(`Lấy access token Google thất bại: ${await res.text()}`);
  }

  const data = (await res.json()) as { access_token?: string };
  if (!data.access_token) {
    throw new Error("Phản hồi Google không có access_token");
  }
  return data.access_token;
}

/**
 * Thêm một dòng mới vào cuối sheet. Mỗi lần gọi là một dòng log sự kiện
 * (đặt đơn, báo đã chuyển tiền...), không phải cập nhật lại dòng cũ, để tránh
 * phải tìm-và-sửa dòng (giảm rủi ro race condition khi nhiều request tới cùng lúc).
 */
export async function appendOrderRow(values: Array<string | number>): Promise<AppendResult> {
  const sheetId = process.env.GOOGLE_SHEET_ID;
  const tabName = process.env.GOOGLE_SHEET_TAB_NAME || "Orders";

  if (!sheetId) {
    console.warn("[googleSheets] Bỏ qua ghi sheet: chưa cấu hình GOOGLE_SHEET_ID");
    return { ok: false, skipped: true, reason: "GOOGLE_SHEET_ID chưa được cấu hình" };
  }

  try {
    const accessToken = await getAccessToken();
    const range = `${tabName}!A:Z`;
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${encodeURIComponent(
      range
    )}:append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS`;

    const res = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ values: [values] }),
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error("[googleSheets] Append thất bại:", errorText);
      return { ok: false, error: errorText };
    }

    return { ok: true };
  } catch (error) {
    console.error("[googleSheets] Lỗi khi ghi sheet:", error);
    return { ok: false, error: error instanceof Error ? error.message : String(error) };
  }
}

function maskPhone(phone: string): string {
  const cleaned = phone.replace(/\D/g, "");
  if (cleaned.length < 7) return "***" + cleaned.slice(-3);
  return cleaned.slice(0, 3) + "***" + cleaned.slice(-3);
}

function maskName(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length <= 1) return name.slice(0, 1) + "***";
  const firstName = parts[parts.length - 1];
  return parts.slice(0, -1).map((p) => p[0] + "*").join(" ") + " " + firstName;
}

/**
 * Tra cứu đơn hàng từ Google Sheet phục vụ AI Chatbot & Customer Service.
 * Tìm kiếm theo Mã đơn hàng (orderId) hoặc Số điện thoại.
 * Tự động gom nhóm các dòng cùng orderId để lấy trạng thái mới nhất,
 * đồng thời che (mask) các thông tin nhạy cảm để bảo vệ quyền riêng tư.
 */
export async function lookupOrderRows(rawQuery: string): Promise<LookupResult> {
  const sheetId = process.env.GOOGLE_SHEET_ID;
  const tabName = process.env.GOOGLE_SHEET_TAB_NAME || "Orders";

  if (!sheetId) {
    console.warn("[googleSheets] Bỏ qua tra cứu: chưa cấu hình GOOGLE_SHEET_ID");
    return { ok: false, orders: [], skipped: true, reason: "GOOGLE_SHEET_ID chưa được cấu hình" };
  }

  const query = rawQuery.trim().toLowerCase();
  const queryDigits = rawQuery.replace(/\D/g, "");

  if (!query && !queryDigits) {
    return { ok: true, orders: [] };
  }

  try {
    const accessToken = await getAccessToken();
    const range = `${tabName}!A:L`;
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${encodeURIComponent(range)}`;

    const res = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      next: { revalidate: 0 }, // Không cache để đọc dữ liệu mới nhất
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error("[googleSheets] Đọc sheet thất bại:", errorText);
      return { ok: false, orders: [], error: errorText };
    }

    const data = (await res.json()) as { values?: string[][] };
    const rows = data.values || [];

    if (rows.length <= 1) {
      return { ok: true, orders: [] };
    }

    // Gom nhóm các dòng theo orderId (vì có thể có 2 dòng: order_placed và payment_reported)
    const orderMap = new Map<string, any>();

    for (let i = 1; i < rows.length; i++) {
      const row = rows[i];
      const timestamp = row[0] || "";
      const eventType = row[1] || "";
      const orderId = (row[2] || "").trim();
      const fullName = row[3] || "";
      const phone = (row[4] || "").trim();
      const itemsSummary = row[7] || "";
      const totalRaw = row[8] || "0";
      const paymentMethod = row[9] || "";
      const status = row[10] || "";

      if (!orderId) continue;

      const orderIdLower = orderId.toLowerCase();
      const phoneDigits = phone.replace(/\D/g, "");

      const matchesOrderId = orderIdLower.includes(query);
      const matchesPhone =
        queryDigits.length >= 4 &&
        (phoneDigits.endsWith(queryDigits) || phoneDigits.includes(queryDigits));

      if (matchesOrderId || matchesPhone) {
        const existing = orderMap.get(orderId);
        // Nếu có dòng mới hơn hoặc sự kiện payment_reported, ưu tiên trạng thái đó
        if (!existing || eventType === "payment_reported" || new Date(timestamp) >= new Date(existing.orderDate)) {
          orderMap.set(orderId, {
            orderId,
            orderDate: timestamp,
            lastEvent: eventType,
            customerNameMasked: maskName(fullName),
            phoneMasked: maskPhone(phone),
            itemsSummary,
            total: Number(totalRaw) || 0,
            paymentMethod,
            status,
          });
        }
      }
    }

    const matchedOrders = Array.from(orderMap.values());
    return { ok: true, orders: matchedOrders };
  } catch (error) {
    console.error("[googleSheets] Lỗi khi tra cứu sheet:", error);
    return { ok: false, orders: [], error: error instanceof Error ? error.message : String(error) };
  }
}
