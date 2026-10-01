create extension if not exists pgcrypto;

create table if not exists public.cms_admins (
  user_id uuid primary key references auth.users(id) on delete cascade,
  role text not null default 'editor' check (role in ('owner', 'editor')),
  created_at timestamptz not null default now()
);

create table if not exists public.cms_owner_allowlist (
  email text primary key check (email = lower(email))
);

insert into public.cms_owner_allowlist (email)
values ('sina10dalaei@gmail.com')
on conflict do nothing;

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  title text not null,
  category text not null default '',
  year text not null default '',
  description text not null default '',
  hero jsonb not null default '{"src":"","alt":"","width":1600,"height":1000}'::jsonb,
  facts jsonb not null default '[]'::jsonb check (jsonb_typeof(facts) = 'array'),
  sections jsonb not null default '[]'::jsonb check (jsonb_typeof(sections) = 'array'),
  external_url text,
  seo jsonb not null default '{}'::jsonb,
  status text not null default 'draft' check (status in ('draft', 'published')),
  featured boolean not null default false,
  sort_order integer not null default 0,
  published_at timestamptz,
  created_by uuid references auth.users(id) on delete set null default auth.uid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists projects_public_index
  on public.projects (status, sort_order, published_at desc);
create index if not exists projects_created_by_index
  on public.projects (created_by);

alter table public.cms_admins enable row level security;
alter table public.cms_owner_allowlist enable row level security;
alter table public.projects enable row level security;

create policy "Admins can read their membership"
  on public.cms_admins for select
  to authenticated
  using ((select auth.uid()) = user_id);

create policy "Owners can read their allowlist entry"
  on public.cms_owner_allowlist for select
  to authenticated
  using (email = lower(coalesce((select auth.jwt()) ->> 'email', '')));

create policy "Allowlisted owners can claim membership"
  on public.cms_admins for insert
  to authenticated
  with check (
    user_id = (select auth.uid())
    and role = 'owner'
    and exists (
      select 1 from public.cms_owner_allowlist
      where email = lower(coalesce((select auth.jwt()) ->> 'email', ''))
    )
  );

create policy "Published projects are public"
  on public.projects for select
  to anon, authenticated
  using (
    status = 'published'
    or exists (
      select 1 from public.cms_admins
      where cms_admins.user_id = (select auth.uid())
    )
  );

create policy "Admins can create projects"
  on public.projects for insert
  to authenticated
  with check (
    exists (
      select 1 from public.cms_admins
      where cms_admins.user_id = (select auth.uid())
    )
  );

create policy "Admins can update projects"
  on public.projects for update
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

create policy "Admins can delete projects"
  on public.projects for delete
  to authenticated
  using (
    exists (
      select 1 from public.cms_admins
      where cms_admins.user_id = (select auth.uid())
    )
  );

create or replace function public.set_updated_at()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  new.updated_at = now();
  if new.status = 'published' and new.published_at is null then
    new.published_at = now();
  end if;
  return new;
end;
$$;

drop trigger if exists projects_set_updated_at on public.projects;
create trigger projects_set_updated_at
before update on public.projects
for each row execute function public.set_updated_at();

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'project-media',
  'project-media',
  true,
  20971520,
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif', 'video/mp4', 'video/webm']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

create policy "Admins can upload project media"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'project-media'
    and exists (
      select 1 from public.cms_admins
      where cms_admins.user_id = (select auth.uid())
    )
  );

create policy "Admins can update project media"
  on storage.objects for update
  to authenticated
  using (
    bucket_id = 'project-media'
    and exists (
      select 1 from public.cms_admins
      where cms_admins.user_id = (select auth.uid())
    )
  )
  with check (
    bucket_id = 'project-media'
    and exists (
      select 1 from public.cms_admins
      where cms_admins.user_id = (select auth.uid())
    )
  );

create policy "Admins can delete project media"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'project-media'
    and exists (
      select 1 from public.cms_admins
      where cms_admins.user_id = (select auth.uid())
    )
  );

grant select on public.projects to anon, authenticated;
grant insert, update, delete on public.projects to authenticated;
grant select on public.cms_admins to authenticated;
grant select on public.cms_owner_allowlist to authenticated;
grant insert on public.cms_admins to authenticated;

insert into public.projects (
  slug, title, category, year, description, hero, facts, sections, status, featured, sort_order, seo
)
values (
  'designing-a-portfolio',
  'DESIGNING A PORTFOLIO',
  'Personal project',
  '2025',
  'Creating a portfolio system that balances storytelling, visual personality, and long-term scalability.',
  '{"src":"/projects/designing-a-portfolio/hero.png","alt":"Portfolio content system overview","width":900,"height":650}'::jsonb,
  '[{"label":"Role","value":"Product Designer"},{"label":"Timeline","value":"May 2026"},{"label":"Team","value":"Me"},{"label":"Platform","value":"Framer"}]'::jsonb,
  jsonb_build_array(
    jsonb_build_object('_key','overview','_type','contentSection','id','overview','label','Overview','heading','Creating a structure around storytelling','showInNavigation',true,'body',jsonb_build_array('As my experience expanded across product design, websites, and Framer development, my previous portfolio no longer reflected the quality or range of projects I wanted to showcase. New work was difficult to add, case studies lacked consistency, and the overall experience felt more like a collection of pages than a cohesive system. The goal was to create a portfolio that could support detailed storytelling, scale with future projects, and communicate both my design process and visual style. Rather than treating it as a simple redesign, I approached it as a product that would continue evolving over time.')),
    jsonb_build_object('_key','problem','_type','contentSection','id','problem','label','Problem','heading','Balancing personality with clarity','showInNavigation',true,'body',jsonb_build_array('Many portfolio websites struggle to find the right balance between visual expression and usability. Some prioritize aesthetics but make projects difficult to understand, while others focus heavily on process and lose any sense of personality. I wanted to create an experience that felt visually distinctive without distracting from the work itself. The portfolio needed to support long-form storytelling, showcase a variety of project types, and remain easy to navigate across different devices.'),'media',jsonb_build_object('src','/projects/designing-a-portfolio/content.png','alt','Portfolio system problem definition','width',900,'height',630)),
    jsonb_build_object('_key','design','_type','contentSection','id','design','label','Design','heading','Building a flexible content system','showInNavigation',true,'body',jsonb_build_array('The design process focused on creating a system rather than a collection of individual pages. I explored different approaches to project presentation, navigation, and case study layouts before settling on a modular structure built around reusable content blocks. Typography, spacing, and visual hierarchy were carefully refined to support both quick scanning and deeper reading.')),
    jsonb_build_object('_key','outcome','_type','contentSection','id','outcome','label','Outcome','heading','A portfolio designed to grow with the work','showInNavigation',true,'body',jsonb_build_array('The final experience provides a flexible foundation for showcasing product design, websites, and future projects. It combines detailed storytelling with a scalable system that supports ongoing updates without sacrificing consistency.')),
    jsonb_build_object('_key','gallery','_type','gallerySection','items',jsonb_build_array(
      jsonb_build_object('_key','g1','size','wide','src','/projects/designing-a-portfolio/gallery-wide-1.png','alt','Desktop project preview','width',595,'height',457,'title','Project 01','description','Desktop experience'),
      jsonb_build_object('_key','g2','size','narrow','src','/projects/designing-a-portfolio/gallery-tall-1.png','alt','Mobile project preview','width',290,'height',457,'title','Project 02','description','Mobile experience'),
      jsonb_build_object('_key','g3','size','narrow','src','/projects/designing-a-portfolio/gallery-tall-2.png','alt','Dashboard project preview','width',290,'height',457,'title','Project 03','description','Product dashboard'),
      jsonb_build_object('_key','g4','size','wide','src','/projects/designing-a-portfolio/gallery-wide-2.png','alt','Media product preview','width',595,'height',457,'title','Project 04','description','Media platform')
    ))
  ),
  'published',
  true,
  0,
  '{"title":"Designing a portfolio — Parnaz Kazemi","description":"A scalable portfolio system designed for storytelling."}'::jsonb
)
on conflict (slug) do nothing;
