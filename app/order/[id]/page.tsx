import { notFound } from "next/navigation";
import "server-only";
import { createAdminClient } from "@/lib/supabase/server";
import type { OrderWithItems } from "@/lib/types";

async function getOrder(id: string): Promise<OrderWithItems | null> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("orders")
    .select("*, order_items(*)")
    .eq("id", id)
    .maybeSingle();

  if (error || !data) return null;
  return data as unknown as OrderWithItems;
}

export default async function OrderConfirmationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const order = await getOrder(id);

  if (!order) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-2xl px-6 py-12">
      <h1 className="font-display text-3xl uppercase tracking-tight">
        {order.status === "paid" ? "Order confirmed" : "Order received"}
      </h1>
      <p className="mt-2 text-muted">Order #{order.id.slice(0, 8)}</p>

      <div className="mt-8 divide-y divide-border">
        {order.order_items.map((item) => (
          <div key={item.id} className="flex justify-between py-3 text-sm">
            <span>
              {item.product_name} {item.size ? `(${item.size})` : ""} ×{" "}
              {item.quantity}
            </span>
            <span>{item.line_total} UAH</span>
          </div>
        ))}
      </div>

      <div className="mt-6 space-y-1 text-sm">
        <div className="flex justify-between">
          <span className="text-muted">Subtotal</span>
          <span>{order.subtotal} UAH</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted">Shipping</span>
          <span>{order.shipping_cost} UAH</span>
        </div>
        <div className="flex justify-between border-t border-border pt-2 mt-2 text-accent">
          <span className="uppercase tracking-wide">Total</span>
          <span>{order.total} UAH</span>
        </div>
      </div>

      <div className="mt-8 text-sm text-muted">
        <p>
          {order.customer_name} · {order.customer_phone}
        </p>
        <p>
          Nova Poshta — {order.shipping_city}, {order.shipping_branch}
        </p>
      </div>
    </div>
  );
}
