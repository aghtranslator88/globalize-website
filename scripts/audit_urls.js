const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

function extractSlugsFromTsFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const slugs = [];
  const slugRegex = /"slug":\s*"([^"]+)"/g;
  let match;
  while ((match = slugRegex.exec(content)) !== null) {
    slugs.push(match[1]);
  }
  return slugs;
}

async function runAudit() {
  const blogDataPath = path.resolve(__dirname, '..', 'src', 'lib', 'blog-data.ts');
  const embassiesDataPath = path.resolve(__dirname, '..', 'src', 'lib', 'embassies-data.ts');
  const dataPath = path.resolve(__dirname, '..', 'src', 'lib', 'data.ts');

  const blogSlugs = extractSlugsFromTsFile(blogDataPath);
  const embassySlugs = extractSlugsFromTsFile(embassiesDataPath);
  const coreSlugs = extractSlugsFromTsFile(dataPath);

  let dbPosts = [];
  let dbEmbassies = [];
  let dbDocs = [];
  let dbGov = [];

  try {
    dbPosts = await prisma.blogPost.findMany({ select: { slug: true, titleAr: true, titleEn: true } });
    dbEmbassies = await prisma.embassy.findMany({ select: { slug: true, nameAr: true, nameEn: true } });
    dbDocs = await prisma.document.findMany({ select: { slug: true, nameAr: true, nameEn: true } });
    dbGov = await prisma.govEntity.findMany({ select: { slug: true, nameAr: true, nameEn: true } });
  } catch (err) {
    console.error('DB Error:', err.message);
  }

  const allItems = [];

  const add = (slug, category, source, meta = {}) => {
    if (!slug) return;
    const hasArabic = /[\u0600-\u06FF]/.test(slug);
    const hasHtml = /\.html$/i.test(slug);
    const hasMixed = hasArabic && /[a-zA-Z]/.test(slug);
    const hasSpecial = /[^a-zA-Z0-9\-_]/.test(slug);
    const isTransliterated = /^(al|el|wa|wa-|al-)[a-z]+(-[a-z]+){3,}/.test(slug) || /altkaryr|ahmytha|mkonatha|targama|moatamada|safara|mktb|maktab/.test(slug);
    const hasDoubleHyphen = /--/.test(slug);
    const hasUppercase = /[A-Z]/.test(slug);

    allItems.push({
      slug,
      category,
      source,
      hasArabic,
      hasHtml,
      hasMixed,
      hasSpecial,
      isTransliterated,
      hasDoubleHyphen,
      hasUppercase,
      meta
    });
  };

  blogSlugs.forEach(s => add(s, 'Blog', 'blog-data.ts'));
  embassySlugs.forEach(s => add(s, 'Embassy', 'embassies-data.ts'));
  coreSlugs.forEach(s => add(s, 'Core Data', 'data.ts'));

  dbPosts.forEach(p => add(p.slug, 'Blog', 'Neon DB', { titleAr: p.titleAr, titleEn: p.titleEn }));
  dbEmbassies.forEach(e => add(e.slug, 'Embassy', 'Neon DB', { nameAr: e.nameAr, nameEn: e.nameEn }));
  dbDocs.forEach(d => add(d.slug, 'Document', 'Neon DB', { nameAr: d.nameAr, nameEn: d.nameEn }));
  dbGov.forEach(g => add(g.slug, 'GovEntity', 'Neon DB', { nameAr: g.nameAr, nameEn: g.nameEn }));

  // Static routes
  const staticRoutes = [
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
    '/contact'
  ];
  staticRoutes.forEach(r => add(r, 'Static', 'App Router'));

  // Aggregation
  const arabicSlugs = allItems.filter(i => i.hasArabic);
  const mixedSlugs = allItems.filter(i => i.hasMixed);
  const htmlSlugs = allItems.filter(i => i.hasHtml);
  const transliteratedSlugs = allItems.filter(i => i.isTransliterated);
  const doubleHyphenOrUpper = allItems.filter(i => i.hasDoubleHyphen || i.hasUppercase);

  // Group by unique slug per category
  const uniqueMap = new Map();
  allItems.forEach(i => {
    const key = `${i.category}:${i.slug}`;
    if (!uniqueMap.has(key)) {
      uniqueMap.set(key, i);
    }
  });

  const uniqueList = Array.from(uniqueMap.values());
  const needsChange = uniqueList.filter(i => i.hasArabic || i.hasHtml || i.hasMixed || i.isTransliterated || i.hasDoubleHyphen || i.hasUppercase || i.hasSpecial);
  const unchanged = uniqueList.filter(i => !needsChange.includes(i));

  const report = {
    totalRoutesScanned: allItems.length,
    totalUniqueCategorySlugs: uniqueList.length,
    arabicCount: arabicSlugs.length,
    mixedCount: mixedSlugs.length,
    htmlCount: htmlSlugs.length,
    transliteratedCount: transliteratedSlugs.length,
    specialOrFormattingCount: doubleHyphenOrUpper.length,
    totalNeedingChange: needsChange.length,
    totalRemainingUnchanged: unchanged.length,
    needsChangeDetails: needsChange.map(i => ({
      slug: i.slug,
      category: i.category,
      source: i.source,
      reasons: [
        i.hasArabic ? 'Contains Arabic' : null,
        i.hasHtml ? 'Contains .html' : null,
        i.hasMixed ? 'Mixed Arabic/English' : null,
        i.isTransliterated ? 'Transliterated Arabic / Gibberish' : null,
        i.hasDoubleHyphen ? 'Double Hyphen' : null,
        i.hasUppercase ? 'Uppercase Letters' : null,
        i.hasSpecial ? 'Special Characters' : null
      ].filter(Boolean).join(', '),
      meta: i.meta
    })),
    unchangedSample: unchanged.slice(0, 15).map(i => ({ slug: i.slug, category: i.category }))
  };

  fs.writeFileSync(path.resolve(__dirname, 'audit_report.json'), JSON.stringify(report, null, 2), 'utf8');
  console.log('Audit completed! Summary:');
  console.log(`- Total Scanned: ${report.totalRoutesScanned}`);
  console.log(`- Total Unique Slugs: ${report.totalUniqueCategorySlugs}`);
  console.log(`- Arabic Slugs: ${report.arabicCount}`);
  console.log(`- Mixed Slugs: ${report.mixedCount}`);
  console.log(`- HTML Slugs: ${report.htmlCount}`);
  console.log(`- Low-quality / Transliterated / Malformed: ${report.transliteratedCount + report.specialOrFormattingCount}`);
  console.log(`- Needs Change: ${report.totalNeedingChange}`);
  console.log(`- Clean / Unchanged: ${report.totalRemainingUnchanged}`);

  await prisma.$disconnect();
}

runAudit();
