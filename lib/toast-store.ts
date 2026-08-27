"use client";

import { create } from "zustand";

type Toast = { id: number; message: string };

type ToastState = {
  toast: Toast | null;
  show: (message: string) => void;
  hide: () => void;
};

let nextId = 0;

export const useToastStore = create<ToastState>((set) => ({
  toast: null,
  // A new id even for a repeated message (e.g. adding the same product
  // twice in a row) so the display component's auto-dismiss timer always
  // resets rather than potentially firing early.
  show: (message) => set({ toast: { id: nextId++, message } }),
  hide: () => set({ toast: null }),
}));
