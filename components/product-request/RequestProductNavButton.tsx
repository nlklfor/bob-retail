"use client";

import { useProductRequestStore } from "@/lib/product-request-store";

// Client's own request: this needs to visually stand out from the plain
// nav links, not blend in as a fifth identical text link — the highlight
// color plus a border does that without introducing a whole new visual
// language.
export function RequestProductNavButton() {
  const open = useProductRequestStore((state) => state.open);

  return (
    <button
      type="button"
      onClick={() => open()}
      className="border border-highlight px-3 py-1.5 text-highlight hover:bg-highlight hover:text-bg"
    >
      Під замовлення
    </button>
  );
}
