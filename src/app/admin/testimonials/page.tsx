"use client";

import { useEffect, useState } from "react";
import { collection, query, orderBy, onSnapshot, doc, setDoc, deleteDoc } from "firebase/firestore";
import { motion } from "framer-motion";
import { db } from "@/lib/firebase";
import type { Testimonial } from "@/types";
import { uploadImage } from "@/lib/cloudinary";

const EMPTY: Omit<Testimonial, "id"> = {
  clientName: "",
  businessName: "",
  businessType: "",
  text: "",
  videoUrl: "",
  rating: 5,
  avatarUrl: "",
  order: 0,
  createdAt: new Date().toISOString(),
};

export default function AdminTestimonialsPage() {
  const [items, setItems] = useState<Testimonial[]>([]);
  const [editing, setEditing] = useState<Testimonial | null>(null);
  const [form, setForm] = useState<Omit<Testimonial, "id">>(EMPTY);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const q = query(collection(db, "testimonials"), orderBy("order"));
    const unsub = onSnapshot(q, (snap) => {
      setItems(snap.docs.map((d) => ({ id: d.id, ...d.data() } as Testimonial)));
    });
    return () => unsub();
  }, []);

  function startNew() {
    setEditing(null);
    setForm({ ...EMPTY, order: items.length + 1, createdAt: new Date().toISOString() });
    setShowForm(true);
  }

  function startEdit(item: Testimonial) {
    setEditing(item);
    setForm({ ...item });
    setShowForm(true);
  }

  async function handleAvatarUpload(file: File) {
    setUploading(true);
    const url = await uploadImage(file);
    if (url) setForm((f) => ({ ...f, avatarUrl: url }));
    setUploading(false);
  }

  async function handleSave() {
    if (!form.clientName || !form.text) return;
    setSaving(true);
    const id = editing?.id || `testimonial-${Date.now()}`;
    await setDoc(doc(db, "testimonials", id), { ...form });
    setSaving(false);
    setEditing(null);
    setForm(EMPTY);
    setShowForm(false);
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this testimonial?")) return;
    await deleteDoc(doc(db, "testimonials", id));
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-2xl font-bold text-text-primary">Testimonials</h1>
          <p className="font-mono text-xs text-text-muted mt-1">Add client reviews and video testimonials</p>
        </div>
        <button
          onClick={startNew}
          className="px-4 py-2 bg-accent-cyan text-bg-primary font-mono text-sm font-bold rounded-btn hover:opacity-90 transition-all"
        >
          + Add Testimonial
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-bg-card border border-border rounded-card p-6 mb-8"
        >
          <h2 className="font-display text-lg font-bold text-text-primary mb-6">
            {editing ? "Edit Testimonial" : "New Testimonial"}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block font-mono text-xs text-text-secondary mb-2 uppercase">Client Name</label>
              <input
                value={form.clientName}
                onChange={(e) => setForm((f) => ({ ...f, clientName: e.target.value }))}
                placeholder="e.g. Sita Sharma"
                className="w-full bg-bg-primary border border-border rounded-btn px-4 py-2.5 text-text-primary font-mono text-sm focus:outline-none focus:border-accent-cyan/50"
              />
            </div>
            <div>
              <label className="block font-mono text-xs text-text-secondary mb-2 uppercase">Business Name</label>
              <input
                value={form.businessName}
                onChange={(e) => setForm((f) => ({ ...f, businessName: e.target.value }))}
                placeholder="e.g. The Detox Club"
                className="w-full bg-bg-primary border border-border rounded-btn px-4 py-2.5 text-text-primary font-mono text-sm focus:outline-none focus:border-accent-cyan/50"
              />
            </div>
            <div>
              <label className="block font-mono text-xs text-text-secondary mb-2 uppercase">Business Type</label>
              <input
                value={form.businessType}
                onChange={(e) => setForm((f) => ({ ...f, businessType: e.target.value }))}
                placeholder="e.g. Cafe, Clothing Brand"
                className="w-full bg-bg-primary border border-border rounded-btn px-4 py-2.5 text-text-primary font-mono text-sm focus:outline-none focus:border-accent-cyan/50"
              />
            </div>
            <div>
              <label className="block font-mono text-xs text-text-secondary mb-2 uppercase">Rating (1-5)</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button
                    key={n}
                    onClick={() => setForm((f) => ({ ...f, rating: n }))}
                    className={`text-2xl transition-all ${n <= form.rating ? "text-yellow-400" : "text-border"}`}
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="mb-4">
            <label className="block font-mono text-xs text-text-secondary mb-2 uppercase">Review Text</label>
            <textarea
              value={form.text}
              onChange={(e) => setForm((f) => ({ ...f, text: e.target.value }))}
              placeholder="What did the client say about your work?"
              rows={3}
              className="w-full bg-bg-primary border border-border rounded-btn px-4 py-2.5 text-text-primary font-mono text-sm focus:outline-none focus:border-accent-cyan/50 resize-none"
            />
          </div>

          <div className="mb-4">
            <label className="block font-mono text-xs text-text-secondary mb-2 uppercase">Video URL (YouTube or Vimeo — optional)</label>
            <input
              value={form.videoUrl}
              onChange={(e) => setForm((f) => ({ ...f, videoUrl: e.target.value }))}
              placeholder="https://youtube.com/watch?v=... or https://vimeo.com/..."
              className="w-full bg-bg-primary border border-border rounded-btn px-4 py-2.5 text-text-primary font-mono text-sm focus:outline-none focus:border-accent-cyan/50"
            />
          </div>

          <div className="mb-6">
            <label className="block font-mono text-xs text-text-secondary mb-2 uppercase">Client Avatar (optional)</label>
            <div className="flex items-center gap-4">
              {form.avatarUrl && (
                <img src={form.avatarUrl} alt="avatar" className="w-12 h-12 rounded-full object-cover border border-border" />
              )}
              <input
                type="file"
                accept="image/*"
                onChange={(e) => e.target.files?.[0] && handleAvatarUpload(e.target.files[0])}
                className="bg-bg-primary border border-dashed border-border rounded-btn px-4 py-2 text-text-muted font-mono text-sm cursor-pointer hover:border-accent-cyan/40 transition-all"
              />
              {uploading && <span className="font-mono text-xs text-accent-cyan">Uploading...</span>}
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleSave}
              disabled={saving || uploading}
              className="px-6 py-2.5 bg-accent-cyan text-bg-primary font-mono text-sm font-bold rounded-btn hover:opacity-90 disabled:opacity-50 transition-all"
            >
              {saving ? "Saving..." : "Save"}
            </button>
            <button
              onClick={() => { setEditing(null); setForm(EMPTY); setShowForm(false); }}
              className="px-6 py-2.5 bg-bg-elevated border border-border text-text-secondary font-mono text-sm rounded-btn hover:text-text-primary transition-all"
            >
              Cancel
            </button>
          </div>
        </motion.div>
      )}

      {/* List */}
      <div className="flex flex-col gap-4">
        {items.map((item) => (
          <div key={item.id} className="bg-bg-card border border-border rounded-card p-5 flex items-start gap-4">
            {item.avatarUrl ? (
              <img src={item.avatarUrl} alt={item.clientName} className="w-12 h-12 rounded-full object-cover border border-border shrink-0" />
            ) : (
              <div className="w-12 h-12 rounded-full bg-accent-cyan/10 border border-accent-cyan/20 flex items-center justify-center shrink-0">
                <span className="font-display text-lg font-bold text-accent-cyan">{item.clientName.charAt(0)}</span>
              </div>
            )}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <p className="font-display text-sm font-bold text-text-primary">{item.clientName}</p>
                <span className="font-mono text-xs text-text-muted">·</span>
                <p className="font-mono text-xs text-text-muted">{item.businessName}</p>
                <div className="flex gap-0.5 ml-auto">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span key={i} className={`text-sm ${i < item.rating ? "text-yellow-400" : "text-border"}`}>★</span>
                  ))}
                </div>
              </div>
              <p className="text-text-secondary text-sm line-clamp-2">{item.text}</p>
              {item.videoUrl && (
                <p className="font-mono text-xs text-accent-cyan mt-1">📹 Video testimonial</p>
              )}
            </div>
            <div className="flex gap-2 shrink-0">
              <button onClick={() => startEdit(item)} className="px-3 py-1.5 bg-bg-elevated border border-border text-text-secondary font-mono text-xs rounded-btn hover:text-text-primary transition-all">Edit</button>
              <button onClick={() => handleDelete(item.id)} className="px-3 py-1.5 bg-red-400/10 border border-red-400/20 text-red-400 font-mono text-xs rounded-btn hover:bg-red-400/20 transition-all">Delete</button>
            </div>
          </div>
        ))}
      </div>

      {items.length === 0 && (
        <div className="text-center py-20 border border-dashed border-border rounded-card">
          <p className="text-text-muted font-mono text-sm">No testimonials yet. Add your first one!</p>
        </div>
      )}
    </div>
  );
}
