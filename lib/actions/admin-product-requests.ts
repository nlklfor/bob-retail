"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireStaffSession } from "@/lib/admin/dal";
import {
  updateProductRequestStatus,
  deleteProductRequest,
} from "@/lib/admin/product-requests";
import type { ProductRequestStatus } from "@/lib/product-request-status-labels";

const VALID_STATUSES: ProductRequestStatus[] = [
  "new",
  "contacted",
  "fulfilled",
  "declined",
];

export async function updateProductRequestStatusAction(
  id: string,
  status: string,
): Promise<void> {
  await requireStaffSession();

  if (!VALID_STATUSES.includes(status as ProductRequestStatus)) {
    throw new Error("Invalid status");
  }

  await updateProductRequestStatus(id, status as ProductRequestStatus);
  revalidatePath(`/admin/product-requests/${id}`);
  revalidatePath("/admin/product-requests");
}

export async function deleteProductRequestAction(id: string): Promise<void> {
  await requireStaffSession();
  await deleteProductRequest(id);
  redirect("/admin/product-requests?deleted=1");
}
