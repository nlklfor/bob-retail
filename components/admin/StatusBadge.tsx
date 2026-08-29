import type { ReactNode } from "react";
import type { StatusVariant } from "@/lib/order-status-labels";

const VARIANT_CLASSES: Record<StatusVariant, string> = {
  success: "border-success text-success",
  danger: "border-danger text-danger",
  pending: "border-pending text-pending",
};

export function StatusBadge({
  variant,
  children,
}: {
  variant: StatusVariant;
  children: ReactNode;
}) {
  return (
    <span
      className={`inline-block border px-2 py-1 text-xs uppercase tracking-wide ${VARIANT_CLASSES[variant]}`}
    >
      {children}
    </span>
  );
}
