"use client";

import { useEffect } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useToastStore } from "@/lib/toast-store";
import { useReducedMotionAware } from "@/lib/useReducedMotionAware";
import { CheckIcon } from "./icons";

const DISPLAY_MS = 2500;

export function Toast() {
  const toast = useToastStore((state) => state.toast);
  const hide = useToastStore((state) => state.hide);
  const prefersReducedMotion = useReducedMotionAware();

  useEffect(() => {
    if (!toast) return;
    const handle = window.setTimeout(hide, DISPLAY_MS);
    return () => window.clearTimeout(handle);
  }, [toast, hide]);

  return (
    // z-[140] — deliberately below the cart sidebar (z-150/151), whose
    // opaque background then naturally hides the toast behind it rather
    // than the two overlapping when both are on screen at once.
    <div className="pointer-events-none fixed inset-x-0 bottom-6 z-[140] flex justify-center px-4 sm:inset-x-auto sm:right-6 sm:justify-end">
      <AnimatePresence>
        {toast ? (
          <motion.div
            key={toast.id}
            initial={
              prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 16 }
            }
            animate={{ opacity: 1, y: 0 }}
            exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 16 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="pointer-events-auto flex items-center gap-3 border border-fg bg-bg px-4 py-3 text-sm shadow-lg"
          >
            <CheckIcon />
            <span>{toast.message}</span>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
