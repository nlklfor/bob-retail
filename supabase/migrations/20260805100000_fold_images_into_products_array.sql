-- images are a simple ordered list of URLs, not a concurrency-sensitive
-- resource like stock — a plain array column is fine here, no separate table needed
drop table if exists product_images cascade;

alter table products
  add column images text[] not null default '{}';
