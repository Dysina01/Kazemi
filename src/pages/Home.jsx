import { motion } from "framer-motion";
import { ChevronRight, Check, ArrowDown, ImagePlus } from "lucide-react";

import { FaInstagram, FaYoutube, FaXTwitter } from "react-icons/fa6";
import { Link } from "react-router-dom";
import { translations } from "../data/translations";
import { useLanguage } from "../context/LanguageContext";
import { projects } from "../data/projects";
import { posts } from "../data/posts";
import Reveal from "../components/Reveal";
import yourPhoto from "../assets/parnaz.jpg";
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
      <section className="relative min-h-screen flex items-center px-6 py-24 overflow-hidden">
        <div className="w-full max-w-5xl mx-auto relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="
      flex
      flex-col
      md:flex-row
      items-center
      md:items-start
      gap-10
    "
          >
            {/* Avatar composition */}
            <div className="relative shrink-0">
              {/* floating badge top */}
              <motion.div
                animate={{ y: [0, -6, 0] }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="
          absolute
          -top-5
          -right-8
          px-3
          py-1.5
          rounded-full
          bg-white
          dark:bg-neutral-900
          border
          border-black/[0.08]
          dark:border-white/[0.1]
          shadow-lg
          text-xs
          text-neutral-500
        "
              >
                12+ years
              </motion.div>

              {/* Image shadow layer */}
              <div
                className="
          absolute
          inset-0
          rounded-[2rem]
          bg-indigo-500/20
          translate-x-3
          translate-y-3
          blur-sm
        "
              />
              <div
                className="
    absolute
    inset-0
    rounded-3xl
    bg-indigo-500/10
    translate-x-2
    translate-y-2
  "
              />
              <img
                src={yourPhoto}
                alt={t.heroTitle}
                className="
          relative
          w-32
          h-32
          md:w-40
          md:h-40
          rounded-[2rem]
          object-cover
          border
          border-black/[0.08]
          dark:border-white/[0.1]
          shadow-2xl
        "
              />

              {/* floating badge bottom */}
              <motion.div
                animate={{ y: [0, 6, 0] }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="
          absolute
          -bottom-4
          -left-8
          px-3
          py-1.5
          rounded-full
          bg-neutral-900
          dark:bg-white
          text-white
          dark:text-black
          text-xs
          shadow-lg
        "
              >
                Product Design
              </motion.div>
            </div>

            {/* Content */}
            <div
              className="
      flex-1
      text-center
      md:text-left
    "
            >
              <h1
                className="
          text-4xl
          md:text-6xl
          font-semibold
          tracking-tight
          leading-tight
          text-neutral-900
          dark:text-white
        "
              >
                {t.heroTitle}
              </h1>

              <p
                className="
          mt-3
          text-lg
          text-indigo-600
          dark:text-indigo-400
          font-medium
        "
              >
                {t.heroTag}
              </p>

              <p
                className="
          mt-6
          max-w-xl
          text-base
          md:text-lg
          leading-8
          text-[var(--muted)]
        "
              >
                I design digital products from research to polished experiences
                people love.
              </p>

              <div
                className="
          mt-8
          flex
          flex-wrap
          justify-center
          md:justify-start
          gap-3
        "
              >
                <Link
                  to="/works"
                  className="
            px-6
            py-3
            rounded-full
            bg-neutral-900
            dark:bg-white
            text-white
            dark:text-black
            text-sm
            font-medium
            shadow-xl
            shadow-black/10
            hover:-translate-y-1
            transition
          "
                >
                  {t.heroViewWork}
                </Link>

                <Link
                  to="/contact"
                  className="
            px-6
            py-3
            rounded-full
            border
            border-black/[0.1]
            dark:border-white/[0.15]
            text-sm
            font-medium
            hover:bg-neutral-100
            dark:hover:bg-neutral-900
            transition
          "
                >
                  {t.heroContact}
                </Link>
              </div>
            </div>
          </motion.div>

          {/* Stats */}
          <div
            className="
      mt-20
      pt-10
      border-t
      border-black/[0.06]
      dark:border-white/[0.08]
      grid
      grid-cols-2
      md:grid-cols-4
      gap-8
    "
          >
            <div>
              <p
                className="
          text-3xl
          font-semibold
          text-neutral-900
          dark:text-white
        "
              >
                12+
              </p>

              <p
                className="
          mt-2
          text-sm
          text-[var(--muted)]
        "
              >
                Years experience
              </p>
            </div>

            <div>
              <p
                className="
          text-3xl
          font-semibold
          text-neutral-900
          dark:text-white
        "
              >
                40+
              </p>

              <p
                className="
          mt-2
          text-sm
          text-[var(--muted)]
        "
              >
                Projects shipped
              </p>
            </div>

            <div>
              <p
                className="
          text-lg
          font-medium
          text-neutral-900
          dark:text-white
        "
              >
                Product Strategy
              </p>

              <p
                className="
          mt-2
          text-sm
          text-[var(--muted)]
        "
              >
                Core focus
              </p>
            </div>

            <div>
              <p
                className="
          text-lg
          font-medium
          text-neutral-900
          dark:text-white
        "
              >
                UX · Systems · Prototyping
              </p>

              <p
                className="
          mt-2
          text-sm
          text-[var(--muted)]
        "
              >
                Expertise
              </p>
            </div>
          </div>
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
