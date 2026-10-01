import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import ProjectLibrary, { type LibraryProject } from "@/components/admin/ProjectLibrary";

export default async function AdminDashboard() {
  const supabase = await createClient();
  const { data: projects } = await supabase.from("projects").select("id,slug,title,category,status,updated_at,hero,sort_order").order("sort_order").order("updated_at", { ascending: false });
  return <><header className="admin-topbar"><div><h1>پروژه‌ها</h1><p>پروژه‌های پورتفولیو را از اینجا مدیریت کن.</p></div><Link className="admin-button admin-button--primary" href="/admin/projects/new">+ پروژه جدید</Link></header><ProjectLibrary initialProjects={(projects || []) as LibraryProject[]} /></>;
}
