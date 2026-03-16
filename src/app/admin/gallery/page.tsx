"use client";

import { useEffect, useState } from "react";
import { collection, query, orderBy, onSnapshot, doc, setDoc, deleteDoc } from "firebase/firestore";
import { motion } from "framer-motion";
import { db } from "@/lib/firebase";
import type { GalleryItem } from "@/types";
import { uploadImage } from "@/lib/cloudinary";

const EMPTY: Omit<GalleryItem, "id"> = {
  title: "",
  category: "",
  images: [],
  isPreview: false,
  liveUrl: "",
  order: 0,
  createdAt: new Date().toISOString(),
};

export default function AdminGalleryPage() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [editing, setEditing] = useState<GalleryItem | null>(null);
  const [form, setForm] = useState<Omit<GalleryItem, "id">>(EMPTY);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const q = query(collection(db, "gallery"), orderBy("order"));
    const unsub = onSnapshot(q, (snap) => {
      setItems(snap.docs.map((d) => ({ id: d.id, ...d.data() } as GalleryItem)));
    });
    return () => unsub();
  }, []);

  function startNew() {
    setEditing(null);
    setForm({ ...EMPTY, order: items.length + 1, createdAt: new Date().toISOString() });
  }

  function startEdit(item: GalleryItem) {
    setEditing(item);
    setForm({ ...item });
  }

  async function handleImageUpload(files: FileList) {
    setUploading(true);
    const urls: string[] = [];
    for (let i = 0; i < files.length; i++) {
      const result = await uploadImage(files[i]);
      if (result?.secure_url) urls.push(result.secure_url);
    }
    setForm((f) => ({ ...f, images: [...f.images, ...urls] }));
    setUploading(false);
  }

  function removeImage(idx: number) {
    setForm((f) => ({ ...f, images: f.images.filter((_, i) => i !== idx) }));
  }

  async function handleSave() {
    if (!form.title) return;
    setSaving(true);
    const id = editing?.id || `gallery-${Date.now()}`;
    await setDoc(doc(db, "gallery", id), { ...form });
    setSaving(false);
    setEditing(null);
    setForm(EMPTY);
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this gallery item?")) return;
    await deleteDoc(doc(db, "gallery", id));
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-2xl font-bold text-text-primary">Gallery</h1>
          <p className="font-mono text-xs text-text-muted mt-1">Add design previews and project screenshots</p>
        </div>
        <button
          onClick={startNew}
          className="px-4 py-2 bg-accent-cyan text-bg-primary font-mono text-sm font-bold rounded-btn hover:opacity-90 transition-all"
        >
          + Add Item
        </button>
      </div>

      {/* Form */}
      {(editing !== null || form.title !== "" || form.images.length > 0) && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-bg-card border border-border rounded-card p-6 mb-8"
        >
          <h2 className="font-display text-lg font-bold text-text-primary mb-6">
            {editing ? "Edit Item" : "New Gallery Item"}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block font-mono text-xs text-text-secondary mb-2 uppercase">Title</label>
              <input
                value={form.title}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                placeholder="e.g. The Detox Club"
                className="w-full bg-bg-primary border border-border rounded-btn px-4 py-2.5 text-text-primary font-mono text-sm focus:outline-none focus:border-accent-cyan/50"
              />
            </div>
            <div>
              <label className="block font-mono text-xs text-text-secondary mb-2 uppercase">Category</label>
              <input
                value={form.category}
                onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                placeholder="e.g. cafe, clothing, restaurant"
                className="w-full bg-bg-primary border border-border rounded-btn px-4 py-2.5 text-text-primary font-mono text-sm focus:outline-none focus:border-accent-cyan/50"
              />
            </div>
            <div>
              <label className="block font-mono text-xs text-text-secondary mb-2 uppercase">Live URL (optional)</label>
              <input
                value={form.liveUrl}
                onChange={(e) => setForm((f) => ({ ...f, liveUrl: e.target.value }))}
                placeholder="https://..."
                className="w-full bg-bg-primary border border-border rounded-btn px-4 py-2.5 text-text-primary font-mono text-sm focus:outline-none focus:border-accent-cyan/50"
              />
            </div>
            <div>
              <label className="block font-mono text-xs text-text-secondary mb-2 uppercase">Order</label>
              <input
                type="number"
                value={form.order}
                onChange={(e) => setForm((f) => ({ ...f, order: Number(e.target.value) }))}
                className="w-full bg-bg-primary border border-border rounded-btn px-4 py-2.5 text-text-primary font-mono text-sm focus:outline-none focus:border-accent-cyan/50"
              />
            </div>
          </div>

          {/* Preview toggle */}
          <div className="flex items-center gap-3 mb-6">
            <button
              onClick={() => setForm((f) => ({ ...f, isPreview: !f.isPreview }))}
              className={`relative w-11 h-6 rounded-full transition-colors ${form.isPreview ? "bg-accent-cyan" : "bg-border"}`}
            >
              <span className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${form.isPreview ? "translate-x-6" : "translate-x-1"}`} />
            </button>
            <span className="font-mono text-sm text-text-secondary">Mark as Preview (site not deployed yet)</span>
          </div>

          {/* Image upload */}
          <div className="mb-6">
            <label className="block font-mono text-xs text-text-secondary mb-2 uppercase">
              Images ({form.images.length} uploaded) — select multiple at once
            </label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => e.target.files && handleImageUpload(e.target.files)}
              className="w-full bg-bg-primary border border-dashed border-border rounded-btn px-4 py-3 text-text-muted font-mono text-sm cursor-pointer hover:border-accent-cyan/40 transition-all"
            />
            {uploading && <p className="font-mono text-xs text-accent-cyan mt-2">Uploading...</p>}

            {/* Image previews */}
            {form.images.length > 0 && (
              <div className="flex flex-wrap gap-3 mt-3">
                {form.images.map((img, idx) => (
                  <div key={idx} className="relative w-24 h-16 rounded-lg overflow-hidden border border-border group">
                    <img src={img} alt="" className="w-full h-full object-cover" />
                    <button
                      onClick={() => removeImage(idx)}
                      className="absolute inset-0 bg-bg-primary/70 opacity-0 group-hover:opacity-100 flex items-center justify-center text-red-400 font-mono text-xs transition-all"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
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
              onClick={() => { setEditing(null); setForm(EMPTY); }}
              className="px-6 py-2.5 bg-bg-elevated border border-border text-text-secondary font-mono text-sm rounded-btn hover:text-text-primary transition-all"
            >
              Cancel
            </button>
          </div>
        </motion.div>
      )}

      {/* Items grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((item) => (
          <div key={item.id} className="bg-bg-card border border-border rounded-card overflow-hidden">
            {item.images[0] && (
              <div className="relative w-full h-36">
                <img src={item.images[0]} alt={item.title} className="w-full h-full object-cover" />
                {item.images.length > 1 && (
                  <span className="absolute top-2 right-2 font-mono text-xs px-2 py-1 bg-bg-primary/80 text-text-muted rounded-full">
                    +{item.images.length - 1} more
                  </span>
                )}
                {item.isPreview && (
                  <span className="absolute top-2 left-2 font-mono text-xs px-2 py-1 bg-accent-cyan/20 text-accent-cyan border border-accent-cyan/30 rounded-full">
                    Preview
                  </span>
                )}
              </div>
            )}
            <div className="p-4">
              <p className="font-display text-sm font-bold text-text-primary">{item.title}</p>
              <p className="font-mono text-xs text-text-muted capitalize mt-0.5">{item.category}</p>
              <div className="flex gap-2 mt-3">
                <button
                  onClick={() => startEdit(item)}
                  className="flex-1 py-1.5 bg-bg-elevated border border-border text-text-secondary font-mono text-xs rounded-btn hover:text-text-primary transition-all"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="flex-1 py-1.5 bg-red-400/10 border border-red-400/20 text-red-400 font-mono text-xs rounded-btn hover:bg-red-400/20 transition-all"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {items.length === 0 && (
        <div className="text-center py-20 border border-dashed border-border rounded-card">
          <p className="text-text-muted font-mono text-sm">No gallery items yet. Add your first one!</p>
        </div>
      )}
    </div>
  );
}
