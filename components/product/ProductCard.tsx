import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/lib/types";

export function ProductCard({ product }: { product: Product }) {
  const image = product.images[0];

  return (
    <Link href={`/products/${product.slug}`} className="group block">
      <div className="relative aspect-[3/4] bg-surface overflow-hidden">
        {image ? (
          <Image
            src={image}
            alt={product.name}
            fill
            className="object-cover transition-opacity group-hover:opacity-80"
          />
        ) : null}
      </div>
      <div className="mt-3 flex items-baseline justify-between">
        <h3 className="font-display text-sm uppercase tracking-wide">
          {product.name}
        </h3>
        <span className="text-accent text-sm">{product.price} UAH</span>
      </div>
    </Link>
  );
}
