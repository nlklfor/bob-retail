"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireStaffSession } from "@/lib/admin/dal";
import {
  updatePriceOfferStatus,
  deletePriceOffer,
} from "@/lib/admin/price-offers";
import type { PriceOfferStatus } from "@/lib/price-offer-status-labels";

const VALID_STATUSES: PriceOfferStatus[] = ["new", "accepted", "declined"];

export async function updatePriceOfferStatusAction(
  id: string,
  status: string,
): Promise<void> {
  await requireStaffSession();

  if (!VALID_STATUSES.includes(status as PriceOfferStatus)) {
    throw new Error("Invalid status");
  }

  await updatePriceOfferStatus(id, status as PriceOfferStatus);
  revalidatePath(`/admin/price-offers/${id}`);
  revalidatePath("/admin/price-offers");
}

export async function deletePriceOfferAction(id: string): Promise<void> {
  await requireStaffSession();
  await deletePriceOffer(id);
  redirect("/admin/price-offers?deleted=1");
}
