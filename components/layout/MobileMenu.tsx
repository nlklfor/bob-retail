"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { CloseIcon } from "./icons";

const LINKS = [
  { href: "/catalog", label: "Каталог" },
  { href: "/contacts", label: "Контакти" },
  { href: "/faq", label: "Питання" },
];

// Header nav collapses to this below md — three text links plus a centered
// video logo plus three icons doesn't fit on a phone-width screen.
export function MobileMenu() {
  const [open, setOpen] = useState(false);

  return (
    <div className="md:hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Закрити меню" : "Меню"}
        aria-expanded={open}
        className="flex h-9 w-9 items-center justify-center"
      >
        {open ? (
          <CloseIcon />
        ) : (
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            aria-hidden="true"
          >
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        )}
      </button>

      <AnimatePresence>
        {open ? (
          <>
            <motion.button
              type="button"
              aria-label="Закрити меню"
              onClick={() => setOpen(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="fixed inset-0 top-24 z-20 bg-fg/40"
            />
            <motion.nav
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.15 }}
              className="fixed inset-x-0 top-24 z-30 flex flex-col border-b border-border bg-bg text-sm uppercase tracking-wide text-fg"
            >
              {LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="border-t border-border px-6 py-4 hover:text-highlight"
                >
                  {link.label}
                </Link>
              ))}
            </motion.nav>
          </>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
