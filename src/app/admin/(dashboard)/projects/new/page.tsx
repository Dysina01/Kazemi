import Link from "next/link";
import ProjectEditor, { emptyProject } from "@/components/admin/ProjectEditor";

export default function NewProjectPage() {
  return <><header className="admin-topbar"><div><Link href="/admin">← Projects</Link><h1>New project</h1></div></header><ProjectEditor initialProject={emptyProject()} /></>;
}
