"use client";

import { useEffect } from "react";
import { useCartStore } from "@/lib/cart-store";

// Clearing the cart used to happen on the checkout page right before the
// hard navigation to this one — but that's a synchronous store update, so
// React re-rendered CheckoutPage with an empty cart (showing its "Кошик
// порожній" state) for the brief moment before the browser actually left
// the page. Clearing here instead, after this page has already mounted,
// means the customer never sees that flash.
//
// Only fires when `enabled` — the customer can back out of a real Monobank
// payment (or it can fail/expire), and their cart should still be there if
// they land back on this page without having actually paid.
export function ClearCartOnMount({ enabled }: { enabled: boolean }) {
  const clear = useCartStore((state) => state.clear);

  useEffect(() => {
    if (!enabled) return;
    const handle = window.setTimeout(() => clear(), 0);
    return () => window.clearTimeout(handle);
  }, [enabled, clear]);

  return null;
}
