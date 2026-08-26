-- Contact page submissions. Same pattern as newsletter_subscribers:
-- RLS enabled, no anon policies at all — only the admin service-role
-- client (via the Server Action) can write, guests can never read.
create table contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  social_handle text,
  message text not null,
  created_at timestamptz not null default now()
);

alter table contact_messages enable row level security;
