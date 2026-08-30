const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

async function purgeHtmlDuplicates() {
  // 1. Remove from Neon DB
  try {
    const deleted = await prisma.embassy.deleteMany({
      where: {
        slug: {
          endsWith: '.html'
        }
      }
    });
    console.log(`Deleted ${deleted.count} .html duplicate records from Neon DB.`);
  } catch (e) {
    console.error('DB delete error:', e.message);
  }

  // 2. Remove from embassies-data.ts
  const dataPath = path.resolve(__dirname, '..', 'src', 'lib', 'embassies-data.ts');
  let content = fs.readFileSync(dataPath, 'utf8');

  const htmlSlugs = [
    'accredited-office-embassy-cyprus.html',
    'greek-translation-office-accredited-embassy.html',
    'translation-certified-by-the-turkish-embassy.html',
    'translation-italian-embassy.html'
  ];

  for (const slug of htmlSlugs) {
    const match = content.indexOf(`"slug": "${slug}"`);
    if (match !== -1) {
      const start = content.lastIndexOf('  {', match);
      let end = content.indexOf('},\n', match);
      if (end !== -1) {
        end += 2; // include '},'
        if (content[end] === '\n') end += 1;
        content = content.slice(0, start) + content.slice(end);
        console.log(`Removed ${slug} from embassies-data.ts`);
      }
    }
  }

  fs.writeFileSync(dataPath, content, 'utf8');
  console.log('Successfully updated embassies-data.ts.');
  await prisma.$disconnect();
}

purgeHtmlDuplicates();
