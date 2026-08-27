"use client";

import { useEffect, useState } from "react";

type Question = { q: string; a: string };

// scroll-mt-28 offsets the sticky header (h-24 = 96px) so a #hash link from
// the footer doesn't land partway under it.
export function FaqSection({
  id,
  title,
  questions,
}: {
  id: string;
  title: string;
  questions: Question[];
}) {
  const [openIndexes, setOpenIndexes] = useState<Set<number>>(new Set());

  useEffect(() => {
    if (window.location.hash !== `#${id}`) return;
    // Deferred, not called synchronously in the effect body — same rule as
    // everywhere else this pattern shows up in this codebase.
    const handle = window.setTimeout(() => {
      setOpenIndexes(new Set(questions.map((_, i) => i)));
    }, 0);
    return () => window.clearTimeout(handle);
    // Only re-run if the section id itself changes — questions is a fresh
    // array literal every render and would otherwise re-trigger this.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  function toggle(index: number) {
    setOpenIndexes((prev) => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  }

  return (
    <section id={id} className="scroll-mt-28">
      <h2 className="font-display text-xl uppercase tracking-tight">{title}</h2>
      <div className="mt-4 divide-y divide-border border-t border-border">
        {questions.map((item, index) => {
          const open = openIndexes.has(index);
          return (
            <div key={item.q}>
              <button
                type="button"
                onClick={() => toggle(index)}
                aria-expanded={open}
                className="flex w-full items-center justify-between gap-4 py-4 text-left text-sm"
              >
                {item.q}
                <span className="shrink-0 text-lg leading-none text-muted">
                  {open ? "−" : "+"}
                </span>
              </button>
              {open ? (
                <p className="pb-4 text-sm leading-relaxed text-muted">
                  {item.a}
                </p>
              ) : null}
            </div>
          );
        })}
      </div>
    </section>
  );
}
