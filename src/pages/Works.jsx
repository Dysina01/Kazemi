import { useState } from "react";
import { projects } from "../data/projects";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

function ProjectCard({ project, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ delay: index * 0.08, duration: 0.5 }}
    >
      <Link to={`/project/${project.id}`} className="group block">
        <div className="glass-card overflow-hidden transition-all duration-500 group-hover:-translate-y-1">
          <img
            src={project.image}
            alt={project.title}
            className="w-full aspect-[16/10] object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="p-6">
            <div className="flex items-baseline justify-between gap-4 mb-3">
              <h2 className="text-xl font-semibold">{project.title}</h2>
              <span className="text-sm text-neutral-500 shrink-0">
                {project.year}
              </span>
            </div>
            <p className="text-neutral-600 dark:text-neutral-300 text-sm leading-relaxed line-clamp-2">
              {project.description}
            </p>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export default function Works() {
  const [activeFilters, setActiveFilters] = useState([]);

  const filtered =
    activeFilters.length === 0
      ? projects
      : projects.filter((project) =>
          project.tags?.some((tag) => activeFilters.includes(tag)),
        );

  const filters = [
    { label: "Real Project", value: "real" },
    { label: "Concept Project", value: "concept" },
    { label: "UI Design", value: "ui" },
    { label: "UX Research", value: "ux" },
  ];

  return (
    <main className="page-shell min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12 md:mb-16">
          <p className="section-label">Selected Works</p>
          <h1 className="page-heading">Projects</h1>
        </div>

        <div className="flex flex-wrap gap-2 mb-10 md:mb-12">
          {filters.map((filter) => {
            const isActive = activeFilters.includes(filter.value);

            return (
              <button
                key={filter.value}
                onClick={() =>
                  setActiveFilters((prev) =>
                    prev.includes(filter.value)
                      ? prev.filter((v) => v !== filter.value)
                      : [...prev, filter.value],
                  )
                }
                className={`
                  px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300
                  border backdrop-blur-xl
                  ${
                    isActive
                      ? "bg-neutral-900 text-white border-neutral-900 dark:bg-white dark:text-neutral-900 dark:border-white"
                      : "bg-white/30 dark:bg-white/5 border-black/5 dark:border-white/10 text-neutral-600 dark:text-neutral-300 hover:bg-white/50 dark:hover:bg-white/10"
                  }
                `}
              >
                {filter.label}
              </button>
            );
          })}
        </div>

        <AnimatePresence mode="wait">
          {filtered.length > 0 ? (
            <motion.div
              key={activeFilters.join(",")}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="grid md:grid-cols-2 gap-6 md:gap-8"
            >
              {filtered.map((project, index) => (
                <ProjectCard key={project.id} project={project} index={index} />
              ))}
            </motion.div>
          ) : (
            <motion.p
              key={`empty-${activeFilters.join(",")}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-neutral-500"
            >
              No projects in this category yet.
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
