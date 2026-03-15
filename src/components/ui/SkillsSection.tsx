"use client";

import { useEffect, useState } from "react";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { motion } from "framer-motion";
import { db } from "@/lib/firebase";
import type { Skill } from "@/types";
import BentoCard from "@/components/ui/BentoCard";

const CATEGORIES = ["frontend", "backend", "tools", "design"] as const;

const CATEGORY_LABELS: Record<string, string> = {
  frontend: "Frontend",
  backend: "Backend & DB",
  tools: "Tools & Infra",
  design: "Design & UX",
};

// Default skills shown before Firestore loads
const DEFAULT_SKILLS: Skill[] = [
  { id: "1", name: "Next.js", category: "frontend", level: 5 },
  { id: "2", name: "React", category: "frontend", level: 5 },
  { id: "3", name: "TypeScript", category: "frontend", level: 4 },
  { id: "4", name: "TailwindCSS", category: "frontend", level: 5 },
  { id: "5", name: "Framer Motion", category: "frontend", level: 4 },
  { id: "6", name: "Firebase", category: "backend", level: 5 },
  { id: "7", name: "Firestore", category: "backend", level: 5 },
  { id: "8", name: "Node.js", category: "backend", level: 3 },
  { id: "9", name: "REST APIs", category: "backend", level: 4 },
  { id: "10", name: "Git & GitHub", category: "tools", level: 5 },
  { id: "11", name: "Cloudinary", category: "tools", level: 4 },
  { id: "12", name: "Netlify", category: "tools", level: 5 },
  { id: "13", name: "Figma", category: "design", level: 3 },
  { id: "14", name: "UI/UX Design", category: "design", level: 4 },
];

export default function SkillsSection() {
  const [skills, setSkills] = useState<Skill[]>(DEFAULT_SKILLS);

  useEffect(() => {
    const q = query(collection(db, "skills"), orderBy("category"));
    const unsub = onSnapshot(q, (snap) => {
      if (!snap.empty) {
        setSkills(snap.docs.map((d) => ({ id: d.id, ...d.data() } as Skill)));
      }
    });
    return () => unsub();
  }, []);

  const byCategory = CATEGORIES.reduce((acc, cat) => {
    acc[cat] = skills.filter((s) => s.category === cat);
    return acc;
  }, {} as Record<string, Skill[]>);

  return (
    <section className="py-24 max-w-6xl mx-auto px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-12"
      >
        <p className="font-mono text-xs text-accent-cyan tracking-widest uppercase mb-3">
          Skills & stack
        </p>
        <h2 className="font-display text-3xl sm:text-4xl font-bold text-text-primary">
          Tools I ship with.
        </h2>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {CATEGORIES.map((cat, i) => (
          <BentoCard key={cat} delay={0.1 * i}>
            <p className="font-mono text-xs text-accent-cyan mb-4 uppercase tracking-wider">
              {CATEGORY_LABELS[cat]}
            </p>
            <div className="flex flex-col gap-3">
              {byCategory[cat].map((skill) => (
                <div key={skill.id}>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-text-primary">{skill.name}</span>
                    <span className="font-mono text-xs text-text-muted">
                      {"█".repeat(skill.level)}{"░".repeat(5 - skill.level)}
                    </span>
                  </div>
                  <div className="h-px bg-border-subtle" />
                </div>
              ))}
            </div>
          </BentoCard>
        ))}
      </div>
    </section>
  );
}
