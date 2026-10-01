import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function AdminDashboard() {
  const supabase = await createClient();
  const { data: projects } = await supabase.from("projects").select("id,slug,title,category,status,updated_at").order("sort_order").order("updated_at", { ascending: false });
  return <><header className="admin-topbar"><div><h1>Projects</h1><p>Create, reorder and publish portfolio case studies.</p></div><Link className="admin-button admin-button--primary" href="/admin/projects/new">+ New project</Link></header><section className="admin-card admin-project-list">{projects?.length ? projects.map((project) => <article className="admin-project-row" key={project.id}><div><h2>{project.title}</h2><p>{project.category || "No category"}</p></div><span className={`admin-status ${project.status === "draft" ? "admin-status--draft" : ""}`}>{project.status}</span><p>{new Date(project.updated_at).toLocaleDateString("en-GB")}</p><div><Link className="admin-button" href={`/admin/projects/${project.id}`}>Edit</Link></div></article>) : <div className="admin-empty">No projects yet.</div>}</section></>;
}
