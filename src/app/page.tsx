"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import { useState, type CSSProperties } from "react";

const projects = [
  { title: "Project-1", type: "App/Website", number: "01", theme: "violet" },
  { title: "Project-2", type: "App/Website", number: "02", theme: "blue" },
  { title: "Project-3", type: "App/Website", number: "03", theme: "graphite" },
];

const thoughts = [
  { meta: "Design Process · 6 min", title: "Saken Design Process", description: "Manage Your Building with Confidence!" },
  { meta: "Thought Piece · 2 min", title: "I’m Not a Programmer! But I Built Anyway", description: "AI didn’t replace the process. It changed how I enter it." },
  { meta: "Design Process · 5 min", title: "Tara Redesign Process", description: "Idea to Prototype" },
];

const processLabels = ["RESEARCH", "PRODUCT", "STRATEGY", "DESIGN", "BUSINESS", "HANDOFF"];

const careerStats = [
  { number: "01", value: "8+", label: "Years of experience", note: "2018 → Now", visual: "rings" },
  { number: "02", value: "50+", label: "Products scaled", note: "Fintech, banking & digital platforms", visual: "stack" },
  { number: "03", value: "7+", label: "Years in fintech & banking", note: "Highly regulated environments", visual: "prism" },
  { number: "04", value: "20+", label: "People collaborated with", note: "Design × product × engineering", visual: "orbit" },
] as const;

function Header({ dark, onTheme }: { dark: boolean; onTheme: () => void }) {
  const reduceMotion = useReducedMotion();
  const hover = reduceMotion ? undefined : { y: -2 };
  return (
    <motion.header className="site-header" initial={reduceMotion ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: .65, ease: [.22, 1, .36, 1] }}>
      <motion.button className="utility" aria-label="Switch language" whileHover={hover} whileTap={reduceMotion ? undefined : { scale: .96 }}><Image src="/assets/language-icon.png" alt="" width={18} height={20} /> ENG</motion.button>
      <nav aria-label="Primary navigation">
        {[["About", "#about"], ["Works", "#works"], ["Thoughts", "#thoughts"], ["Contact", "#contact"]].map(([label, href]) => <motion.a key={href} href={href} whileHover={hover} whileTap={reduceMotion ? undefined : { scale: .96 }}>{label}</motion.a>)}
      </nav>
      <motion.button className="utility" onClick={onTheme} aria-label="Toggle color theme" aria-pressed={dark} whileHover={hover} whileTap={reduceMotion ? undefined : { scale: .96 }}><Image src="/assets/sun-icon.png" alt="" width={20} height={20} /> {dark ? "Dark" : "Light"}</motion.button>
    </motion.header>
  );
}

function Hero() {
  const reduceMotion = useReducedMotion();
  const shapes = [
    "s-0","s-1","s-2","s-3","s-4","s-5","s-6","s-7","s-8","s-9",
    "s-10","s-11","s-12","s-13","s-14","s-15","s-16","s-17","s-18",
    "s-19","s-20","s-21","s-22","s-23","s-24","s-25","s-26",
  ];
  const shadowless = new Set(["s-0", "s-1", "s-2", "s-22", "s-23", "s-24"]);
  const buttonMotion = reduceMotion ? {} : {
    whileHover: { y: -2, scale: 1.015 },
    whileTap: { y: 0, scale: .985 },
    transition: { type: "spring" as const, stiffness: 250, damping: 22, mass: .72 },
  };
  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="hero-shapes" aria-hidden="true">
        {shapes.map((shape, i) => <motion.i
          className={`${shape}${shadowless.has(shape) ? "" : " is-live"}`}
          style={{ "--pulse-delay": `${(i % 7) * -.58}s` } as CSSProperties}
          key={shape}
          initial={reduceMotion ? false : { opacity: 0, scale: .94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: i * .018, duration: .65, ease: [.22, 1, .36, 1] }}
        />)}
      </div>
      <motion.div className="hero-copy" initial="hidden" animate="visible" variants={{ hidden: {}, visible: { transition: { delayChildren: .28, staggerChildren: .11 } } }}>
        <motion.div className="hero-title-block" variants={{ hidden: reduceMotion ? {} : { opacity: 0, y: 22 }, visible: { opacity: 1, y: 0, transition: { duration: .72, ease: [.22, 1, .36, 1] } } }}>
          <h1 id="hero-title">Parnaz Kazemi</h1>
          <p>business &amp; product &amp; Strategy</p>
        </motion.div>
        <motion.div className="actions" variants={{ hidden: reduceMotion ? {} : { opacity: 0, y: 14 }, visible: { opacity: 1, y: 0, transition: { duration: .6, ease: [.22, 1, .36, 1] } } }}>
          <motion.a className="button primary" href="#works" {...buttonMotion}>My Works</motion.a>
          <motion.a className="button" href="#contact" {...buttonMotion}>Contact</motion.a>
        </motion.div>
      </motion.div>
    </section>
  );
}

function SectionTitle({ title, subtitle }: { title: string; subtitle: string }) {
  return <div className="section-title"><h2>{title}</h2><p>{subtitle}</p></div>;
}

function FeaturedProject() {
  const reduceMotion = useReducedMotion();
  const glassColumns = Array.from({ length: 20 });
  return (
    <section className="featured" aria-labelledby="featured-title">
      <motion.div className="project-glow" initial={reduceMotion ? false : { opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true, margin: "-12%" }} transition={{ duration: 1.1 }} />
      <div className="project-glass" aria-hidden="true">{glassColumns.map((_, i) => <i key={i} />)}</div>
      <motion.h2 id="featured-title" initial={reduceMotion ? false : { opacity: 0, x: "-50%", y: 20 }} whileInView={{ opacity: 1, x: "-50%", y: 0 }} viewport={{ once: true, margin: "-12%" }} transition={{ duration: .8, ease: [.22, 1, .36, 1] }}>Project</motion.h2>
      <motion.div className="project-phone project-phone-left" initial={reduceMotion ? false : { opacity: 0, x: -44, y: 34 }} whileInView={{ opacity: 1, x: 0, y: 0 }} viewport={{ once: true, margin: "-12%" }} transition={{ duration: .9, delay: .12, ease: [.22, 1, .36, 1] }}>
        <Image src="/assets/project-phone-left.png" alt="Featured product shown on a three-dimensional phone" width={627} height={721} />
      </motion.div>
      <motion.div className="project-phone project-phone-right" initial={reduceMotion ? false : { opacity: 0, x: 44, y: 28 }} whileInView={{ opacity: 1, x: 0, y: 0 }} viewport={{ once: true, margin: "-12%" }} transition={{ duration: .9, delay: .2, ease: [.22, 1, .36, 1] }}>
        <Image src="/assets/project-phone-right.png" alt="A second view of the featured product on a three-dimensional phone" width={557} height={655} />
      </motion.div>
      <div className="featured-link-wrap"><motion.a className="featured-link" href="#works" initial={reduceMotion ? false : { opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} whileHover={reduceMotion ? undefined : { y: -3, scale: 1.025 }} whileTap={reduceMotion ? undefined : { y: 0, scale: .98 }} viewport={{ once: true }} transition={{ type: "spring", stiffness: 240, damping: 22 }}>Review Project</motion.a></div>
    </section>
  );
}

function Works() {
  const reduceMotion = useReducedMotion();
  return (
    <section className="works" id="works">
      <motion.div initial={reduceMotion ? false : { opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-12%" }} transition={{ duration: .7, ease: [.22, 1, .36, 1] }}><SectionTitle title="PROJECTS" subtitle="Some of my Works" /></motion.div>
      <div className="project-grid">{projects.map((project, i) => (
        <motion.a href="#works" className="project-card" key={project.number} initial={reduceMotion ? false : { opacity: 0, y: 34 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-10%" }} whileHover={reduceMotion ? undefined : { y: -8 }} whileTap={reduceMotion ? undefined : { scale: .985 }} transition={{ duration: .68, delay: i * .1, ease: [.22, 1, .36, 1] }} aria-label={`Open ${project.title}`}>
          <span className={`project-cover project-art theme-${project.theme}`}>
            <span className="project-art-grid" />
            <span className="project-art-orb" />
            <span className="project-art-panel"><i /><i /><i /></span>
            <span className="project-art-chip">Case Study</span>
            <span className="project-art-number">{project.number}</span>
          </span>
          <span className="project-meta"><strong>{project.title}</strong><small>{project.type}</small></span>
        </motion.a>
      ))}</div>
      <motion.a className="button works-button" href="#works" whileHover={reduceMotion ? undefined : { y: -3, scale: 1.02 }} whileTap={reduceMotion ? undefined : { y: 0, scale: .98 }} transition={{ type: "spring", stiffness: 250, damping: 22 }}>See all Projects</motion.a>
    </section>
  );
}

function Process() {
  const reduceMotion = useReducedMotion();
  return (
    <section className="process" aria-label="Product process">
      <div className="outline-word">PRODUCT</div>
      {processLabels.map((label, i) => (
        <motion.span
          key={label}
          style={{ "--i": i } as CSSProperties}
          initial={reduceMotion ? false : { opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-14%" }}
          transition={{ duration: .7, delay: i * .075, ease: [.22, 1, .36, 1] }}
        ><i>{label}</i></motion.span>
      ))}
    </section>
  );
}

function CareerVisual({ type }: { type: (typeof careerStats)[number]["visual"] }) {
  if (type === "rings") return <span className="stat-visual visual-rings" aria-hidden="true"><i /><i /><i /></span>;
  if (type === "stack") return <span className="stat-visual visual-stack" aria-hidden="true"><i /><i /><i /><b>+</b></span>;
  if (type === "prism") return <span className="stat-visual visual-prism" aria-hidden="true"><i /><i /><i /></span>;
  return <span className="stat-visual visual-orbit" aria-hidden="true"><i /><i /><b /></span>;
}

function CareerCards() {
  const reduceMotion = useReducedMotion();
  return (
    <div className="career-board" aria-label="Career highlights">
      <span className="career-signature" aria-hidden="true">Parnaz<br />Kazemi</span>
      <span className="career-path" aria-hidden="true"><i /><i /><i /><i /><i /></span>
      <div className="career-cards">
        {careerStats.map((stat, i) => (
          <motion.article
            className={`stat-card stat-card-${i + 1}`}
            key={stat.number}
            initial={reduceMotion ? false : { opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: .72, delay: i * .1, ease: [.22, 1, .36, 1] }}
          >
            <span className="stat-index">{stat.number}</span>
            <CareerVisual type={stat.visual} />
            <strong>{stat.value}</strong>
            <h4>{stat.label}</h4>
            <span className="stat-rule" />
            <p>{stat.note}</p>
          </motion.article>
        ))}
      </div>
    </div>
  );
}

function About() {
  const reduceMotion = useReducedMotion();
  return (
    <section className="about" id="about">
      <div className="bio">
        <motion.div className="bio-heading" initial={reduceMotion ? false : { opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-15%" }} transition={{ duration: .75, ease: [.22, 1, .36, 1] }}>
          <motion.div className="profile-ring" whileHover={reduceMotion ? undefined : { y: -5, rotate: -2, scale: 1.025 }} transition={{ type: "spring", stiffness: 220, damping: 20 }}>
            <Image src="/assets/profile.png" alt="Parnaz Kazemi" width={235} height={235} sizes="235px" />
          </motion.div>
          <div className="bio-titles"><h2><span>Hey, i’m</span> Parnaz Kazemi</h2><h3>Digital Product Manager &amp; Consultant</h3></div>
        </motion.div>
        <motion.div className="bio-copy" initial={reduceMotion ? false : { opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-12%" }} transition={{ duration: .8, delay: .1, ease: [.22, 1, .36, 1] }}>
          <p>Product Design Leader with +8 years of experience building scalable digital products, design systems, and high-performing teams across fintech and banking.</p>
          <p>I specialize in turning complex challenges into structured product ecosystems by combining UX strategy, DesignOps, and product thinking. I’ve led large-scale redesigns, built React-based design systems across 50+ products, and established frameworks that improve collaboration between design, product, and engineering teams.</p>
          <p>Beyond designing interfaces, I focus on building the systems, processes, and cultures that help teams create meaningful user experiences and measurable business impact.</p>
        </motion.div>
      </div>
      <CareerCards />
    </section>
  );
}

function Teaching() {
  return <section className="teaching"><SectionTitle title="DESIGNING THE NEXT GENERATION" subtitle="Teaching. Mentoring. Growing." /><Image src="/assets/teaching.png" alt="Teaching impact and student statistics" width={896} height={367} /></section>;
}

function Thoughts() {
  return <section className="thoughts" id="thoughts"><SectionTitle title="THOUGHTS" subtitle="Some of my Works" /><div>{thoughts.map((item) => <motion.a href="#" key={item.title} whileHover={{ scale: 1.015 }}><small>{item.meta}</small><h3>{item.title}</h3><p>{item.description}</p></motion.a>)}</div></section>;
}

function Footer() {
  return <footer id="contact"><Image src="/assets/footer.png" alt="Parnaz Kazemi signature and social links" width={1280} height={318} /><div className="footer-links"><a href="#">LinkedIn</a><a href="#">Behance</a><a href="mailto:hello@example.com">Email</a><a href="#">Resume</a></div></footer>;
}

export default function Home() {
  const [dark, setDark] = useState(false);
  return <main className={dark ? "site dark" : "site"}><div className="hero-shell"><Header dark={dark} onTheme={() => setDark(v => !v)} /><Hero /></div><FeaturedProject /><Works /><Process /><About /><Teaching /><Thoughts /><Footer /></main>;
}
