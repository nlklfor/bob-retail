-- Footer email subscription. Guests submit their email through a Server
-- Action using the admin client — same pattern as orders/payments, no anon
-- policies, server-only writes.
create table newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  created_at timestamptz not null default now()
);

alter table newsletter_subscribers enable row level security;
