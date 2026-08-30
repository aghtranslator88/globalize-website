const fs = require('fs');
const path = require('path');

const filePath = path.resolve(__dirname, '..', 'src', 'lib', 'blog-data.ts');
const content = fs.readFileSync(filePath, 'utf8');

// Parse ALL_BLOG_POSTS as JS array
const marker = 'export const ALL_BLOG_POSTS: BlogPostItem[] =';
const markerIdx = content.indexOf(marker);
const prefix = content.substring(0, markerIdx + marker.length);
const arrayContent = content.substring(markerIdx + marker.length).trim().replace(/;$/, '');

const posts = eval(arrayContent);
console.log('Successfully evaluated blog posts! Count:', posts.length);

// Re-serialize cleanly using JSON.stringify (which automatically removes duplicate keys and formats cleanly)
const cleanTs = `${prefix} ${JSON.stringify(posts, null, 2)};\n`;
fs.writeFileSync(filePath, cleanTs, 'utf8');
console.log('Successfully cleaned and reformatted src/lib/blog-data.ts!');
