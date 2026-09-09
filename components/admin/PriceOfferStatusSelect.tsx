"use client";

import { useState } from "react";
import { updatePriceOfferStatusAction } from "@/lib/actions/admin-price-offers";
import {
  PRICE_OFFER_STATUS_LABELS,
  PRICE_OFFER_STATUS_VARIANT,
  type PriceOfferStatus,
} from "@/lib/price-offer-status-labels";
import type { StatusVariant } from "@/lib/order-status-labels";

const VARIANT_CLASSES: Record<StatusVariant, string> = {
  success: "border-success text-success",
  danger: "border-danger text-danger",
  pending: "border-pending text-pending",
};

const STATUSES: PriceOfferStatus[] = ["new", "accepted", "declined"];

export function PriceOfferStatusSelect({
  offerId,
  status,
}: {
  offerId: string;
  status: PriceOfferStatus;
}) {
  const [current, setCurrent] = useState(status);
  const [pending, setPending] = useState(false);

  async function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const next = e.target.value as PriceOfferStatus;
    setPending(true);
    await updatePriceOfferStatusAction(offerId, next);
    setCurrent(next);
    setPending(false);
  }

  return (
    <select
      value={current}
      onChange={handleChange}
      disabled={pending}
      className={`border bg-transparent px-2 py-1 text-sm disabled:opacity-50 ${VARIANT_CLASSES[PRICE_OFFER_STATUS_VARIANT[current]]}`}
    >
      {STATUSES.map((s) => (
        <option key={s} value={s}>
          {PRICE_OFFER_STATUS_LABELS[s]}
        </option>
      ))}
    </select>
  );
}
