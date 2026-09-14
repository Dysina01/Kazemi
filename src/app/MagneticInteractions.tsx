"use client";

import { useEffect } from "react";

const SELECTOR = [
  ".button",
  ".featured-link",
  ".project-card",
  ".site-header nav a",
  ".utility",
  ".thoughts a",
  ".footer-links a",
].join(",");

export default function MagneticInteractions() {
  useEffect(() => {
    const finePointer = window.matchMedia("(pointer: fine)").matches;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!finePointer || reduceMotion) return;

    const elements = Array.from(document.querySelectorAll<HTMLElement>(SELECTOR));
    const cleanup: Array<() => void> = [];

    elements.forEach((element) => {
      const strength = element.matches(".project-card, .thoughts a") ? 0.07 : 0.14;
      const maxDistance = element.matches(".project-card, .thoughts a") ? 8 : 12;

      const onMove = (event: MouseEvent) => {
        const rect = element.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const dx = event.clientX - centerX;
        const dy = event.clientY - centerY;

        const x = Math.max(-maxDistance, Math.min(maxDistance, dx * strength));
        const y = Math.max(-maxDistance, Math.min(maxDistance, dy * strength));

        element.style.setProperty("--magnetic-x", `${x}px`);
        element.style.setProperty("--magnetic-y", `${y}px`);
        element.classList.add("is-magnetic");
      };

      const onLeave = () => {
        element.style.setProperty("--magnetic-x", "0px");
        element.style.setProperty("--magnetic-y", "0px");
        element.classList.remove("is-magnetic");
      };

      element.addEventListener("mousemove", onMove);
      element.addEventListener("mouseleave", onLeave);

      cleanup.push(() => {
        element.removeEventListener("mousemove", onMove);
        element.removeEventListener("mouseleave", onLeave);
        element.style.removeProperty("--magnetic-x");
        element.style.removeProperty("--magnetic-y");
        element.classList.remove("is-magnetic");
      });
    });

    return () => cleanup.forEach((fn) => fn());
  }, []);

  return null;
}
