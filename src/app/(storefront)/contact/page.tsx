"use client";

import { motion } from "framer-motion";
import { useGlobalConfig } from "@/context/GlobalContext";
import { generateContactLink } from "@/lib/whatsapp";
import MagneticButton from "@/components/ui/MagneticButton";

export default function ContactPage() {
  const { siteConfig, contactConfig } = useGlobalConfig();
  const waLink = generateContactLink(contactConfig.whatsappMessage);

  const fadeUp = (delay = 0) => ({
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.5, delay },
  });

  return (
    <div className="min-h-screen pt-24 pb-20 max-w-6xl mx-auto px-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-16 text-center"
      >
        <p className="font-mono text-xs text-accent-cyan tracking-widest uppercase mb-3">
          Contact
        </p>
        <h1 className="font-display text-4xl sm:text-5xl font-bold text-text-primary mb-4">
          Let&apos;s build something.
        </h1>
        <p className="text-text-secondary max-w-lg mx-auto text-lg">
          Have a project in mind? The fastest way to reach me is WhatsApp.
          I respond within a few hours.
        </p>
      </motion.div>

      {/* Contact cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto mb-16">
        {/* WhatsApp — primary */}
        <motion.a
          {...fadeUp(0.1)}
          href={waLink}
          target="_blank"
          rel="noopener noreferrer"
          className="group relative overflow-hidden bg-bg-card border border-[#25D366]/30 rounded-card p-8 hover:border-[#25D366]/60 transition-all cursor-pointer block"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#25D366]/5 rounded-full blur-2xl" />
          <div className="relative">
            <div className="w-12 h-12 rounded-xl bg-[#25D366]/10 border border-[#25D366]/20 flex items-center justify-center mb-4">
              <WhatsAppIcon className="text-[#25D366]" />
            </div>
            <p className="font-mono text-xs text-[#25D366] mb-1 uppercase tracking-wider">
              Fastest response
            </p>
            <h3 className="font-display text-xl font-bold text-text-primary mb-2">
              WhatsApp
            </h3>
            <p className="text-text-secondary text-sm mb-4">
              Send me a message directly. I&apos;ll respond within a few hours with availability and pricing.
            </p>
            <p className="font-mono text-sm text-[#25D366] group-hover:underline">
              +977 {contactConfig.whatsapp.replace("977", "")} →
            </p>
          </div>
        </motion.a>

        {/* Email — secondary */}
        <motion.a
          {...fadeUp(0.2)}
          href={`mailto:${contactConfig.email}`}
          className="group relative overflow-hidden bg-bg-card border border-border rounded-card p-8 hover:border-accent-cyan/30 transition-all cursor-pointer block"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-accent-cyan/5 rounded-full blur-2xl" />
          <div className="relative">
            <div className="w-12 h-12 rounded-xl bg-accent-cyan/10 border border-accent-cyan/20 flex items-center justify-center mb-4">
              <MailIcon className="text-accent-cyan" />
            </div>
            <p className="font-mono text-xs text-accent-cyan mb-1 uppercase tracking-wider">
              For detailed briefs
            </p>
            <h3 className="font-display text-xl font-bold text-text-primary mb-2">
              Email
            </h3>
            <p className="text-text-secondary text-sm mb-4">
              Prefer email? Send me your project details and I&apos;ll get back to you.
            </p>
            <p className="font-mono text-sm text-accent-cyan group-hover:underline break-all">
              {contactConfig.email} →
            </p>
          </div>
        </motion.a>
      </div>

      {/* Social links */}
      <motion.div
        {...fadeUp(0.3)}
        className="flex justify-center gap-4 mb-16"
      >
        <a
          href={contactConfig.github}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-5 py-2.5 bg-bg-card border border-border rounded-btn font-mono text-sm text-text-secondary hover:text-text-primary hover:border-border-strong transition-all"
        >
          <GitHubIcon /> GitHub
        </a>
        <a
          href={contactConfig.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-5 py-2.5 bg-bg-card border border-border rounded-btn font-mono text-sm text-text-secondary hover:text-[#0A66C2] hover:border-[#0A66C2]/40 transition-all"
        >
          <LinkedInIcon /> LinkedIn
        </a>
      </motion.div>

      {/* Brief form CTA */}
      <motion.div
        {...fadeUp(0.4)}
        className="relative overflow-hidden bg-bg-card border border-accent-cyan/20 rounded-card p-10 text-center max-w-2xl mx-auto"
      >
        <div className="absolute inset-0 bg-cyan-gradient opacity-30 pointer-events-none" />
        <div className="relative">
          <p className="font-mono text-xs text-accent-cyan tracking-widest uppercase mb-3">
            Know what you want?
          </p>
          <h2 className="font-display text-2xl font-bold text-text-primary mb-3">
            Fill out the project brief
          </h2>
          <p className="text-text-secondary text-sm mb-6 max-w-md mx-auto">
            Answer a few questions about your business and what you need.
            Takes 3 minutes. I&apos;ll come back with a custom quote.
          </p>
          <MagneticButton variant="primary" href="/brief">
            Start the brief →
          </MagneticButton>
        </div>
      </motion.div>
    </div>
  );
}

function WhatsAppIcon({ className = "" }: { className?: string }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

function MailIcon({ className = "" }: { className?: string }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m2 7 10 7 10-7" />
    </svg>
  );
}

function GitHubIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}
