import Link from "next/link";
import { requireStaffSession } from "@/lib/admin/dal";
import { getAllPriceOffersForAdmin } from "@/lib/admin/price-offers";
import {
  PRICE_OFFER_STATUS_LABELS,
  PRICE_OFFER_STATUS_VARIANT,
  type PriceOfferStatus,
} from "@/lib/price-offer-status-labels";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { DeletePriceOfferButton } from "@/components/admin/DeletePriceOfferButton";
import { AdminFlashToast } from "@/components/admin/AdminFlashToast";
import { formatPrice } from "@/lib/format";

export default async function AdminPriceOffersPage() {
  await requireStaffSession();
  const offers = await getAllPriceOffersForAdmin();

  return (
    <div>
      <AdminFlashToast param="deleted" message="Пропозицію видалено" />

      <h1 className="font-display text-2xl uppercase tracking-tight">
        Пропозиції ціни
      </h1>

      <div className="mt-6 divide-y divide-border">
        {offers.map((offer) => (
          <Link
            key={offer.id}
            href={`/admin/price-offers/${offer.id}`}
            className="flex items-center justify-between gap-4 py-4 hover:opacity-70"
          >
            <div className="min-w-0 flex-1">
              <p className="truncate uppercase tracking-wide text-sm">
                {offer.product_name}
                {offer.size ? ` · Розмір ${offer.size}` : ""}
              </p>
              <p className="text-sm text-muted">
                {new Date(offer.created_at).toLocaleString()} ·{" "}
                {offer.customer_name} · {offer.customer_social}
              </p>
            </div>
            <div className="flex flex-none items-center gap-4">
              <p className="text-sm">
                <span className="text-muted line-through">
                  {formatPrice(offer.original_price)}
                </span>{" "}
                <span className="text-highlight">
                  {formatPrice(offer.offered_price)} грн
                </span>
              </p>
              <StatusBadge
                variant={
                  PRICE_OFFER_STATUS_VARIANT[offer.status as PriceOfferStatus]
                }
              >
                {PRICE_OFFER_STATUS_LABELS[offer.status as PriceOfferStatus]}
              </StatusBadge>
              <DeletePriceOfferButton offerId={offer.id} />
            </div>
          </Link>
        ))}
        {offers.length === 0 && (
          <p className="py-4 text-muted">Поки немає пропозицій.</p>
        )}
      </div>
    </div>
  );
}
