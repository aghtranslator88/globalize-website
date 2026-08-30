const fs = require('fs');
const path = require('path');

const content = fs.readFileSync(path.resolve(__dirname, '..', 'src', 'lib', 'embassies-data.ts'), 'utf8');

// Parse entries
const entries = [];
const blocks = content.split(/\n\s*\{\s*\n\s*"id":/);

blocks.forEach((block, idx) => {
  if (idx === 0) return;
  const slugM = block.match(/"slug":\s*"([^"]+)"/);
  const titleM = block.match(/"title":\s*"([^"]+)"/);
  const bodyM = block.match(/"body":\s*"([\s\S]*?)",\n/);
  const countryNameM = block.match(/"countryName":\s*"([^"]+)"/);

  if (slugM && titleM) {
    entries.push({
      slug: slugM[1],
      title: titleM[1],
      countryName: countryNameM ? countryNameM[1] : '',
      bodyPreview: bodyM ? bodyM[1].slice(0, 300) : ''
    });
  }
});

const report = [];

entries.forEach(e => {
  // Extract main country from title
  const title = e.title;
  const body = e.bodyPreview;

  // Let's check which country the body actually discusses
  const bodyMatch = body.match(/لدى سفارة ([^\s]+ [^\s]+|[^ق\s]+)/);
  const titleMatch = title.match(/سفارة ([^\s]+ [^\s]+|[^ق\s|]+)/);

  const titleCountry = titleMatch ? titleMatch[1].replace('|', '').trim() : '';
  const bodyCountry = bodyMatch ? bodyMatch[1].replace('|', '').trim() : '';

  if (titleCountry && bodyCountry && !title.includes(bodyCountry) && !body.includes(titleCountry)) {
    report.push({
      slug: e.slug,
      title: e.title,
      titleCountry,
      bodyActualCountry: bodyCountry
    });
  }
});

console.log(`Found ${report.length} mismatched embassy content entries:`);
console.log(JSON.stringify(report, null, 2));

fs.writeFileSync(path.resolve(__dirname, 'phase6_embassy_mismatches.json'), JSON.stringify(report, null, 2), 'utf8');
