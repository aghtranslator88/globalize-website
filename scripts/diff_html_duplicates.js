const fs = require('fs');
const path = require('path');

const content = fs.readFileSync(path.resolve(__dirname, '..', 'src', 'lib', 'embassies-data.ts'), 'utf8');

const htmlSlugs = [
  'accredited-office-embassy-cyprus',
  'greek-translation-office-accredited-embassy',
  'translation-certified-by-the-turkish-embassy',
  'translation-italian-embassy'
];

function extractEntry(slug) {
  const match = content.indexOf(`"slug": "${slug}"`);
  if (match === -1) return null;
  const start = content.lastIndexOf('{', match);
  let end = content.indexOf('},\n  {', match);
  if (end === -1) end = content.indexOf('}\n];', match);
  return content.slice(start, end + 1);
}

const report = {};

htmlSlugs.forEach(slug => {
  const clean = extractEntry(slug);
  const withHtml = extractEntry(`${slug}.html`);

  report[slug] = {
    cleanFound: !!clean,
    htmlFound: !!withHtml,
    cleanLength: clean ? clean.length : 0,
    htmlLength: withHtml ? withHtml.length : 0,
    isExactMatch: clean && withHtml ? clean.replace(`"slug": "${slug}"`, `"slug": "${slug}.html"`) === withHtml : false
  };
});

console.log(JSON.stringify(report, null, 2));
