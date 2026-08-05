-- rebuild: colorways are separate products, so the only remaining variant
-- dimension is size. drop the generic multi-option system entirely.
drop trigger if exists products_set_updated_at on products;
drop trigger if exists product_variants_set_updated_at on product_variants;
drop function if exists set_updated_at();

drop table if exists product_images cascade;
drop table if exists product_variant_option_values cascade;
drop table if exists product_variants cascade;
drop table if exists product_option_values cascade;
drop table if exists product_options cascade;
drop table if exists products cascade;
drop table if exists categories cascade;

-- categories
create table categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  created_at timestamptz not null default now()
);

alter table categories enable row level security;

create policy "categories are publicly readable"
  on categories for select
  to anon
  using (true);

-- products: each distinct colorway/listing is its own product, with its own price
create table products (
  id uuid primary key default gen_random_uuid(),
  category_id uuid references categories(id) on delete set null,
  name text not null,
  slug text not null unique,
  description text,
  price numeric(10, 2) not null check (price >= 0),
  is_active boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index products_category_id_idx on products(category_id);

alter table products enable row level security;

create policy "active products are publicly readable"
  on products for select
  to anon
  using (is_active = true);

-- product_variants: one row per size, each with its own real stock count.
-- size is nullable for products with no size variation (a single variant row).
create table product_variants (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references products(id) on delete cascade,
  size text,
  stock_quantity integer not null default 0 check (stock_quantity >= 0),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (product_id, size)
);

create index product_variants_product_id_idx on product_variants(product_id);

alter table product_variants enable row level security;

create policy "active variants of active products are publicly readable"
  on product_variants for select
  to anon
  using (
    is_active = true
    and exists (
      select 1 from products
      where products.id = product_variants.product_id
      and products.is_active = true
    )
  );

-- product_images: plain product-level images, no per-color linkage needed anymore
create table product_images (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references products(id) on delete cascade,
  storage_path text not null,
  alt_text text,
  position integer not null default 0,
  is_primary boolean not null default false
);

create index product_images_product_id_idx on product_images(product_id);

alter table product_images enable row level security;

create policy "images of active products are publicly readable"
  on product_images for select
  to anon
  using (
    exists (
      select 1 from products
      where products.id = product_images.product_id
      and products.is_active = true
    )
  );

-- keep updated_at accurate on edits
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger products_set_updated_at
  before update on products
  for each row
  execute function set_updated_at();

create trigger product_variants_set_updated_at
  before update on product_variants
  for each row
  execute function set_updated_at();
