import { NextResponse } from "next/server";
import { createHash } from "crypto";

export const runtime = "nodejs";

interface UserDataPayload {
  email?: string;
  phone?: string;
  fullName?: string;
  fbp?: string;
  fbc?: string;
  gaClientId?: string;
  ttclid?: string;
  userAgent?: string;
}

interface IncomingTrackingEvent {
  event_name: string;
  event_id: string;
  client_timestamp?: number;
  event_source_url?: string;
  user_data?: UserDataPayload;
  custom_data?: Record<string, any>;
}

function sha256(val: string | undefined): string | undefined {
  if (!val) return undefined;
  const cleaned = val.trim().toLowerCase();
  if (!cleaned) return undefined;
  return createHash("sha256").update(cleaned).digest("hex");
}

function normalizePhone(phone: string | undefined): string | undefined {
  if (!phone) return undefined;
  let digits = phone.replace(/\D/g, "");
  if (digits.startsWith("0")) {
    digits = "84" + digits.slice(1);
  } else if (!digits.startsWith("84") && digits.length > 8) {
    digits = "84" + digits;
  }
  return sha256(digits);
}

/**
 * 1. Gửi sự kiện tới Meta Conversions API (CAPI)
 */
async function sendToMetaCAPI(
  event: IncomingTrackingEvent,
  clientIp: string,
  userAgent: string
) {
  const pixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID;
  const accessToken = process.env.META_CAPI_ACCESS_TOKEN;
  const testCode = process.env.META_TEST_EVENT_CODE;

  if (!pixelId || !accessToken) {
    return { status: "skipped", reason: "Chưa cấu hình META_PIXEL_ID hoặc META_CAPI_ACCESS_TOKEN" };
  }

  const metaEventNameMap: Record<string, string> = {
    view_item: "ViewContent",
    add_to_cart: "AddToCart",
    begin_checkout: "InitiateCheckout",
    purchase: "Purchase",
    payment_reported: "CustomizeProduct",
  };

  const eventName = metaEventNameMap[event.event_name] || event.event_name;
  const eventTime = Math.floor((event.client_timestamp || Date.now()) / 1000);
  const custom = event.custom_data || {};

  const metaUserData: Record<string, any> = {
    client_ip_address: clientIp,
    client_user_agent: userAgent || event.user_data?.userAgent,
  };

  if (event.user_data?.fbp) metaUserData.fbp = event.user_data.fbp;
  if (event.user_data?.fbc) metaUserData.fbc = event.user_data.fbc;

  const hashedEmail = sha256(event.user_data?.email);
  if (hashedEmail) metaUserData.em = [hashedEmail];

  const hashedPhone = normalizePhone(event.user_data?.phone);
  if (hashedPhone) metaUserData.ph = [hashedPhone];

  const metaPayload: Record<string, any> = {
    data: [
      {
        event_name: eventName,
        event_time: eventTime,
        event_id: event.event_id,
        event_source_url: event.event_source_url || "https://nookky.shop",
        action_source: "website",
        user_data: metaUserData,
        custom_data: {
          currency: "VND",
          value: custom.value ? Number(custom.value) : undefined,
          order_id: custom.transaction_id || custom.orderId || undefined,
          content_name: custom.item_name || undefined,
          content_ids: custom.item_id ? [String(custom.item_id)] : undefined,
          content_type: "product",
          contents: custom.items || undefined,
        },
      },
    ],
  };

  if (testCode) {
    metaPayload.test_event_code = testCode;
  }

  const url = `https://graph.facebook.com/v20.0/${pixelId}/events?access_token=${accessToken}`;

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(metaPayload),
  });

  const resJson = await res.json().catch(() => ({}));
  if (!res.ok) {
    console.error("[CAPI:Meta] Gửi thất bại:", resJson);
    return { status: "error", details: resJson };
  }

  return { status: "success", fbtrace_id: resJson.fbtrace_id };
}

/**
 * 2. Gửi sự kiện tới TikTok Events API v1.3
 */
async function sendToTikTokEventsAPI(
  event: IncomingTrackingEvent,
  clientIp: string,
  userAgent: string
) {
  const pixelId = process.env.NEXT_PUBLIC_TIKTOK_PIXEL_ID;
  const accessToken = process.env.TIKTOK_EVENTS_API_ACCESS_TOKEN;

  if (!pixelId || !accessToken) {
    return { status: "skipped", reason: "Chưa cấu hình TIKTOK_PIXEL_ID hoặc TIKTOK_EVENTS_API_ACCESS_TOKEN" };
  }

  const tiktokEventNameMap: Record<string, string> = {
    view_item: "ViewContent",
    add_to_cart: "AddToCart",
    begin_checkout: "InitiateCheckout",
    purchase: "CompletePayment",
    payment_reported: "CompletePayment",
  };

  const eventName = tiktokEventNameMap[event.event_name] || event.event_name;
  const eventTime = Math.floor((event.client_timestamp || Date.now()) / 1000);
  const custom = event.custom_data || {};

  const ttUser: Record<string, any> = {
    ip: clientIp,
    user_agent: userAgent || event.user_data?.userAgent,
  };

  if (event.user_data?.ttclid) ttUser.ttclid = event.user_data.ttclid;
  const hashedEmail = sha256(event.user_data?.email);
  if (hashedEmail) ttUser.email = hashedEmail;
  const hashedPhone = normalizePhone(event.user_data?.phone);
  if (hashedPhone) ttUser.phone = hashedPhone;

  const ttPayload = {
    event_source: "web",
    event_source_id: pixelId,
    data: [
      {
        event: eventName,
        event_time: eventTime,
        event_id: event.event_id,
        user: ttUser,
        page: {
          url: event.event_source_url || "https://nookky.shop",
        },
        properties: {
          currency: "VND",
          value: custom.value ? Number(custom.value) : undefined,
          order_id: custom.transaction_id || custom.orderId || undefined,
          contents: custom.item_id
            ? [
                {
                  price: custom.value ? Number(custom.value) : undefined,
                  quantity: custom.quantity ? Number(custom.quantity) : 1,
                  content_id: String(custom.item_id),
                  content_name: custom.item_name || undefined,
                },
              ]
            : undefined,
        },
      },
    ],
  };

  const res = await fetch("https://business-api.tiktok.com/open_api/v1.3/event/track/", {
    method: "POST",
    headers: {
      "Access-Token": accessToken,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(ttPayload),
  });

  const resJson = await res.json().catch(() => ({}));
  if (!res.ok || resJson.code !== 0) {
    console.error("[CAPI:TikTok] Gửi thất bại:", resJson);
    return { status: "error", details: resJson };
  }

  return { status: "success", message: resJson.message };
}

/**
 * 3. Gửi sự kiện tới GA4 Measurement Protocol
 */
async function sendToGA4MeasurementProtocol(
  event: IncomingTrackingEvent,
  clientIp: string,
  userAgent: string
) {
  const measurementId = process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID;
  const apiSecret = process.env.GA4_API_SECRET;

  if (!measurementId || !apiSecret) {
    return { status: "skipped", reason: "Chưa cấu hình GA4_MEASUREMENT_ID hoặc GA4_API_SECRET" };
  }

  const clientId = event.user_data?.gaClientId || "unknown_client.0";
  const custom = event.custom_data || {};

  const gaParams: Record<string, any> = {
    event_id: event.event_id,
    currency: "VND",
    value: custom.value ? Number(custom.value) : undefined,
    transaction_id: custom.transaction_id || custom.orderId || undefined,
    page_location: event.event_source_url || "https://nookky.shop",
  };

  if (custom.item_id) {
    gaParams.items = [
      {
        item_id: String(custom.item_id),
        item_name: custom.item_name || "",
        price: custom.value ? Number(custom.value) : 0,
        quantity: custom.quantity ? Number(custom.quantity) : 1,
      },
    ];
  }

  const gaPayload = {
    client_id: clientId,
    events: [
      {
        name: event.event_name,
        params: gaParams,
      },
    ],
  };

  const url = `https://www.google-analytics.com/mp/collect?measurement_id=${measurementId}&api_secret=${apiSecret}`;

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(gaPayload),
  });

  return { status: res.ok ? "success" : "error", httpStatus: res.status };
}

/**
 * Endpoint điều phối tracking Server-side tập trung.
 * Nhận sự kiện từ client, enrich thêm headers và bắn đồng thời ra Meta CAPI,
 * TikTok Events API, GA4 Measurement Protocol.
 */
export async function POST(request: Request) {
  let body: IncomingTrackingEvent;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Payload không phải JSON hợp lệ" }, { status: 400 });
  }

  if (!body?.event_name || !body?.event_id) {
    return NextResponse.json({ ok: false, error: "Thiếu event_name hoặc event_id" }, { status: 400 });
  }

  // Trích xuất client IP & User-Agent từ headers
  const clientIp =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "127.0.0.1";
  const userAgent = request.headers.get("user-agent") || "";

  // Thực thi song song bất đồng bộ, không để thất bại của 1 kênh chặn các kênh khác
  const [metaResult, tiktokResult, ga4Result] = await Promise.allSettled([
    sendToMetaCAPI(body, clientIp, userAgent),
    sendToTikTokEventsAPI(body, clientIp, userAgent),
    sendToGA4MeasurementProtocol(body, clientIp, userAgent),
  ]);

  return NextResponse.json({
    ok: true,
    event_id: body.event_id,
    dispatched: {
      meta: metaResult.status === "fulfilled" ? metaResult.value : { status: "failed", error: String(metaResult.reason) },
      tiktok: tiktokResult.status === "fulfilled" ? tiktokResult.value : { status: "failed", error: String(tiktokResult.reason) },
      ga4: ga4Result.status === "fulfilled" ? ga4Result.value : { status: "failed", error: String(ga4Result.reason) },
    },
  });
}
