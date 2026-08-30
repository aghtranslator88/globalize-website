const fs = require('fs');
const path = require('path');

const mdPath = path.resolve(__dirname, '..', 'data', 'certified-translation-us-embassy-cairo-globalize.md');
const mdContent = fs.readFileSync(mdPath, 'utf8');

const arBodyMatch = mdContent.match(/## ARABIC ARTICLE\r?\n\r?\n([\s\S]*?)\r?\n\r?\n---\r?\n\r?\n## ENGLISH ARTICLE/);
const bodyAr = arBodyMatch ? arBodyMatch[1].trim() : '';

const blogDataFile = path.resolve(__dirname, '..', 'src', 'lib', 'blog-data.ts');
let blogDataContent = fs.readFileSync(blogDataFile, 'utf8');

// Replace the first post's body
const postSlugMatch = blogDataContent.indexOf('"slug": "certified-translation-us-embassy-cairo"');
if (postSlugMatch !== -1) {
  const bodyStartMatch = blogDataContent.indexOf('"body":', postSlugMatch);
  if (bodyStartMatch !== -1) {
    const nextFieldMatch = blogDataContent.indexOf('"primaryKeyword":', bodyStartMatch);
    if (nextFieldMatch !== -1) {
      const before = blogDataContent.slice(0, bodyStartMatch);
      const after = blogDataContent.slice(nextFieldMatch);
      blogDataContent = before + `"body": ${JSON.stringify(bodyAr)},\n    ` + after;
      fs.writeFileSync(blogDataFile, blogDataContent, 'utf8');
      console.log('Updated post body in blog-data.ts successfully!');
    }
  }
}
