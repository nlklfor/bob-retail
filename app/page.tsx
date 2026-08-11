import { getActiveProducts } from "@/lib/products";
import { ProductCard } from "@/components/product/ProductCard";

export default async function Home() {
  const products = await getActiveProducts();

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <h1 className="font-display text-4xl uppercase tracking-tight">
        BOB Retail
      </h1>

      {products.length === 0 ? (
        <p className="mt-8 text-muted">No products yet.</p>
      ) : (
        <div className="mt-8 grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
