"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useReducedMotionAware } from "@/lib/useReducedMotionAware";

const SESSION_KEY = "bob-intro-seen";
// Safety net only — hides itself when the video actually ends (see onEnded
// below), this just guards against a stuck full-screen overlay if the video
// fails to fire that event for some reason.
const MAX_DURATION_MS = 15000;

// Full-screen preview video, played once per browser session on first
// homepage visit. Skipped entirely for prefers-reduced-motion users and on
// repeat visits within the session (only actually respected in
// production — see useReducedMotionAware).
export function IntroSplash() {
  const [visible, setVisible] = useState(false);
  const hiddenRef = useRef(false);
  const prefersReducedMotion = useReducedMotionAware();

  useEffect(() => {
    const alreadySeen = sessionStorage.getItem(SESSION_KEY);
    if (prefersReducedMotion || alreadySeen) return;

    let maxDurationTimeout: number | undefined;

    // Deferred (not called synchronously in the effect body) — same rule
    // as the header logo's cycle.
    const startHandle = window.setTimeout(() => {
      setVisible(true);
      document.body.style.overflow = "hidden";
      maxDurationTimeout = window.setTimeout(hide, MAX_DURATION_MS);
    }, 0);

    return () => {
      window.clearTimeout(startHandle);
      if (maxDurationTimeout) window.clearTimeout(maxDurationTimeout);
      document.body.style.overflow = "";
    };
  }, [prefersReducedMotion]);

  function hide() {
    if (hiddenRef.current) return;
    hiddenRef.current = true;
    setVisible(false);
    sessionStorage.setItem(SESSION_KEY, "1");
    document.body.style.overflow = "";
  }

  return (
    <AnimatePresence>
      {visible ? (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          // Hardcoded to the video's own background, not bg-bg — this is
          // independent of the site's light theme, same reasoning as the
          // hero's scroll indicator staying hardcoded white.
          style={{ backgroundColor: "#000000" }}
          className="fixed inset-0 z-[100] flex items-center justify-center"
        >
          <video
            src="/video/bob_preview.mp4"
            autoPlay
            muted
            playsInline
            onEnded={hide}
            onError={hide}
            className="h-auto w-auto max-h-[500px] max-w-[500px] object-contain"
          />
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
