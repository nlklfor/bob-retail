import { getActiveProducts } from "@/lib/products";
import { ProductCard } from "@/components/product/ProductCard";
import { IntroSplash } from "@/components/home/IntroSplash";

export default async function Home() {
  const products = await getActiveProducts();

  return (
    <>
      <IntroSplash />

      {/* Widescreen hero band, full-bleed under the header — drop the real
          logo/brand image in here (e.g. an <Image fill className="object-cover" />)
          once the asset exists. Placeholder keeps the layout/proportions real
          in the meantime rather than leaving a gap. */}
      <section className="relative aspect-[21/9] w-full bg-surface">
        <div className="absolute inset-0 flex items-center justify-center border-y border-border">
          <span className="text-xs uppercase tracking-[0.2em] text-muted">
            Місце для банера
          </span>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-6 py-12">
        <h1 className="font-display text-3xl uppercase tracking-tight">
          Новинки
        </h1>

        {products.length === 0 ? (
          <p className="mt-8 text-muted">Поки немає товарів.</p>
        ) : (
          <div className="mt-8 grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
