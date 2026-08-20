"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";

const SESSION_KEY = "bob-intro-seen";
const DURATION_MS = 5000;
const CYCLE_INTERVAL_MS = 260;

// Same font set as the header's AnimatedLogo, at full-screen scale — the
// "what is this" moment before the site reveals itself. Shows once per
// browser session (not on every homepage visit) and never for
// prefers-reduced-motion users.
const INTRO_FONTS = [
  "var(--font-logo-anton)",
  "var(--font-logo-marker)",
  "var(--font-logo-bebas)",
  "var(--font-logo-archivo)",
  "var(--font-logo-monoton)",
  "var(--font-logo-righteous)",
  "var(--font-logo-bungee)",
  "var(--font-fixel-display)",
];

export function IntroSplash() {
  const [visible, setVisible] = useState(false);
  const [fontStep, setFontStep] = useState(0);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const alreadySeen = sessionStorage.getItem(SESSION_KEY);
    if (prefersReducedMotion || alreadySeen) return;

    let fontInterval: number | undefined;
    let hideTimeout: number | undefined;

    // Deferred (not called synchronously in the effect body) — same rule
    // as the header logo's cycle.
    const startHandle = window.setTimeout(() => {
      setVisible(true);
      document.body.style.overflow = "hidden";

      fontInterval = window.setInterval(() => {
        setFontStep((s) => (s + 1) % INTRO_FONTS.length);
      }, CYCLE_INTERVAL_MS);

      hideTimeout = window.setTimeout(() => {
        setVisible(false);
        sessionStorage.setItem(SESSION_KEY, "1");
        document.body.style.overflow = "";
      }, DURATION_MS);
    }, 0);

    return () => {
      window.clearTimeout(startHandle);
      if (fontInterval) window.clearInterval(fontInterval);
      if (hideTimeout) window.clearTimeout(hideTimeout);
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <AnimatePresence>
      {visible ? (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-bg"
        >
          <span
            style={{ fontFamily: INTRO_FONTS[fontStep] }}
            className="text-[20vw] font-bold uppercase leading-none tracking-tight text-fg sm:text-[15vw]"
          >
            BOB
          </span>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
