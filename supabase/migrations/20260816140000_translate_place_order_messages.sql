-- Same function, same signature, only the raise exception messages change
-- (English -> Ukrainian) — these surface directly to the customer via
-- placeOrderAction's error passthrough when checkout fails.
create or replace function place_order(
  p_items jsonb, -- [{ "variant_id": "uuid", "quantity": int }, ...]
  p_customer_name text,
  p_customer_phone text,
  p_customer_email text,
  p_shipping_city text,
  p_shipping_branch text,
  p_shipping_cost numeric
) returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_order_id uuid := gen_random_uuid();
  v_item jsonb;
  v_variant_id uuid;
  v_quantity integer;
  v_variant product_variants;
  v_product products;
  v_subtotal numeric := 0;
  v_line_total numeric;
begin
  if p_items is null or jsonb_array_length(p_items) = 0 then
    raise exception 'Кошик порожній';
  end if;

  insert into orders (
    id, status, customer_name, customer_phone, customer_email,
    shipping_city, shipping_branch, shipping_cost
  ) values (
    v_order_id, 'pending_payment', p_customer_name, p_customer_phone, p_customer_email,
    p_shipping_city, p_shipping_branch, p_shipping_cost
  );

  for v_item in select * from jsonb_array_elements(p_items)
  loop
    v_variant_id := (v_item->>'variant_id')::uuid;
    v_quantity := (v_item->>'quantity')::integer;

    if v_quantity is null or v_quantity < 1 then
      raise exception 'Некоректна кількість для варіанта %', v_variant_id;
    end if;

    -- lock the row for the rest of this transaction so a concurrent checkout
    -- on the same variant can't also read "enough stock" before this commits
    select * into v_variant from product_variants where id = v_variant_id for update;

    if v_variant is null or not v_variant.is_active then
      raise exception 'Варіант % недоступний', v_variant_id;
    end if;

    if v_variant.stock_quantity < v_quantity then
      raise exception 'Недостатньо товару на складі для варіанта %', v_variant_id;
    end if;

    select * into v_product from products where id = v_variant.product_id;

    if v_product is null or not v_product.is_active then
      raise exception 'Товар для варіанта % недоступний', v_variant_id;
    end if;

    v_line_total := v_product.price * v_quantity;
    v_subtotal := v_subtotal + v_line_total;

    update product_variants
      set stock_quantity = stock_quantity - v_quantity
      where id = v_variant_id;

    insert into order_items (
      order_id, product_id, variant_id, product_name, size, unit_price, quantity, line_total
    ) values (
      v_order_id, v_product.id, v_variant.id, v_product.name, v_variant.size,
      v_product.price, v_quantity, v_line_total
    );
  end loop;

  update orders
    set subtotal = v_subtotal, total = v_subtotal + p_shipping_cost
    where id = v_order_id;

  insert into payments (order_id, provider, status, amount)
  values (v_order_id, 'stub', 'pending', v_subtotal + p_shipping_cost);

  return v_order_id;
end;
$$;
