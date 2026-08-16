import { notFound } from "next/navigation";
import { requireStaffSession } from "@/lib/admin/dal";
import { getOrderForAdmin } from "@/lib/admin/orders";
import { OrderStatusSelect } from "@/components/admin/OrderStatusSelect";

export default async function AdminOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireStaffSession();
  const { id } = await params;
  const order = await getOrderForAdmin(id);

  if (!order) {
    notFound();
  }

  return (
    <div className="max-w-2xl">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl uppercase tracking-tight">
          Замовлення №{order.id.slice(0, 8)}
        </h1>
        <OrderStatusSelect orderId={order.id} status={order.status} />
      </div>

      <div className="mt-6 text-sm">
        <p>{order.customer_name}</p>
        <p className="text-muted">
          {order.customer_phone}{" "}
          {order.customer_email ? `· ${order.customer_email}` : ""}
        </p>
        <p className="text-muted">
          Нова Пошта — {order.shipping_city}, {order.shipping_branch}
        </p>
      </div>

      <div className="mt-6 divide-y divide-border">
        {order.order_items.map((item) => (
          <div key={item.id} className="flex justify-between py-3 text-sm">
            <span>
              {item.product_name} {item.size ? `(${item.size})` : ""} ×{" "}
              {item.quantity}
            </span>
            <span>{item.line_total} грн</span>
          </div>
        ))}
      </div>

      <div className="mt-4 space-y-1 text-sm">
        <div className="flex justify-between">
          <span className="text-muted">Сума</span>
          <span>{order.subtotal} грн</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted">Доставка</span>
          <span>{order.shipping_cost} грн</span>
        </div>
        <div className="flex justify-between border-t border-border pt-2 mt-2 text-accent">
          <span className="uppercase tracking-wide">Разом</span>
          <span>{order.total} грн</span>
        </div>
      </div>
    </div>
  );
}
