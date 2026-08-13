import Link from "next/link";

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
