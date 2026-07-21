import { motion } from "framer-motion";
import { ChevronRight, Check } from "lucide-react";
import { Link } from "react-router-dom";
import { translations } from "../data/translations";
import { useLanguage } from "../context/LanguageContext";
import { projects } from "../data/projects";
import { posts } from "../data/posts";
import Reveal from "../components/Reveal";
import featuredImage from "../assets/featured-light.webp";

const ease = [0.25, 0.1, 0.25, 1];

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
      <section className="relative min-h-[calc(100vh-5rem)] flex flex-col items-center justify-center text-center px-6 pt-28 pb-20 md:pb-28">
        <div className="hero-glow absolute inset-0 pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto w-full">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-black/[0.06] dark:border-white/[0.08] bg-white/70 dark:bg-white/[0.04] backdrop-blur-xl text-xs md:text-sm text-[var(--muted)] mb-8"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-60" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            {t.heroAvailable}
            <span className="text-black/15 dark:text-white/15">·</span>
            {t.heroTag}
            <span className="text-black/15 dark:text-white/15">·</span>
            {t.statYearsValue}
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.05, ease }}
            className="text-[clamp(2.75rem,8vw,5.5rem)] font-semibold tracking-tight leading-[1.05]"
          >
            {t.heroTitle}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.12, ease }}
            className="mt-6 text-lg md:text-2xl text-[var(--muted)] font-normal max-w-2xl mx-auto leading-relaxed"
          >
            {t.heroDescription}
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.18, ease }}
            className="mt-4 text-base md:text-lg text-[var(--muted)]/80 max-w-xl mx-auto leading-relaxed"
          >
            {t.heroDescriptionSecondary}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.24, ease }}
            className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4 max-w-3xl mx-auto"
          >
            {stats.map((stat) => (
              <div key={stat.label} className="hero-stat text-center">
                <p className="text-2xl md:text-3xl font-semibold tracking-tight text-[var(--indigo)]">
                  {stat.value}
                </p>
                <p className="mt-1 text-xs md:text-sm text-[var(--muted)]">
                  {stat.label}
                </p>
              </div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.32, ease }}
            className="mt-8 flex flex-wrap items-center justify-center gap-2 md:gap-2.5"
          >
            {t.heroSkills.map((skill) => (
              <span key={skill} className="skill-pill">
                {skill}
              </span>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.38, ease }}
            className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-3"
          >
            <Link to="/works" className="btn-primary">
              {t.heroViewWork}
            </Link>
            <Link to="/contact" className="btn-secondary">
              {t.heroContact}
              <ChevronRight size={14} />
            </Link>
          </motion.div>
        </div>
      </section>

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

            <Link
              to={`/project/${featured?.id}`}
              className="group block"
            >
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
                <Link to={`/project/${project.id}`} className="group block text-center">
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
