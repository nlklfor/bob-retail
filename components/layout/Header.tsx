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

const NAV_LINKS = [
  { href: "/catalog", label: "Каталог" },
  { href: "/contacts", label: "Контакти" },
  { href: "/faq", label: "Питання" },
];

function IconCluster() {
  return (
    <div className="flex items-center justify-end gap-3 sm:gap-5">
      <SearchToggle />
      <Link
        href="/checkout"
        aria-label="Кошик"
        className="relative flex h-9 w-9 items-center justify-center hover:text-highlight"
      >
        <BagIcon />
        <CartBadge />
      </Link>
    </div>
  );
}

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-bg text-fg">
      {/* Mobile: hamburger left, logo centered, icons right — the
          conventional mobile e-commerce arrangement. Uses the same
          three-column grid trick as desktop (not flex) so the logo is
          truly centered regardless of how wide the hamburger vs. icon
          cluster are. */}
      <div
        className={`mx-auto grid ${HEADER_HEIGHT} max-w-6xl grid-cols-[1fr_auto_1fr] items-center gap-2 px-4 md:hidden`}
      >
        <div className="flex items-center">
          <MobileMenu />
        </div>
        <div className="justify-self-center">
          <VideoLogo />
        </div>
        <IconCluster />
      </div>

      {/* Desktop: logo left, nav centered, icons right. */}
      <div
        className={`mx-auto hidden ${HEADER_HEIGHT} max-w-6xl grid-cols-[1fr_auto_1fr] items-center gap-4 px-6 md:grid`}
      >
        <div>
          <VideoLogo />
        </div>
        <nav className="flex items-center gap-6 justify-self-center text-sm uppercase tracking-wide">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="hover:text-highlight"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <IconCluster />
      </div>
    </header>
  );
}
