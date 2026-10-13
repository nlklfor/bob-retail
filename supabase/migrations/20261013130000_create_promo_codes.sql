-- Promo codes: free delivery, or a fixed amount off (e.g. -200 грн). One
-- code per order. Staff manage them in the admin panel; one code can be
-- flagged as the welcome code that new newsletter subscribers receive.
create table promo_codes (
  id uuid primary key default gen_random_uuid(),
  -- Stored uppercase; customers can type it in any case.
  code text not null unique
    check (code = upper(code) and code ~ '^[A-Z0-9_-]{3,32}$'),
  kind text not null check (kind in ('free_shipping', 'fixed_amount')),
  amount numeric(10, 2),
  min_order_amount numeric(10, 2)
    check (min_order_amount is null or min_order_amount > 0),
  usage_limit integer check (usage_limit is null or usage_limit > 0),
  times_used integer not null default 0 check (times_used >= 0),
  is_welcome boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint promo_codes_amount_matches_kind check (
    (kind = 'fixed_amount' and amount is not null and amount > 0)
    or (kind = 'free_shipping' and amount is null)
  )
);

-- At most one welcome code at a time.
create unique index promo_codes_single_welcome_idx
  on promo_codes (is_welcome) where is_welcome;

alter table promo_codes enable row level security;
-- No anon policies — same as product_requests/price_offers: only the
-- service-role client (server actions, place_order()) touches this table.

create trigger promo_codes_set_updated_at
  before update on promo_codes
  for each row
  execute function set_updated_at();

alter table orders
  add column promo_code text,
  add column discount numeric(10, 2) not null default 0 check (discount >= 0);

-- place_order() gains a promo code argument. Added as an overload next to
-- the existing 7-argument version rather than replacing it, so the site
-- version that's live while this migration runs keeps checking out exactly
-- as before. PostgREST picks the overload by argument names: callers that
-- send p_promo_code (null when no code was entered) get this version,
-- callers that don't get the old one. p_promo_code has no default on
-- purpose — a default would make a 7-name call match both and fail as
-- ambiguous. The old version is removed in a follow-up migration once the
-- new code is deployed (20261013140000_drop_old_place_order.sql).
--
-- The promo row is locked FOR UPDATE, same reasoning as the variant rows:
-- two concurrent checkouts can't both slip under a usage limit of 1.
-- Error messages are Ukrainian — they surface directly to the customer.
create function place_order(
  p_items jsonb, -- [{ "variant_id": "uuid", "quantity": int }, ...]
  p_customer_name text,
  p_customer_phone text,
  p_customer_email text,
  p_shipping_city text,
  p_shipping_branch text,
  p_shipping_cost numeric,
  p_promo_code text
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
  v_promo promo_codes;
  v_subtotal numeric := 0;
  v_line_total numeric;
  v_discount numeric := 0;
  v_promo_code text := null;
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
      raise exception 'Некоректна кількість товару';
    end if;

    select * into v_variant from product_variants where id = v_variant_id for update;

    if v_variant is null or not v_variant.is_active then
      raise exception 'Один із товарів у кошику більше недоступний';
    end if;

    if v_variant.stock_quantity < v_quantity then
      raise exception 'Недостатньо товару на складі';
    end if;

    select * into v_product from products where id = v_variant.product_id;

    if v_product is null or not v_product.is_active then
      raise exception 'Один із товарів у кошику більше недоступний';
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

  if p_promo_code is not null and length(trim(p_promo_code)) > 0 then
    select * into v_promo
      from promo_codes
      where code = upper(trim(p_promo_code))
      for update;

    if v_promo is null then
      raise exception 'Промокод не знайдено';
    end if;

    if v_promo.usage_limit is not null and v_promo.times_used >= v_promo.usage_limit then
      raise exception 'Цей промокод вже використано максимальну кількість разів';
    end if;

    if v_promo.min_order_amount is not null and v_subtotal < v_promo.min_order_amount then
      raise exception 'Промокод діє для замовлень від % грн', round(v_promo.min_order_amount);
    end if;

    if v_promo.kind = 'free_shipping' then
      v_discount := p_shipping_cost;
    else
      -- Never more than the goods themselves — a -200 code on a 150 грн
      -- item makes the item free, it doesn't eat into shipping.
      v_discount := least(v_promo.amount, v_subtotal);
    end if;

    update promo_codes set times_used = times_used + 1 where id = v_promo.id;
    v_promo_code := v_promo.code;
  end if;

  update orders
    set subtotal = v_subtotal,
        discount = v_discount,
        promo_code = v_promo_code,
        total = v_subtotal + p_shipping_cost - v_discount
    where id = v_order_id;

  insert into payments (order_id, provider, status, amount)
  values (v_order_id, 'stub', 'pending', v_subtotal + p_shipping_cost - v_discount);

  return v_order_id;
end;
$$;

revoke execute on function place_order(jsonb, text, text, text, text, text, numeric, text) from public;
grant execute on function place_order(jsonb, text, text, text, text, text, numeric, text) to service_role;

-- A failed/expired/reversed payment also gives back the promo use it took,
-- same as it gives back stock — otherwise an abandoned payment would burn
-- one of a limited code's uses for nothing.
create or replace function release_order_stock(p_order_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_item order_items;
  v_promo_code text;
begin
  for v_item in
    select * from order_items where order_id = p_order_id and variant_id is not null
  loop
    update product_variants
      set stock_quantity = stock_quantity + v_item.quantity
      where id = v_item.variant_id;
  end loop;

  select promo_code into v_promo_code from orders where id = p_order_id;
  if v_promo_code is not null then
    update promo_codes
      set times_used = greatest(times_used - 1, 0)
      where code = v_promo_code;
  end if;
end;
$$;

revoke execute on function release_order_stock(uuid) from public;
grant execute on function release_order_stock(uuid) to service_role;
