import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { signOut } from "../actions";
import AdminNavigation from "@/components/admin/AdminNavigation";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  if (!data?.claims?.sub) redirect("/admin/login");
  const { data: admin } = await supabase.from("cms_admins").select("user_id").eq("user_id", data.claims.sub).maybeSingle();
  if (!admin) redirect("/admin/login?error=unauthorized");
  return <div className="admin-shell" dir="rtl"><aside className="admin-sidebar"><div className="admin-brand"><span className="admin-brand__mark">PK</span><div><strong>Kazemi</strong><span>Portfolio workspace</span></div></div><AdminNavigation /><div className="admin-sidebar__footer"><span>CMS اختصاصی پرناز</span><form action={signOut}><button type="submit">خروج از حساب</button></form></div></aside><main className="admin-main">{children}</main></div>;
}
