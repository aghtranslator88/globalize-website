const fs = require('fs');
const path = require('path');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function cleanAll() {
  console.log('================================================================');
  console.log('🧹 EXECUTING FULL SEO/AEO/GEO BOILERPLATE CLEANUP');
  console.log('================================================================\n');

  const blogDataModule = require('../src/lib/blog-data.ts');
  const allPosts = blogDataModule.ALL_BLOG_POSTS;

  let cleanedCount = 0;

  const cleanedPosts = allPosts.map(post => {
    let body = post.body || '';
    let modified = false;

    // 1. Remove the entire "## كيف تخدم هذه الصفحة SEO وAEO وGEO؟" section
    if (body.includes('## كيف تخدم هذه الصفحة SEO')) {
      body = body.replace(/## كيف تخدم هذه الصفحة SEO[\s\S]*?(?=\n## |$)/g, '');
      modified = true;
    }

    // 2. Replace the sentence mentioning SEO/AEO
    if (body.includes('نراعي احتياجات SEO وAEO في محتوى الموقع، لكن في الخدمة نفسها')) {
      body = body.replace(
        /نراعي احتياجات SEO وAEO في محتوى الموقع، لكن في الخدمة نفسها نركز على ما يهم العميل فعليًا: الدقة، السرعة، والوضوح\./g,
        'في خدماتنا نركز على ما يهم العميل فعليًا: الدقة، السرعة، والوضوح.'
      );
      modified = true;
    }

    // Clean any remaining standalone occurrences if any
    if (body.includes('أما من ناحية GEO، فالمحتوى يوضح')) {
      body = body.replace(/أما من ناحية GEO، فالمحتوى يوضح[\s\S]*?(?=\n## |$)/g, '');
      modified = true;
    }

    // Normalize spacing and consecutive newlines
    body = body.replace(/\n{3,}/g, '\n\n').trim();

    if (modified) {
      cleanedCount++;
    }

    return {
      ...post,
      body,
      geoAnswer: (post.geoAnswer || '').replace(/SEO|AEO|GEO/gi, '').trim() || post.excerpt
    };
  });

  console.log(`✓ Cleaned ${cleanedCount} posts in blog dataset`);

  // Write back to src/lib/blog-data.ts
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
  fs.writeFileSync(blogDataPath, `${headerContent}\nexport const ALL_BLOG_POSTS: BlogPostItem[] = ${JSON.stringify(cleanedPosts, null, 2)};\n`, 'utf8');
  console.log('✓ Successfully written cleaned dataset to src/lib/blog-data.ts');

  // Sync with PostgreSQL / Neon Database
  console.log('\n--- SYNCING CLEANED CONTENT TO NEON POSTGRESQL ---');
  let dbAuthor = await prisma.teamMember.findFirst();

  for (let i = 0; i < cleanedPosts.length; i++) {
    const post = cleanedPosts[i];
    await prisma.blogPost.upsert({
      where: { slug: post.slug },
      update: {
        bodyAr: post.body,
        bodyEn: post.body,
        excerptAr: post.excerpt,
        excerptEn: post.excerpt,
        titleAr: post.title,
        titleEn: post.title,
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
        authorId: dbAuthor ? dbAuthor.id : undefined,
        readMinutes: post.readMinutes || 5,
        published: true,
        publishedAt: new Date(post.publishedAt || '2026-08-20'),
      }
    });
  }

  console.log(`✓ All ${cleanedPosts.length} posts updated and cleaned in Neon database!`);
}

cleanAll()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
