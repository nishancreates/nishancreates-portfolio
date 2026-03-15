"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { signOut } from "firebase/auth";
import { motion } from "framer-motion";
import { auth } from "@/lib/firebase";
import { useAuth } from "@/hooks/useAuth";

const NAV_ITEMS = [
  { label: "Dashboard", href: "/admin/dashboard", icon: "▦" },
  { label: "Projects", href: "/admin/projects", icon: "◈" },
  { label: "Site Config", href: "/admin/site", icon: "✦" },
  { label: "Skills", href: "/admin/skills", icon: "◎" },
  { label: "Leads", href: "/admin/leads", icon: "◉" },
  { label: "Contact Info", href: "/admin/contacts", icon: "◌" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, isAdmin, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !isAdmin) {
      router.replace("/admin/login");
    }
  }, [loading, isAdmin, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-bg-primary flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-accent-cyan border-t-transparent rounded-full animate-spin" />
          <p className="font-mono text-xs text-text-muted">Authenticating...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) return null;

  return (
    <div className="min-h-screen bg-bg-primary flex">
      {/* Sidebar */}
      <aside className="w-60 shrink-0 bg-bg-card border-r border-border flex flex-col">
        {/* Logo */}
        <div className="px-5 py-5 border-b border-border">
          <p className="font-display font-bold text-base">
            <span className="text-accent-cyan">nishan</span>creates
          </p>
          <p className="font-mono text-xs text-text-muted mt-0.5">Admin Panel</p>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 flex flex-col gap-1">
          {NAV_ITEMS.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-btn font-mono text-sm transition-all ${
                  active
                    ? "bg-accent-cyan/10 text-accent-cyan border border-accent-cyan/20"
                    : "text-text-secondary hover:text-text-primary hover:bg-bg-elevated"
                }`}
              >
                <span className="text-base leading-none">{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-3 border-t border-border">
          <Link
            href="/"
            className="flex items-center gap-3 px-3 py-2.5 rounded-btn font-mono text-xs text-text-muted hover:text-text-primary transition-all"
          >
            ← View site
          </Link>
          <button
            onClick={() => signOut(auth)}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-btn font-mono text-xs text-text-muted hover:text-red-400 transition-all"
          >
            ⊗ Sign out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        <motion.div
          key={pathname}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="p-8"
        >
          {children}
        </motion.div>
      </main>
    </div>
  );
}
