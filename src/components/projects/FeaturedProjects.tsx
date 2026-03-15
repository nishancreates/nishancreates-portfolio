"use client";

import { useEffect, useState } from "react";
import { collection, query, where, orderBy, limit, onSnapshot } from "firebase/firestore";
import { motion } from "framer-motion";
import Link from "next/link";
import { db } from "@/lib/firebase";
import type { Project } from "@/types";
import ProjectCard from "@/components/projects/ProjectCard";

// Hardcoded fallback projects before Firestore loads
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
    problem: "A clothing brand needed a storefront with easy ordering — without a complex payment system.",
    solution: "Built a product showcase with WhatsApp checkout — customers tap to order, message goes directly to the owner.",
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

export default function FeaturedProjects() {
  const [projects, setProjects] = useState<Project[]>(FALLBACK_PROJECTS);

  useEffect(() => {
    const q = query(
      collection(db, "projects"),
      where("featured", "==", true),
      orderBy("order"),
      limit(4)
    );
    const unsub = onSnapshot(q, (snap) => {
      if (!snap.empty) {
        setProjects(snap.docs.map((d) => ({ id: d.id, ...d.data() } as Project)));
      }
    });
    return () => unsub();
  }, []);

  return (
    <section className="py-24 max-w-6xl mx-auto px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="flex items-end justify-between mb-12"
      >
        <div>
          <p className="font-mono text-xs text-accent-cyan tracking-widest uppercase mb-3">
            Case studies
          </p>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-text-primary">
            Work that ships.
          </h2>
          <p className="text-text-secondary mt-2 max-w-md">
            Real projects, real businesses. Each one includes a live site and owner dashboard.
          </p>
        </div>
        <Link
          href="/work"
          className="hidden sm:flex items-center gap-2 font-mono text-sm text-text-secondary hover:text-accent-cyan transition-colors"
        >
          All work <span className="text-accent-cyan">→</span>
        </Link>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {projects.map((project, i) => (
          <ProjectCard key={project.id} project={project} index={i} />
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="mt-8 flex justify-center sm:hidden"
      >
        <Link
          href="/work"
          className="font-mono text-sm text-text-secondary hover:text-accent-cyan transition-colors"
        >
          See all projects →
        </Link>
      </motion.div>
    </section>
  );
}
