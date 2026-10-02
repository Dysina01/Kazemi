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

function projectRow(project: Record<string, unknown>) {
  return {
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
}

function publishedRow(projectId: string, row: ReturnType<typeof projectRow>) {
  return {
    project_id: projectId,
    slug: row.slug,
    title: row.title,
    category: row.category,
    year: row.year,
    description: row.description,
    hero: row.hero,
    facts: row.facts,
    sections: row.sections,
    external_url: row.external_url,
    seo: row.seo,
    featured: row.featured,
    sort_order: row.sort_order,
    published_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
}

export async function saveProject(payload: string, createVersion = false) {
  const supabase = await requireAdmin();
  const project = JSON.parse(payload) as Record<string, unknown>;
  const id = project.id as string | undefined;
  delete project.id;
  const row = projectRow(project);
  const { status: _status, ...draftChanges } = row;
  void _status;
  const query = id
    ? supabase.from("projects").update(draftChanges).eq("id", id)
    : supabase.from("projects").insert({ ...row, status: "draft" }).select("id").single();
  const { data, error } = await query;
  if (error) return { ok: false, error: error.message };
  const savedId = id || (data as { id?: string } | null)?.id;
  if (createVersion && savedId) {
    const snapshot = { ...project, id: savedId };
    const { error: versionError } = await supabase.from("project_versions").insert({
      project_id: savedId,
      snapshot,
      label: "ذخیره دستی",
    });
    if (versionError) return { ok: true, id: savedId, warning: "پروژه ذخیره شد، اما نسخه‌ای در تاریخچه ثبت نشد." };
  }
  revalidatePath("/", "layout");
  revalidatePath(`/projects/${String(project.slug)}`);
  return { ok: true, id: savedId };
}

export async function publishProject(payload: string) {
  const supabase = await requireAdmin();
  const project = JSON.parse(payload) as Record<string, unknown>;
  const id = project.id as string | undefined;
  delete project.id;
  const row = { ...projectRow(project), status: "published" as const };
  const query = id
    ? supabase.from("projects").update(row).eq("id", id).select("id").single()
    : supabase.from("projects").insert(row).select("id").single();
  const { data, error } = await query;
  if (error || !data?.id) return { ok: false, error: error?.message || "پروژه ذخیره نشد" };
  const savedId = data.id as string;
  const { error: publishError } = await supabase.from("published_projects")
    .upsert(publishedRow(savedId, row), { onConflict: "project_id" });
  if (publishError) return { ok: false, error: publishError.message };
  const { error: versionError } = await supabase.from("project_versions").insert({
    project_id: savedId,
    snapshot: { ...project, id: savedId, status: "published" },
    label: "انتشار در سایت",
  });
  if (versionError) {
    revalidatePath("/", "layout");
    revalidatePath(`/projects/${String(project.slug)}`);
    return { ok: true, id: savedId, warning: "پروژه منتشر شد، اما نسخه‌ای در تاریخچه ثبت نشد." };
  }
  revalidatePath("/", "layout");
  revalidatePath(`/projects/${String(project.slug)}`);
  return { ok: true, id: savedId };
}

export async function getProjectVersions(projectId: string) {
  const supabase = await requireAdmin();
  const { data, error } = await supabase.from("project_versions")
    .select("id,label,created_at")
    .eq("project_id", projectId)
    .order("created_at", { ascending: false })
    .limit(30);
  if (error) return { ok: false, error: error.message, versions: [] };
  return { ok: true, versions: data || [] };
}

export async function restoreProjectVersion(projectId: string, versionId: string, currentPayload: string) {
  const supabase = await requireAdmin();
  const current = JSON.parse(currentPayload) as Record<string, unknown>;
  const { data: version, error: readError } = await supabase.from("project_versions")
    .select("snapshot")
    .eq("id", versionId)
    .eq("project_id", projectId)
    .single();
  if (readError || !version) return { ok: false, error: readError?.message || "نسخه پیدا نشد" };
  const { error: backupError } = await supabase.from("project_versions").insert({
    project_id: projectId,
    snapshot: current,
    label: "قبل از بازیابی",
  });
  if (backupError) return { ok: false, error: backupError.message };
  const snapshot = version.snapshot as Record<string, unknown>;
  const { status: _snapshotStatus, ...restoredContent } = projectRow(snapshot);
  void _snapshotStatus;
  const { error: updateError } = await supabase.from("projects").update(restoredContent).eq("id", projectId);
  if (updateError) return { ok: false, error: updateError.message };
  revalidatePath("/", "layout");
  revalidatePath(`/projects/${String(snapshot.slug)}`);
  return { ok: true, project: { ...snapshot, id: projectId, status: current.status } };
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
  const { data: project, error: readError } = await supabase.from("projects").select("*").eq("id", id).single();
  if (readError || !project) return { ok: false, error: readError?.message || "پروژه پیدا نشد" };
  const { error } = await supabase.from("projects").update({ status }).eq("id", id);
  if (error) return { ok: false, error: error.message };
  if (status === "published") {
    const mapped = projectRow({
      ...project,
      externalUrl: project.external_url,
      sortOrder: project.sort_order,
      status,
    });
    const { error: publishError } = await supabase.from("published_projects")
      .upsert(publishedRow(id, mapped), { onConflict: "project_id" });
    if (publishError) return { ok: false, error: publishError.message };
  } else {
    const { error: unpublishError } = await supabase.from("published_projects").delete().eq("project_id", id);
    if (unpublishError) return { ok: false, error: unpublishError.message };
  }
  revalidatePath("/", "layout");
  return { ok: true };
}

export async function deleteProjectFromLibrary(id: string) {
  const supabase = await requireAdmin();
  const { error } = await supabase.from("projects").delete().eq("id", id);
  if (error) return { ok: false, error: error.message };
  revalidatePath("/", "layout");
  revalidatePath("/admin");
  return { ok: true };
}

export async function setHomepageProjects(ids: string[]) {
  const supabase = await requireAdmin();
  const selected = ids.slice(0, 3);
  const { error: resetDrafts } = await supabase.from("projects").update({ featured: false }).neq("id", "00000000-0000-0000-0000-000000000000");
  if (resetDrafts) return { ok: false, error: resetDrafts.message };
  if (selected.length) {
    const { error } = await supabase.from("projects").update({ featured: true }).in("id", selected);
    if (error) return { ok: false, error: error.message };
  }
  const { error: resetPublished } = await supabase.from("published_projects").update({ featured: false }).neq("project_id", "00000000-0000-0000-0000-000000000000");
  if (resetPublished) return { ok: false, error: resetPublished.message };
  if (selected.length) {
    const { error } = await supabase.from("published_projects").update({ featured: true }).in("project_id", selected);
    if (error) return { ok: false, error: error.message };
  }
  revalidatePath("/", "layout");
  return { ok: true };
}

export async function duplicateProject(id: string) {
  const supabase = await requireAdmin();
  const { data: source, error: readError } = await supabase.from("projects").select("*").eq("id", id).single();
  if (readError || !source) return { ok: false, error: readError?.message || "پروژه پیدا نشد" };
  const suffix = Date.now().toString().slice(-6);
  const { id: _id, created_at: _createdAt, updated_at: _updatedAt, published_at: _publishedAt, ...copy } = source;
  void _id; void _createdAt; void _updatedAt; void _publishedAt;
  const { data, error } = await supabase.from("projects").insert({
    ...copy, slug: `${source.slug}-copy-${suffix}`, title: `${source.title} — کپی`,
    status: "draft", featured: false, published_at: null,
  }).select("id").single();
  if (error) return { ok: false, error: error.message };
  revalidatePath("/admin");
  return { ok: true, id: data.id };
}

export async function reorderProjects(ids: string[]) {
  const supabase = await requireAdmin();
  const updates = await Promise.all(ids.flatMap((id, index) => [
    supabase.from("projects").update({ sort_order: index }).eq("id", id),
    supabase.from("published_projects").update({ sort_order: index }).eq("project_id", id),
  ]));
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
