"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import TypewriterHero from "@/components/ui/TypewriterHero";
import MagneticButton from "@/components/ui/MagneticButton";
import { useGlobalConfig } from "@/context/GlobalContext";
import { generateStartProjectLink } from "@/lib/whatsapp";

export default function HeroSection() {
  const { siteConfig, contactConfig } = useGlobalConfig();
  const waLink = generateStartProjectLink();

  const fadeUp = (delay: number) => ({
    initial: { opacity: 0, y: 24 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] },
  });

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background grid */}
      <div className="absolute inset-0 bg-grid bg-grid opacity-100" />

      {/* Cyan glow top-left */}
      <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-cyan-gradient pointer-events-none" />

      {/* Content */}
      <div className="relative max-w-6xl mx-auto px-6 pt-28 pb-20 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* Left — Text */}
          <div className="flex flex-col gap-6">
            {/* Available badge */}
            {siteConfig.availableForWork && (
              <motion.div {...fadeUp(0.1)} className="flex items-center gap-2 w-fit">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse-slow" />
                <span className="font-mono text-xs text-text-secondary border border-border rounded-full px-3 py-1">
                  Available for new projects
                </span>
              </motion.div>
            )}

            {/* Typewriter headline */}
            <motion.h1
              {...fadeUp(0.2)}
              className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight"
            >
              <TypewriterHero lines={siteConfig.taglines} speed={45} pause={2200} />
            </motion.h1>

            {/* Name + title */}
            <motion.div {...fadeUp(0.3)}>
              <p className="font-mono text-sm text-text-secondary mb-1">
                — {siteConfig.name}
              </p>
              <p className="text-text-secondary text-lg leading-relaxed max-w-md">
                {siteConfig.bio}
              </p>
            </motion.div>

            {/* CTAs */}
            <motion.div {...fadeUp(0.4)} className="flex flex-wrap gap-3 pt-2">
              <MagneticButton variant="primary" href="/work">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="3" width="7" height="7" rx="1" />
                  <rect x="14" y="3" width="7" height="7" rx="1" />
                  <rect x="3" y="14" width="7" height="7" rx="1" />
                  <rect x="14" y="14" width="7" height="7" rx="1" />
                </svg>
                {siteConfig.heroCtaPrimary}
              </MagneticButton>

              <MagneticButton variant="outline" href={waLink} target="_blank" rel="noopener noreferrer">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                {siteConfig.heroCtaSecondary}
              </MagneticButton>
            </motion.div>

            {/* Stats */}
            <motion.div
              {...fadeUp(0.5)}
              className="flex gap-8 pt-4 border-t border-border-subtle"
            >
              <div>
                <p className="font-display text-3xl font-bold text-text-primary">
                  {siteConfig.projectsCompleted}+
                </p>
                <p className="font-mono text-xs text-text-muted mt-1">
                  Projects delivered
                </p>
              </div>
              <div className="w-px bg-border-subtle" />
              <div>
                <p className="font-display text-3xl font-bold text-text-primary">
                  {siteConfig.yearsExperience}+
                </p>
                <p className="font-mono text-xs text-text-muted mt-1">
                  Years building
                </p>
              </div>
              <div className="w-px bg-border-subtle" />
              <div>
                <p className="font-display text-3xl font-bold text-accent-cyan">
                  NP
                </p>
                <p className="font-mono text-xs text-text-muted mt-1">
                  Based in Nepal
                </p>
              </div>
            </motion.div>
          </div>

          {/* Right — Profile image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="flex justify-center lg:justify-end"
          >
            <div className="relative">
              {/* Glow behind image */}
              <div className="absolute inset-0 rounded-2xl bg-accent-cyan/10 blur-2xl scale-110" />

              {/* Image frame */}
              <div className="relative w-72 h-72 sm:w-80 sm:h-80 rounded-2xl overflow-hidden border border-border-strong">
                <Image
                  src={siteConfig.profileImage}
                  alt={siteConfig.name}
                  fill
                  className="object-cover"
                  priority
                />
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-bg-primary/40 to-transparent" />
              </div>

              {/* Floating badge */}
              <motion.div
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -bottom-4 -left-4 bg-bg-card border border-border rounded-xl px-4 py-2"
              >
                <p className="font-mono text-xs text-text-secondary">Full-Stack</p>
                <p className="font-display text-sm font-bold text-accent-cyan">Architect</p>
              </motion.div>

              {/* Tech badge */}
              <motion.div
                animate={{ y: [0, 6, 0] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                className="absolute -top-4 -right-4 bg-bg-card border border-border rounded-xl px-4 py-2"
              >
                <p className="font-mono text-xs text-text-secondary">Next.js +</p>
                <p className="font-display text-sm font-bold text-text-primary">Firebase</p>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <span className="font-mono text-xs text-text-muted">scroll</span>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-px h-8 bg-gradient-to-b from-text-muted to-transparent"
          />
        </motion.div>
      </div>
    </section>
  );
}
