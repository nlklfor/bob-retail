"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { useCartStore, useCartSubtotal } from "@/lib/cart-store";
import { useCartSidebarStore } from "@/lib/cart-sidebar-store";
import { useReducedMotionAware } from "@/lib/useReducedMotionAware";
import { CloseIcon } from "@/components/layout/icons";
import { CartItemRow } from "./CartItemRow";
import { EmptyCartState } from "./EmptyCartState";
import { formatPrice } from "@/lib/format";

export function CartSidebar() {
  const isOpen = useCartSidebarStore((state) => state.isOpen);
  const close = useCartSidebarStore((state) => state.close);
  const items = useCartStore((state) => state.items);
  const removeItem = useCartStore((state) => state.removeItem);
  const subtotal = useCartSubtotal();
  const prefersReducedMotion = useReducedMotionAware();
  const [confirmingVariantId, setConfirmingVariantId] = useState<string | null>(
    null,
  );

  // Lock page scroll behind the drawer while it's open.
  useEffect(() => {
    if (!isOpen) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen ? (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={close}
            aria-hidden="true"
            className="fixed inset-0 z-[150] bg-fg/40"
          />
          <motion.div
            initial={prefersReducedMotion ? { opacity: 0 } : { x: "100%" }}
            animate={prefersReducedMotion ? { opacity: 1 } : { x: 0 }}
            exit={prefersReducedMotion ? { opacity: 0 } : { x: "100%" }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            role="dialog"
            aria-label="Кошик"
            className="fixed inset-y-0 right-0 z-[151] flex w-full max-w-md flex-col bg-bg text-fg"
          >
            <div className="flex items-center justify-between border-b border-border px-6 py-5">
              <h2 className="font-display text-lg uppercase tracking-tight">
                Кошик{items.length > 0 ? ` (${items.length})` : ""}
              </h2>
              <button
                type="button"
                onClick={close}
                aria-label="Закрити кошик"
                className="hover:text-highlight"
              >
                <CloseIcon />
              </button>
            </div>

            {items.length === 0 ? (
              <div className="flex flex-1 items-center justify-center">
                <EmptyCartState onNavigate={close} />
              </div>
            ) : (
              <>
                <div className="flex-1 divide-y divide-border overflow-y-auto px-6">
                  {items.map((item) => (
                    <CartItemRow
                      key={item.variantId}
                      item={item}
                      confirming={confirmingVariantId === item.variantId}
                      onRequestDelete={() =>
                        setConfirmingVariantId(item.variantId)
                      }
                      onConfirmDelete={() => {
                        removeItem(item.variantId);
                        setConfirmingVariantId(null);
                      }}
                      onCancelDelete={() => setConfirmingVariantId(null)}
                      onNavigate={close}
                    />
                  ))}
                </div>

                <div className="space-y-4 border-t border-border px-6 py-5">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted">Сума</span>
                    <span>{formatPrice(subtotal)} грн</span>
                  </div>
                  <Link
                    href="/checkout"
                    onClick={close}
                    className="block w-full bg-fg py-4 text-center text-sm uppercase tracking-wide text-bg hover:opacity-90"
                  >
                    Оформити замовлення
                  </Link>
                </div>
              </>
            )}
          </motion.div>
        </>
      ) : null}
    </AnimatePresence>
  );
}
