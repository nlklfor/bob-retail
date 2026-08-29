"use client";

import { useCartSidebarStore } from "@/lib/cart-sidebar-store";
import { CartBadge } from "./CartBadge";
import { BagIcon } from "./icons";

export function CartButton() {
  const open = useCartSidebarStore((state) => state.open);

  return (
    <button
      type="button"
      onClick={open}
      aria-label="Кошик"
      className="relative flex h-9 w-9 items-center justify-center hover:text-highlight"
    >
      <BagIcon />
      <CartBadge />
    </button>
  );
}
