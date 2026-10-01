"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { listAllMedia, type MediaFile } from "@/lib/supabase/media";
import type { ProjectAsset } from "@/sanity/types";

export default function MediaPicker({ open, onClose, onSelect }: { open: boolean; onClose: () => void; onSelect: (asset: ProjectAsset) => void }) {
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (!open) return;
    let active = true;
    void listAllMedia()
      .then((items) => { if (active) setFiles(items); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [open]);
  const visible = useMemo(() => files.filter((file) => file.name.toLowerCase().includes(search.toLowerCase()) && file.mimetype.startsWith("image/")), [files, search]);
  function choose(file: MediaFile) {
    const image = new window.Image();
    image.onload = () => { onSelect({ src: file.url, alt: file.name.replace(/\.[^.]+$/, ""), width: image.naturalWidth || 1600, height: image.naturalHeight || 1000 }); onClose(); };
    image.onerror = () => { onSelect({ src: file.url, alt: file.name, width: 1600, height: 1000 }); onClose(); };
    image.src = file.url;
  }
  if (!open) return null;
  return <div className="admin-modal" role="dialog" aria-modal="true" aria-label="انتخاب تصویر"><button className="admin-modal__backdrop" type="button" onClick={onClose} aria-label="بستن انتخاب تصویر" /><section className="admin-modal__panel"><header><div><h2>انتخاب تصویر</h2><p>یکی از فایل‌های قبلی را انتخاب کن.</p></div><button className="admin-icon-button" type="button" onClick={onClose}>×</button></header><label className="admin-search"><span>⌕</span><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="جست‌وجوی تصاویر…" autoFocus /></label>{loading ? <div className="admin-empty">در حال بارگذاری…</div> : <div className="admin-media-grid admin-media-grid--picker">{visible.map((file) => <button type="button" className="admin-media-card" onClick={() => choose(file)} key={file.path}><div className="admin-media-card__preview"><Image src={file.url} alt="" fill sizes="180px" /></div><span dir="ltr">{file.name}</span></button>)}</div>}</section></div>;
}
