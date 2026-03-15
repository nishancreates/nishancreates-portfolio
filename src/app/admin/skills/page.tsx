"use client";

import { useEffect, useState } from "react";
import { collection, onSnapshot, addDoc, updateDoc, deleteDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { Skill } from "@/types";

const CATEGORIES = ["frontend", "backend", "tools", "design"];

export default function SkillsAdminPage() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [editing, setEditing] = useState<Skill | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    return onSnapshot(collection(db, "skills"), (snap) => {
      setSkills(snap.docs.map((d) => ({ id: d.id, ...d.data() } as Skill)));
    });
  }, []);

  function startNew() {
    setEditing({ id: "", name: "", category: "frontend", level: 3 });
    setIsNew(true);
  }

  async function handleSave() {
    if (!editing) return;
    setSaving(true);
    try {
      const { id, ...data } = editing;
      if (isNew) {
        await addDoc(collection(db, "skills"), data);
      } else {
        await updateDoc(doc(db, "skills", id), data);
      }
      setEditing(null);
      setIsNew(false);
    } catch {
      alert("Save failed");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (confirm("Delete this skill?")) await deleteDoc(doc(db, "skills", id));
  }

  const grouped = CATEGORIES.reduce((acc, cat) => {
    acc[cat] = skills.filter((s) => s.category === cat);
    return acc;
  }, {} as Record<string, Skill[]>);

  return (
    <div className="max-w-2xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-2xl font-bold text-text-primary">Skills</h1>
          <p className="font-mono text-xs text-text-muted mt-1">Shown in the skills section on your portfolio</p>
        </div>
        <button onClick={startNew} className="px-4 py-2.5 bg-accent-cyan text-bg-primary font-mono text-sm font-bold rounded-btn hover:bg-accent-cyan-dim transition-all">
          + Add skill
        </button>
      </div>

      {/* Edit form */}
      {editing && (
        <div className="bg-bg-card border border-accent-cyan/30 rounded-card p-5 mb-6">
          <p className="font-mono text-xs text-accent-cyan uppercase tracking-wider mb-4">
            {isNew ? "New skill" : "Edit skill"}
          </p>
          <div className="grid grid-cols-2 gap-3 mb-3">
            <div>
              <label className="block font-mono text-xs text-text-muted mb-1.5">Name</label>
              <input
                value={editing.name}
                onChange={(e) => setEditing({ ...editing, name: e.target.value })}
                className={inputCls}
                placeholder="e.g. React"
              />
            </div>
            <div>
              <label className="block font-mono text-xs text-text-muted mb-1.5">Category</label>
              <select
                value={editing.category}
                onChange={(e) => setEditing({ ...editing, category: e.target.value })}
                className={inputCls}
              >
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <div className="mb-4">
            <label className="block font-mono text-xs text-text-muted mb-2">
              Level: {editing.level}/5 {"█".repeat(editing.level)}{"░".repeat(5 - editing.level)}
            </label>
            <input
              type="range"
              min="1"
              max="5"
              value={editing.level}
              onChange={(e) => setEditing({ ...editing, level: parseInt(e.target.value) })}
              className="w-full accent-accent-cyan"
            />
          </div>
          <div className="flex gap-2">
            <button onClick={() => { setEditing(null); setIsNew(false); }} className="flex-1 py-2 border border-border rounded-btn font-mono text-xs text-text-muted">
              Cancel
            </button>
            <button onClick={handleSave} disabled={saving} className="flex-1 py-2 bg-accent-cyan text-bg-primary rounded-btn font-mono text-xs font-bold disabled:opacity-50">
              {saving ? "Saving..." : isNew ? "Add skill" : "Update"}
            </button>
          </div>
        </div>
      )}

      {/* Grouped skills */}
      {CATEGORIES.map((cat) => (
        <div key={cat} className="mb-5">
          <p className="font-mono text-xs text-accent-cyan uppercase tracking-wider mb-2">{cat}</p>
          <div className="bg-bg-card border border-border rounded-card overflow-hidden">
            {grouped[cat]?.length === 0 && (
              <p className="font-mono text-xs text-text-muted px-4 py-3">No skills yet</p>
            )}
            {grouped[cat]?.map((skill, i) => (
              <div key={skill.id} className={`flex items-center justify-between px-4 py-3 ${i > 0 ? "border-t border-border-subtle" : ""}`}>
                <div className="flex items-center gap-3">
                  <span className="font-mono text-sm text-text-primary">{skill.name}</span>
                  <span className="font-mono text-xs text-text-muted">
                    {"█".repeat(skill.level)}{"░".repeat(5 - skill.level)}
                  </span>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => { setEditing(skill); setIsNew(false); }} className="font-mono text-xs text-text-muted hover:text-accent-cyan transition-colors px-2 py-1">
                    Edit
                  </button>
                  <button onClick={() => handleDelete(skill.id)} className="font-mono text-xs text-text-muted hover:text-red-400 transition-colors px-2 py-1">
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

const inputCls = "w-full bg-bg-elevated border border-border rounded-btn px-3 py-2.5 text-text-primary font-mono text-sm placeholder:text-text-muted focus:outline-none focus:border-accent-cyan/40 transition-colors";
