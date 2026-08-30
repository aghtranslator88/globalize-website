const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

const DOMAIN_REPLACEMENTS = [
  { regex: /https:\/\/your-domain\.vercel\.app/g, target: 'https://www.globalizetl.com' },
  { regex: /https:\/\/globalize-website\.vercel\.app/g, target: 'https://www.globalizetl.com' },
  { regex: /http:\/\/globalize-website\.vercel\.app/g, target: 'https://www.globalizetl.com' },
  { regex: /https:\/\/globalize-group\.com/g, target: 'https://www.globalizetl.com' },
  { regex: /http:\/\/globalize-group\.com/g, target: 'https://www.globalizetl.com' },
];

function cleanString(str) {
  if (!str || typeof str !== 'string') return str;
  let result = str;
  for (const rep of DOMAIN_REPLACEMENTS) {
    result = result.replace(rep.regex, rep.target);
  }
  return result;
}

async function cleanDatabase() {
  console.log('=== Cleaning Database from all Vercel and old domain references ===');
  
  // 1. Clean Blog Posts
  const blogPosts = await prisma.blogPost.findMany();
  console.log(`Found ${blogPosts.length} blog posts in DB`);
  for (const post of blogPosts) {
    const cleanedBodyAr = cleanString(post.bodyAr);
    const cleanedBodyEn = cleanString(post.bodyEn);
    const cleanedExcerptAr = cleanString(post.excerptAr);
    const cleanedExcerptEn = cleanString(post.excerptEn);
    
    if (
      cleanedBodyAr !== post.bodyAr ||
      cleanedBodyEn !== post.bodyEn ||
      cleanedExcerptAr !== post.excerptAr ||
      cleanedExcerptEn !== post.excerptEn
    ) {
      await prisma.blogPost.update({
        where: { id: post.id },
        data: {
          bodyAr: cleanedBodyAr,
          bodyEn: cleanedBodyEn,
          excerptAr: cleanedExcerptAr,
          excerptEn: cleanedExcerptEn,
        },
      });
      console.log(`Cleaned BlogPost: ${post.slug}`);
    }
  }

  // 2. Clean Embassies
  const embassies = await prisma.embassy.findMany();
  console.log(`Found ${embassies.length} embassies in DB`);
  for (const embassy of embassies) {
    const cleanedReqAr = cleanString(embassy.requirementsAr);
    const cleanedReqEn = cleanString(embassy.requirementsEn);
    const cleanedUseAr = cleanString(embassy.useCasesAr);
    const cleanedUseEn = cleanString(embassy.useCasesEn);

    if (
      cleanedReqAr !== embassy.requirementsAr ||
      cleanedReqEn !== embassy.requirementsEn ||
      cleanedUseAr !== embassy.useCasesAr ||
      cleanedUseEn !== embassy.useCasesEn
    ) {
      await prisma.embassy.update({
        where: { id: embassy.id },
        data: {
          requirementsAr: cleanedReqAr,
          requirementsEn: cleanedReqEn,
          useCasesAr: cleanedUseAr,
          useCasesEn: cleanedUseEn,
        },
      });
      console.log(`Cleaned Embassy: ${embassy.slug}`);
    }
  }

  // 3. Clean SiteSettings
  const settings = await prisma.siteSetting.findMany();
  console.log(`Found ${settings.length} site settings in DB`);
  for (const setting of settings) {
    const cleanedVal = cleanString(setting.value);
    if (cleanedVal !== setting.value) {
      await prisma.siteSetting.update({
        where: { id: setting.id },
        data: { value: cleanedVal },
      });
      console.log(`Cleaned SiteSetting: ${setting.key}`);
    }
  }

  console.log('=== Database cleanup complete! ===\n');
}

function cleanStaticFiles() {
  console.log('=== Cleaning static data files ===');
  const filesToClean = [
    path.resolve(__dirname, '..', 'src', 'lib', 'embassies-data.ts'),
    path.resolve(__dirname, '..', 'src', 'lib', 'blog-data.ts'),
    path.resolve(__dirname, '..', 'src', 'lib', 'data.ts'),
  ];

  for (const file of filesToClean) {
    if (fs.existsSync(file)) {
      let content = fs.readFileSync(file, 'utf8');
      const originalLength = content.length;
      content = cleanString(content);
      fs.writeFileSync(file, content, 'utf8');
      console.log(`Cleaned static file: ${path.basename(file)} (length: ${originalLength} -> ${content.length})`);
    }
  }
  console.log('=== Static files cleanup complete! ===\n');
}

async function main() {
  try {
    cleanStaticFiles();
    await cleanDatabase();
  } catch (err) {
    console.error('Error during cleanup:', err);
  } finally {
    await prisma.$disconnect();
  }
}

main();
