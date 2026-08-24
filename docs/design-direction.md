# BOB Retail — Design Direction

Living reference for the design/animation pass (deferred until the functional build is done — see project priorities). Update this file as new direction comes in; don't let it drift out of sync with what the client actually says.

## Core creative brief (from the original Creative Direction & UI Design prompt)

- Mood: dark / raw / editorial / underground / futuristic / confident / minimal but expressive.
- Explicitly avoid: rounded corners, glassmorphism, generic gradients, generic Tailwind/SaaS look, cookie-cutter product cards, stock photography.
- Sharp geometry, hard edges, asymmetric editorial layouts, oversized typography, full-bleed photography.
- Color: **white/black/grey base + one restrained third color** `#9184d9` (soft periwinkle, client-provided 2026-08-21) for interactive/highlight moments only — link hovers, focus rings, selected states (size picker, category filter, payment radio). This is actually closer to the _original_ brief's "one restrained accent used sparingly" than the pure-monochrome pass that preceded it — see Design tokens below for exactly where it's used and, just as importantly, where it deliberately isn't (prices/totals stay on the monochrome `--accent`, so there's one system for "emphasis" and one for "interactive," not two competing accent colors). Footer is the one deliberate dark exception — black band against the white site, mirroring how the header briefly was the exception the other way round before the whole site went light.
- Typography as a design element itself (scale, weight, tracking), not decoration via rounded UI chrome.
- Motion: fast/medium/slow tiered system, precise/physical/cinematic easing, never bouncy — every animation must earn its place.
- Final test: "what the f*** is this, this looks insane" in 3 seconds, "okay this is actually really easy to use" 10 seconds later — distinctive first impression without sacrificing usability.

## Client notes (added 2026-08-12)

Client-provided style words: **street style, underground, rap, clarity, graffiti**.

Reference site the client linked and likes: **https://snapthatback.com/**

### What that reference site actually looks like

Pulled via fetch, not assumed: predominantly white/neutral/black, minimal accent color (gold/yellow used only for prices), grid-based product tiles, mega-menu navigation organized by demographic/category, high-quality neutral-background product photography, restrained motion (simple carousels). Reads as "clean, premium sneaker retailer" — not visually underground or graffiti at all.

### Reading on this (flag for client confirmation if wrong)

The client's own word list pairs "underground/rap/graffiti" with "clarity" — read together, this isn't a contradiction: the reference site is likely liked for its **shopping UX clarity** (easy browsing, clean product grid, uncluttered navigation, confident product photography treatment), not its literal light color palette. The **brand mood** (dark, underground, graffiti-influenced, streetwear/rap culture) should still follow the original creative brief's dark/raw direction — it's the _layout discipline and usability_ of snapthatback.com worth borrowing, not its white background.

Concretely, this suggested at the time:

- Keep the dark near-black palette — **superseded 2026-08-21**, see below.
- Borrow from the reference site: confident, consistent product photography treatment; a clear, uncluttered grid for the catalog; unambiguous navigation — don't let "editorial/experimental" layout choices hurt the actual ease of finding and buying a product. Still holds.
- Graffiti/rap/underground culture cues belong in typography treatment, texture (film grain, subtle noise — already in the original brief), photography styling, and possibly hand-drawn/spray-paint-influenced display type accents — not in the base UI chrome (buttons, nav, forms), which should stay closer to "clear and usable" per the client's own "clarity" note. Still holds.

### Open question resolved (2026-08-21)

The question below was left open for the client to confirm. Answer: **the literal light palette**, not just the UX clarity — "make the style of the website white colors," explicit instruction. The whole site flipped from near-black-base to white-base (footer stays dark, as the one deliberate exception). The reasoning above about UX clarity vs. palette turned out to point the wrong way; corrected now, not worth relitigating.

## Design tokens already implemented (as of this build)

- Colors (white base, flipped 2026-08-21): `--bg #ffffff`, `--surface #f2f1ee`, `--border #e2e0da`, `--muted #6b6b6b`, `--fg #0a0a0a`, `--accent #000000` (monochrome — pure black for emphasis, not a color accent), `--danger #c4453d` (kept red — semantic/error color, exempt from the monochrome decision). Footer-only exception: `--footer-bg #0a0a0a`, `--footer-fg #ffffff`.
- `--highlight #9184d9` (added 2026-08-21) — the third color, used only for: header/footer nav link hover, footer social icon hover, catalog active-category filter, product page selected-size border/text, checkout's payment-method selected-radio dot, checkout's "Інші варіанти оплати" toggle link, and a sitewide `:focus-visible` outline (real accessibility value — every interactive element gets a visible keyboard-focus ring, not just a decorative flourish). Not used for prices/totals/order summary emphasis — those stay on the monochrome `--accent` so "this is highlighted/interactive" and "this is an emphasized amount" stay visually distinct concepts. Corners stay sharp everywhere the highlight color appears too — no rounding was introduced alongside it (the one exception, the payment radio dot, is a circle because that's the universal radio-button convention, not decorative rounding).
- Corners: effectively zero everywhere (`--radius-*` overridden to `0px`).
- Typography: **Fixel** (FixelDisplay for headlines, FixelText for body/UI), self-hosted via `next/font/local` from `app/fonts/fixel/`. Chosen specifically because it has full Ukrainian Cyrillic support, unlike the originally-discussed **Cabinet Grotesk + General Sans** (Fontshare) — that pairing is Latin-only and was never actually usable once the site went Ukrainian-only. Free, SIL Open Font License, source: https://fixel.macpaw.com/.
- The footer is now the one deliberate dark exception (`--footer-bg`/`--footer-fg`) — the header used to hold that role when the site was dark-based, but once the site went white the header just started matching the body and its own tokens became redundant (removed).

## Homepage (implemented 2026-08-20, updated 2026-08-21)

- **Header**: matches the site's white/black base (no longer its own contrast band). Rearranged 2026-08-21: logo left, nav (Каталог/Контакти/Питання) centered, search/cart icons right — on mobile, hamburger left, logo centered, icons right (both use the three-column grid trick for true centering regardless of the two side clusters' widths). Logo is a small looped video (`components/layout/VideoLogo.tsx`, client-supplied clip) rather than the font-cycle animation originally built — that font-cycle set is still loaded and used by the intro splash below. Header height is intentionally compact and fixed; the homepage hero's height is kept in sync with it via a hardcoded `calc()` (see Header note in that component/page — re-measure and update both if header sizing changes again).
- **Intro splash**: full-screen preview video (`public/video/bob-preview.mp4`, client-supplied, replaced the original font-cycle animation 2026-08-22 — that font-cycle set is still loaded and used by nothing else now, worth revisiting whether it's still needed anywhere), shown once per browser session on first homepage visit (`sessionStorage`). Hides itself on the video's real `onEnded` event rather than a guessed duration, with a 15s safety-timeout fallback in case that event doesn't fire. Skipped entirely for `prefers-reduced-motion` users and on repeat visits within the session.
- **Hero**: full-screen (fills the viewport exactly below the header, `h-[calc(100vh-Npx)]`), full-bleed, real background image (`public/images/bob-bg.png`, client-supplied) via `next/image` with `object-cover`. A "Прокрутіть вниз" bouncing scroll indicator sits at the bottom (Motion, respects reduced-motion, actually scrolls to the product grid on click), with a dark gradient behind it for legibility regardless of the image content underneath.
- **New arrivals**: "Новинки" heading, then a carousel (not a static grid — revised 2026-08-21) of all active products via `components/home/Carousel.tsx`, a headless Embla wrapper with nav buttons below the track (not overlaid on the sides). "Переглянути всі товари" button below links to `/catalog`. Note: with only 4 active products, the carousel's nav buttons are correctly disabled at desktop widths where everything already fits — that's not a bug, just an accurate reflection of a small catalog on a wide screen.
- **Feature images** (`components/home/FeatureImages.tsx`, admin-editable 2026-08-24): three full-screen (`h-screen`) banners between new arrivals and the category showcase, backed by a real `home_feature_images` table (3 fixed slots) rather than hardcoded placeholders. Staff edit each slot's image, caption, and linked product from **Admin → Головна** (`/admin/home-content`) — reuses the same Supabase Storage upload flow as product images. A slot with no product assigned yet stays non-clickable (not a dead link) with a quiet "Без посилання" hint on hover; a slot whose linked product is later deactivated silently stops linking too, since the public query joins through the products table's own RLS (`is_active = true`).
- **Category showcase** (replaced the Instagram placeholder section, 2026-08-22): same `Carousel` component, but real data — one tile per row in the `categories` table, linking to `/catalog?category=<slug>`. Chosen specifically because it needed zero new content or client input to be fully real (unlike the Instagram section, which was blocked on Meta Developer App access that doesn't exist). Categories have no image field in the schema, so tiles are typography-only (name + "Переглянути") rather than photo tiles.
- **Footer**: email subscription (real backend — `newsletter_subscribers` table + a Server Action, not a placeholder, since it was cheap to build for real), Instagram/TikTok/Telegram icon links (placeholder `href="#"` until real profile URLs exist), and info-page links (Умови оплати/Доставка/Повернення/Про нас → stub pages, same pattern as FAQ/Contacts).

## Checkout page (redesigned 2026-08-21)

Rebuilt against a reference screenshot (a "LINOGE" checkout page) the client shared: big display-font "КОШИК" title, two-column layout — contact/delivery/payment form on the left (underline-only inputs, no boxed borders), cart summary with product thumbnails and totals on the right. Real functionality kept as-is (Nova Poshta search, real shipping cost, the PayPal/Крипта placeholder toggle) — this was a visual/layout rebuild, not a functional one.

**Deliberate deviation from the reference**: the reference shows literal card-number/CVV input fields. Not replicated — real payment here happens via a Monobank-hosted redirect (once that integration lands), so collecting raw card numbers on our own page would pull us into PCI-DSS scope for no reason. That section instead shows "Оплата карткою (Monobank)" as the selected method.

**`/cart` removed** (2026-08-21) — since `/checkout` now shows the full cart contents itself, a separate cart-only page was just an extra click with no purpose. The header's cart icon now links straight to `/checkout`.

## Library choices

- **Motion** (formerly Framer Motion) — in use for the logo font-cycle, intro splash, and scroll indicator. Already the pick per the original creative brief's Performance section.
- **Embla Carousel** (`embla-carousel-react`) — chosen for the new-arrivals and Instagram carousels specifically because it's headless/unstyled (no default visual chrome to fight, unlike Swiper), lightweight, and widely used. `components/home/Carousel.tsx` wraps it once, reused by both sections.
- **Sonner** for toast notifications (add-to-cart feedback, etc.) — not yet implemented. Standard lightweight React toast library; its default rounded-card styling needs restyling to match the sharp-corner/dark palette rather than being used out of the box.

## Open questions for the client (not yet asked)

- Any specific graffiti/rap-culture reference imagery, artists, or existing brand assets (logo sketches, mood boards) beyond the one linked site?
