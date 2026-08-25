import Link from "next/link";
import { Carousel } from "./Carousel";
import { ProductCard } from "@/components/product/ProductCard";
import type { ProductWithVariants } from "@/lib/types";

export function NewArrivalsSection({
  products,
  heading = "Новинки",
}: {
  products: ProductWithVariants[];
  heading?: string;
}) {
  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <h2 className="text-center font-display text-3xl uppercase tracking-tight">
        {heading}
      </h2>

      {products.length === 0 ? (
        <p className="mt-8 text-center text-muted">Поки немає товарів.</p>
      ) : (
        <div className="mt-8">
          <Carousel>
            {products.map((product) => (
              <div
                key={product.id}
                className="min-w-0 flex-[0_0_65%] sm:flex-[0_0_36%] lg:flex-[0_0_23%]"
              >
                <ProductCard product={product} />
              </div>
            ))}
          </Carousel>
        </div>
      )}

      <div className="mt-10 flex justify-center">
        <Link
          href="/catalog"
          className="border border-fg px-6 py-3 text-sm uppercase tracking-wide hover:bg-fg hover:text-bg"
        >
          Переглянути всі товари
        </Link>
      </div>
    </div>
  );
}
