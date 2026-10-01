import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ProjectImage from "@/components/project/ProjectImage";
import ProjectNavigation from "@/components/project/ProjectNavigation";
import ProjectSections from "@/components/project/ProjectSections";
import { getProject, getProjectSlugs } from "@/cms/projects";
import type { ProjectSection } from "@/sanity/types";
import "./project.css";

type ProjectPageProps = {
  params: Promise<{ slug: string }>;
};

function getNavigationItems(sections: ProjectSection[]) {
  return sections.flatMap((section) => {
    if (
      "showInNavigation" in section &&
      section.showInNavigation &&
      section.id &&
      "label" in section &&
      section.label
    ) {
      return [{ id: section.id, label: section.label }];
    }
    return [];
  });
}

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

  const navigationItems = getNavigationItems(project.sections);

  return (
    <main className="case-page">
      <ProjectNavigation items={navigationItems} />

      <article className="case-layout">
        <section className="case-hero">
          <header className="case-hero__header">
            <div className="case-hero__meta">
              <span>{project.category}</span>
              <i aria-hidden="true" />
              <span>{project.year}</span>
            </div>
            <h1>{project.title}</h1>
            <p>{project.description}</p>
          </header>

          <ProjectImage asset={project.hero} priority className="case-hero__media" />

          <div className="case-facts">
            {project.facts.map((fact) => (
              <div key={`${fact.label}-${fact.value}`}>
                <h2>{fact.label}</h2>
                <p>{fact.value}</p>
              </div>
            ))}
          </div>

          {project.externalUrl ? (
            <Link
              className="case-external-link"
              href={project.externalUrl}
              target="_blank"
              rel="noreferrer"
            >
              See the website
            </Link>
          ) : null}
        </section>

        <ProjectSections sections={project.sections} />
      </article>
    </main>
  );
}
