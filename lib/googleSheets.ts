/**
 * Ghi dữ liệu đơn hàng vào một Google Sheet dùng làm "database" tạm thời.
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
 * Variables), xem hướng dẫn tạo trong README mục "Ghi đơn hàng vào Google Sheet":
 * - GOOGLE_SERVICE_ACCOUNT_EMAIL
 * - GOOGLE_PRIVATE_KEY   (giữ nguyên các ký tự \n, code bên dưới tự chuyển thành xuống dòng thật)
 * - GOOGLE_SHEET_ID      (lấy từ URL của Google Sheet)
 * - GOOGLE_SHEET_TAB_NAME (tuỳ chọn, mặc định "Orders")
 */

type AppendResult =
  | { ok: true }
  | { ok: false; skipped: true; reason: string }
  | { ok: false; skipped?: false; error: string };

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
