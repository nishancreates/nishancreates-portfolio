// @ts-nocheck
"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import TypewriterHero from "@/components/ui/TypewriterHero";
import { useGlobalConfig } from "@/context/GlobalContext";
import { generateStartProjectLink } from "@/lib/whatsapp";
import { HomeBackground } from "@/components/ui/Backgrounds";

const glass = {
  background: "rgba(5,10,30,0.45)",
  border: "1px solid rgba(120,160,255,0.15)",
  backdropFilter: "blur(18px)",
  WebkitBackdropFilter: "blur(18px)",
  borderRadius: "16px",
};

function MiniTypewriter({ lines, speed = 60, pause = 2000 }: { lines: string[]; speed?: number; pause?: number }) {
  const [lineIdx, setLineIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [deleting, setDeleting] = useState(false);
  const [text, setText] = useState("");

  useEffect(() => {
    if (!lines || lines.length === 0) return;
    const current = lines[lineIdx % lines.length];
    if (!deleting && charIdx <= current.length) {
      const t = setTimeout(() => { setText(current.slice(0, charIdx)); setCharIdx((c) => c + 1); }, speed);
      return () => clearTimeout(t);
    }
    if (!deleting && charIdx > current.length) {
      const t = setTimeout(() => setDeleting(true), pause);
      return () => clearTimeout(t);
    }
    if (deleting && charIdx >= 0) {
      const t = setTimeout(() => { setText(current.slice(0, charIdx)); setCharIdx((c) => c - 1); }, speed / 2);
      return () => clearTimeout(t);
    }
    if (deleting && charIdx < 0) {
      setDeleting(false);
      setLineIdx((l) => (l + 1) % lines.length);
      setCharIdx(0);
    }
  }, [charIdx, deleting, lineIdx, lines, speed, pause]);

  return (
    <span className="font-mono text-xs" style={{ color: "rgba(160,200,255,0.7)" }}>
      {text}<span className="animate-pulse" style={{ color: "#00e8ff" }}>|</span>
    </span>
  );
}

export default function HeroSection() {
  const { siteConfig } = useGlobalConfig();
  const waLink = generateStartProjectLink();
  const [flipped, setFlipped] = useState(false);

  const projectsTaglines = siteConfig.projectsTaglines || ["10+ delivered","Web apps & dashboards","Cafes, clothing & restaurants","Every project is custom"];
  const yearsTaglines = siteConfig.yearsTaglines || ["2+ years","Professional full-stack","Nepal → Global","Always learning"];

  const fadeUp = (delay: number) => ({
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] },
  });

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      <HomeBackground />
      <div className="relative max-w-6xl mx-auto px-6 pt-28 pb-20 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-3">

          <motion.div {...fadeUp(0.1)} style={glass} className="lg:row-span-2 flex flex-col gap-5 p-6">
            <div className="relative">
              <div onClick={() => setFlipped(!flipped)} className="relative w-full aspect-square max-w-[200px] mx-auto cursor-pointer rounded-2xl overflow-hidden" style={{ perspective: "1000px" }}>
                <motion.div animate={{ rotateY: flipped ? 180 : 0 }} transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }} style={{ transformStyle: "preserve-3d", width: "100%", height: "100%", position: "relative" }}>
                  <div style={{ backfaceVisibility: "hidden", position: "absolute", inset: 0 }} className="rounded-2xl overflow-hidden border border-white/10">
                    <Image src={siteConfig.profileImage || "/profile.jpg"} alt={siteConfig.name} fill className="object-cover" priority />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#02020a]/60 to-transparent" />
                    <div className="absolute bottom-2 right-2 px-2 py-1 rounded-lg text-xs font-mono text-white/40" style={{ background: "rgba(5,10,30,0.6)" }}>flip ↺</div>
                  </div>
                  <div style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)", position: "absolute", inset: 0 }} className="rounded-2xl overflow-hidden border border-[rgba(120,160,255,0.3)]">
                    <Image src="/profile.jpg" alt="avatar" fill className="object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#02020a]/60 to-transparent" />
                    <div className="absolute bottom-2 right-2 px-2 py-1 rounded-lg text-xs font-mono text-[#a0c0ff]/60" style={{ background: "rgba(5,10,30,0.6)" }}>flip ↺</div>
                  </div>
                </motion.div>
              </div>
            </div>
            {siteConfig.availableForWork && (
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <span className="font-mono text-xs text-white/40">Available for new projects</span>
              </div>
            )}
            <div>
              <h1 className="font-display text-2xl font-bold text-white leading-tight">
                {siteConfig.name.includes("nishan") ? (<><span className="text-white">nishan</span><span className="text-[#00e8ff]">creates</span></>) : siteConfig.name}
              </h1>
              <p className="font-mono text-xs mt-1" style={{ color: "rgba(160,192,255,0.5)" }}>{siteConfig.title}</p>
            </div>
            <p className="text-sm leading-relaxed flex-1" style={{ color: "rgba(255,255,255,0.5)" }}>{siteConfig.bio}</p>
            <div className="flex flex-wrap gap-2">
              {["Next.js", "Firebase", "Nepal"].map(t => (
                <span key={t} className="font-mono text-xs px-2 py-1 rounded-full border" style={{ background: "rgba(100,150,255,0.08)", borderColor: "rgba(100,150,255,0.2)", color: "#a0c0ff" }}>{t}</span>
              ))}
            </div>
            <div className="flex gap-3 flex-wrap">
              <Link href="/work" className="flex-1 text-center py-2.5 rounded-xl font-mono text-sm font-bold transition-all" style={{ background: "#00e8ff", color: "#02020a" }}>{siteConfig.heroCtaPrimary || "View Work"}</Link>
              <a href={waLink} target="_blank" rel="noopener noreferrer" className="flex-1 text-center py-2.5 rounded-xl font-mono text-sm transition-all border" style={{ borderColor: "rgba(100,150,255,0.25)", color: "#a0c0ff", background: "transparent" }}>{siteConfig.heroCtaSecondary || "WhatsApp"}</a>
            </div>
          </motion.div>

          <motion.div {...fadeUp(0.2)} style={glass} className="lg:col-span-2 p-6 flex flex-col justify-center min-h-[140px]">
            <p className="font-mono text-xs mb-3 uppercase tracking-widest" style={{ color: "rgba(160,192,255,0.4)" }}>What I build</p>
            <h2 className="font-display text-3xl lg:text-4xl font-bold text-white leading-tight">
              <TypewriterHero lines={siteConfig.taglines} speed={45} pause={2200} />
            </h2>
          </motion.div>

          <motion.div {...fadeUp(0.3)} style={glass} className="p-5 flex flex-col gap-3">
            <p className="font-mono text-xs uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.35)" }}>Projects</p>
            <p className="font-display text-3xl font-bold text-white">{siteConfig.projectsCompleted}<span style={{ color: "#00e8ff" }}>+</span></p>
            <div className="flex-1 flex items-end">
              <MiniTypewriter lines={projectsTaglines} speed={55} pause={2200} />
            </div>
          </motion.div>

          <motion.div {...fadeUp(0.35)} style={glass} className="p-5 flex flex-col gap-3">
            <p className="font-mono text-xs uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.35)" }}>Experience</p>
            <p className="font-display text-3xl font-bold text-white">{siteConfig.yearsExperience}<span style={{ color: "#00e8ff" }}>+</span></p>
            <div className="flex-1 flex items-end">
              <MiniTypewriter lines={yearsTaglines} speed={55} pause={2400} />
            </div>
          </motion.div>

          <motion.div {...fadeUp(0.4)} style={glass} className="lg:col-span-3 p-5 flex items-center justify-between gap-6">
            <p className="font-display text-lg font-bold italic" style={{ color: "rgba(255,255,255,0.8)" }}>"Complete systems, not just websites."</p>
            <Link href="/brief" className="shrink-0 px-5 py-2.5 rounded-xl font-mono text-sm font-bold transition-all" style={{ background: "#00e8ff", color: "#02020a" }}>Start a project →</Link>
          </motion.div>

        </div>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }} className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
          <span className="font-mono text-xs" style={{ color: "rgba(255,255,255,0.2)" }}>scroll</span>
          <motion.div animate={{ y: [0, 6, 0] }} transition={{ duration: 1.5, repeat: Infinity }} className="w-px h-8 bg-gradient-to-b from-white/20 to-transparent" />
        </motion.div>
      </div>
    </section>
  );
}
