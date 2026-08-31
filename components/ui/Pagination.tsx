import Link from "next/link";
import { ChevronLeftIcon, ChevronRightIcon } from "@/components/layout/icons";

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  buildHref: (page: number) => string;
};

// Windowed page list: always shows first/last, a run around the current
// page, and "…" for anything skipped — keeps it short even with dozens of
// pages instead of rendering every number.
function getPageWindow(current: number, total: number): (number | "…")[] {
  const middle: number[] = [];
  for (
    let p = Math.max(2, current - 1);
    p <= Math.min(total - 1, current + 1);
    p++
  ) {
    middle.push(p);
  }

  const pages: (number | "…")[] = [1];
  if (middle[0] > 2) pages.push("…");
  pages.push(...middle);
  if (middle[middle.length - 1] < total - 1) pages.push("…");
  if (total > 1) pages.push(total);
  return pages;
}

export function Pagination({
  currentPage,
  totalPages,
  buildHref,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages = getPageWindow(currentPage, totalPages);

  return (
    <nav
      aria-label="Сторінки"
      className="mt-10 flex items-center justify-center gap-2 text-sm"
    >
      {currentPage > 1 ? (
        <Link
          href={buildHref(currentPage - 1)}
          aria-label="Попередня сторінка"
          className="flex h-9 w-9 items-center justify-center border border-border hover:border-fg"
        >
          <ChevronLeftIcon />
        </Link>
      ) : (
        <span
          aria-hidden="true"
          className="flex h-9 w-9 items-center justify-center border border-border text-muted opacity-30"
        >
          <ChevronLeftIcon />
        </span>
      )}

      {pages.map((p, i) =>
        p === "…" ? (
          <span
            key={`ellipsis-${i}`}
            aria-hidden="true"
            className="px-1 text-muted"
          >
            …
          </span>
        ) : (
          <Link
            key={p}
            href={buildHref(p)}
            aria-current={p === currentPage ? "page" : undefined}
            className={
              p === currentPage
                ? "flex h-9 min-w-9 items-center justify-center border border-fg bg-fg px-2 text-bg"
                : "flex h-9 min-w-9 items-center justify-center border border-border px-2 hover:border-fg"
            }
          >
            {p}
          </Link>
        ),
      )}

      {currentPage < totalPages ? (
        <Link
          href={buildHref(currentPage + 1)}
          aria-label="Наступна сторінка"
          className="flex h-9 w-9 items-center justify-center border border-border hover:border-fg"
        >
          <ChevronRightIcon />
        </Link>
      ) : (
        <span
          aria-hidden="true"
          className="flex h-9 w-9 items-center justify-center border border-border text-muted opacity-30"
        >
          <ChevronRightIcon />
        </span>
      )}
    </nav>
  );
}
