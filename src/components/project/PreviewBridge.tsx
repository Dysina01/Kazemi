"use client";

import { useEffect } from "react";

export default function PreviewBridge() {
  useEffect(() => {
    function focusSection(event: MessageEvent) {
      if (event.origin !== window.location.origin || event.data?.type !== "cms:focus-section") return;
      const target = document.querySelector<HTMLElement>(`[data-project-section-key="${CSS.escape(String(event.data.key))}"]`);
      if (!target) return;
      target.scrollIntoView({ behavior: "smooth", block: "center" });
      target.classList.remove("is-cms-focused");
      window.requestAnimationFrame(() => target.classList.add("is-cms-focused"));
      window.setTimeout(() => target.classList.remove("is-cms-focused"), 1500);
    }
    window.addEventListener("message", focusSection);
    return () => window.removeEventListener("message", focusSection);
  }, []);
  return null;
}
