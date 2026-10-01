import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ProjectCaseStudy from "@/components/project/ProjectCaseStudy";
import { getProject, getProjectSlugs } from "@/cms/projects";
import "./project.css";

type ProjectPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const slugs = await getProjectSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProject(slug);

  if (!project) return {};

  return {
    title: `${project.seo?.title || project.title} — Parnaz Kazemi`,
    description: project.seo?.description || project.description,
  };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = await getProject(slug);

  if (!project) notFound();

  return <ProjectCaseStudy project={project} />;
}
