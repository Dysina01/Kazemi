import { motion } from "framer-motion";
import {
  ChevronRight,
  Check,
  ArrowDown,
  ImagePlus,
  Instagram,
  Youtube,
  Twitter,
} from "lucide-react";
import { Link } from "react-router-dom";
import { translations } from "../data/translations";
import { useLanguage } from "../context/LanguageContext";
import { projects } from "../data/projects";
import { posts } from "../data/posts";
import Reveal from "../components/Reveal";
import featuredImage from "../assets/featured-light.webp";

const ease = [0.25, 0.1, 0.25, 1];

const navLinks = [
  { to: "/about", key: "navAbout" },
  { to: "/works", key: "navWorks" },
  { to: "/thoughts", key: "navThoughts" },
  { to: "/contact", key: "navContact" },
];

export default function Home() {
  const { language } = useLanguage();
  const t = translations[language];
  const featured = projects[0];

  const stats = [
    { value: t.statYearsValue, label: t.statYears },
    { value: t.statProjectsValue, label: t.statProjects },
    { value: t.statFocusValue, label: t.statFocus },
  ];

  return (
    <main className="overflow-x-hidden">
      {/* Hero */}
      <section className="relative px-3 pt-3 md:px-5 md:pt-5">
        <div className="relative rounded-[2rem] md:rounded-[2.5rem] overflow-hidden bg-gradient-to-br from-indigo-50 via-white to-violet-50 dark:from-indigo-950/40 dark:via-neutral-950 dark:to-violet-950/30 ring-1 ring-black/[0.04] dark:ring-white/[0.06]">
          {/* Decorative diagonal streaks */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-40 dark:opacity-30">
            <div className="absolute -top-10 left-[20%] w-[2px] h-[140%] bg-gradient-to-b from-transparent via-indigo-400/40 to-transparent rotate-[20deg]" />
            <div className="absolute -top-10 left-[45%] w-[2px] h-[140%] bg-gradient-to-b from-transparent via-violet-400/40 to-transparent rotate-[20deg]" />
            <div className="absolute -top-10 left-[70%] w-[2px] h-[140%] bg-gradient-to-b from-transparent via-indigo-400/30 to-transparent rotate-[20deg]" />
          </div>

          <div className="relative px-6 md:px-14 pt-16 md:pt-20 pb-8">
            {/* Outline echo of the name, sitting behind */}
            <div
              aria-hidden="true"
              className="absolute inset-x-0 top-[38%] text-center select-none pointer-events-none"
            >
              <span
                className="text-[clamp(3rem,14vw,10rem)] font-black tracking-tight leading-none"
                style={{
                  WebkitTextStroke: "1px rgba(79,70,229,0.15)",
                  color: "transparent",
                }}
              >
                {t.heroTitle}
              </span>
            </div>

            {/* Big solid title */}
            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease }}
              className="relative z-10 text-center text-[clamp(2.75rem,11vw,8.5rem)] font-black tracking-tight leading-[0.95] text-neutral-900 dark:text-white"
            >
              {t.heroTitle}
            </motion.h1>

            {/* Left / right supporting copy + photo slot */}
            <div className="relative mt-4 md:mt-0 grid md:grid-cols-[1fr_auto_1fr] gap-8 md:gap-6 items-end">
              {/* Left column */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.15, ease }}
                className="order-2 md:order-1 text-center md:text-left"
              >
                <p className="text-sm md:text-base text-neutral-600 dark:text-neutral-300 leading-relaxed max-w-xs mx-auto md:mx-0">
                  {t.heroDescriptionSecondary || t.heroDescription}
                </p>
                <div className="mt-5 flex justify-center md:justify-start gap-2.5">
                  <a
                    href="https://linkedin.com/in/sinadalaei"
                    target="_blank"
                    rel="noreferrer"
                    aria-label="LinkedIn"
                    className="w-10 h-10 rounded-full bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 flex items-center justify-center hover:bg-indigo-600 dark:hover:bg-indigo-400 transition-colors"
                  >
                    <Instagram size={16} />
                  </a>
                  <a
                    href="https://behance.net/sinadalaei1"
                    target="_blank"
                    rel="noreferrer"
                    aria-label="Behance"
                    className="w-10 h-10 rounded-full bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 flex items-center justify-center hover:bg-indigo-600 dark:hover:bg-indigo-400 transition-colors"
                  >
                    <Youtube size={16} />
                  </a>
                  <a
                    href="mailto:sina10dalaei@gmail.com"
                    aria-label="Email"
                    className="w-10 h-10 rounded-full bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 flex items-center justify-center hover:bg-indigo-600 dark:hover:bg-indigo-400 transition-colors"
                  >
                    <Twitter size={16} />
                  </a>
                </div>
              </motion.div>

              {/* Center — empty photo slot, ready for upload */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.1, ease }}
                className="order-1 md:order-2 relative mx-auto"
              >
                {/* Replace this block with an <img> once you have a photo:
                    <img src={yourPhoto} alt="Sina Dalaei" className="w-[260px] md:w-[340px] h-auto object-contain" />
                */}
                <div className="w-[220px] h-[280px] md:w-[300px] md:h-[380px] rounded-t-[140px] rounded-b-2xl border-2 border-dashed border-indigo-300/60 dark:border-indigo-400/30 bg-white/40 dark:bg-white/[0.03] backdrop-blur-sm flex flex-col items-center justify-center gap-3 text-neutral-400 dark:text-neutral-500">
                  <ImagePlus size={28} strokeWidth={1.5} />
                  <span className="text-xs text-center px-6 leading-relaxed">
                    Add your photo here
                  </span>
                </div>
              </motion.div>

              {/* Right column */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.2, ease }}
                className="order-3 relative text-center md:text-right"
              >
                <p className="text-sm md:text-base text-neutral-600 dark:text-neutral-300 leading-relaxed max-w-xs mx-auto md:ml-auto">
                  {t.heroDescription}
                </p>

                <Link
                  to="/works"
                  aria-label="Scroll to work"
                  className="hidden md:inline-flex mt-6 w-11 h-11 rounded-full bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 items-center justify-center hover:bg-indigo-600 dark:hover:bg-indigo-400 transition-colors"
                >
                  <ArrowDown size={16} />
                </Link>
              </motion.div>
            </div>
          </div>

          {/* Bottom nav bar */}
          <div className="relative bg-neutral-900 dark:bg-black">
            <nav className="flex flex-wrap items-center justify-center gap-x-10 gap-y-3 px-6 py-6">
              {navLinks.map(({ to, key }) => (
                <Link
                  key={to}
                  to={to}
                  className="text-sm md:text-base font-medium text-neutral-300 hover:text-white transition-colors"
                >
                  {t[key]}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </section>

      {/* Quick CTA row under hero */}
      <div className="px-6 pt-10 pb-4 flex flex-wrap items-center justify-center gap-4">
        <Link
          to="/works"
          className="btn-primary shadow-[0_8px_24px_-6px_rgba(79,70,229,0.35)] hover:-translate-y-0.5 transition-all duration-300"
        >
          {t.heroViewWork}
        </Link>
        <Link
          to="/contact"
          className="btn-secondary hover:gap-2.5 transition-all duration-300"
        >
          {t.heroContact}
          <ChevronRight size={14} />
        </Link>
      </div>

      {/* Stats */}
      <div className="px-6 pb-16 md:pb-24 flex items-center justify-center">
        {stats.map((stat, i) => (
          <div key={stat.label} className="flex items-center">
            {i > 0 && (
              <span className="h-10 w-px bg-gradient-to-b from-transparent via-black/10 dark:via-white/10 to-transparent mx-8 md:mx-14" />
            )}
            <div className="text-center">
              <p className="text-2xl md:text-3xl font-semibold tracking-tight bg-gradient-to-r from-indigo-500 to-violet-500 bg-clip-text text-transparent">
                {stat.value}
              </p>
              <p className="mt-1.5 text-xs md:text-sm text-[var(--muted)]">
                {stat.label}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Featured project */}
      <section className="px-6 pb-24 md:pb-32">
        <Reveal>
          <div className="max-w-6xl mx-auto">
            <div className="text-center max-w-3xl mx-auto mb-10 md:mb-14">
              <p className="text-sm font-medium text-[var(--indigo)] mb-3">
                {t.sectionFeatured}
              </p>
              <h2 className="text-3xl md:text-5xl font-semibold tracking-tight leading-tight">
                {t.featuredTitle}
              </h2>
              <p className="mt-5 text-base md:text-lg text-[var(--muted)] leading-relaxed">
                {t.featuredDescription}
              </p>
            </div>

            <Link to={`/project/${featured?.id}`} className="group block">
              <div className="featured-frame">
                <img
                  src={featuredImage}
                  alt={featured?.title ?? "Featured project"}
                  className="w-full aspect-[16/10] md:aspect-[16/9] object-cover object-top transition-transform duration-700 ease-out group-hover:scale-[1.015]"
                />
              </div>

              <div className="mt-8 md:mt-10 grid md:grid-cols-[1fr_auto] gap-8 items-start">
                <div className="text-center md:text-start">
                  <ul className="flex flex-col gap-3 mb-6 md:mb-0">
                    {t.featuredHighlights.map((item) => (
                      <li
                        key={item}
                        className="flex items-center justify-center md:justify-start gap-2.5 text-sm md:text-base text-[var(--muted)]"
                      >
                        <span className="flex items-center justify-center w-5 h-5 rounded-full bg-[var(--indigo)]/10 text-[var(--indigo)] shrink-0">
                          <Check size={12} strokeWidth={2.5} />
                        </span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex flex-col items-center md:items-end gap-4">
                  <div className="flex flex-wrap items-center justify-center md:justify-end gap-2">
                    {[t.featuredRole, t.featuredYear, t.featuredType].map(
                      (meta) => (
                        <span
                          key={meta}
                          className="px-3 py-1 rounded-full text-xs font-medium bg-neutral-100 dark:bg-neutral-900 text-[var(--muted)]"
                        >
                          {meta}
                        </span>
                      ),
                    )}
                  </div>
                  <span className="link-arrow">
                    {t.viewCaseStudy}
                    <ChevronRight size={14} />
                  </span>
                </div>
              </div>
            </Link>
          </div>
        </Reveal>
      </section>

      {/* Selected work */}
      <section className="section-block px-6 bg-neutral-50 dark:bg-neutral-950/50">
        <div className="max-w-6xl mx-auto">
          <Reveal>
            <div className="text-center mb-14 md:mb-20">
              <h2 className="section-heading">{t.sectionWork}</h2>
            </div>
          </Reveal>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
            {projects.map((project) => (
              <Reveal key={project.id}>
                <Link
                  to={`/project/${project.id}`}
                  className="group block text-center"
                >
                  <div className="overflow-hidden rounded-2xl bg-neutral-100 dark:bg-neutral-900 mb-5">
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full aspect-[4/3] object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                    />
                  </div>
                  <h3 className="text-lg md:text-xl font-semibold tracking-tight group-hover:text-[var(--indigo)] transition-colors duration-300">
                    {project.title}
                  </h3>
                  <p className="mt-1 text-sm text-[var(--muted)]">
                    {Array.isArray(project.category)
                      ? project.category.join(" · ")
                      : project.category}
                  </p>
                </Link>
              </Reveal>
            ))}
          </div>

          <Reveal>
            <div className="text-center mt-14">
              <Link to="/works" className="link-arrow">
                {t.seeAll}
                <ChevronRight size={14} />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* CTA */}
      <section className="section-block px-6 text-center">
        <Reveal>
          <div className="max-w-2xl mx-auto">
            <h2 className="section-heading">{t.ctaTitle}</h2>
            <p className="mt-4 text-lg md:text-xl text-[var(--muted)] leading-relaxed">
              {t.ctaDescription}
            </p>
            <div className="mt-8">
              <Link to="/contact" className="btn-primary">
                {t.ctaButton}
              </Link>
            </div>
          </div>
        </Reveal>
      </section>

      {/* Thoughts */}
      <section className="section-block px-6 bg-neutral-50 dark:bg-neutral-950/50">
        <div className="max-w-4xl mx-auto">
          <Reveal>
            <div className="text-center mb-14 md:mb-16">
              <h2 className="section-heading">{t.sectionThoughts}</h2>
            </div>
          </Reveal>

          <div className="flex flex-col gap-3">
            {posts.slice(0, 3).map((post) => (
              <Reveal key={post.id}>
                <Link
                  to={`/thoughts/${post.id}`}
                  className="group flex flex-col items-center text-center gap-2 py-6 px-4 border-b border-black/[0.06] dark:border-white/[0.08] last:border-0 hover:opacity-70 transition-opacity duration-200"
                >
                  <p className="text-xs text-[var(--muted)]">
                    {post.category} · {post.readTime}
                  </p>
                  <h3 className="text-base md:text-lg font-medium tracking-tight max-w-lg">
                    {post.title}
                  </h3>
                  {post.subtitle && (
                    <p className="text-sm text-[var(--muted)] max-w-md line-clamp-2">
                      {post.subtitle}
                    </p>
                  )}
                  <span className="link-arrow mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    {t.learnMore}
                    <ChevronRight size={14} />
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>

          <Reveal>
            <div className="text-center mt-12">
              <Link to="/thoughts" className="link-arrow">
                {t.seeAll}
                <ChevronRight size={14} />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
