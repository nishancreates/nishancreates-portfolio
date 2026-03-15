"use client";

import { useEffect, useState } from "react";
import { collection, query, orderBy, onSnapshot, updateDoc, deleteDoc, doc } from "firebase/firestore";
import { motion } from "framer-motion";
import { db } from "@/lib/firebase";
import type { Lead } from "@/types";
import { generateContactLink } from "@/lib/whatsapp";

export default function LeadsAdminPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [selected, setSelected] = useState<Lead | null>(null);
  const [filter, setFilter] = useState<"all" | "new" | "contacted" | "closed">("all");

  useEffect(() => {
    const q = query(collection(db, "leads"), orderBy("createdAt", "desc"));
    return onSnapshot(q, (snap) => {
      setLeads(snap.docs.map((d) => {
        const data = d.data();
        return {
          id: d.id,
          ...data,
          createdAt: data.createdAt?.toDate?.()?.toLocaleDateString() || "—",
        } as Lead;
      }));
    });
  }, []);

  async function updateStatus(id: string, status: Lead["status"]) {
    await updateDoc(doc(db, "leads", id), { status });
  }

  async function handleDelete(id: string) {
    if (confirm("Delete this lead?")) {
      await deleteDoc(doc(db, "leads", id));
      setSelected(null);
    }
  }

  function exportCSV() {
    const rows = [
      ["Name", "WhatsApp", "Business Type", "Date", "Status"],
      ...leads.map((l) => [l.name, l.whatsapp, l.businessType, l.createdAt, l.status]),
    ];
    const csv = rows.map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `nishancreates-leads-${Date.now()}.csv`;
    a.click();
  }

  const filtered = filter === "all" ? leads : leads.filter((l) => l.status === filter);

  const STATUS_COLORS: Record<string, string> = {
    new: "text-green-400 border-green-400/30 bg-green-400/10",
    contacted: "text-amber-400 border-amber-400/30 bg-amber-400/10",
    closed: "text-text-muted border-border",
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-text-primary">Leads</h1>
          <p className="font-mono text-xs text-text-muted mt-1">{leads.length} total · {leads.filter((l) => l.status === "new").length} new</p>
        </div>
        <button
          onClick={exportCSV}
          className="px-4 py-2.5 border border-border font-mono text-sm text-text-secondary rounded-btn hover:text-text-primary hover:border-border-strong transition-all"
        >
          Export CSV
        </button>
      </div>

      {/* Filter */}
      <div className="flex gap-2 mb-6">
        {(["all", "new", "contacted", "closed"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`font-mono text-xs px-3 py-1.5 rounded-full border transition-all capitalize ${
              filter === f
                ? "bg-accent-cyan text-bg-primary border-accent-cyan"
                : "border-border text-text-muted hover:text-text-primary"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-bg-card border border-border rounded-card overflow-hidden mb-6">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              {["Name", "Business", "Date", "Status", ""].map((h) => (
                <th key={h} className="text-left font-mono text-xs text-text-muted uppercase tracking-wider px-4 py-3">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((lead, i) => (
              <tr
                key={lead.id}
                className={`border-b border-border-subtle hover:bg-bg-elevated transition-colors cursor-pointer ${i % 2 === 0 ? "" : "bg-bg-elevated/30"}`}
                onClick={() => setSelected(lead)}
              >
                <td className="px-4 py-3 font-mono text-sm text-text-primary">{lead.name}</td>
                <td className="px-4 py-3 font-mono text-sm text-text-secondary">{lead.businessType}</td>
                <td className="px-4 py-3 font-mono text-xs text-text-muted">{lead.createdAt}</td>
                <td className="px-4 py-3">
                  <span className={`font-mono text-xs border rounded-full px-2 py-0.5 ${STATUS_COLORS[lead.status]}`}>
                    {lead.status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <a
                    href={generateContactLink(`Hi ${lead.name}! 👋 I reviewed your project brief and would love to discuss your ${lead.businessType} project.`)}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="font-mono text-xs text-[#25D366] hover:underline"
                  >
                    Reply WA
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <p className="font-mono text-xs text-text-muted text-center py-12">No leads found.</p>
        )}
      </div>

      {/* Detail drawer */}
      {selected && (
        <div className="fixed inset-0 bg-bg-primary/80 backdrop-blur-sm z-50 flex justify-end" onClick={() => setSelected(null)}>
          <motion.div
            initial={{ x: 40, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 40, opacity: 0 }}
            className="w-full max-w-md bg-bg-card border-l border-border h-full overflow-y-auto p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-lg font-bold text-text-primary">{selected.name}</h2>
              <button onClick={() => setSelected(null)} className="text-text-muted hover:text-text-primary font-mono">✕</button>
            </div>

            {/* Status selector */}
            <div className="flex gap-2 mb-6">
              {(["new", "contacted", "closed"] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => { updateStatus(selected.id, s); setSelected({ ...selected, status: s }); }}
                  className={`font-mono text-xs px-3 py-1.5 rounded-full border capitalize transition-all ${selected.status === s ? STATUS_COLORS[s] : "border-border text-text-muted"}`}
                >
                  {s}
                </button>
              ))}
            </div>

            {/* Info */}
            <div className="flex flex-col gap-3 mb-6">
              <InfoRow label="WhatsApp" value={selected.whatsapp} />
              <InfoRow label="Business type" value={selected.businessType} />
              <InfoRow label="Submitted" value={selected.createdAt} />
            </div>

            {/* Brief data */}
            <div className="bg-bg-elevated rounded-card p-4 mb-6">
              <p className="font-mono text-xs text-accent-cyan uppercase tracking-wider mb-3">Brief details</p>
              {Object.entries(selected.briefData || {}).map(([key, value]) => (
                <div key={key} className="mb-3">
                  <p className="font-mono text-xs text-text-muted capitalize mb-1">
                    {key.replace(/([A-Z])/g, " $1").toLowerCase()}
                  </p>
                  <p className="font-mono text-xs text-text-secondary">
                    {Array.isArray(value) ? value.join(", ") : String(value || "—")}
                  </p>
                </div>
              ))}
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <a
                href={generateContactLink(`Hi ${selected.name}! 👋 I reviewed your project brief and would love to discuss your ${selected.businessType} project.`)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-2.5 bg-[#25D366] text-white rounded-btn font-mono text-xs font-bold text-center hover:opacity-90"
              >
                Reply on WhatsApp
              </a>
              <button
                onClick={() => handleDelete(selected.id)}
                className="px-4 py-2.5 border border-red-400/30 rounded-btn font-mono text-xs text-red-400 hover:bg-red-400/10"
              >
                Delete
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between py-2 border-b border-border-subtle">
      <span className="font-mono text-xs text-text-muted">{label}</span>
      <span className="font-mono text-xs text-text-primary">{value}</span>
    </div>
  );
}
