import type { StatusVariant } from "./order-status-labels";

export type ProductRequestStatus =
  "new" | "contacted" | "fulfilled" | "declined";

export const PRODUCT_REQUEST_STATUS_LABELS: Record<
  ProductRequestStatus,
  string
> = {
  new: "Нове",
  contacted: "Зв'язались",
  fulfilled: "Виконано",
  declined: "Відхилено",
};

export const PRODUCT_REQUEST_STATUS_VARIANT: Record<
  ProductRequestStatus,
  StatusVariant
> = {
  new: "pending",
  contacted: "pending",
  fulfilled: "success",
  declined: "danger",
};
