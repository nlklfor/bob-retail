-- Customers can ask BOB to personally source/import an item they want but
-- can't find in the catalog — matches the shop's existing "order from
-- abroad" fulfillment model, just customer-initiated instead of staff-listed.
create table product_requests (
  id uuid primary key default gen_random_uuid(),
  name text,
  photos text[] not null default '{}',
  size text not null,
  instagram_handle text not null,
  color text,
  material text,
  expected_cost numeric(10, 2),
  link text,
  description text,
  status text not null default 'new',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table product_requests enable row level security;
-- No anon policies — same as contact_messages/newsletter_subscribers: guests
-- never read/write this directly, only through the Server Action (admin client).

create trigger product_requests_set_updated_at
  before update on product_requests
  for each row
  execute function set_updated_at();

-- A separate bucket from product-images (staff-curated catalog photos) so
-- customer-submitted request photos never mix with real product listings.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'product-request-images',
  'product-request-images',
  true,
  5242880, -- 5MB
  array['image/png', 'image/jpeg', 'image/webp', 'image/gif']
)
on conflict (id) do nothing;
