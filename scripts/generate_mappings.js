const fs = require('fs');
const path = require('path');

const report = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'audit_report.json'), 'utf8'));

// Slug slugifier helper
function slugify(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// Translation dictionaries for common Arabic terms in slugs
const arabicToEnglishMap = {
  'ترجمة-معتمدة': 'certified-translation',
  'مكتب-ترجمة-معتمد': 'certified-translation-office',
  'ترجمة-معتمدة-من-سفارة': 'certified-translation-embassy',
  'سفارة': 'embassy',
  'سفاره': 'embassy',
  'قنصلية': 'consulate',
  'قنصليه': 'consulate',
  'تصديق': 'legalization',
  'فيزا': 'visa',
  'تاشيرة': 'visa',
  'تأشيرة': 'visa',
  'شهادة-ميلاد': 'birth-certificate-translation',
  'شهادة-تخرج': 'graduation-certificate-translation',
  'عقد-زواج': 'marriage-certificate-translation',
  'سجل-تجاري': 'commercial-registry-translation',
  'بطاقة-ضريبية': 'tax-card-translation',
  'فيش-وتشبيه': 'criminal-record-translation',
  'كشف-حساب-بنكي': 'bank-statement-translation',
  'المانيا': 'germany',
  'ايطاليا': 'italy',
  'فرنسا': 'france',
  'امريكا': 'usa',
  'الولايات-المتحدة': 'usa',
  'اسبانيا': 'spain',
  'تركيا': 'turkey',
  'اليونان': 'greece',
  'بريطانيا': 'uk',
  'كندا': 'canada',
  'استراليا': 'australia',
  'الصين': 'china',
  'اليابان': 'japan',
  'كوريا': 'korea',
  'روسيا': 'russia',
  'هولندا': 'netherlands',
  'النمسا': 'austria',
  'سويسرا': 'switzerland',
  'بلجيكا': 'belgium',
  'بولندا': 'poland',
  'التشيك': 'czech',
  'السويد': 'sweden',
  'النرويج': 'norway',
  'الدنمارك': 'denmark',
  'فنلندا': 'finland',
  'البرتغال': 'portugal',
  'رومانيا': 'romania',
  'المجر': 'hungary',
  'ايرلندا': 'ireland',
  'قبرص': 'cyprus',
  'البرازيل': 'brazil',
  'الارجنتين': 'argentina',
  'جنوب-افريقيا': 'south-africa',
  'الهند': 'india',
  'الامارات': 'uae',
  'السعودية': 'saudi-arabia',
  'الكويت': 'kuwait',
  'قطر': 'qatar',
  'عمان': 'oman',
  'البحرين': 'bahrain',
  'الاردن': 'jordan',
  'لبنان': 'lebanon',
  'العراق': 'iraq',
  'المغرب': 'morocco',
  'الجزائر': 'algeria',
  'تونس': 'tunisia',
  'ليبيا': 'libya',
  'السودان': 'sudan',
};

const mappingTable = [];

for (const item of report.needsChangeDetails) {
  let cleanSlug = item.slug;

  // Remove .html
  if (cleanSlug.endsWith('.html')) {
    cleanSlug = cleanSlug.replace(/\.html$/i, '');
  }

  // If already clean ASCII
  if (/^[a-z0-9-]+$/.test(cleanSlug) && !/--/.test(cleanSlug)) {
    // Just stripped .html
  } else {
    // Generate clean semantic English slug
    let converted = cleanSlug.toLowerCase();
    
    // Replace known Arabic phrases
    for (const [ar, en] of Object.entries(arabicToEnglishMap)) {
      converted = converted.split(ar).join(en);
    }

    // If still contains Arabic, convert based on category and title/meta
    if (/[\u0600-\u06FF]/.test(converted)) {
      if (item.meta && item.meta.titleEn) {
        converted = slugify(item.meta.titleEn);
      } else if (item.meta && item.meta.nameEn) {
        converted = slugify(item.meta.nameEn);
      } else {
        // Fallback romanization / semantic naming
        converted = converted
          .replace(/[\u0600-\u06FF]+/g, 'translation-guide')
          .replace(/-+/g, '-');
      }
    }

    cleanSlug = slugify(converted);
    if (!cleanSlug) cleanSlug = `guide-${Date.now().toString().slice(-4)}`;
  }

  const prefix = item.category === 'Blog' ? '/blog/' : item.category === 'Embassy' ? '/embassies/' : item.category === 'Document' ? '/documents/' : item.category === 'GovEntity' ? '/government/' : '/';

  mappingTable.push({
    category: item.category,
    oldSlug: item.slug,
    newSlug: cleanSlug,
    oldUrlAr: `/ar${prefix}${item.slug}`,
    oldUrlEn: `/en${prefix}${item.slug}`,
    newUrlAr: `/ar${prefix}${cleanSlug}`,
    newUrlEn: `/en${prefix}${cleanSlug}`,
    reasons: item.reasons,
    redirectRequired: 'HTTP 301 Permanent Redirect'
  });
}

fs.writeFileSync(path.resolve(__dirname, 'mapping_table.json'), JSON.stringify(mappingTable, null, 2), 'utf8');
console.log(`Generated ${mappingTable.length} proposed URL mappings.`);
