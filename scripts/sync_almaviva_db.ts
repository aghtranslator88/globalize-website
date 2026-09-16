import { PrismaClient } from '@prisma/client';
import { ALL_BLOG_POSTS } from '../src/lib/blog-data.ts';

const prisma = new PrismaClient();

async function main() {
  const post = ALL_BLOG_POSTS.find(p => p.slug === 'italy-visa-egypt-almaviva');
  if (!post) {
    console.error('Post not found in ALL_BLOG_POSTS');
    return;
  }

  console.log('Updating database record for italy-visa-egypt-almaviva...');
  const updated = await prisma.blogPost.update({
    where: { slug: 'italy-visa-egypt-almaviva' },
    data: {
      titleAr: post.title,
      titleEn: post.titleEn || post.title,
      excerptAr: post.excerpt,
      excerptEn: post.excerptEn || post.excerpt,
      bodyAr: post.body,
      bodyEn: post.bodyEn || post.body,
      categoryAr: post.category,
      categoryEn: post.categoryEn || post.category,
      featuredImageUrl: post.featuredImageUrl,
      readMinutes: post.readMinutes,
      published: true
    }
  });

  console.log('✅ Database updated successfully!');
  console.log('New Title Ar:', updated.titleAr);
  console.log('New Title En:', updated.titleEn);
  console.log('New Body Ar length:', updated.bodyAr?.length);
  console.log('New Body En length:', updated.bodyEn?.length);
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });
