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
- Typography: placeholder pairing **Space Grotesk + Public Sans** via `next/font/google` — stand-in for the originally-discussed **Cabinet Grotesk + General Sans** (Fontshare), which need self-hosting we haven't set up yet. Swappable later without touching component code.

## Library choices for the animation pass (not yet implemented)

- **Motion** (formerly Framer Motion) for animations — already the pick per the original creative brief's Performance section ("Framer Motion / Motion where justified"). No new dependency decision needed when we get there, just confirming.
- **Sonner** for toast notifications (add-to-cart, add-to-wishlist feedback, etc.) — standard lightweight React toast library, handles stacking/timing/accessibility so we don't reinvent it. Its default styling is the generic rounded-card toast look the creative brief explicitly avoids, so it needs restyling to match the sharp-corner/dark palette rather than being used out of the box.

## Open questions for the client (not yet asked)

- Confirm the "clarity" reading above — is snapthatback.com liked for its clean product/shopping UX, or literally its light color palette? These point to different amounts of change from what's already built.
- Any specific graffiti/rap-culture reference imagery, artists, or existing brand assets (logo sketches, mood boards) beyond the one linked site?
