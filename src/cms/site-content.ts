import { createClient as createPublicClient } from "@supabase/supabase-js";
import { cache } from "react";
import { supabasePublishableKey, supabaseUrl } from "@/lib/supabase/env";

export type HomeContent = {
  hero: { name: string; tagline: string; primaryCta: string; secondaryCta: string };
  projects: { title: string; subtitle: string };
  process: { word: string; labels: string[] };
  bio: { kicker: string; name: string; role: string; profileImage: string; paragraphs: string[] };
  teaching: { title: string; subtitle: string };
  thoughts: { title: string; subtitle: string; items: Array<{ meta: string; title: string; description: string; href: string }> };
  footer: { email: string; linkedin: string; behance: string; resume: string };
  seo: { title: string; description: string };
};

export const defaultHomeContent: HomeContent = {
  hero: { name: "Parnaz Kazemi", tagline: "business & product & Strategy", primaryCta: "My Works", secondaryCta: "Contact" },
  projects: { title: "PROJECTS", subtitle: "Some of my Works" },
  process: { word: "PRODUCT", labels: ["RESEARCH", "PRODUCT", "STRATEGY", "DESIGN", "BUSINESS", "HANDOFF"] },
  bio: {
    kicker: "Hey, i’m", name: "Parnaz Kazemi", role: "Digital Product Manager & Consultant", profileImage: "/assets/profile.png",
    paragraphs: [
      "Product Design Leader with +8 years of experience building scalable digital products, design systems, and high-performing teams across fintech and banking.",
      "I specialize in turning complex challenges into structured product ecosystems by combining UX strategy, DesignOps, and product thinking. I’ve led large-scale redesigns, built React-based design systems across 50+ products, and established frameworks that improve collaboration between design, product, and engineering teams.",
      "Beyond designing interfaces, I focus on building the systems, processes, and cultures that help teams create meaningful user experiences and measurable business impact.",
    ],
  },
  teaching: { title: "DESIGNING THE NEXT GENERATION", subtitle: "Teaching. Mentoring. Growing." },
  thoughts: {
    title: "THOUGHTS", subtitle: "Some of my Works",
    items: [
      { meta: "Design Process · 6 min", title: "Saken Design Process", description: "Manage Your Building with Confidence!", href: "#" },
      { meta: "Thought Piece · 2 min", title: "I’m Not a Programmer! But I Built Anyway", description: "AI didn’t replace the process. It changed how I enter it.", href: "#" },
      { meta: "Design Process · 5 min", title: "Tara Redesign Process", description: "Idea to Prototype", href: "#" },
    ],
  },
  footer: { email: "hello@example.com", linkedin: "#", behance: "#", resume: "#" },
  seo: {
    title: "Parnaz Kazemi — Product Manager & Consultant",
    description: "Portfolio of Parnaz Kazemi, a digital product manager and consultant.",
  },
};

const client = createPublicClient(supabaseUrl, supabasePublishableKey, { auth: { persistSession: false, autoRefreshToken: false } });

export function mergeHomeContent(value?: Partial<HomeContent> | null): HomeContent {
  return {
    hero: { ...defaultHomeContent.hero, ...value?.hero },
    projects: { ...defaultHomeContent.projects, ...value?.projects },
    process: { ...defaultHomeContent.process, ...value?.process, labels: value?.process?.labels?.length ? value.process.labels : defaultHomeContent.process.labels },
    bio: { ...defaultHomeContent.bio, ...value?.bio, paragraphs: value?.bio?.paragraphs?.length ? value.bio.paragraphs : defaultHomeContent.bio.paragraphs },
    teaching: { ...defaultHomeContent.teaching, ...value?.teaching },
    thoughts: { ...defaultHomeContent.thoughts, ...value?.thoughts, items: value?.thoughts?.items?.length ? value.thoughts.items : defaultHomeContent.thoughts.items },
    footer: { ...defaultHomeContent.footer, ...value?.footer },
    seo: { ...defaultHomeContent.seo, ...value?.seo },
  };
}

export const getHomeContent = cache(async () => {
  const { data } = await client.from("site_settings").select("content").eq("id", "home").maybeSingle();
  return mergeHomeContent(data?.content as Partial<HomeContent> | undefined);
});
