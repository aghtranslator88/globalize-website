const fs = require('fs');
const path = require('path');

const blogData = require('../src/lib/blog-data.ts').ALL_BLOG_POSTS;

const detailedList = [];

blogData.forEach((post, idx) => {
  const body = post.body || '';
  
  // Pattern 1: The entire "## كيف تخدم هذه الصفحة SEO وAEO وGEO؟" section
  const sectionMatch = body.match(/## كيف تخدم هذه الصفحة SEO[\s\S]*?(?=\n## |$)/);
  
  // Pattern 2: The sentence "نراعي احتياجات SEO وAEO في محتوى الموقع، لكن في الخدمة نفسها نركز على ما يهم العميل فعليًا: الدقة، السرعة، والوضوح."
  const sentenceMatch = body.match(/نراعي احتياجات SEO وAEO في محتوى الموقع، لكن في الخدمة نفسها/);

  if (sectionMatch || sentenceMatch) {
    detailedList.push({
      index: detailedList.length + 1,
      id: post.id,
      slug: post.slug,
      title: post.title,
      exactSectionToDelete: sectionMatch ? sectionMatch[0].trim() : null,
      exactSentenceToClean: sentenceMatch ? 'نراعي احتياجات SEO وAEO في محتوى الموقع، لكن في الخدمة نفسها نركز على ما يهم العميل فعليًا: الدقة، السرعة، والوضوح.' : null
    });
  }
});

console.log(`Total posts with exact text extracted: ${detailedList.length}`);

// Save to a detailed JSON and Markdown file for the user
fs.writeFileSync(
  path.join(__dirname, 'exact_texts_to_delete.json'),
  JSON.stringify(detailedList, null, 2),
  'utf8'
);

let mdContent = `# قائمة النصوص الدقيقة المطلوب حذفها من الـ ${detailedList.length} مقالاً\n\n`;
detailedList.forEach(item => {
  mdContent += `### ${item.index}. [${item.slug}] - ${item.title}\n\n`;
  if (item.exactSectionToDelete) {
    mdContent += `**النص الأول المطلوب حذفه بالكامل:**\n\`\`\`markdown\n${item.exactSectionToDelete}\n\`\`\`\n\n`;
  }
  if (item.exactSentenceToClean) {
    mdContent += `**النص الثاني المطلوب تعديله:**\n- **النص الحالي:** \`${item.exactSentenceToClean}\`\n- **البديل بعد التعديل:** \`في خدماتنا نركز على ما يهم العميل فعليًا: الدقة، السرعة، والوضوح.\`\n\n`;
  }
  mdContent += `---\n\n`;
});

fs.writeFileSync(
  path.join(__dirname, 'exact_texts_to_delete.md'),
  mdContent,
  'utf8'
);

console.log('✓ Files generated: scripts/exact_texts_to_delete.json & scripts/exact_texts_to_delete.md');
