"use client";

import { motion } from "framer-motion";
import BentoCard from "@/components/ui/BentoCard";
import Link from "next/link";

const SERVICES = [
  {
    icon: "☕",
    title: "Cafe & Restaurant Systems",
    description:
      "Full digital presence — menu site, online reservations, daily log dashboard, and analytics for owners.",
    tag: "Most popular",
    tagColor: "text-accent-cyan border-accent-cyan/30",
    demo: "https://the-detoxclub.netlify.app/",
  },
  {
    icon: "👕",
    title: "Clothing Brand Storefronts",
    description:
      "Product showcase, WhatsApp checkout engine, size/color ordering — no payment gateway needed.",
    tag: "WhatsApp checkout",
    tagColor: "text-green-400 border-green-400/30",
    demo: "https://bspokeclo.netlify.app/",
  },
  {
    icon: "📊",
    title: "Owner Dashboards",
    description:
      "Every site comes with a custom admin panel — manage menu, products, reservations, gallery, and settings.",
    tag: "Included with every project",
    tagColor: "text-purple-400 border-purple-400/30",
    demo: null,
  },
  {
    icon: "🛍️",
    title: "Boutiques & Local Brands",
    description:
      "Brand-forward storefronts for boutiques, salons, and local businesses. Built to convert visitors.",
    tag: "Custom design",
    tagColor: "text-amber-400 border-amber-400/30",
    demo: null,
  },
];

const STACK = [
  "Next.js", "React", "TypeScript", "TailwindCSS",
  "Firebase", "Framer Motion", "Cloudinary", "WhatsApp API",
];

export default function ServicesSection() {
  return (
    <section className="py-24 max-w-6xl mx-auto px-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-12"
      >
        <p className="font-mono text-xs text-accent-cyan tracking-widest uppercase mb-3">
          What I build
        </p>
        <h2 className="font-display text-3xl sm:text-4xl font-bold text-text-primary">
          Complete systems, not just websites.
        </h2>
        <p className="text-text-secondary mt-3 max-w-xl">
          Every project includes a customer-facing site AND a private owner dashboard.
          One developer, full solution.
        </p>
      </motion.div>

      {/* Bento Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Large card — first service */}
        <BentoCard className="lg:col-span-2 lg:row-span-1" delay={0.1}>
          <div className="flex flex-col h-full gap-4">
            <span className="text-4xl">{SERVICES[0].icon}</span>
            <div>
              <p className={`font-mono text-xs border rounded-full px-2 py-0.5 w-fit mb-2 ${SERVICES[0].tagColor}`}>
                {SERVICES[0].tag}
              </p>
              <h3 className="font-display text-xl font-bold text-text-primary mb-2">
                {SERVICES[0].title}
              </h3>
              <p className="text-text-secondary text-sm leading-relaxed">
                {SERVICES[0].description}
              </p>
            </div>
            {SERVICES[0].demo && (
              <a
                href={SERVICES[0].demo}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 font-mono text-xs text-accent-cyan hover:underline mt-auto w-fit"
              >
                View live demo →
              </a>
            )}
          </div>
        </BentoCard>

        {/* Small cards */}
        {SERVICES.slice(1).map((service, i) => (
          <BentoCard key={service.title} delay={0.15 * (i + 2)}>
            <div className="flex flex-col gap-3 h-full">
              <span className="text-3xl">{service.icon}</span>
              <p className={`font-mono text-xs border rounded-full px-2 py-0.5 w-fit ${service.tagColor}`}>
                {service.tag}
              </p>
              <h3 className="font-display text-lg font-bold text-text-primary">
                {service.title}
              </h3>
              <p className="text-text-secondary text-sm leading-relaxed">
                {service.description}
              </p>
              {service.demo && (
                <a
                  href={service.demo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-xs text-accent-cyan hover:underline mt-auto w-fit"
                >
                  View live demo →
                </a>
              )}
            </div>
          </BentoCard>
        ))}

        {/* Tech stack card */}
        <BentoCard className="lg:col-span-3" delay={0.5} glowOnHover={false}>
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <p className="font-mono text-xs text-text-muted whitespace-nowrap">
              Built with →
            </p>
            <div className="flex flex-wrap gap-2">
              {STACK.map((tech) => (
                <span
                  key={tech}
                  className="font-mono text-xs text-text-secondary border border-border px-3 py-1 rounded-full"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </BentoCard>
      </div>

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.3 }}
        className="mt-12 flex justify-center"
      >
        <Link
          href="/work"
          className="font-mono text-sm text-text-secondary hover:text-accent-cyan transition-colors flex items-center gap-2"
        >
          See all case studies
          <span className="text-accent-cyan">→</span>
        </Link>
      </motion.div>
    </section>
  );
}
