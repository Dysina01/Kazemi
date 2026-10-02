import { Suspense } from "react";
import LoginForm from "./LoginForm";

export default function AdminLoginPage() {
  return <main className="admin-login"><section className="admin-login__card admin-card"><h1>پنل مدیریت پورتفولیو</h1><p>برای مدیریت پروژه‌ها، تصاویر و انتشار وارد شو.</p><Suspense><LoginForm /></Suspense></section></main>;
}
