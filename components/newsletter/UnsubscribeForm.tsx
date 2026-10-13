"use client";

import { useState } from "react";
import Link from "next/link";
import { unsubscribeAction } from "@/lib/actions/unsubscribe";

export function UnsubscribeForm({ token }: { token: string }) {
  const [pending, setPending] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleClick() {
    setPending(true);
    setError(null);
    const result = await unsubscribeAction(token);
    if (result.success) {
      setDone(true);
    } else {
      setError(result.error);
    }
    setPending(false);
  }

  if (done) {
    return (
      <div className="mt-6 space-y-4">
        <p className="leading-relaxed text-muted">
          Готово — ви більше не отримуватимете листів розсилки.
        </p>
        <Link href="/" className="text-sm text-highlight hover:underline">
          На головну
        </Link>
      </div>
    );
  }

  return (
    <div className="mt-6 space-y-4">
      <p className="leading-relaxed text-muted">
        Відписатися від розсилки BOB Retail? Листи щодо ваших замовлень
        приходитимуть як і раніше.
      </p>
      {error ? <p className="text-sm text-danger">{error}</p> : null}
      <button
        type="button"
        onClick={handleClick}
        disabled={pending}
        className="border border-fg px-6 py-3 text-sm uppercase tracking-wide hover:bg-fg hover:text-bg disabled:opacity-30"
      >
        {pending ? "..." : "Відписатися"}
      </button>
    </div>
  );
}
