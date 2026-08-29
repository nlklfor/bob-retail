import type { OrderStatus } from "./types";

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  pending_payment: "Очікує оплати",
  paid: "Оплачено",
  processing: "В обробці",
  shipped: "Відправлено",
  completed: "Виконано",
  cancelled: "Скасовано",
  payment_failed: "Помилка оплати",
};

export type StatusVariant = "success" | "danger" | "pending";

// succeed = green, fail = red, pending = yellow, applied to order status
// throughout the admin panel.
export const ORDER_STATUS_VARIANT: Record<OrderStatus, StatusVariant> = {
  pending_payment: "pending",
  paid: "success",
  processing: "pending",
  shipped: "success",
  completed: "success",
  cancelled: "danger",
  payment_failed: "danger",
};
