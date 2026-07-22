# Globalize Group - Certified Translation Website

A full-stack production multilingual website for **Globalize Group** (جلوبالايز جروب لأعمال الترجمة), a certified translation company in Egypt serving Egypt and GCC countries.

## Technology Stack

- **Framework**: Next.js 14+ (App Router) + TypeScript
- **Database & ORM**: PostgreSQL + Prisma ORM
- **Styling**: Tailwind CSS
- **i18n**: next-intl (Arabic default RTL + English LTR)
- **Auth**: NextAuth.js (Dashboard Authentication)
- **Validation**: Zod

---

## Features

1. **Database-Driven Content**: All content is queried directly from the database (no hardcoding in components).
2. **SEO & Gating**: Automatic JSON-LD schemas (Organization, LocalBusiness, Breadcrumbs, FAQs, Article, Offers) and quality gating (unfilled requirements pages render with `noindex` tag).
3. **Dynamic Sitemap & Robots**: Live `sitemap.xml` listing only indexable pages with `hreflang` annotations and `robots.txt`.
4. **Admin Dashboard**: Credentials login with Role-based authorization (`ADMIN` vs `EDITOR`), Quote request inbox with status workflows, and visual CRUD forms with Arabic/English tabs and live Google SEO previews.

---

## Setup Instructions

### 1. Configure Environment Variables
Create a `.env` file at the root of the project:
```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/globalize_db?schema=public"
NEXTAUTH_SECRET="f3b97b0a70183b56a3e9c5643bc7db053f3e7ff0ba156a5996924b10b0a880dc"
NEXTAUTH_URL="http://localhost:3000"
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Run Migrations & Seed Database
Apply the database migrations and seed the initial data:
```bash
npx prisma migrate dev
npx prisma db seed
```

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the website.

---

## Dashboard Credentials

Access the dashboard at `/dashboard` (which redirects to `/ar/dashboard/login`):

- **Administrator**:
  - **Email**: `admin@globalizetl.com`
  - **Password**: `admin123456`
  - **Role**: `ADMIN` (Complete access, settings management)

- **Editor**:
  - **Email**: `editor@globalizetl.com`
  - **Password**: `editor123456`
  - **Role**: `EDITOR` (Content editing only, cannot edit/delete settings)
