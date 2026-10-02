create table if not exists public.published_projects (
  project_id uuid primary key references public.projects(id) on delete cascade,
  slug text not null unique,
  title text not null,
  category text not null default '',
  year text not null default '',
  description text not null default '',
  hero jsonb not null default '{"src":"","alt":"","width":1600,"height":1000}'::jsonb,
  facts jsonb not null default '[]'::jsonb check (jsonb_typeof(facts) = 'array'),
  sections jsonb not null default '[]'::jsonb check (jsonb_typeof(sections) = 'array'),
  external_url text,
  seo jsonb not null default '{}'::jsonb,
  featured boolean not null default false,
  sort_order integer not null default 0,
  published_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists published_projects_home_index
  on public.published_projects (featured, sort_order, published_at desc);

alter table public.published_projects enable row level security;

drop policy if exists "Published projects are public" on public.projects;
drop policy if exists "Admins can read projects" on public.projects;
create policy "Admins can read projects"
  on public.projects for select
  to authenticated
  using (
    exists (
      select 1 from public.cms_admins
      where cms_admins.user_id = (select auth.uid())
    )
  );

create policy "Published project snapshots are public"
  on public.published_projects for select
  to anon, authenticated
  using (true);

create policy "Admins can publish projects"
  on public.published_projects for insert
  to authenticated
  with check (
    exists (
      select 1 from public.cms_admins
      where cms_admins.user_id = (select auth.uid())
    )
  );

create policy "Admins can update published projects"
  on public.published_projects for update
  to authenticated
  using (
    exists (
      select 1 from public.cms_admins
      where cms_admins.user_id = (select auth.uid())
    )
  )
  with check (
    exists (
      select 1 from public.cms_admins
      where cms_admins.user_id = (select auth.uid())
    )
  );

create policy "Admins can unpublish projects"
  on public.published_projects for delete
  to authenticated
  using (
    exists (
      select 1 from public.cms_admins
      where cms_admins.user_id = (select auth.uid())
    )
  );

grant select on public.published_projects to anon, authenticated;
grant insert, update, delete on public.published_projects to authenticated;

insert into public.published_projects (
  project_id, slug, title, category, year, description, hero, facts, sections,
  external_url, seo, featured, sort_order, published_at, updated_at
)
select
  id, slug, title, category, year, description, hero, facts, sections,
  external_url, seo, featured, sort_order, coalesce(published_at, now()), updated_at
from public.projects
where status = 'published'
on conflict (project_id) do nothing;
