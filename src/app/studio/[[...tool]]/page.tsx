"use client";

import { NextStudio } from "next-sanity/studio";
import config from "@/sanity/config";
import { isSanityConfigured } from "@/sanity/env";

export default function StudioPage() {
  if (!isSanityConfigured) {
    return (
      <main style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        padding: 24,
        background: "#f7f7f9",
        color: "#111",
        fontFamily: "var(--font-rounded)",
      }}>
        <section style={{ maxWidth: 560, padding: 32, borderRadius: 24, background: "#fff" }}>
          <h1 style={{ marginTop: 0 }}>Sanity needs to be connected</h1>
          <p style={{ lineHeight: 1.6, color: "#5b5f63" }}>
            Add NEXT_PUBLIC_SANITY_PROJECT_ID and NEXT_PUBLIC_SANITY_DATASET to
            the Vercel environment. The portfolio page already works with its
            local fallback content.
          </p>
        </section>
      </main>
    );
  }

  return <NextStudio config={config} />;
}

