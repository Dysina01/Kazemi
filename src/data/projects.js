import tarathumb from "../assets/Projects/Tara/Tara-Thumb.webp";
import sakenthumb from "../assets/Projects/Saken/Saken-Thumb.webp";
import arsinthumb from "../assets/Projects/Arsin/Arsin-Thumb.webp";
import { Badge } from "lucide-react";

export const disciplines = ["UI/UX", "Graphic"];

export const projects = [
  {
    id: "saken",
    title: "Saken",
    tags: ["real"],
    category: ["App Design"],
    discipline: "UI/UX",
    year: "2026",
    role: ["Role: UI/UX Designer"],
    badge: ["Real Project"],
    description: "lalalala",
    image: sakenthumb,

    overview: "My mission was to rebuild trust...",
    overviewImage: "/images/tara-mission.png",

    problem: "One of the biggest challenges...",
    problemImage: "/images/tara-challenge.png",

    research: "One of the biggest challenges...",
    researchImage: "/images/tara-challenge.png",

    middleImage: "/images/tara-middle.png",

    goals: "Reduce friction across all essential flows...",
    goalsImage: "/images/tara-goal.png",

    solution: "Reduce friction across all essential flows...",
    solutionImage: "/images/tara-goal.png",

    outcome: "The final redesign delivered a smoother onboarding experience...",

    finalImage: "/images/tara-middle.png",

    thoughtsSlug: "saken-design-procces",
  },

  {
    id: "tara",
    title: "Tara",
    tags: ["concept"],
    category: "App Design",
    discipline: "UI/UX",
    year: "2025",
    role: "UI/UX Designer",
    badge: ["UI", "UX"],
    description:
      "A credit-based shopping and payment app redesigned for Gen Z users — faster, clearer, and more trustworthy.",
    image: tarathumb,

    overview:
      "Tara is a credit-based shopping and payment app. In this redesign, I approached the project as a problem-solver: identifying real user pain points, fixing core flows, and rebuilding the experience for a faster, clearer, and more trustworthy product, especially for Gen Z users.",
    overviewImage: "/images/tara-mission.png",

    problem:
      "Users encountered significant friction during the identity verification process. One of the most critical issues affected users who had not yet received their physical national ID card. The flow only accepted a photo of the card itself, providing no alternative option to submit a tracking code or temporary receipt. As a result, many users were unable to complete verification and were forced to abandon the process.",
    problemImage: "/images/tara-challenge.png",

    research:
      "Through usability testing and user interviews, two key issues emerged: limitations in the verification flow and confusion caused by the interface design. These findings helped identify the areas with the greatest impact on the overall user experience.",
    researchImage: "/images/tara-challenge.png",

    middleImage: "/images/tara-middle.png",

    goals:
      "The redesign focused on simplifying key user journeys, improving the onboarding experience, increasing transparency during verification processes, and establishing a modern visual language that better reflects the needs and expectations of Gen Z users.",
    goalsImage: "/images/tara-goal.png",

    solution:
      "The final solution introduced a cleaner information architecture, clearer user guidance, improved visual hierarchy, and a more consistent design system. These changes helped users navigate the product with greater confidence and complete tasks more efficiently.",
    solutionImage: "/images/tara-goal.png",

    outcome:
      "The redesign resulted in a more approachable and intuitive experience that reduced confusion across critical flows. By improving clarity and trust, the product became easier to understand and more aligned with the expectations of modern digital users.",

    finalImage: "/images/tara-middle.png",

    thoughtsSlug: "tara-design-process",
  },

  {
    id: "arsin",
    title: "Arsin",
    tags: ["concept"],
    discipline: "UI/UX",
    category: "Dashboard",
    year: "2026",
    description:
      "A premium dashboard experience with smooth workflows and modern UI components.",
    image: arsinthumb,

    overview: "My mission was to rebuild trust...",
    overviewImage: "/images/tara-mission.png",

    problem: "One of the biggest challenges...",
    problemImage: "/images/tara-challenge.png",

    research: "One of the biggest challenges...",
    researchImage: "/images/tara-challenge.png",

    middleImage: "/images/tara-middle.png",

    goals: "Reduce friction across all essential flows...",
    goalsImage: "/images/tara-goal.png",

    solution: "Reduce friction across all essential flows...",
    solutionImage: "/images/tara-goal.png",

    outcome: "The final redesign delivered a smoother onboarding experience...",

    finalImage: "/images/tara-middle.png",

    thoughtsSlug: "",
  },
];
