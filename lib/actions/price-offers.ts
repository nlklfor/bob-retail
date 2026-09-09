"use server";

import { createAdminClient } from "@/lib/supabase/server";
import { sendEmail, BUSINESS_EMAIL } from "@/lib/email";
import { formatPrice } from "@/lib/format";
import { priceOfferSchema, type PriceOfferInput } from "./price-offers-schema";

export async function submitPriceOfferAction(
  input: PriceOfferInput,
): Promise<{ success: true } | { success: false; error: string }> {
  const parsed = priceOfferSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? "Перевірте форму.",
    };
  }

  const { data } = parsed;
  const supabase = createAdminClient();

  // Look up the product ourselves rather than trusting a client-supplied
  // name/slug/price — same reasoning as checkout resolving variants
  // server-side instead of trusting cart contents. Also re-confirms the
  // product is still active and the price hasn't changed since the page
  // loaded.
  const { data: product, error: productError } = await supabase
    .from("products")
    .select("id, name, slug, price, is_active")
    .eq("id", data.productId)
    .maybeSingle();

  if (productError || !product || !product.is_active) {
    return { success: false, error: "Товар більше не доступний." };
  }

  if (data.originalPrice - data.offeredPrice > 300) {
    return { success: false, error: "Максимальна знижка — 300 грн." };
  }
  if (data.offeredPrice > product.price) {
    return {
      success: false,
      error: "Пропонована ціна не може перевищувати початкову.",
    };
  }

  const { error } = await supabase.from("price_offers").insert({
    product_id: product.id,
    product_name: product.name,
    product_slug: product.slug,
    size: data.size || null,
    original_price: product.price,
    offered_price: data.offeredPrice,
    customer_name: data.customerName,
    customer_social: data.customerSocial,
    customer_phone: data.customerPhone || null,
    customer_email: data.customerEmail || null,
  });

  if (error) {
    return {
      success: false,
      error: "Не вдалося надіслати пропозицію. Спробуйте пізніше.",
    };
  }

  try {
    await sendEmail({
      to: BUSINESS_EMAIL,
      subject: `Нова пропозиція ціни: ${product.name}`,
      text: [
        `Товар: ${product.name}`,
        data.size ? `Розмір: ${data.size}` : null,
        `Ціна: ${formatPrice(product.price)} грн → ${formatPrice(data.offeredPrice)} грн`,
        `Ім'я: ${data.customerName}`,
        `Telegram/Instagram: ${data.customerSocial}`,
        data.customerPhone ? `Телефон: ${data.customerPhone}` : null,
        data.customerEmail ? `Email: ${data.customerEmail}` : null,
      ]
        .filter((line) => line !== null)
        .join("\n"),
    });
  } catch (err) {
    // Same rule as order/contact/product-request notifications: the offer
    // is already saved — an email hiccup is a side effect, not a reason
    // to report failure to the customer.
    console.error("Failed to send price offer notification:", err);
  }

  return { success: true };
}
