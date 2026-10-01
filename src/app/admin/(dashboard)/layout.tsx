import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { signOut } from "../actions";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  if (!data?.claims?.sub) redirect("/admin/login");
  const { data: admin } = await supabase.from("cms_admins").select("user_id").eq("user_id", data.claims.sub).maybeSingle();
  if (!admin) redirect("/admin/login?error=unauthorized");
  return <div className="admin-shell" dir="rtl"><aside className="admin-sidebar"><div className="admin-brand"><span className="admin-brand__mark">PK</span><div><strong>Kazemi</strong><span>مدیریت پورتفولیو</span></div></div><nav><Link href="/admin"><i>▦</i> پروژه‌ها</Link><Link href="/admin/content"><i>◈</i> صفحه اصلی</Link><Link href="/admin/media"><i>▧</i> تصاویر</Link><Link href="/" target="_blank"><i>↗</i> مشاهده سایت</Link></nav><form action={signOut}><button type="submit">خروج از حساب</button></form></aside><main className="admin-main">{children}</main></div>;
}
