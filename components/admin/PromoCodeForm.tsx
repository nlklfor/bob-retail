"use client";

import { useRef, useState } from "react";
import { createPromoCodeAction } from "@/lib/actions/admin-promo-codes";
import { useToastStore } from "@/lib/toast-store";

const FIELD_CLASS =
  "w-full border-b border-border bg-transparent py-2 text-sm placeholder:text-muted focus:border-fg focus:outline-none";

export function PromoCodeForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [kind, setKind] = useState<"free_shipping" | "fixed_amount">(
    "free_shipping",
  );
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const showToast = useToastStore((state) => state.show);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    setError(null);

    const result = await createPromoCodeAction(new FormData(e.currentTarget));
    if (result.success) {
      formRef.current?.reset();
      setKind("free_shipping");
      showToast("Промокод створено");
    } else {
      setError(result.error);
    }
    setSubmitting(false);
  }

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      className="grid gap-4 border border-border p-5 sm:grid-cols-2"
    >
      <input
        name="code"
        required
        placeholder="Код, напр. BOBFREE"
        className={`${FIELD_CLASS} uppercase placeholder:normal-case`}
      />
      <select
        name="kind"
        value={kind}
        onChange={(e) =>
          setKind(e.target.value as "free_shipping" | "fixed_amount")
        }
        className={FIELD_CLASS}
      >
        <option value="free_shipping">Безкоштовна доставка</option>
        <option value="fixed_amount">Знижка в гривнях</option>
      </select>
      {kind === "fixed_amount" ? (
        <input
          name="amount"
          type="number"
          min="1"
          step="1"
          required
          placeholder="Сума знижки, грн (напр. 200)"
          className={FIELD_CLASS}
        />
      ) : null}
      <input
        name="minOrderAmount"
        type="number"
        min="1"
        step="1"
        placeholder="Мін. сума замовлення, грн (необов'язково)"
        className={FIELD_CLASS}
      />
      <input
        name="usageLimit"
        type="number"
        min="1"
        step="1"
        placeholder="Ліміт використань (необов'язково)"
        className={FIELD_CLASS}
      />
      <label className="flex items-center gap-2 text-sm sm:col-span-2">
        <input type="checkbox" name="isWelcome" />
        Надсилати новим підписникам розсилки (вітальний промокод)
      </label>

      {error ? (
        <p className="text-sm text-danger sm:col-span-2">{error}</p>
      ) : null}

      <button
        type="submit"
        disabled={submitting}
        className="bg-fg py-3 text-sm uppercase tracking-wide text-bg hover:opacity-90 disabled:opacity-30 sm:col-span-2"
      >
        {submitting ? "Створення..." : "Створити промокод"}
      </button>
    </form>
  );
}
