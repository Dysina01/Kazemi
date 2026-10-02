create table if not exists public.project_versions (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  snapshot jsonb not null check (jsonb_typeof(snapshot) = 'object'),
  label text not null default 'ذخیره دستی',
  created_by uuid references auth.users(id) on delete set null default auth.uid(),
  created_at timestamptz not null default now()
);

create index if not exists project_versions_project_created_index
  on public.project_versions (project_id, created_at desc);

alter table public.project_versions enable row level security;

create policy "Admins can read project versions"
  on public.project_versions for select
  to authenticated
  using (
    exists (
      select 1 from public.cms_admins
      where cms_admins.user_id = (select auth.uid())
    )
  );

create policy "Admins can create project versions"
  on public.project_versions for insert
  to authenticated
  with check (
    created_by = (select auth.uid())
    and exists (
      select 1 from public.cms_admins
      where cms_admins.user_id = (select auth.uid())
    )
  );

create policy "Admins can delete project versions"
  on public.project_versions for delete
  to authenticated
  using (
    exists (
      select 1 from public.cms_admins
      where cms_admins.user_id = (select auth.uid())
    )
  );

grant select, insert, delete on public.project_versions to authenticated;
