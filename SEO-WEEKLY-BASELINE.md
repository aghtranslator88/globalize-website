# Weekly SEO/GEO Baseline — Globalize Group

**Baseline date:** 2026-10-22 (first weekly run)
**Property:** `sc-domain:globalizetl.com` · **Site:** https://www.globalizetl.com
**Purpose:** reference point for the weekly SEO/GEO runs. Each weekly report compares against this file.

## 1. Search Console baseline

Fresh GSC data could not be pulled on 2026-10-22 (the local shell on the owner's computer was unavailable).
The most recent recorded GSC snapshot (from `SEO-PERFORMANCE-REPORT.md`, extracted 2026-09-16, range 2026-06-01 → 2026-09-16):

| Metric | Value |
| :--- | ---: |
| Clicks | 26 |
| Impressions | 2,662 |
| CTR | 0.98% |
| Average position | 13.4 |
| Top country | Egypt (~73%) |

Top landing page by impressions at that time: `/en/blog/italy-visa-egypt-almaviva` (252 impressions, position 11.2).
Notable striking-distance queries: `سعر ترجمة شهادة الميلاد` (pos ~27), `بيان درجات بالانجليزي` (pos ~8), `almaviva egypt` (pos ~14).

The first successful run of `scripts/gsc_weekly_pull.mjs` (last 28 days vs previous 28 days, by page and query, plus URL Inspection of the top 12 pages) becomes the numeric baseline. Its output (`gsc_weekly_28d.json`) stays on the owner's computer and is never committed.

## 2. Site inventory (from code, 2026-10-22)

| Section | Count / state |
| :--- | :--- |
| Document pages (`/documents/*`) | 8 (birth, marriage, family record, movement, death, police record, graduation, transcript) |
| Document pricing on live pages | 200 EGP/page (Arabic ↔ English), 300 EGP/page other languages, 24h |
| Static embassy guides (`/embassies/*`) | 127 (plus DB-seeded embassies) |
| Static blog posts (fallback dataset) | 111 (14 with English title fields) |
| Service pages | certified, localization, interpretation, legal-translation, medical-translation |
| Branches | 4 (Giza HQ, Dokki, Haram, Salah Salem) |
| `public/llms.txt` | refreshed 2026-10-22 |

## 3. Technical state after the 2026-10-22 batch (commit `f502dcf`)

- Localized AR/EN titles and descriptions on document, embassy, government and language detail pages.
- BreadcrumbList JSON-LD uses locale-prefixed `www` URLs. Service JSON-LD has `url`, `@id` and `areaServed`.
- Links to non-existent `/documents/*` slugs in article bodies are rewritten at render time.
- Article bodies render no extra `<h1>`.

## 4. Open issues at baseline (need owner decision)

- Price conflict: the blog price guide (`certified-translation-prices-requirements-guide`) lists 250–350 EGP ranges, but the document pages list 200/300 EGP per page.
- Dead document slugs still stored in DB/blog bodies (fixed only at render time).
- No document pages yet for bank statement, commercial register, power of attorney, single-status certificate.
- `npm run build` cannot be verified in the cloud container (Google Fonts and Prisma engine downloads are blocked). Typecheck and lint are compared against the pre-change baseline instead.

## 5. Weekly log

### 2026-10-25
- GSC pull failed: the owner's local shell could not reach `oauth2.googleapis.com` (egress proxy returned 403). No new numbers this week; the 2026-09-16 snapshot is still the latest.
- Added the missing `public/globalize-og.jpg` (1200×630) referenced by every page's Open Graph / Twitter metadata.
- JSON-LD: Organization now carries email, phone, HQ address and image; branch LocalBusiness uses an existing image, international phone, per-branch city and `parentOrganization`; document pages emit Service + Offer (price per page) instead of Product; Article uses absolute image URLs, `inLanguage`, `url`, and an Organization author for team bylines; BreadcrumbList added to certified, interpretation and localization.
- `public/llms.txt`: added the 7 specialized guides (AR + EN), the interpretation/localization/languages English pages, and the document-legalization sources page.

### 2026-11-01
- GSC pull failed again: the owner's local shell gets HTTP 403 from its egress proxy for `oauth2.googleapis.com`, and the cloud container cannot reach `www.globalizetl.com`. No new numbers; the 2026-09-16 snapshot is still the latest.
- Document pages: search-intent titles per document (e.g. "ترجمة بيان الدرجات بالإنجليزي", "Criminal Record (Police Clearance) Translation", "سعر ترجمة شهادة الميلاد"), price and turnaround still from the record; English answer-box label is now "Price & Turnaround".
- Home: WebSite JSON-LD (`#website`, publisher → `#organization`). Service JSON-LD provider now typed `Organization` (matches the `#organization` node). Language detail pages emit Service JSON-LD.
- Blog index and contact: clearer, branded AR/EN titles and descriptions.
- Turkish embassy pages (Egypt) link to the Turkish Embassy Cairo guide instead of the generic price guide.
- `public/llms.txt`: English document pages, contact and reviews pages, last-updated date.

### 2026-11-09
- GSC pull not possible: the remote shell on the owner's computer failed to start this week. The newest local GSC file is still the 2026-09-16 extract. No new numbers.
- Titles/meta descriptions (AR + EN) rewritten for CTR: legal translation and medical translation (previous descriptions were cut-off body excerpts, titles had no brand), branches (now name the four offices and hours), documents index (lists the document types and the 200/300 EGP per page, 24h facts), certified (adds per-page price), English interpretation title aligned with the Arabic one.
- Home: FAQPage JSON-LD that mirrors the visible homepage FAQ accordion.
- Documents index: ItemList JSON-LD of the indexable document pages.
- Italy/Almaviva guide (static fallback + sync scripts): removed the claim of an Alexandria branch (Globalize has four branches in Cairo and Giza). The live DB copy still needs the same fix.
- `public/llms.txt`: short FAQ answers (what certified translation is, pricing basis, translation vs legalization, legal/medical scope, branches) and last-updated date.
