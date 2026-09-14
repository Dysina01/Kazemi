"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import { useEffect, useState, type CSSProperties } from "react";

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

function useScrollReveal() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) return;

    const elements = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"));
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const element = entry.target as HTMLElement;
        element.classList.add("is-revealing");
        observer.unobserve(element);
      });
    }, { threshold: .12, rootMargin: "0px 0px -8% 0px" });

    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);
}

function Header({ dark, onTheme, scrolled }: { dark: boolean; onTheme: () => void; scrolled: boolean }) {
  const reduceMotion = useReducedMotion();
  const hover = reduceMotion ? undefined : { y: -2 };
  return (
    <motion.header className={`site-header${scrolled ? " is-scrolled" : ""}`} data-state={scrolled ? "onscroll" : "hero"} initial={reduceMotion ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: .65, ease: [.22, 1, .36, 1] }}>
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
      <div data-reveal="soft"><SectionTitle title="PROJECTS" subtitle="Some of my Works" /></div>
      <div className="project-grid">{projects.map((project, i) => (
        <motion.a href="#works" className="project-card" data-reveal="card" style={{ "--reveal-delay": `${i * 90}ms` } as CSSProperties} key={project.number} whileHover={reduceMotion ? undefined : { y: -8 }} whileTap={reduceMotion ? undefined : { scale: .985 }} transition={{ duration: .45, ease: [.22, 1, .36, 1] }} aria-label={`Open ${project.title}`}>
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
      <motion.a className="button works-button" data-reveal="soft" href="#works" whileHover={reduceMotion ? undefined : { y: -3, scale: 1.02 }} whileTap={reduceMotion ? undefined : { y: 0, scale: .98 }} transition={{ type: "spring", stiffness: 250, damping: 22 }}>See all Projects</motion.a>
    </section>
  );
}

function Process() {
  return (
    <section className="process" aria-label="Product process">
      <div className="outline-word">PRODUCT</div>
      {processLabels.map((label, i) => (
        <motion.span
          key={label}
          data-reveal="soft"
          style={{ "--i": i, "--reveal-delay": `${i * 70}ms` } as CSSProperties}
          initial={false}
        ><i>{label}</i></motion.span>
      ))}
    </section>
  );
}

function About() {
  const reduceMotion = useReducedMotion();
  return (
    <section className="about" id="about">
      <div className="bio">
        <div className="bio-heading" data-reveal="soft">
          <motion.div className="profile-ring" whileHover={reduceMotion ? undefined : { y: -5, rotate: -2, scale: 1.025 }} transition={{ type: "spring", stiffness: 220, damping: 20 }}>
            <Image src="/assets/profile.png" alt="Parnaz Kazemi" width={235} height={235} sizes="235px" />
          </motion.div>
          <div className="bio-titles"><h2><span className="bio-kicker">Hey, i’m</span>{" "}<span className="bio-name">Parnaz Kazemi</span></h2><h3>Digital Product Manager &amp; Consultant</h3></div>
        </div>
        <div className="bio-copy">
          <p data-reveal="soft">Product Design Leader with +8 years of experience building scalable digital products, design systems, and high-performing teams across fintech and banking.</p>
          <p data-reveal="soft" style={{ "--reveal-delay": "80ms" } as CSSProperties}>I specialize in turning complex challenges into structured product ecosystems by combining UX strategy, DesignOps, and product thinking. I’ve led large-scale redesigns, built React-based design systems across 50+ products, and established frameworks that improve collaboration between design, product, and engineering teams.</p>
          <p data-reveal="soft" style={{ "--reveal-delay": "160ms" } as CSSProperties}>Beyond designing interfaces, I focus on building the systems, processes, and cultures that help teams create meaningful user experiences and measurable business impact.</p>
        </div>
      </div>
      <div className="career-image-wrap" data-reveal="scale">
        <Image className="career-image" src="/assets/career.png" alt="Career highlights: 8+ years of experience, 50+ products scaled, 7+ years in fintech and banking, and 20+ collaborators" width={1216} height={367} sizes="(max-width: 1264px) calc(100vw - 48px), 1216px" quality={100} unoptimized draggable={false} />
      </div>
    </section>
  );
}

function Teaching() {
  return <section className="teaching"><div data-reveal="soft"><SectionTitle title="DESIGNING THE NEXT GENERATION" subtitle="Teaching. Mentoring. Growing." /></div><Image data-reveal="scale" src="/assets/teaching.png" alt="Teaching impact and student statistics" width={896} height={367} /></section>;
}

function Thoughts() {
  return <section className="thoughts" id="thoughts"><div data-reveal="soft"><SectionTitle title="THOUGHTS" subtitle="Some of my Works" /></div><div>{thoughts.map((item, i) => <motion.a href="#" data-reveal="soft" style={{ "--reveal-delay": `${i * 80}ms` } as CSSProperties} key={item.title} whileHover={{ scale: 1.015 }}><small>{item.meta}</small><h3>{item.title}</h3><p>{item.description}</p></motion.a>)}</div></section>;
}

function Footer() {
  return <footer id="contact" data-reveal="soft"><Image src="/assets/footer.png" alt="Parnaz Kazemi signature and social links" width={1280} height={318} /><div className="footer-links"><a href="#">LinkedIn</a><a href="#">Behance</a><a href="mailto:hello@example.com">Email</a><a href="#">Resume</a></div></footer>;
}

export default function Home() {
  useScrollReveal();
  const [dark, setDark] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const updateHeader = () => setScrolled(window.scrollY > 80);
    updateHeader();
    window.addEventListener("scroll", updateHeader, { passive: true });
    return () => window.removeEventListener("scroll", updateHeader);
  }, []);

  useEffect(() => {
    const savedTheme = window.localStorage.getItem("parnaz-portfolio-theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const shouldUseDark = savedTheme ? savedTheme === "dark" : prefersDark;
    document.documentElement.style.colorScheme = shouldUseDark ? "dark" : "light";
    const frame = window.requestAnimationFrame(() => setDark(shouldUseDark));
    return () => window.cancelAnimationFrame(frame);
  }, []);

  const toggleTheme = () => {
    setDark((current) => {
      const next = !current;
      window.localStorage.setItem("parnaz-portfolio-theme", next ? "dark" : "light");
      document.documentElement.style.colorScheme = next ? "dark" : "light";
      return next;
    });
  };

  return <main className={dark ? "site dark" : "site"}><div className="hero-shell"><Header dark={dark} onTheme={toggleTheme} scrolled={scrolled} /><Hero /></div><FeaturedProject /><Works /><Process /><About /><Teaching /><Thoughts /><Footer /><div className="viewport-blur" aria-hidden="true" /></main>;
}
