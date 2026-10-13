-- Every promo/welcome email carries a personal unsubscribe link — required
-- for marketing email, and the only way a guest-checkout shop (no accounts)
-- can let someone leave the list. A random token rather than the email
-- itself in the URL, so nobody can unsubscribe someone else by guessing.
alter table newsletter_subscribers
  add column unsubscribe_token uuid not null default gen_random_uuid();

create unique index newsletter_subscribers_unsubscribe_token_idx
  on newsletter_subscribers (unsubscribe_token);
