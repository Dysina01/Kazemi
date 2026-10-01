import SiteContentEditor from "@/components/admin/SiteContentEditor";
import { mergeHomeContent } from "@/cms/site-content";
import { createClient } from "@/lib/supabase/server";

export default async function ContentPage() {
  const supabase = await createClient();
  const { data } = await supabase.from("site_settings").select("content").eq("id", "home").maybeSingle();
  return <><header className="admin-topbar"><div><span className="admin-eyebrow">محتوای سایت</span><h1>صفحه اصلی</h1><p>متن‌ها، معرفی و لینک‌های صفحه اصلی را مدیریت کن.</p></div><a className="admin-button" href="/" target="_blank">مشاهده صفحه ↗</a></header><SiteContentEditor initialContent={mergeHomeContent(data?.content)} /></>;
}
