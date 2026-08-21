import { notFound } from "next/navigation";
import Image from "next/image";
import { getProductBySlug } from "@/lib/products";
import { AddToCartForm } from "@/components/product/AddToCartForm";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-12 grid gap-10 sm:grid-cols-2">
      <div className="relative aspect-[3/4] bg-surface">
        {product.images[0] ? (
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            className="object-cover"
          />
        ) : null}
      </div>

      <div>
        <h1 className="font-display text-3xl uppercase tracking-tight">
          {product.name}
        </h1>
        <p className="text-accent text-lg mt-1">{product.price} грн</p>

        {product.description ? (
          <p className="text-muted mt-6 leading-relaxed">
            {product.description}
          </p>
        ) : null}

        <div className="mt-8">
          <AddToCartForm product={product} />
        </div>
      </div>
    </div>
  );
}
