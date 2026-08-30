const fs = require('fs');
const content = fs.readFileSync('src/lib/embassies-data.ts', 'utf8');

const marker = 'export const ALL_EMBASSY_POSTS: EmbassyPostItem[] =';
const markerIdx = content.indexOf(marker);
const lines = content.split('\n');

// Check line by line: does any line have an odd number of unescaped quotes when it shouldn't, or unescaped characters?
// Or let's see which lines have `"id": "embassy-`
const embassyStarts = [];
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('"id": "embassy-') || lines[i].includes('"slug":')) {
    embassyStarts.push({ line: i + 1, text: lines[i].trim() });
  }
}
console.log('Total embassy slugs/ids found in lines:', embassyStarts.length);

// Let's test slice by slice from line 18 to bottom
for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  // check for unescaped newlines or broken JSON keys
  if (line.includes('  "id":') && !lines[i-1].includes('{') && !lines[i-2].includes('{')) {
    console.log('Possible missing opening brace around line:', i + 1, line);
  }
}
