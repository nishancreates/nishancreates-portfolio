# nishancreates — Setup & Deployment Guide

## What you have

A full Next.js 14 portfolio with:
- Public storefront (Home, Work, About, Contact, Brief form)
- Admin dashboard (Projects, Site config, Skills, Leads, Contacts)
- Firebase Firestore for all data (live updates, no refresh needed)
- Cloudinary for image uploads
- WhatsApp as the only contact/checkout channel
- Hidden admin entry at the bottom of every page footer

---

## Step 1 — Folder setup

Unzip all 4 phase ZIPs into the same folder. Final structure:

```
nishancreates/
├── src/
│   ├── app/
│   │   ├── (storefront)/     ← public pages
│   │   ├── admin/            ← dashboard
│   │   └── layout.tsx
│   ├── components/
│   ├── hooks/
│   ├── lib/
│   ├── context/
│   └── types/
├── public/
│   └── profile.jpg           ← ADD YOUR MANGA AVATAR HERE
├── scripts/
│   └── seed.mjs
├── .env.local                ← your real credentials
├── netlify.toml
├── package.json
└── firestore.rules
```

---

## Step 2 — Add your profile image

Copy your manga avatar image to:
```
public/profile.jpg
```

---

## Step 3 — Verify .env.local

Your `.env.local` should already contain all real values.
Only one thing to confirm — your Cloudinary upload preset:

```
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=nishancreates
```

Make sure this preset exists in Cloudinary as **Unsigned**.

---

## Step 4 — Firestore security rules

1. Go to Firebase Console → Firestore Database → Rules tab
2. Replace all existing rules with the content of `firestore.rules`
3. Click Publish

---

## Step 5 — Seed initial Firestore data

Go to Firebase Console → Firestore → create these manually:

### Collection: `config`

**Document ID: `site`**
```
name: "nishancreates"
title: "Full-Stack Architect & Business Solutions Developer"
bio: "I build complete digital systems for local businesses..."
taglines: ["I build systems for cafes.", "I build storefronts for clothing brands.", "I turn WhatsApp into a checkout engine.", "I build dashboards for restaurant owners."]
profileImage: "/profile.jpg"
heroCtaPrimary: "View Work"
heroCtaSecondary: "Start a Project"
availableForWork: true
yearsExperience: 3
projectsCompleted: 10
```

**Document ID: `contact`**
```
whatsapp: "9779848303515"
email: "nishanrokaya535@gmail.com"
github: "https://github.com/nishancreates"
linkedin: "https://www.linkedin.com/in/nishan-kumar-rokaya/"
whatsappMessage: "Hello Nishan! 👋 I found your portfolio and I'd like to discuss a project."
```

### Collection: `skills`

Add each skill as a document (auto-ID):
```
{ name: "Next.js",       category: "frontend", level: 5 }
{ name: "React",         category: "frontend", level: 5 }
{ name: "TypeScript",    category: "frontend", level: 4 }
{ name: "TailwindCSS",   category: "frontend", level: 5 }
{ name: "Framer Motion", category: "frontend", level: 4 }
{ name: "Firebase",      category: "backend",  level: 5 }
{ name: "Firestore",     category: "backend",  level: 5 }
{ name: "Node.js",       category: "backend",  level: 3 }
{ name: "REST APIs",     category: "backend",  level: 4 }
{ name: "Git & GitHub",  category: "tools",    level: 5 }
{ name: "Cloudinary",    category: "tools",    level: 4 }
{ name: "Netlify",       category: "tools",    level: 5 }
{ name: "Figma",         category: "design",   level: 3 }
{ name: "UI/UX Design",  category: "design",   level: 4 }
```

---

## Step 6 — Run locally

```bash
cd nishancreates
npm install
npm run dev
```

Open http://localhost:3000

Admin panel: http://localhost:3000/admin/login
Login with: nishanrokaya535@gmail.com + your password

---

## Step 7 — Deploy to Netlify

### Option A — Netlify CLI (recommended)

```bash
npm install -g netlify-cli
netlify login
netlify init
netlify deploy --prod
```

### Option B — Netlify Dashboard

1. Push your repo to GitHub (without .env.local — it's in .gitignore)
2. Go to netlify.com → New site from Git
3. Select your repo
4. Build settings are auto-detected from netlify.toml
5. Go to Site settings → Environment variables → Add all from .env.local:

```
NEXT_PUBLIC_FIREBASE_API_KEY
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
NEXT_PUBLIC_FIREBASE_PROJECT_ID
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
NEXT_PUBLIC_FIREBASE_APP_ID
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET
NEXT_PUBLIC_ADMIN_UID
NEXT_PUBLIC_WHATSAPP
NEXT_PUBLIC_EMAIL
NEXT_PUBLIC_GITHUB
NEXT_PUBLIC_LINKEDIN
```

6. Click Deploy site

---

## Step 8 — Add your first project from admin

1. Go to yoursite.com/admin/login
2. Sign in
3. Click Projects → New project
4. Fill in The Detox Club details
5. Upload customer screenshot + admin screenshot
6. Set featured: true, order: 1
7. Repeat for BSpoke Clothing

---

## Admin panel URL

The admin entry point is the tiny person icon at the very bottom of the footer.
It goes to `/admin/login`.

---

## What's editable from the dashboard

| Section | What you can change |
|---------|-------------------|
| Site Config | Name, bio, title, taglines, CTA text, stats, profile image, availability |
| Projects | Add/edit/delete all projects, images, descriptions, features, tech stack |
| Skills | Add/edit/delete skills with categories and proficiency levels |
| Contact Info | WhatsApp number, email, GitHub, LinkedIn, default WA message |
| Leads | View all brief submissions, update status, reply via WhatsApp, export CSV |

Everything updates live across the site — no redeploy needed.

---

## Important security notes

- Never commit `.env.local` to GitHub (it's in .gitignore)
- Add all env vars manually in Netlify dashboard
- Your Firestore rules only allow writes from your UID
- The admin panel is protected — wrong UID = redirect to login

---

## URLs

| Page | URL |
|------|-----|
| Homepage | / |
| Work | /work |
| About | /about |
| Contact | /contact |
| Brief form | /brief |
| Admin login | /admin/login |
| Admin dashboard | /admin/dashboard |
| Admin projects | /admin/projects |
| Admin site config | /admin/site |
| Admin skills | /admin/skills |
| Admin leads | /admin/leads |
| Admin contacts | /admin/contacts |
