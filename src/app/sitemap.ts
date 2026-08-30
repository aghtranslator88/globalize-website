import type { MetadataRoute } from 'next';
import { prisma } from '@/lib/prisma';
import { ALL_BLOG_POSTS } from '@/lib/blog-data';
import { ALL_EMBASSY_POSTS } from '@/lib/embassies-data';
import { getSiteUrl } from '@/lib/siteUrl';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const SITE_URL = getSiteUrl();
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
    console.error('Database offline during sitemap generation. Falling back to static entries.');
  }

  const staticPaths = [
    '',
    '/certified',
    '/localization',
    '/interpretation',
    '/embassies',
    '/government',
    '/documents',
    '/languages',
    '/branches',
    '/team',
    '/reviews',
    '/blog',
    '/contact',
  ];

  const entries: MetadataRoute.Sitemap = [];

  const addPath = (path: string, lastModified: Date = new Date(), priority = 0.8) => {
    const arUrl = `${SITE_URL}/ar${path}`;
    const enUrl = `${SITE_URL}/en${path}`;

    entries.push({
      url: arUrl,
      lastModified,
      changeFrequency: path === '' ? 'daily' : 'weekly',
      priority: path === '' ? 1.0 : priority,
      alternates: {
        languages: {
          ar: arUrl,
          en: enUrl,
          'x-default': arUrl,
        },
      },
    });

    entries.push({
      url: enUrl,
      lastModified,
      changeFrequency: path === '' ? 'daily' : 'weekly',
      priority: path === '' ? 0.9 : priority,
      alternates: {
        languages: {
          ar: arUrl,
          en: enUrl,
          'x-default': arUrl,
        },
      },
    });
  };

  // Add static routes
  staticPaths.forEach((path) => addPath(path, new Date(), path === '' ? 1.0 : 0.9));

  // Add services
  services.forEach((s) => {
    if (!['certified', 'localization', 'interpretation'].includes(s.slug)) {
      addPath(`/services/${s.slug}`, s.updatedAt || new Date(), 0.85);
    }
  });

  // Add documents
  documents.forEach((d) => {
    addPath(`/documents/${d.slug}`, d.updatedAt || new Date(), 0.85);
  });

  // Add embassies (combining DB and static fallback)
  const embassySlugs = new Set<string>();
  embassies.forEach((e) => {
    embassySlugs.add(e.slug);
    addPath(`/embassies/${e.slug}`, e.updatedAt || new Date(), 0.85);
  });
  ALL_EMBASSY_POSTS.forEach((e) => {
    if (!embassySlugs.has(e.slug)) {
      embassySlugs.add(e.slug);
      addPath(`/embassies/${e.slug}`, new Date(), 0.85);
    }
  });

  // Add gov entities
  govEntities.forEach((g) => {
    addPath(`/government/${g.slug}`, g.updatedAt || new Date(), 0.85);
  });

  // Add blog posts (combining DB and static fallback)
  const blogSlugs = new Set<string>();
  blogPosts.forEach((bp) => {
    blogSlugs.add(bp.slug);
    addPath(`/blog/${bp.slug}`, bp.updatedAt || new Date(), 0.8);
  });
  ALL_BLOG_POSTS.forEach((bp) => {
    if (!blogSlugs.has(bp.slug)) {
      blogSlugs.add(bp.slug);
      addPath(`/blog/${bp.slug}`, new Date(bp.publishedAt || Date.now()), 0.8);
    }
  });

  return entries;
}
