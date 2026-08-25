import Link from "next/link";
import { getActiveProducts, getCategories } from "@/lib/products";
import { ProductCard } from "@/components/product/ProductCard";

export default async function CatalogPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; q?: string }>;
}) {
  const { category, q } = await searchParams;
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

      <div className="mt-4 flex gap-4 text-sm uppercase tracking-wide">
        <Link
          href="/catalog"
          className={!category ? "text-highlight" : "text-muted hover:text-fg"}
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

      {filtered.length === 0 ? (
        <p className="mt-8 text-muted">
          {query
            ? "За вашим запитом нічого не знайдено."
            : "У цій категорії поки немає товарів."}
        </p>
      ) : (
        <div className="mt-8 grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
