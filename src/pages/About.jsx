import Reveal from "../components/Reveal";
import { motion } from "framer-motion";

const timeline = [
  {
    year: "2024",
    title: "The beginning",
    description: "Started UI/UX journey and learned fundamentals.",
  },
  {
    year: "2025",
    title: "First projects",
    description: "Built first real projects and design systems.",
  },
  {
    year: "2026",
    title: "Portfolio focus",
    description: "Focused on portfolio and professional growth.",
  },
];

export default function About() {
  return (
    <main className="page-shell overflow-hidden">
      <div className="max-w-6xl mx-auto relative">
        {/* Ambient page glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[-200px] left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-sky-400/12 blur-[180px] rounded-full" />
          <div className="absolute top-[40%] right-[-200px] w-[500px] h-[500px] bg-violet-400/10 blur-[200px] rounded-full" />
          <div className="absolute bottom-[-100px] left-[-100px] w-[600px] h-[400px] bg-cyan-400/8 blur-[180px] rounded-full" />
        </div>

        {/* Hero */}
        <Reveal>
          <section className="relative mb-28 md:mb-36 flex flex-col items-center text-center min-h-[70vh] justify-center">
            {/* Glow behind name */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[min(100vw,600px)] h-[300px] bg-gradient-to-r from-sky-400/25 via-violet-400/20 to-cyan-400/25 blur-[100px] rounded-full pointer-events-none" />
            <div className="absolute top-[55%] left-1/2 -translate-x-1/2 w-[400px] h-[120px] bg-violet-500/15 blur-[60px] rounded-full pointer-events-none" />

            <div className="relative z-10">
              <p className="section-label">UI / UX Designer</p>

              <h1 className="text-[clamp(3rem,10vw,6rem)] font-semibold tracking-tight leading-[0.95]">
                Sina
                <br />
                <span className="bg-gradient-to-r from-sky-500 via-violet-500 to-cyan-500 bg-clip-text text-transparent">
                  Dalaei
                </span>
              </h1>

              <p className="mt-8 text-neutral-500 max-w-lg mx-auto leading-relaxed text-base md:text-lg">
                Designing calm, minimal and emotionally aware digital products
                with focus on clarity and experience.
              </p>

              <div className="mt-10 flex justify-center">
                <div className="w-24 h-px bg-gradient-to-r from-transparent via-sky-400 to-violet-500" />
              </div>

              <div className="mt-8 inline-flex items-center gap-2 px-4 py-2 rounded-full border border-neutral-200/60 dark:border-white/10 bg-white/50 dark:bg-white/5 backdrop-blur-xl text-sm text-neutral-500 dark:text-neutral-400">
                <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                Available for work
              </div>
            </div>
          </section>
        </Reveal>

        {/* About + Currently */}
        <Reveal>
          <section className="grid md:grid-cols-2 gap-8 md:gap-12 mb-28 md:mb-36">
            <div className="glass-card p-6 md:p-8">
              <h2 className="text-lg font-semibold mb-4 bg-gradient-to-r from-sky-500 to-violet-500 bg-clip-text text-transparent">
                About
              </h2>
              <p className="text-neutral-500 leading-relaxed">
                I'm a UI/UX designer focused on building calm, minimal and
                meaningful interfaces. I care about structure, spacing and how
                things feel more than how they look.
              </p>
            </div>

            <div className="glass-card p-6 md:p-8">
              <h2 className="text-lg font-semibold mb-4 bg-gradient-to-r from-violet-500 to-cyan-500 bg-clip-text text-transparent">
                Currently
              </h2>
              <div className="space-y-3 text-neutral-500">
                <p className="flex items-center gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-sky-400 shrink-0" />
                  Building portfolio systems
                </p>
                <p className="flex items-center gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-violet-400 shrink-0" />
                  Improving UX thinking
                </p>
                <p className="flex items-center gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0" />
                  Learning motion design
                </p>
              </div>
            </div>
          </section>
        </Reveal>

        {/* Timeline */}
        <Reveal>
          <section className="mb-28 md:mb-36">
            <p className="section-label text-center">Journey</p>
            <h2 className="section-heading text-center mb-12 md:mb-16">
              Milestones
            </h2>

            <div className="relative">
              <div className="hidden md:block absolute top-[11px] left-[16.67%] right-[16.67%] h-px bg-gradient-to-r from-sky-400/20 via-violet-400/50 to-cyan-400/20" />

              <div className="grid md:grid-cols-3 gap-6 md:gap-8">
                {timeline.map((item) => (
                  <div key={item.year} className="relative pt-0 md:pt-10 group">
                    <div className="hidden md:block absolute top-0 left-1/2 -translate-x-1/2 w-3.5 h-3.5 rounded-full bg-gradient-to-br from-sky-400 to-violet-500 ring-[3px] ring-white dark:ring-[#0a0a0a] z-10 group-hover:scale-125 transition-transform duration-300" />

                    <div className="glass-card p-6 md:p-8 h-full hover:border-sky-400/25 dark:hover:border-sky-400/25 transition-colors duration-300">
                      <span className="inline-block text-3xl md:text-4xl font-semibold bg-gradient-to-r from-sky-500 to-violet-500 bg-clip-text text-transparent mb-2">
                        {item.year}
                      </span>
                      <h3 className="text-base font-semibold text-neutral-800 dark:text-neutral-200 mb-2">
                        {item.title}
                      </h3>
                      <p className="text-sm text-neutral-500 leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </Reveal>

        {/* Skills */}
        <Reveal>
          <section className="mb-28 md:mb-36">
            <p className="section-label">Expertise</p>
            <h2 className="section-heading mb-10">Skills</h2>

            <div className="space-y-6">
              {[
                ["Figma", 95],
                ["UI Design", 90],
                ["UX Thinking", 85],
                ["Design Systems", 80],
              ].map(([name, val]) => (
                <div key={name}>
                  <div className="flex justify-between mb-2.5 text-sm text-neutral-500">
                    <span>{name}</span>
                    <span>{val}%</span>
                  </div>
                  <div className="h-1 bg-neutral-200/50 dark:bg-white/10 rounded-full relative overflow-hidden">
                    <motion.div
                      className="absolute left-0 top-0 h-full rounded-full bg-gradient-to-r from-sky-400 to-violet-500"
                      initial={{ width: 0 }}
                      whileInView={{ width: `${val}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8 }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>
        </Reveal>

        {/* Closing */}
        <Reveal>
          <section className="relative text-center pb-8">
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[200px] bg-violet-400/10 blur-[80px] rounded-full" />
            </div>
            <h2 className="relative text-3xl md:text-5xl font-semibold mb-4">
              Design is how it feels.
            </h2>
            <p className="relative text-neutral-500 max-w-lg mx-auto">
              I care about simplicity, clarity and emotional depth in interfaces.
            </p>
          </section>
        </Reveal>
      </div>
    </main>
  );
}
