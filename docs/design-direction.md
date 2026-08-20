# BOB Retail — Design Direction

Living reference for the design/animation pass (deferred until the functional build is done — see project priorities). Update this file as new direction comes in; don't let it drift out of sync with what the client actually says.

## Core creative brief (from the original Creative Direction & UI Design prompt)

- Mood: dark / raw / editorial / underground / futuristic / confident / minimal but expressive.
- Explicitly avoid: rounded corners, glassmorphism, generic gradients, generic Tailwind/SaaS look, cookie-cutter product cards, stock photography.
- Sharp geometry, hard edges, asymmetric editorial layouts, oversized typography, full-bleed photography.
- Color: near-black/graphite/charcoal base, one restrained accent used sparingly (we chose a desaturated acid green — see decisions below).
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

Concretely, this suggests:

- Keep the dark near-black palette + acid-green accent already implemented in `app/globals.css`.
- Borrow from the reference site: confident, consistent product photography treatment; a clear, uncluttered grid for the catalog; unambiguous navigation — don't let "editorial/experimental" layout choices hurt the actual ease of finding and buying a product.
- Graffiti/rap/underground culture cues belong in typography treatment, texture (film grain, subtle noise — already in the original brief), photography styling, and possibly hand-drawn/spray-paint-influenced display type accents — not in the base UI chrome (buttons, nav, forms), which should stay closer to "clear and usable" per the client's own "clarity" note.

## Design tokens already implemented (as of this build)

- Colors: `--bg #0a0a0a`, `--surface #161616`, `--border #2b2b2b`, `--muted #8a8a8a`, `--fg #edebe6`, `--accent #a6c93a` (desaturated acid green), `--danger #c4453d`.
- Corners: effectively zero everywhere (`--radius-*` overridden to `0px`).
- Typography: **Fixel** (FixelDisplay for headlines, FixelText for body/UI), self-hosted via `next/font/local` from `app/fonts/fixel/`. Chosen specifically because it has full Ukrainian Cyrillic support, unlike the originally-discussed **Cabinet Grotesk + General Sans** (Fontshare) — that pairing is Latin-only and was never actually usable once the site went Ukrainian-only. Free, SIL Open Font License, source: https://fixel.macpaw.com/.
- Header is a deliberate white/black exception to the dark base palette (`--header-bg`/`--header-fg`) — a contrast band, not a site-wide palette shift. Rest of the site stays on `--bg`/`--fg`.

## Homepage (implemented 2026-08-20)

- **Header**: white/black band, three-column layout — Каталог/Контакти/Питання left, animated wordmark centered, search/wishlist/cart icons right. Logo cycles through 7 unrelated display fonts (Anton, Permanent Marker, Bebas Neue, Archivo Black, Monoton, Righteous, Bungee) continuously, landing conceptually on Fixel Display each pass. Respects `prefers-reduced-motion`.
- **Intro splash**: full-screen version of the same font-cycle, shown once per browser session on first homepage visit (`sessionStorage`), ~5s, then fades out. Skipped entirely for `prefers-reduced-motion` users and on repeat visits within the session.
- **Hero**: widescreen band (`aspect-[21/9]`) directly under the header, full-bleed — currently a placeholder ("Місце для банера") sized and positioned for the real logo/brand image once that asset exists.
- **Product grid**: single clean grid below the hero (not multiple curated carousel sections like snapthatback's New/Sale rows — that would need a "featured" flag and a real sale system that don't exist yet), dark theme, reusing the existing `ProductCard`.

## Library choices for the animation pass

- **Motion** (formerly Framer Motion) — in use for the logo font-cycle and intro splash. Already the pick per the original creative brief's Performance section.
- **Sonner** for toast notifications (add-to-cart, add-to-wishlist feedback, etc.) — not yet implemented. Standard lightweight React toast library; its default rounded-card styling needs restyling to match the sharp-corner/dark palette rather than being used out of the box.

## Open questions for the client (not yet asked)

- Confirm the "clarity" reading above — is snapthatback.com liked for its clean product/shopping UX, or literally its light color palette? These point to different amounts of change from what's already built.
- Any specific graffiti/rap-culture reference imagery, artists, or existing brand assets (logo sketches, mood boards) beyond the one linked site?
