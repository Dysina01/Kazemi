import { createClient as createPublicClient } from "@supabase/supabase-js";
import { cache } from "react";
import { fallbackProjects, getFallbackProject } from "@/sanity/fallback-projects";
import type { Project } from "@/sanity/types";
import { supabasePublishableKey, supabaseUrl } from "@/lib/supabase/env";

export type ProjectRecord = Project & {
  id: string;
  status: "draft" | "published" | "archived";
  featured: boolean;
  sortOrder: number;
};

const publicClient = createPublicClient(supabaseUrl, supabasePublishableKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

export function mapProject(row: Record<string, unknown>): ProjectRecord {
  return {
    id: row.id as string,
    slug: row.slug as string,
    title: row.title as string,
    category: row.category as string,
    year: row.year as string,
    description: row.description as string,
    hero: row.hero as Project["hero"],
    facts: row.facts as Project["facts"],
    sections: row.sections as Project["sections"],
    externalUrl: (row.external_url as string | null) || undefined,
    seo: row.seo as Project["seo"],
    status: row.status as ProjectRecord["status"],
    featured: Boolean(row.featured),
    sortOrder: Number(row.sort_order || 0),
  };
}

export const getProject = cache(async (slug: string): Promise<Project | undefined> => {
  const { data, error } = await publicClient.from("projects").select("*")
    .eq("slug", slug).eq("status", "published").maybeSingle();
  if (error || !data) return getFallbackProject(slug);
  return mapProject(data);
});

export async function getProjectSlugs(): Promise<string[]> {
  const { data, error } = await publicClient.from("projects").select("slug").eq("status", "published");
  if (error) return fallbackProjects.map((project) => project.slug);
  return Array.from(new Set([...(data || []).map(({ slug }) => slug), ...fallbackProjects.map((p) => p.slug)]));
}

export type HomepageProject = Pick<ProjectRecord, "id" | "slug" | "title" | "category" | "hero">;

export const getHomepageProjects = cache(async (): Promise<HomepageProject[]> => {
  const { data, error } = await publicClient.from("projects").select("id,slug,title,category,hero")
    .eq("status", "published").order("sort_order").limit(3);
  if (error || !data?.length) {
    return fallbackProjects.slice(0, 3).map((project, index) => ({
      id: `fallback-${index}`, slug: project.slug, title: project.title,
      category: project.category, hero: project.hero,
    }));
  }
  return data as HomepageProject[];
});
