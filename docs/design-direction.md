# BOB Retail — Design Direction

Living reference and running log for the design/animation pass — no longer deferred, actively in progress (started 2026-08-20). Update this file as new direction comes in; don't let it drift out of sync with what the client actually says.

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

## Homepage (implemented 2026-08-20, most recently updated 2026-08-27)

- **Header**: matches the site's white/black base (no longer its own contrast band). Rearranged 2026-08-21: logo left, nav (Каталог/Контакти/Питання) centered, search/cart icons right — on mobile, hamburger left, logo centered, icons right (both use the three-column grid trick for true centering regardless of the two side clusters' widths). Logo is a small looped video (`components/layout/VideoLogo.tsx`, client-supplied clip) rather than the font-cycle animation originally built — that font-cycle set is still loaded and used by the intro splash below. Header height is intentionally compact and fixed; the homepage hero's height is kept in sync with it via a hardcoded `calc()` (see Header note in that component/page — re-measure and update both if header sizing changes again).
- **Intro splash**: full-screen preview video (`public/video/bob_preview.mp4`, client-supplied, replaced the original font-cycle animation 2026-08-22 — that font-cycle set is still loaded and used by nothing else now, worth revisiting whether it's still needed anywhere), shown once per browser session on first homepage visit (`sessionStorage`). Background is pure black `#000000` (changed 2026-08-27 from an earlier `#0C0D14` that had a slight purple/navy tint — client wanted black with no purple). Hides itself on the video's real `onEnded` event rather than a guessed duration, with a 15s safety-timeout fallback in case that event doesn't fire. Skipped entirely for `prefers-reduced-motion` users and on repeat visits within the session — **but only in a real production build**: `useReducedMotion()` from Motion doesn't respond to `MotionConfig`'s override (a real library limitation), so `lib/useReducedMotionAware.ts` only honors the reduced-motion setting when `NODE_ENV === "production"`, letting local dev testing see the animation regardless of the developer's own OS accessibility setting.
- **Hero**: full-screen (fills the viewport exactly below the header, `h-[calc(100vh-Npx)]`), full-bleed, real background image (`public/images/frombobwithlove.png`, client-supplied) via `next/image` with `object-cover`. A "Прокрутіть вниз" bouncing scroll indicator sits at the bottom (Motion, respects reduced-motion, actually scrolls to the product grid on click), with a dark gradient behind it for legibility regardless of the image content underneath.
- **New arrivals**: "Новинки" heading, then a carousel (not a static grid — revised 2026-08-21) of all active products via `components/home/Carousel.tsx`, a headless Embla wrapper with nav buttons below the track (not overlaid on the sides). "Переглянути всі товари" button below links to `/catalog`. Note: with only 4 active products, the carousel's nav buttons are correctly disabled at desktop widths where everything already fits — that's not a bug, just an accurate reflection of a small catalog on a wide screen.
- **Feature images** (`components/home/FeatureImages.tsx`, admin-editable 2026-08-24): three full-screen (`h-screen`) banners between new arrivals and the category showcase, backed by a real `home_feature_images` table (3 fixed slots) rather than hardcoded placeholders. Staff edit each slot's image, caption, and linked product from **Admin → Головна** (`/admin/home-content`) — reuses the same Supabase Storage upload flow as product images. A slot with no product assigned yet stays non-clickable (not a dead link) with a quiet "Без посилання" hint on hover; a slot whose linked product is later deactivated silently stops linking too, since the public query joins through the products table's own RLS (`is_active = true`).
- **Category showcase** (replaced the Instagram placeholder section, 2026-08-22): same `Carousel` component, but real data — one tile per row in the `categories` table, linking to `/catalog?category=<slug>`. Chosen specifically because it needed zero new content or client input to be fully real (unlike the Instagram section, which was blocked on Meta Developer App access that doesn't exist). Categories have no image field in the schema, so tiles are typography-only (name + "Переглянути") rather than photo tiles.
- **Footer**: email subscription (real backend — `newsletter_subscribers` table + a Server Action, not a placeholder, since it was cheap to build for real), Instagram/TikTok/Telegram icon links (placeholder `href="#"` until real profile URLs exist), and info-page links (Умови оплати/Доставка/Повернення/Про нас → stub pages, same pattern as FAQ/Contacts).

## Checkout page (redesigned 2026-08-21)

Rebuilt against a reference screenshot (a "LINOGE" checkout page) the client shared: big display-font "КОШИК" title, two-column layout — contact/delivery/payment form on the left (underline-only inputs, no boxed borders), cart summary with product thumbnails and totals on the right. Real functionality kept as-is (Nova Poshta search, real shipping cost, the PayPal/Крипта placeholder toggle) — this was a visual/layout rebuild, not a functional one.

**Deliberate deviation from the reference**: the reference shows literal card-number/CVV input fields. Not replicated — real payment here happens via a Monobank-hosted redirect (once that integration lands), so collecting raw card numbers on our own page would pull us into PCI-DSS scope for no reason. That section instead shows "Оплата карткою (Monobank)" as the selected method.

**`/cart` removed** (2026-08-21) — since `/checkout` now shows the full cart contents itself, a separate cart-only page was just an extra click with no purpose. The header's cart icon now links straight to `/checkout`.

**Cart items are now interactive** (2026-08-27): each row's image/name link to `/products/[slug]` (cart items needed a `slug` added to their stored shape to make that possible — older, already-persisted carts without one just render as plain non-clickable text instead of a broken link). Removing an item requires an inline "Видалити товар? Так / Скасувати" confirmation rather than deleting on the first click or using the browser's native `confirm()`, which would look out of place next to the rest of the site's custom UI.

## Product page (redesigned 2026-08-25)

Rebuilt against a client-supplied reference screenshot (a snapthatback.com-style product page): image carousel (reusing the homepage's `Carousel` component, one full-bleed image per slide, not a thumbnail strip), SKU shown under the title, a solid black "Додати в кошик →" CTA matching checkout's button style, and a collapsible three-section accordion (`components/product/Accordion.tsx`) — Чому нам довіряють / Опис товару / Доставка та повернення — all three open by default, matching the reference. A "Ще товари" carousel of other active products sits at the bottom of the page.

Deliberately **not** copied from the reference: the BNPL "3 payments" installment line (not a real payment option here) and the "message us, we can source a different size from the US/Europe" contact box — the fulfillment story behind that box turned out to be real for BOB Retail too (see the trust/delivery accordion copy below), but building an actual contact-for-custom-order flow is a distinct feature that hasn't been asked for yet.

Trust/delivery accordion copy uses real client-provided numbers, not invented policy: in-stock items ship in 1-2 days, out-of-stock ("order from abroad") items take 10-14 days, returns within 14 days.

**Quick-add from product cards** (2026-08-27): hovering (or keyboard-focusing, via `focus-within` — not mouse-only) any `ProductCard` anywhere it renders (catalog grid, homepage carousel, "Ще товари") crossfades the tile from its first image to its second (if it has one) and reveals a compact overlay — size chips + a black add-to-cart button — so a purchase doesn't require opening the product page first. The overlay's interactive elements sit outside the card's `<Link>` (as a sibling, not nested inside the anchor), both because nested interactive content inside an `<a>` is invalid HTML and because it avoids any click-vs-navigate conflict.

## Header search (2026-08-27)

The header's search icon opens a live dropdown, not a plain input — typing debounces 250ms then queries products by name **and SKU** via a Server Action (`lib/actions/search.ts`), showing up to 6 results (thumbnail, name, price) with an "Усі результати →" link through to the full `/catalog?q=` results page. Stale/out-of-order responses are guarded against with a request-id ref. `/catalog?q=` itself also matches SKU, not just name.

## Contact page (2026-08-27)

Rebuilt against another client-supplied reference (a "Contact me" studio-site screenshot): a big "Зв'яжіться з нами" hero (bigger than any other type on the site, `text-6xl` → `text-8xl`), a two-column layout — left side holds the client's own 3D logo asset (`public/images/contact_3d.png`, no styled box around it, just the image), right side is a real contact form (name/email/optional Telegram-or-Instagram handle/message) backed by a `contact_messages` table + Server Action, not a placeholder mailto: link. A bottom bar shows the real business email and phone number as oversized display-font links (`mailto:`/`tel:`).

## Library choices

- **Motion** (formerly Framer Motion) — in use for the logo font-cycle, intro splash, and scroll indicator. Already the pick per the original creative brief's Performance section.
- **Embla Carousel** (`embla-carousel-react`) — chosen specifically because it's headless/unstyled (no default visual chrome to fight, unlike Swiper), lightweight, and widely used. `components/home/Carousel.tsx` wraps it once, reused by new arrivals, category showcase, and the product page's own image gallery and "Ще товари" section.
- **Sonner** for toast notifications (add-to-cart feedback, etc.) — not yet implemented. Standard lightweight React toast library; its default rounded-card styling needs restyling to match the sharp-corner/dark palette rather than being used out of the box.

## Open questions for the client (not yet asked)

- Any specific graffiti/rap-culture reference imagery, artists, or existing brand assets (logo sketches, mood boards) beyond the one linked site?
