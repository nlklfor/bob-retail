"use client";

import { useState } from "react";
import { deleteOrderAction } from "@/lib/actions/admin-orders";

// stopPropagation everywhere: on the orders list this renders inside a row
// that's otherwise a <Link> to the order detail page, so a click here must
// never also trigger that navigation.
export function DeleteOrderButton({ orderId }: { orderId: string }) {
  const [confirming, setConfirming] = useState(false);
  const [deleting, setDeleting] = useState(false);

  if (confirming) {
    return (
      <span className="flex items-center gap-2 text-sm">
        <span className="text-muted">Видалити?</span>
        <button
          type="button"
          disabled={deleting}
          onClick={async (e) => {
            e.preventDefault();
            e.stopPropagation();
            setDeleting(true);
            await deleteOrderAction(orderId);
          }}
          className="text-danger hover:underline disabled:opacity-30"
        >
          {deleting ? "..." : "Так"}
        </button>
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setConfirming(false);
          }}
          className="text-muted hover:underline"
        >
          Скасувати
        </button>
      </span>
    );
  }

  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        setConfirming(true);
      }}
      className="text-sm text-muted hover:text-danger"
    >
      Видалити
    </button>
  );
}
