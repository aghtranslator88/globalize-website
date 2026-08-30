const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();
const mappings = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'phase3_phase4_mapping_table.json'), 'utf8'));

async function applyMappings() {
  console.log(`Starting execution of ${mappings.length} slug mappings...`);

  const blogDataPath = path.resolve(__dirname, '..', 'src', 'lib', 'blog-data.ts');
  const embassiesDataPath = path.resolve(__dirname, '..', 'src', 'lib', 'embassies-data.ts');

  let blogContent = fs.readFileSync(blogDataPath, 'utf8');
  let embassiesContent = fs.readFileSync(embassiesDataPath, 'utf8');

  for (const m of mappings) {
    const { oldSlug, newSlug, section, title } = m;
    if (oldSlug === newSlug) continue;

    console.log(`Applying [${section}]: "${oldSlug}" -> "${newSlug}"`);

    // 1. Update Neon DB
    try {
      if (section === 'blog') {
        const existing = await prisma.blogPost.findUnique({ where: { slug: oldSlug } });
        if (existing) {
          const targetExists = await prisma.blogPost.findUnique({ where: { slug: newSlug } });
          if (targetExists) {
            // Delete duplicate old record
            await prisma.blogPost.delete({ where: { slug: oldSlug } });
            console.log(`  DB: Removed duplicate blog record "${oldSlug}" (target "${newSlug}" already exists)`);
          } else {
            await prisma.blogPost.update({
              where: { slug: oldSlug },
              data: { slug: newSlug }
            });
            console.log(`  DB: Renamed blog "${oldSlug}" -> "${newSlug}"`);
          }
        }
      } else if (section === 'embassies') {
        const existing = await prisma.embassy.findUnique({ where: { slug: oldSlug } });
        if (existing) {
          const targetExists = await prisma.embassy.findUnique({ where: { slug: newSlug } });
          if (targetExists) {
            // Delete duplicate old record
            await prisma.embassy.delete({ where: { slug: oldSlug } });
            console.log(`  DB: Removed duplicate embassy record "${oldSlug}" (target "${newSlug}" already exists)`);
          } else {
            await prisma.embassy.update({
              where: { slug: oldSlug },
              data: { slug: newSlug }
            });
            console.log(`  DB: Renamed embassy "${oldSlug}" -> "${newSlug}"`);
          }
        }
      }
    } catch (dbErr) {
      console.warn(`  DB Warning for "${oldSlug}":`, dbErr.message);
    }

    // 2. Update Data Files
    if (section === 'blog') {
      // If old is a duplicate of an existing new slug in the file, remove the duplicate entry
      if (blogContent.includes(`"slug": "${newSlug}"`) && blogContent.includes(`"slug": "${oldSlug}"`)) {
        const match = blogContent.indexOf(`"slug": "${oldSlug}"`);
        const start = blogContent.lastIndexOf('  {', match);
        let end = blogContent.indexOf('},\n', match);
        if (end !== -1) {
          end += 2;
          if (blogContent[end] === '\n') end += 1;
          blogContent = blogContent.slice(0, start) + blogContent.slice(end);
          console.log(`  Data: Purged duplicate blog entry "${oldSlug}"`);
        }
      } else {
        blogContent = blogContent.replace(new RegExp(`"slug":\\s*"${oldSlug}"`, 'g'), `"slug": "${newSlug}"`);
      }
    } else if (section === 'embassies') {
      if (embassiesContent.includes(`"slug": "${newSlug}"`) && embassiesContent.includes(`"slug": "${oldSlug}"`)) {
        const match = embassiesContent.indexOf(`"slug": "${oldSlug}"`);
        const start = embassiesContent.lastIndexOf('  {', match);
        let end = embassiesContent.indexOf('},\n', match);
        if (end !== -1) {
          end += 2;
          if (embassiesContent[end] === '\n') end += 1;
          embassiesContent = embassiesContent.slice(0, start) + embassiesContent.slice(end);
          console.log(`  Data: Purged duplicate embassy entry "${oldSlug}"`);
        }
      } else {
        embassiesContent = embassiesContent.replace(new RegExp(`"slug":\\s*"${oldSlug}"`, 'g'), `"slug": "${newSlug}"`);
      }
    }
  }

  // 3. Update all internal links across blog and embassy bodies
  mappings.forEach(m => {
    const oldPathAr = `/ar/${m.section}/${m.oldSlug}`;
    const newPathAr = `/ar/${m.section}/${m.newSlug}`;
    const oldPathEn = `/en/${m.section}/${m.oldSlug}`;
    const newPathEn = `/en/${m.section}/${m.newSlug}`;
    const oldBare = `/${m.section}/${m.oldSlug}`;
    const newBare = `/${m.section}/${m.newSlug}`;

    blogContent = blogContent.split(oldPathAr).join(newPathAr);
    blogContent = blogContent.split(oldPathEn).join(newPathEn);
    blogContent = blogContent.split(oldBare).join(newBare);

    embassiesContent = embassiesContent.split(oldPathAr).join(newPathAr);
    embassiesContent = embassiesContent.split(oldPathEn).join(newPathEn);
    embassiesContent = embassiesContent.split(oldBare).join(newBare);
  });

  fs.writeFileSync(blogDataPath, blogContent, 'utf8');
  fs.writeFileSync(embassiesDataPath, embassiesContent, 'utf8');

  console.log('Successfully updated blog-data.ts and embassies-data.ts and synced DB.');
  await prisma.$disconnect();
}

applyMappings();
