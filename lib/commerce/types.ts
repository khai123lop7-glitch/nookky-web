export type CartLine = {
  productSlug: string;
  quantity: number;
  unitPrice: number;
  configurationId?: string;
};

export type Cart = {
  id: string;
  lines: CartLine[];
  subtotal: number;
  total: number;
  currency: "VND";
};

export type OrderStatus = "pending" | "paid" | "failed" | "cancelled" | "fulfilled" | "refunded";

export type Order = {
  id: string;
  status: OrderStatus;
  total: number;
  currency: "VND";
  createdAt: string;
};

/**
 * UI code should depend on this interface, not directly on WooCommerce,
 * Supabase or a payment provider. The adapter can be replaced later without
 * rebuilding the storefront.
 */
export interface CommerceAdapter {
  getCart(): Promise<Cart | null>;
  addToCart(line: Omit<CartLine, "unitPrice">): Promise<Cart>;
  removeFromCart(productSlug: string): Promise<Cart>;
  createCheckout(): Promise<{ checkoutUrl: string }>;
  getOrder(orderId: string): Promise<Order | null>;
}
