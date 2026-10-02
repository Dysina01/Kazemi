"use client";

import { useState, useTransition } from "react";
import { setProjectStatus } from "@/app/admin/actions";

export default function PublicationSwitch({ projectId, initialPublished }: { projectId: string; initialPublished: boolean }) {
  const [published, setPublished] = useState(initialPublished);
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState("");
  function toggle() {
    const next = !published;
    if (!next && !confirm("پروژه از سایت مخفی شود؟ نسخه داخل پنل حذف نمی‌شود.")) return;
    setPublished(next);
    setMessage("");
    startTransition(async () => {
      const result = await setProjectStatus(projectId, next ? "published" : "draft");
      if (!result.ok) {
        setPublished(!next);
        setMessage(result.error || "تغییر وضعیت انجام نشد");
      } else setMessage(next ? "منتشر شد" : "از سایت مخفی شد");
    });
  }

  return <div className="admin-publication-control">
    <span><strong>{published ? "منتشرشده" : "منتشرنشده"}</strong><small>{message || (published ? "در سایت قابل مشاهده است" : "فقط داخل پنل دیده می‌شود")}</small></span>
    <button type="button" role="switch" aria-checked={published} className="admin-switch" onClick={toggle} disabled={pending} aria-label="تغییر وضعیت انتشار"><i /></button>
  </div>;
}
