export type PromotionType = "percent" | "fixed" | "freeship";

export type Promotion = {
  code: string;
  label: string;
  description: string;
  type: PromotionType;
  value: number;
  minOrder: number;
  maxDiscount?: number;
};

export type PromotionQuote = {
  promotion: Promotion | null;
  discountAmount: number;
  shippingFee: number;
  total: number;
  isFreeShipping: boolean;
  error: string | null;
};

export const STANDARD_SHIPPING_FEE = 30_000;
export const FREE_SHIPPING_THRESHOLD = 1_000_000;
export const GIFT_THRESHOLD = 1_500_000;

export const AVAILABLE_PROMOTIONS: readonly Promotion[] = [
  {
    code: "NOOKKY10",
    label: "Chào Bạn Mới",
    description: "Giảm 10% cho đơn từ 500.000₫, tối đa 150.000₫",
    type: "percent",
    value: 10,
    minOrder: 500_000,
    maxDiscount: 150_000,
  },
  {
    code: "KYUC50K",
    label: "Ký Ức Riêng",
    description: "Giảm 50.000₫ cho đơn từ 800.000₫",
    type: "fixed",
    value: 50_000,
    minOrder: 800_000,
  },
  {
    code: "FREESHIP",
    label: "Freeship Đơn Hàng",
    description: "Miễn phí vận chuyển cho đơn từ 500.000₫",
    type: "freeship",
    value: 0,
    minOrder: 500_000,
  },
] as const;

export function normalizePromoCode(code: string | null | undefined) {
  return (code || "").trim().toUpperCase();
}

export function findPromotion(code: string | null | undefined) {
  const normalized = normalizePromoCode(code);
  return AVAILABLE_PROMOTIONS.find((promotion) => promotion.code === normalized) || null;
}

export function quotePromotion(subtotalInput: number, promoCode?: string | null): PromotionQuote {
  const subtotal = Number.isFinite(subtotalInput) ? Math.max(0, Math.round(subtotalInput)) : 0;
  const normalized = normalizePromoCode(promoCode);
  const promotion = normalized ? findPromotion(normalized) : null;
  let error: string | null = null;

  if (normalized && !promotion) {
    error = `Mã "${normalized}" không tồn tại hoặc đã hết hạn`;
  } else if (promotion && subtotal < promotion.minOrder) {
    error = `Mã "${promotion.code}" áp dụng cho đơn từ ${promotion.minOrder.toLocaleString("vi-VN")}₫`;
  }

  const validPromotion = error ? null : promotion;
  let discountAmount = 0;
  if (validPromotion?.type === "percent") {
    const rawDiscount = Math.round((subtotal * validPromotion.value) / 100);
    discountAmount = Math.min(rawDiscount, validPromotion.maxDiscount ?? rawDiscount, subtotal);
  } else if (validPromotion?.type === "fixed") {
    discountAmount = Math.min(validPromotion.value, subtotal);
  }

  const isFreeShipping =
    subtotal > 0 &&
    (subtotal >= FREE_SHIPPING_THRESHOLD || validPromotion?.type === "freeship");
  const shippingFee = subtotal === 0 || isFreeShipping ? 0 : STANDARD_SHIPPING_FEE;

  return {
    promotion: validPromotion,
    discountAmount,
    shippingFee,
    total: Math.max(0, subtotal - discountAmount) + shippingFee,
    isFreeShipping,
    error,
  };
}
