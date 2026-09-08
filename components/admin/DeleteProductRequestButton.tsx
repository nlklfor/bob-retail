"use client";

import { useState } from "react";
import { deleteProductRequestAction } from "@/lib/actions/admin-product-requests";

// stopPropagation everywhere: on the list this renders inside a row that's
// otherwise a <Link> to the detail page, same reasoning as DeleteOrderButton.
export function DeleteProductRequestButton({
  requestId,
}: {
  requestId: string;
}) {
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
            await deleteProductRequestAction(requestId);
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
