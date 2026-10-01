import { Suspense } from "react";
import LoginForm from "./LoginForm";

export default function AdminLoginPage() {
  return <main className="admin-login"><section className="admin-login__card admin-card"><h1>Portfolio CMS</h1><p>Sign in to manage projects, media and publishing.</p><Suspense><LoginForm /></Suspense></section></main>;
}
