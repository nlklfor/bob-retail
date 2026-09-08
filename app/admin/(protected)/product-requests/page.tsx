import Link from "next/link";
import Image from "next/image";
import { requireStaffSession } from "@/lib/admin/dal";
import { getAllProductRequestsForAdmin } from "@/lib/admin/product-requests";
import {
  PRODUCT_REQUEST_STATUS_LABELS,
  PRODUCT_REQUEST_STATUS_VARIANT,
  type ProductRequestStatus,
} from "@/lib/product-request-status-labels";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { DeleteProductRequestButton } from "@/components/admin/DeleteProductRequestButton";
import { AdminFlashToast } from "@/components/admin/AdminFlashToast";

export default async function AdminProductRequestsPage() {
  await requireStaffSession();
  const requests = await getAllProductRequestsForAdmin();

  return (
    <div>
      <AdminFlashToast param="deleted" message="Запит видалено" />

      <h1 className="font-display text-2xl uppercase tracking-tight">
        Запити на товари
      </h1>

      <div className="mt-6 divide-y divide-border">
        {requests.map((request) => (
          <Link
            key={request.id}
            href={`/admin/product-requests/${request.id}`}
            className="flex items-center justify-between gap-4 py-4 hover:opacity-70"
          >
            <div className="flex min-w-0 flex-1 items-center gap-4">
              <div className="relative h-14 w-11 flex-none bg-surface">
                {request.photos[0] ? (
                  <Image
                    src={request.photos[0]}
                    alt=""
                    fill
                    sizes="44px"
                    className="object-cover"
                  />
                ) : null}
              </div>
              <div className="min-w-0">
                <p className="truncate uppercase tracking-wide text-sm">
                  {request.name || "Без назви"} · Розмір {request.size}
                </p>
                <p className="text-sm text-muted">
                  {new Date(request.created_at).toLocaleString()} ·{" "}
                  {request.instagram_handle}
                </p>
              </div>
            </div>
            <div className="flex flex-none items-center gap-4">
              <StatusBadge
                variant={
                  PRODUCT_REQUEST_STATUS_VARIANT[
                    request.status as ProductRequestStatus
                  ]
                }
              >
                {
                  PRODUCT_REQUEST_STATUS_LABELS[
                    request.status as ProductRequestStatus
                  ]
                }
              </StatusBadge>
              <DeleteProductRequestButton requestId={request.id} />
            </div>
          </Link>
        ))}
        {requests.length === 0 && (
          <p className="py-4 text-muted">Поки немає запитів.</p>
        )}
      </div>
    </div>
  );
}
