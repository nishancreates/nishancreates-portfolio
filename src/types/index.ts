// ─── Project Types ───────────────────────────────────────────────────────────

export interface ProjectView {
  image: string;
  description: string;
  features: string[];
}

export interface Project {
  id: string;
  businessName: string;
  category: string; // "cafe" | "clothing" | "restaurant" | "boutique" | "other"
  problem: string;
  solution: string;
  result: string;
  liveUrl: string;
  githubUrl?: string;
  whatsappNumber?: string;
  customerView: ProjectView;
  adminView: ProjectView;
  techStack: string[];
  featured: boolean;
  order: number;
  createdAt: string;
}

// ─── Contact / Config Types ───────────────────────────────────────────────────

export interface ContactConfig {
  whatsapp: string;
  email: string;
  github: string;
  linkedin: string;
  whatsappMessage: string; // default pre-filled WA message
}

// ─── Bio / Profile Types ──────────────────────────────────────────────────────

export interface SiteConfig {
  name: string;
  title: string;
  bio: string;
  taglines: string[]; // typewriter lines
  profileImage: string;
  heroCtaPrimary: string;
  heroCtaSecondary: string;
  availableForWork: boolean;
  yearsExperience: number;
  projectsCompleted: number;
}

// ─── Skills Types ─────────────────────────────────────────────────────────────

export interface Skill {
  id: string;
  name: string;
  category: string; // "frontend" | "backend" | "tools" | "design"
  icon?: string;
  level: number; // 1–5
}

// ─── Lead / Brief Types ───────────────────────────────────────────────────────

export interface Lead {
  id: string;
  name: string;
  whatsapp: string;
  businessType: string;
  briefData: BriefData;
  createdAt: string;
  status: "new" | "contacted" | "closed";
}

export interface BriefData {
  // Step 1: Business Identity
  businessName?: string;
  businessDescription?: string;
  targetAudience?: string;

  // Step 2: Brand Design
  preferredColors?: string;
  designStyle?: string;
  referenceUrls?: string;

  // Step 3: Pages Needed
  pages?: string[];

  // Step 4: Homepage Sections
  homepageSections?: string[];

  // Step 5: Products / Services
  productsDescription?: string;
  priceRange?: string;

  // Step 6: Dashboard Features
  dashboardFeatures?: string[];

  // Step 7: Integrations
  integrations?: string[];

  // Extra
  additionalNotes?: string;
  budget?: string;
  timeline?: string;
}

// ─── Admin Auth ───────────────────────────────────────────────────────────────

export interface AdminUser {
  uid: string;
  email: string | null;
}
