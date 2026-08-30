const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

async function analyzeSitemap() {
  const blogData = fs.readFileSync(path.resolve(__dirname, '..', 'src', 'lib', 'blog-data.ts'), 'utf8');
  const embassiesData = fs.readFileSync(path.resolve(__dirname, '..', 'src', 'lib', 'embassies-data.ts'), 'utf8');
  const mainData = fs.readFileSync(path.resolve(__dirname, '..', 'src', 'lib', 'data.ts'), 'utf8');

  function getSlugs(str) {
    const slugs = [];
    const r = /"slug":\s*"([^"]+)"/g;
    let m;
    while ((m = r.exec(str)) !== null) slugs.push(m[1]);
    return Array.from(new Set(slugs));
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

  let services = [];
  let documents = [];
  let embassies = [];
  let govEntities = [];
  let blogPosts = [];

  try {
    services = await prisma.service.findMany({ where: { indexable: true } });
    documents = await prisma.document.findMany({ where: { indexable: true } });
    embassies = await prisma.embassy.findMany({ where: { indexable: true } });
    govEntities = await prisma.govEntity.findMany({ where: { indexable: true } });
    blogPosts = await prisma.blogPost.findMany({ where: { published: true } });
  } catch (e) {
    console.error('DB error', e);
  }

  const embassySlugs = new Set(embassies.map(e => e.slug));
  getSlugs(embassiesData).forEach(s => embassySlugs.add(s));

  const blogSlugs = new Set(blogPosts.map(b => b.slug));
  getSlugs(blogData).forEach(s => blogSlugs.add(s));

  const docSlugs = new Set(documents.map(d => d.slug));
  getSlugs(mainData).forEach(s => {
    // Only doc slugs
    if (s.includes('certificate') || s.includes('contract') || s.includes('statement') || s.includes('record') || s.includes('license') || s.includes('card') || s.includes('power-of-attorney') || s.includes('payslip') || s.includes('tax') || s.includes('passport') || s.includes('id-card') || s.includes('military') || s.includes('court') || s.includes('medical-report') || s.includes('movement') || s.includes('high-school') || s.includes('experience') || s.includes('enjaz') || s.includes('commercial-register')) {
      docSlugs.add(s);
    }
  });

  const govSlugs = new Set(govEntities.map(g => g.slug));

  const serviceSlugs = new Set(services.map(s => s.slug).filter(s => !['certified', 'localization', 'interpretation'].includes(s)));

  const counts = {
    topLevelStatic: staticPaths.length, // 13
    services: serviceSlugs.size,
    documents: docSlugs.size,
    embassies: embassySlugs.size,
    government: govSlugs.size,
    blog: blogSlugs.size,
  };

  const totalEntriesPerLocale = counts.topLevelStatic + counts.services + counts.documents + counts.embassies + counts.government + counts.blog;
  const totalSitemapUrls = totalEntriesPerLocale * 2; // ar + en

  console.log(JSON.stringify({
    countsBySection: counts,
    totalPerLocale: totalEntriesPerLocale,
    totalSitemapUrls: totalSitemapUrls,
    breakdown: {
      ar: {
        topLevel: counts.topLevelStatic,
        services: counts.services,
        documents: counts.documents,
        embassies: counts.embassies,
        government: counts.government,
        blog: counts.blog,
        subtotal: totalEntriesPerLocale
      },
      en: {
        topLevel: counts.topLevelStatic,
        services: counts.services,
        documents: counts.documents,
        embassies: counts.embassies,
        government: counts.government,
        blog: counts.blog,
        subtotal: totalEntriesPerLocale
      }
    }
  }, null, 2));

  await prisma.$disconnect();
}

analyzeSitemap();
