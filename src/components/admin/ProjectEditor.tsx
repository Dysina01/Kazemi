"use client";

import { useCallback, useEffect, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { ProjectAsset, ProjectSection } from "@/sanity/types";
import type { ProjectRecord } from "@/cms/projects";
import { createClient } from "@/lib/supabase/client";
import { deleteProject, saveProject } from "@/app/admin/actions";
import MediaPicker from "./MediaPicker";

type EditableProject = ProjectRecord;
type AnySection = ProjectSection & Record<string, unknown>;
type PreviewDevice = "desktop" | "tablet" | "mobile";

const sectionLabels: Record<ProjectSection["_type"], string> = {
  contentSection: "متن و تصویر", gallerySection: "گالری تصاویر", metricsSection: "نتایج و آمار",
  quoteSection: "نقل‌قول", beforeAfterSection: "قبل و بعد",
};
const previewWidths: Record<PreviewDevice, number> = { desktop: 1440, tablet: 768, mobile: 390 };

function sectionSummary(section: ProjectSection) {
  if (section._type === "contentSection") return section.heading || section.label || "سکشن متنی بدون عنوان";
  if (section._type === "gallerySection") return `${section.items.length} تصویر در گالری`;
  if (section._type === "metricsSection") return section.heading || `${section.items.length} نتیجه و آمار`;
  if (section._type === "quoteSection") return section.quote || "نقل‌قول بدون متن";
  return section.heading || "مقایسه قبل و بعد";
}

function sectionThumbnail(section: ProjectSection) {
  if (section._type === "contentSection") return section.media?.src;
  if (section._type === "gallerySection") return section.items[0]?.src;
  if (section._type === "beforeAfterSection") return section.after?.src || section.before?.src;
  return undefined;
}

const emptyAsset = (): ProjectAsset => ({ src: "", alt: "", width: 1600, height: 1000 });
const uid = () => crypto.randomUUID();
const toSlug = (value: string) => value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

export const emptyProject = (): EditableProject => ({
  id: "", slug: "", title: "", category: "", year: String(new Date().getFullYear()),
  description: "", hero: emptyAsset(), facts: [], sections: [], status: "draft",
  featured: false, sortOrder: 0, seo: { title: "", description: "" },
});

function AssetFields({ asset, onChange, slug }: { asset: ProjectAsset; onChange: (asset: ProjectAsset) => void; slug: string }) {
  const [uploading, setUploading] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);
  async function upload(file: File) {
    setUploading(true);
    const ext = file.name.split(".").pop()?.toLowerCase() || "bin";
    const path = `${slug || "draft"}/${uid()}.${ext}`;
    const supabase = createClient();
    const { error } = await supabase.storage.from("project-media").upload(path, file, { upsert: false });
    if (!error) {
      const { data } = supabase.storage.from("project-media").getPublicUrl(path);
      onChange({ ...asset, src: data.publicUrl, alt: asset.alt || file.name.replace(/\.[^.]+$/, "") });
    }
    setUploading(false);
  }
  return <>
    <div className="admin-asset-picker">
      <div className="admin-asset-preview">{asset.src ? <span className="admin-asset-image" style={{ backgroundImage: `url("${asset.src.replaceAll('"', '%22')}")` }} role="img" aria-label={asset.alt || "تصویر انتخاب‌شده"} /> : <span>تصویری انتخاب نشده</span>}</div>
      <div className="admin-asset-actions">
        <label className="admin-button admin-button--primary">{uploading ? "در حال آپلود…" : "آپلود تصویر"}<input type="file" accept="image/*,video/mp4,video/webm" disabled={uploading} onChange={(e) => { const file = e.target.files?.[0]; if (file) void upload(file); }} /></label>
        <button type="button" className="admin-button" onClick={() => setPickerOpen(true)}>انتخاب از تصاویر</button>
        <details className="admin-advanced-fields"><summary>تنظیمات بیشتر</summary><div className="admin-grid"><label className="admin-field admin-span-2"><span>آدرس فایل</span><input dir="ltr" value={asset.src} onChange={(e) => onChange({ ...asset, src: e.target.value })} /></label><label className="admin-field admin-span-2"><span>توضیح تصویر</span><input value={asset.alt} onChange={(e) => onChange({ ...asset, alt: e.target.value })} /></label><label className="admin-field"><span>عرض</span><input type="number" value={asset.width} onChange={(e) => onChange({ ...asset, width: Number(e.target.value) })} /></label><label className="admin-field"><span>ارتفاع</span><input type="number" value={asset.height} onChange={(e) => onChange({ ...asset, height: Number(e.target.value) })} /></label></div></details>
      </div>
    </div>
    <MediaPicker open={pickerOpen} onClose={() => setPickerOpen(false)} onSelect={onChange} />
  </>;
}

function SectionEditor({ section, slug, onChange }: { section: AnySection; slug: string; onChange: (section: AnySection) => void }) {
  const patch = (value: Record<string, unknown>) => onChange({ ...section, ...value } as AnySection);
  if (section._type === "contentSection") {
    return <div className="admin-grid"><label className="admin-field"><span>Navigation label</span><input value={section.label} onChange={(e) => patch({ label: e.target.value })} /></label><label className="admin-field"><span>Anchor ID</span><input value={section.id} onChange={(e) => patch({ id: e.target.value })} /></label><label className="admin-field admin-span-2"><span>Heading</span><input value={section.heading} onChange={(e) => patch({ heading: e.target.value })} /></label><label className="admin-field admin-span-2"><span>Body — separate paragraphs with a blank line</span><textarea value={Array.isArray(section.body) ? (section.body as string[]).join("\n\n") : ""} onChange={(e) => patch({ body: e.target.value.split(/\n\s*\n/).filter(Boolean) })} /></label><label className="admin-field"><span>Show in sticky navigation</span><select value={section.showInNavigation ? "yes" : "no"} onChange={(e) => patch({ showInNavigation: e.target.value === "yes" })}><option value="yes">Yes</option><option value="no">No</option></select></label><div className="admin-span-2"><strong>Optional media</strong><AssetFields slug={slug} asset={section.media || emptyAsset()} onChange={(media) => patch({ media: media.src ? media : undefined })} /></div></div>;
  }
  if (section._type === "gallerySection") {
    return <div className="admin-array">{section.items.map((item, index) => <div className="admin-array-item" key={item._key}><div className="admin-array-item__bar"><strong>Gallery item {index + 1}</strong><button type="button" className="admin-icon-button" onClick={() => patch({ items: section.items.filter((entry) => entry._key !== item._key) })}>×</button></div><AssetFields slug={slug} asset={item} onChange={(asset) => patch({ items: section.items.map((entry) => entry._key === item._key ? { ...item, ...asset } : entry) })} /><div className="admin-grid"><label className="admin-field"><span>Size</span><select value={item.size} onChange={(e) => patch({ items: section.items.map((entry) => entry._key === item._key ? { ...item, size: e.target.value } : entry) })}><option value="wide">Wide</option><option value="narrow">Narrow</option></select></label><label className="admin-field"><span>Title</span><input value={item.title || ""} onChange={(e) => patch({ items: section.items.map((entry) => entry._key === item._key ? { ...item, title: e.target.value } : entry) })} /></label><label className="admin-field admin-span-2"><span>Description</span><input value={item.description || ""} onChange={(e) => patch({ items: section.items.map((entry) => entry._key === item._key ? { ...item, description: e.target.value } : entry) })} /></label></div></div>)}<button type="button" className="admin-button" onClick={() => patch({ items: [...section.items, { _key: uid(), size: "wide", ...emptyAsset() }] })}>+ Gallery item</button></div>;
  }
  if (section._type === "metricsSection") {
    return <div className="admin-form-stack"><div className="admin-grid"><label className="admin-field"><span>Label</span><input value={section.label || ""} onChange={(e) => patch({ label: e.target.value })} /></label><label className="admin-field"><span>Heading</span><input value={section.heading || ""} onChange={(e) => patch({ heading: e.target.value })} /></label></div>{section.items.map((item) => <div className="admin-grid" key={item._key}><label className="admin-field"><span>Value</span><input value={item.value} onChange={(e) => patch({ items: section.items.map((x) => x._key === item._key ? { ...x, value: e.target.value } : x) })} /></label><label className="admin-field"><span>Metric label</span><input value={item.label} onChange={(e) => patch({ items: section.items.map((x) => x._key === item._key ? { ...x, label: e.target.value } : x) })} /></label></div>)}<button type="button" className="admin-button" onClick={() => patch({ items: [...section.items, { _key: uid(), label: "", value: "" }] })}>+ Metric</button></div>;
  }
  if (section._type === "quoteSection") return <div className="admin-grid"><label className="admin-field admin-span-2"><span>Quote</span><textarea value={section.quote} onChange={(e) => patch({ quote: e.target.value })} /></label><label className="admin-field admin-span-2"><span>Attribution</span><input value={section.attribution || ""} onChange={(e) => patch({ attribution: e.target.value })} /></label></div>;
  if (section._type === "beforeAfterSection") return <div className="admin-form-stack"><div className="admin-grid"><label className="admin-field"><span>Label</span><input value={section.label || ""} onChange={(e) => patch({ label: e.target.value })} /></label><label className="admin-field"><span>Heading</span><input value={section.heading || ""} onChange={(e) => patch({ heading: e.target.value })} /></label></div><strong>Before</strong><AssetFields slug={slug} asset={section.before} onChange={(before) => patch({ before })} /><strong>After</strong><AssetFields slug={slug} asset={section.after} onChange={(after) => patch({ after })} /></div>;
  return null;
}

export default function ProjectEditor({ initialProject }: { initialProject: EditableProject }) {
  const [project, setProject] = useState(initialProject);
  const [message, setMessage] = useState("");
  const [saveState, setSaveState] = useState<"saved" | "unsaved" | "saving" | "error">("saved");
  const [previewVersion, setPreviewVersion] = useState(0);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewDevice, setPreviewDevice] = useState<PreviewDevice>("desktop");
  const [previewBounds, setPreviewBounds] = useState({ width: 0, height: 0 });
  const [selectedSectionKey, setSelectedSectionKey] = useState<string | null>(null);
  const [expandedSectionKey, setExpandedSectionKey] = useState<string | null>(null);
  const [removedSection, setRemovedSection] = useState<{ section: ProjectSection; index: number } | null>(null);
  const [draggedKey, setDraggedKey] = useState<string | null>(null);
  const [activeStep, setActiveStep] = useState(0);
  const [pending, startTransition] = useTransition();
  const router = useRouter();
  const savedSnapshot = useRef(JSON.stringify(initialProject));
  const previewRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const set = <K extends keyof EditableProject>(key: K, value: EditableProject[K]) => setProject((current) => ({ ...current, [key]: value }));
  const addSection = (type: ProjectSection["_type"]) => {
    const base = { _key: uid(), _type: type };
    const section = type === "contentSection" ? { ...base, id: `section-${project.sections.length + 1}`, label: "Section", heading: "", body: [""], showInNavigation: true }
      : type === "gallerySection" ? { ...base, items: [] }
      : type === "metricsSection" ? { ...base, items: [] }
      : type === "quoteSection" ? { ...base, quote: "" }
      : { ...base, before: emptyAsset(), after: emptyAsset() };
    set("sections", [...project.sections, section as ProjectSection]);
    setSelectedSectionKey(base._key);
    setExpandedSectionKey(base._key);
  };
  function dropSection(targetKey: string) {
    if (!draggedKey || draggedKey === targetKey) return;
    const next = [...project.sections];
    const from = next.findIndex((item) => item._key === draggedKey);
    const to = next.findIndex((item) => item._key === targetKey);
    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved);
    set("sections", next);
    setDraggedKey(null);
  }
  function duplicateSection(section: ProjectSection, index: number) {
    const copy = { ...structuredClone(section), _key: uid() } as ProjectSection;
    const next = [...project.sections];
    next.splice(index + 1, 0, copy);
    set("sections", next);
    setSelectedSectionKey(copy._key);
    setExpandedSectionKey(copy._key);
  }
  function removeSection(section: ProjectSection, index: number) {
    setRemovedSection({ section, index });
    set("sections", project.sections.filter((item) => item._key !== section._key));
    if (selectedSectionKey === section._key) setSelectedSectionKey(null);
  }
  function undoRemove() {
    if (!removedSection) return;
    const next = [...project.sections];
    next.splice(removedSection.index, 0, removedSection.section);
    set("sections", next);
    setExpandedSectionKey(removedSection.section._key);
    setRemovedSection(null);
  }
  function focusSection(key: string) {
    setSelectedSectionKey(key);
    setExpandedSectionKey(key);
    if (!previewOpen) setPreviewOpen(true);
  }
  const persist = useCallback(async (showMessage = false) => {
    if (!project.slug || !project.title) return;
    setSaveState("saving");
    if (showMessage) setMessage("");
    const snapshot = JSON.stringify(project);
    const result = await saveProject(snapshot);
    if (!result.ok) {
      setSaveState("error");
      setMessage(result.error || "Save failed");
      return;
    }
    savedSnapshot.current = snapshot;
    setSaveState("saved");
    if (showMessage) setMessage("Saved successfully");
    if (!project.id && result.id) router.replace(`/admin/projects/${result.id}`);
    if (showMessage) router.refresh();
  }, [project, router]);
  useEffect(() => {
    if (!project.id) return;
    const snapshot = JSON.stringify(project);
    if (snapshot === savedSnapshot.current) return;
    setSaveState("unsaved");
    const timeout = window.setTimeout(() => void persist(), 1200);
    return () => window.clearTimeout(timeout);
  }, [project, persist]);
  useEffect(() => {
    const frame = previewRef.current;
    if (!frame || !previewOpen) return;
    const observer = new ResizeObserver(([entry]) => setPreviewBounds({ width: entry.contentRect.width, height: entry.contentRect.height }));
    observer.observe(frame);
    return () => observer.disconnect();
  }, [previewOpen]);
  useEffect(() => {
    if (!selectedSectionKey || !previewOpen) return;
    iframeRef.current?.contentWindow?.postMessage({ type: "cms:focus-section", key: selectedSectionKey }, window.location.origin);
  }, [previewOpen, previewVersion, selectedSectionKey]);
  function save() { startTransition(async () => persist(true)); }
  function remove() { if (!project.id || !confirm("این پروژه برای همیشه حذف شود؟")) return; startTransition(async () => { await deleteProject(project.id); }); }
  const statusLabel = saveState === "saving" ? "در حال ذخیره…" : saveState === "unsaved" ? "تغییرات ذخیره نشده" : saveState === "error" ? "ذخیره انجام نشد" : "همه تغییرات ذخیره شده";

  return <div className={`admin-editor-shell ${previewOpen && project.id ? "has-preview" : ""}`}>
    <div className="admin-editor">
      <nav className="admin-editor-steps" aria-label="مراحل ساخت پروژه">{["اطلاعات کلی", "تصاویر و مشخصات", "محتوای پروژه", "بررسی و انتشار"].map((label, index) => <button type="button" className={activeStep === index ? "is-active" : ""} onClick={() => setActiveStep(index)} key={label}><i>{index + 1}</i><span>{label}</span></button>)}</nav>

      <section className={`admin-card admin-editor__section admin-editor-step ${activeStep === 0 ? "is-active" : ""}`}>
        <header><div><h2>اطلاعات کلی</h2><small>اول اطلاعات اصلی پروژه را وارد کن.</small></div></header>
        <div className="admin-grid">
          <label className="admin-field admin-span-2"><span>نام پروژه</span><input value={project.title} onChange={(e) => { const title = e.target.value; setProject((current) => ({ ...current, title, slug: !current.slug || current.slug === toSlug(current.title) ? toSlug(title) : current.slug })); }} placeholder="مثلاً Designing a Portfolio" /></label>
          <label className="admin-field"><span>دسته‌بندی</span><input value={project.category} onChange={(e) => set("category", e.target.value)} placeholder="Product Design" /></label>
          <label className="admin-field"><span>سال پروژه</span><input value={project.year} onChange={(e) => set("year", e.target.value)} /></label>
          <label className="admin-field admin-span-2"><span>توضیح کوتاه</span><textarea value={project.description} onChange={(e) => set("description", e.target.value)} placeholder="این پروژه درباره چیست؟" /></label>
          <details className="admin-advanced-fields admin-span-2"><summary>تنظیمات بیشتر</summary><div className="admin-grid"><label className="admin-field"><span>آدرس پروژه</span><input dir="ltr" value={project.slug} onChange={(e) => set("slug", toSlug(e.target.value))} placeholder="project-name" /></label><label className="admin-field"><span>لینک خارجی</span><input dir="ltr" value={project.externalUrl || ""} onChange={(e) => set("externalUrl", e.target.value)} /></label></div></details>
        </div>
        <footer className="admin-step-footer"><span /><button type="button" className="admin-button admin-button--primary" onClick={() => setActiveStep(1)}>مرحله بعد</button></footer>
      </section>

      <section className={`admin-card admin-editor__section admin-editor-step ${activeStep === 1 ? "is-active" : ""}`}><header><div><h2>تصویر اصلی</h2><small>تصویری که روی کارت و ابتدای صفحه پروژه دیده می‌شود.</small></div></header><AssetFields slug={project.slug} asset={project.hero} onChange={(hero) => set("hero", hero)} /></section>

      <section className={`admin-card admin-editor__section admin-editor-step ${activeStep === 1 ? "is-active" : ""}`}>
        <header><div><h2>مشخصات پروژه</h2><small>مثل نقش، مدت زمان یا ابزارهای استفاده‌شده.</small></div><button type="button" className="admin-button" onClick={() => set("facts", [...project.facts, { label: "", value: "" }])}>+ افزودن مشخصه</button></header>
        <div className="admin-array">{project.facts.map((fact, index) => <div className="admin-grid admin-array-item" key={`${index}-${fact.label}`}>
          <label className="admin-field"><span>عنوان</span><input value={fact.label} onChange={(e) => set("facts", project.facts.map((x, i) => i === index ? { ...x, label: e.target.value } : x))} placeholder="نقش من" /></label>
          <label className="admin-field"><span>مقدار</span><input value={fact.value} onChange={(e) => set("facts", project.facts.map((x, i) => i === index ? { ...x, value: e.target.value } : x))} placeholder="Product Designer" /></label>
          <button type="button" className="admin-button admin-button--danger" onClick={() => set("facts", project.facts.filter((_, i) => i !== index))}>حذف</button>
        </div>)}</div>
        <footer className="admin-step-footer"><button type="button" className="admin-button" onClick={() => setActiveStep(0)}>مرحله قبل</button><button type="button" className="admin-button admin-button--primary" onClick={() => setActiveStep(2)}>مرحله بعد</button></footer>
      </section>

      <section className={`admin-card admin-editor__section admin-editor-step ${activeStep === 2 ? "is-active" : ""}`}>
        <header><div><h2>محتوای پروژه</h2><small>بخش‌ها را بساز و با کشیدن دستگیره جابه‌جا کن.</small></div><select className="admin-button" defaultValue="" onChange={(e) => { if (e.target.value) addSection(e.target.value as ProjectSection["_type"]); e.target.value = ""; }}><option value="" disabled>+ افزودن بخش</option><option value="contentSection">متن و تصویر</option><option value="gallerySection">گالری تصاویر</option><option value="metricsSection">نتایج و آمار</option><option value="quoteSection">نقل‌قول</option><option value="beforeAfterSection">قبل و بعد</option></select></header>
        <div className="admin-array admin-section-builder">{project.sections.map((section, index) => { const expanded = expandedSectionKey === section._key; const thumbnail = sectionThumbnail(section); return <div className={`admin-array-item admin-sortable admin-section-card ${draggedKey === section._key ? "is-dragging" : ""} ${selectedSectionKey === section._key ? "is-selected" : ""} ${section.hidden ? "is-hidden" : ""}`} key={section._key} onDragOver={(event) => event.preventDefault()} onDrop={() => dropSection(section._key)}>
          <div className="admin-array-item__bar admin-section-card__bar" onClick={() => focusSection(section._key)} role="button" tabIndex={0} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") focusSection(section._key); }}>
            <div className="admin-section-title"><button type="button" className="admin-drag-handle" draggable onDragStart={() => setDraggedKey(section._key)} onDragEnd={() => setDraggedKey(null)} onClick={(event) => event.stopPropagation()} aria-label="جابه‌جایی بخش">⋮⋮</button><div className="admin-section-thumb">{thumbnail ? <span style={{ backgroundImage: `url("${thumbnail.replaceAll('"', '%22')}")` }} /> : <i>{index + 1}</i>}</div><div><strong>{sectionLabels[section._type]}</strong><small>{sectionSummary(section)}</small></div>{section.hidden ? <em>مخفی</em> : null}</div>
            <div className="admin-array-item__actions" onClick={(event) => event.stopPropagation()}><button type="button" className="admin-icon-button" onClick={() => set("sections", project.sections.map((item) => item._key === section._key ? { ...item, hidden: !item.hidden } : item))} aria-label={section.hidden ? "نمایش سکشن" : "مخفی‌کردن سکشن"} title={section.hidden ? "نمایش" : "مخفی‌کردن"}>{section.hidden ? "◉" : "○"}</button><button type="button" className="admin-icon-button" onClick={() => duplicateSection(section, index)} aria-label="کپی سکشن" title="کپی">⧉</button><button type="button" className="admin-icon-button" onClick={() => removeSection(section, index)} aria-label="حذف سکشن" title="حذف">×</button><button type="button" className="admin-icon-button admin-section-toggle" onClick={() => { setSelectedSectionKey(section._key); setExpandedSectionKey(expanded ? null : section._key); }} aria-label={expanded ? "بستن تنظیمات" : "بازکردن تنظیمات"}>{expanded ? "⌃" : "⌄"}</button></div>
          </div>
          {expanded ? <div className="admin-section-card__editor"><SectionEditor slug={project.slug} section={section as AnySection} onChange={(value) => set("sections", project.sections.map((x) => x._key === section._key ? value : x) as ProjectSection[])} /></div> : null}
        </div>; })}</div>
        {removedSection ? <div className="admin-undo"><span>سکشن حذف شد.</span><button type="button" onClick={undoRemove}>برگرداندن</button></div> : null}
        <footer className="admin-step-footer"><button type="button" className="admin-button" onClick={() => setActiveStep(1)}>مرحله قبل</button><button type="button" className="admin-button admin-button--primary" onClick={() => setActiveStep(3)}>بررسی نهایی</button></footer>
      </section>

      <section className={`admin-card admin-editor__section admin-editor-step ${activeStep === 3 ? "is-active" : ""}`}><header><div><h2>بررسی و انتشار</h2><small>پیش‌نمایش را ببین و بعد پروژه را منتشر کن.</small></div></header><div className="admin-publish-choice"><button type="button" className={project.status === "draft" ? "is-active" : ""} onClick={() => set("status", "draft")}><strong>پیش‌نویس</strong><span>فقط در پنل دیده می‌شود</span></button><button type="button" className={project.status === "published" ? "is-active" : ""} onClick={() => set("status", "published")}><strong>منتشرشده</strong><span>در سایت نمایش داده می‌شود</span></button></div><details className="admin-advanced-fields"><summary>تنظیمات سئو و نمایش</summary><div className="admin-grid"><label className="admin-field"><span>عنوان گوگل</span><input value={project.seo?.title || ""} onChange={(e) => set("seo", { ...project.seo, title: e.target.value })} /></label><label className="admin-field"><span>توضیحات گوگل</span><input value={project.seo?.description || ""} onChange={(e) => set("seo", { ...project.seo, description: e.target.value })} /></label><label className="admin-field"><span>ترتیب نمایش</span><input type="number" value={project.sortOrder} onChange={(e) => set("sortOrder", Number(e.target.value))} /></label></div></details><footer className="admin-step-footer"><button type="button" className="admin-button" onClick={() => setActiveStep(2)}>مرحله قبل</button></footer></section>

      <div className="admin-savebar"><div className={`admin-save-state admin-save-state--${saveState}`}><i />{message || statusLabel}</div><div className="admin-array-item__actions">{project.id ? <details className="admin-more-menu admin-more-menu--up"><summary aria-label="کارهای بیشتر">•••</summary><div><button className="is-danger" type="button" onClick={remove}>حذف کامل پروژه</button></div></details> : null}<button type="button" className="admin-button" disabled={!project.id} onClick={() => { setPreviewOpen((open) => !open); setPreviewVersion((version) => version + 1); }}>{previewOpen ? "بستن پیش‌نمایش" : "دیدن پیش‌نمایش"}</button><button type="button" className="admin-button admin-button--primary" onClick={save} disabled={pending || !project.slug || !project.title}>{pending || saveState === "saving" ? "در حال ذخیره…" : project.status === "published" ? "ذخیره و انتشار" : "ذخیره پیش‌نویس"}</button></div></div>
    </div>

    {previewOpen && project.id ? <section className="admin-live-preview">
      <header><div className="admin-preview-heading"><strong>پیش‌نمایش پروژه</strong><span>نمایش واقعی صفحه پروژه</span></div><div className="admin-preview-actions"><div className="admin-device-switch" aria-label="اندازه پیش‌نمایش">{(["desktop", "tablet", "mobile"] as PreviewDevice[]).map((device) => <button type="button" className={previewDevice === device ? "is-active" : ""} onClick={() => setPreviewDevice(device)} aria-label={device} title={device} key={device}>{device === "desktop" ? "▱" : device === "tablet" ? "▯" : "▯"}</button>)}</div><button className="admin-icon-button" type="button" onClick={() => setPreviewVersion((version) => version + 1)} aria-label="تازه‌سازی پیش‌نمایش" title="تازه‌سازی"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 6v5h-5M4 18v-5h5M6.1 9a7 7 0 0 1 11.3-2.6L20 9M4 15l2.6 2.6A7 7 0 0 0 17.9 15" /></svg></button><button className="admin-icon-button" type="button" onClick={() => void previewRef.current?.requestFullscreen()} aria-label="نمایش تمام‌صفحه" title="تمام‌صفحه"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 3H3v5M16 3h5v5M8 21H3v-5M16 21h5v-5" /></svg></button></div></header>
      <div className={`admin-preview-frame is-${previewDevice}`} ref={previewRef}><iframe ref={iframeRef} key={previewVersion} src={`/admin/preview/${project.id}?v=${previewVersion}`} title="پیش‌نمایش پروژه" onLoad={() => { if (selectedSectionKey) iframeRef.current?.contentWindow?.postMessage({ type: "cms:focus-section", key: selectedSectionKey }, window.location.origin); }} style={{ width: previewWidths[previewDevice], height: previewBounds.height ? previewBounds.height / Math.min(1, Math.max(.1, (previewBounds.width - 24) / previewWidths[previewDevice])) : "100%", transform: `scale(${Math.min(1, Math.max(.1, (previewBounds.width - 24) / previewWidths[previewDevice]))})` }} /></div>
    </section> : null}
  </div>;
}
