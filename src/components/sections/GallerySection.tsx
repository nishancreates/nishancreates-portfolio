"use client";

import { useEffect, useState } from "react";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { db } from "@/lib/firebase";
import type { GalleryItem } from "@/types";

const FALLBACK: GalleryItem[] = [];

export default function GallerySection() {
  const [items, setItems] = useState<GalleryItem[]>(FALLBACK);
  const [selected, setSelected] = useState<{ item: GalleryItem; imgIndex: number } | null>(null);

  useEffect(() => {
    const q = query(collection(db, "gallery"), orderBy("order"));
    const unsub = onSnapshot(q, (snap) => {
      if (!snap.empty) {
        setItems(snap.docs.map((d) => ({ id: d.id, ...d.data() } as GalleryItem)));
      }
    });
    return () => unsub();
  }, []);

  if (items.length === 0) return null;

  return (
    <section className="py-20 max-w-6xl mx-auto px-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-12"
      >
        <p className="font-mono text-xs text-accent-cyan tracking-widest uppercase mb-3">
          Gallery
        </p>
        <h2 className="font-display text-3xl sm:text-4xl font-bold text-text-primary mb-4">
          Design previews.
        </h2>
        <p className="text-text-secondary max-w-xl">
          A look at the visual side — site designs, UI previews, and work in progress.
        </p>
      </motion.div>

      {/* Masonry Grid */}
      <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
        {items.map((item, i) =>
          item.images.map((img, imgIdx) => (
            <motion.div
              key={`${item.id}-${imgIdx}`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="break-inside-avoid relative group cursor-pointer rounded-xl overflow-hidden border border-border hover:border-accent-cyan/40 transition-all"
              onClick={() => setSelected({ item, imgIndex: imgIdx })}
            >
              <div className="relative w-full">
                <img
                  src={img}
                  alt={item.title}
                  className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105"
                />
                {/* Overlay */}
                <div className="absolute inset-0 bg-bg-primary/0 group-hover:bg-bg-primary/60 transition-all duration-300 flex items-end">
                  <div className="p-4 translate-y-4 group-hover:translate-y-0 transition-transform duration-300 opacity-0 group-hover:opacity-100 w-full">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-display text-sm font-bold text-text-primary">{item.title}</p>
                        <p className="font-mono text-xs text-text-muted capitalize">{item.category}</p>
                      </div>
                      {item.isPreview ? (
                        <span className="font-mono text-xs px-2 py-1 bg-accent-cyan/20 text-accent-cyan border border-accent-cyan/30 rounded-full">
                          Preview
                        </span>
                      ) : (
                        item.liveUrl && (
                          <a
                            href={item.liveUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="font-mono text-xs px-2 py-1 bg-bg-card text-text-secondary border border-border rounded-full hover:border-accent-cyan/40 hover:text-accent-cyan transition-all"
                          >
                            Live ↗
                          </a>
                        )
                      )}
                    </div>
                  </div>
                </div>
                {/* Preview badge top */}
                {item.isPreview && imgIdx === 0 && (
                  <div className="absolute top-3 left-3">
                    <span className="font-mono text-xs px-2 py-1 bg-bg-primary/80 text-accent-cyan border border-accent-cyan/30 rounded-full backdrop-blur-sm">
                      Preview
                    </span>
                  </div>
                )}
                {/* Multi-image indicator */}
                {item.images.length > 1 && imgIdx === 0 && (
                  <div className="absolute top-3 right-3">
                    <span className="font-mono text-xs px-2 py-1 bg-bg-primary/80 text-text-muted border border-border rounded-full backdrop-blur-sm">
                      {item.images.length} photos
                    </span>
                  </div>
                )}
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-bg-primary/95 backdrop-blur-sm flex items-center justify-center p-6"
            onClick={() => setSelected(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative max-w-4xl w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={selected.item.images[selected.imgIndex]}
                alt={selected.item.title}
                className="w-full h-auto rounded-xl border border-border"
              />
              <div className="mt-4 flex items-center justify-between">
                <div>
                  <p className="font-display text-lg font-bold text-text-primary">{selected.item.title}</p>
                  <p className="font-mono text-xs text-text-muted capitalize">{selected.item.category}</p>
                </div>
                <div className="flex gap-3">
                  {!selected.item.isPreview && selected.item.liveUrl && (
                    <a
                      href={selected.item.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-mono text-xs px-4 py-2 bg-accent-cyan text-bg-primary rounded-btn font-bold"
                    >
                      Visit site ↗
                    </a>
                  )}
                  <button
                    onClick={() => setSelected(null)}
                    className="font-mono text-xs px-4 py-2 bg-bg-card border border-border text-text-secondary rounded-btn hover:text-text-primary transition-all"
                  >
                    Close ✕
                  </button>
                </div>
              </div>
              {/* Image navigation if multiple */}
              {selected.item.images.length > 1 && (
                <div className="flex gap-2 mt-3">
                  {selected.item.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelected({ item: selected.item, imgIndex: idx })}
                      className={`w-16 h-10 rounded overflow-hidden border-2 transition-all ${
                        idx === selected.imgIndex ? "border-accent-cyan" : "border-border opacity-50"
                      }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
