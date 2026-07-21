// src/pages/Thoughts.jsx
import { useState } from "react";
import { posts, postCategories } from "../data/posts";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

function PostCard({ post, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      transition={{ delay: index * 0.07, duration: 0.45 }}
      className="h-full"
    >
      <Link to={`/thoughts/${post.id}`} className="group block h-full">
        <div className="glass-card overflow-hidden flex flex-col h-full transition-all duration-500 group-hover:-translate-y-1 group-hover:shadow-[0_20px_50px_-12px_rgba(0,0,0,0.12)] dark:group-hover:shadow-[0_20px_50px_-12px_rgba(0,0,0,0.4)]">
          {/* Image area — square */}
          <div className="w-full aspect-square overflow-hidden shrink-0">
            {post.cover ? (
              <img
                src={post.cover}
                alt={post.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            ) : (
              <div
                className={`w-full h-full flex items-center justify-center text-4xl ${
                  post.category === "Case Study"
                    ? "bg-sky-400/8 dark:bg-sky-400/5"
                    : "bg-violet-400/8 dark:bg-violet-400/5"
                }`}
              >
                {post.category === "Case Study" ? "📐" : "💭"}
              </div>
            )}
          </div>

          {/* Content */}
          <div className="p-6 flex flex-col flex-1">
            <div className="flex items-center gap-3 mb-4">
              <span
                className={`text-xs px-3 py-1 rounded-full font-medium ${
                  post.category === "Case Study"
                    ? "bg-sky-400/10 text-sky-500 dark:text-sky-400"
                    : "bg-violet-400/10 text-violet-500 dark:text-violet-400"
                }`}
              >
                {post.category}
              </span>
              <span className="text-xs text-neutral-400">
                {post.readTime} read
              </span>
            </div>

            <h2 className="text-xl font-semibold mb-2 leading-snug group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors duration-300">
              {post.title}
            </h2>
            {post.subtitle && (
              <p className="text-sm text-neutral-500 mb-4 leading-relaxed line-clamp-2">
                {post.subtitle}
              </p>
            )}

            {/* Push date/arrow to bottom */}
            <div className="flex items-center justify-between mt-auto pt-4 border-t border-black/5 dark:border-white/8">
              <span className="text-xs text-neutral-400">
                {new Date(post.date).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
              <span className="text-sm text-sky-500 dark:text-sky-400 group-hover:translate-x-1 transition-transform duration-300 inline-block">
                Read →
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export default function Thoughts() {
  const [active, setActive] = useState("All");

  const filtered =
    active === "All" ? posts : posts.filter((p) => p.category === active);

  return (
    <main className="page-shell min-h-screen">
      <div className="max-w-4xl mx-auto">
        <div className="mb-12 md:mb-16">
          <p className="section-label">Writing</p>
          <h1 className="page-heading">Thoughts</h1>
          <p className="mt-4 text-neutral-500 max-w-lg leading-relaxed">
            Case studies, opinions and things I think about in design.
          </p>
        </div>

        {/* Filter tabs */}
        <div className="flex flex-wrap gap-2 mb-10 md:mb-12">
          {postCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActive(cat)}
              className={`
                px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300
                border backdrop-blur-xl
                ${
                  active === cat
                    ? "bg-neutral-900 text-white border-neutral-900 dark:bg-white dark:text-neutral-900 dark:border-white"
                    : "bg-white/30 dark:bg-white/5 border-black/5 dark:border-white/10 text-neutral-600 dark:text-neutral-300 hover:bg-white/50 dark:hover:bg-white/10"
                }
              `}
            >
              {cat}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {filtered.length > 0 ? (
            <motion.div
              key={active}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="grid md:grid-cols-2 gap-6 items-stretch"
            >
              {filtered.map((post, index) => (
                <PostCard key={post.id} post={post} index={index} />
              ))}
            </motion.div>
          ) : (
            <motion.p
              key={`empty-${active}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-neutral-500"
            >
              Nothing here yet.
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
