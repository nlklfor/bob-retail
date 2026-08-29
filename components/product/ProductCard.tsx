"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCartStore } from "@/lib/cart-store";
import { useToastStore } from "@/lib/toast-store";
import { BagIcon } from "@/components/layout/icons";
import { formatPrice } from "@/lib/format";
import type { ProductWithVariants } from "@/lib/types";

export function ProductCard({ product }: { product: ProductWithVariants }) {
  const primaryImage = product.images[0];
  const secondaryImage = product.images[1];

  const variants = product.product_variants.filter((v) => v.is_active);
  const hasSizes = variants.some((v) => v.size !== null);

  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(
    !hasSizes && variants.length === 1 ? variants[0].id : null,
  );
  const [added, setAdded] = useState(false);
  const addItem = useCartStore((state) => state.addItem);
  const showToast = useToastStore((state) => state.show);

  const selectedVariant =
    variants.find((v) => v.id === selectedVariantId) ?? null;

  function handleAddToCart(e: React.MouseEvent) {
    e.preventDefault();
    if (!selectedVariant || selectedVariant.stock_quantity < 1) return;

    addItem({
      variantId: selectedVariant.id,
      productId: product.id,
      slug: product.slug,
      name: product.name,
      price: product.price,
      image: product.images[0] ?? null,
      size: selectedVariant.size,
    });
    showToast(`${product.name} додано в кошик`);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  return (
    <div className="group">
      <div className="relative aspect-[3/4] overflow-hidden bg-surface">
        <Link
          href={`/products/${product.slug}`}
          className="absolute inset-0"
          aria-label={product.name}
        >
          {primaryImage ? (
            <Image
              src={primaryImage}
              alt={product.name}
              fill
              sizes="(min-width: 1024px) 25vw, (min-width: 640px) 36vw, 65vw"
              className={`object-cover transition-opacity duration-300 ${
                secondaryImage ? "group-hover:opacity-0" : ""
              }`}
            />
          ) : null}
          {secondaryImage ? (
            <Image
              src={secondaryImage}
              alt=""
              fill
              sizes="(min-width: 1024px) 25vw, (min-width: 640px) 36vw, 65vw"
              className="absolute inset-0 object-cover opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            />
          ) : null}
        </Link>

        {variants.length > 0 ? (
          <div className="absolute inset-x-0 bottom-0 z-10 translate-y-full bg-bg/95 p-2 opacity-0 transition-all duration-200 group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:translate-y-0 group-focus-within:opacity-100">
            {hasSizes ? (
              <div className="flex flex-wrap gap-1">
                {variants.map((variant) => {
                  const outOfStock = variant.stock_quantity < 1;
                  return (
                    <button
                      key={variant.id}
                      type="button"
                      disabled={outOfStock}
                      onClick={(e) => {
                        e.preventDefault();
                        setSelectedVariantId(variant.id);
                      }}
                      className={`border px-2 py-1 text-xs ${
                        selectedVariantId === variant.id
                          ? "border-highlight text-highlight"
                          : "border-border"
                      } ${
                        outOfStock
                          ? "cursor-not-allowed line-through opacity-30"
                          : "hover:border-fg"
                      }`}
                    >
                      {variant.size}
                    </button>
                  );
                })}
              </div>
            ) : null}

            <button
              type="button"
              onClick={handleAddToCart}
              disabled={!selectedVariant || selectedVariant.stock_quantity < 1}
              className="mt-2 flex w-full items-center justify-center gap-2 bg-fg py-2 text-xs uppercase tracking-wide text-bg hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-30"
            >
              {added ? "Додано" : "Додати в кошик"}
              {!added ? <BagIcon /> : null}
            </button>
          </div>
        ) : null}
      </div>

      <Link
        href={`/products/${product.slug}`}
        className="mt-3 flex items-baseline justify-between"
      >
        <h3 className="font-display text-sm uppercase tracking-wide">
          {product.name}
        </h3>
        <span className="text-accent text-sm">
          {formatPrice(product.price)} грн
        </span>
      </Link>
    </div>
  );
}
