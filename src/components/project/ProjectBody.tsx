import { PortableText } from "@portabletext/react";
import type { PortableTextBlock } from "@portabletext/types";
import type { ProjectBody as ProjectBodyValue } from "@/sanity/types";

export default function ProjectBody({ value }: { value: ProjectBodyValue }) {
  if (!value.length) return null;

  if (typeof value[0] === "string") {
    return (
      <div className="case-copy">
        {(value as string[]).map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>
    );
  }

  return (
    <div className="case-copy">
      <PortableText value={value as PortableTextBlock[]} />
    </div>
  );
}

