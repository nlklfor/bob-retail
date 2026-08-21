"use client";

import { motion, useReducedMotion } from "motion/react";

export function ScrollIndicator({ targetId }: { targetId: string }) {
  const prefersReducedMotion = useReducedMotion();

  function handleClick() {
    document.getElementById(targetId)?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label="Прокрутити вниз"
      className="absolute inset-x-0 bottom-8 flex flex-col items-center gap-2 text-fg"
    >
      <span className="text-xs uppercase tracking-[0.2em]">
        Прокрутіть вниз
      </span>
      <motion.svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        animate={prefersReducedMotion ? undefined : { y: [0, 6, 0] }}
        transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
      >
        <line x1="12" y1="4" x2="12" y2="18" />
        <polyline points="6 12 12 18 18 12" />
      </motion.svg>
    </button>
  );
}
