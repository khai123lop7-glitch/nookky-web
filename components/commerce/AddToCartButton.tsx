"use client";

import { useState } from "react";
import { products } from "@/data/products";
import { track } from "@/lib/analytics";
import { useCart } from "./CartProvider";

export function AddToCartButton({ slug, className = "nk-button" }: { slug: string; className?: string }) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);
  const product = products.find((item) => item.slug === slug);

  const handleAdd = () => {
    addItem(slug, 1);
    if (product) {
      track("add_to_cart", {
        item_id: product.slug,
        item_name: product.name,
        value: product.price,
        currency: "VND",
      });
    }
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1200);
  };

  return (
    <button className={className} type="button" onClick={handleAdd} aria-live="polite">
      {added ? "Đã thêm vào giỏ" : "Thêm vào giỏ"}
    </button>
  );
}
