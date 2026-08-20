"use client";

import { useWishlistCount } from "@/lib/wishlist-store";

export function WishlistBadge() {
  const count = useWishlistCount();
  if (count === 0) return null;
  return (
    <span className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center bg-header-fg px-1 text-[10px] font-medium text-header-bg">
      {count}
    </span>
  );
}
