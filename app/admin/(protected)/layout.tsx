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
        <nav className="flex flex-wrap gap-x-6 gap-y-2 text-sm uppercase tracking-wide">
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
          <Link href="/admin/product-requests" className="hover:text-accent">
            Запити
          </Link>
          <Link href="/admin/price-offers" className="hover:text-accent">
            Торг
          </Link>
          <Link href="/admin/promo-codes" className="hover:text-accent">
            Промокоди
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
