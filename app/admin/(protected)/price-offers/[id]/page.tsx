import { notFound } from "next/navigation";
import Link from "next/link";
import { requireStaffSession } from "@/lib/admin/dal";
import { getPriceOfferForAdmin } from "@/lib/admin/price-offers";
import { PriceOfferStatusSelect } from "@/components/admin/PriceOfferStatusSelect";
import { DeletePriceOfferButton } from "@/components/admin/DeletePriceOfferButton";
import { formatPrice } from "@/lib/format";
import type { PriceOfferStatus } from "@/lib/price-offer-status-labels";

export default async function AdminPriceOfferDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireStaffSession();
  const { id } = await params;
  const offer = await getPriceOfferForAdmin(id);

  if (!offer) {
    notFound();
  }

  const discount = offer.original_price - offer.offered_price;

  return (
    <div className="max-w-2xl">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl uppercase tracking-tight">
          {offer.product_name}
        </h1>
        <div className="flex items-center gap-4">
          <PriceOfferStatusSelect
            offerId={offer.id}
            status={offer.status as PriceOfferStatus}
          />
          <DeletePriceOfferButton offerId={offer.id} />
        </div>
      </div>
      <p className="mt-1 text-sm text-muted">
        {new Date(offer.created_at).toLocaleString()}
      </p>

      {offer.product_id ? (
        <Link
          href={`/products/${offer.product_slug}`}
          target="_blank"
          className="mt-2 inline-block text-sm text-highlight hover:underline"
        >
          Переглянути товар на сайті →
        </Link>
      ) : (
        <p className="mt-2 text-sm text-muted">
          Товар більше не існує в каталозі.
        </p>
      )}

      <dl className="mt-6 space-y-3 text-sm">
        <div className="flex justify-between border-b border-border pb-2">
          <dt className="text-muted">Початкова ціна</dt>
          <dd>{formatPrice(offer.original_price)} грн</dd>
        </div>
        <div className="flex justify-between border-b border-border pb-2">
          <dt className="text-muted">Пропонована ціна</dt>
          <dd className="text-highlight">
            {formatPrice(offer.offered_price)} грн
          </dd>
        </div>
        <div className="flex justify-between border-b border-border pb-2">
          <dt className="text-muted">Знижка</dt>
          <dd>{formatPrice(discount)} грн</dd>
        </div>
        {offer.size ? (
          <div className="flex justify-between border-b border-border pb-2">
            <dt className="text-muted">Розмір</dt>
            <dd>{offer.size}</dd>
          </div>
        ) : null}
        <div className="flex justify-between border-b border-border pb-2">
          <dt className="text-muted">Ім&apos;я</dt>
          <dd>{offer.customer_name}</dd>
        </div>
        <div className="flex justify-between border-b border-border pb-2">
          <dt className="text-muted">Telegram/Instagram</dt>
          <dd>{offer.customer_social}</dd>
        </div>
        {offer.customer_phone ? (
          <div className="flex justify-between border-b border-border pb-2">
            <dt className="text-muted">Телефон</dt>
            <dd>
              <a
                href={`tel:${offer.customer_phone}`}
                className="hover:text-highlight"
              >
                {offer.customer_phone}
              </a>
            </dd>
          </div>
        ) : null}
        {offer.customer_email ? (
          <div className="flex justify-between border-b border-border pb-2">
            <dt className="text-muted">Email</dt>
            <dd>
              <a
                href={`mailto:${offer.customer_email}`}
                className="hover:text-highlight"
              >
                {offer.customer_email}
              </a>
            </dd>
          </div>
        ) : null}
      </dl>

      <p className="mt-6 text-sm text-muted">
        Прийнявши пропозицію, зв&apos;яжіться з клієнтом і надішліть посилання
        на оплату на узгоджену суму (через Monobank, як і для звичайних
        замовлень).
      </p>
    </div>
  );
}
