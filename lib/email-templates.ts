import { formatPrice } from "./format";
import { describePromo } from "./promo-discount";
import type { PromoCodeKind } from "./types";

// Branded HTML for customer-facing emails (order confirmation, welcome).
// Email clients ignore most modern CSS, so this is deliberately old-school:
// table layout, inline styles, web-safe fonts, no external stylesheet.
// Every email also ships a plain-text twin — better deliverability, and
// what text-only mail apps show.
//
// Colors mirror the site's tokens (app/globals.css): black on white,
// --muted for secondary text, --surface for boxes, --highlight for the
// promo code accent.

const C = {
  fg: "#0a0a0a",
  muted: "#6b6b6b",
  border: "#e5e5e5",
  surface: "#f2f1ee",
  highlight: "#9184d9",
  bg: "#ffffff",
  page: "#f2f1ee",
};

const FONT = "Helvetica, Arial, sans-serif";

// The shop's name as it appears in subjects and email text (the inbox
// sender name itself comes from RESEND_FROM_EMAIL).
const BRAND = "Bobretailer";

export type RenderedEmail = { subject: string; html: string; text: string };

function esc(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// The barcode version of the FROMBOBWITHLOVE logo, cropped from the site's
// animated header logo (source: docs/email/logo-barcode.png). Served from
// Supabase Storage rather than the site itself so it works regardless of
// what's deployed where.
function logoUrl(): string {
  return `${process.env.SUPABASE_URL}/storage/v1/object/public/product-images/email/logo-barcode.png`;
}

function heading(text: string): string {
  return `<h1 style="margin:0 0 16px;font-family:${FONT};font-size:22px;line-height:1.25;font-weight:700;letter-spacing:0.04em;text-transform:uppercase;color:${C.fg};">${esc(text)}</h1>`;
}

function paragraph(html: string, muted = false): string {
  return `<p style="margin:0 0 16px;font-family:${FONT};font-size:15px;line-height:1.6;color:${muted ? C.muted : C.fg};">${html}</p>`;
}

function button(href: string, label: string): string {
  return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:8px 0 24px;"><tr><td style="background:${C.fg};"><a href="${esc(href)}" style="display:inline-block;padding:14px 28px;font-family:${FONT};font-size:13px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:#ffffff;text-decoration:none;">${esc(label)}</a></td></tr></table>`;
}

function layout(opts: {
  preheader: string;
  body: string;
  siteUrl: string;
  unsubscribeUrl?: string;
  // Shop-facing notification: swaps the customer footer (social links,
  // "reply to this email") for a short note about where it came from.
  internal?: boolean;
}): string {
  const { preheader, body, siteUrl, unsubscribeUrl, internal } = opts;
  const link = (href: string, label: string) =>
    `<a href="${esc(href)}" style="color:${C.muted};text-decoration:underline;">${label}</a>`;

  const footer = internal
    ? `Автоматичне сповіщення з сайту ${link(siteUrl, "frombobwithlove.com")}.`
    : [
        "Bob — only legit items.",
        `${link("https://www.instagram.com/bobretailer", "Instagram")} &nbsp;·&nbsp; ${link("https://t.me/frombobwithlove", "Telegram")} &nbsp;·&nbsp; ${link(siteUrl, "frombobwithlove.com")}`,
        "Питання? Просто дайте відповідь на цей лист.",
      ].join("<br>") +
      (unsubscribeUrl
        ? `<br><br>Ви отримали цей лист, бо підписалися на розсилку ${BRAND}. ${link(unsubscribeUrl, "Відписатися")}`
        : "");

  return `<!doctype html>
<html lang="uk">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="color-scheme" content="light">
<meta name="supported-color-schemes" content="light">
<title>${BRAND}</title>
</head>
<body style="margin:0;padding:0;background:${C.page};">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">${esc(preheader)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${C.page};">
<tr><td align="center" style="padding:32px 12px;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:560px;background:${C.bg};">
    <tr><td align="center" style="padding:32px 32px 24px;border-bottom:1px solid ${C.border};">
      <a href="${esc(siteUrl)}" style="text-decoration:none;"><img src="${esc(logoUrl())}" width="280" alt="FROMBOBWITHLOVE" style="display:block;width:280px;max-width:100%;height:auto;border:0;"></a>
    </td></tr>
    <tr><td style="padding:32px;">
${body}
    </td></tr>
    <tr><td style="padding:24px 32px 32px;border-top:1px solid ${C.border};font-family:${FONT};font-size:12px;line-height:1.7;color:${C.muted};">
      ${footer}
    </td></tr>
  </table>
</td></tr>
</table>
</body>
</html>`;
}

// ---------------------------------------------------------------------
// Order confirmation — sent to the customer once Monobank confirms payment.
// ---------------------------------------------------------------------

export type OrderEmailInput = {
  id: string;
  customer_name: string;
  shipping_city: string;
  shipping_branch: string;
  subtotal: number;
  shipping_cost: number;
  discount: number;
  promo_code: string | null;
  total: number;
  items: {
    product_name: string;
    size: string | null;
    quantity: number;
    line_total: number;
    imageUrl: string | null;
  }[];
};

export function renderOrderConfirmationEmail(
  order: OrderEmailInput,
  siteUrl: string,
): RenderedEmail {
  const number = order.id.slice(0, 8).toUpperCase();
  const orderUrl = `${siteUrl}/order/${order.id}`;
  const firstName = order.customer_name.split(" ")[0] || order.customer_name;

  const itemRows = order.items
    .map(
      (item) => `<tr>
  <td width="72" style="padding:12px 0;border-bottom:1px solid ${C.border};vertical-align:top;">
    ${
      item.imageUrl
        ? `<img src="${esc(item.imageUrl)}" width="60" height="80" alt="" style="display:block;width:60px;height:80px;object-fit:cover;background:${C.surface};border:0;">`
        : `<div style="width:60px;height:80px;background:${C.surface};"></div>`
    }
  </td>
  <td style="padding:12px 12px 12px 0;border-bottom:1px solid ${C.border};vertical-align:top;font-family:${FONT};font-size:14px;line-height:1.5;color:${C.fg};">
    ${esc(item.product_name)}<br>
    <span style="color:${C.muted};font-size:13px;">${item.size ? `Розмір: ${esc(item.size)} · ` : ""}Кількість: ${item.quantity}</span>
  </td>
  <td align="right" style="padding:12px 0;border-bottom:1px solid ${C.border};vertical-align:top;font-family:${FONT};font-size:14px;color:${C.fg};white-space:nowrap;">${formatPrice(item.line_total)} грн</td>
</tr>`,
    )
    .join("");

  const totalRow = (label: string, value: string, strong = false) =>
    `<tr><td style="padding:4px 0;font-family:${FONT};font-size:${strong ? "16px" : "14px"};${strong ? "font-weight:700;" : ""}color:${strong ? C.fg : C.muted};">${label}</td><td align="right" style="padding:4px 0;font-family:${FONT};font-size:${strong ? "16px" : "14px"};${strong ? "font-weight:700;" : ""}color:${C.fg};white-space:nowrap;">${value}</td></tr>`;

  const body = `
${heading("Дякуємо за замовлення!")}
${paragraph(`${esc(firstName)}, оплату отримано — замовлення №${number} прийнято в роботу.`)}
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:8px 0 16px;">${itemRows}</table>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 24px;">
  ${totalRow("Сума", `${formatPrice(order.subtotal)} грн`)}
  ${totalRow("Доставка", `${formatPrice(order.shipping_cost)} грн`)}
  ${order.discount > 0 ? totalRow(`Промокод${order.promo_code ? ` ${esc(order.promo_code)}` : ""}`, `−${formatPrice(order.discount)} грн`) : ""}
  <tr><td colspan="2" style="padding-top:8px;border-top:1px solid ${C.border};"></td></tr>
  ${totalRow("Разом", `${formatPrice(order.total)} грн`, true)}
</table>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 24px;background:${C.surface};">
  <tr><td style="padding:16px 20px;font-family:${FONT};font-size:14px;line-height:1.6;color:${C.fg};">
    <span style="font-size:12px;letter-spacing:0.08em;text-transform:uppercase;color:${C.muted};">Доставка Новою Поштою</span><br>
    ${esc(order.customer_name)}<br>
    ${esc(order.shipping_city)}, ${esc(order.shipping_branch)}
  </td></tr>
</table>
${paragraph("Товари в наявності відправляємо протягом 1–2 робочих днів. Товари під замовлення — орієнтовно 10–18 робочих днів.", true)}
${button(orderUrl, "Переглянути замовлення")}`;

  const text = [
    `Дякуємо за замовлення!`,
    ``,
    `${firstName}, оплату отримано — замовлення №${number} прийнято в роботу.`,
    ``,
    ...order.items.map(
      (i) =>
        `${i.product_name}${i.size ? ` (${i.size})` : ""} x${i.quantity} — ${formatPrice(i.line_total)} грн`,
    ),
    ``,
    `Сума: ${formatPrice(order.subtotal)} грн`,
    `Доставка: ${formatPrice(order.shipping_cost)} грн`,
    ...(order.discount > 0
      ? [
          `Промокод${order.promo_code ? ` ${order.promo_code}` : ""}: −${formatPrice(order.discount)} грн`,
        ]
      : []),
    `Разом: ${formatPrice(order.total)} грн`,
    ``,
    `Доставка Новою Поштою: ${order.customer_name}, ${order.shipping_city}, ${order.shipping_branch}`,
    ``,
    `Товари в наявності відправляємо протягом 1–2 робочих днів. Товари під замовлення — орієнтовно 10–18 робочих днів.`,
    ``,
    `Переглянути замовлення: ${orderUrl}`,
    ``,
    `Bob — only legit items.`,
    `Питання? Просто дайте відповідь на цей лист.`,
  ].join("\n");

  return {
    subject: `Замовлення №${number} оплачено — ${BRAND}`,
    html: layout({
      preheader: `Оплату отримано, замовлення №${number} в роботі.`,
      body,
      siteUrl,
    }),
    text,
  };
}

// ---------------------------------------------------------------------
// Welcome — sent to a new newsletter subscriber.
// ---------------------------------------------------------------------

export type WelcomePromo = {
  code: string;
  kind: PromoCodeKind;
  amount: number | null;
  min_order_amount: number | null;
};

export function renderWelcomeEmail(opts: {
  siteUrl: string;
  unsubscribeUrl: string;
  promo: WelcomePromo | null;
}): RenderedEmail {
  const { siteUrl, unsubscribeUrl, promo } = opts;
  const promoDescription = promo ? describePromo(promo) : null;
  const minLine = promo?.min_order_amount
    ? `Діє для замовлень від ${formatPrice(Math.round(promo.min_order_amount))} грн.`
    : null;

  const promoBlock = promo
    ? `
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:8px 0 24px;border:2px dashed ${C.highlight};">
  <tr><td align="center" style="padding:24px 16px;">
    <div style="font-family:${FONT};font-size:12px;letter-spacing:0.12em;text-transform:uppercase;color:${C.muted};">Ваш промокод</div>
    <div style="margin:8px 0;font-family:'Courier New', Courier, monospace;font-size:28px;font-weight:700;letter-spacing:0.12em;color:${C.fg};">${esc(promo.code)}</div>
    <div style="font-family:${FONT};font-size:14px;color:${C.fg};">${esc(promoDescription!.charAt(0).toUpperCase() + promoDescription!.slice(1))}</div>
    ${minLine ? `<div style="margin-top:4px;font-family:${FONT};font-size:13px;color:${C.muted};">${esc(minLine)}</div>` : ""}
  </td></tr>
</table>
${paragraph("Введіть його в кошику під час оформлення замовлення.", true)}`
    : "";

  const body = `
${heading("Дякуємо за підписку!")}
${paragraph(`Тепер ви першими дізнаватиметесь про новинки, дропи та знижки ${BRAND}.`)}
${promoBlock}
${button(siteUrl, "Перейти до магазину")}
${paragraph("Тільки оригінальні речі — з любов'ю від Боба.", true)}`;

  const text = [
    `Дякуємо за підписку!`,
    ``,
    `Тепер ви першими дізнаватиметесь про новинки, дропи та знижки ${BRAND}.`,
    ``,
    ...(promo
      ? [
          `Ваш промокод: ${promo.code} — ${promoDescription}.`,
          ...(minLine ? [minLine] : []),
          `Введіть його в кошику під час оформлення замовлення.`,
          ``,
        ]
      : []),
    `Магазин: ${siteUrl}`,
    ``,
    `Bob — only legit items.`,
    ``,
    `Відписатися від розсилки: ${unsubscribeUrl}`,
  ].join("\n");

  return {
    subject: promo
      ? `Ваш промокод: ${promoDescription} — ${BRAND}`
      : `Дякуємо за підписку на ${BRAND}`,
    html: layout({
      preheader: promo
        ? `Ваш промокод ${promo.code} — ${promoDescription}.`
        : `Ви підписалися на розсилку ${BRAND}.`,
      body,
      siteUrl,
      unsubscribeUrl,
    }),
    text,
  };
}

// ---------------------------------------------------------------------
// Shop notifications — sent to the business inbox (new paid order,
// contact form, «Під замовлення» request, price offer). One shared shape:
// a details table, optional item list / photos / message, and a button
// straight to the right place (admin page, or a reply for contact mail).
// Everything customer-typed goes through esc() — this is the one email
// type whose content is written by strangers.
// ---------------------------------------------------------------------

export type NotificationInput = {
  subject: string;
  heading: string;
  preheader: string;
  rows: { label: string; value: string; href?: string }[];
  items?: {
    name: string;
    detail: string;
    price: string;
    imageUrl: string | null;
  }[];
  totals?: { label: string; value: string; strong?: boolean }[];
  photos?: string[];
  message?: { label: string; text: string };
  button: { href: string; label: string };
  siteUrl: string;
};

// Customer-supplied links only become clickable for safe schemes.
function safeHref(href: string | undefined): string | null {
  if (!href) return null;
  return /^(https?:|mailto:|tel:)/i.test(href) ? href : null;
}

export function renderNotificationEmail(n: NotificationInput): RenderedEmail {
  const rows = n.rows
    .filter((r) => r.value.trim() !== "")
    .map((r) => {
      const href = safeHref(r.href);
      const value = href
        ? `<a href="${esc(href)}" style="color:${C.fg};text-decoration:underline;">${esc(r.value)}</a>`
        : esc(r.value);
      return `<tr>
  <td width="38%" style="padding:8px 12px 8px 0;border-bottom:1px solid ${C.border};vertical-align:top;font-family:${FONT};font-size:12px;letter-spacing:0.06em;text-transform:uppercase;color:${C.muted};">${esc(r.label)}</td>
  <td style="padding:8px 0;border-bottom:1px solid ${C.border};vertical-align:top;font-family:${FONT};font-size:14px;line-height:1.5;color:${C.fg};word-break:break-word;">${value}</td>
</tr>`;
    })
    .join("");

  const items = n.items?.length
    ? `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:24px 0 8px;">${n.items
        .map(
          (i) => `<tr>
  <td width="60" style="padding:10px 0;border-bottom:1px solid ${C.border};vertical-align:top;">${
    i.imageUrl
      ? `<img src="${esc(i.imageUrl)}" width="48" height="64" alt="" style="display:block;width:48px;height:64px;object-fit:cover;background:${C.surface};border:0;">`
      : `<div style="width:48px;height:64px;background:${C.surface};"></div>`
  }</td>
  <td style="padding:10px 12px 10px 0;border-bottom:1px solid ${C.border};vertical-align:top;font-family:${FONT};font-size:14px;line-height:1.5;color:${C.fg};">${esc(i.name)}<br><span style="font-size:13px;color:${C.muted};">${esc(i.detail)}</span></td>
  <td align="right" style="padding:10px 0;border-bottom:1px solid ${C.border};vertical-align:top;font-family:${FONT};font-size:14px;color:${C.fg};white-space:nowrap;">${esc(i.price)}</td>
</tr>`,
        )
        .join("")}</table>`
    : "";

  const totals = n.totals?.length
    ? `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 8px;">${n.totals
        .map(
          (t) =>
            `<tr><td style="padding:3px 0;font-family:${FONT};font-size:${t.strong ? "16px" : "14px"};${t.strong ? "font-weight:700;" : ""}color:${t.strong ? C.fg : C.muted};">${esc(t.label)}</td><td align="right" style="padding:3px 0;font-family:${FONT};font-size:${t.strong ? "16px" : "14px"};${t.strong ? "font-weight:700;" : ""}color:${C.fg};white-space:nowrap;">${esc(t.value)}</td></tr>`,
        )
        .join("")}</table>`
    : "";

  const photos = n.photos?.length
    ? `<div style="margin:24px 0 0;">${n.photos
        .map(
          (url) =>
            `<a href="${esc(url)}" style="display:inline-block;margin:0 8px 8px 0;"><img src="${esc(url)}" width="96" height="128" alt="" style="display:block;width:96px;height:128px;object-fit:cover;background:${C.surface};border:0;"></a>`,
        )
        .join("")}</div>`
    : "";

  const message = n.message
    ? `<div style="margin:24px 0 0;padding:16px 20px;background:${C.surface};font-family:${FONT};font-size:14px;line-height:1.6;color:${C.fg};">
  <div style="margin-bottom:6px;font-size:12px;letter-spacing:0.08em;text-transform:uppercase;color:${C.muted};">${esc(n.message.label)}</div>
  ${esc(n.message.text).replace(/\r?\n/g, "<br>")}
</div>`
    : "";

  const body = `
<div style="margin:0 0 8px;font-family:${FONT};font-size:12px;letter-spacing:0.1em;text-transform:uppercase;color:${C.highlight};">Сповіщення магазину</div>
${heading(n.heading)}
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">${rows}</table>
${items}
${totals}
${photos}
${message}
<div style="height:24px;line-height:24px;">&nbsp;</div>
${button(n.button.href, n.button.label)}`;

  const text = [
    n.heading,
    "",
    ...n.rows
      .filter((r) => r.value.trim() !== "")
      .map((r) => `${r.label}: ${r.value}`),
    ...(n.items?.length
      ? ["", ...n.items.map((i) => `${i.name} (${i.detail}) — ${i.price}`)]
      : []),
    ...(n.totals?.length
      ? ["", ...n.totals.map((t) => `${t.label}: ${t.value}`)]
      : []),
    ...(n.photos?.length ? ["", `Фото: ${n.photos.join(", ")}`] : []),
    ...(n.message ? ["", `${n.message.label}:`, n.message.text] : []),
    "",
    `${n.button.label}: ${n.button.href}`,
  ].join("\n");

  return {
    subject: n.subject,
    html: layout({
      preheader: n.preheader,
      body,
      siteUrl: n.siteUrl,
      internal: true,
    }),
    text,
  };
}
