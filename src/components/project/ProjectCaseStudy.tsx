import Link from "next/link";
import ProjectImage from "./ProjectImage";
import ProjectNavigation from "./ProjectNavigation";
import ProjectSections from "./ProjectSections";
import type { Project, ProjectSection } from "@/sanity/types";

function navigationItems(sections: ProjectSection[]) {
  return sections.flatMap((section) => {
    if ("showInNavigation" in section && section.showInNavigation && section.id && "label" in section && section.label) {
      return [{ id: section.id, label: section.label }];
    }
    return [];
  });
}

export default function ProjectCaseStudy({ project, preview = false }: { project: Project; preview?: boolean }) {
  return <main className={`case-page ${preview ? "case-page--preview" : ""}`}>
    <ProjectNavigation items={navigationItems(project.sections)} />
    <article className="case-layout">
      <section className="case-hero">
        <header className="case-hero__header">
          <div className="case-hero__meta"><span>{project.category}</span><i aria-hidden="true" /><span>{project.year}</span></div>
          <h1>{project.title}</h1><p>{project.description}</p>
        </header>
        <ProjectImage asset={project.hero} priority className="case-hero__media" />
        <div className="case-facts">{project.facts.map((fact) => <div key={`${fact.label}-${fact.value}`}><h2>{fact.label}</h2><p>{fact.value}</p></div>)}</div>
        {project.externalUrl ? <Link className="case-external-link" href={project.externalUrl} target="_blank" rel="noreferrer">See the website</Link> : null}
      </section>
      <ProjectSections sections={project.sections} />
    </article>
  </main>;
}
