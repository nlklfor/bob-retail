"use client";

import { motion } from "motion/react";
import { useReducedMotionAware } from "@/lib/useReducedMotionAware";

export function OrderConfirmationHeader({
  orderNumber,
  customerEmail,
}: {
  orderNumber: string;
  customerEmail: string | null;
}) {
  const prefersReducedMotion = useReducedMotionAware();

  return (
    <div className="text-center">
      <motion.div
        initial={
          prefersReducedMotion
            ? { opacity: 1, scale: 1 }
            : { opacity: 0, scale: 0.6 }
        }
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
        className="mx-auto flex h-20 w-20 items-center justify-center border border-fg"
      >
        <svg
          width="36"
          height="36"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
        >
          <motion.polyline
            points="5 12.5 10 17.5 19 7"
            initial={{ pathLength: prefersReducedMotion ? 1 : 0 }}
            animate={{ pathLength: 1 }}
            transition={
              prefersReducedMotion
                ? { duration: 0 }
                : { duration: 0.4, delay: 0.35, ease: "easeOut" }
            }
          />
        </svg>
      </motion.div>

      <motion.div
        initial={
          prefersReducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }
        }
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.4,
          delay: prefersReducedMotion ? 0 : 0.2,
        }}
      >
        <h1 className="mt-6 font-display text-3xl uppercase tracking-tight sm:text-4xl">
          Дякуємо за замовлення!
        </h1>
        <p className="mt-2 text-muted">Замовлення №{orderNumber}</p>
        {customerEmail ? (
          <p className="mt-1 text-sm text-muted">
            Підтвердження надіслано на {customerEmail}
          </p>
        ) : null}
      </motion.div>
    </div>
  );
}
