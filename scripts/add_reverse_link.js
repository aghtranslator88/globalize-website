const fs = require('fs');
const path = require('path');

const filePath = path.resolve(__dirname, '..', 'src', 'lib', 'embassies-data.ts');
let content = fs.readFileSync(filePath, 'utf8');

const targetSlug = 'افضل-مترجم-ايطالي-معتمد-من-السفارة-الايطالية';
const linkText = '\n\n> 📌 **دليل إرشادي مفصل:** هل تبدأ إجراءات السفر؟ اقرأ الآن [دليل التقديم على تأشيرة إيطاليا من مصر عبر ألمافيفا: المستندات والرسوم وحجز الموعد](/ar/blog/italy-visa-egypt-almaviva).';

const marker = 'export const ALL_EMBASSY_POSTS: EmbassyPostItem[] =';
const markerIdx = content.indexOf(marker);
const prefix = content.substring(0, markerIdx + marker.length);
const arrayContent = content.substring(markerIdx + marker.length).trim().replace(/;$/, '');

let embassies = JSON.parse(arrayContent);
const it = embassies.find(e => e.slug === targetSlug);
if (it && !it.body.includes('italy-visa-egypt-almaviva')) {
  it.body += linkText;
  const updatedTs = prefix + ' ' + JSON.stringify(embassies, null, 2) + ';\n';
  fs.writeFileSync(filePath, updatedTs, 'utf8');
  console.log('Added reverse internal link to Italian embassy page in embassies-data.ts!');
} else {
  console.log('Reverse link already present or entry not found.');
}
