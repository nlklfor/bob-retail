import { z } from "zod";

// Split out from checkout.ts: a "use server" file may only export async
// functions, so this schema (and its inferred type) can't live there.
export const checkoutSchema = z.object({
  customerName: z.string().min(1).max(200),
  customerPhone: z.string().min(5).max(30),
  customerEmail: z.string().email().optional().or(z.literal("")),
  shippingCity: z.string().min(1).max(200),
  shippingCityRef: z.string().min(1),
  shippingBranch: z.string().min(1).max(200),
  shippingWarehouseRef: z.string().min(1),
  items: z
    .array(
      z.object({
        variantId: z.string().uuid(),
        quantity: z.number().int().min(1).max(20),
      }),
    )
    .min(1),
});

export type CheckoutInput = z.infer<typeof checkoutSchema>;
