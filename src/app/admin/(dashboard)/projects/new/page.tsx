import Link from "next/link";
import ProjectEditor from "@/components/admin/ProjectEditor";
import { createEmptyProject } from "@/cms/empty-project";

export default function NewProjectPage() {
  return <><header className="admin-topbar admin-topbar--new"><div><Link className="admin-back-link" href="/admin">→ بازگشت به پروژه‌ها</Link><span className="admin-eyebrow">پروژه تازه</span><h1>داستان بعدی پورتفولیو را بساز</h1><p>با یک ساختار آماده شروع کن یا صفحه را دقیقاً به شکل دلخواهت بساز.</p></div></header><ProjectEditor initialProject={createEmptyProject()} /></>;
}
