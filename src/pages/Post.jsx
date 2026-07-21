// src/pages/Post.jsx
import { useParams, Link } from "react-router-dom";
import { posts } from "../data/posts";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { ArrowLeft, ExternalLink } from "lucide-react";

function ImageSlider({ images }) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!images || images.length === 0) return;
    const nextIndex = (current + 1) % images.length;
    const img = new Image();
    img.src = images[nextIndex];
  }, [current, images]);

  if (!images || images.length === 0) return null;

  if (images.length === 1) {
    return (
      <div className="rounded-3xl overflow-hidden mb-10">
        <img src={images[0]} alt="visual" className="w-full object-contain" />
      </div>
    );
  }

  return (
    <div className="glass-card overflow-hidden mb-10">
      <div className="relative overflow-hidden rounded-t-3xl">
        <motion.img
          src={images[current]}
          alt={`Slide ${current + 1}`}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.35 }}
          className="w-full object-contain"
        />

        <button
          onClick={() =>
            setCurrent((p) => (p - 1 + images.length) % images.length)
          }
          className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/30 backdrop-blur-md flex items-center justify-center text-white text-xl hover:bg-black/50 transition-colors"
        >
          ‹
        </button>
        <button
          onClick={() => setCurrent((p) => (p + 1) % images.length)}
          className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/30 backdrop-blur-md flex items-center justify-center text-white text-xl hover:bg-black/50 transition-colors"
        >
          ›
        </button>

        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === current
                  ? "bg-white w-5"
                  : "bg-white/40 w-1.5 hover:bg-white/70"
              }`}
            />
          ))}
        </div>
      </div>

      <div className="px-5 py-3 flex items-center justify-between">
        <span className="text-xs text-neutral-400">
          {current + 1} / {images.length}
        </span>
      </div>
    </div>
  );
}

export default function Post() {
  const { id } = useParams();
  const post = posts.find((p) => p.id === id);

  const postIndex = posts.findIndex((p) => p.id === id);
  const prevPost = posts[postIndex - 1] || null;
  const nextPost = posts[postIndex + 1] || null;

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center text-neutral-500">
        Post not found
      </div>
    );
  }

  return (
    <main className="page-shell min-h-screen">
      <div className="max-w-2xl mx-auto">
        {/* Back */}
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Link
            to="/thoughts"
            className="inline-flex items-center gap-2 text-sm text-neutral-500 hover:text-neutral-800 dark:hover:text-white transition-colors mb-12 group"
          >
            <ArrowLeft
              size={15}
              className="group-hover:-translate-x-1 transition-transform duration-200"
            />
            Back to Thoughts
          </Link>
        </motion.div>

        <motion.article
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Meta */}
          <div className="flex items-center gap-3 mb-5">
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
            <span className="text-xs text-neutral-400">
              {new Date(post.date).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </span>
          </div>

          {/* Title */}
          <h1 className="text-3xl md:text-5xl font-semibold tracking-tight leading-tight mb-3">
            {post.title}
          </h1>
          {post.subtitle && (
            <p className="text-lg text-neutral-500 mb-10 leading-relaxed">
              {post.subtitle}
            </p>
          )}

          {/* Cover (if no slider) */}
          {post.cover && (!post.images || post.images.length === 0) && (
            <div className="rounded-3xl overflow-hidden mb-10">
              <img
                src={post.cover}
                alt={post.title}
                className="w-full aspect-[16/9] object-cover"
              />
            </div>
          )}

          {/* Body */}
          <div className="space-y-2 pb-12">
            {(Array.isArray(post.body)
              ? post.body
              : post.body.split("\n\n")
            ).map((paragraph, i) => (
              <p
                key={i}
                className="text-neutral-700 dark:text-neutral-300 leading-[1.85] text-base md:text-lg"
              >
                {paragraph.trim()}
              </p>
            ))}
          </div>

          {/* Image slider */}
          <ImageSlider images={post.images} />

          {/* LinkedIn link */}
          {post.linkedinUrl && (
            <div className="mt-14 pt-8 border-t border-black/5 dark:border-white/10">
              <a
                href={post.linkedinUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 text-sm text-neutral-400 hover:text-sky-500 dark:hover:text-sky-400 transition-colors"
              >
                <ExternalLink size={14} />
                View original on LinkedIn
              </a>
            </div>
          )}
        </motion.article>

        {/* Prev / Next navigation */}
        {(prevPost || nextPost) && (
          <div className="mt-16 pt-8 border-t border-black/5 dark:border-white/10 grid grid-cols-2 gap-4">
            {prevPost ? (
              <Link
                to={`/thoughts/${prevPost.id}`}
                className="group glass-card p-5 hover:bg-white/30 dark:hover:bg-white/8 transition-colors"
              >
                <p className="text-xs text-neutral-400 mb-1">← Previous</p>
                <p className="text-sm font-medium leading-snug group-hover:text-sky-500 dark:group-hover:text-sky-400 transition-colors">
                  {prevPost.title}
                </p>
              </Link>
            ) : (
              <div />
            )}
            {nextPost && (
              <Link
                to={`/thoughts/${nextPost.id}`}
                className="group glass-card p-5 text-right hover:bg-white/30 dark:hover:bg-white/8 transition-colors"
              >
                <p className="text-xs text-neutral-400 mb-1">Next →</p>
                <p className="text-sm font-medium leading-snug group-hover:text-sky-500 dark:group-hover:text-sky-400 transition-colors">
                  {nextPost.title}
                </p>
              </Link>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
