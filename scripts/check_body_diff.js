const fs = require('fs');
const path = require('path');

const content = fs.readFileSync(path.resolve(__dirname, '..', 'src', 'lib', 'embassies-data.ts'), 'utf8');

function extractEntry(slug) {
  const match = content.indexOf(`"slug": "${slug}"`);
  if (match === -1) return null;
  const start = content.lastIndexOf('{', match);
  let end = content.indexOf('},\n  {', match);
  if (end === -1) end = content.indexOf('}\n];', match);
  return content.slice(start, end + 1);
}

const clean = extractEntry('accredited-office-embassy-cyprus');
const withHtml = extractEntry('accredited-office-embassy-cyprus.html');

console.log('Clean ID/Slug:', clean.slice(0, 150));
console.log('HTML ID/Slug:', withHtml.slice(0, 150));

// Check if body differs
const cleanBody = clean.match(/"body": "([\s\S]*?)",\n/)[1];
const htmlBody = withHtml.match(/"body": "([\s\S]*?)",\n/)[1];

console.log('Body is identical?', cleanBody === htmlBody);
