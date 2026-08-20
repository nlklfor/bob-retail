"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";

// Cycles the wordmark through unrelated display faces continuously, on a
// steady beat, for as long as it's visible. Fonts are loaded in
// app/layout.tsx (next/font only works at the module level), this just
// references the resulting CSS variables.
const LOGO_FONTS = [
  "var(--font-logo-anton)",
  "var(--font-logo-marker)",
  "var(--font-logo-bebas)",
  "var(--font-logo-archivo)",
  "var(--font-logo-monoton)",
  "var(--font-logo-righteous)",
  "var(--font-logo-bungee)",
  "var(--font-fixel-display)",
];

const CYCLE_INTERVAL_MS = 850;

export function AnimatedLogo() {
  // Starts on the site's real display font (last in the list) so the very
  // first paint — before hydration, or for reduced-motion users — looks
  // intentional rather than landing mid-flicker.
  const [step, setStep] = useState(LOGO_FONTS.length - 1);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (prefersReducedMotion) return;

    const id = window.setInterval(() => {
      setStep((s) => (s + 1) % LOGO_FONTS.length);
    }, CYCLE_INTERVAL_MS);

    return () => window.clearInterval(id);
  }, []);

  return (
    <Link
      href="/"
      aria-label="BOB — на головну"
      className="text-2xl font-bold tracking-tight overflow-hidden inline-block"
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={step}
          style={{ fontFamily: LOGO_FONTS[step], display: "inline-block" }}
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 6 }}
          transition={{ duration: 0.15, ease: "easeOut" }}
        >
          BOB
        </motion.span>
      </AnimatePresence>
    </Link>
  );
}
