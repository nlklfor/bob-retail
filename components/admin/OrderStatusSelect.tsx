"use client";

import { useState } from "react";
import { updateOrderStatusAction } from "@/lib/actions/admin-orders";
import type { OrderStatus } from "@/lib/types";

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
      className="border border-border bg-transparent px-2 py-1 text-sm"
    >
      {STATUSES.map((s) => (
        <option key={s} value={s}>
          {s}
        </option>
      ))}
    </select>
  );
}
