const fs = require('fs');
const path = require('path');

function fixBlogData() {
  const file = path.resolve(__dirname, '..', 'src', 'lib', 'blog-data.ts');
  let content = fs.readFileSync(file, 'utf8');

  // Fix patterns where author is followed by an extra '},'
  content = content.replace(/\s*},\s*\n\s*"publishedAt":/g, ',\n    "publishedAt":');
  fs.writeFileSync(file, content, 'utf8');
}

function fixEmbassiesData() {
  const file = path.resolve(__dirname, '..', 'src', 'lib', 'embassies-data.ts');
  let content = fs.readFileSync(file, 'utf8');

  // Fix orphaned question blocks before indexable
  content = content.replace(/\{\s*"question":[\s\S]*?\}\s*\]\s*,\s*"indexable":\s*true\s*\},/g, '');
  fs.writeFileSync(file, content, 'utf8');
}

fixBlogData();
fixEmbassiesData();
console.log('Fixed syntax patterns.');
