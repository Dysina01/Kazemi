"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { duplicateProject, reorderProjects, setProjectStatus } from "@/app/admin/actions";
import type { ProjectAsset } from "@/sanity/types";

export type LibraryProject = {
  id: string; slug: string; title: string; category: string; status: "draft" | "published" | "archived";
  updated_at: string; hero: ProjectAsset; sort_order: number;
};

export default function ProjectLibrary({ initialProjects }: { initialProjects: LibraryProject[] }) {
  const [projects, setProjects] = useState(initialProjects);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | LibraryProject["status"]>("all");
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const router = useRouter();
  const visible = useMemo(() => projects.filter((project) => (filter === "all" || project.status === filter) && `${project.title} ${project.category}`.toLowerCase().includes(search.toLowerCase())), [projects, filter, search]);

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
    startTransition(async () => { const result = await duplicateProject(id); if (result.ok && result.id) router.push(`/admin/projects/${result.id}`); });
  }

  return <>
    <div className="admin-library-toolbar admin-card">
      <label className="admin-search"><span>⌕</span><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search projects…" /></label>
      <div className="admin-filter-tabs">{(["all", "published", "draft", "archived"] as const).map((value) => <button type="button" className={filter === value ? "is-active" : ""} onClick={() => setFilter(value)} key={value}>{value}</button>)}</div>
      {pending ? <span className="admin-library-saving">Updating…</span> : null}
    </div>
    {visible.length ? <section className="admin-project-grid">{visible.map((project) => <article className={`admin-project-card ${draggedId === project.id ? "is-dragging" : ""}`} key={project.id} onDragOver={(event) => event.preventDefault()} onDrop={() => drop(project.id)}>
      <div className="admin-project-card__media">{project.hero?.src ? <Image src={project.hero.src} alt={project.hero.alt || ""} fill sizes="(max-width: 800px) 100vw, 320px" /> : <div>No cover</div>}<button type="button" draggable={filter === "all" && !search} onDragStart={() => setDraggedId(project.id)} onDragEnd={() => setDraggedId(null)} className="admin-card-drag" aria-label="Drag to reorder">⋮⋮</button><span className={`admin-status ${project.status === "draft" ? "admin-status--draft" : project.status === "archived" ? "admin-status--archived" : ""}`}>{project.status}</span></div>
      <div className="admin-project-card__body"><div><p>{project.category || "Uncategorized"}</p><h2>{project.title}</h2><small>Updated {new Date(project.updated_at).toLocaleDateString("en-GB")}</small></div><div className="admin-card-actions"><Link className="admin-button admin-button--primary" href={`/admin/projects/${project.id}`}>Edit</Link><button className="admin-button" type="button" onClick={() => duplicate(project.id)}>Duplicate</button>{project.status === "published" ? <button className="admin-button" type="button" onClick={() => changeStatus(project.id, "draft")}>Unpublish</button> : project.status === "archived" ? <button className="admin-button" type="button" onClick={() => changeStatus(project.id, "draft")}>Restore</button> : <button className="admin-button" type="button" onClick={() => changeStatus(project.id, "published")}>Publish</button>}<button className="admin-button admin-button--danger" type="button" onClick={() => changeStatus(project.id, "archived")}>Archive</button></div></div>
    </article>)}</section> : <section className="admin-card admin-empty">No projects match this view.</section>}
  </>;
}
