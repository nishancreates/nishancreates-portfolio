"use client";

import { useEffect, useState } from "react";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { motion } from "framer-motion";
import { db } from "@/lib/firebase";
import type { Project } from "@/types";
import ProjectCard from "@/components/projects/ProjectCard";
import { DotGridBackground } from "@/components/ui/Backgrounds";
import GallerySection from "@/components/sections/GallerySection";
import TestimonialsSection from "@/components/sections/TestimonialsSection";

const FALLBACK_PROJECTS: Project[] = [
  {
    id: "detox-club",
    businessName: "The Detox Club",
    category: "cafe",
    problem: "A wellness cafe needed a full digital presence with menu management and reservations.",
    solution: "Built a complete storefront with event listings, menu system, gallery, and a private owner dashboard with analytics.",
    result: "Owner manages everything independently — no developer needed for day-to-day updates.",
    liveUrl: "https://the-detoxclub.netlify.app/",
    githubUrl: "https://nishancreates.github.io/the-detox-club/index.html",
    customerView: {
      image: "",
      description: "A beautiful wellness cafe website with menu, events, and reservations.",
      features: ["Menu showcase", "Event listings", "Reservation system", "Community wall", "Gallery"],
    },
    adminView: {
      image: "",
      description: "Full owner dashboard with analytics, daily log, and content management.",
      features: ["Analytics overview", "Daily income/expense log", "Menu manager", "Reservation management", "Gallery manager"],
    },
    techStack: ["Next.js", "Firebase", "TailwindCSS", "Framer Motion"],
    featured: true,
    order: 1,
    createdAt: "2024-01-01",
  },
  {
    id: "bspoke",
    businessName: "BSpoke Clothing",
    category: "clothing",
    problem: "A clothing brand needed a storefront with easy ordering without a complex payment system.",
    solution: "Built a product showcase with WhatsApp checkout — customers tap to order directly.",
    result: "Zero payment gateway fees. Orders come directly to WhatsApp.",
    liveUrl: "https://bspokeclo.netlify.app/",
    customerView: {
      image: "",
      description: "Streetwear brand storefront with product catalog and WhatsApp ordering.",
      features: ["Product catalog", "Size/color selector", "WhatsApp checkout", "Brand story", "Lookbook"],
    },
    adminView: {
      image: "",
      description: "Product and inventory management dashboard.",
      features: ["Product manager", "Order tracking via WA", "Inventory log", "Settings"],
    },
    techStack: ["Next.js", "Firebase", "TailwindCSS", "WhatsApp API"],
    featured: true,
    order: 2,
    createdAt: "2024-02-01",
  },
];

export default function WorkPage() {
  const [projects, setProjects] = useState<Project[]>(FALLBACK_PROJECTS);
  const [filter, setFilter] = useState("all");
  const CATEGORIES = ["all", ...Array.from(new Set(projects.map((p) => p.category)))];

  useEffect(() => {
    const q = query(collection(db, "projects"), orderBy("order"));
    const unsub = onSnapshot(q, (snap) => {
      if (!snap.empty) {
        setProjects(snap.docs.map((d) => ({ id: d.id, ...d.data() } as Project)));
      }
    });
    return () => unsub();
  }, []);

  const filtered =
    filter === "all" ? projects : projects.filter((p) => p.category === filter);

  return (
    <div className="min-h-screen pt-24 pb-20">
      <DotGridBackground />

      {/* Projects section */}
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <p className="font-mono text-xs text-accent-cyan tracking-widest uppercase mb-3">
            Portfolio
          </p>
          <h1 className="font-display text-4xl sm:text-5xl font-bold text-text-primary mb-4">
            Work that ships.
          </h1>
          <p className="text-text-secondary max-w-xl text-lg">
            Every project includes a customer-facing site and a private owner dashboard.
            Toggle between views on each card.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-wrap gap-2 mb-10"
        >
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`font-mono text-xs px-4 py-2 rounded-full border transition-all capitalize ${
                filter === cat
                  ? "bg-accent-cyan text-bg-primary border-accent-cyan font-bold"
                  : "border-border text-text-secondary hover:border-border-strong hover:text-text-primary"
              }`}
            >
              {cat}
            </button>
          ))}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filtered.map((project, i) => (
            <ProjectCard key={project.id} project={project} index={i} />
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-24">
            <p className="text-text-muted font-mono text-sm">No projects in this category yet.</p>
          </div>
        )}
      </div>

      {/* Divider */}
      <div className="max-w-6xl mx-auto px-6 mt-20">
        <div className="border-t border-border" />
      </div>

      {/* Gallery section */}
      <GallerySection />

      {/* Divider */}
      <div className="max-w-6xl mx-auto px-6">
        <div className="border-t border-border" />
      </div>

      {/* Testimonials section */}
      <TestimonialsSection />
    </div>
  );
}
