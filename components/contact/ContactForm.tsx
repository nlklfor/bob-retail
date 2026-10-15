"use client";

import { useState } from "react";
import { sendContactMessageAction } from "@/lib/actions/contact";

const FIELD_CLASS =
  "w-full border-b border-border bg-transparent py-2 text-sm placeholder:text-muted focus:border-fg focus:outline-none";

export function ContactForm() {
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
    const result = await sendContactMessageAction(new FormData(form));
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
      <div className="flex h-full flex-col justify-center py-12">
        <p className="font-display text-3xl uppercase tracking-tight">
          Дякуємо!
        </p>
        <p className="mt-3 leading-relaxed text-muted">
          Повідомлення надіслано. Ми зв&apos;яжемося з вами найближчим часом.
        </p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="mt-6 self-start text-sm text-highlight hover:underline"
        >
          Надіслати ще одне повідомлення
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-md space-y-5">
      <div>
        <label
          htmlFor="contact-name"
          className="text-sm uppercase tracking-wide text-muted"
        >
          Ім&apos;я
        </label>
        <input
          id="contact-name"
          name="name"
          required
          className={`mt-1 ${FIELD_CLASS}`}
        />
      </div>

      <div>
        <label
          htmlFor="contact-email"
          className="text-sm uppercase tracking-wide text-muted"
        >
          Email
        </label>
        <input
          id="contact-email"
          name="email"
          type="email"
          required
          className={`mt-1 ${FIELD_CLASS}`}
        />
      </div>

      <div>
        <label
          htmlFor="contact-social"
          className="text-sm uppercase tracking-wide text-muted"
        >
          Telegram або Instagram (необов&apos;язково)
        </label>
        <input
          id="contact-social"
          name="socialHandle"
          className={`mt-1 ${FIELD_CLASS}`}
        />
      </div>

      <div>
        <label
          htmlFor="contact-message"
          className="text-sm uppercase tracking-wide text-muted"
        >
          Повідомлення
        </label>
        <textarea
          id="contact-message"
          name="message"
          required
          rows={4}
          className={`mt-1 ${FIELD_CLASS} resize-none`}
        />
      </div>

      {error ? <p className="text-sm text-danger">{error}</p> : null}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="bg-fg px-6 py-3 text-sm uppercase tracking-wide text-bg hover:opacity-90 disabled:opacity-30"
      >
        {status === "submitting" ? "Надсилання..." : "Надіслати"}
      </button>
    </form>
  );
}
