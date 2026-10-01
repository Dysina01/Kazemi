import { cache } from "react";
import { sanityClient } from "./client";
import { isSanityConfigured } from "./env";
import { fallbackProjects, getFallbackProject } from "./fallback-projects";
import { projectBySlugQuery, projectSlugsQuery } from "./queries";
import type { Project } from "./types";

export const getProject = cache(async (slug: string): Promise<Project | undefined> => {
  if (!isSanityConfigured) return getFallbackProject(slug);

  try {
    const project = await sanityClient.fetch<Project | null>(
      projectBySlugQuery,
      { slug },
      { next: { revalidate: 60, tags: [`project:${slug}`] } },
    );
    return project ?? getFallbackProject(slug);
  } catch {
    return getFallbackProject(slug);
  }
});

export async function getProjectSlugs(): Promise<string[]> {
  if (!isSanityConfigured) {
    return fallbackProjects.map((project) => project.slug);
  }

  try {
    const slugs = await sanityClient.fetch<string[]>(
      projectSlugsQuery,
      {},
      { next: { revalidate: 60, tags: ["projects"] } },
    );
    return Array.from(new Set([...slugs, ...fallbackProjects.map((project) => project.slug)]));
  } catch {
    return fallbackProjects.map((project) => project.slug);
  }
}
