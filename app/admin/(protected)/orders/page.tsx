import Link from "next/link";
import { requireStaffSession } from "@/lib/admin/dal";
import { getAllOrdersForAdmin } from "@/lib/admin/orders";
import { ORDER_STATUS_LABELS } from "@/lib/order-status-labels";

export default async function AdminOrdersPage() {
  await requireStaffSession();
  const orders = await getAllOrdersForAdmin();

  return (
    <div>
      <h1 className="font-display text-2xl uppercase tracking-tight">
        Замовлення
      </h1>

      <div className="mt-6 divide-y divide-border">
        {orders.map((order) => (
          <Link
            key={order.id}
            href={`/admin/orders/${order.id}`}
            className="flex items-center justify-between py-4 hover:bg-surface"
          >
            <div>
              <p className="uppercase tracking-wide text-sm">
                #{order.id.slice(0, 8)} — {order.customer_name}
              </p>
              <p className="text-sm text-muted">
                {new Date(order.created_at).toLocaleString()} · {order.total}{" "}
                грн
              </p>
            </div>
            <span className="text-sm text-accent">
              {ORDER_STATUS_LABELS[order.status]}
            </span>
          </Link>
        ))}
        {orders.length === 0 && (
          <p className="py-4 text-muted">Поки немає замовлень.</p>
        )}
      </div>
    </div>
  );
}
