"use client";

import Image from "next/image";
import Link from "next/link";
import { CloseIcon } from "@/components/layout/icons";
import type { CartItem } from "@/lib/cart-store";
import { formatPrice } from "@/lib/format";

// Shared between the checkout page's own cart summary and the header cart
// sidebar, so the row markup and delete-confirmation flow exist in one
// place — parent owns the "which item is confirming delete" state, since
// only one row should be in that state at a time.
export function CartItemRow({
  item,
  confirming,
  onRequestDelete,
  onConfirmDelete,
  onCancelDelete,
  onNavigate,
}: {
  item: CartItem;
  confirming: boolean;
  onRequestDelete: () => void;
  onConfirmDelete: () => void;
  onCancelDelete: () => void;
  onNavigate?: () => void;
}) {
  const image = item.image ? (
    <Image
      src={item.image}
      alt={item.name}
      fill
      sizes="80px"
      className="object-cover"
    />
  ) : null;

  return (
    <div className="flex gap-4 py-4">
      {item.slug ? (
        <Link
          href={`/products/${item.slug}`}
          onClick={onNavigate}
          className="relative h-24 w-20 flex-none bg-surface"
        >
          {image}
        </Link>
      ) : (
        <div className="relative h-24 w-20 flex-none bg-surface">{image}</div>
      )}
      <div className="flex flex-1 flex-col justify-between">
        <div className="flex justify-between gap-4">
          {item.slug ? (
            <Link
              href={`/products/${item.slug}`}
              onClick={onNavigate}
              className="text-sm hover:text-highlight"
            >
              {item.name}
            </Link>
          ) : (
            <p className="text-sm">{item.name}</p>
          )}
          <p className="flex-none text-sm">
            {formatPrice(item.price * item.quantity)} грн
          </p>
        </div>
        <div className="text-sm text-muted">
          {item.size ? <p>Розмір: {item.size}</p> : null}
          <p>Кількість: {item.quantity}</p>
        </div>

        {confirming ? (
          <div className="flex items-center gap-3 text-sm">
            <span className="text-muted">Видалити товар?</span>
            <button
              type="button"
              onClick={onConfirmDelete}
              className="text-danger hover:underline"
            >
              Так
            </button>
            <button
              type="button"
              onClick={onCancelDelete}
              className="text-muted hover:underline"
            >
              Скасувати
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={onRequestDelete}
            className="flex w-fit items-center gap-1 text-sm text-muted hover:text-danger"
          >
            <CloseIcon />
            Видалити
          </button>
        )}
      </div>
    </div>
  );
}
