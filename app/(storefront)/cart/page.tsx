"use client";

import Link from "next/link";
import Image from "next/image";
import { useCartStore, useCartSubtotal } from "@/lib/cart-store";

export default function CartPage() {
  const items = useCartStore((state) => state.items);
  const setQuantity = useCartStore((state) => state.setQuantity);
  const removeItem = useCartStore((state) => state.removeItem);
  const subtotal = useCartSubtotal();

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-6xl px-6 py-12">
        <h1 className="font-display text-3xl uppercase tracking-tight">Bag</h1>
        <p className="mt-8 text-muted">Your bag is empty.</p>
        <Link href="/catalog" className="mt-4 inline-block text-accent">
          Continue shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <h1 className="font-display text-3xl uppercase tracking-tight">Bag</h1>

      <div className="mt-8 divide-y divide-border">
        {items.map((item) => (
          <div key={item.variantId} className="flex gap-4 py-6">
            <div className="relative h-24 w-20 flex-shrink-0 bg-surface">
              {item.image ? (
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-cover"
                />
              ) : null}
            </div>

            <div className="flex flex-1 flex-col justify-between">
              <div className="flex justify-between">
                <div>
                  <p className="uppercase tracking-wide text-sm">{item.name}</p>
                  {item.size ? (
                    <p className="text-muted text-sm">Size {item.size}</p>
                  ) : null}
                </div>
                <p className="text-sm">{item.price * item.quantity} UAH</p>
              </div>

              <div className="flex items-center gap-3">
                <label
                  className="text-sm text-muted"
                  htmlFor={`qty-${item.variantId}`}
                >
                  Qty
                </label>
                <input
                  id={`qty-${item.variantId}`}
                  type="number"
                  min={1}
                  value={item.quantity}
                  onChange={(e) =>
                    setQuantity(item.variantId, Number(e.target.value))
                  }
                  className="w-16 border border-border bg-transparent px-2 py-1 text-sm"
                />
                <button
                  type="button"
                  onClick={() => removeItem(item.variantId)}
                  className="text-sm text-muted hover:text-fg"
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 flex justify-between border-t border-border pt-6">
        <span className="uppercase tracking-wide text-sm">Subtotal</span>
        <span className="text-accent">{subtotal} UAH</span>
      </div>
      <p className="mt-1 text-sm text-muted">
        Shipping calculated at checkout.
      </p>

      <Link
        href="/checkout"
        className="mt-6 block w-full border border-fg py-3 text-center text-sm uppercase tracking-wide hover:bg-fg hover:text-bg"
      >
        Checkout
      </Link>
    </div>
  );
}
