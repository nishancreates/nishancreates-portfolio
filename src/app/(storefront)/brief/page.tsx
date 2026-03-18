"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { BriefData } from "@/types";
import { generateContactLink } from "@/lib/whatsapp";

// ─── Step definitions ─────────────────────────────────────────────────────────

const PAGES_OPTIONS = [
  "Home", "About", "Menu / Products", "Services", "Gallery",
  "Events", "Reservations", "Contact", "Blog", "FAQ",
];

const HOMEPAGE_OPTIONS = [
  "Hero / Banner", "About snippet", "Featured products", "Testimonials",
  "Services overview", "Gallery preview", "CTA / WhatsApp button", "Map / Location",
];

const DASHBOARD_OPTIONS = [
  "Analytics & sales", "Menu / Product manager", "Reservation manager",
  "Gallery manager", "Blog / News manager", "Daily log", "Lead management",
  "Settings & config editor",
];

const INTEGRATION_OPTIONS = [
  "WhatsApp checkout", "Google Maps", "Instagram feed",
  "Facebook page", "Custom domain", "SEO setup",
];

// ─── Types ────────────────────────────────────────────────────────────────────

interface FormState {
  name: string;
  whatsapp: string;
  businessType: string;
  brief: BriefData;
}

const EMPTY_FORM: FormState = {
  name: "",
  whatsapp: "",
  businessType: "",
  brief: {},
};

// ─── Main component ───────────────────────────────────────────────────────────

export default function BriefPage() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const totalSteps = 7;

  function updateBrief(key: keyof BriefData, value: unknown) {
    setForm((f) => ({ ...f, brief: { ...f.brief, [key]: value } }));
  }

  function toggleArray(key: keyof BriefData, value: string) {
    const current = (form.brief[key] as string[]) || [];
    const updated = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];
    updateBrief(key, updated);
  }

  async function handleSubmit() {
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/submit-brief", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          whatsapp: form.whatsapp,
          businessType: form.businessType,
          briefData: form.brief,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setSubmitted(true);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Something went wrong.";
      setError(message || "Something went wrong. Please try WhatsApp instead.");
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) return <SuccessScreen name={form.name} whatsapp={form.whatsapp} />;

  return (
    <div className="min-h-screen pt-24 pb-20 max-w-2xl mx-auto px-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10"
      >
        <p className="font-mono text-xs text-accent-cyan tracking-widest uppercase mb-3">
          Project brief
        </p>
        <h1 className="font-display text-3xl sm:text-4xl font-bold text-text-primary mb-2">
          Tell me about your project.
        </h1>
        <p className="text-text-secondary">
          Takes about 3 minutes. I&apos;ll come back with a custom quote.
        </p>
      </motion.div>

      {/* Progress bar */}
      <div className="mb-8">
        <div className="flex justify-between mb-2">
          <span className="font-mono text-xs text-text-muted">
            Step {step + 1} of {totalSteps}
          </span>
          <span className="font-mono text-xs text-text-muted">
            {Math.round(((step + 1) / totalSteps) * 100)}%
          </span>
        </div>
        <div className="h-1 bg-border rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-accent-cyan rounded-full"
            animate={{ width: `${((step + 1) / totalSteps) * 100}%` }}
            transition={{ duration: 0.4 }}
          />
        </div>
      </div>

      {/* Steps */}
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          {step === 0 && (
            <Step title="Who are you?" subtitle="Your contact details">
              <Field label="Your name" required>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  placeholder="e.g. Ram Bahadur"
                  className={inputClass}
                />
              </Field>
              <Field label="WhatsApp number" required>
                <input
                  type="tel"
                  value={form.whatsapp}
                  onChange={(e) => setForm((f) => ({ ...f, whatsapp: e.target.value }))}
                  placeholder="e.g. +977 98XXXXXXXX"
                  className={inputClass}
                />
              </Field>
              <Field label="Type of business" required>
                <select
                  value={form.businessType}
                  onChange={(e) => setForm((f) => ({ ...f, businessType: e.target.value }))}
                  className={inputClass}
                >
                  <option value="">Select one...</option>
                  {["Cafe", "Restaurant", "Clothing brand", "Boutique", "Salon", "Gym", "Other"].map((o) => (
                    <option key={o} value={o}>{o}</option>
                  ))}
                </select>
              </Field>
            </Step>
          )}

          {step === 1 && (
            <Step title="Business identity" subtitle="Tell me about your brand">
              <Field label="Business name">
                <input
                  type="text"
                  value={form.brief.businessName || ""}
                  onChange={(e) => updateBrief("businessName", e.target.value)}
                  placeholder="e.g. The Coffee House"
                  className={inputClass}
                />
              </Field>
              <Field label="Describe your business">
                <textarea
                  value={form.brief.businessDescription || ""}
                  onChange={(e) => updateBrief("businessDescription", e.target.value)}
                  placeholder="What do you sell? Who are your customers? What makes you different?"
                  rows={4}
                  className={inputClass}
                />
              </Field>
              <Field label="Target audience">
                <input
                  type="text"
                  value={form.brief.targetAudience || ""}
                  onChange={(e) => updateBrief("targetAudience", e.target.value)}
                  placeholder="e.g. Young professionals, students, families..."
                  className={inputClass}
                />
              </Field>
            </Step>
          )}

          {step === 2 && (
            <Step title="Brand & design" subtitle="How should it look and feel?">
              <Field label="Preferred colors">
                <input
                  type="text"
                  value={form.brief.preferredColors || ""}
                  onChange={(e) => updateBrief("preferredColors", e.target.value)}
                  placeholder="e.g. Dark green and cream, black and gold..."
                  className={inputClass}
                />
              </Field>
              <Field label="Design style">
                <select
                  value={form.brief.designStyle || ""}
                  onChange={(e) => updateBrief("designStyle", e.target.value)}
                  className={inputClass}
                >
                  <option value="">Select one...</option>
                  {["Minimal & clean", "Bold & modern", "Elegant & luxury", "Playful & colorful", "Rustic & natural", "Dark & moody"].map((o) => (
                    <option key={o} value={o}>{o}</option>
                  ))}
                </select>
              </Field>
              <Field label="Reference websites (optional)">
                <input
                  type="text"
                  value={form.brief.referenceUrls || ""}
                  onChange={(e) => updateBrief("referenceUrls", e.target.value)}
                  placeholder="Paste URLs you like the look of..."
                  className={inputClass}
                />
              </Field>
            </Step>
          )}

          {step === 3 && (
            <Step title="Pages needed" subtitle="Which pages do you want on your site?">
              <CheckboxGrid
                options={PAGES_OPTIONS}
                selected={(form.brief.pages as string[]) || []}
                onToggle={(v) => toggleArray("pages", v)}
              />
            </Step>
          )}

          {step === 4 && (
            <Step title="Products & services" subtitle="What are you selling?">
              <Field label="Describe your products or menu items">
                <textarea
                  value={form.brief.productsDescription || ""}
                  onChange={(e) => updateBrief("productsDescription", e.target.value)}
                  placeholder="e.g. Coffee drinks Rs.150-350, pastries Rs.80-200, lunch specials..."
                  rows={4}
                  className={inputClass}
                />
              </Field>
              <Field label="Homepage sections you want">
                <div className="mt-2">
                  <CheckboxGrid
                    options={HOMEPAGE_OPTIONS}
                    selected={(form.brief.homepageSections as string[]) || []}
                    onToggle={(v) => toggleArray("homepageSections", v)}
                  />
                </div>
              </Field>
            </Step>
          )}

          {step === 5 && (
            <Step title="Dashboard features" subtitle="What do you want to manage yourself?">
              <CheckboxGrid
                options={DASHBOARD_OPTIONS}
                selected={(form.brief.dashboardFeatures as string[]) || []}
                onToggle={(v) => toggleArray("dashboardFeatures", v)}
              />
            </Step>
          )}

          {step === 6 && (
            <Step title="Final details" subtitle="Almost done!">
              <Field label="Integrations needed">
                <div className="mt-2">
                  <CheckboxGrid
                    options={INTEGRATION_OPTIONS}
                    selected={(form.brief.integrations as string[]) || []}
                    onToggle={(v) => toggleArray("integrations", v)}
                  />
                </div>
              </Field>
              <Field label="Budget range (optional)">
                <select
                  value={form.brief.budget || ""}
                  onChange={(e) => updateBrief("budget", e.target.value)}
                  className={inputClass}
                >
                  <option value="">Prefer to discuss</option>
                  {["Under Rs. 15,000", "Rs. 15,000 – 30,000", "Rs. 30,000 – 60,000", "Rs. 60,000+"].map((o) => (
                    <option key={o} value={o}>{o}</option>
                  ))}
                </select>
              </Field>
              <Field label="Timeline">
                <select
                  value={form.brief.timeline || ""}
                  onChange={(e) => updateBrief("timeline", e.target.value)}
                  className={inputClass}
                >
                  <option value="">Flexible</option>
                  {["ASAP", "Within 2 weeks", "Within a month", "1–3 months"].map((o) => (
                    <option key={o} value={o}>{o}</option>
                  ))}
                </select>
              </Field>
              <Field label="Anything else?">
                <textarea
                  value={form.brief.additionalNotes || ""}
                  onChange={(e) => updateBrief("additionalNotes", e.target.value)}
                  placeholder="Any other details, questions, or special requirements..."
                  rows={3}
                  className={inputClass}
                />
              </Field>
              {error && (
                <p className="text-red-400 text-sm font-mono">{error}</p>
              )}
            </Step>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className="flex justify-between mt-8">
        <button
          onClick={() => setStep((s) => Math.max(0, s - 1))}
          disabled={step === 0}
          className="px-5 py-2.5 font-mono text-sm border border-border rounded-btn text-text-secondary hover:text-text-primary hover:border-border-strong transition-all disabled:opacity-30 disabled:cursor-not-allowed"
        >
          ← Back
        </button>

        {step < totalSteps - 1 ? (
          <button
            onClick={() => setStep((s) => s + 1)}
            disabled={step === 0 && (!form.name || !form.whatsapp || !form.businessType)}
            className="px-6 py-2.5 font-mono text-sm bg-accent-cyan text-bg-primary rounded-btn font-bold hover:bg-accent-cyan-dim transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Continue →
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="px-6 py-2.5 font-mono text-sm bg-accent-cyan text-bg-primary rounded-btn font-bold hover:bg-accent-cyan-dim transition-all disabled:opacity-40"
          >
            {submitting ? "Sending..." : "Submit brief →"}
          </button>
        )}
      </div>
    </div>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function Step({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="font-display text-2xl font-bold text-text-primary mb-1">{title}</h2>
      <p className="text-text-secondary text-sm mb-6">{subtitle}</p>
      <div className="flex flex-col gap-5">{children}</div>
    </div>
  );
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <label className="block font-mono text-xs text-text-secondary mb-2 uppercase tracking-wider">
        {label} {required && <span className="text-accent-cyan">*</span>}
      </label>
      {children}
    </div>
  );
}

function CheckboxGrid({ options, selected, onToggle }: {
  options: string[];
  selected: string[];
  onToggle: (v: string) => void;
}) {
  return (
    <div className="grid grid-cols-2 gap-2">
      {options.map((opt) => (
        <button
          key={opt}
          type="button"
          onClick={() => onToggle(opt)}
          className={`text-left px-3 py-2.5 rounded-btn border font-mono text-xs transition-all ${
            selected.includes(opt)
              ? "border-accent-cyan bg-accent-cyan/10 text-accent-cyan"
              : "border-border text-text-secondary hover:border-border-strong hover:text-text-primary"
          }`}
        >
          {selected.includes(opt) ? "✓ " : ""}{opt}
        </button>
      ))}
    </div>
  );
}

function SuccessScreen({ name, whatsapp }: { name: string; whatsapp: string }) {
  const waLink = generateContactLink(
    `Hello Nishan! 👋 I just filled out your project brief. My name is ${name} and I'd love to discuss my project with you!`
  );

  return (
    <div className="min-h-screen pt-24 pb-20 max-w-lg mx-auto px-6 flex flex-col items-center justify-center text-center">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", duration: 0.5 }}
      >
        <div className="w-20 h-20 rounded-full bg-accent-cyan/10 border border-accent-cyan/30 flex items-center justify-center mx-auto mb-6">
          <span className="text-4xl">✓</span>
        </div>
        <h2 className="font-display text-3xl font-bold text-text-primary mb-3">
          Brief received, {name}!
        </h2>
        <p className="text-text-secondary mb-8">
          I&apos;ll review your project and get back to you on WhatsApp within 24 hours with availability and a custom quote.
        </p>
        <a
          href={waLink}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-6 py-3 bg-[#25D366] text-white rounded-btn font-mono text-sm font-bold hover:opacity-90 transition-all"
        >
          Follow up on WhatsApp →
        </a>
      </motion.div>
    </div>
  );
}

const inputClass =
  "w-full bg-bg-card border border-border rounded-btn px-4 py-3 text-text-primary font-mono text-sm placeholder:text-text-muted focus:outline-none focus:border-accent-cyan/50 transition-colors";
