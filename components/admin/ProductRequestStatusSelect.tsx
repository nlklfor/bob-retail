"use client";

import { useState } from "react";
import { updateProductRequestStatusAction } from "@/lib/actions/admin-product-requests";
import {
  PRODUCT_REQUEST_STATUS_LABELS,
  PRODUCT_REQUEST_STATUS_VARIANT,
  type ProductRequestStatus,
} from "@/lib/product-request-status-labels";
import type { StatusVariant } from "@/lib/order-status-labels";

const VARIANT_CLASSES: Record<StatusVariant, string> = {
  success: "border-success text-success",
  danger: "border-danger text-danger",
  pending: "border-pending text-pending",
};

const STATUSES: ProductRequestStatus[] = [
  "new",
  "contacted",
  "fulfilled",
  "declined",
];

export function ProductRequestStatusSelect({
  requestId,
  status,
}: {
  requestId: string;
  status: ProductRequestStatus;
}) {
  const [current, setCurrent] = useState(status);
  const [pending, setPending] = useState(false);

  async function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const next = e.target.value as ProductRequestStatus;
    setPending(true);
    await updateProductRequestStatusAction(requestId, next);
    setCurrent(next);
    setPending(false);
  }

  return (
    <select
      value={current}
      onChange={handleChange}
      disabled={pending}
      className={`border bg-transparent px-2 py-1 text-sm disabled:opacity-50 ${VARIANT_CLASSES[PRODUCT_REQUEST_STATUS_VARIANT[current]]}`}
    >
      {STATUSES.map((s) => (
        <option key={s} value={s}>
          {PRODUCT_REQUEST_STATUS_LABELS[s]}
        </option>
      ))}
    </select>
  );
}
