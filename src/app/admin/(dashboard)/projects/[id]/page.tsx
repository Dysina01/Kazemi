import Link from "next/link";
import { notFound } from "next/navigation";
import ProjectEditor from "@/components/admin/ProjectEditor";
import PublicationSwitch from "@/components/admin/PublicationSwitch";
import { mapProject } from "@/cms/projects";
import { createClient } from "@/lib/supabase/server";

export default async function EditProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data } = await supabase.from("projects").select("*").eq("id", id).maybeSingle();
  if (!data) notFound();
  const project = mapProject(data);
  return <><header className="admin-topbar"><div><Link href="/admin">→ بازگشت به پروژه‌ها</Link><h1>ویرایش پروژه</h1></div><PublicationSwitch key={project.status} projectId={project.id} initialPublished={project.status === "published"} /></header><ProjectEditor initialProject={project} /></>;
}
