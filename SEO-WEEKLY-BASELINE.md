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
