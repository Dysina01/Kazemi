"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [createMode, setCreateMode] = useState(false);
  const [notice, setNotice] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");
    const supabase = createClient();
    const { data, error: authError } = createMode
      ? await supabase.auth.signUp({ email, password, options: { emailRedirectTo: `${window.location.origin}/admin/login` } })
      : await supabase.auth.signInWithPassword({ email, password });
    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }
    if (!data.session) {
      setNotice("ایمیل تأیید را باز کن؛ سپس از همین صفحه وارد شو.");
      setLoading(false);
      return;
    }
    const userId = data.user?.id;
    if (userId) await supabase.from("cms_admins").insert({ user_id: userId, role: "owner" });
    const { data: membership } = userId
      ? await supabase.from("cms_admins").select("user_id").eq("user_id", userId).maybeSingle()
      : { data: null };
    if (!membership) {
      await supabase.auth.signOut();
      setError("این ایمیل اجازه ورود به پنل را ندارد.");
      setLoading(false);
      return;
    }
    router.replace(searchParams.get("next") || "/admin");
    router.refresh();
  }

  return (
    <form className="admin-form-stack" onSubmit={submit}>
      <label className="admin-field"><span>ایمیل</span><input type="email" dir="ltr" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" /></label>
      <label className="admin-field"><span>رمز عبور</span><input type="password" dir="ltr" value={password} onChange={(e) => setPassword(e.target.value)} required autoComplete={createMode ? "new-password" : "current-password"} /></label>
      {error ? <p className="admin-error">{error}</p> : null}
      {notice ? <p>{notice}</p> : null}
      <button className="admin-button admin-button--primary" disabled={loading}>{loading ? "کمی صبر کن…" : createMode ? "ساخت حساب مدیر" : "ورود به پنل"}</button>
      <button type="button" className="admin-button" onClick={() => { setCreateMode(!createMode); setError(""); setNotice(""); }}>{createMode ? "از قبل حساب دارم" : "ساخت اولین حساب مدیر"}</button>
    </form>
  );
}
