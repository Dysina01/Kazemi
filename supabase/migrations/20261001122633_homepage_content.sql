create table if not exists public.site_settings (
  id text primary key check (id = 'home'),
  content jsonb not null default '{}'::jsonb check (jsonb_typeof(content) = 'object'),
  updated_by uuid references auth.users(id) on delete set null,
  updated_at timestamptz not null default now()
);

create index if not exists site_settings_updated_by_index
  on public.site_settings (updated_by);

alter table public.site_settings enable row level security;

create policy "Site settings are publicly readable"
  on public.site_settings for select
  to anon, authenticated
  using (id = 'home');

create policy "Admins can create site settings"
  on public.site_settings for insert
  to authenticated
  with check (
    id = 'home'
    and exists (
      select 1 from public.cms_admins
      where cms_admins.user_id = (select auth.uid())
    )
  );

create policy "Admins can update site settings"
  on public.site_settings for update
  to authenticated
  using (
    id = 'home'
    and exists (
      select 1 from public.cms_admins
      where cms_admins.user_id = (select auth.uid())
    )
  )
  with check (
    id = 'home'
    and exists (
      select 1 from public.cms_admins
      where cms_admins.user_id = (select auth.uid())
    )
  );

grant select on public.site_settings to anon, authenticated;
grant insert, update on public.site_settings to authenticated;

insert into public.site_settings (id, content)
values ('home', '{}'::jsonb)
on conflict (id) do nothing;
