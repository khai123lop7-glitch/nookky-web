export type NookAnalyticsEvent =
  | "view_item_list"
  | "select_item"
  | "view_item"
  | "add_to_cart"
  | "view_cart"
  | "begin_checkout"
  | "purchase"
  | "hero_primary_click"
  | "featured_product_click"
  | "shop_filter_click"
  | "spotlight_gallery_change"
  | "spotlight_zoom_open"
  | "place_select"
  | "build_step_select"
  | "studio_started"
  | "design_saved"
  | "room_preview_started";

export type AnalyticsPayload = Record<string, string | number | boolean | null | undefined>;

/**
 * Frontend tracking boundary.
 * GA4/GTM/other destinations will plug in here later so UI components do not
 * depend directly on a vendor SDK.
 */
export function track(event: NookAnalyticsEvent, payload: AnalyticsPayload = {}) {
  if (typeof window === "undefined") return;

  const w = window as Window & { dataLayer?: Array<Record<string, unknown>> };
  w.dataLayer = w.dataLayer || [];
  w.dataLayer.push({ event, ...payload });
}
