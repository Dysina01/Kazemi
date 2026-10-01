alter table public.projects drop constraint if exists projects_status_check;
alter table public.projects add constraint projects_status_check
  check (status in ('draft', 'published', 'archived'));

create policy "Admins can list project media"
  on storage.objects for select
  to authenticated
  using (
    bucket_id = 'project-media'
    and exists (
      select 1 from public.cms_admins
      where cms_admins.user_id = (select auth.uid())
    )
  );
