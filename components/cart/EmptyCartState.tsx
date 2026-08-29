"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { BagIcon } from "@/components/layout/icons";
import { useReducedMotionAware } from "@/lib/useReducedMotionAware";

export function EmptyCartState({ onNavigate }: { onNavigate?: () => void }) {
  const prefersReducedMotion = useReducedMotionAware();

  return (
    <motion.div
      initial={prefersReducedMotion ? undefined : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col items-center justify-center px-6 py-16 text-center"
    >
      <div className="flex h-16 w-16 items-center justify-center border border-border text-muted">
        <BagIcon />
      </div>
      <p className="mt-6 font-display text-xl uppercase tracking-tight">
        Кошик порожній
      </p>
      <p className="mt-2 text-sm text-muted">
        Здається, ви ще нічого не додали.
      </p>
      <Link
        href="/catalog"
        onClick={onNavigate}
        className="mt-6 border border-fg px-6 py-3 text-sm uppercase tracking-wide hover:bg-fg hover:text-bg"
      >
        Перейти до каталогу
      </Link>
    </motion.div>
  );
}
