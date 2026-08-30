const fs = require('fs');
const path = require('path');

const embassiesContent = fs.readFileSync(path.resolve(__dirname, '..', 'src', 'lib', 'embassies-data.ts'), 'utf8');
const blogContent = fs.readFileSync(path.resolve(__dirname, '..', 'src', 'lib', 'blog-data.ts'), 'utf8');

function extractBody(slug, content) {
  const match = content.indexOf(`"slug": "${slug}"`);
  if (match === -1) return null;
  const bodyStart = content.indexOf('"body": "', match);
  if (bodyStart === -1) return null;
  const bodyEnd = content.indexOf('",\n', bodyStart);
  return content.slice(bodyStart + 9, bodyEnd);
}

const clusters = {
  german: [
    'germany-embassy',
    'german-embassy',
    'german-embassy-in-cairo',
    'german-embassy-in-alexandria',
    'certified-translation-office-from-the-german-embassy-in-giza',
    'certified-translation-offices-of-the-german-embassy-in-jordan',
    'the-office-via-translation-for-translation-certified-by-the-german-embassy',
    'مكتب-ترجمة-فيا-ترنسلشن-سفارة-المانيا',
    'مكتب-ترجمة-معتمد-السفارة-الألمانية',
    'مكتب-ترجمة-معتمد-من-السفارة-الألمانية',
    'الترجمة-سفارة-المانيا-بالقاهرة'
  ],
  us: [
    'us-embassy-cairo',
    'american-embassy',
    'مكتب-ترجمة-السفارة-الامريكية',
    'مكتب-ترجمة-معتمد-من-السفارة-الامريكية',
    'مكتب-ترجمة-معتمد-من-السفارة-الامريكية-2',
    'مكتب-ترجمة-معتمدة-من-السفارة-الامريكي',
    'translation-offices-us-embassy-in-alexandria',
    'translation-offices-american-embassy-in-jeddah',
    'certified-translation-office-at-the-american-embassy-in-dubai',
    'accredited-translation-offices-of-the-us-embassy-in-jordan'
  ],
  cyprus: [
    'accredited-office-embassy-cyprus',
    'مكتب-ترجمة-سفارة-قبرص',
    'مكتب-ترجمة-معتمد-من-سفارة-قبرص'
  ],
  italy: [
    'translation-italian-embassy',
    'italian-embassy',
    'مكتب-ترجمة-معتمد-من-السفارة-الايطالية',
    'افضل-مترجم-ايطالي-معتمد-من-السفارة-الا'
  ],
  turkey: [
    'translation-certified-by-the-turkish-embassy',
    'turkish-embassy',
    'a-translation-office-approved-by-the-turkish-embassy-in-riyadh',
    'مكتب-ترجمة-معتمد-من-السفارة-التركية'
  ]
};

const clusterReport = {};

for (const [name, slugs] of Object.entries(clusters)) {
  clusterReport[name] = [];
  slugs.forEach(slug => {
    const body = extractBody(slug, embassiesContent) || extractBody(slug, blogContent);
    clusterReport[name].push({
      slug,
      found: !!body,
      length: body ? body.length : 0,
      preview: body ? body.slice(0, 100) : ''
    });
  });
}

console.log(JSON.stringify(clusterReport, null, 2));
fs.writeFileSync(path.resolve(__dirname, 'cluster_audit_report.json'), JSON.stringify(clusterReport, null, 2), 'utf8');
