-- The 20260909120000 migration was applied to the live DB before its
-- customer_phone/customer_social nullability was swapped in the source
-- file (client decision: Telegram/Instagram is the required reply
-- channel, phone is optional) — this brings the live table in line with
-- what's actually in that file now. Safe to run: the one existing test
-- row already has customer_social populated.
alter table price_offers
  alter column customer_phone drop not null;

alter table price_offers
  alter column customer_social set not null;
