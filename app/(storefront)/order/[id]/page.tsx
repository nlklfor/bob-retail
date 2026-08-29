import { notFound } from "next/navigation";
import Link from "next/link";
import "server-only";
import { createAdminClient } from "@/lib/supabase/server";
import type { OrderWithItems } from "@/lib/types";
import { OrderConfirmationHeader } from "@/components/order/OrderConfirmationHeader";
import { formatPrice } from "@/lib/format";

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
    <div className="mx-auto max-w-2xl px-6 py-16">
      <OrderConfirmationHeader
        orderNumber={order.id.slice(0, 8).toUpperCase()}
        customerEmail={order.customer_email}
      />

      <div className="mt-10 divide-y divide-border border-t border-border">
        {order.order_items.map((item) => (
          <div key={item.id} className="flex justify-between py-3 text-sm">
            <span>
              {item.product_name} {item.size ? `(${item.size})` : ""} ×{" "}
              {item.quantity}
            </span>
            <span>{formatPrice(item.line_total)} грн</span>
          </div>
        ))}
      </div>

      <div className="mt-6 space-y-1 text-sm">
        <div className="flex justify-between">
          <span className="text-muted">Сума</span>
          <span>{formatPrice(order.subtotal)} грн</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted">Доставка</span>
          <span>{formatPrice(order.shipping_cost)} грн</span>
        </div>
        <div className="mt-2 flex justify-between border-t border-border pt-2 text-lg font-semibold">
          <span className="uppercase tracking-wide">Разом</span>
          <span>{formatPrice(order.total)} грн</span>
        </div>
      </div>

      <div className="mt-8 text-sm text-muted">
        <p>
          {order.customer_name} · {order.customer_phone}
        </p>
        <p>
          Нова Пошта — {order.shipping_city}, {order.shipping_branch}
        </p>
      </div>

      <p className="mt-8 text-center text-sm text-muted">
        Питання щодо доставки чи оплати? Дивіться{" "}
        <Link href="/faq" className="text-highlight hover:underline">
          відповіді на часті питання
        </Link>
        .
      </p>

      <div className="mt-10 flex justify-center">
        <Link
          href="/catalog"
          className="border border-fg px-6 py-3 text-sm uppercase tracking-wide hover:bg-fg hover:text-bg"
        >
          Продовжити покупки
        </Link>
      </div>
    </div>
  );
}
