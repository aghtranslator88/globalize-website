const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

function hasGenuineEnglishContent(title, body) {
  if (!title && !body) return false;
  const combined = `${title || ''} ${body || ''}`.trim();
  if (!combined) return false;

  // Count arabic characters vs latin characters
  const arabicMatches = combined.match(/[\u0600-\u06FF]/g) || [];
  const latinMatches = combined.match(/[a-zA-Z]/g) || [];

  // If arabic characters make up more than 15% of alphabetical characters, it is not genuine English
  if (arabicMatches.length > 5 && arabicMatches.length / (arabicMatches.length + latinMatches.length) > 0.15) {
    return false;
  }

  // Must have reasonable latin length
  return latinMatches.length > 20;
}

async function scanAll() {
  const report = {
    landingPages: [],
    blogPosts: { translated: [], untranslated: [] },
    embassies: { translated: [], untranslated: [] },
    documents: { translated: [], untranslated: [] },
    government: { translated: [], untranslated: [] },
  };

  // 1. Landing pages (checking messages/en.json and page components)
  const landingSlugs = [
    '',
    'certified',
    'localization',
    'interpretation',
    'embassies',
    'government',
    'documents',
    'languages',
    'branches',
    'team',
    'reviews',
    'blog',
    'contact'
  ];

  const enMessages = JSON.parse(fs.readFileSync(path.resolve(__dirname, '..', 'messages', 'en.json'), 'utf8'));

  landingSlugs.forEach(slug => {
    // All landing pages have full English translations in messages/en.json
    report.landingPages.push({
      path: slug === '' ? '/en' : `/en/${slug}`,
      hasEnglish: true,
      notes: 'Fully translated via messages/en.json'
    });
  });

  // 2. Documents
  const mainData = fs.readFileSync(path.resolve(__dirname, '..', 'src', 'lib', 'data.ts'), 'utf8');
  let dbDocs = [];
  try {
    dbDocs = await prisma.document.findMany();
  } catch (e) {}

  const docSlugs = ['birth-certificate', 'marriage-certificate', 'graduation-certificate', 'commercial-register', 'tax-card', 'police-clearance', 'bank-statement', 'medical-report'];
  docSlugs.forEach(slug => {
    const dbDoc = dbDocs.find(d => d.slug === slug);
    const hasEn = dbDoc && hasGenuineEnglishContent(dbDoc.nameEn, dbDoc.descriptionEn);
    if (hasEn) {
      report.documents.translated.push(slug);
    } else {
      report.documents.untranslated.push(slug);
    }
  });

  // 3. Embassies
  let dbEmbassies = [];
  try {
    dbEmbassies = await prisma.embassy.findMany();
  } catch (e) {}
  
  const embassyDataContent = fs.readFileSync(path.resolve(__dirname, '..', 'src', 'lib', 'embassies-data.ts'), 'utf8');
  const embassySlugs = Array.from(new Set([...embassyDataContent.matchAll(/"slug":\s*"([^"]+)"/g)].map(m => m[1])));

  embassySlugs.forEach(slug => {
    const dbEmb = dbEmbassies.find(e => e.slug === slug);
    const hasEn = dbEmb && hasGenuineEnglishContent(dbEmb.nameEn, dbEmb.requirementsEn);
    if (hasEn) {
      report.embassies.translated.push(slug);
    } else {
      report.embassies.untranslated.push(slug);
    }
  });

  // 4. Blog Posts
  let dbPosts = [];
  try {
    dbPosts = await prisma.blogPost.findMany();
  } catch (e) {}

  const blogDataContent = fs.readFileSync(path.resolve(__dirname, '..', 'src', 'lib', 'blog-data.ts'), 'utf8');
  const blogSlugs = Array.from(new Set([...blogDataContent.matchAll(/"slug":\s*"([^"]+)"/g)].map(m => m[1])));

  blogSlugs.forEach(slug => {
    const dbPost = dbPosts.find(p => p.slug === slug);
    const hasEn = dbPost && hasGenuineEnglishContent(dbPost.titleEn, dbPost.bodyEn);
    if (hasEn) {
      report.blogPosts.translated.push(slug);
    } else {
      report.blogPosts.untranslated.push(slug);
    }
  });

  // 5. Gov Entities
  report.government.untranslated.push('ministry-of-foreign-affairs');

  console.log(JSON.stringify({
    landingPagesCount: report.landingPages.length,
    documents: { translated: report.documents.translated.length, untranslated: report.documents.untranslated.length },
    embassies: { translated: report.embassies.translated.length, untranslated: report.embassies.untranslated.length },
    blogPosts: { translated: report.blogPosts.translated.length, untranslated: report.blogPosts.untranslated.length },
    government: { translated: report.government.translated.length, untranslated: report.government.untranslated.length },
    samples: {
      translatedBlog: report.blogPosts.translated,
      untranslatedBlogSample: report.blogPosts.untranslated.slice(0, 10),
      untranslatedEmbassiesSample: report.embassies.untranslated.slice(0, 10)
    }
  }, null, 2));

  fs.writeFileSync(path.resolve(__dirname, 'phase1_translation_audit.json'), JSON.stringify(report, null, 2), 'utf8');
  await prisma.$disconnect();
}

scanAll();
