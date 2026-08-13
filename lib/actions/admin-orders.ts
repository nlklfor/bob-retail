"use server";

import { revalidatePath } from "next/cache";
import { requireStaffSession } from "@/lib/admin/dal";
import { updateOrderStatus } from "@/lib/admin/orders";
import type { OrderStatus } from "@/lib/types";

const VALID_STATUSES: OrderStatus[] = [
  "pending_payment",
  "paid",
  "processing",
  "shipped",
  "completed",
  "cancelled",
  "payment_failed",
];

export async function updateOrderStatusAction(
  id: string,
  status: string,
): Promise<void> {
  await requireStaffSession();

  if (!VALID_STATUSES.includes(status as OrderStatus)) {
    throw new Error("Invalid status");
  }

  await updateOrderStatus(id, status as OrderStatus);
  revalidatePath(`/admin/orders/${id}`);
  revalidatePath("/admin/orders");
}
