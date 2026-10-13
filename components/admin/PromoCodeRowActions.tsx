"use client";

import { useState } from "react";
import {
  deletePromoCodeAction,
  setWelcomePromoCodeAction,
} from "@/lib/actions/admin-promo-codes";

export function PromoCodeRowActions({
  id,
  isWelcome,
}: {
  id: string;
  isWelcome: boolean;
}) {
  const [confirming, setConfirming] = useState(false);
  const [pending, setPending] = useState(false);

  async function run(action: () => Promise<void>) {
    setPending(true);
    await action();
    setPending(false);
    setConfirming(false);
  }

  if (confirming) {
    return (
      <span className="flex items-center gap-2 text-sm">
        <span className="text-muted">Видалити?</span>
        <button
          type="button"
          disabled={pending}
          onClick={() => run(() => deletePromoCodeAction(id))}
          className="text-danger hover:underline disabled:opacity-30"
        >
          {pending ? "..." : "Так"}
        </button>
        <button
          type="button"
          onClick={() => setConfirming(false)}
          className="text-muted hover:underline"
        >
          Скасувати
        </button>
      </span>
    );
  }

  return (
    <span className="flex items-center gap-4 text-sm">
      <button
        type="button"
        disabled={pending}
        onClick={() => run(() => setWelcomePromoCodeAction(id, !isWelcome))}
        className="text-muted hover:text-fg disabled:opacity-30"
      >
        {isWelcome ? "Прибрати з вітального" : "Зробити вітальним"}
      </button>
      <button
        type="button"
        onClick={() => setConfirming(true)}
        className="text-muted hover:text-danger"
      >
        Видалити
      </button>
    </span>
  );
}
