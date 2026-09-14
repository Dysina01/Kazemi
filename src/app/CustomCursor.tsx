"use client";

import { useEffect, useRef, useState } from "react";

type CursorState = {
  label: string;
  showLabel: boolean;
  active: boolean;
  collaborator: boolean;
  pressed: boolean;
  visible: boolean;
};

const DEFAULT_STATE: CursorState = {
  label: "",
  showLabel: false,
  active: false,
  collaborator: false,
  pressed: false,
  visible: false,
};

function getCursorState(target: Element | null) {
  if (!target) return { label: "", showLabel: false, active: false, collaborator: false };

  const inParnazZone = Boolean(target.closest(".about, .teaching"));

  const custom = target.closest<HTMLElement>("[data-cursor-label]");
  if (custom?.dataset.cursorLabel) {
    return { label: custom.dataset.cursorLabel, showLabel: true, active: true, collaborator: inParnazZone };
  }

  if (inParnazZone) {
    if (target.closest(".profile-ring")) {
      return { label: "Parnaz Kazemi", showLabel: true, active: true, collaborator: true };
    }
    if (target.closest(".career-image-wrap")) {
      return { label: "Career Journey", showLabel: true, active: true, collaborator: true };
    }
    if (target.closest(".teaching img")) {
      return { label: "Teaching Impact", showLabel: true, active: true, collaborator: true };
    }
  }

  const project = target.closest(".project-card");
  if (project) return { label: "View Project", showLabel: true, active: true, collaborator: false };

  const featured = target.closest(".featured-link");
  if (featured) return { label: "Review Project", showLabel: true, active: true, collaborator: false };

  const thought = target.closest(".thoughts a");
  if (thought) return { label: "Read", showLabel: true, active: true, collaborator: false };

  const footerLink = target.closest(".footer-links a");
  if (footerLink) return { label: "Open", showLabel: true, active: true, collaborator: false };

  const navLink = target.closest(".site-header nav a");
  if (navLink) return { label: "Go", showLabel: true, active: true, collaborator: false };

  const utility = target.closest(".utility");
  if (utility) return { label: "Switch", showLabel: true, active: true, collaborator: false };

  const button = target.closest<HTMLElement>(".button");
  if (button) {
    const text = button.textContent?.trim();
    return { label: text || "Open", showLabel: true, active: true, collaborator: false };
  }

  const interactive = target.closest("a, button, [role='button']");
  if (interactive) return { label: "Open", showLabel: true, active: true, collaborator: inParnazZone };

  if (inParnazZone) {
    return { label: "Parnaz", showLabel: true, active: false, collaborator: true };
  }

  return { label: "", showLabel: false, active: false, collaborator: false };
}

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const targetRef = useRef({ x: -100, y: -100 });
  const currentRef = useRef({ x: -100, y: -100 });
  const frameRef = useRef<number | null>(null);
  const [state, setState] = useState(DEFAULT_STATE);

  useEffect(() => {
    const finePointer = window.matchMedia("(pointer: fine)").matches;
    if (!finePointer) return;

    document.documentElement.classList.add("cursor-enabled");

    const animate = () => {
      const cursor = cursorRef.current;
      if (cursor) {
        const current = currentRef.current;
        const target = targetRef.current;
        current.x += (target.x - current.x) * 0.42;
        current.y += (target.y - current.y) * 0.42;
        cursor.style.setProperty("--cursor-x", `${current.x}px`);
        cursor.style.setProperty("--cursor-y", `${current.y}px`);
      }
      frameRef.current = requestAnimationFrame(animate);
    };

    frameRef.current = requestAnimationFrame(animate);

    const onMove = (event: MouseEvent) => {
      targetRef.current = { x: event.clientX, y: event.clientY };
      if (currentRef.current.x < -50) currentRef.current = { x: event.clientX, y: event.clientY };

      const next = getCursorState(event.target instanceof Element ? event.target : null);
      setState((current) => ({ ...current, ...next, visible: true }));
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
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
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
      className={`figma-cursor${state.visible ? " is-visible" : ""}${state.showLabel ? " has-label" : ""}${state.active ? " is-active" : ""}${state.collaborator ? " is-collaborator" : ""}${state.pressed ? " is-pressed" : ""}`}
      aria-hidden="true"
    >
      <svg className="figma-cursor-pointer" viewBox="0 0 28 32" fill="none">
        <path d="M2.3 1.8L25.1 16.1L15.25 18.65L10.45 29.35L2.3 1.8Z" fill="currentColor" stroke="white" strokeWidth="2.2" strokeLinejoin="round" />
      </svg>
      <span className="figma-cursor-label"><i className="figma-live-dot" />{state.label}</span>
    </div>
  );
}
