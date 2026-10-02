"use client";

import Image from "next/image";
import { useDeferredValue, useEffect, useMemo, useState } from "react";
import { listAllMedia, type MediaFile } from "@/lib/supabase/media";
import type { ProjectAsset } from "@/sanity/types";

export default function MediaPicker({ open, onClose, onSelect }: { open: boolean; onClose: () => void; onSelect: (asset: ProjectAsset) => void }) {
  const [files, setFiles] = useState<MediaFile[] | null>(null);
  const [search, setSearch] = useState("");
  useEffect(() => {
    if (!open) return;
    let active = true;
    void listAllMedia()
      .then((items) => { if (active) setFiles(items); })
    return () => { active = false; };
  }, [open]);
  useEffect(() => {
    if (!open) return;
    const close = (event: KeyboardEvent) => { if (event.key === "Escape") onClose(); };
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, [onClose, open]);
  const deferredSearch = useDeferredValue(search);
  const visible = useMemo(() => (files || []).filter((file) => file.name.toLowerCase().includes(deferredSearch.toLowerCase()) && file.mimetype.startsWith("image/")), [files, deferredSearch]);
  function choose(file: MediaFile) {
    const image = new window.Image();
    image.onload = () => { onSelect({ src: file.url, alt: file.name.replace(/\.[^.]+$/, ""), width: image.naturalWidth || 1600, height: image.naturalHeight || 1000 }); onClose(); };
    image.onerror = () => { onSelect({ src: file.url, alt: file.name, width: 1600, height: 1000 }); onClose(); };
    image.src = file.url;
  }
  if (!open) return null;
  return <div className="admin-modal" role="dialog" aria-modal="true" aria-label="انتخاب تصویر"><button className="admin-modal__backdrop" type="button" onClick={onClose} aria-label="بستن انتخاب تصویر" /><section className="admin-modal__panel"><header><div><h2>انتخاب تصویر</h2><p>یکی از فایل‌های قبلی را انتخاب کن.</p></div><button className="admin-icon-button" type="button" onClick={onClose} aria-label="بستن">×</button></header><label className="admin-search"><span>⌕</span><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="جست‌وجوی تصاویر…" autoFocus /></label>{files === null ? <div className="admin-empty">در حال بارگذاری…</div> : visible.length ? <div className="admin-media-grid admin-media-grid--picker">{visible.map((file) => <button type="button" className="admin-media-card" onClick={() => choose(file)} key={file.path}><div className="admin-media-card__preview"><Image src={file.url} alt="" fill sizes="180px" /></div><span dir="ltr">{file.name}</span></button>)}</div> : <div className="admin-empty"><strong>تصویری پیدا نشد</strong><span>عبارت جست‌وجو را تغییر بده یا از بخش تصاویر فایل جدیدی اضافه کن.</span></div>}</section></div>;
}
