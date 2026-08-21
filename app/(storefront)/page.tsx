import Image from "next/image";
import { getActiveProducts } from "@/lib/products";
import { ProductCard } from "@/components/product/ProductCard";
import { IntroSplash } from "@/components/home/IntroSplash";
import { ScrollIndicator } from "@/components/home/ScrollIndicator";

export default async function Home() {
  const products = await getActiveProducts();

  return (
    <>
      <IntroSplash />

      {/* Full-screen hero, full-bleed under the header — fills the rest of
          the viewport below the sticky header exactly, so the background
          gets the whole screen rather than a cropped strip. 96px here must
          match Header.tsx's HEADER_HEIGHT (h-24) — the header is a fixed
          height now specifically so this number stays correct across
          breakpoints instead of needing to be re-measured. */}
      <section className="relative h-[calc(100vh-96px)] w-full bg-surface">
        <Image
          src="/images/bob-bg.png"
          alt=""
          fill
          priority
          className="object-cover"
        />
        {/* Legibility gradient so the scroll indicator stays readable
            regardless of what's in the image at the bottom edge. */}
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/60 to-transparent" />
        <ScrollIndicator targetId="catalog-preview" />
      </section>

      <div id="catalog-preview" className="mx-auto max-w-6xl px-6 py-12">
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
