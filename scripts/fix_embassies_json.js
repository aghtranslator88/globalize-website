const fs = require('fs');
const path = require('path');

const file = path.resolve(__dirname, '..', 'src', 'lib', 'embassies-data.ts');
let content = fs.readFileSync(file, 'utf8');

const blocks = content.split(/\n\s*\{\s*\n\s*"id":/);

console.log(`Found ${blocks.length - 1} blocks.`);
const validObjects = [];

blocks.forEach((b, idx) => {
  if (idx === 0) return;
  let objStr = '{\n    "id":' + b.trim();
  // Strip trailing comma or closing brackets if any
  if (objStr.endsWith(';')) objStr = objStr.slice(0, -1).trim();
  if (objStr.endsWith(']')) objStr = objStr.slice(0, -1).trim();
  if (objStr.endsWith(',')) objStr = objStr.slice(0, -1).trim();

  try {
    const parsed = JSON.parse(objStr);
    validObjects.push(parsed);
  } catch (err) {
    console.log(`Block ${idx} failed JSON parse: ${err.message}`);
    console.log('Snippet of block:', objStr.slice(-100));
  }
});

console.log(`Successfully parsed ${validObjects.length} objects out of ${blocks.length - 1}`);

if (validObjects.length > 0) {
  const cleanContent = `export const ALL_EMBASSY_POSTS: any[] = ${JSON.stringify(validObjects, null, 2)};\n`;
  fs.writeFileSync(file, cleanContent, 'utf8');
  console.log('Regenerated embassies-data.ts with perfectly formatted JSON!');
}
