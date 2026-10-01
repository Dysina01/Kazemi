"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { duplicateProject, reorderProjects, setProjectStatus } from "@/app/admin/actions";
import type { ProjectAsset } from "@/sanity/types";

export type LibraryProject = {
  id: string; slug: string; title: string; category: string;
  status: "draft" | "published" | "archived";
  updated_at: string; hero: ProjectAsset; sort_order: number;
};

const statusCopy = { draft: "پیش‌نویس", published: "منتشرشده", archived: "بایگانی" } as const;

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
    startTransition(async () => { await setProjectStatus(id, status); router.refresh(); });
  }

  function duplicate(id: string) {
    startTransition(async () => {
      const result = await duplicateProject(id);
      if (result.ok && result.id) router.push(`/admin/projects/${result.id}`);
    });
  }

  return <div dir="rtl">
    <div className="admin-library-toolbar admin-card">
      <label className="admin-search"><span>⌕</span><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="جست‌وجوی پروژه…" /></label>
      <div className="admin-filter-tabs">{([
        ["all", "همه"], ["published", "منتشرشده"], ["draft", "پیش‌نویس"], ["archived", "بایگانی"],
      ] as const).map(([value, label]) => <button type="button" className={filter === value ? "is-active" : ""} onClick={() => setFilter(value)} key={value}>{label}</button>)}</div>
      {pending ? <span className="admin-library-saving">در حال انجام…</span> : null}
    </div>
    {visible.length ? <section className="admin-project-grid">{visible.map((project) => <article className={`admin-project-card ${draggedId === project.id ? "is-dragging" : ""}`} key={project.id} onDragOver={(event) => event.preventDefault()} onDrop={() => drop(project.id)}>
      <div className="admin-project-card__media">
        <Link href={`/admin/projects/${project.id}`} aria-label={`ویرایش ${project.title}`}>{project.hero?.src ? <Image src={project.hero.src} alt={project.hero.alt || ""} fill sizes="(max-width: 800px) 100vw, 320px" /> : <span>هنوز کاوری انتخاب نشده</span>}</Link>
        <button type="button" draggable={filter === "all" && !search} onDragStart={() => setDraggedId(project.id)} onDragEnd={() => setDraggedId(null)} className="admin-card-drag" aria-label="جابه‌جایی پروژه">⋮⋮</button>
        <span className={`admin-status ${project.status === "draft" ? "admin-status--draft" : project.status === "archived" ? "admin-status--archived" : ""}`}>{statusCopy[project.status]}</span>
      </div>
      <div className="admin-project-card__body">
        <Link className="admin-project-card__title" href={`/admin/projects/${project.id}`}><p>{project.category || "بدون دسته‌بندی"}</p><h2>{project.title || "پروژه بدون عنوان"}</h2><small>آخرین ویرایش {new Date(project.updated_at).toLocaleDateString("fa-IR")}</small></Link>
        <div className="admin-card-actions"><Link className="admin-button admin-button--primary" href={`/admin/projects/${project.id}`}>ویرایش پروژه</Link><details className="admin-more-menu"><summary aria-label="کارهای بیشتر">•••</summary><div><button type="button" onClick={() => duplicate(project.id)}>ساخت یک کپی</button>{project.status === "published" ? <button type="button" onClick={() => changeStatus(project.id, "draft")}>تبدیل به پیش‌نویس</button> : project.status === "archived" ? <button type="button" onClick={() => changeStatus(project.id, "draft")}>خروج از بایگانی</button> : <button type="button" onClick={() => changeStatus(project.id, "published")}>انتشار پروژه</button>}{project.status !== "archived" ? <button className="is-danger" type="button" onClick={() => changeStatus(project.id, "archived")}>انتقال به بایگانی</button> : null}</div></details></div>
      </div>
    </article>)}</section> : <section className="admin-card admin-empty"><strong>پروژه‌ای پیدا نشد</strong><span>عبارت جست‌وجو یا فیلتر را تغییر بده.</span></section>}
  </div>;
}
