-- Auto-generate a SKU on product creation when staff leaves it blank
-- (manual entry still overrides it — this only fills in a NULL). Format:
-- BOB-00001, sequential. Only fires on INSERT, so editing an existing
-- product never regenerates or clears its SKU.
create sequence product_sku_seq start with 1;

create or replace function set_product_sku()
returns trigger as $$
begin
  if new.sku is null then
    new.sku := 'BOB-' || lpad(nextval('product_sku_seq')::text, 5, '0');
  end if;
  return new;
end;
$$ language plpgsql;

create trigger products_set_sku
  before insert on products
  for each row
  execute function set_product_sku();
