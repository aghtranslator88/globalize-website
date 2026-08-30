import type { MetadataRoute } from 'next';
import { prisma } from '@/lib/prisma';
import { ALL_BLOG_POSTS } from '@/lib/blog-data';
import { ALL_EMBASSY_POSTS } from '@/lib/embassies-data';
import { getSiteUrl } from '@/lib/siteUrl';
import { isGenuineEnglish } from '@/lib/translationDetection';

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

  const addPath = (rawPath: string, lastModified?: Date, hasEnglishTranslation = true) => {
    // Percent-encode non-ASCII path segments cleanly
    const encodedPath = encodeURI(rawPath);
    const arUrl = `${SITE_URL}/ar${encodedPath}`;
    const enUrl = `${SITE_URL}/en${encodedPath}`;

    const arLanguages: Record<string, string> = {
      ar: arUrl,
      'x-default': arUrl,
    };

    if (hasEnglishTranslation) {
      arLanguages.en = enUrl;
    }

    const arEntry: MetadataRoute.Sitemap[number] = {
      url: arUrl,
      alternates: {
        languages: arLanguages,
      },
    };
    if (lastModified) {
      arEntry.lastModified = lastModified;
    }
    entries.push(arEntry);

    // Only emit /en URL into sitemap if it has a genuine English translation
    if (hasEnglishTranslation) {
      const enEntry: MetadataRoute.Sitemap[number] = {
        url: enUrl,
        alternates: {
          languages: {
            ar: arUrl,
            en: enUrl,
            'x-default': arUrl,
          },
        },
      };
      if (lastModified) {
        enEntry.lastModified = lastModified;
      }
      entries.push(enEntry);
    }
  };

  // Add 13 static landing pages (all have full English translation)
  staticPaths.forEach((path) => addPath(path, undefined, true));

  // Add services
  services.forEach((s) => {
    if (!['certified', 'localization', 'interpretation'].includes(s.slug)) {
      const hasEn = isGenuineEnglish(s.nameEn, s.descriptionEn);
      addPath(`/services/${s.slug}`, s.updatedAt, hasEn);
    }
  });

  // Add documents
  documents.forEach((d) => {
    const hasEn = isGenuineEnglish(d.nameEn, d.descriptionEn);
    addPath(`/documents/${d.slug}`, d.updatedAt, hasEn);
  });

  // Add embassies (combining DB and static fallback)
  const embassySlugs = new Set<string>();
  embassies.forEach((e) => {
    embassySlugs.add(e.slug);
    const hasEn = isGenuineEnglish(e.nameEn, e.requirementsEn);
    addPath(`/embassies/${e.slug}`, e.updatedAt, hasEn);
  });
  ALL_EMBASSY_POSTS.forEach((e) => {
    if (!embassySlugs.has(e.slug)) {
      embassySlugs.add(e.slug);
      const hasEn = isGenuineEnglish(e.title, e.requirements?.join(' '));
      addPath(`/embassies/${e.slug}`, undefined, hasEn);
    }
  });

  // Add gov entities
  govEntities.forEach((g) => {
    const hasEn = isGenuineEnglish(g.nameEn, g.requirementsEn);
    addPath(`/government/${g.slug}`, g.updatedAt, hasEn);
  });

  // Add blog posts (combining DB and static fallback)
  const blogSlugs = new Set<string>();
  blogPosts.forEach((bp) => {
    blogSlugs.add(bp.slug);
    const hasEn = isGenuineEnglish(bp.titleEn, bp.bodyEn);
    addPath(`/blog/${bp.slug}`, bp.updatedAt, hasEn);
  });
  ALL_BLOG_POSTS.forEach((bp) => {
    if (!blogSlugs.has(bp.slug)) {
      blogSlugs.add(bp.slug);
      const hasEn = isGenuineEnglish(bp.title, bp.body);
      addPath(`/blog/${bp.slug}`, bp.publishedAt ? new Date(bp.publishedAt) : undefined, hasEn);
    }
  });

  return entries;
}

