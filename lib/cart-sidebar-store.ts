"use client";

import { create } from "zustand";

type CartSidebarState = {
  isOpen: boolean;
  open: () => void;
  close: () => void;
};

export const useCartSidebarStore = create<CartSidebarState>((set) => ({
  isOpen: false,
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
}));
