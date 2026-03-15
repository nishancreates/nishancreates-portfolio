"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import type { Project } from "@/types";
import { generateProjectInquiryLink } from "@/lib/whatsapp";

interface ProjectCardProps {
  project: Project;
  index: number;
}

export default function ProjectCard({ project, index }: ProjectCardProps) {
  const [view, setView] = useState<"customer" | "admin">("customer");
  const activeView = view === "customer" ? project.customerView : project.adminView;
  const waLink = generateProjectInquiryLink({
    projectName: project.businessName,
    businessType: project.category,
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group relative bg-bg-card border border-border rounded-card overflow-hidden hover:border-accent-cyan/30 transition-all duration-300"
    >
      {/* Image area */}
      <div className="relative h-52 bg-bg-elevated overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={view}
            initial={{ opacity: 0, scale: 1.03 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0"
          >
            {activeView.image ? (
              <Image
                src={activeView.image}
                alt={`${project.businessName} ${view} view`}
                fill
                className="object-cover"
              />
            ) : (
              // Placeholder when no image
              <div className="w-full h-full flex items-center justify-center bg-bg-elevated">
                <div className="text-center">
                  <p className="text-4xl mb-2">
                    {view === "customer" ? "🌐" : "📊"}
                  </p>
                  <p className="font-mono text-xs text-text-muted">
                    {view === "customer" ? "Customer view" : "Admin dashboard"}
                  </p>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* View toggle */}
        <div className="absolute top-3 right-3 flex gap-1 bg-bg-primary/80 backdrop-blur-sm border border-border rounded-full p-1">
          {(["customer", "admin"] as const).map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={`px-3 py-1 rounded-full font-mono text-xs transition-all ${
                view === v
                  ? "bg-accent-cyan text-bg-primary font-bold"
                  : "text-text-muted hover:text-text-primary"
              }`}
            >
              {v === "customer" ? "Site" : "Admin"}
            </button>
          ))}
        </div>

        {/* Category badge */}
        <div className="absolute top-3 left-3">
          <span className="font-mono text-xs bg-bg-primary/80 backdrop-blur-sm border border-border rounded-full px-2 py-1 text-text-secondary capitalize">
            {project.category}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="font-display text-xl font-bold text-text-primary mb-1">
          {project.businessName}
        </h3>

        <AnimatePresence mode="wait">
          <motion.p
            key={view}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.2 }}
            className="text-text-secondary text-sm leading-relaxed mb-4"
          >
            {activeView.description}
          </motion.p>
        </AnimatePresence>

        {/* Features */}
        <div className="flex flex-wrap gap-1.5 mb-5">
          {activeView.features.slice(0, 4).map((f) => (
            <span
              key={f}
              className="font-mono text-xs text-text-muted border border-border-subtle rounded-full px-2 py-0.5"
            >
              {f}
            </span>
          ))}
        </div>

        {/* Tech stack */}
        <div className="flex flex-wrap gap-1.5 mb-5 pb-5 border-b border-border-subtle">
          {project.techStack.map((t) => (
            <span key={t} className="font-mono text-xs text-accent-cyan/70">
              {t}
            </span>
          ))}
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-2 py-2 bg-bg-elevated border border-border rounded-btn font-mono text-xs text-text-secondary hover:text-text-primary hover:border-border-strong transition-all"
            >
              <ExternalIcon />
              Live site
            </a>
          )}
          <a
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-2 py-2 bg-accent-cyan text-bg-primary rounded-btn font-mono text-xs font-bold hover:bg-accent-cyan-dim transition-all"
          >
            <WhatsAppIcon />
            I want this
          </a>
        </div>
      </div>
    </motion.div>
  );
}

function ExternalIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
      <polyline points="15 3 21 3 21 9" />
      <line x1="10" y1="14" x2="21" y2="3" />
    </svg>
  );
}

function WhatsAppIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}
