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

-- products
create table products (
  id uuid primary key default gen_random_uuid(),
  category_id uuid references categories(id) on delete set null,
  name text not null,
  slug text not null unique,
  description text,
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

-- product_options: the kind of choice a product offers (e.g. "Size", "Color"), scoped per product
create table product_options (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references products(id) on delete cascade,
  name text not null,
  position integer not null default 0
);

create index product_options_product_id_idx on product_options(product_id);

alter table product_options enable row level security;

create policy "product options are publicly readable"
  on product_options for select
  to anon
  using (
    exists (
      select 1 from products
      where products.id = product_options.product_id
      and products.is_active = true
    )
  );

-- product_option_values: the actual choices for an option (e.g. "M", "Black")
create table product_option_values (
  id uuid primary key default gen_random_uuid(),
  product_option_id uuid not null references product_options(id) on delete cascade,
  value text not null,
  position integer not null default 0,
  unique (product_option_id, value)
);

create index product_option_values_option_id_idx on product_option_values(product_option_id);

alter table product_option_values enable row level security;

create policy "product option values are publicly readable"
  on product_option_values for select
  to anon
  using (
    exists (
      select 1 from product_options
      join products on products.id = product_options.product_id
      where product_options.id = product_option_values.product_option_id
      and products.is_active = true
    )
  );

-- product_variants: the actual purchasable SKU
create table product_variants (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references products(id) on delete cascade,
  sku text not null unique,
  price numeric(10, 2) not null check (price >= 0),
  stock_quantity integer not null default 0 check (stock_quantity >= 0),
  weight_grams integer not null default 0 check (weight_grams >= 0),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
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

-- product_variant_option_values: which combination of option values makes up a variant
create table product_variant_option_values (
  variant_id uuid not null references product_variants(id) on delete cascade,
  product_option_id uuid not null references product_options(id) on delete cascade,
  product_option_value_id uuid not null references product_option_values(id) on delete cascade,
  primary key (variant_id, product_option_value_id),
  unique (variant_id, product_option_id)
);

create index product_variant_option_values_variant_id_idx on product_variant_option_values(variant_id);

alter table product_variant_option_values enable row level security;

create policy "variant option values are publicly readable"
  on product_variant_option_values for select
  to anon
  using (
    exists (
      select 1 from product_variants
      join products on products.id = product_variants.product_id
      where product_variants.id = product_variant_option_values.variant_id
      and product_variants.is_active = true
      and products.is_active = true
    )
  );

-- product_images
create table product_images (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references products(id) on delete cascade,
  variant_id uuid references product_variants(id) on delete cascade,
  storage_path text not null,
  alt_text text,
  position integer not null default 0,
  is_primary boolean not null default false
);

create index product_images_product_id_idx on product_images(product_id);
create index product_images_variant_id_idx on product_images(variant_id);

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
