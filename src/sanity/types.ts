export type ProjectAsset = {
  src: string;
  alt: string;
  width: number;
  height: number;
};

export type ProjectFact = {
  label: string;
  value: string;
};

export type ProjectBody = string[];

type ProjectSectionBase = {
  _key: string;
  hidden?: boolean;
};

export type ProjectContentSection = ProjectSectionBase & {
  _type: "contentSection";
  id: string;
  label: string;
  heading: string;
  body: ProjectBody;
  showInNavigation?: boolean;
  media?: ProjectAsset;
};

export type ProjectGallerySection = ProjectSectionBase & {
  _type: "gallerySection";
  items: Array<ProjectAsset & {
    _key: string;
    size: "wide" | "narrow";
    title?: string;
    description?: string;
  }>;
};

export type ProjectMetricsSection = ProjectSectionBase & {
  _type: "metricsSection";
  id?: string;
  label?: string;
  heading?: string;
  showInNavigation?: boolean;
  items: Array<{ _key: string; label: string; value: string }>;
};

export type ProjectQuoteSection = ProjectSectionBase & {
  _type: "quoteSection";
  id?: string;
  quote: string;
  attribution?: string;
};

export type ProjectBeforeAfterSection = ProjectSectionBase & {
  _type: "beforeAfterSection";
  id?: string;
  label?: string;
  heading?: string;
  showInNavigation?: boolean;
  before: ProjectAsset;
  after: ProjectAsset;
};

export type ProjectSection =
  | ProjectContentSection
  | ProjectGallerySection
  | ProjectMetricsSection
  | ProjectQuoteSection
  | ProjectBeforeAfterSection;

export type Project = {
  slug: string;
  title: string;
  category: string;
  year: string;
  description: string;
  hero: ProjectAsset;
  facts: ProjectFact[];
  externalUrl?: string;
  sections: ProjectSection[];
  seo?: {
    title?: string;
    description?: string;
  };
};
