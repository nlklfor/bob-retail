"use client";

import { useCartCount } from "@/lib/cart-store";

export function CartBadge() {
  const count = useCartCount();
  if (count === 0) return null;
  return <span className="text-accent">({count})</span>;
}
