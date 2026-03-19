# INVNT Event Intelligence Engine — Progress Tracker

## Overview

Transform the current single-page analytics dashboard into a full-featured, multi-tenant event intelligence platform with authentication, super-admin content management, client branding, and restructured dashboard sections.

**Tech Stack:** Next.js 16 (App Router) · Neon Postgres · Drizzle ORM · NextAuth.js v5 · Tailwind CSS v4

---

## 0. Database & Infrastructure Setup

- [x] Set up Postgres project and obtain connection string
- [x] Install dependencies: `drizzle-orm`, `drizzle-kit`, `pg`
- [x] Configure Drizzle with `node-postgres` driver (works with local Postgres and Neon)
- [x] Create `.env.local` with `DATABASE_URL` (`.env*` already in `.gitignore`)
- [x] **Define schema** (`src/db/schema.ts`):
  - [x] `users` table — id, email, passwordHash, name, role (`super_admin` | `client`), clientId (FK, nullable), createdAt
  - [x] `clients` table — id, name, slug, logoUrl, createdAt
  - [x] `dashboards` table — id, key (unique slug), name, description
  - [x] `graphs` table — id, key (unique slug), name, dashboardKey, component reference
  - [x] `client_dashboards` table — clientId, dashboardId, enabled, sortOrder (many-to-many)
  - [x] `client_graphs` table — clientId, graphId, enabled, sortOrder (many-to-many)
- [x] Run initial migration (`npm run db:push` + `npm run db:seed`)
- [x] Seed script: create default super-admin user and register existing dashboards/graphs
- [x] Add `drizzle.config.ts` for Drizzle Kit CLI

---

## 1. Authentication (NextAuth.js v5)

- [x] Install `next-auth@beta`
- [x] Configure NextAuth with Credentials provider (email + bcrypt password)
- [x] Set up Credentials provider (email + password with bcrypt)
- [x] Create login page (`/login`)
- [x] Implement session management and protected routes via proxy (`src/proxy.ts`, Next.js 16+)
- [x] Define user roles: **Super Admin**, **Client**
- [x] Extend session/JWT to include `role` and `clientId`
- [x] Add role-based route guards (super-admin routes vs client routes)
- [x] Add logout functionality

---

## 2. Branding & Navbar Updates

- [x] Replace current logo/icon with official INVNT logo in the navbar
- [x] Update navbar title from "INVNT Analytics" to **"INVNT Event Intelligence Engine"** branding
- [x] Update page metadata and favicon to match INVNT branding
- [x] Rename **"Client View"** tab → **"Post Insights"** (with "(coming)" label)
- [x] Rename **"Production"** tab → **"Live"**
- [x] Ensure mobile nav labels are updated accordingly

---

## 3. Super-Admin Content Management Platform

- [x] Create super-admin area (`/admin` with sidebar layout, protected route)
- [x] **Client Management:**
  - [x] Create client entity (name, logo URL)
  - [x] List / edit / delete clients
  - [x] Store client logos via URL
- [x] **Dashboard Configuration per Client:**
  - [x] UI to select which dashboards a client can see (toggle switches)
  - [x] UI for choosing and toggling graphs per client
  - [x] Save client-dashboard configuration to Postgres via Drizzle
- [x] **Dashboard/Graph Registry:**
  - [x] Register all available graphs/charts as selectable items
  - [ ] Allow super-admin to preview graphs before assigning

---

## 4. Client Landing Page

- [x] Create personalized landing page per client (post-login landing on `/`)
- [x] Display client-specific logo on the landing page
- [x] Show only the dashboards/graphs assigned to that client by the super-admin
- [x] Apply client branding (logo) throughout their session

---

## 5. Post Insights Section (formerly "Client View")

Restructure the Post Insights dashboard with the following analysis categories:

- [x] **Sentiment Analysis** — donut, trend line, session breakdown
- [x] **Survey Analysis** — response rate, NPS, star ratings, top themes
- [x] **Attendance Analysis** — stats, hourly chart, track breakdown, daily cards
- [x] **Job Leveling & Purchasing Power Analysis** — levels table, industry donut, intent stats
- [x] **Budget vs Actual Analysis** — summary stats, dual-bar per category with variance %
- [x] **Staff & Vendor Performance** — staff table with star ratings, vendor ratings with on-time %
- [x] Create mock data for each new analysis category
- [x] Build or adapt chart components for each category
- [x] Wire up Post Insights dashboard to display all categories

---

## 6. Live Section (formerly "Production")

- [x] Rename "Production" to "Live" in config, nav, and all references
- [x] Keep existing Live dashboard charts and functionality as-is
- [x] Verify all chart data and labels still work after rename

---

## 7. Predictive Analytics Updates

- [x] **Remove "Operational Strain & Risk"** card (`operationalStrain`)
- [x] **Remove "Economic Sentiment & Spend"** card (`economicSentiment`)
- [x] Remove associated mock data for removed cards
- [x] Update layout/grid to accommodate 6 remaining cards (3-col grid)
- [x] Verify remaining cards render correctly after removal

---

## 8. "Process Behind the Data" Page

- [x] Create new route (`/process`)
- [x] Build page layout based on provided screenshot (3-tier infographic → AI → Real Time → outputs)
- [x] Add navigation link to this page
- [x] Style consistently with the rest of the application

---

## 9. FAQ Page

- [x] Create new route (`/faq`)
- [x] Add navigation link to FAQ page
- [x] Content to include:

> **What is the INVNT Event Intelligence Engine?**
> The INVNT Event Intelligence Engine is a managed service providing custom data, integration, and analysis services. We provide one-time and continuous improvement intelligence through our dedicated team. We use our patent-pending AI, machine learning, and data science models to predict and understand true event performance.

> **Integrations & Pricing**
> We integrate with all major event registration platforms and apps and are agnostic. Pricing is based on data use, data storage, and deliverables. Custom features are available.

- [x] Style FAQ page with expandable/accordion sections
- [x] Ensure responsive design

---

## 10. Routing & Navigation Architecture

- [x] Convert from single-page tab navigation to proper Next.js App Router routes:
  - `/` — Landing / client-personalized home (redirects super admin → `/predictive`)
  - `/login` — Authentication
  - `/admin` — Super-admin dashboard
  - `/post-insights` — Post Insights (formerly Client View)
  - `/live` — Live monitoring (formerly Production)
  - `/predictive` — Predictive Analytics
  - `/process` — Process Behind the Data
  - `/faq` — FAQ
- [x] Update navbar to use `<Link>` navigation between routes
- [x] Add active route highlighting in nav
- [x] Add secondary nav links (Process, FAQ, Admin for super admins)

---

## Status Key

- [ ] Not started
- [x] Completed
- [~] In progress

---

## Notes

- **Database:** Local Postgres in dev, Neon Postgres in production — same `DATABASE_URL`, Drizzle ORM for type-safe queries and migrations
- **Auth:** NextAuth.js v5 — Credentials provider (email/password), JWT strategy
- **Image uploads:** Local dev saves to `public/uploads/`; production uses Vercel Blob. To enable Vercel Blob in production, add `BLOB_READ_WRITE_TOKEN` to your Vercel project env vars (get this by adding a Blob store in Vercel dashboard → Storage → Create → Blob).
- "Post Insights" should display a "(coming)" indicator if content is not yet fully built
- The "Live" section retains all current Production dashboard functionality
- ~~Screenshot for "Process Behind the Data" page is pending~~ ✓ Built from provided screenshot
- ~~INVNT logo asset needed for navbar and branding updates~~ ✓ Added
- Graph preview in admin panel (Task 3) is a nice-to-have for a future iteration
- Initial DB migration (Task 0) requires a running Postgres — run `npm run db:push && npm run db:seed`
