"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

// While an order is still pending_payment, the webhook confirming a real
// Monobank payment may simply not have arrived yet by the time the customer's
// browser redirects back here. Re-running the server component picks up
// both a webhook that lands in the meantime and this page's own fallback
// status check (see app/(storefront)/order/[id]/page.tsx) — once the order
// actually flips to paid/failed, this component's parent tree changes and
// it stops re-rendering (and re-polling) on its own.
export function PendingPaymentAutoRefresh() {
  const router = useRouter();

  useEffect(() => {
    const interval = window.setInterval(() => router.refresh(), 4000);
    return () => window.clearInterval(interval);
  }, [router]);

  return null;
}
