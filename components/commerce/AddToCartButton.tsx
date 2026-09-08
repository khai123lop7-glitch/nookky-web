"use client";

import { useState } from "react";
import { products } from "@/data/products";
import { track } from "@/lib/analytics";
import { useCart } from "./CartProvider";

interface AddToCartButtonProps {
  slug: string;
  quantity?: number;
  className?: string;
  label?: string;
  addedLabel?: string;
  stopPropagation?: boolean;
}

export function AddToCartButton({
  slug,
  quantity = 1,
  className = "nk-button",
  label = "Thêm vào giỏ",
  addedLabel = "Đã thêm vào giỏ",
  stopPropagation = false,
}: AddToCartButtonProps) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);
  const product = products.find((item) => item.slug === slug);

  const handleAdd = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (stopPropagation) {
      e.preventDefault();
      e.stopPropagation();
    }
    addItem(slug, quantity);
    if (product) {
      track("add_to_cart", {
        item_id: product.slug,
        item_name: product.name,
        value: product.price * quantity,
        quantity,
        currency: "VND",
      });
    }
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1200);
  };

  return (
    <button className={className} type="button" onClick={handleAdd} aria-live="polite">
      {added ? addedLabel : label}
    </button>
  );
}
