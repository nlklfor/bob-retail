create type order_status as enum (
  'pending_payment',
  'paid',
  'processing',
  'shipped',
  'completed',
  'cancelled',
  'payment_failed'
);

create table orders (
  id uuid primary key default gen_random_uuid(),
  status order_status not null default 'pending_payment',
  customer_name text not null,
  customer_phone text not null,
  customer_email text,
  shipping_city text not null,
  shipping_branch text not null,
  subtotal numeric(10, 2) not null default 0 check (subtotal >= 0),
  shipping_cost numeric(10, 2) not null default 0 check (shipping_cost >= 0),
  total numeric(10, 2) not null default 0 check (total >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  paid_at timestamptz
);

alter table orders enable row level security;
-- no policies for anon: guest checkout never reads/writes orders directly,
-- everything goes through the place_order() function and the admin client.

-- order_items store a full snapshot at time of purchase — product_id/variant_id
-- can go null later (product deleted), but the historical facts never change.
create table order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references orders(id) on delete cascade,
  product_id uuid references products(id) on delete set null,
  variant_id uuid references product_variants(id) on delete set null,
  product_name text not null,
  size text,
  unit_price numeric(10, 2) not null check (unit_price >= 0),
  quantity integer not null check (quantity > 0),
  line_total numeric(10, 2) not null check (line_total >= 0)
);

create index order_items_order_id_idx on order_items(order_id);

alter table order_items enable row level security;

create table payments (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references orders(id) on delete cascade,
  provider text not null default 'stub',
  status text not null default 'pending',
  amount numeric(10, 2) not null check (amount >= 0),
  external_reference text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index payments_order_id_idx on payments(order_id);

alter table payments enable row level security;

create trigger orders_set_updated_at
  before update on orders
  for each row
  execute function set_updated_at();

create trigger payments_set_updated_at
  before update on payments
  for each row
  execute function set_updated_at();

-- Places an order atomically: locks each variant row, re-validates real
-- price/stock/active status from the database (never trusts the caller),
-- decrements stock, and writes order + order_items + a pending payment.
-- Raises (and rolls back everything) on any invalid item, insufficient
-- stock, or unavailable product.
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
    raise exception 'Cart is empty';
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
      raise exception 'Invalid quantity for variant %', v_variant_id;
    end if;

    -- lock the row for the rest of this transaction so a concurrent checkout
    -- on the same variant can't also read "enough stock" before this commits
    select * into v_variant from product_variants where id = v_variant_id for update;

    if v_variant is null or not v_variant.is_active then
      raise exception 'Variant % is not available', v_variant_id;
    end if;

    if v_variant.stock_quantity < v_quantity then
      raise exception 'Insufficient stock for variant %', v_variant_id;
    end if;

    select * into v_product from products where id = v_variant.product_id;

    if v_product is null or not v_product.is_active then
      raise exception 'Product for variant % is not available', v_variant_id;
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

revoke execute on function place_order(jsonb, text, text, text, text, text, numeric) from public;
grant execute on function place_order(jsonb, text, text, text, text, text, numeric) to service_role;
