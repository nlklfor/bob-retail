import Link from "next/link";
import { CartBadge } from "./CartBadge";

export function Header() {
  return (
    <header className="border-b border-border sticky top-0 z-40 bg-bg">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link
          href="/"
          className="font-display text-xl font-bold tracking-tight"
        >
          BOB
        </Link>

        <nav className="flex items-center gap-6 text-sm uppercase tracking-wide">
          <Link href="/catalog" className="hover:text-accent">
            Каталог
          </Link>
          <Link href="/wishlist" className="hover:text-accent">
            Список бажань
          </Link>
          <Link href="/cart" className="hover:text-accent">
            Кошик <CartBadge />
          </Link>
        </nav>
      </div>
    </header>
  );
}
