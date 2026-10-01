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
  return <div className="admin-shell"><aside className="admin-sidebar"><div className="admin-brand">Kazemi CMS</div><nav><Link href="/admin">Projects</Link><Link href="/" target="_blank">View website ↗</Link></nav><form action={signOut}><button type="submit">Sign out</button></form></aside><main className="admin-main">{children}</main></div>;
}
