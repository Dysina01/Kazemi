import type { Project } from "./types";

export const fallbackProjects: Project[] = [
  {
    slug: "designing-a-portfolio",
    category: "Personal project",
    year: "2025",
    title: "Designing a portfolio",
    description:
      "Creating a portfolio system that balances storytelling, visual personality, and long-term scalability.",
    hero: {
      src: "/projects/designing-a-portfolio/hero.png",
      alt: "Portfolio content system overview",
      width: 900,
      height: 650,
    },
    facts: [
      { label: "Role", value: "Product Designer" },
      { label: "Timeline", value: "May 2026" },
      { label: "Team", value: "Me" },
      { label: "Platform", value: "Framer" },
    ],
    sections: [
      {
        _key: "overview",
        _type: "contentSection",
        id: "overview",
        label: "Overview",
        heading: "Creating a structure around storytelling",
        showInNavigation: true,
        body: [
          "As my experience expanded across product design, websites, and Framer development, my previous portfolio no longer reflected the quality or range of projects I wanted to showcase. New work was difficult to add, case studies lacked consistency, and the overall experience felt more like a collection of pages than a cohesive system. The goal was to create a portfolio that could support detailed storytelling, scale with future projects, and communicate both my design process and visual style. Rather than treating it as a simple redesign, I approached it as a product that would continue evolving over time.",
        ],
      },
      {
        _key: "problem",
        _type: "contentSection",
        id: "problem",
        label: "Problem",
        heading: "Balancing personality with clarity",
        showInNavigation: true,
        body: [
          "Many portfolio websites struggle to find the right balance between visual expression and usability. Some prioritize aesthetics but make projects difficult to understand, while others focus heavily on process and lose any sense of personality. I wanted to create an experience that felt visually distinctive without distracting from the work itself. The portfolio needed to support long-form storytelling, showcase a variety of project types, and remain easy to navigate across different devices. At the same time, it needed a structure that would allow future projects to be published quickly without rebuilding layouts from scratch.",
        ],
        media: {
          src: "/projects/designing-a-portfolio/content.png",
          alt: "Portfolio system problem definition",
          width: 900,
          height: 630,
        },
      },
      {
        _key: "design",
        _type: "contentSection",
        id: "design",
        label: "Design",
        heading: "Building a flexible content system",
        showInNavigation: true,
        body: [
          "The design process focused on creating a system rather than a collection of individual pages. I explored different approaches to project presentation, navigation, and case study layouts before settling on a modular structure built around reusable content blocks. Typography, spacing, and visual hierarchy were carefully refined to support both quick scanning and deeper reading. Subtle gradients, imagery, and motion were introduced selectively to create personality while keeping the projects as the primary focus. To support future growth, I built the portfolio using reusable CMS-driven sections that could adapt to different project types while maintaining consistency throughout the experience. This approach reduced maintenance effort and made it easier to scale the portfolio over time.",
        ],
        media: {
          src: "/projects/designing-a-portfolio/content.png",
          alt: "Reusable portfolio content blocks",
          width: 900,
          height: 630,
        },
      },
      {
        _key: "outcome",
        _type: "contentSection",
        id: "outcome",
        label: "Outcome",
        heading: "A portfolio designed to grow with the work",
        showInNavigation: true,
        body: [
          "The final experience provides a flexible foundation for showcasing product design, websites, and future projects. It combines detailed storytelling with a scalable system that supports ongoing updates without sacrificing consistency. More importantly, the project reinforced the value of designing systems rather than individual pages. By focusing on structure, hierarchy, and maintainability, the portfolio became more than a presentation tool—it became a framework that can continue evolving alongside my work.",
        ],
      },
      {
        _key: "gallery",
        _type: "gallerySection",
        items: [
          {
            _key: "gallery-1",
            src: "/projects/designing-a-portfolio/gallery-wide-1.png",
            alt: "Desktop project preview",
            width: 595,
            height: 457,
            size: "wide",
            title: "Project 01",
            description: "Desktop experience",
          },
          {
            _key: "gallery-2",
            src: "/projects/designing-a-portfolio/gallery-tall-1.png",
            alt: "Mobile project preview",
            width: 290,
            height: 457,
            size: "narrow",
            title: "Project 02",
            description: "Mobile experience",
          },
          {
            _key: "gallery-3",
            src: "/projects/designing-a-portfolio/gallery-tall-2.png",
            alt: "Dashboard project preview",
            width: 290,
            height: 457,
            size: "narrow",
            title: "Project 03",
            description: "Product dashboard",
          },
          {
            _key: "gallery-4",
            src: "/projects/designing-a-portfolio/gallery-wide-2.png",
            alt: "Media product preview",
            width: 595,
            height: 457,
            size: "wide",
            title: "Project 04",
            description: "Media platform",
          },
        ],
      },
    ],
    seo: {
      title: "Designing a portfolio",
      description:
        "Creating a scalable portfolio system for detailed product storytelling.",
    },
  },
];

export function getFallbackProject(slug: string) {
  return fallbackProjects.find((project) => project.slug === slug);
}
