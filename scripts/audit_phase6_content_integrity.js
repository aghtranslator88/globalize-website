const fs = require('fs');
const path = require('path');

const embassiesContent = fs.readFileSync(path.resolve(__dirname, '..', 'src', 'lib', 'embassies-data.ts'), 'utf8');
const blogContent = fs.readFileSync(path.resolve(__dirname, '..', 'src', 'lib', 'blog-data.ts'), 'utf8');

function extractArticles(content, section) {
  const articles = [];
  const entries = content.split(/\n\s*\{\s*\n\s*"id":/);
  
  entries.forEach((entry, idx) => {
    if (idx === 0) return;
    const slugM = entry.match(/"slug":\s*"([^"]+)"/);
    const titleM = entry.match(/"title":\s*"([^"]+)"/);
    const bodyM = entry.match(/"body":\s*"([\s\S]*?)",\n/);

    if (slugM && titleM) {
      articles.push({
        slug: slugM[1],
        title: titleM[1],
        body: bodyM ? bodyM[1] : '',
        section
      });
    }
  });
  return articles;
}

const allArticles = [
  ...extractArticles(embassiesContent, 'embassies'),
  ...extractArticles(blogContent, 'blog')
];

// 1. Check title country vs body content
const countries = [
  { ar: 'قبرص', en: 'cyprus' },
  { ar: 'كوريا', en: 'korea' },
  { ar: 'الصين', en: 'china' },
  { ar: 'ايسلندا', en: 'iceland' },
  { ar: 'الجابون', en: 'gabon' },
  { ar: 'ارمينيا', en: 'armenia' },
  { ar: 'اندونيسيا', en: 'indonesia' },
  { ar: 'فنزويلا', en: 'venezuela' },
  { ar: 'بيرو', en: 'peru' },
  { ar: 'بنما', en: 'panama' },
  { ar: 'تشيلي', en: 'chile' },
  { ar: 'بوليفيا', en: 'bolivia' },
  { ar: 'كوبا', en: 'cuba' },
  { ar: 'الاوروجواي', en: 'uruguay' },
  { ar: 'باراجواي', en: 'paraguay' },
  { ar: 'كولومبيا', en: 'colombia' },
  { ar: 'الاكوادور', en: 'ecuador' },
  { ar: 'جواتيمالا', en: 'guatemala' },
  { ar: 'المانيا', en: 'germany' },
  { ar: 'ايطاليا', en: 'italy' },
  { ar: 'فرنسا', en: 'france' },
  { ar: 'امريكا', en: 'usa' },
  { ar: 'اليابان', en: 'japan' },
  { ar: 'تركيا', en: 'turkey' },
  { ar: 'اليونان', en: 'greece' },
  { ar: 'مالطا', en: 'malta' }
];

const mismatchedArticles = [];
const hardcodedYearArticles = [];

allArticles.forEach(a => {
  // Check hardcoded years
  const yearMatch = a.title.match(/\b(202[0-9])\b/);
  if (yearMatch) {
    hardcodedYearArticles.push({
      slug: a.slug,
      title: a.title,
      section: a.section,
      year: yearMatch[1]
    });
  }

  // Check country mismatch
  for (const c of countries) {
    if (a.title.includes(c.ar) || a.title.toLowerCase().includes(c.en)) {
      // Country is in title, check if body mentions it
      const bodyHasAr = a.body.includes(c.ar);
      const bodyHasEn = a.body.toLowerCase().includes(c.en);
      if (!bodyHasAr && !bodyHasEn) {
        // Find which other country appears in body
        const otherInBody = countries.filter(oc => oc.ar !== c.ar && (a.body.includes(oc.ar) || a.body.toLowerCase().includes(oc.en))).map(oc => oc.ar);
        mismatchedArticles.push({
          slug: a.slug,
          title: a.title,
          expectedCountry: c.ar,
          actualCountryInBody: otherInBody.join(', '),
          section: a.section
        });
        break;
      }
    }
  }
});

const output = {
  mismatchedCount: mismatchedArticles.length,
  hardcodedYearCount: hardcodedYearArticles.length,
  mismatchedArticles,
  hardcodedYearArticles
};

fs.writeFileSync(path.resolve(__dirname, 'phase6_content_integrity_report.json'), JSON.stringify(output, null, 2), 'utf8');
console.log(JSON.stringify({
  mismatchedCount: output.mismatchedCount,
  hardcodedYearCount: output.hardcodedYearCount,
  sampleMismatched: output.mismatchedArticles.slice(0, 10),
  sampleYears: output.hardcodedYearArticles.slice(0, 10)
}, null, 2));
