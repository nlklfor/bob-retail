"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useReducedMotionAware } from "@/lib/useReducedMotionAware";
import { CloseIcon } from "@/components/layout/icons";
import {
  BRAND_SIZE_CHARTS,
  BRAND_ORDER,
  BOB_SIZE_CHARTS,
  BOB_CHART_ORDER,
  type SizeChart,
} from "@/lib/size-guide-data";

const BOB_KEY = "bob";
type OuterTab = (typeof BRAND_ORDER)[number] | typeof BOB_KEY;

function SizeTable({ chart }: { chart: SizeChart }) {
  return (
    <div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[420px] border-collapse text-sm">
          <thead>
            <tr className="border-b border-border text-left uppercase tracking-wide text-muted">
              <th className="py-2 pr-4">EU</th>
              <th className="py-2 pr-4">UK</th>
              <th className="py-2 pr-4">US</th>
              <th className="py-2">CM</th>
            </tr>
          </thead>
          <tbody>
            {chart.rows.map((row, i) => (
              <tr key={i} className="border-b border-border/50">
                <td className="py-2 pr-4 text-fg">{row.eu}</td>
                <td className="py-2 pr-4 text-muted">{row.uk}</td>
                <td className="py-2 pr-4 text-muted">{row.us}</td>
                <td className="py-2 text-muted">{row.cm}</td>
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

export function SizeGuideModal() {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<OuterTab>(BRAND_ORDER[0]);
  const [bobTab, setBobTab] = useState<(typeof BOB_CHART_ORDER)[number]>("men");
  const prefersReducedMotion = useReducedMotionAware();

  const activeChart =
    tab === BOB_KEY ? BOB_SIZE_CHARTS[bobTab] : BRAND_SIZE_CHARTS[tab];

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
              onClick={() => setOpen(false)}
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
              className="fixed left-1/2 top-1/2 z-[151] w-[calc(100%-2rem)] max-w-2xl max-h-[85vh] -translate-x-1/2 -translate-y-1/2 overflow-y-auto bg-bg p-6 text-fg sm:p-8"
            >
              <div className="flex items-center justify-between">
                <h2 className="font-display text-xl uppercase tracking-tight">
                  Розмірна сітка
                </h2>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="Закрити"
                  className="text-muted hover:text-fg"
                >
                  <CloseIcon />
                </button>
              </div>

              <div className="mt-6 flex flex-wrap gap-2">
                {BRAND_ORDER.map((key) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setTab(key)}
                    className={`border px-3 py-1.5 text-sm ${
                      tab === key
                        ? "border-highlight text-highlight"
                        : "border-border text-muted hover:border-fg hover:text-fg"
                    }`}
                  >
                    {BRAND_SIZE_CHARTS[key].label}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => setTab(BOB_KEY)}
                  className={`border px-3 py-1.5 text-sm uppercase tracking-wide ${
                    tab === BOB_KEY
                      ? "border-highlight text-highlight"
                      : "border-border text-muted hover:border-fg hover:text-fg"
                  }`}
                >
                  BOB (інші бренди)
                </button>
              </div>

              {tab === BOB_KEY ? (
                <div className="mt-4 flex gap-2">
                  {BOB_CHART_ORDER.map((key) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setBobTab(key)}
                      className={`text-xs uppercase tracking-wide ${
                        bobTab === key
                          ? "text-highlight underline underline-offset-4"
                          : "text-muted hover:text-fg"
                      }`}
                    >
                      {BOB_SIZE_CHARTS[key].label}
                    </button>
                  ))}
                </div>
              ) : null}

              <div className="mt-6">
                <SizeTable chart={activeChart} />
              </div>

              {tab === BOB_KEY ? (
                <p className="mt-4 text-xs text-muted">
                  Загальна таблиця для брендів, яких немає у списку вище. Точна
                  посадка може незначно відрізнятись залежно від моделі.
                </p>
              ) : null}
            </motion.div>
          </>
        ) : null}
      </AnimatePresence>
    </>
  );
}
