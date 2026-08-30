const fs = require('fs');
const path = require('path');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  const rawContent = fs.readFileSync(path.resolve(__dirname, 'embassies_from_46a2844.ts'), 'utf8');

  // Let's load the Phase 3/4 mapping table
  const mappingTable = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'phase3_phase4_mapping_table.json'), 'utf8'));
  const embassyMappings = new Map();
  for (const m of mappingTable) {
    if (m.section === 'embassies') {
      embassyMappings.set(m.oldSlug, m.newSlug);
    }
  }

  // Find all objects starting with { "id": "embassy- or { id: "embassy-
  // Let's split or extract by looking for "id": "embassy-
  const lines = rawContent.split('\n');
  const embassyBlocks = [];
  let currentBlock = [];
  let recording = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.includes('"id": "') || line.includes('"id": "embassy-') || line.includes('id: "embassy-')) {
      if (currentBlock.length > 0) {
        embassyBlocks.push(currentBlock.join('\n'));
      }
      currentBlock = [line];
      recording = true;
    } else if (recording) {
      if (line.trim() === '},' || line.trim() === '}' || line.trim() === '];') {
        currentBlock.push(line);
      } else {
        currentBlock.push(line);
      }
    }
  }
  if (currentBlock.length > 0) {
    embassyBlocks.push(currentBlock.join('\n'));
  }

  console.log(`Found ${embassyBlocks.length} raw embassy blocks.`);

  const validEmbassies = [];
  const seenSlugs = new Set();

  for (let idx = 0; idx < embassyBlocks.length; idx++) {
    let block = embassyBlocks[idx].trim();
    // Ensure block starts with { and ends with }
    if (!block.startsWith('{')) {
      block = '{' + block;
    }
    if (block.endsWith('},')) {
      block = block.slice(0, -1);
    }
    if (block.endsWith('];')) {
      block = block.slice(0, -2).trim();
      if (block.endsWith('}')) {
        // ok
      } else if (block.endsWith('},')) {
        block = block.slice(0, -1);
      }
    }

    // Attempt to sanitize block
    // Sometimes there are orphaned FAQs inside, let's test JSON parse or eval
    let obj = null;
    try {
      obj = eval('(' + block + ')');
    } catch (err) {
      // Try to fix orphaned faqs or bad brackets
      // Let's see if block has multiple "indexable": true
      const parts = block.split('"indexable": true');
      if (parts.length > 1) {
        const cleanPart = parts[0] + '"indexable": true\n}';
        try {
          obj = eval('(' + cleanPart + ')');
        } catch (e2) {
          console.log(`Block ${idx} parse error:`, err.message);
          continue;
        }
      } else {
        console.log(`Block ${idx} parse error:`, err.message);
        continue;
      }
    }

    if (!obj || !obj.slug) continue;

    // Apply Phase 3 & 4 slug mapping if exists
    if (embassyMappings.has(obj.slug)) {
      console.log(`Renaming slug: "${obj.slug}" -> "${embassyMappings.get(obj.slug)}"`);
      obj.slug = embassyMappings.get(obj.slug);
    }

    // Skip .html slugs (Phase 2) and duplicate suffixes like -2, -3, -4, -5 if primary exists
    if (obj.slug.endsWith('.html')) {
      console.log(`Skipping legacy .html slug: ${obj.slug}`);
      continue;
    }

    if (seenSlugs.has(obj.slug)) {
      console.log(`Skipping duplicate slug: ${obj.slug}`);
      continue;
    }

    // Clean up requirements, useCases, faqs
    if (!Array.isArray(obj.requirements)) obj.requirements = [];
    if (!Array.isArray(obj.useCases)) obj.useCases = [];
    if (!Array.isArray(obj.faqs)) obj.faqs = [];

    // Ensure faqs is array of objects { question, answer }
    obj.faqs = obj.faqs.filter(f => f && typeof f.question === 'string' && typeof f.answer === 'string');

    seenSlugs.add(obj.slug);
    validEmbassies.push(obj);
  }

  console.log(`Extracted ${validEmbassies.length} clean, unique embassy records.`);

  // Write out clean src/lib/embassies-data.ts
  const outputTs = `// Auto-generated Embassy Articles Data Dataset
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

export const ALL_EMBASSY_POSTS: EmbassyPostItem[] = ${JSON.stringify(validEmbassies, null, 2)};
`;

  const targetPath = path.resolve(__dirname, '..', 'src', 'lib', 'embassies-data.ts');
  fs.writeFileSync(targetPath, outputTs, 'utf8');
  console.log(`Wrote ${validEmbassies.length} embassies to ${targetPath}`);

  // Also sync to Neon DB so DB and static dataset are 100% in parity
  console.log('Syncing to Neon DB...');
  for (const emb of validEmbassies) {
    await prisma.embassy.upsert({
      where: { slug: emb.slug },
      update: {
        title: emb.title,
        excerpt: emb.excerpt,
        body: emb.body,
        wordCount: emb.wordCount || 1000,
        countryCode: emb.countryCode || 'eg',
        region: emb.region || 'EUROPE',
        countryName: emb.countryName || 'عام',
        requirements: emb.requirements,
        useCases: emb.useCases,
        faqs: emb.faqs,
        indexable: emb.indexable ?? true
      },
      create: {
        id: emb.id || `embassy-${emb.slug}`,
        slug: emb.slug,
        title: emb.title,
        excerpt: emb.excerpt,
        body: emb.body,
        wordCount: emb.wordCount || 1000,
        countryCode: emb.countryCode || 'eg',
        region: emb.region || 'EUROPE',
        countryName: emb.countryName || 'عام',
        requirements: emb.requirements,
        useCases: emb.useCases,
        faqs: emb.faqs,
        indexable: emb.indexable ?? true
      }
    });
  }
  console.log('Neon DB sync complete!');
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });
