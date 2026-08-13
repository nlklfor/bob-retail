"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCartStore, useCartSubtotal } from "@/lib/cart-store";
import { placeOrderAction } from "@/lib/actions/checkout";

export default function CheckoutPage() {
  const items = useCartStore((state) => state.items);
  const clearCart = useCartStore((state) => state.clear);
  const subtotal = useCartSubtotal();
  const router = useRouter();

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const result = await placeOrderAction({
      customerName: String(formData.get("customerName") ?? ""),
      customerPhone: String(formData.get("customerPhone") ?? ""),
      customerEmail: String(formData.get("customerEmail") ?? ""),
      shippingCity: String(formData.get("shippingCity") ?? ""),
      shippingBranch: String(formData.get("shippingBranch") ?? ""),
      items: items.map((item) => ({
        variantId: item.variantId,
        quantity: item.quantity,
      })),
    });

    if (!result.success) {
      setError(result.error);
      setSubmitting(false);
      return;
    }

    clearCart();
    router.push(`/order/${result.orderId}`);
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-6xl px-6 py-12">
        <h1 className="font-display text-3xl uppercase tracking-tight">
          Checkout
        </h1>
        <p className="mt-8 text-muted">Your bag is empty.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-12 grid gap-10 sm:grid-cols-2">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <h2 className="text-sm uppercase tracking-wide text-muted mb-3">
            Contact
          </h2>
          <div className="space-y-3">
            <input
              name="customerName"
              placeholder="Full name"
              required
              className="w-full border border-border bg-transparent px-3 py-2"
            />
            <input
              name="customerPhone"
              placeholder="Phone"
              required
              className="w-full border border-border bg-transparent px-3 py-2"
            />
            <input
              name="customerEmail"
              type="email"
              placeholder="Email (optional)"
              className="w-full border border-border bg-transparent px-3 py-2"
            />
          </div>
        </div>

        <div>
          <h2 className="text-sm uppercase tracking-wide text-muted mb-3">
            Nova Poshta delivery
          </h2>
          <div className="space-y-3">
            <input
              name="shippingCity"
              placeholder="City"
              required
              className="w-full border border-border bg-transparent px-3 py-2"
            />
            <input
              name="shippingBranch"
              placeholder="Branch number / address"
              required
              className="w-full border border-border bg-transparent px-3 py-2"
            />
          </div>
          <p className="mt-2 text-sm text-muted">
            Branch lookup via the Nova Poshta API isn&apos;t wired up yet —
            enter manually for now.
          </p>
        </div>

        {error ? <p className="text-danger text-sm">{error}</p> : null}

        <button
          type="submit"
          disabled={submitting}
          className="w-full border border-fg py-3 text-sm uppercase tracking-wide hover:bg-fg hover:text-bg disabled:opacity-30"
        >
          {submitting ? "Placing order..." : "Place order"}
        </button>
      </form>

      <div>
        <h2 className="text-sm uppercase tracking-wide text-muted mb-3">
          Order summary
        </h2>
        <div className="divide-y divide-border">
          {items.map((item) => (
            <div
              key={item.variantId}
              className="flex justify-between py-3 text-sm"
            >
              <span>
                {item.name} {item.size ? `(${item.size})` : ""} ×{" "}
                {item.quantity}
              </span>
              <span>{item.price * item.quantity} UAH</span>
            </div>
          ))}
        </div>
        <div className="flex justify-between border-t border-border pt-4 mt-2">
          <span className="uppercase tracking-wide text-sm">Subtotal</span>
          <span>{subtotal} UAH</span>
        </div>
        <p className="mt-1 text-sm text-muted">
          Shipping cost is a flat placeholder for now — real Nova Poshta pricing
          comes later.
        </p>
      </div>
    </div>
  );
}
