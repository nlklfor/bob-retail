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
