/**
 * SEED SCRIPT — Run once to populate Firestore with default data
 * 
 * Usage: node scripts/seed.mjs
 * (Run from project root after npm install)
 * 
 * Or manually paste each block into Firebase Console → Firestore
 */

// ─── config/site ─────────────────────────────────────────────────────────────
// Collection: config  |  Document ID: site

const SITE_CONFIG = {
  name: "nishancreates",
  title: "Full-Stack Architect & Business Solutions Developer",
  bio: "I build complete digital systems for local businesses — from customer-facing storefronts to owner dashboards. Based in Nepal, working globally.",
  taglines: [
    "I build systems for cafes.",
    "I build storefronts for clothing brands.",
    "I turn WhatsApp into a checkout engine.",
    "I build dashboards for restaurant owners.",
  ],
  profileImage: "/profile.jpg",
  heroCtaPrimary: "View Work",
  heroCtaSecondary: "Start a Project",
  availableForWork: true,
  yearsExperience: 3,
  projectsCompleted: 10,
};

// ─── config/contact ───────────────────────────────────────────────────────────
// Collection: config  |  Document ID: contact

const CONTACT_CONFIG = {
  whatsapp: "9779848303515",
  email: "nishanrokaya535@gmail.com",
  github: "https://github.com/nishancreates",
  linkedin: "https://www.linkedin.com/in/nishan-kumar-rokaya/",
  whatsappMessage: "Hello Nishan! 👋 I found your portfolio and I'd like to discuss a project.",
};

// ─── skills (collection) ─────────────────────────────────────────────────────
// Collection: skills  |  Auto-generated document IDs

const SKILLS = [
  { name: "Next.js",        category: "frontend", level: 5 },
  { name: "React",          category: "frontend", level: 5 },
  { name: "TypeScript",     category: "frontend", level: 4 },
  { name: "TailwindCSS",    category: "frontend", level: 5 },
  { name: "Framer Motion",  category: "frontend", level: 4 },
  { name: "Firebase",       category: "backend",  level: 5 },
  { name: "Firestore",      category: "backend",  level: 5 },
  { name: "Node.js",        category: "backend",  level: 3 },
  { name: "REST APIs",      category: "backend",  level: 4 },
  { name: "Git & GitHub",   category: "tools",    level: 5 },
  { name: "Cloudinary",     category: "tools",    level: 4 },
  { name: "Netlify",        category: "tools",    level: 5 },
  { name: "Figma",          category: "design",   level: 3 },
  { name: "UI/UX Design",   category: "design",   level: 4 },
];

// ─── HOW TO SEED MANUALLY ─────────────────────────────────────────────────────
/*
  1. Go to Firebase Console → Firestore Database → Start collection
  
  2. Create collection "config":
     - Add document with ID "site" → paste SITE_CONFIG fields
     - Add document with ID "contact" → paste CONTACT_CONFIG fields
  
  3. Create collection "skills":
     - Add each skill from SKILLS array as a document (auto-ID)
  
  4. Projects are added from your admin dashboard at /admin/projects
  
  5. Leads are created automatically when someone fills the brief form
*/

console.log("Seed data reference — paste into Firestore manually or via Firebase Admin SDK");
console.log("\nSITE_CONFIG:", JSON.stringify(SITE_CONFIG, null, 2));
console.log("\nCONTACT_CONFIG:", JSON.stringify(CONTACT_CONFIG, null, 2));
console.log("\nSKILLS:", JSON.stringify(SKILLS, null, 2));
