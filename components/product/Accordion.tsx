"use client";

import { useState, type ReactNode } from "react";

type AccordionItem = {
  title: string;
  content: ReactNode;
};

export function Accordion({ items }: { items: AccordionItem[] }) {
  // All sections start open, matching the reference — collapsible, not
  // collapsed-by-default.
  const [openTitles, setOpenTitles] = useState<Set<string>>(
    () => new Set(items.map((item) => item.title)),
  );

  function toggle(title: string) {
    setOpenTitles((prev) => {
      const next = new Set(prev);
      if (next.has(title)) {
        next.delete(title);
      } else {
        next.add(title);
      }
      return next;
    });
  }

  return (
    <div className="mt-10 divide-y divide-border border-t border-border">
      {items.map((item) => {
        const open = openTitles.has(item.title);
        return (
          <div key={item.title}>
            <button
              type="button"
              onClick={() => toggle(item.title)}
              aria-expanded={open}
              className="flex w-full items-center justify-between py-4 text-left text-sm uppercase tracking-wide"
            >
              {item.title}
              <span className="text-lg leading-none text-muted">
                {open ? "−" : "+"}
              </span>
            </button>
            {open ? (
              <div className="pb-4 text-sm leading-relaxed text-muted">
                {item.content}
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
