import Image from "next/image";
import ProjectBody from "./ProjectBody";
import ProjectImage from "./ProjectImage";
import type {
  ProjectBeforeAfterSection,
  ProjectContentSection,
  ProjectGallerySection,
  ProjectMetricsSection,
  ProjectQuoteSection,
  ProjectSection,
} from "@/sanity/types";

function ContentSection({ section }: { section: ProjectContentSection }) {
  return (
    <section className="case-section case-preview-target" id={section.id} data-project-section-key={section._key}>
      <header className="case-section__header">
        <span>{section.label}</span>
        <h2>{section.heading}</h2>
      </header>
      <ProjectBody value={section.body} />
      {section.media ? <ProjectImage asset={section.media} className="case-section__media" /> : null}
    </section>
  );
}

function GallerySection({ section }: { section: ProjectGallerySection }) {
  return (
    <section className="case-gallery case-preview-target" aria-label="Project gallery" data-project-section-key={section._key}>
      {section.items.map((item) => (
        <figure className={`case-gallery__item case-gallery__item--${item.size}`} key={item._key}>
          <Image
            src={item.src}
            alt={item.alt}
            width={item.width}
            height={item.height}
            sizes={item.size === "wide" ? "(max-width: 700px) calc(100vw - 48px), 595px" : "(max-width: 700px) calc(100vw - 48px), 290px"}
          />
          {item.title || item.description ? (
            <figcaption>
              {item.title ? <strong>{item.title}</strong> : null}
              {item.description ? <span>{item.description}</span> : null}
            </figcaption>
          ) : null}
        </figure>
      ))}
    </section>
  );
}

function MetricsSection({ section }: { section: ProjectMetricsSection }) {
  return (
    <section className="case-section case-preview-target" id={section.id} data-project-section-key={section._key}>
      {section.heading ? (
        <header className="case-section__header">
          {section.label ? <span>{section.label}</span> : null}
          <h2>{section.heading}</h2>
        </header>
      ) : null}
      <div className="case-metrics">
        {section.items.map((item) => (
          <div key={item._key}>
            <strong>{item.value}</strong>
            <span>{item.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

function QuoteSection({ section }: { section: ProjectQuoteSection }) {
  return (
    <blockquote className="case-quote case-preview-target" id={section.id} data-project-section-key={section._key}>
      <p>{section.quote}</p>
      {section.attribution ? <cite>{section.attribution}</cite> : null}
    </blockquote>
  );
}

function BeforeAfterSection({ section }: { section: ProjectBeforeAfterSection }) {
  return (
    <section className="case-section case-preview-target" id={section.id} data-project-section-key={section._key}>
      {section.heading ? (
        <header className="case-section__header">
          {section.label ? <span>{section.label}</span> : null}
          <h2>{section.heading}</h2>
        </header>
      ) : null}
      <div className="case-before-after">
        <ProjectImage asset={section.before} />
        <ProjectImage asset={section.after} />
      </div>
    </section>
  );
}

export default function ProjectSections({ sections }: { sections: ProjectSection[] }) {
  return sections.filter((section) => !section.hidden).map((section) => {
    switch (section._type) {
      case "contentSection":
        return <ContentSection key={section._key} section={section} />;
      case "gallerySection":
        return <GallerySection key={section._key} section={section} />;
      case "metricsSection":
        return <MetricsSection key={section._key} section={section} />;
      case "quoteSection":
        return <QuoteSection key={section._key} section={section} />;
      case "beforeAfterSection":
        return <BeforeAfterSection key={section._key} section={section} />;
    }
  });
}
