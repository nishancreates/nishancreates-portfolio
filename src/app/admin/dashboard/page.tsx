"use client";

import { useEffect, useState } from "react";
import { collection, getCountFromServer, query, where, orderBy, limit, getDocs } from "firebase/firestore";
import { motion } from "framer-motion";
import { db } from "@/lib/firebase";
import { useGlobalConfig } from "@/context/GlobalContext";
import Link from "next/link";

interface Stats {
  projects: number;
  leads: number;
  newLeads: number;
}

export default function DashboardPage() {
  const { siteConfig } = useGlobalConfig();
  const [stats, setStats] = useState<Stats>({ projects: 0, leads: 0, newLeads: 0 });
  const [recentLeads, setRecentLeads] = useState<{ name: string; businessType: string; createdAt: string }[]>([]);

  useEffect(() => {
    async function fetchStats() {
      const [projectsSnap, leadsSnap, newLeadsSnap] = await Promise.all([
        getCountFromServer(collection(db, "projects")),
        getCountFromServer(collection(db, "leads")),
        getCountFromServer(query(collection(db, "leads"), where("status", "==", "new"))),
      ]);
      setStats({
        projects: projectsSnap.data().count,
        leads: leadsSnap.data().count,
        newLeads: newLeadsSnap.data().count,
      });
    }

    async function fetchRecentLeads() {
      const q = query(collection(db, "leads"), orderBy("createdAt", "desc"), limit(5));
      const snap = await getDocs(q);
      setRecentLeads(
        snap.docs.map((d) => ({
          name: d.data().name || "Unknown",
          businessType: d.data().businessType || "—",
          createdAt: d.data().createdAt?.toDate?.()?.toLocaleDateString() || "—",
        }))
      );
    }

    fetchStats();
    fetchRecentLeads();
  }, []);

  const STAT_CARDS = [
    { label: "Total projects", value: stats.projects, href: "/admin/projects", color: "text-accent-cyan" },
    { label: "Total leads", value: stats.leads, href: "/admin/leads", color: "text-purple-400" },
    { label: "New leads", value: stats.newLeads, href: "/admin/leads", color: "text-green-400" },
    { label: "Available for work", value: siteConfig.availableForWork ? "Yes" : "No", href: "/admin/site", color: siteConfig.availableForWork ? "text-green-400" : "text-red-400" },
  ];

  const QUICK_ACTIONS = [
    { label: "Add new project", href: "/admin/projects?new=true", icon: "+" },
    { label: "Edit bio & taglines", href: "/admin/site", icon: "✎" },
    { label: "Update contact info", href: "/admin/contacts", icon: "◌" },
    { label: "Manage skills", href: "/admin/skills", icon: "◎" },
  ];

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-display text-2xl font-bold text-text-primary">Dashboard</h1>
        <p className="font-mono text-xs text-text-muted mt-1">
          {new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {STAT_CARDS.map((card, i) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
          >
            <Link
              href={card.href}
              className="block bg-bg-card border border-border rounded-card p-5 hover:border-accent-cyan/30 transition-all"
            >
              <p className="font-mono text-xs text-text-muted mb-2">{card.label.toUpperCase()}</p>
              <p className={`font-display text-3xl font-bold ${card.color}`}>{card.value}</p>
            </Link>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick actions */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-bg-card border border-border rounded-card p-6"
        >
          <h2 className="font-display text-sm font-bold text-text-primary mb-4 uppercase tracking-wider">
            Quick actions
          </h2>
          <div className="flex flex-col gap-2">
            {QUICK_ACTIONS.map((action) => (
              <Link
                key={action.href}
                href={action.href}
                className="flex items-center gap-3 px-4 py-3 bg-bg-elevated rounded-btn border border-border hover:border-accent-cyan/30 hover:text-accent-cyan font-mono text-sm text-text-secondary transition-all"
              >
                <span className="text-accent-cyan w-4 text-center">{action.icon}</span>
                {action.label}
              </Link>
            ))}
          </div>
        </motion.div>

        {/* Recent leads */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-bg-card border border-border rounded-card p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-sm font-bold text-text-primary uppercase tracking-wider">
              Recent leads
            </h2>
            <Link href="/admin/leads" className="font-mono text-xs text-accent-cyan hover:underline">
              View all →
            </Link>
          </div>

          {recentLeads.length === 0 ? (
            <p className="font-mono text-xs text-text-muted text-center py-8">
              No leads yet. Share your brief link!
            </p>
          ) : (
            <div className="flex flex-col gap-2">
              {recentLeads.map((lead, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between px-3 py-2.5 bg-bg-elevated rounded-btn border border-border"
                >
                  <div>
                    <p className="font-mono text-sm text-text-primary">{lead.name}</p>
                    <p className="font-mono text-xs text-text-muted">{lead.businessType}</p>
                  </div>
                  <p className="font-mono text-xs text-text-muted">{lead.createdAt}</p>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
