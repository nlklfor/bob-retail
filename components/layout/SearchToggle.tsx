"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { SearchIcon, CloseIcon } from "./icons";
import { searchProducts, type SearchResult } from "@/lib/actions/search";

const DEBOUNCE_MS = 250;

export function SearchToggle() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  // Guards against an older, slower request overwriting a newer one's
  // results if responses arrive out of order.
  const latestRequest = useRef(0);

  useEffect(() => {
    const trimmed = query.trim();
    if (!trimmed) {
      const handle = window.setTimeout(() => {
        setResults([]);
        setLoading(false);
      }, 0);
      return () => window.clearTimeout(handle);
    }

    const requestId = ++latestRequest.current;
    const loadingHandle = window.setTimeout(() => setLoading(true), 0);
    const timeout = window.setTimeout(async () => {
      const data = await searchProducts(trimmed);
      if (latestRequest.current === requestId) {
        setResults(data);
        setLoading(false);
      }
    }, DEBOUNCE_MS);

    return () => {
      window.clearTimeout(loadingHandle);
      window.clearTimeout(timeout);
    };
  }, [query]);

  function close() {
    setOpen(false);
    setQuery("");
    setResults([]);
  }

  const trimmedQuery = query.trim();

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Закрити пошук" : "Пошук"}
        aria-expanded={open}
        className="flex h-9 w-9 items-center justify-center hover:text-highlight"
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
            className="absolute right-0 top-full z-50 mt-2 w-80 border border-border bg-bg p-3 shadow-lg"
          >
            <form action="/catalog" method="get">
              <input
                type="search"
                name="q"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Пошук за назвою"
                autoFocus
                autoComplete="off"
                className="w-full border border-border bg-transparent px-3 py-2 text-sm text-fg placeholder:text-muted"
              />
            </form>

            {trimmedQuery ? (
              <div className="mt-2 max-h-96 overflow-y-auto">
                {loading ? (
                  <p className="px-1 py-3 text-sm text-muted">Пошук…</p>
                ) : results.length === 0 ? (
                  <p className="px-1 py-3 text-sm text-muted">
                    Нічого не знайдено.
                  </p>
                ) : (
                  <ul className="flex flex-col divide-y divide-border">
                    {results.map((product) => (
                      <li key={product.id}>
                        <Link
                          href={`/products/${product.slug}`}
                          onClick={close}
                          className="flex items-center gap-3 py-2 hover:text-highlight"
                        >
                          <div className="relative h-12 w-12 shrink-0 overflow-hidden bg-surface">
                            {product.image ? (
                              <Image
                                src={product.image}
                                alt={product.name}
                                fill
                                sizes="48px"
                                className="object-cover"
                              />
                            ) : null}
                          </div>
                          <span className="flex-1 truncate text-sm">
                            {product.name}
                          </span>
                          <span className="shrink-0 text-xs text-muted">
                            {product.price} грн
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
                <Link
                  href={`/catalog?q=${encodeURIComponent(trimmedQuery)}`}
                  onClick={close}
                  className="mt-1 block border-t border-border pt-2 text-xs uppercase tracking-wide text-highlight"
                >
                  Усі результати →
                </Link>
              </div>
            ) : null}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
