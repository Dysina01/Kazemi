import type { ProjectRecord } from "@/cms/projects";

export function createEmptyProject(): ProjectRecord {
  return {
    id: "",
    slug: "",
    title: "",
    category: "",
    year: String(new Date().getFullYear()),
    description: "",
    hero: { src: "", alt: "", width: 1600, height: 1000 },
    facts: [],
    sections: [],
    status: "draft",
    featured: false,
    sortOrder: 0,
    seo: { title: "", description: "" },
  };
}
