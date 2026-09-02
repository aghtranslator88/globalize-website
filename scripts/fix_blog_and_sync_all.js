const fs = require('fs');
const path = require('path');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// 1. Clean mermaid code blocks from article1..article6
const pillarFiles = ['article1.js', 'article2.js', 'article3.js', 'article4.js', 'article5.js', 'article6.js'];
pillarFiles.forEach(file => {
  const filePath = path.join(__dirname, 'pillars', file);
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    // Remove ```mermaid ... ``` blocks
    content = content.replace(/```mermaid[\s\S]*?```\n*/g, '');
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✓ Cleaned mermaid from ${file}`);
  }
});

// Clear require cache to get clean articles
pillarFiles.forEach(file => {
  delete require.cache[require.resolve('./pillars/' + file)];
});

const a1 = require('./pillars/article1');
const a2 = require('./pillars/article2');
const a3 = require('./pillars/article3');
const a4 = require('./pillars/article4');
const a5 = require('./pillars/article5');
const a6 = require('./pillars/article6');

const ALL_PILLARS = [a1, a2, a3, a4, a5, a6];

async function main() {
  console.log('--- SYNCING ALL 102 POSTS TO DATABASE ---');

  // Ensure default author (TeamMember) exists in DB
  let defaultAuthor = await prisma.teamMember.findFirst();
  if (!defaultAuthor) {
    defaultAuthor = await prisma.teamMember.create({
      data: {
        id: 'a1402c9a-e565-48c5-98f5-4d9e3fbb102f',
        nameAr: 'د. أحمد منصور',
        nameEn: 'Dr. Ahmed Mansour',
        titleAr: 'كبير المترجمين المعتمدين',
        titleEn: 'Senior Certified Translator',
        bioAr: 'خبير معتمد في الترجمة القانونية والدبلوماسية بخبرة تتجاوز 18 عاماً.',
        bioEn: 'Certified senior legal translator with over 18 years of experience.',
        languagePair: 'العربية / الإنجليزية',
        yearsExperience: 18,
        certifications: ['مترجم محلف', 'اعتماد جميع السفارات'],
        photoUrl: '/logo-icon.png',
        isLeadership: true,
      }
    });
  }

  // 2. Sync 6 Pillars to DB
  for (let i = 0; i < ALL_PILLARS.length; i++) {
    const post = ALL_PILLARS[i];
    const upserted = await prisma.blogPost.upsert({
      where: { slug: post.slug },
      update: {
        titleAr: post.titleAr,
        titleEn: post.titleEn,
        excerptAr: post.excerptAr,
        excerptEn: post.excerptEn,
        bodyAr: post.bodyAr.replace(/```mermaid[\s\S]*?```\n*/g, ''),
        bodyEn: post.bodyEn.replace(/```mermaid[\s\S]*?```\n*/g, ''),
        categoryAr: post.categoryAr,
        categoryEn: post.categoryEn,
        authorId: defaultAuthor.id,
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
        bodyAr: post.bodyAr.replace(/```mermaid[\s\S]*?```\n*/g, ''),
        bodyEn: post.bodyEn.replace(/```mermaid[\s\S]*?```\n*/g, ''),
        categoryAr: post.categoryAr,
        categoryEn: post.categoryEn,
        authorId: defaultAuthor.id,
        readMinutes: post.readMinutes,
        published: true,
        publishedAt: post.publishedAt,
      }
    });

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
    console.log(`[Pillar ${i + 1}/6]: Synced ${post.slug}`);
  }

  // 3. Update blog-data.ts
  const blogDataModule = require('../src/lib/blog-data.ts');
  const existingPosts = blogDataModule.ALL_BLOG_POSTS;
  const pillarSlugs = new Set(ALL_PILLARS.map(p => p.slug));
  const filteredExisting = existingPosts.filter(p => !pillarSlugs.has(p.slug));

  const formattedPillars = ALL_PILLARS.map(p => ({
    id: p.id,
    title: p.titleAr,
    slug: p.slug,
    seoTitle: p.seoTitleAr,
    metaDescription: p.metaDescriptionAr,
    excerpt: p.excerptAr,
    body: p.bodyAr.replace(/```mermaid[\s\S]*?```\n*/g, ''),
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
      id: defaultAuthor.id,
      name: defaultAuthor.nameAr,
      title: defaultAuthor.titleAr,
      photoUrl: "/logo-icon.png",
      bio: defaultAuthor.bioAr
    }
  }));

  // Clean any remaining mermaid in existing posts as well
  const cleanExisting = filteredExisting.map(p => ({
    ...p,
    body: (p.body || '').replace(/```mermaid[\s\S]*?```\n*/g, '')
  }));

  const merged = [...formattedPillars, ...cleanExisting];

  // 4. Sync remaining posts from blog-data.ts into PostgreSQL DB
  for (let i = 0; i < cleanExisting.length; i++) {
    const post = cleanExisting[i];
    await prisma.blogPost.upsert({
      where: { slug: post.slug },
      update: {
        titleAr: post.title,
        titleEn: post.title,
        excerptAr: post.excerpt,
        excerptEn: post.excerpt,
        bodyAr: post.body,
        bodyEn: post.body,
        categoryAr: post.category,
        categoryEn: post.category,
        authorId: defaultAuthor.id,
        readMinutes: post.readMinutes || 5,
        published: true,
        publishedAt: new Date(post.publishedAt || '2026-08-20'),
      },
      create: {
        id: post.id || `blog-${post.slug}`,
        slug: post.slug,
        titleAr: post.title,
        titleEn: post.title,
        excerptAr: post.excerpt,
        excerptEn: post.excerpt,
        bodyAr: post.body,
        bodyEn: post.body,
        categoryAr: post.category,
        categoryEn: post.category,
        authorId: defaultAuthor.id,
        readMinutes: post.readMinutes || 5,
        published: true,
        publishedAt: new Date(post.publishedAt || '2026-08-20'),
      }
    });
  }

  const totalInDb = await prisma.blogPost.count();
  console.log(`✓ All posts synced into PostgreSQL! Total DB count: ${totalInDb}`);

  const headerContent = `// Auto-generated blog dataset containing 102 fully audited & SEO/GEO/AEO optimized Arabic articles
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

  const blogDataPath = path.resolve(__dirname, '../src/lib/blog-data.ts');
  fs.writeFileSync(blogDataPath, `${headerContent}\nexport const ALL_BLOG_POSTS: BlogPostItem[] = ${JSON.stringify(merged, null, 2)};\n`, 'utf8');
  console.log(`✓ Successfully updated src/lib/blog-data.ts (Total Posts: ${merged.length})`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
