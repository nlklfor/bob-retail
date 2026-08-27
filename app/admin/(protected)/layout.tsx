import Link from "next/link";
import { requireStaffSession } from "@/lib/admin/dal";
import { signOutAction } from "@/lib/actions/admin-auth";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireStaffSession();

  return (
    <div className="mx-auto max-w-6xl px-6 py-8">
      <div className="flex items-center justify-between border-b border-border pb-4">
        <nav className="flex gap-6 text-sm uppercase tracking-wide">
          <Link href="/admin" className="hover:text-accent">
            Панель керування
          </Link>
          <Link href="/admin/products" className="hover:text-accent">
            Товари
          </Link>
          <Link href="/admin/orders" className="hover:text-accent">
            Замовлення
          </Link>
          <Link href="/admin/home-content" className="hover:text-accent">
            Головна
          </Link>
          <Link href="/admin/categories" className="hover:text-accent">
            Категорії
          </Link>
        </nav>
        <form action={signOutAction}>
          <button type="submit" className="text-sm text-muted hover:text-fg">
            Вийти
          </button>
        </form>
      </div>
      <div className="mt-8">{children}</div>
    </div>
  );
}
