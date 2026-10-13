"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireStaffSession } from "@/lib/admin/dal";
import { createAdminClient } from "@/lib/supabase/server";
import { normalizePromoCode } from "@/lib/promo-discount";

const optionalPositiveNumber = z
  .union([z.literal(""), z.coerce.number().positive()])
  .transform((v) => (v === "" ? null : v));

const createSchema = z
  .object({
    code: z
      .string()
      .transform(normalizePromoCode)
      .pipe(
        z
          .string()
          .regex(
            /^[A-Z0-9_-]{3,32}$/,
            "Код: 3–32 символи, лише латинські літери, цифри, «-» або «_».",
          ),
      ),
    kind: z.enum(["free_shipping", "fixed_amount"]),
    amount: optionalPositiveNumber,
    minOrderAmount: optionalPositiveNumber,
    usageLimit: z
      .union([z.literal(""), z.coerce.number().int().positive()])
      .transform((v) => (v === "" ? null : v)),
    isWelcome: z.boolean(),
  })
  .refine((d) => d.kind !== "fixed_amount" || d.amount !== null, {
    message: "Вкажіть суму знижки.",
    path: ["amount"],
  });

export async function createPromoCodeAction(
  formData: FormData,
): Promise<{ success: true } | { success: false; error: string }> {
  await requireStaffSession();

  const parsed = createSchema.safeParse({
    code: String(formData.get("code") ?? ""),
    kind: formData.get("kind"),
    amount: String(formData.get("amount") ?? ""),
    minOrderAmount: String(formData.get("minOrderAmount") ?? ""),
    usageLimit: String(formData.get("usageLimit") ?? ""),
    isWelcome: formData.get("isWelcome") === "on",
  });
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? "Перевірте форму.",
    };
  }

  const d = parsed.data;
  const supabase = createAdminClient();

  // Only one welcome code at a time — a new one takes over from the old.
  if (d.isWelcome) {
    await supabase
      .from("promo_codes")
      .update({ is_welcome: false })
      .eq("is_welcome", true);
  }

  const { error } = await supabase.from("promo_codes").insert({
    code: d.code,
    kind: d.kind,
    amount: d.kind === "fixed_amount" ? d.amount : null,
    min_order_amount: d.minOrderAmount,
    usage_limit: d.usageLimit,
    is_welcome: d.isWelcome,
  });

  if (error) {
    return {
      success: false,
      error:
        error.code === "23505"
          ? "Такий промокод вже існує."
          : "Не вдалося створити промокод.",
    };
  }

  revalidatePath("/admin/promo-codes");
  return { success: true };
}

export async function setWelcomePromoCodeAction(
  id: string,
  isWelcome: boolean,
): Promise<void> {
  await requireStaffSession();
  const supabase = createAdminClient();

  if (isWelcome) {
    await supabase
      .from("promo_codes")
      .update({ is_welcome: false })
      .eq("is_welcome", true);
  }
  const { error } = await supabase
    .from("promo_codes")
    .update({ is_welcome: isWelcome })
    .eq("id", id);
  if (error) throw error;

  revalidatePath("/admin/promo-codes");
}

export async function deletePromoCodeAction(id: string): Promise<void> {
  await requireStaffSession();
  const supabase = createAdminClient();
  // Orders keep the code text they were placed with (no foreign key), so
  // deleting a code never touches order history.
  const { error } = await supabase.from("promo_codes").delete().eq("id", id);
  if (error) throw error;
  revalidatePath("/admin/promo-codes");
}
