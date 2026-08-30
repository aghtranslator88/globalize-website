import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ALL_BLOG_POSTS } from "@/lib/blog-data";
import { ALL_EMBASSY_POSTS } from "@/lib/embassies-data";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.globalizetl.com";

export async function GET() {
  let services: any[] = [];
  let documents: any[] = [];
  let embassies: any[] = [];
  let govEntities: any[] = [];
  let blogPosts: any[] = [];

  try {
    services = await prisma.service.findMany({ where: { indexable: true } });
    documents = await prisma.document.findMany({ where: { indexable: true } });
    embassies = await prisma.embassy.findMany({ where: { indexable: true } });
    govEntities = await prisma.govEntity.findMany({ where: { indexable: true } });
    blogPosts = await prisma.blogPost.findMany({ where: { published: true } });
  } catch (err) {
    console.error("Database offline during sitemap generation. Falling back to static entries only.");
  }

  // Core static page paths
  const staticPaths = [
    "",
    "/certified",
    "/localization",
    "/interpretation",
    "/embassies",
    "/government",
    "/documents",
    "/languages",
    "/branches",
    "/team",
    "/reviews",
    "/blog",
    "/contact",
  ];

  const sitemapEntries: string[] = [];

  // Generate XML entry helper
  const addEntry = (path: string, lastMod: Date = new Date()) => {
    const dateStr = lastMod.toISOString().split("T")[0];
    const arUrl = `${SITE_URL}/ar${path}`;
    const enUrl = `${SITE_URL}/en${path}`;
    
    sitemapEntries.push(`
  <url>
    <loc>${arUrl}</loc>
    <lastmod>${dateStr}</lastmod>
    <xhtml:link rel="alternate" hreflang="ar" href="${arUrl}"/>
    <xhtml:link rel="alternate" hreflang="en" href="${enUrl}"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="${arUrl}"/>
  </url>
  <url>
    <loc>${enUrl}</loc>
    <lastmod>${dateStr}</lastmod>
    <xhtml:link rel="alternate" hreflang="ar" href="${arUrl}"/>
    <xhtml:link rel="alternate" hreflang="en" href="${enUrl}"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="${arUrl}"/>
  </url>`);
  };

  // Add static paths
  staticPaths.forEach((path) => addEntry(path));

  // Add dynamic paths (Services)
  services.forEach((s) => {
    // If slug is 'certified', 'localization', 'interpretation', it's already covered by staticPaths, 
    // but just in case or if there are new ones:
    if (!["certified", "localization", "interpretation"].includes(s.slug)) {
      addEntry(`/services/${s.slug}`, s.updatedAt);
    }
  });

  // Add dynamic paths (Documents)
  documents.forEach((d) => {
    addEntry(`/documents/${d.slug}`, d.updatedAt);
  });

  // Add dynamic paths (Embassies)
  const embassySlugs = new Set<string>();
  embassies.forEach((e) => {
    embassySlugs.add(e.slug);
    addEntry(`/embassies/${e.slug}`, e.updatedAt);
  });
  ALL_EMBASSY_POSTS.forEach((e) => {
    if (!embassySlugs.has(e.slug)) {
      embassySlugs.add(e.slug);
      addEntry(`/embassies/${e.slug}`);
    }
  });

  // Add dynamic paths (Gov Entities)
  govEntities.forEach((g) => {
    addEntry(`/government/${g.slug}`, g.updatedAt);
  });

  // Add dynamic paths (Blog posts)
  const blogSlugs = new Set<string>();
  blogPosts.forEach((bp) => {
    blogSlugs.add(bp.slug);
    addEntry(`/blog/${bp.slug}`, bp.updatedAt);
  });
  ALL_BLOG_POSTS.forEach((bp) => {
    if (!blogSlugs.has(bp.slug)) {
      blogSlugs.add(bp.slug);
      addEntry(`/blog/${bp.slug}`, new Date(bp.publishedAt));
    }
  });

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
  ${sitemapEntries.join("")}
</urlset>`;

  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=43200",
    },
  });
}
