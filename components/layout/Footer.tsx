import Link from "next/link";
import { NewsletterForm } from "./NewsletterForm";
import { InstagramIcon, TikTokIcon, TelegramIcon } from "./icons";

// TikTok is still a placeholder (href="#") until a real profile URL exists —
// swap it out, that's the only change needed.
const SOCIAL_LINKS = [
  {
    href: "https://www.instagram.com/bobretailer?stkn=Mm50MzhvNXhnbGpr",
    label: "Instagram",
    icon: InstagramIcon,
  },
  { href: "#", label: "TikTok", icon: TikTokIcon },
  {
    href: "https://t.me/frombobwithlove",
    label: "Telegram",
    icon: TelegramIcon,
  },
];

const INFO_LINKS = [
  { href: "/faq#payment-terms", label: "Умови оплати" },
  { href: "/faq#delivery", label: "Доставка" },
  { href: "/returns", label: "Умови повернення та обміну" },
  { href: "/about", label: "Про Боба" },
];

export function Footer() {
  return (
    <footer className="mt-auto bg-footer-bg text-footer-fg">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="mb-3 text-sm uppercase tracking-wide text-footer-fg/60">
              Розсилка
            </p>
            <NewsletterForm />
          </div>

          <div className="flex gap-4">
            {SOCIAL_LINKS.map(({ href, label, icon: Icon }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center border border-footer-fg/20 hover:border-highlight hover:text-highlight"
              >
                <Icon />
              </a>
            ))}
          </div>
        </div>

        <nav className="mt-10 flex flex-wrap gap-x-6 gap-y-3 border-t border-footer-fg/15 pt-6 text-sm uppercase tracking-wide">
          {INFO_LINKS.map(({ href, label }) => (
            <Link key={href} href={href} className="hover:text-highlight">
              {label}
            </Link>
          ))}
        </nav>

        <p className="mt-8 text-sm text-footer-fg/60">
          © {new Date().getFullYear()} BOB Retail
        </p>
      </div>
    </footer>
  );
}
