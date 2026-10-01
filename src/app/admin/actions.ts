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

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}
