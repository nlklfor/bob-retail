"use client";

import { useState } from "react";
import { updateOrderStatusAction } from "@/lib/actions/admin-orders";
import {
  ORDER_STATUS_LABELS,
  ORDER_STATUS_VARIANT,
  type StatusVariant,
} from "@/lib/order-status-labels";
import type { OrderStatus } from "@/lib/types";

const VARIANT_CLASSES: Record<StatusVariant, string> = {
  success: "border-success text-success",
  danger: "border-danger text-danger",
  pending: "border-pending text-pending",
};

const STATUSES: OrderStatus[] = [
  "pending_payment",
  "paid",
  "processing",
  "shipped",
  "completed",
  "cancelled",
  "payment_failed",
];

export function OrderStatusSelect({
  orderId,
  status,
}: {
  orderId: string;
  status: OrderStatus;
}) {
  const [current, setCurrent] = useState(status);
  const [pending, setPending] = useState(false);

  async function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const next = e.target.value as OrderStatus;
    setPending(true);
    await updateOrderStatusAction(orderId, next);
    setCurrent(next);
    setPending(false);
  }

  return (
    <select
      value={current}
      onChange={handleChange}
      disabled={pending}
      className={`border bg-transparent px-2 py-1 text-sm disabled:opacity-50 ${VARIANT_CLASSES[ORDER_STATUS_VARIANT[current]]}`}
    >
      {STATUSES.map((s) => (
        <option key={s} value={s}>
          {ORDER_STATUS_LABELS[s]}
        </option>
      ))}
    </select>
  );
}
