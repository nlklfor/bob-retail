-- Optional staff-uploaded photo per category, shown on the homepage
-- category showcase instead of a typography-only tile when set.
alter table categories add column image_url text;
