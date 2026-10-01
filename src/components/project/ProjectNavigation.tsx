"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

type NavigationItem = {
  id: string;
  label: string;
};

export default function ProjectNavigation({ items }: { items: NavigationItem[] }) {
  const [activeId, setActiveId] = useState(items[0]?.id ?? "");

  useEffect(() => {
    const sections = items
      .map((item) => document.getElementById(item.id))
      .filter((section): section is HTMLElement => Boolean(section));

    if (!sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActiveId(visible[0].target.id);
      },
      { rootMargin: "-15% 0px -65% 0px", threshold: [0, 0.1, 0.5] },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [items]);

  return (
    <nav className="case-nav" aria-label="Case study navigation">
      <Link href="/#works" className="case-nav__back">
        <Image
          src="/projects/designing-a-portfolio/back-arrow.png"
          alt=""
          width={13}
          height={13}
        />
        <span>Projects</span>
      </Link>
      <span className="case-nav__divider" aria-hidden="true" />
      <div className="case-nav__links">
        {items.map((item) => (
          <a
            href={`#${item.id}`}
            key={item.id}
            className={activeId === item.id ? "is-active" : undefined}
            aria-current={activeId === item.id ? "location" : undefined}
          >
            {item.label}
          </a>
        ))}
      </div>
    </nav>
  );
}

