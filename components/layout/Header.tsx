import Link from "next/link";
import { AnimatedLogo } from "./AnimatedLogo";
import { SearchToggle } from "./SearchToggle";
import { CartBadge } from "./CartBadge";
import { WishlistBadge } from "./WishlistBadge";
import { HeartIcon, BagIcon } from "./icons";

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-header-fg/10 bg-header-bg text-header-fg">
      <div className="mx-auto grid max-w-6xl grid-cols-[1fr_auto_1fr] items-center gap-4 px-6 py-4">
        <nav className="flex items-center gap-6 text-sm uppercase tracking-wide">
          <Link href="/catalog" className="hover:opacity-60">
            Каталог
          </Link>
          <Link href="/contacts" className="hover:opacity-60">
            Контакти
          </Link>
          <Link href="/faq" className="hover:opacity-60">
            Питання
          </Link>
        </nav>

        <div className="justify-self-center">
          <AnimatedLogo />
        </div>

        <div className="flex items-center justify-end gap-5">
          <SearchToggle />
          <Link
            href="/wishlist"
            aria-label="Список бажань"
            className="relative flex h-9 w-9 items-center justify-center hover:opacity-60"
          >
            <HeartIcon />
            <WishlistBadge />
          </Link>
          <Link
            href="/cart"
            aria-label="Кошик"
            className="relative flex h-9 w-9 items-center justify-center hover:opacity-60"
          >
            <BagIcon />
            <CartBadge />
          </Link>
        </div>
      </div>
    </header>
  );
}
