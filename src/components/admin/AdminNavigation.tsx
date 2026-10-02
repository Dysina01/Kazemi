"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  { href: "/admin", label: "پروژه‌ها", exact: true, icon: <path d="M4 5.5h6.5v6.5H4zM13.5 5.5H20v6.5h-6.5zM4 15h6.5v4H4zM13.5 15H20v4h-6.5z" /> },
  { href: "/admin/content", label: "صفحه اصلی", icon: <><path d="M4 10.5 12 4l8 6.5" /><path d="M6.5 9.5V20h11V9.5M10 20v-6h4v6" /></> },
  { href: "/admin/media", label: "کتابخانه تصاویر", icon: <><rect x="3.5" y="4" width="17" height="16" rx="3" /><path d="m5.5 17 4.2-4.2 3.1 3.1 2.2-2.2 3.5 3.3M16.5 8.5h.01" /></> },
];

export default function AdminNavigation() {
  const pathname = usePathname();
  return <nav aria-label="منوی مدیریت">{items.map((item) => {
    const active = item.exact ? pathname === item.href : pathname.startsWith(item.href);
    return <Link href={item.href} className={active ? "is-active" : ""} key={item.href}><svg viewBox="0 0 24 24" aria-hidden="true">{item.icon}</svg><span>{item.label}</span>{active ? <i /> : null}</Link>;
  })}<div className="admin-nav-separator" /><Link href="/" target="_blank"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14 4h6v6M20 4l-9 9M18 13v6a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h6" /></svg><span>مشاهده سایت</span></Link></nav>;
}
