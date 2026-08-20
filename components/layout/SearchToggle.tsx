"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { SearchIcon, CloseIcon } from "./icons";

// UI placeholder only — real catalog search is a later pass. Keeps the
// header layout/interaction shipping now without promising a feature that
// isn't wired up yet.
export function SearchToggle() {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Закрити пошук" : "Пошук"}
        aria-expanded={open}
        className="flex h-9 w-9 items-center justify-center hover:opacity-60"
      >
        {open ? <CloseIcon /> : <SearchIcon />}
      </button>
      <AnimatePresence>
        {open ? (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-full z-50 mt-2 w-72 border border-header-fg/15 bg-header-bg p-3 shadow-lg"
          >
            <input
              type="search"
              placeholder="Пошук з'явиться незабаром"
              disabled
              className="w-full border border-header-fg/20 bg-transparent px-3 py-2 text-sm text-header-fg placeholder:text-header-fg/40 disabled:cursor-not-allowed"
            />
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
