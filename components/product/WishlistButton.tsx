"use client";

import { useWishlistStore, type WishlistItem } from "@/lib/wishlist-store";

export function WishlistButton({ item }: { item: WishlistItem }) {
  const inWishlist = useWishlistStore((state) => state.has(item.productId));
  const toggle = useWishlistStore((state) => state.toggle);

  return (
    <button
      type="button"
      onClick={() => toggle(item)}
      aria-label={
        inWishlist ? "Прибрати зі списку бажань" : "Додати до списку бажань"
      }
      className={`border px-3 py-3 text-sm uppercase tracking-wide ${
        inWishlist
          ? "border-accent text-accent"
          : "border-fg hover:bg-fg hover:text-bg"
      }`}
    >
      {inWishlist ? "Збережено" : "Зберегти"}
    </button>
  );
}
