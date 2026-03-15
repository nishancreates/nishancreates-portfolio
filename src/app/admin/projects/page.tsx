"use client";

import { useEffect, useState } from "react";
import { collection, query, orderBy, onSnapshot, addDoc, updateDoc, deleteDoc, doc, serverTimestamp } from "firebase/firestore";
import { motion, AnimatePresence } from "framer-motion";
import { db } from "@/lib/firebase";
import { uploadImage } from "@/lib/cloudinary";
import type { Project } from "@/types";

const EMPTY_PROJECT: Omit<Project, "id" | "createdAt"> = {
  businessName: "",
  category: "cafe",
  problem: "",
  solution: "",
  result: "",
  liveUrl: "",
  githubUrl: "",
  whatsappNumber: "",
  customerView: { image: "", description: "", features: [] },
  adminView: { image: "", description: "", features: [] },
  techStack: [],
  featured: false,
  order: 0,
};

export default function ProjectsAdminPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [editing, setEditing] = useState<Project | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState<"customer" | "admin" | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  useEffect(() => {
    const q = query(collection(db, "projects"), orderBy("order"));
    return onSnapshot(q, (snap) => {
      setProjects(snap.docs.map((d) => ({ id: d.id, ...d.data() } as Project)));
    });
  }, []);

  function startNew() {
    setEditing({ id: "", createdAt: "", ...EMPTY_PROJECT });
    setIsNew(true);
  }

  function startEdit(project: Project) {
    setEditing({ ...project });
    setIsNew(false);
  }

  function cancelEdit() {
    setEditing(null);
    setIsNew(false);
  }

  function updateField(path: string, value: unknown) {
    if (!editing) return;
    const keys = path.split(".");
    setEditing((prev) => {
      if (!prev) return prev;
      const updated = { ...prev } as Record<string, unknown>;
      if (keys.length === 1) {
        updated[keys[0]] = value;
      } else if (keys.length === 2) {
        updated[keys[0]] = { ...(updated[keys[0]] as Record<string, unknown>), [keys[1]]: value };
      }
      return updated as unknown as Project;
    });
  }

  function updateFeatures(view: "customerView" | "adminView", raw: string) {
    updateField(`${view}.features`, raw.split("\n").filter(Boolean));
  }

  function updateTechStack(raw: string) {
    updateField("techStack", raw.split(",").map((s) => s.trim()).filter(Boolean));
  }

  async function handleImageUpload(view: "customerView" | "adminView", file: File) {
    setUploading(view === "customerView" ? "customer" : "admin");
    try {
      const result = await uploadImage(file, "nishancreates/projects");
      updateField(`${view}.image`, result.secure_url);
    } catch (e) {
      alert("Image upload failed. Check Cloudinary preset.");
    } finally {
      setUploading(null);
    }
  }

  async function handleSave() {
    if (!editing) return;
    setSaving(true);
    try {
      const { id, ...data } = editing;
      if (isNew) {
        await addDoc(collection(db, "projects"), { ...data, createdAt: serverTimestamp() });
      } else {
        await updateDoc(doc(db, "projects", id), data);
      }
      cancelEdit();
    } catch (e) {
      alert("Save failed. Check Firestore rules.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    await deleteDoc(doc(db, "projects", id));
    setDeleteConfirm(null);
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-2xl font-bold text-text-primary">Projects</h1>
          <p className="font-mono text-xs text-text-muted mt-1">{projects.length} projects total</p>
        </div>
        <button
          onClick={startNew}
          className="px-4 py-2.5 bg-accent-cyan text-bg-primary font-mono text-sm font-bold rounded-btn hover:bg-accent-cyan-dim transition-all"
        >
          + New project
        </button>
      </div>

      {/* Projects list */}
      <div className="flex flex-col gap-3 mb-6">
        {projects.map((project) => (
          <div
            key={project.id}
            className="flex items-center justify-between bg-bg-card border border-border rounded-card px-5 py-4 hover:border-accent-cyan/20 transition-all"
          >
            <div className="flex items-center gap-4">
              <span className="font-mono text-xs text-text-muted w-6 text-center">{project.order}</span>
              <div>
                <p className="font-display text-sm font-bold text-text-primary">{project.businessName}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="font-mono text-xs text-text-muted capitalize">{project.category}</span>
                  {project.featured && (
                    <span className="font-mono text-xs text-accent-cyan border border-accent-cyan/30 rounded-full px-2 py-0.5">featured</span>
                  )}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 font-mono text-xs text-text-muted border border-border rounded-btn hover:text-text-primary transition-all"
                >
                  ↗
                </a>
              )}
              <button
                onClick={() => startEdit(project)}
                className="px-3 py-1.5 font-mono text-xs text-text-secondary border border-border rounded-btn hover:text-accent-cyan hover:border-accent-cyan/30 transition-all"
              >
                Edit
              </button>
              <button
                onClick={() => setDeleteConfirm(project.id)}
                className="px-3 py-1.5 font-mono text-xs text-text-muted border border-border rounded-btn hover:text-red-400 hover:border-red-400/30 transition-all"
              >
                ✕
              </button>
            </div>
          </div>
        ))}
        {projects.length === 0 && (
          <div className="text-center py-16 border border-border border-dashed rounded-card">
            <p className="font-mono text-sm text-text-muted">No projects yet. Add your first one.</p>
          </div>
        )}
      </div>

      {/* Delete confirm */}
      <AnimatePresence>
        {deleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-bg-primary/80 backdrop-blur-sm z-50 flex items-center justify-center"
          >
            <div className="bg-bg-card border border-border rounded-card p-6 max-w-sm w-full mx-4">
              <p className="font-display text-lg font-bold text-text-primary mb-2">Delete project?</p>
              <p className="text-text-secondary text-sm mb-5">This cannot be undone.</p>
              <div className="flex gap-3">
                <button onClick={() => setDeleteConfirm(null)} className="flex-1 py-2 border border-border rounded-btn font-mono text-sm text-text-secondary">
                  Cancel
                </button>
                <button onClick={() => handleDelete(deleteConfirm)} className="flex-1 py-2 bg-red-500/20 border border-red-500/30 rounded-btn font-mono text-sm text-red-400">
                  Delete
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit / New modal */}
      <AnimatePresence>
        {editing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-bg-primary/90 backdrop-blur-sm z-50 overflow-y-auto"
          >
            <div className="max-w-2xl mx-auto px-4 py-8">
              <div className="bg-bg-card border border-border rounded-card p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-display text-xl font-bold text-text-primary">
                    {isNew ? "New project" : `Edit — ${editing.businessName}`}
                  </h2>
                  <button onClick={cancelEdit} className="text-text-muted hover:text-text-primary font-mono text-lg">✕</button>
                </div>

                <div className="flex flex-col gap-5">
                  {/* Basic info */}
                  <Section title="Basic info">
                    <Row label="Business name">
                      <Input value={editing.businessName} onChange={(v) => updateField("businessName", v)} placeholder="e.g. The Detox Club" />
                    </Row>
                    <Row label="Category">
                      <Select value={editing.category} onChange={(v) => updateField("category", v)} options={["cafe", "clothing", "restaurant", "boutique", "other"]} />
                    </Row>
                    <Row label="Order (display sequence)">
                      <Input type="number" value={String(editing.order)} onChange={(v) => updateField("order", parseInt(v) || 0)} placeholder="1" />
                    </Row>
                    <Row label="Live URL">
                      <Input value={editing.liveUrl} onChange={(v) => updateField("liveUrl", v)} placeholder="https://..." />
                    </Row>
                    <Row label="GitHub URL (optional)">
                      <Input value={editing.githubUrl || ""} onChange={(v) => updateField("githubUrl", v)} placeholder="https://github.com/..." />
                    </Row>
                    <Row label="Tech stack (comma separated)">
                      <Input value={editing.techStack.join(", ")} onChange={updateTechStack} placeholder="Next.js, Firebase, TailwindCSS" />
                    </Row>
                    <Row label="">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" checked={editing.featured} onChange={(e) => updateField("featured", e.target.checked)} className="accent-accent-cyan" />
                        <span className="font-mono text-sm text-text-secondary">Featured on homepage</span>
                      </label>
                    </Row>
                  </Section>

                  {/* Case study */}
                  <Section title="Case study">
                    <Row label="Problem">
                      <Textarea value={editing.problem} onChange={(v) => updateField("problem", v)} placeholder="What challenge did the client have?" />
                    </Row>
                    <Row label="Solution">
                      <Textarea value={editing.solution} onChange={(v) => updateField("solution", v)} placeholder="What did you build?" />
                    </Row>
                    <Row label="Result">
                      <Textarea value={editing.result} onChange={(v) => updateField("result", v)} placeholder="What was the outcome?" />
                    </Row>
                  </Section>

                  {/* Customer view */}
                  <Section title="Customer view (site)">
                    <Row label="Screenshot">
                      <ImageUploader
                        current={editing.customerView.image}
                        loading={uploading === "customer"}
                        onChange={(file) => handleImageUpload("customerView", file)}
                      />
                    </Row>
                    <Row label="Description">
                      <Textarea value={editing.customerView.description} onChange={(v) => updateField("customerView.description", v)} placeholder="What does the customer-facing site do?" />
                    </Row>
                    <Row label="Features (one per line)">
                      <Textarea value={editing.customerView.features.join("\n")} onChange={(v) => updateFeatures("customerView", v)} placeholder={"Menu showcase\nReservation system\nGallery"} rows={4} />
                    </Row>
                  </Section>

                  {/* Admin view */}
                  <Section title="Admin view (dashboard)">
                    <Row label="Screenshot">
                      <ImageUploader
                        current={editing.adminView.image}
                        loading={uploading === "admin"}
                        onChange={(file) => handleImageUpload("adminView", file)}
                      />
                    </Row>
                    <Row label="Description">
                      <Textarea value={editing.adminView.description} onChange={(v) => updateField("adminView.description", v)} placeholder="What does the owner dashboard include?" />
                    </Row>
                    <Row label="Features (one per line)">
                      <Textarea value={editing.adminView.features.join("\n")} onChange={(v) => updateFeatures("adminView", v)} placeholder={"Analytics\nMenu manager\nSettings"} rows={4} />
                    </Row>
                  </Section>
                </div>

                {/* Actions */}
                <div className="flex gap-3 mt-6 pt-6 border-t border-border">
                  <button onClick={cancelEdit} className="flex-1 py-3 border border-border rounded-btn font-mono text-sm text-text-secondary hover:text-text-primary transition-all">
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex-1 py-3 bg-accent-cyan text-bg-primary rounded-btn font-mono text-sm font-bold hover:bg-accent-cyan-dim transition-all disabled:opacity-50"
                  >
                    {saving ? "Saving..." : isNew ? "Create project" : "Save changes"}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Form sub-components ──────────────────────────────────────────────────────

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="font-mono text-xs text-accent-cyan uppercase tracking-wider mb-3">{title}</p>
      <div className="flex flex-col gap-3 bg-bg-elevated rounded-btn p-4 border border-border-subtle">
        {children}
      </div>
    </div>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      {label && <label className="block font-mono text-xs text-text-muted mb-1.5 uppercase tracking-wide">{label}</label>}
      {children}
    </div>
  );
}

const inputCls = "w-full bg-bg-card border border-border rounded-btn px-3 py-2.5 text-text-primary font-mono text-sm placeholder:text-text-muted focus:outline-none focus:border-accent-cyan/40 transition-colors";

function Input({ value, onChange, placeholder, type = "text" }: { value: string; onChange: (v: string) => void; placeholder?: string; type?: string }) {
  return <input type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className={inputCls} />;
}

function Textarea({ value, onChange, placeholder, rows = 3 }: { value: string; onChange: (v: string) => void; placeholder?: string; rows?: number }) {
  return <textarea value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} rows={rows} className={inputCls} />;
}

function Select({ value, onChange, options }: { value: string; onChange: (v: string) => void; options: string[] }) {
  return (
    <select value={value} onChange={(e) => onChange(e.target.value)} className={inputCls}>
      {options.map((o) => <option key={o} value={o}>{o}</option>)}
    </select>
  );
}

function ImageUploader({ current, loading, onChange }: { current: string; loading: boolean; onChange: (f: File) => void }) {
  return (
    <div className="flex flex-col gap-2">
      {current && (
        <img src={current} alt="Preview" className="w-full h-32 object-cover rounded-btn border border-border" />
      )}
      <label className="flex items-center justify-center gap-2 px-4 py-2.5 border border-dashed border-border rounded-btn font-mono text-xs text-text-muted hover:border-accent-cyan/40 hover:text-accent-cyan transition-all cursor-pointer">
        {loading ? (
          <span className="flex items-center gap-2">
            <span className="w-3 h-3 border border-accent-cyan border-t-transparent rounded-full animate-spin" />
            Uploading...
          </span>
        ) : (
          <>{current ? "Replace image" : "Upload screenshot"}</>
        )}
        <input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && onChange(e.target.files[0])} />
      </label>
    </div>
  );
}
