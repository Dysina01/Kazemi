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
  const [draggedKey, setDraggedKey] = useState<string | null>(null);
  const [activeStep, setActiveStep] = useState(0);
  const [pending, startTransition] = useTransition();
  const router = useRouter();
  const savedSnapshot = useRef(JSON.stringify(initialProject));
  const set = <K extends keyof EditableProject>(key: K, value: EditableProject[K]) => setProject((current) => ({ ...current, [key]: value }));
  const addSection = (type: ProjectSection["_type"]) => {
    const base = { _key: uid(), _type: type };
    const section = type === "contentSection" ? { ...base, id: `section-${project.sections.length + 1}`, label: "Section", heading: "", body: [""], showInNavigation: true }
      : type === "gallerySection" ? { ...base, items: [] }
      : type === "metricsSection" ? { ...base, items: [] }
      : type === "quoteSection" ? { ...base, quote: "" }
      : { ...base, before: emptyAsset(), after: emptyAsset() };
    set("sections", [...project.sections, section as ProjectSection]);
  };
  const move = (index: number, direction: -1 | 1) => { const next = [...project.sections]; const target = index + direction; if (target < 0 || target >= next.length) return; [next[index], next[target]] = [next[target], next[index]]; set("sections", next); };
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
  function save() { startTransition(async () => persist(true)); }
  function remove() { if (!project.id || !confirm("این پروژه برای همیشه حذف شود؟")) return; startTransition(async () => { await deleteProject(project.id); }); }
  const statusLabel = saveState === "saving" ? "در حال ذخیره…" : saveState === "unsaved" ? "تغییرات ذخیره نشده" : saveState === "error" ? "ذخیره انجام نشد" : "همه تغییرات ذخیره شده";

  return <div className="admin-editor-shell">
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
        <div className="admin-array">{project.sections.map((section, index) => <div className={`admin-array-item admin-sortable ${draggedKey === section._key ? "is-dragging" : ""}`} key={section._key} onDragOver={(event) => event.preventDefault()} onDrop={() => dropSection(section._key)}>
          <div className="admin-array-item__bar"><div className="admin-section-title"><button type="button" className="admin-drag-handle" draggable onDragStart={() => setDraggedKey(section._key)} onDragEnd={() => setDraggedKey(null)} aria-label="جابه‌جایی بخش">⋮⋮</button><strong>{{ contentSection: "متن و تصویر", gallerySection: "گالری تصاویر", metricsSection: "نتایج و آمار", quoteSection: "نقل‌قول", beforeAfterSection: "قبل و بعد" }[section._type]}</strong></div><div className="admin-array-item__actions"><button type="button" className="admin-icon-button" onClick={() => move(index, -1)}>↑</button><button type="button" className="admin-icon-button" onClick={() => move(index, 1)}>↓</button><button type="button" className="admin-icon-button" onClick={() => set("sections", project.sections.filter((x) => x._key !== section._key))}>×</button></div></div>
          <SectionEditor slug={project.slug} section={section as AnySection} onChange={(value) => set("sections", project.sections.map((x) => x._key === section._key ? value : x) as ProjectSection[])} />
        </div>)}</div>
        <footer className="admin-step-footer"><button type="button" className="admin-button" onClick={() => setActiveStep(1)}>مرحله قبل</button><button type="button" className="admin-button admin-button--primary" onClick={() => setActiveStep(3)}>بررسی نهایی</button></footer>
      </section>

      <section className={`admin-card admin-editor__section admin-editor-step ${activeStep === 3 ? "is-active" : ""}`}><header><div><h2>بررسی و انتشار</h2><small>پیش‌نمایش را ببین و بعد پروژه را منتشر کن.</small></div></header><div className="admin-publish-choice"><button type="button" className={project.status === "draft" ? "is-active" : ""} onClick={() => set("status", "draft")}><strong>پیش‌نویس</strong><span>فقط در پنل دیده می‌شود</span></button><button type="button" className={project.status === "published" ? "is-active" : ""} onClick={() => set("status", "published")}><strong>منتشرشده</strong><span>در سایت نمایش داده می‌شود</span></button></div><details className="admin-advanced-fields"><summary>تنظیمات سئو و نمایش</summary><div className="admin-grid"><label className="admin-field"><span>عنوان گوگل</span><input value={project.seo?.title || ""} onChange={(e) => set("seo", { ...project.seo, title: e.target.value })} /></label><label className="admin-field"><span>توضیحات گوگل</span><input value={project.seo?.description || ""} onChange={(e) => set("seo", { ...project.seo, description: e.target.value })} /></label><label className="admin-field"><span>ترتیب نمایش</span><input type="number" value={project.sortOrder} onChange={(e) => set("sortOrder", Number(e.target.value))} /></label></div></details><footer className="admin-step-footer"><button type="button" className="admin-button" onClick={() => setActiveStep(2)}>مرحله قبل</button></footer></section>

      <div className="admin-savebar"><div className={`admin-save-state admin-save-state--${saveState}`}><i />{message || statusLabel}</div><div className="admin-array-item__actions">{project.id ? <details className="admin-more-menu admin-more-menu--up"><summary aria-label="کارهای بیشتر">•••</summary><div><button className="is-danger" type="button" onClick={remove}>حذف کامل پروژه</button></div></details> : null}<button type="button" className="admin-button" disabled={!project.id} onClick={() => { setPreviewOpen((open) => !open); setPreviewVersion((version) => version + 1); }}>{previewOpen ? "بستن پیش‌نمایش" : "دیدن پیش‌نمایش"}</button><button type="button" className="admin-button admin-button--primary" onClick={save} disabled={pending || !project.slug || !project.title}>{pending || saveState === "saving" ? "در حال ذخیره…" : project.status === "published" ? "ذخیره و انتشار" : "ذخیره پیش‌نویس"}</button></div></div>
    </div>

    {previewOpen && project.id ? <section className="admin-live-preview">
      <header><div><strong>پیش‌نمایش پروژه</strong><span>نمایش واقعی و responsive صفحه پروژه</span></div><div className="admin-array-item__actions"><button className="admin-button" type="button" onClick={() => window.open(`/admin/preview/${project.id}`, "_blank")}>بازکردن تمام‌صفحه ↗</button><button className="admin-icon-button" type="button" onClick={() => setPreviewVersion((version) => version + 1)} aria-label="تازه‌سازی پیش‌نمایش">↻</button></div></header>
      <div className="admin-preview-frame"><iframe key={previewVersion} src={`/admin/preview/${project.id}?v=${previewVersion}`} title="پیش‌نمایش پروژه" /></div>
    </section> : null}
  </div>;
}
