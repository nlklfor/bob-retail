"use server";

import { z } from "zod";
import {
  searchCities,
  getWarehouses,
  type NovaPoshtaCity,
  type NovaPoshtaWarehouse,
} from "@/lib/nova-poshta/client";
import { resolveShippingCost } from "@/lib/nova-poshta/pricing";

export async function searchCitiesAction(
  query: string,
): Promise<{ cities: NovaPoshtaCity[]; error?: string }> {
  try {
    return { cities: await searchCities(query) };
  } catch {
    return { cities: [], error: "Не вдалося виконати пошук міст." };
  }
}

export async function searchWarehousesAction(
  cityRef: string,
  query: string,
): Promise<{ warehouses: NovaPoshtaWarehouse[]; error?: string }> {
  try {
    return { warehouses: await getWarehouses(cityRef, query) };
  } catch {
    return { warehouses: [], error: "Не вдалося завантажити відділення." };
  }
}

const previewSchema = z.object({
  cityRef: z.string().min(1),
  items: z
    .array(
      z.object({
        variantId: z.string().uuid(),
        quantity: z.number().int().min(1).max(20),
      }),
    )
    .min(1),
});

export async function previewShippingCostAction(
  input: z.infer<typeof previewSchema>,
): Promise<{ cost: number } | { error: string }> {
  const parsed = previewSchema.safeParse(input);
  if (!parsed.success) {
    return { error: "Некоректний запит." };
  }

  const cost = await resolveShippingCost(
    parsed.data.cityRef,
    parsed.data.items,
  );
  return { cost };
}
