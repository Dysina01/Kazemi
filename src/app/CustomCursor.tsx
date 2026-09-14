"use client";

import { useEffect, useRef, useState } from "react";

type CursorState = {
  label: string;
  showLabel: boolean;
  active: boolean;
  pressed: boolean;
  visible: boolean;
};

const DEFAULT_STATE: CursorState = {
  label: "",
  showLabel: false,
  active: false,
  pressed: false,
  visible: false,
};

function getCursorLabel(target: Element | null) {
  if (!target) return { label: "", showLabel: false, active: false };

  const custom = target.closest<HTMLElement>("[data-cursor-label]");
  if (custom?.dataset.cursorLabel) {
    return { label: custom.dataset.cursorLabel, showLabel: true, active: true };
  }

  const project = target.closest(".project-card");
  if (project) return { label: "View Project", showLabel: true, active: true };

  const featured = target.closest(".featured-link");
  if (featured) return { label: "Review Project", showLabel: true, active: true };

  const thought = target.closest(".thoughts a");
  if (thought) return { label: "Read", showLabel: true, active: true };

  const footerLink = target.closest(".footer-links a");
  if (footerLink) return { label: "Open", showLabel: true, active: true };

  const navLink = target.closest(".site-header nav a");
  if (navLink) return { label: "Go", showLabel: true, active: true };

  const utility = target.closest(".utility");
  if (utility) return { label: "Switch", showLabel: true, active: true };

  const button = target.closest<HTMLElement>(".button");
  if (button) {
    const text = button.textContent?.trim();
    return { label: text || "Open", showLabel: true, active: true };
  }

  const interactive = target.closest("a, button, [role='button']");
  if (interactive) return { label: "Open", showLabel: true, active: true };

  // Sections 5 and 6: About/Bio + Teaching.
  const bioZone = target.closest(".about, .teaching");
  if (bioZone) return { label: "Parnaz", showLabel: true, active: false };

  return { label: "", showLabel: false, active: false };
}

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const [state, setState] = useState(DEFAULT_STATE);

  useEffect(() => {
    const finePointer = window.matchMedia("(pointer: fine)").matches;
    if (!finePointer) return;

    document.documentElement.classList.add("cursor-enabled");

    const onMove = (event: MouseEvent) => {
      const cursor = cursorRef.current;
      if (cursor) {
        cursor.style.setProperty("--cursor-x", `${event.clientX}px`);
        cursor.style.setProperty("--cursor-y", `${event.clientY}px`);
      }

      const next = getCursorLabel(event.target instanceof Element ? event.target : null);
      setState((current) => ({
        ...current,
        ...next,
        visible: true,
      }));
    };

    const onDown = () => setState((current) => ({ ...current, pressed: true }));
    const onUp = () => setState((current) => ({ ...current, pressed: false }));
    const onLeave = () => setState((current) => ({ ...current, visible: false }));
    const onEnter = () => setState((current) => ({ ...current, visible: true }));

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);
    document.documentElement.addEventListener("mouseleave", onLeave);
    document.documentElement.addEventListener("mouseenter", onEnter);

    return () => {
      document.documentElement.classList.remove("cursor-enabled");
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
      document.documentElement.removeEventListener("mouseleave", onLeave);
      document.documentElement.removeEventListener("mouseenter", onEnter);
    };
  }, []);

  return (
    <div
      ref={cursorRef}
      className={`figma-cursor${state.visible ? " is-visible" : ""}${state.showLabel ? " has-label" : ""}${state.active ? " is-active" : ""}${state.pressed ? " is-pressed" : ""}`}
      aria-hidden="true"
    >
      <svg className="figma-cursor-pointer" viewBox="0 0 28 32" fill="none">
        <path d="M2.3 1.8L25.1 16.1L15.25 18.65L10.45 29.35L2.3 1.8Z" fill="currentColor" stroke="white" strokeWidth="2.2" strokeLinejoin="round" />
      </svg>
      <span className="figma-cursor-label">{state.label}</span>
    </div>
  );
}
