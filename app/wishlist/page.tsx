"use client";

import Link from "next/link";
import Image from "next/image";
import { useWishlistStore } from "@/lib/wishlist-store";

export default function WishlistPage() {
  const items = useWishlistStore((state) => state.items);
  const toggle = useWishlistStore((state) => state.toggle);

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <h1 className="font-display text-3xl uppercase tracking-tight">
        Wishlist
      </h1>

      {items.length === 0 ? (
        <p className="mt-8 text-muted">Nothing saved yet.</p>
      ) : (
        <div className="mt-8 grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
          {items.map((item) => (
            <div key={item.productId}>
              <Link href={`/products/${item.slug}`} className="block">
                <div className="relative aspect-[3/4] bg-surface overflow-hidden">
                  {item.image ? (
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  ) : null}
                </div>
                <div className="mt-3 flex items-baseline justify-between">
                  <h3 className="font-display text-sm uppercase tracking-wide">
                    {item.name}
                  </h3>
                  <span className="text-accent text-sm">{item.price} UAH</span>
                </div>
              </Link>
              <button
                type="button"
                onClick={() => toggle(item)}
                className="mt-2 text-sm text-muted hover:text-fg"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
