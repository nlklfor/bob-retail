-- Real per-variant weight, so Nova Poshta shipping quotes use actual garment
-- weight instead of the flat per-item estimate in lib/nova-poshta/pricing.ts.
-- Default matches that old estimate (0.5kg) so existing rows stay sane until
-- staff fill in real values via the admin product form.
alter table product_variants
  add column weight_grams integer not null default 500 check (weight_grams > 0);
