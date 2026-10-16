"use server";

import { createAdminClient } from "@/lib/supabase/server";
import { sendEmail, BUSINESS_EMAIL } from "@/lib/email";
import { renderNotificationEmail } from "@/lib/email-templates";
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
    .select("id, name, slug, price, is_active, images")
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

  const { data: created, error } = await supabase
    .from("price_offers")
    .insert({
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
    })
    .select("id")
    .single();

  if (error || !created) {
    return {
      success: false,
      error: "Не вдалося надіслати пропозицію. Спробуйте пізніше.",
    };
  }

  try {
    const siteUrl = process.env.SITE_URL ?? "https://frombobwithlove.com";
    const discount = product.price - data.offeredPrice;
    const notification = renderNotificationEmail({
      subject: `Нова пропозиція ціни: ${product.name}`,
      heading: "Нова пропозиція ціни",
      preheader: `${product.name}: ${formatPrice(product.price)} → ${formatPrice(data.offeredPrice)} грн від ${data.customerName}`,
      rows: [
        { label: "Ім'я", value: data.customerName },
        { label: "Telegram/Instagram", value: data.customerSocial },
        {
          label: "Телефон",
          value: data.customerPhone || "",
          href: data.customerPhone ? `tel:${data.customerPhone}` : undefined,
        },
        {
          label: "Email",
          value: data.customerEmail || "",
          href: data.customerEmail ? `mailto:${data.customerEmail}` : undefined,
        },
      ],
      items: [
        {
          name: product.name,
          detail: data.size ? `Розмір: ${data.size}` : "Без розміру",
          price: `${formatPrice(product.price)} грн`,
          imageUrl: product.images?.[0] ?? null,
        },
      ],
      totals: [
        { label: "Звичайна ціна", value: `${formatPrice(product.price)} грн` },
        { label: "Знижка", value: `−${formatPrice(discount)} грн` },
        {
          label: "Пропонує",
          value: `${formatPrice(data.offeredPrice)} грн`,
          strong: true,
        },
      ],
      button: {
        href: `${siteUrl}/admin/price-offers/${created.id}`,
        label: "Відкрити в адмінці",
      },
      siteUrl,
    });
    await sendEmail({
      to: BUSINESS_EMAIL,
      // Email is optional on offers — Reply goes to the customer when given.
      replyTo: data.customerEmail || undefined,
      ...notification,
    });
  } catch (err) {
    // Same rule as order/contact/product-request notifications: the offer
    // is already saved — an email hiccup is a side effect, not a reason
    // to report failure to the customer.
    console.error("Failed to send price offer notification:", err);
  }

  return { success: true };
}
