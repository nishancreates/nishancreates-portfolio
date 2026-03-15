"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useGlobalConfig } from "@/context/GlobalContext";
import SkillsSection from "@/components/ui/SkillsSection";
import CtaBanner from "@/components/ui/CtaBanner";
import MagneticButton from "@/components/ui/MagneticButton";
import { generateStartProjectLink } from "@/lib/whatsapp";
import { CyanParticlesBackground } from "@/components/ui/Backgrounds";

export default function AboutPage() {
  const { siteConfig, contactConfig } = useGlobalConfig();
  const waLink = generateStartProjectLink();

  const fadeUp = (delay = 0) => ({
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, delay },
  });

  return (
    <div className="min-h-screen pt-24 pb-0">
      <CyanParticlesBackground />

      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <motion.p {...fadeUp(0.1)} className="font-mono text-xs text-accent-cyan tracking-widest uppercase mb-4">
              About
            </motion.p>
            <motion.h1 {...fadeUp(0.2)} className="font-display text-4xl sm:text-5xl font-bold text-text-primary mb-6">
              {siteConfig.name}
            </motion.h1>
            <motion.p {...fadeUp(0.3)} className="font-mono text-sm text-text-secondary mb-2">
              {siteConfig.title}
            </motion.p>
            <motion.p {...fadeUp(0.4)} className="text-text-secondary leading-relaxed text-lg mb-8">
              {siteConfig.bio}
            </motion.p>

            <motion.div {...fadeUp(0.5)} className="flex gap-8 mb-8">
              <div className="text-center">
                <p className="font-display text-3xl font-bold text-accent-cyan">{siteConfig.projectsCompleted}+</p>
                <p className="font-mono text-xs text-text-muted mt-1">Projects</p>
              </div>
              <div className="w-px bg-border-subtle" />
              <div className="text-center">
                <p className="font-display text-3xl font-bold text-accent-cyan">{siteConfig.yearsExperience}+</p>
                <p className="font-mono text-xs text-text-muted mt-1">Years</p>
              </div>
              <div className="w-px bg-border-subtle" />
              <div className="text-center">
                <p className="font-display text-3xl font-bold text-accent-cyan">NP</p>
                <p className="font-mono text-xs text-text-muted mt-1">Nepal</p>
              </div>
            </motion.div>

            <motion.div {...fadeUp(0.6)} className="flex flex-wrap gap-3">
              <MagneticButton variant="primary" href={waLink} target="_blank" rel="noopener noreferrer">
                Work with me
              </MagneticButton>
              <MagneticButton variant="outline" href={contactConfig.github} target="_blank" rel="noopener noreferrer">
                GitHub →
              </MagneticButton>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="flex justify-center"
          >
            <div className="relative">
              <div className="absolute inset-0 rounded-2xl bg-accent-cyan/10 blur-2xl scale-110" />
              <div className="relative w-72 h-72 sm:w-80 sm:h-80 rounded-2xl overflow-hidden border border-border-strong">
                <Image src={siteConfig.profileImage} alt={siteConfig.name} fill className="object-cover" />
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {[
            { title: "I build for businesses", body: "Cafes, restaurants, clothing brands, boutiques. Local businesses that need a real digital presence — not just a brochure.", icon: "🏪" },
            { title: "I ship full systems", body: "Every project includes a customer-facing site AND an owner dashboard. One price, complete solution.", icon: "🚀" },
            { title: "I think in products", body: "Not just code. I think about user flows, business goals, and what actually gets customers through the door.", icon: "🧠" },
          ].map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-bg-card border border-border rounded-card p-6 hover:border-accent-cyan/30 transition-all"
            >
              <p className="text-3xl mb-4">{item.icon}</p>
              <h3 className="font-display text-lg font-bold text-text-primary mb-2">{item.title}</h3>
              <p className="text-text-secondary text-sm leading-relaxed">{item.body}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>

      <SkillsSection />
      <CtaBanner />
    </div>
  );
}
