-- Restores stock decremented by place_order() for an order whose payment
-- definitively failed/expired/reversed — the counterpart to place_order()'s
-- decrement, using the same "one transaction, DB-level, never app-level
-- multi-step" pattern. Skips items whose variant was deleted since (variant_id
-- goes null on delete) — nothing to restore against a variant that no longer
-- exists.
create or replace function release_order_stock(p_order_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_item order_items;
begin
  for v_item in
    select * from order_items where order_id = p_order_id and variant_id is not null
  loop
    update product_variants
      set stock_quantity = stock_quantity + v_item.quantity
      where id = v_item.variant_id;
  end loop;
end;
$$;

revoke execute on function release_order_stock(uuid) from public;
grant execute on function release_order_stock(uuid) to service_role;
