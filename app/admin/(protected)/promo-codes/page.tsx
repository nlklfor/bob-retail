import { requireStaffSession } from "@/lib/admin/dal";
import { getAllPromoCodesForAdmin } from "@/lib/admin/promo-codes";
import { PromoCodeForm } from "@/components/admin/PromoCodeForm";
import { PromoCodeRowActions } from "@/components/admin/PromoCodeRowActions";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { describePromo } from "@/lib/promo-discount";
import { formatPrice } from "@/lib/format";

export default async function AdminPromoCodesPage() {
  await requireStaffSession();
  const codes = await getAllPromoCodesForAdmin();

  return (
    <div>
      <h1 className="font-display text-2xl uppercase tracking-tight">
        Промокоди
      </h1>
      <p className="mt-2 text-sm text-muted">
        Один промокод на замовлення. Вітальний промокод автоматично надсилається
        кожному новому підписнику розсилки.
      </p>

      <div className="mt-6">
        <PromoCodeForm />
      </div>

      <div className="mt-8 divide-y divide-border">
        {codes.map((promo) => {
          const exhausted =
            promo.usage_limit !== null && promo.times_used >= promo.usage_limit;
          return (
            <div
              key={promo.id}
              className="flex flex-wrap items-center justify-between gap-4 py-4"
            >
              <div className="min-w-0">
                <p className="flex items-center gap-3">
                  <span className="font-display tracking-wide">
                    {promo.code}
                  </span>
                  {promo.is_welcome ? (
                    <StatusBadge variant="success">Вітальний</StatusBadge>
                  ) : null}
                  {exhausted ? (
                    <StatusBadge variant="danger">Вичерпано</StatusBadge>
                  ) : null}
                </p>
                <p className="mt-1 text-sm text-muted">
                  {describePromo(promo)}
                  {promo.min_order_amount
                    ? ` · від ${formatPrice(promo.min_order_amount)} грн`
                    : ""}
                  {" · використано "}
                  {promo.times_used}
                  {promo.usage_limit !== null ? ` з ${promo.usage_limit}` : ""}
                </p>
              </div>
              <PromoCodeRowActions id={promo.id} isWelcome={promo.is_welcome} />
            </div>
          );
        })}
        {codes.length === 0 ? (
          <p className="py-4 text-muted">Поки немає промокодів.</p>
        ) : null}
      </div>
    </div>
  );
}
