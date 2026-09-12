"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { products } from "@/data/products";

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

export type PromoCode = {
  code: string;
  label: string;
  description: string;
  type: "percent" | "fixed" | "freeship";
  value: number;
  minOrder?: number;
};

export const AVAILABLE_PROMOS: PromoCode[] = [
  {
    code: "NOOKKY10",
    label: "Chào Bạn Mới",
    description: "Giảm 10% tổng đơn hàng",
    type: "percent",
    value: 10,
  },
  {
    code: "KYUC50K",
    label: "Ký Ức Riêng",
    description: "Giảm ngay 50.000₫",
    type: "fixed",
    value: 50000,
  },
  {
    code: "FREESHIP",
    label: "Freeship Đơn Hàng",
    description: "Miễn phí vận chuyển toàn quốc",
    type: "freeship",
    value: 0,
  },
];

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
  const [appliedPromo, setAppliedPromo] = useState<PromoCode | null>(null);

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
        const parsedPromo = JSON.parse(storedPromo) as PromoCode;
        if (parsedPromo && typeof parsedPromo.code === "string") {
          setAppliedPromo(parsedPromo);
        }
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
    if (appliedPromo) {
      window.localStorage.setItem(PROMO_STORAGE_KEY, JSON.stringify(appliedPromo));
    } else {
      window.localStorage.removeItem(PROMO_STORAGE_KEY);
    }
  }, [hydrated, appliedPromo]);

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
    setAppliedPromo(null);
  };

  const closeToast = () => setLastAdded(null);
  const itemCount = useMemo(() => items.reduce((sum, item) => sum + item.quantity, 0), [items]);

  const subtotal = useMemo(() => {
    return items.reduce((sum, item) => {
      const product = products.find((p) => p.slug === item.slug);
      return sum + (product ? product.price * item.quantity : 0);
    }, 0);
  }, [items]);

  const discountAmount = useMemo(() => {
    if (!appliedPromo) return 0;
    if (appliedPromo.type === "percent") {
      return Math.round((subtotal * appliedPromo.value) / 100);
    }
    if (appliedPromo.type === "fixed") {
      return Math.min(subtotal, appliedPromo.value);
    }
    return 0; // freeship modifies shipping
  }, [appliedPromo, subtotal]);

  const isFreeShipping = useMemo(() => {
    return subtotal >= 1000000 || appliedPromo?.type === "freeship";
  }, [subtotal, appliedPromo]);

  const applyPromo = (code: string) => {
    const clean = code.trim().toUpperCase();
    const found = AVAILABLE_PROMOS.find((p) => p.code === clean);
    if (!found) {
      return { success: false, message: `Mã "${clean}" không tồn tại hoặc đã hết hạn` };
    }
    if (found.minOrder && subtotal < found.minOrder) {
      return { success: false, message: `Mã "${clean}" chỉ áp dụng cho đơn từ ${found.minOrder.toLocaleString("vi-VN")}₫` };
    }
    setAppliedPromo(found);
    return { success: true, message: `Đã áp dụng mã "${found.label}" (-${found.type === "percent" ? `${found.value}%` : found.type === "fixed" ? `${found.value.toLocaleString("vi-VN")}₫` : "Freeship"})` };
  };

  const removePromo = () => setAppliedPromo(null);

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

