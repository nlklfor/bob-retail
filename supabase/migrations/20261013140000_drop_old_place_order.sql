-- Cleanup for 20261013130000_create_promo_codes.sql: removes the old
-- 7-argument place_order() once the site code that always sends
-- p_promo_code is deployed. Run this ONLY after that deploy — before it,
-- the live site still calls the 7-argument version.
drop function if exists place_order(jsonb, text, text, text, text, text, numeric);
