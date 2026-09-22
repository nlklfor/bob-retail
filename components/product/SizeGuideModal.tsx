"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useReducedMotionAware } from "@/lib/useReducedMotionAware";
import { CloseIcon } from "@/components/layout/icons";
import {
  SIZE_GUIDE_CATEGORIES,
  BRAND_ORDER,
  BRAND_LABELS,
  type SizeGuideCategory,
  type FootwearChart,
  type ClothingChart,
  type CapChart,
} from "@/lib/size-guide-data";

const BOB_FALLBACK_KEY = "__bob__";

function SizeTable({
  category,
  chart,
}: {
  category: SizeGuideCategory;
  chart: FootwearChart | ClothingChart | CapChart;
}) {
  return (
    <div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[380px] border-collapse text-sm">
          <thead>
            <tr className="border-b border-border text-left uppercase tracking-wide text-muted">
              {category.kind === "footwear" ? (
                <>
                  <th className="py-2 pr-4">EU</th>
                  <th className="py-2 pr-4">UK</th>
                  <th className="py-2 pr-4">US</th>
                  <th className="py-2">CM</th>
                </>
              ) : category.kind === "clothing" ? (
                <>
                  <th className="py-2 pr-4">Розмір</th>
                  <th className="py-2 pr-4">EU</th>
                  <th className="py-2 pr-4">Груди, см</th>
                  <th className="py-2">Талія, см</th>
                </>
              ) : (
                <>
                  <th className="py-2 pr-4">Розмір</th>
                  <th className="py-2">Обхват голови, см</th>
                </>
              )}
            </tr>
          </thead>
          <tbody>
            {category.kind === "footwear"
              ? (chart as FootwearChart).rows.map((row, i) => (
                  <tr key={i} className="border-b border-border/50">
                    <td className="py-2 pr-4 text-fg">{row.eu}</td>
                    <td className="py-2 pr-4 text-muted">{row.uk}</td>
                    <td className="py-2 pr-4 text-muted">{row.us}</td>
                    <td className="py-2 text-muted">{row.cm}</td>
                  </tr>
                ))
              : category.kind === "clothing"
                ? (chart as ClothingChart).rows.map((row, i) => (
                    <tr key={i} className="border-b border-border/50">
                      <td className="py-2 pr-4 text-fg">{row.size}</td>
                      <td className="py-2 pr-4 text-muted">{row.eu}</td>
                      <td className="py-2 pr-4 text-muted">{row.chestCm}</td>
                      <td className="py-2 text-muted">{row.waistCm}</td>
                    </tr>
                  ))
                : (chart as CapChart).rows.map((row, i) => (
                    <tr key={i} className="border-b border-border/50">
                      <td className="py-2 pr-4 text-fg">{row.size}</td>
                      <td className="py-2 text-muted">{row.circumferenceCm}</td>
                    </tr>
                  ))}
          </tbody>
        </table>
      </div>
      {chart.note ? (
        <p className="mt-3 text-xs text-muted">{chart.note}</p>
      ) : null}
    </div>
  );
}

function BrandAccordion({ category }: { category: SizeGuideCategory }) {
  const [openBrand, setOpenBrand] = useState<string | null>(null);

  const presentBrands = BRAND_ORDER.filter(
    (key) => category.brands[key] !== undefined,
  );

  return (
    <div className="divide-y divide-border/60 border-t border-border/60 bg-surface">
      {presentBrands.map((brandKey) => {
        const chart = category.brands[brandKey]!;
        const open = openBrand === brandKey;
        return (
          <div key={brandKey}>
            <button
              type="button"
              onClick={() => setOpenBrand(open ? null : brandKey)}
              aria-expanded={open}
              className="flex w-full items-center justify-between px-4 py-3 text-left text-sm hover:bg-bg"
            >
              {BRAND_LABELS[brandKey]}
              <span className="text-muted">{open ? "−" : "+"}</span>
            </button>
            {open ? (
              <div className="bg-bg px-4 pb-4">
                <SizeTable category={category} chart={chart} />
              </div>
            ) : null}
          </div>
        );
      })}

      {category.kind === "footwear" ? (
        <div>
          <button
            type="button"
            onClick={() =>
              setOpenBrand(
                openBrand === BOB_FALLBACK_KEY ? null : BOB_FALLBACK_KEY,
              )
            }
            aria-expanded={openBrand === BOB_FALLBACK_KEY}
            className="flex w-full items-center justify-between px-4 py-3 text-left text-sm hover:bg-bg"
          >
            {category.bobFallback.label}
            <span className="text-muted">
              {openBrand === BOB_FALLBACK_KEY ? "−" : "+"}
            </span>
          </button>
          {openBrand === BOB_FALLBACK_KEY ? (
            <div className="bg-bg px-4 pb-4">
              <SizeTable category={category} chart={category.bobFallback} />
            </div>
          ) : null}
        </div>
      ) : null}

      {presentBrands.length === 0 && category.kind !== "footwear" ? (
        <p className="px-4 py-3 text-sm text-muted">
          Розмірні сітки для цієї категорії ще додаються.
        </p>
      ) : null}
    </div>
  );
}

export function SizeGuideModal() {
  const [open, setOpen] = useState(false);
  const [openCategory, setOpenCategory] = useState<string | null>(null);
  const prefersReducedMotion = useReducedMotionAware();

  function close() {
    setOpen(false);
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="text-sm uppercase tracking-wide text-muted underline underline-offset-4 hover:text-fg"
      >
        Розмірна сітка
      </button>

      <AnimatePresence>
        {open ? (
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
              initial={
                prefersReducedMotion
                  ? { opacity: 0 }
                  : { opacity: 0, scale: 0.97 }
              }
              animate={
                prefersReducedMotion ? { opacity: 1 } : { opacity: 1, scale: 1 }
              }
              exit={
                prefersReducedMotion
                  ? { opacity: 0 }
                  : { opacity: 0, scale: 0.97 }
              }
              transition={{ duration: 0.2, ease: "easeOut" }}
              role="dialog"
              aria-modal="true"
              aria-label="Розмірна сітка"
              className="fixed left-1/2 top-1/2 z-[151] max-h-[85vh] w-[calc(100%-2rem)] max-w-2xl -translate-x-1/2 -translate-y-1/2 overflow-y-auto bg-bg p-6 text-fg sm:p-8"
            >
              <div className="flex items-center justify-between">
                <h2 className="font-display text-xl uppercase tracking-tight">
                  Розмірна сітка
                </h2>
                <button
                  type="button"
                  onClick={close}
                  aria-label="Закрити"
                  className="text-muted hover:text-fg"
                >
                  <CloseIcon />
                </button>
              </div>

              <div className="mt-6 divide-y divide-border border-y border-border">
                {SIZE_GUIDE_CATEGORIES.map((category) => {
                  const isOpen = openCategory === category.key;
                  return (
                    <div key={category.key}>
                      <button
                        type="button"
                        onClick={() =>
                          setOpenCategory(isOpen ? null : category.key)
                        }
                        aria-expanded={isOpen}
                        className="flex w-full items-center justify-between py-4 text-left text-sm uppercase tracking-wide"
                      >
                        {category.label}
                        <span className="text-lg leading-none text-muted">
                          {isOpen ? "−" : "+"}
                        </span>
                      </button>
                      {isOpen ? <BrandAccordion category={category} /> : null}
                    </div>
                  );
                })}
              </div>

              <p className="mt-4 text-xs text-muted">
                Точна посадка може незначно відрізнятись залежно від моделі. «—»
                означає, що бренд офіційно не публікує значення для цього
                стовпця.
              </p>
            </motion.div>
          </>
        ) : null}
      </AnimatePresence>
    </>
  );
}
