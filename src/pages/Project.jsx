import { useParams, Link } from "react-router-dom";
import { projects } from "../data/projects";
import { motion } from "framer-motion";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1], delay },
});

const fadeIn = (delay = 0) => ({
  initial: { opacity: 0 },
  whileInView: { opacity: 1 },
  viewport: { once: true },
  transition: { duration: 0.7, delay },
});

// Thin divider between sections
function Divider() {
  return (
    <div className="w-full h-px bg-gradient-to-r from-transparent via-neutral-200 dark:via-white/10 to-transparent" />
  );
}

// Mission, Challenge, Goal — alternating layout with numbered label
function NarrativeSection({ label, index, text, image, reverse }) {
  const num = String(index).padStart(2, "0");

  return (
    <>
      <Divider />
      <motion.section
        {...fadeUp()}
        className={`grid md:grid-cols-2 gap-12 md:gap-24 items-center ${
          reverse ? "md:[&>*:first-child]:order-2" : ""
        }`}
      >
        {/* Text side */}
        <div className="space-y-4 relative">
          {/* Faded index number — background texture */}
          <span
            aria-hidden="true"
            className="absolute -top-6 -left-2 text-[6rem] font-bold leading-none select-none pointer-events-none text-neutral-900/[0.04] dark:text-white/[0.04]"
          >
            {num}
          </span>

          {/* Numbered gradient label */}
          <p className="text-s uppercase tracking-[0.2em] font-medium bg-gradient-to-r from-sky-500 via-violet-500 to-cyan-500 bg-clip-text text-transparent">
            {num} · {label}
          </p>

          <p className="text-neutral-600 dark:text-neutral-300 leading-relaxed text-base md:text-lg relative z-10">
            {text}
          </p>
        </div>

        {/* Image side */}
        {image && (
          <div className="glass-card overflow-hidden rounded-2xl">
            <img
              src={image}
              alt={label}
              className="w-full aspect-[4/3] object-cover"
            />
          </div>
        )}
      </motion.section>
    </>
  );
}

export default function Project() {
  const { id } = useParams();
  const project = projects.find((item) => item.id === id);

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center text-neutral-500">
        Project not found.
      </div>
    );
  }

  const narrativeSections = [
    project.overview && {
      key: "overview",
      label: "Overview",
      text: project.overview,
      image: project.overviewImage,
      reverse: false,
    },
    project.problem && {
      key: "problem",
      label: "Problem",
      text: project.problem,
      image: project.problemImage,
      reverse: true,
    },
    project.research && {
      key: "research",
      label: "Research",
      text: project.research,
      image: project.researchImage,
      reverse: false,
    },
    project.goals && {
      key: "goals",
      label: "Goals",
      text: project.goals,
      image: project.goalsImage,
      reverse: true,
    },
    project.solution && {
      key: "solution",
      label: "Solution",
      text: project.solution,
      image: project.solutionImage,
      reverse: false,
    },
  ].filter(Boolean);

  return (
    <main className="page-shell min-h-screen">
      <div className="max-w-5xl mx-auto space-y-16 md:space-y-20">
        {/* ── Header ── */}
        <motion.div {...fadeUp()} className="space-y-6">
          {/* ── Back link ── */}
          <motion.div {...fadeIn()}>
            <Link
              to="/works"
              className="inline-flex items-center mb-4 gap-2 text-sm text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200 transition-colors"
            >
              <span>←</span> All Projects
            </Link>
          </motion.div>

          {/* Category label — gradient accent */}
          <p className="text-s uppercase tracking-[0.2em] font-medium bg-gradient-to-r from-sky-500 via-violet-500 to-cyan-500 bg-clip-text text-transparent">
            {project.category}
          </p>

          <h1 className="page-heading">{project.title}</h1>

          {/* Meta row */}
          <div className="flex flex-wrap items-center gap-2 text-sm text-neutral-500">
            {project.role && (
              <span className="glass-card px-3 py-1 rounded-full">
                {project.role}
              </span>
            )}
            {project.badge?.map((tag) => (
              <span key={tag} className="glass-card px-3 py-1 rounded-full">
                {tag}
              </span>
            ))}
            <span className="ml-auto">{project.year}</span>
          </div>

          {/* One-liner description */}
          {project.description && (
            <p className="text-neutral-600 dark:text-neutral-300 leading-relaxed text-base md:text-lg max-w-2xl">
              {project.description}
            </p>
          )}
        </motion.div>
        {/* ── Hero image ── */}
        <motion.div
          {...fadeIn(0.1)}
          className="glass-card overflow-hidden rounded-2xl"
        >
          <img
            src={project.image}
            alt={project.title}
            className="w-full aspect-[16/10] md:aspect-[16/9] object-cover"
          />
        </motion.div>
        {/* ── First narrative sections ── */}
        {narrativeSections.slice(0, 3).map((section, i) => (
          <NarrativeSection
            key={section.key}
            index={i + 1}
            label={section.label}
            text={section.text}
            image={section.image}
            reverse={section.reverse}
          />
        ))}

        {/* ── Middle image (after Overview / Problem / Research) ── */}
        {project.middleImage && (
          <motion.div
            {...fadeIn(0.1)}
            className="glass-card overflow-hidden rounded-2xl"
          >
            <img
              src={project.middleImage}
              alt={`${project.title} showcase`}
              className="w-full aspect-[16/10] md:aspect-[16/9] object-cover"
            />
          </motion.div>
        )}

        {/* ── Remaining narrative sections ── */}
        {narrativeSections.slice(3).map((section, i) => (
          <NarrativeSection
            key={section.key}
            index={i + 4}
            label={section.label}
            text={section.text}
            image={section.image}
            reverse={section.reverse}
          />
        ))}

        {(project.outcome || project.result) && (
          <>
            <Divider />
            <motion.section {...fadeUp()} className="space-y-5 relative">
              <span
                aria-hidden="true"
                className="absolute -top-6 -left-2 text-[6rem] font-bold leading-none select-none pointer-events-none text-neutral-900/[0.04] dark:text-white/[0.04]"
              >
                {String(narrativeSections.length + 1).padStart(2, "0")}
              </span>
              <p className="text-s uppercase tracking-[0.2em] font-medium bg-gradient-to-r from-sky-500 via-violet-500 to-cyan-500 bg-clip-text text-transparent">
                {String(narrativeSections.length + 1).padStart(2, "0")} ·
                Outcome
              </p>
              <p className="text-neutral-600 dark:text-neutral-300 leading-relaxed text-base md:text-lg max-w-3xl relative z-10">
                {project.outcome || project.result}
              </p>
            </motion.section>
          </>
        )}
        {project.finalImage && (project.outcome || project.result) && (
          <motion.div
            {...fadeIn(0.1)}
            className="glass-card overflow-hidden rounded-2xl"
          >
            <img
              src={project.finalImage}
              alt={`${project.title} final showcase`}
              className="w-full aspect-[16/10] md:aspect-[16/9] object-cover"
            />
          </motion.div>
        )}
      </div>

      {/* Thoughts CTA */}
      {project.thoughtsSlug && (
        <div className="flex justify-center pb-10 pt-24">
          <Link
            to={`/thoughts/${project.thoughtsSlug}`}
            className="glass-card px-8 py-4 text-sm font-medium hover:opacity-80 transition-opacity"
          >
            Read Design Process
          </Link>
        </div>
      )}
    </main>
  );
}
