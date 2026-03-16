"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { SiteConfig, ContactConfig } from "@/types";

// ─── Default values (fallbacks before Firestore loads) ────────────────────────

const DEFAULT_SITE: SiteConfig = {
  name: "nishancreates",
  title: "Full-Stack Architect & Business Solutions Developer",
  bio: "I build complete digital systems for local businesses — from customer-facing storefronts to owner dashboards. Based in Nepal, working globally.",
  taglines: [
  "I build systems for cafes.",
  "I build storefronts for clothing brands.",
  "I turn WhatsApp into a checkout engine.",
  "I build dashboards for restaurant owners.",
],
projectsTaglines: ["10+ delivered", "Web apps & dashboards", "Cafes, clothing & restaurants"],
yearsTaglines: ["2+ years", "Professional full-stack", "Nepal → Global"],
  profileImage: "/profile.jpg",
  heroCtaPrimary: "View Work",
  heroCtaSecondary: "Start a Project",
  availableForWork: true,
  yearsExperience: 3,
  projectsCompleted: 10,
};

const DEFAULT_CONTACT: ContactConfig = {
  whatsapp: "9779848303515",
  email: "nishanrokaya535@gmail.com",
  github: "https://github.com/nishancreates",
  linkedin: "https://www.linkedin.com/in/nishan-kumar-rokaya/",
  whatsappMessage:
    "Hello Nishan! 👋 I found your portfolio and I'd like to discuss a project.",
};

// ─── Context type ─────────────────────────────────────────────────────────────

interface GlobalContextType {
  siteConfig: SiteConfig;
  contactConfig: ContactConfig;
  isLoading: boolean;
}

const GlobalContext = createContext<GlobalContextType>({
  siteConfig: DEFAULT_SITE,
  contactConfig: DEFAULT_CONTACT,
  isLoading: true,
});

// ─── Provider ─────────────────────────────────────────────────────────────────

export function GlobalProvider({ children }: { children: ReactNode }) {
  const [siteConfig, setSiteConfig] = useState<SiteConfig>(DEFAULT_SITE);
  const [contactConfig, setContactConfig] =
    useState<ContactConfig>(DEFAULT_CONTACT);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Listen to site config
    const unsubSite = onSnapshot(
      doc(db, "config", "site"),
      (snap) => {
        if (snap.exists()) {
          setSiteConfig({ ...DEFAULT_SITE, ...snap.data() } as SiteConfig);
        }
        setIsLoading(false);
      },
      () => setIsLoading(false)
    );

    // Listen to contact config
    const unsubContact = onSnapshot(
      doc(db, "config", "contact"),
      (snap) => {
        if (snap.exists()) {
          setContactConfig({
            ...DEFAULT_CONTACT,
            ...snap.data(),
          } as ContactConfig);
        }
      },
      () => {}
    );

    return () => {
      unsubSite();
      unsubContact();
    };
  }, []);

  return (
    <GlobalContext.Provider value={{ siteConfig, contactConfig, isLoading }}>
      {children}
    </GlobalContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useGlobalConfig() {
  return useContext(GlobalContext);
}
