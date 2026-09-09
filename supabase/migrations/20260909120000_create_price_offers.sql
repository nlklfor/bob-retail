-- "Торг" — customer can propose a lower price for a specific product
-- (slider capped at -300 UAH client-side, enforced again here so a
-- tampered request can't slip past the UI cap). Handled the same way as
-- product_requests: no in-app auto-checkout at the offer price, staff
-- review the offer in the admin panel and reach out manually (phone/
-- email/Telegram/Instagram) with a real payment link once accepted.
create table price_offers (
  id uuid primary key default gen_random_uuid(),
  product_id uuid references products(id) on delete set null,
  -- Snapshot of the product at offer time — same reasoning as
  -- order_items.unit_price: survives the product being edited/removed
  -- later without corrupting historical offers.
  product_name text not null,
  product_slug text not null,
  size text,
  original_price numeric(10, 2) not null check (original_price >= 0),
  offered_price numeric(10, 2) not null check (offered_price >= 0),
  customer_name text not null,
  customer_phone text,
  customer_email text,
  customer_social text not null,
  status text not null default 'new',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint price_offers_not_above_price check (offered_price <= original_price),
  constraint price_offers_discount_cap check (original_price - offered_price <= 300)
);

create index price_offers_product_id_idx on price_offers(product_id);

alter table price_offers enable row level security;
-- No anon policies — same as contact_messages/product_requests: guests
-- never read/write this directly, only through the Server Action (admin
-- client), which is what enforces the discount cap is followed even
-- before hitting these constraints.

create trigger price_offers_set_updated_at
  before update on price_offers
  for each row
  execute function set_updated_at();
