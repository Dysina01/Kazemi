import type { Metadata } from "next";
import HomeClient from "./HomeClient";
import { getHomeContent } from "@/cms/site-content";
import { getHomepageProjects } from "@/cms/projects";

export async function generateMetadata(): Promise<Metadata> {
  const content = await getHomeContent();
  return { title: content.seo.title, description: content.seo.description };
}

export default async function HomePage() {
  const [content, projects] = await Promise.all([getHomeContent(), getHomepageProjects()]);
  return <HomeClient content={content} projects={projects} />;
}
