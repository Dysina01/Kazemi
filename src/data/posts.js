import tarathumb from "../assets/Posts/tara-post.webp";
const taraImages = Object.entries(
  import.meta.glob("../assets/Posts/Tara/*.webp", {
    eager: true,
    import: "default",
  }),
)
  .sort(([a], [b]) => a.localeCompare(b))
  .map(([, image]) => image);

import sakenthumb from "../assets/Posts/Saken-Cover.webp";
const sakenImages = Object.entries(
  import.meta.glob("../assets/Posts/Saken/*.webp", {
    eager: true,
    import: "default",
  }),
)
  .sort(([a], [b]) => a.localeCompare(b))
  .map(([, image]) => image);

import DesignIran from "../assets/Posts/Design-Iran.webp";
import aitools from "../assets/Posts/AI-Tools.webp";

export const postCategories = ["All", "Design Procces", "Thought Piece"];

export const posts = [
  {
    // Saken
    id: "saken-design-procces",
    title: "Saken Design Process",
    subtitle: "Manage Your Building with Confidence!",
    category: "Design Procces",
    date: "2026-06-26",
    readTime: "6 min",
    cover: sakenthumb,
    images: sakenImages,
    body: [
      "Saken, When a Real Problem Motivates You to Build Something from Scratch… 🏡",
      "Many residential buildings are still managed through WhatsApp groups, paperwork, and scattered communication. The result? Unpaid maintenance fees, confusion, and frustrated residents. 😅",
      "In this redesign, I focused on removing unnecessary decisions, highlighting key information, and simplifying anything that required extra effort or thought from users.",
      "That’s where the idea for Saken was born—an app that brings every aspect of residential building management into one place:",
      "From paying maintenance fees and viewing financial reports to submitting maintenance requests, participating in resident polls, and even reserving shared building facilities. ❗",
      "I worked on this project alongside my amazing mentor, Parnaz Kazemi, and I’m grateful to have had her guidance and support throughout the journey (as always). 🙏",
    ],
    linkedinUrl: "https://www.linkedin.com/in/sinadalaei",
  },
  {
    //AI Use
    id: "ai-tools",
    title: "I’m Not a Programmer! But I Built Anyway",
    subtitle: "AI didn’t replace the process. It changed how I enter it.",
    category: "Thought Piece",
    date: "2026-06-08",
    readTime: "2 min",
    cover: aitools,
    images: [],
    body: [
      "Tools have changed. The speed of work has changed. The real question is: are we updating ourselves too?",
      "Over the past few days, I've been working on my personal portfolio.",
      "Here's the interesting part: I'm not a programmer.",
      "But with the help of ChatGPT, Claude, and Cursor, I was able to turn my ideas into reality much faster than I expected.",
      "Not because AI did all the work for me.",
      "I still had to think, make decisions, test things, break things, and rebuild them.",
      "But something feels different now.",
      "In the past, building certain things required months of learning before you could even start.",
      "Today, you can learn while you're building.",
      "Maybe the most valuable skill today isn't knowing everything.",
      "Maybe it's knowing how to use new tools and adapt to change.",
      "Because the tools aren't waiting for anyone.",
      "They're getting better every day.",
      "The question is: are we growing alongside them?",
    ],
    linkedinUrl: "https://www.linkedin.com/in/sinadalaei",
  },

  // Tara
  {
    id: "tara-design-process",
    title: "Tara Redesign Process",
    subtitle: "Idea to Prototype",
    category: "Design Procces",
    date: "2026-05-10",
    readTime: "5 min",
    cover: tarathumb,
    images: taraImages,
    body: [
      "Tara was more than just a redesign project for me — it was a real challenge. 🔥",
      "A while ago, I decided to redesign the Tara app at the request of my friend and valued mentor, Parnaz Kazemi.",
      "In this redesign, I focused on removing unnecessary decisions, highlighting key information, and simplifying anything that required extra effort or thought from users.",
      "I also worked on addressing the main usability issues reported by users while giving Tara a fresh and distinctive visual identity. ✨",
      "This post is a brief overview of the process I went through and a glimpse into the final outcome of the redes",
    ],
    linkedinUrl: "https://www.linkedin.com/in/sinadalaei",
  },

  //Persian Design
  {
    id: "why-iranian-design",
    title: "What Would an Persian UI Look Like?",
    subtitle: "Exploring a Missing Design Language",
    category: "Thought Piece",
    date: "2026-04-22",
    readTime: "3 min",
    cover: DesignIran,
    images: [],
    body: [
      "How is it possible that a country with such a rich history, culture, and visual heritage still doesn't have a recognizable Iranian UI design language?",
      "This question suddenly caught my attention and led me down an interesting path of exploration.",
      "Why do we rarely draw inspiration from Iranian visual identity when designing digital products? Instead, most of us naturally gravitate toward modern, minimalist interfaces shaped by global design trends. ✨",
      "But why?",
      "Is it because Iranian design lacks a clearly defined digital language?",
      "Do we assume users would reject it?",
      "Or is creating a modern, localized visual identity simply more challenging than it seems?",
      "That brings us to the bigger question:",
      "If an Iranian UI design language existed today, what would it look like?",
      "How would it balance cultural identity with usability and modern product standards?",
      "And perhaps most importantly—why haven't we seen a truly successful example of it yet?",
    ],
    linkedinUrl: "https://www.linkedin.com/in/sinadalaei",
  },
];
