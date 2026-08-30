const fs = require('fs');
const path = require('path');

const file = path.resolve(__dirname, '..', 'src', 'lib', 'embassies-data.ts');
let content = fs.readFileSync(file, 'utf8');

// Strip TypeScript declaration export const ALL_EMBASSY_POSTS: any[] = ...
const jsonLike = content.replace(/^[\s\S]*?=\s*\[/, '[');

try {
  const parsed = eval(jsonLike);
  console.log(`Parsed successfully! Total embassies: ${parsed.length}`);
} catch (err) {
  console.error('Parse Error:', err.message);
  // Find where it breaks by slicing chunks
  const lines = jsonLike.split('\n');
  for (let i = 100; i <= lines.length; i += 100) {
    const chunk = lines.slice(0, i).join('\n') + '\n];';
    try {
      eval(chunk);
    } catch (e) {
      console.log(`Syntax error occurs between line ${i - 100} and ${i}: ${e.message}`);
      // inspect specifically
      for (let j = i - 100; j <= i; j++) {
        const subChunk = lines.slice(0, j).join('\n') + '\n];';
        try {
          eval(subChunk);
        } catch (subErr) {
          if (!subErr.message.includes('Unexpected end of input') && !subErr.message.includes('Unexpected token')) {
            console.log(`Line ${j}:`, lines[j - 1]);
          }
        }
      }
      break;
    }
  }
}
