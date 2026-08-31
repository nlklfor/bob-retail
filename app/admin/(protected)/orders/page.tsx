import Link from "next/link";
import { requireStaffSession } from "@/lib/admin/dal";
import { getAllOrdersForAdmin } from "@/lib/admin/orders";
import {
  ORDER_STATUS_LABELS,
  ORDER_STATUS_VARIANT,
} from "@/lib/order-status-labels";
import { formatPrice } from "@/lib/format";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { DeleteOrderButton } from "@/components/admin/DeleteOrderButton";
import { AdminFlashToast } from "@/components/admin/AdminFlashToast";
import { Pagination } from "@/components/ui/Pagination";

const PAGE_SIZE = 20;

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  await requireStaffSession();
  const { page } = await searchParams;
  const orders = await getAllOrdersForAdmin();

  const totalPages = Math.max(1, Math.ceil(orders.length / PAGE_SIZE));
  const currentPage = Math.min(Math.max(1, Number(page) || 1), totalPages);
  const pagedOrders = orders.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  return (
    <div>
      <AdminFlashToast param="orderDeleted" message="Замовлення видалено" />

      <h1 className="font-display text-2xl uppercase tracking-tight">
        Замовлення
      </h1>

      <div className="mt-6 divide-y divide-border">
        {pagedOrders.map((order) => (
          <div
            key={order.id}
            className="flex items-center justify-between gap-4 py-4"
          >
            <Link
              href={`/admin/orders/${order.id}`}
              className="min-w-0 flex-1 hover:opacity-70"
            >
              <p className="truncate uppercase tracking-wide text-sm">
                #{order.id.slice(0, 8)} — {order.customer_name}
              </p>
              <p className="text-sm text-muted">
                {new Date(order.created_at).toLocaleString()} ·{" "}
                {formatPrice(order.total)} грн
              </p>
            </Link>
            <div className="flex flex-none items-center gap-4">
              <StatusBadge variant={ORDER_STATUS_VARIANT[order.status]}>
                {ORDER_STATUS_LABELS[order.status]}
              </StatusBadge>
              <DeleteOrderButton orderId={order.id} />
            </div>
          </div>
        ))}
        {orders.length === 0 && (
          <p className="py-4 text-muted">Поки немає замовлень.</p>
        )}
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        buildHref={(p) => `/admin/orders${p > 1 ? `?page=${p}` : ""}`}
      />
    </div>
  );
}
