"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { deleteProjectFromLibrary, duplicateProject, reorderProjects, setProjectStatus } from "@/app/admin/actions";
import type { ProjectAsset } from "@/sanity/types";

export type LibraryProject = {
  id: string; slug: string; title: string; category: string;
  status: "draft" | "published" | "archived";
  updated_at: string; hero: ProjectAsset; sort_order: number;
};

const statusCopy = { draft: "مخفی", published: "منتشرشده", archived: "بایگانی" } as const;

function Icon({ name }: { name: "edit" | "trash" | "eye" | "hidden" | "more" }) {
  const paths = {
    edit: <><path d="M4 20h4l11-11a2.8 2.8 0 0 0-4-4L4 16v4Z"/><path d="m13.5 6.5 4 4"/></>,
    trash: <><path d="M4 7h16M9 7V4h6v3M7 7l1 13h8l1-13"/><path d="M10 11v5M14 11v5"/></>,
    eye: <><path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z"/><circle cx="12" cy="12" r="2.5"/></>,
    hidden: <><path d="m3 3 18 18M10.6 6.2A9.8 9.8 0 0 1 12 6c6 0 9.5 6 9.5 6a15 15 0 0 1-2.1 2.7M6.3 6.3C3.8 8 2.5 12 2.5 12s3.5 6 9.5 6c1 0 2-.2 2.8-.5"/><path d="M9.8 9.8a3 3 0 0 0 4.4 4.4"/></>,
    more: <><circle cx="5" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/></>,
  };
  return <svg viewBox="0 0 24 24" aria-hidden="true">{paths[name]}</svg>;
}

export default function ProjectLibrary({ initialProjects }: { initialProjects: LibraryProject[] }) {
  const [projects, setProjects] = useState(initialProjects);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | LibraryProject["status"]>("all");
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const router = useRouter();
  const visible = useMemo(() => {
    const query = search.trim().toLocaleLowerCase("fa");
    return projects.filter((project) => (filter === "all" || project.status === filter) && `${project.title} ${project.category}`.toLocaleLowerCase("fa").includes(query));
  }, [projects, filter, search]);

  function drop(targetId: string) {
    if (!draggedId || draggedId === targetId || filter !== "all" || search) return;
    const next = [...projects];
    const from = next.findIndex(({ id }) => id === draggedId);
    const to = next.findIndex(({ id }) => id === targetId);
    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved);
    setProjects(next);
    setDraggedId(null);
    startTransition(async () => { await reorderProjects(next.map(({ id }) => id)); });
  }

  function changeStatus(id: string, status: LibraryProject["status"]) {
    setProjects((items) => items.map((item) => item.id === id ? { ...item, status } : item));
    startTransition(async () => {
      const result = await setProjectStatus(id, status);
      if (!result.ok) router.refresh();
    });
  }

  function duplicate(id: string) {
    startTransition(async () => {
      const result = await duplicateProject(id);
      if (result.ok && result.id) router.push(`/admin/projects/${result.id}`);
    });
  }

  function remove(id: string, title: string) {
    if (!confirm(`پروژه «${title}» برای همیشه حذف شود؟`)) return;
    setProjects((items) => items.filter((item) => item.id !== id));
    startTransition(async () => {
      const result = await deleteProjectFromLibrary(id);
      if (!result.ok) router.refresh();
    });
  }

  return <div dir="rtl">
    <div className="admin-library-toolbar admin-card">
      <label className="admin-search"><span>⌕</span><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="جست‌وجوی پروژه…" /></label>
      <div className="admin-filter-tabs">{([
        ["all", "همه"], ["published", "منتشرشده"], ["draft", "مخفی"], ["archived", "بایگانی"],
      ] as const).map(([value, label]) => <button type="button" className={filter === value ? "is-active" : ""} onClick={() => setFilter(value)} key={value}>{label}</button>)}</div>
      {pending ? <span className="admin-library-saving">در حال انجام…</span> : null}
    </div>
    {visible.length ? <section className="admin-project-table admin-card">
      <header><span>پروژه</span><span>نوع پروژه</span><span>آخرین ویرایش</span><span>وضعیت</span><span>عملیات</span></header>
      <div>{visible.map((project) => <article className={`admin-project-list-row ${draggedId === project.id ? "is-dragging" : ""}`} key={project.id} onDragOver={(event) => event.preventDefault()} onDrop={() => drop(project.id)}>
        <div className="admin-project-identity">
          <button type="button" draggable={filter === "all" && !search} onDragStart={() => setDraggedId(project.id)} onDragEnd={() => setDraggedId(null)} className="admin-list-drag" aria-label="جابه‌جایی پروژه" title="برای مرتب‌سازی بکشید"><i/><i/><i/></button>
          <Link className="admin-project-list-thumb" href={`/admin/projects/${project.id}`}>{project.hero?.src ? <Image src={project.hero.src} alt={project.hero.alt || ""} fill sizes="88px" /> : <span>—</span>}</Link>
          <Link href={`/admin/projects/${project.id}`}><strong>{project.title || "پروژه بدون عنوان"}</strong><small>/ {project.slug}</small></Link>
        </div>
        <span className="admin-project-type">{project.category || "بدون دسته‌بندی"}</span>
        <time dateTime={project.updated_at}>{new Intl.DateTimeFormat("fa-IR", { dateStyle: "medium" }).format(new Date(project.updated_at))}</time>
        <span className={`admin-status ${project.status === "draft" ? "admin-status--draft" : project.status === "archived" ? "admin-status--archived" : ""}`}>{statusCopy[project.status]}</span>
        <div className="admin-project-row-actions">
          <Link className="admin-list-icon" href={`/admin/projects/${project.id}`} aria-label="ویرایش پروژه" title="ویرایش"><Icon name="edit" /></Link>
          <button className="admin-list-icon is-danger" type="button" onClick={() => remove(project.id, project.title)} aria-label="حذف پروژه" title="حذف"><Icon name="trash" /></button>
          <button className="admin-list-icon" type="button" onClick={() => changeStatus(project.id, project.status === "published" ? "draft" : "published")} aria-label={project.status === "published" ? "مخفی‌کردن پروژه" : "انتشار پروژه"} title={project.status === "published" ? "مخفی‌کردن" : "انتشار"}><Icon name={project.status === "published" ? "hidden" : "eye"} /></button>
          <details className="admin-more-menu admin-list-more"><summary aria-label="کارهای بیشتر"><Icon name="more" /></summary><div><button type="button" onClick={() => duplicate(project.id)}>ساخت یک کپی</button>{project.status !== "archived" ? <button type="button" onClick={() => changeStatus(project.id, "archived")}>انتقال به بایگانی</button> : <button type="button" onClick={() => changeStatus(project.id, "draft")}>خروج از بایگانی</button>}</div></details>
        </div>
      </article>)}</div>
    </section> : <section className="admin-card admin-empty"><strong>پروژه‌ای پیدا نشد</strong><span>عبارت جست‌وجو یا فیلتر را تغییر بده.</span></section>}
  </div>;
}
