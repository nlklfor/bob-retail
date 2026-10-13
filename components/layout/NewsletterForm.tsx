"use client";

import { useState } from "react";
import { subscribeAction } from "@/lib/actions/newsletter";

// Colors here are footer-specific (footer-fg, not the site-wide fg) since
// this only ever renders inside the dark footer band, not the light body.
export function NewsletterForm() {
  const [status, setStatus] = useState<"idle" | "submitting" | "done">("idle");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "submitting") return;
    setStatus("submitting");
    setError(null);

    // Captured up front — React nulls e.currentTarget once the handler
    // awaits, so reading it after the action call would throw.
    const form = e.currentTarget;
    const result = await subscribeAction(new FormData(form));
    if (!result.success) {
      setError(result.error);
      setStatus("idle");
      return;
    }

    form.reset();
    setStatus("done");
  }

  if (status === "done") {
    return (
      <p className="text-sm text-footer-fg">
        Дякуємо за підписку! Перевірте пошту — там ваш промокод.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-sm space-y-2">
      <div className="flex gap-2">
        <label htmlFor="newsletter-email" className="sr-only">
          Ваш email
        </label>
        <input
          id="newsletter-email"
          name="email"
          type="email"
          required
          placeholder="Ваш email"
          className="w-full min-w-0 border border-footer-fg/30 bg-transparent px-3 py-2 text-sm text-footer-fg placeholder:text-footer-fg/40"
        />
        <button
          type="submit"
          disabled={status === "submitting"}
          className="shrink-0 border border-footer-fg px-4 py-2 text-sm uppercase tracking-wide hover:bg-footer-fg hover:text-footer-bg disabled:opacity-30"
        >
          {status === "submitting" ? "..." : "Підписатись"}
        </button>
      </div>
      {error ? <p className="text-sm text-danger">{error}</p> : null}
    </form>
  );
}
