"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { products } from "@/data/products";
import {
  AVAILABLE_PROMOTIONS,
  findPromotion,
  normalizePromoCode,
  quotePromotion,
  type Promotion,
} from "@/lib/promotions";

export type CartItem = {
  slug: string;
  quantity: number;
};

export type ToastItem = {
  slug: string;
  name: string;
  price: number;
  image?: string;
  quantity: number;
};

export type PromoCode = Promotion;
export const AVAILABLE_PROMOS = AVAILABLE_PROMOTIONS;

type CartContextValue = {
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  hydrated: boolean;
  lastAdded: ToastItem | null;
  appliedPromo: PromoCode | null;
  discountAmount: number;
  isFreeShipping: boolean;
  addItem: (slug: string, quantity?: number) => void;
  removeItem: (slug: string) => void;
  setQuantity: (slug: string, quantity: number) => void;
  clearCart: () => void;
  closeToast: () => void;
  applyPromo: (code: string) => { success: boolean; message: string };
  removePromo: () => void;
};

const STORAGE_KEY = "nookky-cart-v1";
const PROMO_STORAGE_KEY = "nookky-promo-v1";
const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [lastAdded, setLastAdded] = useState<ToastItem | null>(null);
  const [appliedPromoCode, setAppliedPromoCode] = useState<string | null>(null);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as CartItem[];
        if (Array.isArray(parsed)) {
          setItems(parsed.filter((item) => typeof item.slug === "string" && Number.isFinite(item.quantity) && item.quantity > 0));
        }
      }

      const storedPromo = window.localStorage.getItem(PROMO_STORAGE_KEY);
      if (storedPromo) {
        const parsedPromo = JSON.parse(storedPromo) as unknown;
        const storedCode = typeof parsedPromo === "string"
          ? parsedPromo
          : typeof parsedPromo === "object" && parsedPromo && "code" in parsedPromo
            ? String(parsedPromo.code)
            : "";
        if (findPromotion(storedCode)) setAppliedPromoCode(normalizePromoCode(storedCode));
      }
    } catch {
      // Ignore malformed local cart data and start clean.
    } finally {
      setHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [hydrated, items]);

  useEffect(() => {
    if (!hydrated) return;
    if (appliedPromoCode) {
      window.localStorage.setItem(PROMO_STORAGE_KEY, JSON.stringify(appliedPromoCode));
    } else {
      window.localStorage.removeItem(PROMO_STORAGE_KEY);
    }
  }, [hydrated, appliedPromoCode]);

  const addItem = (slug: string, quantity = 1) => {
    const validQty = Math.max(1, quantity);
    setItems((current) => {
      const existing = current.find((item) => item.slug === slug);
      if (existing) {
        return current.map((item) => item.slug === slug ? { ...item, quantity: Math.min(99, item.quantity + validQty) } : item);
      }
      return [...current, { slug, quantity: Math.min(99, validQty) }];
    });

    const product = products.find((p) => p.slug === slug);
    if (product) {
      setLastAdded({
        slug: product.slug,
        name: product.name,
        price: product.price,
        image: product.media.cover,
        quantity: validQty,
      });
    }
  };

  const removeItem = (slug: string) => setItems((current) => current.filter((item) => item.slug !== slug));

  const setQuantity = (slug: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(slug);
      return;
    }
    setItems((current) => current.map((item) => item.slug === slug ? { ...item, quantity: Math.min(99, quantity) } : item));
  };

  const clearCart = () => {
    setItems([]);
    setAppliedPromoCode(null);
  };

  const closeToast = () => setLastAdded(null);
  const itemCount = useMemo(() => items.reduce((sum, item) => sum + item.quantity, 0), [items]);

  const subtotal = useMemo(() => {
    return items.reduce((sum, item) => {
      const product = products.find((p) => p.slug === item.slug);
      return sum + (product ? product.price * item.quantity : 0);
    }, 0);
  }, [items]);

  const promotionQuote = useMemo(
    () => quotePromotion(subtotal, appliedPromoCode),
    [subtotal, appliedPromoCode]
  );
  const appliedPromo = promotionQuote.promotion;
  const discountAmount = promotionQuote.discountAmount;
  const isFreeShipping = promotionQuote.isFreeShipping;

  const applyPromo = (code: string) => {
    const quote = quotePromotion(subtotal, code);
    if (!quote.promotion) return { success: false, message: quote.error || "Mã ưu đãi không hợp lệ" };
    setAppliedPromoCode(quote.promotion.code);
    return { success: true, message: `Đã áp dụng ${quote.promotion.code}` };
  };

  const removePromo = () => setAppliedPromoCode(null);

  return (
    <CartContext.Provider
      value={{
        items,
        itemCount,
        subtotal,
        hydrated,
        lastAdded,
        appliedPromo,
        discountAmount,
        isFreeShipping,
        addItem,
        removeItem,
        setQuantity,
        clearCart,
        closeToast,
        applyPromo,
        removePromo,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const value = useContext(CartContext);
  if (!value) throw new Error("useCart must be used inside CartProvider");
  return value;
}

