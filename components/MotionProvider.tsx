"use client";

import { MotionConfig } from "motion/react";

// Motion auto-detects and complies with the OS Reduced Motion setting by
// default — including in local dev, which makes every Motion-driven
// animation (and every useReducedMotion() call) invisible while testing on
// a machine that has that setting on. Forcing "never" outside production
// only affects local development; real visitors in production still get
// the accessibility-correct "user" behavior.
export function MotionProvider({ children }: { children: React.ReactNode }) {
  return (
    <MotionConfig
      reducedMotion={process.env.NODE_ENV === "production" ? "user" : "never"}
    >
      {children}
    </MotionConfig>
  );
}
