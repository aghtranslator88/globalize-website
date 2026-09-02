const fs = require('fs');
const path = require('path');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const a1 = require('./article1');
const a2 = require('./article2');
const a3 = require('./article3');
const a4 = require('./article4');
const a5 = require('./article5');
const a6 = require('./article6');

const ALL_PILLARS = [a1, a2, a3, a4, a5, a6];

async function syncAll() {
  console.log('===============================================================');
  console.log('🚀 SYNCHRONIZING 6 COMPREHENSIVE CERTIFIED TRANSLATION PILLARS');
  console.log('===============================================================\n');

  let allPassed = true;

  for (let i = 0; i < ALL_PILLARS.length; i++) {
    const post = ALL_PILLARS[i];
    const arWords = post.bodyAr.trim().split(/\s+/).length;
    const enWords = post.bodyEn.trim().split(/\s+/).length;

    const arPass = arWords >= 1200;
    const enPass = enWords >= 1200;
    if (!arPass || !enPass) allPassed = false;

    console.log(`[Pillar ${i + 1}/6]: ${post.slug}`);
    console.log(`  - Arabic Word Count : ${arWords.toString().padStart(4)} words  ${arPass ? '✅ PASSED (>=1200)' : '❌ FAILED (<1200)'}`);
    console.log(`  - English Word Count: ${enWords.toString().padStart(4)} words  ${enPass ? '✅ PASSED (>=1200)' : '❌ FAILED (<1200)'}`);
    console.log(`  - FAQs Count        : ${post.faqs.length} FAQs`);

    // Upsert into Prisma DB
    const upserted = await prisma.blogPost.upsert({
      where: { slug: post.slug },
      update: {
        titleAr: post.titleAr,
        titleEn: post.titleEn,
        excerptAr: post.excerptAr,
        excerptEn: post.excerptEn,
        bodyAr: post.bodyAr,
        bodyEn: post.bodyEn,
        categoryAr: post.categoryAr,
        categoryEn: post.categoryEn,
        authorId: post.authorId,
        readMinutes: post.readMinutes,
        published: true,
        publishedAt: post.publishedAt,
      },
      create: {
        id: post.id,
        slug: post.slug,
        titleAr: post.titleAr,
        titleEn: post.titleEn,
        excerptAr: post.excerptAr,
        excerptEn: post.excerptEn,
        bodyAr: post.bodyAr,
        bodyEn: post.bodyEn,
        categoryAr: post.categoryAr,
        categoryEn: post.categoryEn,
        authorId: post.authorId,
        readMinutes: post.readMinutes,
        published: true,
        publishedAt: post.publishedAt,
      }
    });

    // Recreate FAQs
    await prisma.fAQ.deleteMany({ where: { blogPostId: upserted.id } });
    for (let j = 0; j < post.faqs.length; j++) {
      const faq = post.faqs[j];
      await prisma.fAQ.create({
        data: {
          questionAr: faq.questionAr,
          answerAr: faq.answerAr,
          questionEn: faq.questionEn,
          answerEn: faq.answerEn,
          sortOrder: j + 1,
          blogPostId: upserted.id,
        }
      });
    }
    console.log(`  ✓ Synced to PostgreSQL Database with ID: ${upserted.id}\n`);
  }

  // Update src/lib/blog-data.ts
  const blogDataPath = path.resolve('src/lib/blog-data.ts');
  const currentPosts = require(path.resolve('src/lib/blog-data.ts')).ALL_BLOG_POSTS;
  const pillarSlugs = new Set(ALL_PILLARS.map(p => p.slug));
  const filteredExisting = currentPosts.filter(p => !pillarSlugs.has(p.slug));

  const formattedPillars = ALL_PILLARS.map(p => ({
    id: p.id,
    title: p.titleAr,
    slug: p.slug,
    seoTitle: p.seoTitleAr,
    metaDescription: p.metaDescriptionAr,
    excerpt: p.excerptAr,
    body: p.bodyAr,
    primaryKeyword: p.primaryKeyword,
    secondaryKeywords: p.secondaryKeywords,
    category: p.categoryAr,
    featuredImageUrl: "/logo-icon.png",
    imageMeta: {
      imageFilename: "certified-translation.png",
      imagePath: "/logo-icon.png",
      altText: p.titleAr,
      titleText: p.titleAr,
      caption: p.titleAr,
      primaryKeyword: p.primaryKeyword,
      relatedArticleSlug: p.slug
    },
    publishedAt: p.publishedAt.toISOString(),
    readMinutes: p.readMinutes,
    geoAnswer: p.excerptAr,
    faqs: p.faqs.map(f => ({ question: f.questionAr, answer: f.answerAr })),
    schemas: {
      article: { "@context": "https://schema.org", "@type": "Article", "headline": p.titleAr },
      faq: { "@context": "https://schema.org", "@type": "FAQPage" },
      breadcrumb: { "@context": "https://schema.org", "@type": "BreadcrumbList" }
    },
    author: {
      id: p.authorId,
      name: "د. أحمد منصور",
      title: "كبير المترجمين المعتمدين",
      photoUrl: "/logo-icon.png",
      bio: "خبير معتمد في الترجمة القانونية والدبلوماسية بخبرة تتجاوز 18 عاماً."
    }
  }));

  const merged = [...formattedPillars, ...filteredExisting];

  const headerContent = `// Auto-generated blog dataset containing 100 fully audited & SEO/GEO/AEO optimized Arabic articles
export interface BlogPostItem {
  id: string;
  title: string;
  slug: string;
  seoTitle: string;
  metaDescription: string;
  excerpt: string;
  body: string;
  primaryKeyword: string;
  secondaryKeywords: string[];
  category: string;
  featuredImageUrl: string;
  imageMeta: {
    imageFilename: string;
    imagePath: string;
    altText: string;
    titleText: string;
    caption: string;
    primaryKeyword: string;
    relatedArticleSlug: string;
  };
  publishedAt: string;
  readMinutes: number;
  geoAnswer: string;
  faqs: { question: string; answer: string }[];
  schemas: {
    article: any;
    faq: any;
    breadcrumb: any;
  };
  author: {
    id: string;
    name: string;
    title: string;
    photoUrl: string;
    bio: string;
  };
}
`;

  fs.writeFileSync(blogDataPath, `${headerContent}\nexport const ALL_BLOG_POSTS: BlogPostItem[] = ${JSON.stringify(merged, null, 2)};\n`, 'utf8');
  console.log(`✓ Successfully updated src/lib/blog-data.ts (Total Posts: ${merged.length})`);

  console.log('\n===============================================================');
  if (allPassed) {
    console.log('🎯 ALL 6 PILLARS STRICTLY EXCEED 1200+ WORDS IN ARABIC & ENGLISH!');
  } else {
    console.log('⚠️ WARNING: SOME PILLARS DID NOT MEET THE 1200 WORDS REQUIREMENT');
  }
  console.log('===============================================================\n');
}

syncAll()
  .catch(err => {
    console.error('Sync failed:', err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
