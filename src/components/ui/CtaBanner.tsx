"use client";

import { motion } from "framer-motion";
import MagneticButton from "@/components/ui/MagneticButton";
import { generateStartProjectLink } from "@/lib/whatsapp";
import Link from "next/link";

export default function CtaBanner() {
  const waLink = generateStartProjectLink();

  return (
    <section className="py-24 max-w-6xl mx-auto px-6">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="relative overflow-hidden rounded-card border border-accent-cyan/20 bg-bg-card p-12 text-center"
      >
        {/* Background glow */}
        <div className="absolute inset-0 bg-cyan-gradient opacity-50 pointer-events-none" />
        <div className="absolute top-0 right-0 w-64 h-64 bg-accent-cyan/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative">
          <p className="font-mono text-xs text-accent-cyan tracking-widest uppercase mb-4">
            Ready to build?
          </p>
          <h2 className="font-display text-3xl sm:text-5xl font-bold text-text-primary mb-4">
            Your business deserves
            <br />
            <span className="text-accent-cyan">a proper system.</span>
          </h2>
          <p className="text-text-secondary max-w-lg mx-auto mb-8">
            Not just a website. A complete digital operation — storefront, dashboard,
            and everything in between. Let&apos;s talk about yours.
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <MagneticButton
              variant="primary"
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              Start on WhatsApp
            </MagneticButton>
            <MagneticButton variant="outline" href="/brief">
              Fill out the brief →
            </MagneticButton>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
