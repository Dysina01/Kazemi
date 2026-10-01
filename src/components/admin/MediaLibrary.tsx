"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { listAllMedia, removeMedia, uploadMedia, type MediaFile } from "@/lib/supabase/media";

const formatBytes = (bytes: number) => bytes ? `${(bytes / 1024 / 1024).toFixed(bytes > 1048576 ? 1 : 2)} MB` : "—";

export default function MediaLibrary() {
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  async function refresh() { setLoading(true); try { setFiles(await listAllMedia()); } finally { setLoading(false); } }
  useEffect(() => {
    let active = true;
    void listAllMedia()
      .then((items) => { if (active) setFiles(items); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);
  const visible = useMemo(() => files.filter((file) => file.name.toLowerCase().includes(search.toLowerCase())), [files, search]);
  async function upload(selected: FileList | null) { if (!selected?.length) return; setUploading(true); try { await uploadMedia(Array.from(selected)); await refresh(); } finally { setUploading(false); } }
  async function remove(file: MediaFile) { if (!confirm(`فایل «${file.name}» حذف شود؟ اگر در پروژه‌ای استفاده شده باشد، دیگر نمایش داده نمی‌شود.`)) return; await removeMedia(file.path); setFiles((items) => items.filter((item) => item.path !== file.path)); }
  return <><div className="admin-library-toolbar admin-card"><label className="admin-search"><span>⌕</span><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="جست‌وجوی تصاویر…" /></label><label className="admin-button admin-button--primary admin-upload-button">{uploading ? "در حال آپلود…" : "+ آپلود فایل"}<input type="file" multiple accept="image/*,video/mp4,video/webm" disabled={uploading} onChange={(event) => void upload(event.target.files)} /></label><span>{files.length.toLocaleString("fa-IR")} فایل</span></div>{loading ? <section className="admin-card admin-empty">در حال بارگذاری تصاویر…</section> : <section className="admin-media-grid">{visible.map((file) => <article className="admin-media-card" key={file.path}><div className="admin-media-card__preview">{file.mimetype.startsWith("image/") ? <Image src={file.url} alt="" fill sizes="(max-width: 800px) 50vw, 220px" /> : <div className="admin-video-file">ویدئو</div>}</div><div className="admin-media-card__meta"><strong dir="ltr" title={file.name}>{file.name}</strong><span>{formatBytes(file.size)} · {file.mimetype.split("/")[1]?.toUpperCase()}</span><div><button type="button" onClick={() => navigator.clipboard.writeText(file.url)}>کپی آدرس</button><button type="button" className="is-danger" onClick={() => void remove(file)}>حذف</button></div></div></article>)}</section>}</>;
}
