import Link from "next/link";
import type { Metadata } from "next";
import { getActiveProducts, getCategories } from "@/lib/products";
import { ProductCard } from "@/components/product/ProductCard";
import { SortSelect } from "@/components/catalog/SortSelect";
import { Pagination } from "@/components/ui/Pagination";

const PAGE_SIZE = 12;

type CatalogSearchParams = Promise<{
  category?: string;
  q?: string;
  sort?: string;
  page?: string;
}>;

export async function generateMetadata({
  searchParams,
}: {
  searchParams: CatalogSearchParams;
}): Promise<Metadata> {
  const { category, q } = await searchParams;

  if (q?.trim()) {
    return { title: `Пошук «${q.trim()}»` };
  }

  if (category) {
    const categories = await getCategories();
    const match = categories.find((c) => c.slug === category);
    if (match) {
      return {
        title: match.name,
        description: `${match.name} — каталог BOB Retail.`,
      };
    }
  }

  return {
    title: "Каталог",
    description: "Каталог товарів BOB Retail.",
  };
}

export default async function CatalogPage({
  searchParams,
}: {
  searchParams: CatalogSearchParams;
}) {
  const { category, q, sort, page } = await searchParams;
  const [products, categories] = await Promise.all([
    getActiveProducts(),
    getCategories(),
  ]);

  const activeCategory = category
    ? categories.find((c) => c.slug === category)
    : null;
  const query = q?.trim().toLocaleLowerCase("uk") ?? "";

  const filtered = products
    .filter((p) => !activeCategory || p.category_id === activeCategory.id)
    .filter((p) => {
      if (!query) return true;
      const nameMatch = p.name.toLocaleLowerCase("uk").includes(query);
      const skuMatch = p.sku?.toLocaleLowerCase("uk").includes(query) ?? false;
      return nameMatch || skuMatch;
    });

  // getActiveProducts() already orders by created_at desc, so "newest"
  // (the default) needs no extra sort — only the other options do.
  const sorted = [...filtered];
  if (sort === "price-asc") {
    sorted.sort((a, b) => a.price - b.price);
  } else if (sort === "price-desc") {
    sorted.sort((a, b) => b.price - a.price);
  } else if (sort === "name") {
    sorted.sort((a, b) => a.name.localeCompare(b.name, "uk"));
  }

  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const requestedPage = Number(page) || 1;
  const currentPage = Math.min(Math.max(1, requestedPage), totalPages);
  const paged = sorted.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  function buildHref(targetPage: number) {
    const params = new URLSearchParams();
    if (category) params.set("category", category);
    if (q) params.set("q", q);
    if (sort) params.set("sort", sort);
    if (targetPage > 1) params.set("page", String(targetPage));
    const query = params.toString();
    return `/catalog${query ? `?${query}` : ""}`;
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <h1 className="font-display text-3xl uppercase tracking-tight">
        Каталог
      </h1>

      {query ? (
        <p className="mt-2 text-sm text-muted">
          Результати пошуку за запитом «{q?.trim()}»
        </p>
      ) : null}

      <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap gap-4 text-sm uppercase tracking-wide">
          <Link
            href="/catalog"
            className={
              !category ? "text-highlight" : "text-muted hover:text-fg"
            }
          >
            Усі
          </Link>
          {categories.map((c) => (
            <Link
              key={c.id}
              href={`/catalog?category=${c.slug}`}
              className={
                category === c.slug
                  ? "text-highlight"
                  : "text-muted hover:text-fg"
              }
            >
              {c.name}
            </Link>
          ))}
        </div>

        <SortSelect />
      </div>

      {sorted.length === 0 ? (
        <p className="mt-8 text-muted">
          {query
            ? "За вашим запитом нічого не знайдено."
            : "У цій категорії поки немає товарів."}
        </p>
      ) : (
        <>
          <div className="mt-8 grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
            {paged.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            buildHref={buildHref}
          />
        </>
      )}
    </div>
  );
}
