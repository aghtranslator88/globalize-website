const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
  const p = await prisma.blogPost.findUnique({
    where: { slug: 'italy-visa-egypt-almaviva' }
  });
  console.log('--- POST VERIFICATION IN NEON DB ---');
  console.log('ID:', p.id);
  console.log('Slug:', p.slug);
  console.log('Title AR:', p.titleAr);
  console.log('Title EN:', p.titleEn);
  console.log('Category EN:', p.categoryEn);
  console.log('Excerpt EN:', p.excerptEn);
  console.log('Body EN length:', p.bodyEn ? p.bodyEn.length : 0);
  console.log('\nFirst 300 chars of Body EN:\n' + p.bodyEn.substring(0, 300));
}

check()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
