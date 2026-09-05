const fs = require('fs');
const path = require('path');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const blogData = require('../src/lib/blog-data.ts').ALL_BLOG_POSTS;
const embassyData = require('../src/lib/embassies-data.ts').ALL_EMBASSY_POSTS;

async function scanAll() {
  console.log('================================================================');
  console.log('🔍 SCANNING WEBSITE FOR SEO/AEO/GEO BOILERPLATE & META-TEXT');
  console.log('================================================================\n');

  const findings = [];

  // 1. Scan blog-data.ts
  blogData.forEach((post, idx) => {
    const body = post.body || '';
    const matches = [];

    if (body.includes('كيف تخدم هذه الصفحة SEO') || body.includes('SEO وAEO وGEO') || body.includes('AEO وGEO') || body.includes('تم إعداد هذا المحتوى ليكون مناسبًا لمحركات البحث')) {
      matches.push('Section: "## كيف تخدم هذه الصفحة SEO وAEO وGEO؟" & Meta explanation');
    }
    if (body.includes('نراعي احتياجات SEO وAEO')) {
      matches.push('Sentence: "نراعي احتياجات SEO وAEO في محتوى الموقع..."');
    }
    if (body.includes('أما من ناحية GEO')) {
      matches.push('Paragraph: "أما من ناحية GEO، فالمحتوى يوضح الخدمة..."');
    }
    if (body.includes('```mermaid')) {
      matches.push('Raw Mermaid Code Block');
    }

    if (matches.length > 0) {
      findings.push({
        source: 'src/lib/blog-data.ts',
        type: 'Blog Post',
        id: post.id,
        slug: post.slug,
        title: post.title,
        issues: matches
      });
    }
  });

  // 2. Scan embassies-data.ts
  embassyData.forEach((emb, idx) => {
    const body = emb.body || '';
    const matches = [];

    if (body.includes('كيف تخدم هذه الصفحة SEO') || body.includes('SEO وAEO وGEO') || body.includes('AEO وGEO') || body.includes('تم إعداد هذا المحتوى ليكون مناسبًا لمحركات البحث')) {
      matches.push('Section: "## كيف تخدم هذه الصفحة SEO وAEO وGEO؟"');
    }
    if (body.includes('نراعي احتياجات SEO وAEO')) {
      matches.push('Sentence: "نراعي احتياجات SEO وAEO في محتوى الموقع..."');
    }
    if (body.includes('أما من ناحية GEO')) {
      matches.push('Paragraph: "أما من ناحية GEO، فالمحتوى يوضح الخدمة..."');
    }

    if (matches.length > 0) {
      findings.push({
        source: 'src/lib/embassies-data.ts',
        type: 'Embassy Post',
        id: emb.id,
        slug: emb.slug,
        title: emb.title,
        issues: matches
      });
    }
  });

  // 3. Scan Prisma Database
  const dbPosts = await prisma.blogPost.findMany({
    select: { id: true, slug: true, titleAr: true, bodyAr: true }
  });

  let dbMatchesCount = 0;
  dbPosts.forEach(p => {
    if (p.bodyAr && (p.bodyAr.includes('كيف تخدم هذه الصفحة SEO') || p.bodyAr.includes('نراعي احتياجات SEO وAEO') || p.bodyAr.includes('أما من ناحية GEO'))) {
      dbMatchesCount++;
    }
  });

  console.log(`📊 Scan Results:`);
  console.log(`- Total Blog Posts with Boilerplate in blog-data.ts: ${findings.filter(f => f.type === 'Blog Post').length} / ${blogData.length}`);
  console.log(`- Total Embassy Posts with Boilerplate in embassies-data.ts: ${findings.filter(f => f.type === 'Embassy Post').length} / ${embassyData.length}`);
  console.log(`- Total Posts with Boilerplate in PostgreSQL DB: ${dbMatchesCount} / ${dbPosts.length}`);

  // Save report
  fs.writeFileSync(
    path.join(__dirname, 'seo_boilerplate_findings.json'),
    JSON.stringify(findings, null, 2),
    'utf8'
  );
  console.log(`\n✓ Full JSON report saved to scripts/seo_boilerplate_findings.json`);
}

scanAll()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
