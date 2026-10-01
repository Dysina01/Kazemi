"use client";

import { createClient } from "./client";

export type MediaFile = { name: string; path: string; url: string; size: number; mimetype: string; createdAt: string };

export async function listAllMedia() {
  const supabase = createClient();
  const files: MediaFile[] = [];
  async function walk(folder = "", depth = 0): Promise<void> {
    if (depth > 4) return;
    const { data, error } = await supabase.storage.from("project-media").list(folder, { limit: 100, sortBy: { column: "created_at", order: "desc" } });
    if (error) throw error;
    await Promise.all((data || []).map(async (item) => {
      const path = folder ? `${folder}/${item.name}` : item.name;
      if (!item.id) return walk(path, depth + 1);
      const { data: publicData } = supabase.storage.from("project-media").getPublicUrl(path);
      files.push({ name: item.name, path, url: publicData.publicUrl, size: Number(item.metadata?.size || 0), mimetype: String(item.metadata?.mimetype || "application/octet-stream"), createdAt: item.created_at || "" });
    }));
  }
  await walk();
  return files.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function uploadMedia(files: File[], folder = "library") {
  const supabase = createClient();
  const month = new Date().toISOString().slice(0, 7);
  return Promise.all(files.map(async (file) => {
    const extension = file.name.split(".").pop()?.toLowerCase() || "bin";
    const path = `${folder}/${month}/${crypto.randomUUID()}.${extension}`;
    const { error } = await supabase.storage.from("project-media").upload(path, file, { cacheControl: "31536000", upsert: false });
    if (error) throw error;
    return path;
  }));
}

export async function removeMedia(path: string) {
  const { error } = await createClient().storage.from("project-media").remove([path]);
  if (error) throw error;
}
