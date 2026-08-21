import Link from "next/link";
import { VideoLogo } from "./VideoLogo";
import { SearchToggle } from "./SearchToggle";
import { MobileMenu } from "./MobileMenu";
import { CartBadge } from "./CartBadge";
import { BagIcon } from "./icons";

// Fixed height (not content-driven) so it stays identical across
// breakpoints — the homepage hero syncs its own height to this exact value
// (see the comment in app/(storefront)/page.tsx). Change both together.
const HEADER_HEIGHT = "h-24"; // 96px

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-header-fg/10 bg-header-bg text-header-fg">
      <div
        className={`mx-auto grid ${HEADER_HEIGHT} max-w-6xl grid-cols-[1fr_auto_1fr] items-center gap-2 px-4 sm:gap-4 sm:px-6`}
      >
        <div className="flex items-center">
          <MobileMenu />
          <nav className="hidden items-center gap-6 text-sm uppercase tracking-wide md:flex">
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
        </div>

        <div className="justify-self-center">
          <VideoLogo />
        </div>

        <div className="flex items-center justify-end gap-3 sm:gap-5">
          <SearchToggle />
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
