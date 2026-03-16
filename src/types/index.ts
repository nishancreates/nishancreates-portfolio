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
export interface GalleryItem {
  id: string;
  title: string;
  category: string;
  images: string[];
  isPreview: boolean;
  liveUrl?: string;
  order: number;
  createdAt: string;
}
export interface Testimonial {
  id: string;
  clientName: string;
  businessName: string;
  businessType: string;
  text: string;
  videoUrl?: string;
  rating: number;
  avatarUrl?: string;
  order: number;
  createdAt: string;
}
export interface ContactConfig {
  whatsapp: string;
  email: string;
  github: string;
  linkedin: string;
  whatsappMessage: string;
}
export interface SiteConfig {
  name: string;
  title: string;
  bio: string;
  taglines: string[];
  projectsTaglines: string[];
  yearsTaglines: string[];
  profileImage: string;
  heroCtaPrimary: string;
  heroCtaSecondary: string;
  availableForWork: boolean;
  yearsExperience: number;
  projectsCompleted: number;
}
export interface Skill {
  id: string;
  name: string;
  category: string;
  icon?: string;
  level: number;
}
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
export interface AdminUser {
  uid: string;
  email: string | null;
}
