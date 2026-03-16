// ─── Project Types ───────────────────────────────────────────────────────────
export interface ProjectView {
  image: string;
  description: string;
  features: string[];
}
export interface Project {
  id: string;
  businessName: string;
  category: string;
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

// ─── Gallery Types ────────────────────────────────────────────────────────────
export interface GalleryItem {
  id: string;
  title: string;
  category: string;
  images: string[]; // multiple images supported
  isPreview: boolean; // true = "Preview" badge, no live link
  liveUrl?: string;
  order: number;
  createdAt: string;
}

// ─── Testimonial Types ────────────────────────────────────────────────────────
export interface Testimonial {
  id: string;
  clientName: string;
  businessName: string;
  businessType: string;
  text: string; // written review
  videoUrl?: string; // YouTube or Vimeo embed URL
  rating: number; // 1-5
  avatarUrl?: string;
  order: number;
  createdAt: string;
}

// ─── Contact / Config Types ───────────────────────────────────────────────────
export interface ContactConfig {
  whatsapp: string;
  email: string;
  github: string;
  linkedin: string;
  whatsappMessage: string;
}

// ─── Bio / Profile Types ──────────────────────────────────────────────────────
export interface SiteConfig {
  name: string;
  title: string;
  bio: string;
  taglines: string[];
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
  category: string;
  icon?: string;
  level: number;
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
  businessName?: string;
  businessDescription?: string;
  targetAudience?: string;
  preferredColors?: string;
  designStyle?: string;
  referenceUrls?: string;
  pages?: string[];
  homepageSections?: string[];
  productsDescription?: string;
  priceRange?: string;
  dashboardFeatures?: string[];
  integrations?: string[];
  additionalNotes?: string;
  budget?: string;
  timeline?: string;
}

// ─── Admin Auth ───────────────────────────────────────────────────────────────
export interface AdminUser {
  uid: string;
  email: string | null;
}
