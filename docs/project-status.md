# BOB Retail — Project Status & Continuity Notes

Single source of truth if you're picking this project back up cold (new machine, new Claude session, whatever). Keep this updated as things change — it decays fast otherwise.

## What this is

BOB Retail: a streetwear e-commerce site, built for a client (not the developer's own business). Guest-only — no customer accounts, guest cart/wishlist/checkout. Stack: Next.js 16 (App Router) + React + TypeScript + Tailwind CSS + Bun + Supabase (Postgres).

## Recovering after a fresh machine / Windows reset

Your code is safe — everything is pushed to `https://github.com/nlklfor/bob-retail.git`. What's **not** in git (by design — never commit secrets):

1. Clone the repo, `bun install`.
2. Recreate `.env.local` — see `.env.example` in the repo root for the exact variable names (`SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `NOVA_POST_API_KEY`). Get the Supabase values from the Supabase dashboard → this project ("bob-retail", ref `aqtxsnacasvlqaagqaoq`) → Project Settings → API — you still own that account, so these are always recoverable there even if lost locally. Get the Nova Poshta key from your account at `my.novaposhta.ua`. **Never put real values in `.env.example`** — that file is committed to git (deliberately, as a template); only `.env.local` is gitignored.
3. `bun run dev`.
4. Admin panel: `/admin/login`, staff email `myhub245@gmail.com`. If the password's forgotten, reset it via Supabase Dashboard → Authentication → Users (don't need me for that) — deliberately not writing the actual password anywhere in this repo, since a committed file becomes a permanent secret in git history.

## Architecture snapshot

- **Supabase access is server-only**, never exposed to the browser (no `NEXT_PUBLIC_*` keys). `createPublicClient()` (anon key, RLS-respecting) for storefront reads; `createAdminClient()` (service role, bypasses RLS) for admin/checkout writes. Both guarded by the `server-only` package — importing either into a Client Component is a build-time error.
- **Schema**: `categories`, `products` (price + `images[]` live here, not on variants), `product_variants` (just `size` + `stock_quantity` — one row per size, real independent stock per size), `orders` / `order_items` / `payments`. RLS on everything; `orders`/`order_items`/`payments` have **zero** anon policies — guests never touch them directly.
- **Checkout correctness**: `place_order()` is a Postgres function (`security definer`, granted only to `service_role`) that locks each variant row (`FOR UPDATE`), re-validates real price/stock from the database (never trusts client input), decrements stock, and writes the order — all in one transaction. This is the actual fix for the "two customers buy the last pair at once" race condition, not just a description of it.
- **Admin auth**: Supabase Auth, no public signup anywhere — any account that exists was created manually, so "has a valid session" already means "is staff." `requireStaffSession()` (a DAL function) is checked both in the protected layout and independently in every admin page/Server Action, per Next.js's own guidance that layout-only checks aren't reliable across client-side navigation.
- **Cart/wishlist**: Zustand stores with `persist` (localStorage), guest-only, client-side — matches the no-accounts requirement.
- **Routing**: `app/(storefront)/` (Header/Footer layout) vs `app/admin/` (`login/` outside the protected group to avoid a redirect loop, `(protected)/` wraps the actual staff pages). Route groups `()` don't affect URLs; `[param]` folders are real dynamic route segments.
- **Types**: plain hand-written flat interfaces in `lib/types.ts`, not the full Supabase-generated `Database`/`Row`/`Insert`/`Update` generics — deliberate readability trade-off for a small single-developer project. Documented as a reasonable future upgrade, not a permanent ceiling.

## Database schema

All tables live in `public`, RLS enabled everywhere, migrations are incremental and timestamped in `supabase/migrations/`.

| Table              | Purpose                                                                                                                        | Anon access                                   |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------- |
| `categories`       | Catalog categories                                                                                                             | Read (public)                                 |
| `products`         | Product name/slug/description/price/`images[]`/`is_active` — price lives here, not on variants                                 | Read, only where `is_active = true`           |
| `product_variants` | One row per size (`size`, `stock_quantity`, `is_active`) — the only variant dimension is size, colorways are separate products | Read, only active variants of active products |
| `orders`           | Guest order header: customer contact info, shipping city/branch, status, subtotal/shipping/total                               | **None** — only reachable via `place_order()` |
| `order_items`      | Line-item snapshot at time of purchase (name/size/price frozen even if the product changes later)                              | **None**                                      |
| `payments`         | Payment record per order (`provider`, `status`, `amount`, `external_reference`) — currently always `provider = 'stub'`         | **None**                                      |

`place_order(p_items, p_customer_name, p_customer_phone, p_customer_email, p_shipping_city, p_shipping_branch, p_shipping_cost)` is the only way an order gets created. It's `SECURITY DEFINER`, revoked from `public`, granted only to `service_role` — so even a leaked anon key can't call it directly. Inside one transaction it: locks each `product_variants` row (`FOR UPDATE`), rejects inactive/out-of-stock/nonexistent variants, computes real totals from the database (never from the client), decrements stock, and inserts the order + order_items + a pending payment row.

## Tooling & conventions

- **Package manager**: Bun (`bun install`, `bun run dev`).
- **Linting/formatting**: ESLint (`eslint.config.mjs`, `eslint-config-next`) + Prettier, wired to run automatically pre-commit via `simple-git-hooks` + `lint-staged` (see `package.json`) — staged `.ts`/`.tsx` files get `eslint --fix` + `prettier --write`, staged `.json`/`.css`/`.md` get `prettier --write`.
- **Testing**: none yet. No test runner is configured — worth setting up before the Monobank integration lands, since that's the highest-stakes code path (real money).
- **Types**: hand-written flat interfaces in `lib/types.ts` rather than Supabase's generated `Database`/`Row`/`Insert`/`Update` generics — see the note under Architecture snapshot.

## What's built and working

- Storefront: homepage, `/catalog` (category filter via `?category=`), `/products/[slug]` (stock-aware size selection), `/cart`, `/wishlist`, `/checkout` → `/order/[id]` confirmation.
- Admin panel (`/admin`): staff login, product list/create/edit (with variants, device image upload to Supabase Storage, slug auto-fill from name), order list/detail with status updates.
- Full order lifecycle enum: `pending_payment → paid → processing → shipped → completed`, plus `cancelled`/`payment_failed`.
- Design tokens: near-black/graphite palette, desaturated acid-green accent, near-zero corner radii, applied via Tailwind v4's `@theme` in `app/globals.css`.

## What's explicitly stubbed — not real yet, flagged in code comments

- **Payment**: `place_order()` succeeds → the code immediately marks the order "paid" as a stand-in for a real Monobank webhook. No actual payment happens. **Must be replaced before real launch** — right now anyone who reaches `/checkout` can get a confirmed order for free.
- **Nova Poshta**: checkout city/branch are plain manual text fields, not real API-backed branch search. Shipping cost is a flat 80 UAH placeholder, not real cost calculation.
- **Fonts**: Space Grotesk + Public Sans (Google Fonts) as a placeholder for the originally-discussed Cabinet Grotesk + General Sans (Fontshare), which need self-hosting that hasn't been set up. Swappable later without touching component code.

## What's next / currently blocked

- **Nova Poshta real integration** — unblocked as of 2026-08-16: developer's own personal API key from `my.novaposhta.ua` is now in `.env.local` (`NOVA_POST_API_KEY`). Ready to implement city/branch search + cost calculation. Real waybill creation still needs the _client's_ business account, but that's a later phase.
- **Monobank real integration** — still blocked as of 2026-08-16 on the **client's** Acquiring API token (their business account, not the developer's — this one can't be substituted with a personal account). The API contract is already researched and ready to implement once the token exists: `POST /api/merchant/invoice/create` → redirect to `pageUrl` → webhook to our endpoint (payload signed ECDSA-SHA256, signature in `x-sign` header, verified against `GET /api/merchant/pubkey`) → `GET /api/merchant/invoice/status` as a fallback check. Real integration also needs a stock-expiry cleanup job, since Monobank does **not** send a webhook for `expired` invoices — currently stock is decremented immediately at order creation, so an abandoned payment needs an explicit sweep to release it.
- **Design/animation pass** — deliberately deferred, client to revisit the open design questions later (see `docs/design-direction.md`) — not currently blocking other work.

## Business/process context worth remembering

- Built for a client, not the developer's own business. Client owns the eventual domain, Monobank merchant account, business registration. Pattern: build on the developer's own accounts (Supabase, Nova Poshta test key) during development, swap to the client's real credentials at launch — this already happened once cleanly for Supabase and is the template for the rest.
- Fiscal receipts (РРО/ПРРО) — legally required once real payments go live. Client needs to confirm with their accountant which licensed provider to use (e.g. Checkbox.ua). Not yet built; schema is not blocking it (no code changes needed to add it later).
- Catalog is small by design (max ~50-100 products) — colorways are separate product listings, not variants of one product; the only variant dimension is size. This was a deliberate simplification from an earlier, more generic multi-option schema.
- Git: commit and push every meaningful change, straight to `main` — solo repo, no PR/branch workflow. Even when several changes are made together in one working session, commit and push each one separately as its own logical unit (e.g. finish the Nova Poshta search work → commit + push that, then move on to the next change → commit + push that too) rather than bundling unrelated work into one commit.
- Working mode: normally step-by-step mentor style (the user writes code, gets it reviewed) per the project's own master prompt — currently in "build directly" mode due to deadline pressure, with architecture/security decisions still surfaced rather than decided silently. This is a deadline-driven exception, not a permanent change — worth confirming which mode is active if picking this back up after a long gap.
