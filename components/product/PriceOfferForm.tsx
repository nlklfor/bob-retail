"use client";

import { useState } from "react";
import { submitPriceOfferAction } from "@/lib/actions/price-offers";
import { formatPrice } from "@/lib/format";
import type { ProductWithVariants } from "@/lib/types";

const FIELD_CLASS =
  "w-full border-b border-border bg-transparent py-2 text-sm placeholder:text-muted focus:border-fg focus:outline-none";

// Same cap the DB constraints enforce server-side — kept as one constant
// so a future change to the limit only needs updating here + the
// migration's check constraints.
const MAX_DISCOUNT = 300;

export function PriceOfferForm({ product }: { product: ProductWithVariants }) {
  const [open, setOpen] = useState(false);
  const sizes = product.product_variants
    .filter((v) => v.is_active && v.size !== null)
    .map((v) => v.size as string);

  const minPrice = Math.max(0, product.price - MAX_DISCOUNT);
  // Starts at full price — the customer drags down toward a discount,
  // rather than opening the form already asking for the max cut.
  const [offeredPrice, setOfferedPrice] = useState(product.price);
  const [size, setSize] = useState(sizes[0] ?? "");
  const [customerName, setCustomerName] = useState("");
  const [customerSocial, setCustomerSocial] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const discount = product.price - offeredPrice;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    setError(null);

    const result = await submitPriceOfferAction({
      productId: product.id,
      size,
      originalPrice: product.price,
      offeredPrice,
      customerName,
      customerSocial,
      customerPhone,
      customerEmail,
    });

    if (!result.success) {
      setError(result.error);
      setSubmitting(false);
      return;
    }

    setDone(true);
    setSubmitting(false);
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="w-full border border-border py-3 text-sm uppercase tracking-wide hover:border-fg"
      >
        Запропонувати свою ціну
      </button>
    );
  }

  if (done) {
    return (
      <div className="border border-border px-4 py-4 text-sm">
        <p className="uppercase tracking-wide">Пропозицію надіслано</p>
        <p className="mt-1 text-muted">
          Якщо ваша ціна нас влаштує, ми напишемо вам на пошту, Telegram або
          Instagram із посиланням на оплату.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 border border-border px-4 py-4"
    >
      <div className="flex items-center justify-between">
        <p className="text-sm uppercase tracking-wide">Ваша пропозиція</p>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="text-sm text-muted hover:text-fg"
        >
          Скасувати
        </button>
      </div>

      <div>
        <div className="flex items-baseline justify-between text-sm">
          <span className="text-muted">Ціна</span>
          <span>
            <span className="text-lg text-highlight">
              {formatPrice(offeredPrice)}
            </span>{" "}
            грн
            {discount > 0 ? (
              <span className="text-muted">
                {" "}
                (−{formatPrice(discount)} грн)
              </span>
            ) : null}
          </span>
        </div>
        <input
          type="range"
          min={minPrice}
          max={product.price}
          step={10}
          value={offeredPrice}
          onChange={(e) => setOfferedPrice(Number(e.target.value))}
          className="mt-2 w-full accent-highlight"
          aria-label="Пропонована ціна"
        />
        <p className="mt-1 text-xs text-muted">
          Максимальна знижка — {MAX_DISCOUNT} грн (звичайна ціна{" "}
          {formatPrice(product.price)} грн).
        </p>
      </div>

      {sizes.length > 0 && (
        <div>
          <label className="text-sm uppercase tracking-wide text-muted">
            Розмір
          </label>
          <select
            value={size}
            onChange={(e) => setSize(e.target.value)}
            className={FIELD_CLASS}
          >
            {sizes.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      )}

      <input
        type="text"
        placeholder="Ім'я"
        required
        value={customerName}
        onChange={(e) => setCustomerName(e.target.value)}
        className={FIELD_CLASS}
      />
      <input
        type="text"
        placeholder="Telegram/Instagram"
        required
        value={customerSocial}
        onChange={(e) => setCustomerSocial(e.target.value)}
        className={FIELD_CLASS}
      />
      <input
        type="tel"
        placeholder="Телефон (необов'язково)"
        value={customerPhone}
        onChange={(e) => setCustomerPhone(e.target.value)}
        className={FIELD_CLASS}
      />
      <input
        type="email"
        placeholder="Email (необов'язково)"
        value={customerEmail}
        onChange={(e) => setCustomerEmail(e.target.value)}
        className={FIELD_CLASS}
      />

      {error ? <p className="text-sm text-danger">{error}</p> : null}

      <button
        type="submit"
        disabled={submitting || !customerName || !customerSocial}
        className="w-full bg-fg py-3 text-sm uppercase tracking-wide text-bg hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-30"
      >
        {submitting ? "Надсилаємо..." : "Надіслати пропозицію"}
      </button>
    </form>
  );
}
