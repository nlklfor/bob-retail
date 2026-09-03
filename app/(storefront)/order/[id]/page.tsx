import { notFound } from "next/navigation";
import Link from "next/link";
import "server-only";
import type { Metadata } from "next";
import { createAdminClient } from "@/lib/supabase/server";
import type { OrderWithItems } from "@/lib/types";
import { OrderConfirmationHeader } from "@/components/order/OrderConfirmationHeader";
import { ClearCartOnMount } from "@/components/order/ClearCartOnMount";
import { PendingPaymentAutoRefresh } from "@/components/order/PendingPaymentAutoRefresh";
import { formatPrice } from "@/lib/format";
import { getInvoiceStatus } from "@/lib/monobank/client";
import { applyInvoiceStatus } from "@/lib/monobank/apply-status";

// Per-order confirmation page — nothing here should turn up in search
// results, so it's excluded from indexing rather than given a real
// description.
export const metadata: Metadata = {
  title: "Замовлення",
  robots: { index: false, follow: false },
};

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

async function getInvoiceIdForOrder(orderId: string): Promise<string | null> {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("payments")
    .select("external_reference")
    .eq("order_id", orderId)
    .maybeSingle();

  return data?.external_reference ?? null;
}

export default async function OrderConfirmationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  let order = await getOrder(id);

  if (!order) {
    notFound();
  }

  // The webhook is the real-time path, but it can simply not have arrived
  // yet by the time Monobank redirects the customer's browser back here —
  // check directly rather than leaving them staring at "processing" for no
  // reason. Safe to call on every load: applyInvoiceStatus() only acts on
  // an order still sitting in pending_payment.
  if (order.status === "pending_payment") {
    const invoiceId = await getInvoiceIdForOrder(order.id);
    if (invoiceId) {
      try {
        const invoiceStatus = await getInvoiceStatus(invoiceId);
        await applyInvoiceStatus(order.id, invoiceId, invoiceStatus.status);
        order = (await getOrder(id)) ?? order;
      } catch (err) {
        console.error("Failed to reconcile Monobank invoice status:", err);
      }
    }
  }

  if (order.status === "pending_payment") {
    return (
      <div className="mx-auto max-w-2xl px-6 py-16 text-center">
        <PendingPaymentAutoRefresh />
        <h1 className="font-display text-2xl uppercase tracking-tight">
          Очікуємо підтвердження оплати
        </h1>
        <p className="mt-2 text-muted">
          Замовлення №{order.id.slice(0, 8).toUpperCase()}
        </p>
        <p className="mt-6 text-sm text-muted">
          Це займає лише мить — сторінка оновиться автоматично, щойно оплату
          буде підтверджено.
        </p>
      </div>
    );
  }

  if (order.status === "payment_failed" || order.status === "cancelled") {
    return (
      <div className="mx-auto max-w-2xl px-6 py-16 text-center">
        <ClearCartOnMount enabled={false} />
        <h1 className="font-display text-2xl uppercase tracking-tight">
          Оплату не підтверджено
        </h1>
        <p className="mt-2 text-muted">
          Замовлення №{order.id.slice(0, 8).toUpperCase()}
        </p>
        <p className="mt-6 text-sm text-muted">
          Оплата не пройшла або була скасована. Товари залишились у кошику —
          можете спробувати ще раз.
        </p>
        <div className="mt-8 flex justify-center">
          <Link
            href="/checkout"
            className="border border-fg px-6 py-3 text-sm uppercase tracking-wide hover:bg-fg hover:text-bg"
          >
            Спробувати ще раз
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-6 py-16">
      <ClearCartOnMount enabled />
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
