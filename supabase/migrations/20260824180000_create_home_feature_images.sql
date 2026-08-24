-- Editable homepage banner tiles (Admin > Зображення на головній). Three
-- fixed slots; staff edit the image, an optional caption, and which product
-- it links to. Public read (storefront renders them for guests), writes
-- only via the admin service-role client (see lib/admin/home-content.ts).
create table home_feature_images (
  id uuid primary key default gen_random_uuid(),
  position smallint not null unique check (position between 1 and 3),
  image_url text,
  label text,
  product_id uuid references products(id) on delete set null,
  updated_at timestamptz not null default now()
);

alter table home_feature_images enable row level security;

create policy "feature images are publicly readable"
  on home_feature_images for select
  to anon
  using (true);

create trigger home_feature_images_set_updated_at
  before update on home_feature_images
  for each row
  execute function set_updated_at();

insert into home_feature_images (position) values (1), (2), (3);
