import Link from "next/link";

export default function ProjectNotFound() {
  return (
    <main className="case-not-found">
      <p>Project not found.</p>
      <Link href="/#works">Back to projects</Link>
    </main>
  );
}

