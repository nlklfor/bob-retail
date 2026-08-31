import type { Metadata } from "next";

// checkout/page.tsx is a client component ("use client", for the whole
// multi-step form), and metadata exports only work in Server Components —
// this thin layout is the only place left to attach it.
export const metadata: Metadata = {
  title: "Кошик",
  description: "Оформлення замовлення BOB Retail.",
};

export default function CheckoutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
