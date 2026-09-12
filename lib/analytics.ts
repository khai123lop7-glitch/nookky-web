export type NookAnalyticsEvent =
  | "view_item_list"
  | "select_item"
  | "view_item"
  | "add_to_cart"
  | "remove_from_cart"
  | "view_cart"
  | "begin_checkout"
  | "purchase"
  | "payment_reported"
  | "hero_primary_click"
  | "hero_secondary_click"
  | "hero_landscape_change"
  | "cinema_mode_toggle"
  | "featured_product_click"
  | "shop_filter_click"
  | "spotlight_gallery_change"
  | "spotlight_zoom_open"
  | "place_select"
  | "build_step_select"
  | "craft_process_select"
  | "newsletter_subscribe"
  | "studio_started"
  | "design_saved"
  | "room_preview_started"
  | "chat_open"
  | "chat_message_sent";

export type AnalyticsPayload = Record<
  string,
  string | number | boolean | null | undefined | Array<Record<string, unknown>> | Record<string, unknown>
>;

export interface TrackingUserData {
  email?: string;
  phone?: string;
  fullName?: string;
  fbp?: string;
  fbc?: string;
  gaClientId?: string;
  ttclid?: string;
  userAgent?: string;
}

export interface UnifiedTrackingEvent {
  event_name: NookAnalyticsEvent;
  event_id: string;
  client_timestamp: number;
  event_source_url: string;
  user_data?: TrackingUserData;
  custom_data?: AnalyticsPayload;
}

/**
 * Sinh mã định danh duy nhất cho mỗi sự kiện để khử trùng lặp (Deduplication)
 * giữa Browser Pixel và Server-side Conversions API (CAPI).
 */
export function generateEventId(prefix = "nk_evt"): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 9);
  return `${prefix}_${timestamp}_${random}`;
}

/**
 * Đọc giá trị cookie từ document.cookie
 */
export function getCookieValue(name: string): string | undefined {
  if (typeof document === "undefined") return undefined;
  const match = document.cookie.match(new RegExp(`(^|;\\s*)(${name})=([^;]*)`));
  return match ? decodeURIComponent(match[3]) : undefined;
}

/**
 * Lấy hoặc sinh cookie _fbp (Facebook Browser ID)
 */
export function getOrCreateFbp(): string {
  if (typeof window === "undefined") return "";
  let fbp = getCookieValue("_fbp");
  if (!fbp) {
    const version = "fb.1";
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 10000000000);
    fbp = `${version}.${timestamp}.${random}`;
    try {
      document.cookie = `_fbp=${fbp};path=/;max-age=${60 * 60 * 24 * 90};SameSite=Lax`;
    } catch {
      // Bỏ qua nếu bị chặn cookie
    }
  }
  return fbp;
}

/**
 * Lấy cookie _fbc nếu có fbclid từ URL
 */
export function getOrCreateFbc(): string | undefined {
  if (typeof window === "undefined") return undefined;
  let fbc = getCookieValue("_fbc");
  if (!fbc && window.location.search) {
    const params = new URLSearchParams(window.location.search);
    const fbclid = params.get("fbclid");
    if (fbclid) {
      const version = "fb.1";
      const timestamp = Date.now();
      fbc = `${version}.${timestamp}.${fbclid}`;
      try {
        document.cookie = `_fbc=${fbc};path=/;max-age=${60 * 60 * 24 * 90};SameSite=Lax`;
      } catch {
        // Bỏ qua
      }
    }
  }
  return fbc;
}

/**
 * Lấy cookie Google Analytics client ID (_ga)
 */
export function getGaClientId(): string | undefined {
  const ga = getCookieValue("_ga");
  if (!ga) return undefined;
  // Cookie _ga thường có định dạng: GA1.1.123456789.1620000000
  const parts = ga.split(".");
  if (parts.length >= 4) {
    return `${parts[2]}.${parts[3]}`;
  }
  return ga;
}

/**
 * Lấy TikTok click ID (ttclid)
 */
export function getTtclid(): string | undefined {
  if (typeof window === "undefined") return undefined;
  const cookieTtclid = getCookieValue("ttclid");
  if (cookieTtclid) return cookieTtclid;
  if (window.location.search) {
    const params = new URLSearchParams(window.location.search);
    return params.get("ttclid") || undefined;
  }
  return undefined;
}

/**
 * Khởi tạo & nạp các SDK Pixel của trình duyệt nếu có cấu hình biến môi trường NEXT_PUBLIC
 */
export function initBrowserPixels() {
  if (typeof window === "undefined") return;

  const w = window as any;

  // 1. GA4
  const gaId = process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID;
  if (gaId && !w.__ga4_initialized) {
    w.__ga4_initialized = true;
    w.dataLayer = w.dataLayer || [];
    function gtag(...args: any[]) {
      w.dataLayer.push(arguments);
    }
    w.gtag = w.gtag || gtag;
    w.gtag("js", new Date());
    w.gtag("config", gaId, { send_page_view: true });

    const s = document.createElement("script");
    s.async = true;
    s.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
    document.head.appendChild(s);
  }

  // 2. Meta Pixel
  const metaPixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID;
  if (metaPixelId && !w.__meta_initialized) {
    w.__meta_initialized = true;
    if (!w.fbq) {
      const fbq: any = function (...args: any[]) {
        if (fbq.callMethod) {
          fbq.callMethod.apply(fbq, args);
        } else {
          fbq.queue.push(args);
        }
      };
      fbq.push = fbq;
      fbq.loaded = true;
      fbq.version = "2.0";
      fbq.queue = [];
      w.fbq = fbq;
      w._fbq = fbq;

      const s = document.createElement("script");
      s.async = true;
      s.src = "https://connect.facebook.net/en_US/fbevents.js";
      document.head.appendChild(s);
    }
    w.fbq("init", metaPixelId);
    w.fbq("track", "PageView");
  }

  // 3. TikTok Pixel
  const tiktokPixelId = process.env.NEXT_PUBLIC_TIKTOK_PIXEL_ID;
  if (tiktokPixelId && !w.__tiktok_initialized) {
    w.__tiktok_initialized = true;
    if (!w.ttq) {
      const ttq: any = [];
      ttq.methods = [
        "page",
        "track",
        "identify",
        "instances",
        "debug",
        "on",
        "off",
        "once",
        "ready",
        "alias",
        "group",
        "enableCookie",
        "disableCookie",
      ];
      ttq.setAndDefer = function (t: any, e: any) {
        t[e] = function () {
          t.push([e].concat(Array.prototype.slice.call(arguments, 0)));
        };
      };
      for (let i = 0; i < ttq.methods.length; i++) {
        ttq.setAndDefer(ttq, ttq.methods[i]);
      }
      ttq.instance = function (t: any) {
        const e = ttq._i[t] || [];
        for (let n = 0; n < ttq.methods.length; n++) {
          ttq.setAndDefer(e, ttq.methods[n]);
        }
        return e;
      };
      ttq.load = function (e: any, n: any) {
        const i = "https://analytics.tiktok.com/i18n/pixel/events.js";
        ttq._i = ttq._i || {};
        ttq._i[e] = [];
        ttq._i[e]._u = i;
        ttq._t = ttq._t || {};
        ttq._t[e] = +new Date();
        ttq._o = ttq._o || {};
        ttq._o[e] = n || {};
        const o = document.createElement("script");
        o.type = "text/javascript";
        o.async = true;
        o.src = i + "?sdkid=" + e + "&lib=ttq";
        const a = document.getElementsByTagName("script")[0];
        if (a && a.parentNode) a.parentNode.insertBefore(o, a);
      };
      w.ttq = ttq;
    }
    w.ttq.load(tiktokPixelId);
    w.ttq.page();
  }
}

/**
 * Cập nhật ngữ cảnh phiên người dùng để AI Chatbot có thể đọc real-time
 */
function updateSessionContext(event: NookAnalyticsEvent, payload: AnalyticsPayload) {
  if (typeof window === "undefined") return;

  try {
    const raw = window.sessionStorage.getItem("nookky_session_context");
    const ctx = raw ? JSON.parse(raw) : { recentEvents: [] };

    if (event === "view_item" && payload.item_id) {
      ctx.lastViewedProduct = {
        slug: payload.item_id,
        name: payload.item_name,
        price: payload.value,
        timestamp: Date.now(),
      };
    } else if (event === "add_to_cart" && payload.item_id) {
      ctx.lastCartAction = {
        slug: payload.item_id,
        name: payload.item_name,
        quantity: payload.quantity || 1,
        timestamp: Date.now(),
      };
    } else if (event === "purchase" || event === "payment_reported") {
      ctx.lastOrderId = payload.transaction_id || payload.orderId;
      ctx.lastOrderTotal = payload.value || payload.total;
    }

    ctx.recentEvents = [
      { event, timestamp: Date.now(), payloadSummary: payload.item_id || payload.transaction_id || null },
      ...(ctx.recentEvents || []).slice(0, 9),
    ];

    window.sessionStorage.setItem("nookky_session_context", JSON.stringify(ctx));

    // Bắn CustomEvent cho AI Chatbot Widget lắng nghe mà không cần query storage
    window.dispatchEvent(
      new CustomEvent("nook_session_event", {
        detail: { event, payload, context: ctx },
      })
    );
  } catch {
    // Bỏ qua lỗi sessionStorage nếu bị chặn
  }
}

/**
 * Hàm điều phối tracking trung tâm (Unified Tracking Hub).
 * 1 lần gọi sẽ tự động:
 * 1. Sinh event_id định danh duy nhất (khử trùng lặp).
 * 2. Đẩy vào window.dataLayer.
 * 3. Kích hoạt Browser Pixels (GA4 gtag, Meta fbq, TikTok ttq) với event_id.
 * 4. Gửi payload lên Server-side CAPI (/api/tracking/events) bằng fetch keepalive.
 * 5. Cập nhật ngữ cảnh phiên tức thời cho AI Chatbot.
 */
export function track(event: NookAnalyticsEvent, payload: AnalyticsPayload = {}): string {
  if (typeof window === "undefined") return "";

  // 1. Xác định event_id (nếu payload đã có thì dùng, chưa có thì sinh mới)
  const eventId = (payload.event_id as string) || generateEventId();
  const enhancedPayload = { ...payload, event_id: eventId };

  // 2. dataLayer truyền thống (Google Tag Manager / Debug)
  const w = window as any;
  w.dataLayer = w.dataLayer || [];
  w.dataLayer.push({ event, ...enhancedPayload });

  // 3. Browser Pixels với Event ID để Deduplication
  try {
    // GA4 Browser gtag
    if (typeof w.gtag === "function") {
      w.gtag("event", event, {
        ...enhancedPayload,
        event_id: eventId,
      });
    }

    // Meta Browser fbq
    if (typeof w.fbq === "function") {
      const metaEventMap: Record<string, string> = {
        view_item: "ViewContent",
        add_to_cart: "AddToCart",
        begin_checkout: "InitiateCheckout",
        purchase: "Purchase",
        payment_reported: "CustomizeProduct", // hoặc Custom Event
      };

      const metaName = metaEventMap[event];
      if (metaName) {
        w.fbq(
          "track",
          metaName,
          {
            content_name: payload.item_name || undefined,
            content_ids: payload.item_id ? [String(payload.item_id)] : undefined,
            content_type: "product",
            value: payload.value ? Number(payload.value) : undefined,
            currency: "VND",
            order_id: (payload.transaction_id as string) || undefined,
          },
          { eventID: eventId }
        );
      } else {
        w.fbq("trackCustom", event, enhancedPayload, { eventID: eventId });
      }
    }

    // TikTok Browser ttq
    if (typeof w.ttq === "object" && typeof w.ttq.track === "function") {
      const tiktokEventMap: Record<string, string> = {
        view_item: "ViewContent",
        add_to_cart: "AddToCart",
        begin_checkout: "InitiateCheckout",
        purchase: "CompletePayment",
        payment_reported: "CompletePayment",
      };

      const tiktokName = tiktokEventMap[event];
      if (tiktokName) {
        w.ttq.track(
          tiktokName,
          {
            content_id: payload.item_id ? String(payload.item_id) : undefined,
            content_name: payload.item_name ? String(payload.item_name) : undefined,
            content_type: "product",
            quantity: payload.quantity ? Number(payload.quantity) : 1,
            price: payload.value ? Number(payload.value) : undefined,
            value: payload.value ? Number(payload.value) : undefined,
            currency: "VND",
          },
          { event_id: eventId }
        );
      }
    }
  } catch (err) {
    console.debug("[Analytics] Lỗi khi kích hoạt Browser Pixel:", err);
  }

  // 4. Cập nhật Session Context cho AI Chatbot
  updateSessionContext(event, enhancedPayload);

  // 5. Gửi Server-side CAPI (/api/tracking/events)
  // Chỉ gửi các sự kiện e-commerce quan trọng hoặc sự kiện tùy chỉnh cần thiết
  const criticalEvents: NookAnalyticsEvent[] = [
    "view_item",
    "add_to_cart",
    "begin_checkout",
    "purchase",
    "payment_reported",
  ];

  if (criticalEvents.includes(event)) {
    const userData: TrackingUserData = {
      fbp: getOrCreateFbp(),
      fbc: getOrCreateFbc(),
      gaClientId: getGaClientId(),
      ttclid: getTtclid(),
      userAgent: typeof navigator !== "undefined" ? navigator.userAgent : undefined,
      email: (payload.email as string) || undefined,
      phone: (payload.phone as string) || undefined,
      fullName: (payload.fullName as string) || undefined,
    };

    const serverEventPayload: UnifiedTrackingEvent = {
      event_name: event,
      event_id: eventId,
      client_timestamp: Date.now(),
      event_source_url: typeof window !== "undefined" ? window.location.href : "https://nookky.shop",
      user_data: userData,
      custom_data: enhancedPayload,
    };

    try {
      fetch("/api/tracking/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(serverEventPayload),
        keepalive: true,
      }).catch((error) => {
        console.debug("[Analytics] Server tracking call skipped/failed:", error);
      });
    } catch {
      // Bỏ qua lỗi fetch keepalive trên trình duyệt cũ
    }
  }

  return eventId;
}
