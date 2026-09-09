import type { StatusVariant } from "./order-status-labels";

export type PriceOfferStatus = "new" | "accepted" | "declined";

export const PRICE_OFFER_STATUS_LABELS: Record<PriceOfferStatus, string> = {
  new: "Нова",
  accepted: "Прийнято",
  declined: "Відхилено",
};

export const PRICE_OFFER_STATUS_VARIANT: Record<
  PriceOfferStatus,
  StatusVariant
> = {
  new: "pending",
  accepted: "success",
  declined: "danger",
};
