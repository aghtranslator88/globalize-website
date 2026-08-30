const fs = require('fs');
const path = require('path');

const content = fs.readFileSync(path.resolve(__dirname, '..', 'src', 'lib', 'embassies-data.ts'), 'utf8');
const blocks = content.split(/\n\s*\{\s*\n\s*"id":/);
const usInvasions = [];

blocks.forEach((b, idx) => {
  if (idx === 0) return;
  const slugM = b.match(/"slug":\s*"([^"]+)"/);
  const titleM = b.match(/"title":\s*"([^"]+)"/);
  const bodyM = b.match(/"body":\s*"([\s\S]*?)",\n/);

  if (slugM && titleM && bodyM) {
    const slug = slugM[1];
    const title = titleM[1];
    const body = bodyM[1];

    if (!title.includes('أمريكا') && !title.includes('امريكا') && !slug.includes('american') && !slug.includes('us-embassy') && body.includes('سفارة أمريكا')) {
      usInvasions.push({
        slug,
        title,
        bodyStartsDiscussing: 'سفارة أمريكا (USA Embassy)'
      });
    }
  }
});

console.log(`Found ${usInvasions.length} pages where body discusses USA instead of page topic:`);
console.log(JSON.stringify(usInvasions, null, 2));

fs.writeFileSync(path.resolve(__dirname, 'phase6_us_boilerplate_infections.json'), JSON.stringify(usInvasions, null, 2), 'utf8');
