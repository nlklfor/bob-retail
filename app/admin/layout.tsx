import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  // A template here would only apply to a title a deeper admin page defines
  // itself, and none currently do — the root layout's own "%s · BOB Retail"
  // template already wraps this default, so a second one is redundant.
  title: "Адмін-панель",
  // Internal tool, not customer-facing — never index it.
  robots: { index: false, follow: false },
};

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <div className="border-b border-border px-6 py-3">
        <Link href="/" className="text-sm text-muted hover:text-fg">
          ← Back to site
        </Link>
      </div>
      <div className="flex-1">{children}</div>
    </div>
  );
}
