-- price doesn't vary by size/color for this store — it belongs on the product, not repeated per variant
alter table products
  add column price numeric(10, 2) not null check (price >= 0);

-- sku isn't used by this business
alter table product_variants
  drop column price,
  drop column sku;

-- images should follow an option value (e.g. "Black"), not one exact variant combination,
-- so a color photo applies to every size that shares that color
alter table product_images
  drop column variant_id,
  add column product_option_value_id uuid references product_option_values(id) on delete cascade;

create index product_images_product_option_value_id_idx on product_images(product_option_value_id);
