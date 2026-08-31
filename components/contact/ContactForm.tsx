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

    const result = await sendContactMessageAction(
      new FormData(e.currentTarget),
    );
    if (!result.success) {
      setError(result.error);
      setStatus("idle");
      return;
    }

    setStatus("done");
    e.currentTarget.reset();
  }

  if (status === "done") {
    return (
      <p className="text-muted">
        Дякуємо! Ми зв&apos;яжемося з вами найближчим часом.
      </p>
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
