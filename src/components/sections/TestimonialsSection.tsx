"use client";

import { useEffect, useState } from "react";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { motion, AnimatePresence } from "framer-motion";
import { db } from "@/lib/firebase";
import type { Testimonial } from "@/types";

export default function TestimonialsSection() {
  const [items, setItems] = useState<Testimonial[]>([]);
  const [activeVideo, setActiveVideo] = useState<string | null>(null);

  useEffect(() => {
    const q = query(collection(db, "testimonials"), orderBy("order"));
    const unsub = onSnapshot(q, (snap) => {
      if (!snap.empty) {
        setItems(snap.docs.map((d) => ({ id: d.id, ...d.data() } as Testimonial)));
      }
    });
    return () => unsub();
  }, []);

  if (items.length === 0) return null;

  function getEmbedUrl(url: string) {
    // YouTube
    const ytMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/);
    if (ytMatch) return `https://www.youtube.com/embed/${ytMatch[1]}?autoplay=1`;
    // Vimeo
    const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
    if (vimeoMatch) return `https://player.vimeo.com/video/${vimeoMatch[1]}?autoplay=1`;
    return url;
  }

  function getThumbUrl(url: string) {
    const ytMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/);
    if (ytMatch) return `https://img.youtube.com/vi/${ytMatch[1]}/hqdefault.jpg`;
    return null;
  }

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
          Testimonials
        </p>
        <h2 className="font-display text-3xl sm:text-4xl font-bold text-text-primary mb-4">
          What clients say.
        </h2>
        <p className="text-text-secondary max-w-xl">
          Real feedback from real business owners.
        </p>
      </motion.div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item, i) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="bg-bg-card border border-border rounded-card p-6 hover:border-accent-cyan/30 transition-all flex flex-col gap-4"
          >
            {/* Video thumbnail */}
            {item.videoUrl && (
              <div
                className="relative w-full aspect-video rounded-lg overflow-hidden cursor-pointer group"
                onClick={() => setActiveVideo(item.videoUrl!)}
              >
                {getThumbUrl(item.videoUrl) ? (
                  <img
                    src={getThumbUrl(item.videoUrl)!}
                    alt="Video thumbnail"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-bg-elevated flex items-center justify-center">
                    <span className="text-text-muted font-mono text-xs">Video</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-bg-primary/40 group-hover:bg-bg-primary/20 transition-all flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-accent-cyan/90 flex items-center justify-center">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="#101014">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </div>
              </div>
            )}

            {/* Stars */}
            <div className="flex gap-1">
              {Array.from({ length: 5 }).map((_, idx) => (
                <span key={idx} className={idx < item.rating ? "text-yellow-400" : "text-border"}>
                  ★
                </span>
              ))}
            </div>

            {/* Review text */}
            <p className="text-text-secondary text-sm leading-relaxed flex-1">
              &ldquo;{item.text}&rdquo;
            </p>

            {/* Client info */}
            <div className="flex items-center gap-3 pt-2 border-t border-border-subtle">
              {item.avatarUrl ? (
                <img src={item.avatarUrl} alt={item.clientName} className="w-9 h-9 rounded-full object-cover border border-border" />
              ) : (
                <div className="w-9 h-9 rounded-full bg-accent-cyan/10 border border-accent-cyan/20 flex items-center justify-center">
                  <span className="font-display text-sm font-bold text-accent-cyan">
                    {item.clientName.charAt(0)}
                  </span>
                </div>
              )}
              <div>
                <p className="font-display text-sm font-bold text-text-primary">{item.clientName}</p>
                <p className="font-mono text-xs text-text-muted">{item.businessName} · {item.businessType}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Video lightbox */}
      <AnimatePresence>
        {activeVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-bg-primary/95 backdrop-blur-sm flex items-center justify-center p-6"
            onClick={() => setActiveVideo(null)}
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="relative w-full max-w-3xl aspect-video"
              onClick={(e) => e.stopPropagation()}
            >
              <iframe
                src={getEmbedUrl(activeVideo)}
                className="w-full h-full rounded-xl border border-border"
                allow="autoplay; fullscreen"
                allowFullScreen
              />
              <button
                onClick={() => setActiveVideo(null)}
                className="absolute -top-10 right-0 font-mono text-xs text-text-muted hover:text-text-primary"
              >
                Close ✕
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
