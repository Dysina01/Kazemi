"use client";

import Image from "next/image";
import { AnimatePresence, LazyMotion, domAnimation, m, useReducedMotion } from "motion/react";
import { useEffect, useState, type CSSProperties } from "react";
import type { HomeContent } from "@/cms/site-content";
import type { HomepageProject } from "@/cms/projects";
const arrowUpIcon = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAACXBIWXMAAAPoAAAD6AG1e1JrAAAA0klEQVRIS+2TMQ6CMBSG/1c7MJioJxA33OoNuIJH8SbexCtwA7rJBp5ANhmEZzBGlwqvOBH5tjbN9zUvecBfEYZmudnu1vBAQUgUmTCYKxtoJD4RglAOrRIivMRcVHfE+Tm9/ByI3nJmZiIFvjagVXuWRJRUXmnEAOVMKKGbuI1JxqWk8jz9/DSztpBGlK/cN+IMsJ6duuTuCB3hQLsuSdf7G1AWqS3RQxuJjIlrooU48PyZB1nHe/GiDWUK9DKNaGQjIqB3s0Wb/A3W9aEaEBk3D/lgcKLtRGQ3AAAADnRFWHRTb2Z0d2FyZQBGaWdtYZ6xlmMAAAAASUVORK5CYII=";

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


function useAmbientAnimationVisibility() {
  useEffect(() => {
    if (!("IntersectionObserver" in window)) return;

    const sections = Array.from(document.querySelectorAll<HTMLElement>("[data-ambient]"));
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        entry.target.classList.toggle("ambient-paused", !entry.isIntersecting);
      });
    }, { rootMargin: "160px 0px" });

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);
}

function Header({ dark, onTheme, scrolled }: { dark: boolean; onTheme: () => void; scrolled: boolean }) {
  const reduceMotion = useReducedMotion();
  const hover = reduceMotion ? undefined : { y: -2 };
  const navItems = [["About", "#about"], ["Works", "#works"], ["Thoughts", "#thoughts"], ["Contact", "#contact"]];
  const transition = { duration: reduceMotion ? .01 : .46, ease: [.22, 1, .36, 1] as [number, number, number, number] };
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });

  return (
    <header
      className={`portfolio-header${scrolled ? " portfolio-header--scrolled" : ""}`}
      data-state={scrolled ? "onscroll" : "hero"}
    >
      <AnimatePresence initial={false} mode="sync">
        {scrolled ? (
          <m.div
            className="scroll-header"
            key="onscroll"
            initial={reduceMotion ? false : { opacity: 0, y: -10, scale: .97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduceMotion ? undefined : { opacity: 0, y: -6, scale: .985 }}
            transition={transition}
          >
            <m.button className="scroll-header__pill scroll-header__icon" aria-label="Switch language" whileHover={hover} whileTap={reduceMotion ? undefined : { scale: .94 }}>
              <Image src="/assets/language-icon.png" alt="" width={18} height={20} />
            </m.button>

            <nav className="scroll-header__pill scroll-header__nav" aria-label="Primary navigation">
              {navItems.map(([label, href]) => (
                <m.a key={href} href={href} whileHover={hover} whileTap={reduceMotion ? undefined : { scale: .96 }}>
                  {label}
                </m.a>
              ))}
            </nav>

            <m.button className="scroll-header__pill scroll-header__icon" onClick={onTheme} aria-label="Toggle color theme" aria-pressed={dark} whileHover={hover} whileTap={reduceMotion ? undefined : { scale: .94 }}>
              <Image src="/assets/sun-icon.png" alt="" width={24} height={24} />
            </m.button>

            <m.button className="scroll-header__pill scroll-header__icon" onClick={scrollToTop} aria-label="Scroll to top" whileHover={hover} whileTap={reduceMotion ? undefined : { scale: .94 }}>
              <Image src={arrowUpIcon} alt="" width={24} height={24} unoptimized />
            </m.button>
          </m.div>
        ) : (
          <m.div
            className="hero-header"
            key="hero"
            initial={reduceMotion ? false : { opacity: 0, y: 7 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduceMotion ? undefined : { opacity: 0, y: -7 }}
            transition={transition}
          >
            <m.button className="hero-header__utility" aria-label="Switch language" whileHover={hover} whileTap={reduceMotion ? undefined : { scale: .96 }}>
              <Image src="/assets/language-icon.png" alt="" width={18} height={20} />
              <span>ENG</span>
            </m.button>

            <nav className="hero-header__nav" aria-label="Primary navigation">
              {navItems.map(([label, href]) => (
                <m.a key={href} href={href} whileHover={hover} whileTap={reduceMotion ? undefined : { scale: .96 }}>
                  {label}
                </m.a>
              ))}
            </nav>

            <m.button className="hero-header__utility" onClick={onTheme} aria-label="Toggle color theme" aria-pressed={dark} whileHover={hover} whileTap={reduceMotion ? undefined : { scale: .96 }}>
              <Image src="/assets/sun-icon.png" alt="" width={20} height={20} />
              <span>{dark ? "Dark" : "Light"}</span>
            </m.button>
          </m.div>
        )}
      </AnimatePresence>
    </header>
  );
}

function Hero({ content }: { content: HomeContent["hero"] }) {
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
    <section className="hero" aria-labelledby="hero-title" data-ambient>
      <div className="hero-shapes" aria-hidden="true">
        {shapes.map((shape, i) => <m.i
          className={`${shape}${shadowless.has(shape) ? "" : " is-live"}`}
          style={{ "--pulse-delay": `${(i % 7) * -.58}s` } as CSSProperties}
          key={shape}
          initial={reduceMotion ? false : { opacity: 0, scale: .94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: i * .018, duration: .65, ease: [.22, 1, .36, 1] }}
        />)}
      </div>
      <m.div className="hero-copy" initial="hidden" animate="visible" variants={{ hidden: {}, visible: { transition: { delayChildren: .28, staggerChildren: .11 } } }}>
        <m.div className="hero-title-block" variants={{ hidden: reduceMotion ? {} : { opacity: 0, y: 22 }, visible: { opacity: 1, y: 0, transition: { duration: .72, ease: [.22, 1, .36, 1] } } }}>
          <h1 id="hero-title">{content.name}</h1>
          <p>{content.tagline}</p>
        </m.div>
        <m.div className="actions" variants={{ hidden: reduceMotion ? {} : { opacity: 0, y: 14 }, visible: { opacity: 1, y: 0, transition: { duration: .6, ease: [.22, 1, .36, 1] } } }}>
          <m.a className="button primary" href="#works" {...buttonMotion}>{content.primaryCta}</m.a>
          <m.a className="button" href="#contact" {...buttonMotion}>{content.secondaryCta}</m.a>
        </m.div>
      </m.div>
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
      <m.div className="project-glow" initial={reduceMotion ? false : { opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true, margin: "-12%" }} transition={{ duration: 1.1 }} />
      <div className="project-glass" aria-hidden="true">{glassColumns.map((_, i) => <i key={i} />)}</div>
      <m.h2 id="featured-title" initial={reduceMotion ? false : { opacity: 0, x: "-50%", y: 20 }} whileInView={{ opacity: 1, x: "-50%", y: 0 }} viewport={{ once: true, margin: "-12%" }} transition={{ duration: .8, ease: [.22, 1, .36, 1] }}>Project</m.h2>
      <m.div className="project-phone project-phone-left" initial={reduceMotion ? false : { opacity: 0, x: -44, y: 34 }} whileInView={{ opacity: 1, x: 0, y: 0 }} viewport={{ once: true, margin: "-12%" }} transition={{ duration: .9, delay: .12, ease: [.22, 1, .36, 1] }}>
        <Image src="/assets/project-phone-left.png" alt="Featured product shown on a three-dimensional phone" width={627} height={721} />
      </m.div>
      <m.div className="project-phone project-phone-right" initial={reduceMotion ? false : { opacity: 0, x: 44, y: 28 }} whileInView={{ opacity: 1, x: 0, y: 0 }} viewport={{ once: true, margin: "-12%" }} transition={{ duration: .9, delay: .2, ease: [.22, 1, .36, 1] }}>
        <Image src="/assets/project-phone-right.png" alt="A second view of the featured product on a three-dimensional phone" width={557} height={655} />
      </m.div>
      <div className="featured-link-wrap"><m.a className="featured-link" href="#works" initial={reduceMotion ? false : { opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} whileHover={reduceMotion ? undefined : { y: -3, scale: 1.025 }} whileTap={reduceMotion ? undefined : { y: 0, scale: .98 }} viewport={{ once: true }} transition={{ type: "spring", stiffness: 240, damping: 22 }}>Review Project</m.a></div>
    </section>
  );
}

function Works({ content, projects }: { content: HomeContent["projects"]; projects: HomepageProject[] }) {
  const reduceMotion = useReducedMotion();
  return (
    <section className="works" id="works">
      <div data-reveal="soft"><SectionTitle title={content.title} subtitle={content.subtitle} /></div>
      <div className="project-grid">{projects.map((project, i) => (
        <m.a href={`/projects/${project.slug}`} className="project-card" data-reveal="card" style={{ "--reveal-delay": `${i * 90}ms` } as CSSProperties} key={project.id} whileHover={reduceMotion ? undefined : { y: -8 }} whileTap={reduceMotion ? undefined : { scale: .985 }} transition={{ duration: .45, ease: [.22, 1, .36, 1] }} aria-label={`Open ${project.title}`}>
          <span className={`project-cover project-art theme-${["violet", "blue", "graphite"][i % 3]}`}>
            {project.hero?.src ? <Image className="project-cover-image" src={project.hero.src} alt={project.hero.alt || ""} fill sizes="(max-width: 800px) 100vw, 400px" /> : <><span className="project-art-grid" /><span className="project-art-orb" /><span className="project-art-panel"><i /><i /><i /></span></>}
            <span className="project-art-chip">{project.category || "Case Study"}</span>
            <span className="project-art-number">{String(i + 1).padStart(2, "0")}</span>
          </span>
          <span className="project-meta"><strong>{project.title}</strong><small>{project.category}</small></span>
        </m.a>
      ))}</div>
      <m.a className="button works-button" data-reveal="soft" href="#works" whileHover={reduceMotion ? undefined : { y: -3, scale: 1.02 }} whileTap={reduceMotion ? undefined : { y: 0, scale: .98 }} transition={{ type: "spring", stiffness: 250, damping: 22 }}>See all Projects</m.a>
    </section>
  );
}

function Process({ content }: { content: HomeContent["process"] }) {
  return (
    <section className="process" aria-label="Product process" data-ambient>
      <div className="outline-word">{content.word}</div>
      {content.labels.map((label, i) => (
        <m.span
          key={label}
          data-reveal="soft"
          style={{ "--i": i, "--reveal-delay": `${i * 70}ms` } as CSSProperties}
          initial={false}
        ><i>{label}</i></m.span>
      ))}
    </section>
  );
}

function About({ content }: { content: HomeContent["bio"] }) {
  const reduceMotion = useReducedMotion();
  return (
    <section className="about" id="about">
      <div className="bio">
        <div className="bio-heading" data-reveal="soft">
          <m.div className="profile-ring" whileHover={reduceMotion ? undefined : { y: -5, rotate: -2, scale: 1.025 }} transition={{ type: "spring", stiffness: 220, damping: 20 }}>
            <Image src={content.profileImage} alt={content.name} width={235} height={235} sizes="235px" />
          </m.div>
          <div className="bio-titles"><h2><span className="bio-kicker">{content.kicker}</span>{" "}<span className="bio-name">{content.name}</span></h2><h3>{content.role}</h3></div>
        </div>
        <div className="bio-copy">{content.paragraphs.map((paragraph, index) => <p data-reveal="soft" style={{ "--reveal-delay": `${index * 80}ms` } as CSSProperties} key={paragraph}>{paragraph}</p>)}</div>
      </div>
      <div className="career-image-wrap" data-reveal="scale">
        <Image className="career-image" src="/assets/career.png" alt="Career highlights: 8+ years of experience, 50+ products scaled, 7+ years in fintech and banking, and 20+ collaborators" width={1216} height={367} sizes="(max-width: 1264px) calc(100vw - 48px), 1216px" quality={100} draggable={false} />
      </div>
    </section>
  );
}

function Teaching({ content }: { content: HomeContent["teaching"] }) {
  return <section className="teaching"><div data-reveal="soft"><SectionTitle title={content.title} subtitle={content.subtitle} /></div><Image data-reveal="scale" src="/assets/teaching.png" alt="Teaching impact and student statistics" width={896} height={367} /></section>;
}

function Thoughts({ content }: { content: HomeContent["thoughts"] }) {
  return <section className="thoughts" id="thoughts"><div data-reveal="soft"><SectionTitle title={content.title} subtitle={content.subtitle} /></div><div>{content.items.map((item, i) => <m.a href={item.href || "#"} data-reveal="soft" style={{ "--reveal-delay": `${i * 80}ms` } as CSSProperties} key={item.title} whileHover={{ scale: 1.015 }}><small>{item.meta}</small><h3>{item.title}</h3><p>{item.description}</p></m.a>)}</div></section>;
}

function Footer({ content }: { content: HomeContent["footer"] }) {
  return <footer id="contact" data-reveal="soft"><Image src="/assets/footer.png" alt="Parnaz Kazemi signature and social links" width={1280} height={318} /><div className="footer-links"><a href={content.linkedin}>LinkedIn</a><a href={content.behance}>Behance</a><a href={`mailto:${content.email}`}>Email</a><a href={content.resume}>Resume</a></div></footer>;
}

export default function HomeClient({ content, projects }: { content: HomeContent; projects: HomepageProject[] }) {
  useScrollReveal();
  useAmbientAnimationVisibility();
  const [dark, setDark] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    let frame = 0;
    let previous = window.scrollY > 80;

    frame = window.requestAnimationFrame(() => {
      setScrolled(previous);
      frame = 0;
    });

    const updateHeader = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        const next = window.scrollY > 80;
        if (next !== previous) {
          previous = next;
          setScrolled(next);
        }
        frame = 0;
      });
    };

    window.addEventListener("scroll", updateHeader, { passive: true });
    return () => {
      window.removeEventListener("scroll", updateHeader);
      if (frame) window.cancelAnimationFrame(frame);
    };
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

  return <LazyMotion features={domAnimation}><main className={dark ? "site dark" : "site"}><div className="hero-shell"><Header dark={dark} onTheme={toggleTheme} scrolled={scrolled} /><Hero content={content.hero} /></div><FeaturedProject /><Works content={content.projects} projects={projects} /><Process content={content.process} /><About content={content.bio} /><Teaching content={content.teaching} /><Thoughts content={content.thoughts} /><Footer content={content.footer} /><div className="viewport-blur" aria-hidden="true" /></main></LazyMotion>;
}
