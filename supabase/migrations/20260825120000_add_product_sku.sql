-- Optional staff-entered SKU/article code, shown on the product page.
-- Nullable (older products may not have one yet); unique only among
-- non-null values so multiple products can leave it blank.
alter table products add column sku text;

create unique index products_sku_key on products(sku) where sku is not null;
