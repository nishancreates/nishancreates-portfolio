"use client";

import { useState, useEffect } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { uploadImage } from "@/lib/cloudinary";
import type { SiteConfig } from "@/types";

const DEFAULT: SiteConfig = {
  name: "nishancreates",
  title: "Full-Stack Architect & Business Solutions Developer",
  bio: "I build complete digital systems for local businesses — from customer-facing storefronts to owner dashboards. Based in Nepal, working globally.",
  taglines: ["I build systems for cafes.","I build storefronts for clothing brands.","I turn WhatsApp into a checkout engine.","I build dashboards for restaurant owners."],
  projectsTaglines: ["10+ delivered","Web apps & dashboards","Cafes, clothing & restaurants","Every project is custom"],
  yearsTaglines: ["2+ years","Professional full-stack","Nepal → Global","Always learning"],
  profileImage: "/profile.jpg",
  heroCtaPrimary: "View Work",
  heroCtaSecondary: "Start a Project",
  availableForWork: true,
  yearsExperience: 2,
  projectsCompleted: 10,
};

export default function SiteConfigPage() {
  const [config, setConfig] = useState<SiteConfig>(DEFAULT);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    getDoc(doc(db, "config", "site")).then((snap) => {
      if (snap.exists()) setConfig({ ...DEFAULT, ...snap.data() } as SiteConfig);
    });
  }, []);

  function update<K extends keyof SiteConfig>(key: K, value: SiteConfig[K]) {
    setConfig((c) => ({ ...c, [key]: value }));
  }

  async function handleImageUpload(file: File) {
    setUploading(true);
    try {
      const result = await uploadImage(file, "nishancreates/profile");
      update("profileImage", result.secure_url);
    } catch { alert("Upload failed"); } finally { setUploading(false); }
  }

  async function handleSave() {
    setSaving(true);
    try {
      await setDoc(doc(db, "config", "site"), config, { merge: true });
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch { alert("Save failed"); } finally { setSaving(false); }
  }

  return (
    <div className="max-w-2xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-2xl font-bold text-text-primary">Site Config</h1>
          <p className="font-mono text-xs text-text-muted mt-1">Everything visible on your portfolio</p>
        </div>
        <button onClick={handleSave} disabled={saving} className="px-5 py-2.5 bg-accent-cyan text-bg-primary font-mono text-sm font-bold rounded-btn hover:opacity-90 transition-all disabled:opacity-50">
          {saved ? "✓ Saved!" : saving ? "Saving..." : "Save changes"}
        </button>
      </div>

      <div className="flex flex-col gap-6">
        <Card title="Profile image">
          <div className="flex items-center gap-4">
            <img src={config.profileImage || "/profile.jpg"} alt="Profile" className="w-20 h-20 rounded-xl object-cover border border-border" />
            <label className="flex items-center gap-2 px-4 py-2.5 border border-dashed border-border rounded-btn font-mono text-xs text-text-muted hover:border-accent-cyan/40 hover:text-accent-cyan transition-all cursor-pointer">
              {uploading ? "Uploading..." : "Change image"}
              <input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0])} />
            </label>
          </div>
        </Card>

        <Card title="Identity">
          <Field label="Display name"><Input value={config.name} onChange={(v) => update("name", v)} placeholder="nishancreates" /></Field>
          <Field label="Title / role"><Input value={config.title} onChange={(v) => update("title", v)} placeholder="Full-Stack Architect..." /></Field>
          <Field label="Bio"><Textarea value={config.bio} onChange={(v) => update("bio", v)} rows={3} /></Field>
        </Card>

        <Card title="Hero typewriter taglines">
          <p className="font-mono text-xs text-text-muted mb-3">One per line. These cycle in the big hero heading.</p>
          <Textarea value={config.taglines.join("\n")} onChange={(v) => update("taglines", v.split("\n").filter(Boolean))} rows={5} placeholder={"I build systems for cafes.\nI build storefronts for clothing brands."} />
        </Card>

        <Card title="Projects card — cycling lines">
          <p className="font-mono text-xs text-text-muted mb-3">One per line. These cycle in the Projects stat card.</p>
          <Textarea value={(config.projectsTaglines || []).join("\n")} onChange={(v) => update("projectsTaglines", v.split("\n").filter(Boolean))} rows={4} placeholder={"10+ delivered\nWeb apps & dashboards"} />
        </Card>

        <Card title="Experience card — cycling lines">
          <p className="font-mono text-xs text-text-muted mb-3">One per line. These cycle in the Experience stat card.</p>
          <Textarea value={(config.yearsTaglines || []).join("\n")} onChange={(v) => update("yearsTaglines", v.split("\n").filter(Boolean))} rows={4} placeholder={"2+ years\nProfessional full-stack"} />
        </Card>

        <Card title="Hero CTA buttons">
          <div className="grid grid-cols-2 gap-3">
            <Field label="Primary button"><Input value={config.heroCtaPrimary} onChange={(v) => update("heroCtaPrimary", v)} placeholder="View Work" /></Field>
            <Field label="Secondary button"><Input value={config.heroCtaSecondary} onChange={(v) => update("heroCtaSecondary", v)} placeholder="Start a Project" /></Field>
          </div>
        </Card>

        <Card title="Stats numbers">
          <div className="grid grid-cols-2 gap-3">
            <Field label="Projects completed"><Input type="number" value={String(config.projectsCompleted)} onChange={(v) => update("projectsCompleted", parseInt(v) || 0)} /></Field>
            <Field label="Years experience"><Input type="number" value={String(config.yearsExperience)} onChange={(v) => update("yearsExperience", parseInt(v) || 0)} /></Field>
          </div>
        </Card>

        <Card title="Availability">
          <label className="flex items-center gap-3 cursor-pointer">
            <div onClick={() => update("availableForWork", !config.availableForWork)} className={`w-11 h-6 rounded-full transition-all relative ${config.availableForWork ? "bg-green-500" : "bg-bg-elevated border border-border"}`}>
              <span className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${config.availableForWork ? "left-6" : "left-1"}`} />
            </div>
            <span className="font-mono text-sm text-text-secondary">{config.availableForWork ? "Available for new projects" : "Not currently available"}</span>
          </label>
        </Card>
      </div>
    </div>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-bg-card border border-border rounded-card p-5">
      <p className="font-mono text-xs text-accent-cyan uppercase tracking-wider mb-4">{title}</p>
      <div className="flex flex-col gap-3">{children}</div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block font-mono text-xs text-text-muted mb-1.5 uppercase tracking-wide">{label}</label>
      {children}
    </div>
  );
}

const cls = "w-full bg-bg-elevated border border-border rounded-btn px-3 py-2.5 text-text-primary font-mono text-sm placeholder:text-text-muted focus:outline-none focus:border-accent-cyan/40 transition-colors";
function Input({ value, onChange, placeholder, type = "text" }: { value: string; onChange: (v: string) => void; placeholder?: string; type?: string }) {
  return <input type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className={cls} />;
}
function Textarea({ value, onChange, placeholder, rows = 3 }: { value: string; onChange: (v: string) => void; placeholder?: string; rows?: number }) {
  return <textarea value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} rows={rows} className={cls} />;
}
