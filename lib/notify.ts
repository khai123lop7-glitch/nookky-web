/**
 * Bắn thông báo tức thời cho chủ shop khi có đơn hàng mới hoặc khách báo đã
 * chuyển tiền. Hỗ trợ song song 2 kênh, bật kênh nào tuỳ vào biến môi trường
 * đã cấu hình (thiếu biến nào thì tự bỏ qua kênh đó, không báo lỗi cho khách).
 *
 * - Telegram bot: setup trong vài phút, không cần duyệt, phù hợp dùng ngay.
 *   Cần: TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID
 *
 * - Zalo OA (Official Account): quen thuộc hơn với người Việt, nhưng API
 *   "message/cs" (customer service message) CHỈ gửi được cho người dùng đã
 *   nhắn tin/tương tác với OA trong vòng 7 ngày gần nhất. Nghĩa là bạn (chủ
 *   shop) cần tự nhắn 1 tin cho OA của mình mỗi tuần để duy trì quyền nhận
 *   thông báo qua kênh này, nếu không muốn việc đó thì cần xin duyệt template
 *   ZNS (Zalo Notification Service) để gửi ổn định không giới hạn 7 ngày.
 *   Cần: ZALO_OA_ACCESS_TOKEN, ZALO_OA_NOTIFY_USER_ID
 */

async function notifyViaTelegram(message: string) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) return { channel: "telegram", skipped: true } as const;

  try {
    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text: message }),
    });
    if (!res.ok) {
      console.error("[notify] Telegram thất bại:", await res.text());
      return { channel: "telegram", ok: false } as const;
    }
    return { channel: "telegram", ok: true } as const;
  } catch (error) {
    console.error("[notify] Telegram lỗi:", error);
    return { channel: "telegram", ok: false } as const;
  }
}

async function notifyViaZaloOA(message: string) {
  const accessToken = process.env.ZALO_OA_ACCESS_TOKEN;
  const userId = process.env.ZALO_OA_NOTIFY_USER_ID;
  if (!accessToken || !userId) return { channel: "zalo_oa", skipped: true } as const;

  try {
    const res = await fetch("https://openapi.zalo.me/v3.0/oa/message/cs", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        access_token: accessToken,
      },
      body: JSON.stringify({
        recipient: { user_id: userId },
        message: { text: message },
      }),
    });
    if (!res.ok) {
      console.error("[notify] Zalo OA thất bại:", await res.text());
      return { channel: "zalo_oa", ok: false } as const;
    }
    return { channel: "zalo_oa", ok: true } as const;
  } catch (error) {
    console.error("[notify] Zalo OA lỗi:", error);
    return { channel: "zalo_oa", ok: false } as const;
  }
}

export async function notifyOwner(message: string) {
  const results = await Promise.allSettled([
    notifyViaTelegram(message),
    notifyViaZaloOA(message),
  ]);
  return results;
}
