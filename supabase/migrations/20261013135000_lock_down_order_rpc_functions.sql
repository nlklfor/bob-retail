-- Security fix. Supabase grants EXECUTE on every new public function to
-- anon and authenticated explicitly, so the earlier `revoke ... from public`
-- in the orders/stock migrations never actually took those away — anyone
-- holding the anon key could call place_order() (fake orders draining
-- stock) or release_order_stock() (inflating stock) straight through the
-- REST API. Only the server's service-role client should ever call these;
-- both real callers (checkout action, Monobank status handler) already do.
revoke execute on function place_order(jsonb, text, text, text, text, text, numeric) from anon, authenticated;
revoke execute on function place_order(jsonb, text, text, text, text, text, numeric, text) from anon, authenticated;
revoke execute on function release_order_stock(uuid) from anon, authenticated;
