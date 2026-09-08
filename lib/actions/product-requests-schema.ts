import { z } from "zod";

// Split out from product-requests.ts: a "use server" file may only export
// async functions, same reason checkout-schema.ts is its own file.
export const productRequestSchema = z.object({
  name: z.string().trim().max(200).optional().or(z.literal("")),
  photos: z.array(z.string().url()).min(1, "Додайте хоча б одне фото.").max(6),
  size: z.string().trim().min(1, "Вкажіть розмір.").max(100),
  instagramHandle: z.string().trim().min(1, "Вкажіть Instagram.").max(100),
  color: z.string().trim().max(100).optional().or(z.literal("")),
  material: z.string().trim().max(100).optional().or(z.literal("")),
  expectedCost: z.number().min(0).optional(),
  link: z
    .string()
    .trim()
    .url("Некоректне посилання.")
    .max(500)
    .optional()
    .or(z.literal("")),
  description: z.string().trim().max(2000).optional().or(z.literal("")),
});

export type ProductRequestInput = z.infer<typeof productRequestSchema>;
