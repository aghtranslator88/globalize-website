const fs = require('fs');
const path = require('path');

const blogFile = path.resolve(__dirname, '..', 'src', 'lib', 'blog-data.ts');
let blog = fs.readFileSync(blogFile, 'utf8');

// Normalize blog syntax
// Replace `    }\n  },\n    "publishedAt":` with `    },\n    "publishedAt":`
blog = blog.replace(/\}\s*\n\s*\}\s*,\s*\n\s*"publishedAt":/g, '    },\n    "publishedAt":');
fs.writeFileSync(blogFile, blog, 'utf8');

// Embassies
const embFile = path.resolve(__dirname, '..', 'src', 'lib', 'embassies-data.ts');
let emb = fs.readFileSync(embFile, 'utf8');

// Fix any duplicated question segments
emb = emb.replace(/,\s*\n\s*\{\s*\n\s*"question":\s*"ما هي مدة تنفيذ[\s\S]*?"indexable": true\s*\n\s*\}/g, '');
fs.writeFileSync(embFile, emb, 'utf8');

console.log('Normalized blog and embassies data.');
