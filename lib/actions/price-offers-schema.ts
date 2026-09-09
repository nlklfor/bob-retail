import { z } from "zod";

// Split out from price-offers.ts: a "use server" file may only export
// async functions, same reason checkout-schema.ts and
// product-requests-schema.ts are their own files.
export const priceOfferSchema = z
  .object({
    productId: z.string().uuid(),
    size: z.string().trim().max(100).optional().or(z.literal("")),
    originalPrice: z.number().min(0),
    offeredPrice: z.number().min(0),
    // Unlike checkout, Telegram/Instagram is the required reply channel
    // here (matches how the client actually replies to offers — a DM
    // with a payment link) and phone is the optional one.
    customerName: z.string().trim().min(1, "Вкажіть ім'я.").max(200),
    customerSocial: z
      .string()
      .trim()
      .min(1, "Вкажіть Telegram або Instagram.")
      .max(100),
    customerPhone: z.string().trim().max(30).optional().or(z.literal("")),
    customerEmail: z
      .string()
      .trim()
      .email("Некоректний email.")
      .max(200)
      .optional()
      .or(z.literal("")),
  })
  .refine((data) => data.offeredPrice <= data.originalPrice, {
    message: "Пропонована ціна не може перевищувати початкову.",
    path: ["offeredPrice"],
  })
  .refine((data) => data.originalPrice - data.offeredPrice <= 300, {
    message: "Максимальна знижка — 300 грн.",
    path: ["offeredPrice"],
  });

export type PriceOfferInput = z.infer<typeof priceOfferSchema>;
