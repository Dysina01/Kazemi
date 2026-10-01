"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

async function requireAdmin() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  if (!data?.claims?.sub) redirect("/admin/login");
  const { data: admin } = await supabase.from("cms_admins").select("user_id").eq("user_id", data.claims.sub).maybeSingle();
  if (!admin) redirect("/admin/login?error=unauthorized");
  return supabase;
}

export async function saveProject(payload: string) {
  const supabase = await requireAdmin();
  const project = JSON.parse(payload) as Record<string, unknown>;
  const id = project.id as string | undefined;
  delete project.id;
  const row = {
    slug: project.slug,
    title: project.title,
    category: project.category,
    year: project.year,
    description: project.description,
    hero: project.hero,
    facts: project.facts,
    sections: project.sections,
    external_url: project.externalUrl || null,
    seo: project.seo,
    status: project.status,
    featured: project.featured,
    sort_order: project.sortOrder,
  };
  const query = id ? supabase.from("projects").update(row).eq("id", id) : supabase.from("projects").insert(row).select("id").single();
  const { data, error } = await query;
  if (error) return { ok: false, error: error.message };
  const savedId = id || (data as { id?: string } | null)?.id;
  revalidatePath("/", "layout");
  revalidatePath(`/projects/${String(project.slug)}`);
  return { ok: true, id: savedId };
}

export async function deleteProject(id: string) {
  const supabase = await requireAdmin();
  const { error } = await supabase.from("projects").delete().eq("id", id);
  if (error) return { ok: false, error: error.message };
  revalidatePath("/", "layout");
  redirect("/admin");
}

export async function setProjectStatus(id: string, status: "draft" | "published" | "archived") {
  const supabase = await requireAdmin();
  const { error } = await supabase.from("projects").update({ status }).eq("id", id);
  if (error) return { ok: false, error: error.message };
  revalidatePath("/", "layout");
  return { ok: true };
}

export async function duplicateProject(id: string) {
  const supabase = await requireAdmin();
  const { data: source, error: readError } = await supabase.from("projects").select("*").eq("id", id).single();
  if (readError || !source) return { ok: false, error: readError?.message || "Project not found" };
  const suffix = Date.now().toString().slice(-6);
  const { id: _id, created_at: _createdAt, updated_at: _updatedAt, published_at: _publishedAt, ...copy } = source;
  void _id; void _createdAt; void _updatedAt; void _publishedAt;
  const { data, error } = await supabase.from("projects").insert({
    ...copy, slug: `${source.slug}-copy-${suffix}`, title: `${source.title} — Copy`,
    status: "draft", featured: false, published_at: null,
  }).select("id").single();
  if (error) return { ok: false, error: error.message };
  revalidatePath("/admin");
  return { ok: true, id: data.id };
}

export async function reorderProjects(ids: string[]) {
  const supabase = await requireAdmin();
  const updates = await Promise.all(ids.map((id, index) => supabase.from("projects").update({ sort_order: index }).eq("id", id)));
  const failed = updates.find(({ error }) => error);
  if (failed?.error) return { ok: false, error: failed.error.message };
  revalidatePath("/admin");
  return { ok: true };
}

export async function saveSiteContent(payload: string) {
  const supabase = await requireAdmin();
  const content = JSON.parse(payload) as Record<string, unknown>;
  const { error } = await supabase.from("site_settings").upsert({
    id: "home", content, updated_at: new Date().toISOString(),
  }, { onConflict: "id" });
  if (error) return { ok: false, error: error.message };
  revalidatePath("/", "layout");
  return { ok: true };
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}
