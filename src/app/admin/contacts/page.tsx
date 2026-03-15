"use client";

import { useState, useEffect } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { ContactConfig } from "@/types";

const DEFAULT: ContactConfig = {
  whatsapp: "9779848303515",
  email: "nishanrokaya535@gmail.com",
  github: "https://github.com/nishancreates",
  linkedin: "https://www.linkedin.com/in/nishan-kumar-rokaya/",
  whatsappMessage: "Hello Nishan! 👋 I found your portfolio and I'd like to discuss a project.",
};

export default function ContactsAdminPage() {
  const [config, setConfig] = useState<ContactConfig>(DEFAULT);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    getDoc(doc(db, "config", "contact")).then((snap) => {
      if (snap.exists()) setConfig({ ...DEFAULT, ...snap.data() } as ContactConfig);
    });
  }, []);

  function update(key: keyof ContactConfig, value: string) {
    setConfig((c) => ({ ...c, [key]: value }));
  }

  async function handleSave() {
    setSaving(true);
    try {
      await setDoc(doc(db, "config", "contact"), config, { merge: true });
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch {
      alert("Save failed. Check Firestore rules.");
    } finally {
      setSaving(false);
    }
  }

  const FIELDS: { key: keyof ContactConfig; label: string; placeholder: string; hint?: string }[] = [
    { key: "whatsapp", label: "WhatsApp number", placeholder: "9779848303515", hint: "Numbers only, with country code. No + or spaces." },
    { key: "email", label: "Email address", placeholder: "nishanrokaya535@gmail.com" },
    { key: "github", label: "GitHub URL", placeholder: "https://github.com/nishancreates" },
    { key: "linkedin", label: "LinkedIn URL", placeholder: "https://www.linkedin.com/in/..." },
    { key: "whatsappMessage", label: "Default WhatsApp message", placeholder: "Hello Nishan! I'd like to discuss a project.", hint: "Pre-filled when someone clicks the WhatsApp button." },
  ];

  return (
    <div className="max-w-xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-2xl font-bold text-text-primary">Contact Info</h1>
          <p className="font-mono text-xs text-text-muted mt-1">Changes apply instantly across the whole site</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-5 py-2.5 bg-accent-cyan text-bg-primary font-mono text-sm font-bold rounded-btn hover:bg-accent-cyan-dim transition-all disabled:opacity-50"
        >
          {saved ? "✓ Saved!" : saving ? "Saving..." : "Save changes"}
        </button>
      </div>

      <div className="bg-bg-card border border-border rounded-card p-6 flex flex-col gap-5">
        {FIELDS.map((field) => (
          <div key={field.key}>
            <label className="block font-mono text-xs text-text-muted uppercase tracking-wider mb-1.5">
              {field.label}
            </label>
            {field.key === "whatsappMessage" ? (
              <textarea
                value={config[field.key]}
                onChange={(e) => update(field.key, e.target.value)}
                placeholder={field.placeholder}
                rows={3}
                className={inputCls}
              />
            ) : (
              <input
                type="text"
                value={config[field.key]}
                onChange={(e) => update(field.key, e.target.value)}
                placeholder={field.placeholder}
                className={inputCls}
              />
            )}
            {field.hint && (
              <p className="font-mono text-xs text-text-muted mt-1">{field.hint}</p>
            )}
          </div>
        ))}
      </div>

      {/* Live preview */}
      <div className="mt-6 bg-bg-card border border-border rounded-card p-5">
        <p className="font-mono text-xs text-accent-cyan uppercase tracking-wider mb-4">Live preview</p>
        <div className="flex flex-col gap-2">
          <a
            href={`https://wa.me/${config.whatsapp}?text=${encodeURIComponent(config.whatsappMessage)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 font-mono text-sm text-[#25D366] hover:underline"
          >
            ↗ Test WhatsApp link
          </a>
          <a
            href={`mailto:${config.email}`}
            className="flex items-center gap-2 font-mono text-sm text-accent-cyan hover:underline"
          >
            ↗ Test email link
          </a>
          <a
            href={config.github}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 font-mono text-sm text-text-secondary hover:text-text-primary"
          >
            ↗ Open GitHub
          </a>
          <a
            href={config.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 font-mono text-sm text-text-secondary hover:text-[#0A66C2]"
          >
            ↗ Open LinkedIn
          </a>
        </div>
      </div>
    </div>
  );
}

const inputCls = "w-full bg-bg-elevated border border-border rounded-btn px-3 py-2.5 text-text-primary font-mono text-sm placeholder:text-text-muted focus:outline-none focus:border-accent-cyan/40 transition-colors";
