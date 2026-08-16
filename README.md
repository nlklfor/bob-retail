<div align="center">

# BOB Retail

**A dark, editorial streetwear storefront — built server-first, secured by default.**

![Next.js](https://img.shields.io/badge/Next.js_16-000000?style=for-the-badge&logo=next.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3FCF8E?style=for-the-badge&logo=supabase&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS_v4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![Bun](https://img.shields.io/badge/Bun-000000?style=for-the-badge&logo=bun&logoColor=white)

</div>

---

## Overview

BOB Retail is a guest-only e-commerce storefront for a streetwear client — no accounts, no friction: browse, add to cart or wishlist, check out as a guest. Built on Next.js 16's App Router with a Postgres/Supabase backend, it's designed around one non-negotiable: **the server never trusts the client.** Prices, stock, and availability are always re-verified in the database at the moment of purchase, not taken from whatever the browser sends.

Visual direction is dark, raw, and editorial — near-black palette, a single restrained acid-green accent, zero rounded corners — with a full design/animation pass intentionally deferred until the functional build is airtight. See [`docs/design-direction.md`](docs/design-direction.md) for the creative brief.

## Highlights

- **Race-condition-proof checkout.** Placing an order runs through a single Postgres function (`place_order`, `SECURITY DEFINER`) that row-locks each variant, re-validates real price and stock server-side, and writes the order atomically — so two customers can't both "win" the last pair in stock.
- **Defense-in-depth admin auth.** Every protected layout, page, _and_ Server Action independently re-checks the staff session — not just the outer layout — matching Next.js's own guidance that layout-only checks aren't reliable across client-side navigation.
- **RLS everywhere.** Row Level Security is enabled on every table. Guests can read the public catalog; `orders`, `order_items`, and `payments` have zero anonymous policies — the only door in is the locked-down `place_order()` function.
- **Server-only secrets.** Supabase keys never reach the browser (no `NEXT_PUBLIC_*` vars). Both client factories are guarded by the `server-only` package, so importing either into a Client Component fails at build time, not at runtime.

## Tech stack

| Layer                     | Choice                                                     |
| ------------------------- | ---------------------------------------------------------- |
| Framework                 | Next.js 16 (App Router, Server Actions, Server Components) |
| Language                  | TypeScript                                                 |
| Styling                   | Tailwind CSS v4 (`@theme` design tokens)                   |
| Database                  | Supabase (Postgres), Row Level Security throughout         |
| Auth                      | Supabase Auth (staff-only, no public signup)               |
| Client state              | Zustand (`persist` → localStorage) for guest cart/wishlist |
| Validation                | Zod                                                        |
| Runtime / package manager | Bun                                                        |

## Feature status

| Area                                                             | Status                                                    |
| ---------------------------------------------------------------- | --------------------------------------------------------- |
| Storefront (catalog, product pages, cart, wishlist, checkout)    | ✅ Built                                                  |
| Admin panel (products, variants, image upload, order management) | ✅ Built                                                  |
| Atomic, stock-safe checkout (`place_order()`)                    | ✅ Built                                                  |
| Nova Poshta branch search & real shipping cost                   | ✅ Built — live city/branch search + dynamic cost quote   |
| Monobank payment integration                                     | ⏳ Blocked — waiting on client's business Acquiring token |
| Fiscal receipts (РРО/ПРРО)                                       | ⏳ Planned — pending client's accountant/provider choice  |
| Design & motion pass                                             | ⏳ Deferred — functional build first                      |

Full detail on every item — what's real, what's a placeholder, and exactly what unblocks each one — lives in [`docs/project-status.md`](docs/project-status.md), which is the actual source of truth for this project and is kept current as things change.

## Getting started

```bash
git clone https://github.com/nlklfor/bob-retail.git
cd bob-retail
bun install
```

Create `.env.local` in the project root (see [`.env.example`](.env.example) for the exact variable names — never put real values in `.env.example` itself, it's committed to git):

```
SUPABASE_URL=                  # Supabase dashboard → Project Settings → API
SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NOVA_POST_API_KEY=             # personal key from my.novaposhta.ua
NOVA_POST_SENDER_CITY_NAME=    # Cyrillic city name orders ship from, e.g. Київ
```

```bash
bun run dev
```

- Storefront: `http://localhost:3000`
- Admin panel: `http://localhost:3000/admin/login`

## Scripts

| Command         | What it does                     |
| --------------- | -------------------------------- |
| `bun run dev`   | Start the dev server (Turbopack) |
| `bun run build` | Production build                 |
| `bun run start` | Run a production build           |
| `bun run lint`  | Lint the codebase                |

## Project structure

```
app/
  (storefront)/     storefront routes — home, catalog, product, cart, wishlist, checkout
  admin/             staff-only routes — login outside the auth group, everything else inside (protected)/
lib/
  actions/           Server Actions (checkout, admin auth, product/order mutations)
  admin/             admin data-access layer + staff-session guard
  supabase/          server-only Supabase client factories (public / admin)
components/          UI components, split by storefront/admin/product/layout
supabase/migrations/ incremental, timestamped SQL migrations (schema + place_order())
docs/                project-status.md (living source of truth) + design-direction.md (creative brief)
```

## Documentation

- [`docs/project-status.md`](docs/project-status.md) — architecture, what's built vs. stubbed, what's blocked and on whom, business context. Read this first if you're picking the project back up.
- [`docs/design-direction.md`](docs/design-direction.md) — creative brief, client style notes, design tokens, open questions.

---

<div align="center">
<sub>Private client project. Not open source.</sub>
</div>
