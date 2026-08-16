# BOB Retail

Streetwear e-commerce storefront built for a client. Guest-only — no customer accounts, guest cart/wishlist/checkout.

Stack: Next.js 16 (App Router) + React + TypeScript + Tailwind CSS + Bun + Supabase (Postgres).

For full architecture notes, current status, and what's left to build, see [`docs/project-status.md`](docs/project-status.md) — that file is the source of truth and is kept up to date as the project changes. Design direction and creative brief live in [`docs/design-direction.md`](docs/design-direction.md).

## Getting started

1. `bun install`
2. Create `.env.local` (see `.env.example` for the required variable names) with:
   - `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` — from the Supabase dashboard ("bob-retail" project) → Project Settings → API.
   - `NOVA_POST_API_KEY` — personal Nova Poshta API key from `my.novaposhta.ua`.
3. `bun run dev`
4. Storefront at `http://localhost:3000`, admin panel at `/admin/login`.

## Scripts

- `bun run dev` — start the dev server
- `bun run build` — production build
- `bun run start` — run a production build
- `bun run lint` — lint the codebase
