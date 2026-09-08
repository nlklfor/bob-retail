"use client";

import { create } from "zustand";

type ProductRequestState = {
  isOpen: boolean;
  open: () => void;
  close: () => void;
};

// Same shape as cart-sidebar-store — lets the header nav's "Під замовлення"
// entry open the request panel too, not just the edge tab.
export const useProductRequestStore = create<ProductRequestState>((set) => ({
  isOpen: false,
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
}));
