import { notFound, redirect } from "next/navigation";
import ProjectCaseStudy from "@/components/project/ProjectCaseStudy";
import { mapProject } from "@/cms/projects";
import { createClient } from "@/lib/supabase/server";
import "../../../projects/[slug]/project.css";

export default async function AdminProjectPreview({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: claims } = await supabase.auth.getClaims();
  if (!claims?.claims?.sub) redirect("/admin/login");
  const { data: project } = await supabase.from("projects").select("*").eq("id", id).maybeSingle();
  if (!project) notFound();
  return <ProjectCaseStudy project={mapProject(project)} preview />;
}
