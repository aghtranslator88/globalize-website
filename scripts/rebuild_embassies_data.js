const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

async function main() {
  console.log('Fetching all embassies from Neon DB...');
  const embassies = await prisma.embassy.findMany({
    orderBy: { createdAt: 'desc' }
  });

  console.log(`Found ${embassies.length} embassies in database.`);

  const tsContent = `// Auto-generated Embassy Articles Data Dataset
export interface EmbassyPostItem {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  wordCount: number;
  countryCode: string;
  region: 'EUROPE' | 'GULF_ARAB' | 'AMERICAS' | 'ASIA_AUSTRALIA';
  countryName: string;
  requirements: string[];
  useCases: string[];
  faqs: { question: string; answer: string }[];
  indexable: boolean;
}

export const ALL_EMBASSY_POSTS: EmbassyPostItem[] = ${JSON.stringify(embassies, null, 2)};
`;

  const targetPath = path.resolve(__dirname, '..', 'src', 'lib', 'embassies-data.ts');
  fs.writeFileSync(targetPath, tsContent, 'utf8');
  console.log(`Successfully wrote ${embassies.length} embassies to ${targetPath}`);
}

main()
  .catch((err) => {
    console.error('Error rebuilding embassies data:', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
