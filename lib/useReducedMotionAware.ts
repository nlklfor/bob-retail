"use client";

import { useReducedMotion } from "motion/react";

// Motion's own useReducedMotion() always reflects the true OS setting,
// regardless of MotionConfig — that prop only affects Motion's internal
// animate/layout system, not this hook (confirmed against Motion's docs
// and a still-open upstream issue, motiondivision/motion#1502). So any
// component gating its own logic on reduced-motion (not just handing a
// value to a motion.* animate prop) needs this instead, or local dev
// testing fights whatever the developer's own machine has set — only
// respect it in production; every build for testing purposes (dev, and
// any non-production environment) always shows the real animation.
export function useReducedMotionAware(): boolean {
  const prefersReducedMotion = useReducedMotion();
  if (process.env.NODE_ENV !== "production") return false;
  return Boolean(prefersReducedMotion);
}
