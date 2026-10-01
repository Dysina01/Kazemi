import Link from "next/link";
import ProjectEditor, { emptyProject } from "@/components/admin/ProjectEditor";

export default function NewProjectPage() {
  return <><header className="admin-topbar"><div><Link href="/admin">→ بازگشت به پروژه‌ها</Link><h1>پروژه جدید</h1></div></header><ProjectEditor initialProject={emptyProject()} /></>;
}
