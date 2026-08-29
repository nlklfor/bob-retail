"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

export const SORT_OPTIONS = [
  { value: "newest", label: "Спочатку нові" },
  { value: "price-asc", label: "Ціна: за зростанням" },
  { value: "price-desc", label: "Ціна: за спаданням" },
  { value: "name", label: "Назва (А-Я)" },
] as const;

export function SortSelect() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentSort = searchParams.get("sort") ?? "newest";

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const params = new URLSearchParams(searchParams.toString());
    if (e.target.value === "newest") {
      params.delete("sort");
    } else {
      params.set("sort", e.target.value);
    }
    const query = params.toString();
    router.push(`${pathname}${query ? `?${query}` : ""}`);
  }

  return (
    <select
      value={currentSort}
      onChange={handleChange}
      aria-label="Сортування"
      className="border border-border bg-transparent px-3 py-2 text-sm uppercase tracking-wide hover:border-fg focus:border-fg focus:outline-none"
    >
      {SORT_OPTIONS.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}
