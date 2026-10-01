import type { ProjectBody as ProjectBodyValue } from "@/sanity/types";

export default function ProjectBody({ value }: { value: ProjectBodyValue }) {
  if (!value.length) return null;

  return (
    <div className="case-copy">
      {value.map((paragraph, index) => <p key={`${index}-${paragraph.slice(0, 24)}`}>{paragraph}</p>)}
    </div>
  );
}
