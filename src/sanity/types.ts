import type { PortableTextBlock } from "@portabletext/types";

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

export type ProjectBody = string[] | PortableTextBlock[];

export type ProjectContentSection = {
  _key: string;
  _type: "contentSection";
  id: string;
  label: string;
  heading: string;
  body: ProjectBody;
  showInNavigation?: boolean;
  media?: ProjectAsset;
};

export type ProjectGallerySection = {
  _key: string;
  _type: "gallerySection";
  items: Array<ProjectAsset & {
    _key: string;
    size: "wide" | "narrow";
    title?: string;
    description?: string;
  }>;
};

export type ProjectMetricsSection = {
  _key: string;
  _type: "metricsSection";
  id?: string;
  label?: string;
  heading?: string;
  showInNavigation?: boolean;
  items: Array<{ _key: string; label: string; value: string }>;
};

export type ProjectQuoteSection = {
  _key: string;
  _type: "quoteSection";
  id?: string;
  quote: string;
  attribution?: string;
};

export type ProjectBeforeAfterSection = {
  _key: string;
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
