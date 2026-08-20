"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type WishlistItem = {
  productId: string;
  name: string;
  price: number;
  slug: string;
  image: string | null;
};

type WishlistState = {
  items: WishlistItem[];
  toggle: (item: WishlistItem) => void;
  has: (productId: string) => boolean;
};

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],
      toggle: (item) =>
        set((state) => {
          const exists = state.items.some(
            (i) => i.productId === item.productId,
          );
          return {
            items: exists
              ? state.items.filter((i) => i.productId !== item.productId)
              : [...state.items, item],
          };
        }),
      has: (productId) => get().items.some((i) => i.productId === productId),
    }),
    { name: "bob-retail-wishlist" },
  ),
);

export function useWishlistCount() {
  return useWishlistStore((state) => state.items.length);
}
