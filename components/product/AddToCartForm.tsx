"use client";

import { useState } from "react";
import { useCartStore } from "@/lib/cart-store";
import { useToastStore } from "@/lib/toast-store";
import type { ProductWithVariants } from "@/lib/types";

export function AddToCartForm({ product }: { product: ProductWithVariants }) {
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

  function handleAddToCart() {
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

  if (variants.length === 0) {
    return <p className="text-muted">Немає в наявності</p>;
  }

  return (
    <div className="space-y-4">
      {hasSizes && (
        <div>
          <p className="text-sm uppercase tracking-wide text-muted mb-2">
            Розмір
          </p>
          <div className="flex flex-wrap gap-2">
            {variants.map((variant) => {
              const outOfStock = variant.stock_quantity < 1;
              return (
                <button
                  key={variant.id}
                  type="button"
                  disabled={outOfStock}
                  onClick={() => setSelectedVariantId(variant.id)}
                  className={`border px-3 py-2 text-sm ${
                    selectedVariantId === variant.id
                      ? "border-highlight text-highlight"
                      : "border-border"
                  } ${outOfStock ? "opacity-30 cursor-not-allowed line-through" : "hover:border-fg"}`}
                >
                  {variant.size}
                </button>
              );
            })}
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={handleAddToCart}
        disabled={!selectedVariant || selectedVariant.stock_quantity < 1}
        className="flex w-full items-center justify-center gap-2 bg-fg py-3 text-sm uppercase tracking-wide text-bg hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-30"
      >
        {added ? "Додано" : "Додати в кошик"}
        {!added ? <span aria-hidden="true">→</span> : null}
      </button>
    </div>
  );
}
