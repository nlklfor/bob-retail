"use client";

import { useCartCount } from "@/lib/cart-store";

export function CartBadge() {
  const count = useCartCount();
  if (count === 0) return null;
  return (
    <span className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center bg-fg px-1 text-[10px] font-medium text-bg">
      {count}
    </span>
  );
}
