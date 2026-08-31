const fs = require('fs');
const path = require('path');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  const filePath = 'D:\\VIA Trans data\\extracted\\viatranslation.com-main\\Globalize blogs-ready for publish\\برا الموقع\\globalize-italy-visa-almaviva-egypt-rebuilt.md';
  const rawContent = fs.readFileSync(filePath, 'utf8');

  const slug = 'italy-visa-egypt-almaviva';
  const titleAr = 'كيفية التقديم على تأشيرة إيطاليا من مصر عبر ألمافيفا: الخطوات والمستندات والرسوم';
  const titleEn = 'How to Apply for an Italian Visa from Egypt Through Almaviva: Steps, Documents, and Fees';
  const excerptAr = 'دليل عملي شامل للتقديم على تأشيرة إيطاليا من مصر عبر ألمافيفا (Almaviva Visa Egypt): خطوات حجز الموعد، قائمة المستندات المطلوبة، الرسوم الحالية، متطلبات التأمين الطبي والترجمة المعتمدة.';
  const excerptEn = 'A comprehensive guide on applying for an Italian visa from Egypt through Almaviva: appointment booking, required document checklist, current Schengen fees, travel insurance, and certified Italian translation.';

  const seoTitleAr = 'تأشيرة إيطاليا من مصر عبر ألمافيفا: الخطوات والمستندات والرسوم | جلوباليز';
  const seoTitleEn = 'Italy Visa from Egypt Through Almaviva: Steps, Documents & Fees | Globalize';
  const metaDescAr = 'دليل عملي للتقديم على تأشيرة إيطاليا من مصر عبر ألمافيفا، مع شرح خطوات الحجز والمستندات والرسوم والتأمين والترجمة المعتمدة.';
  const metaDescEn = 'Learn how to apply for an Italy visa from Egypt through Almaviva, including documents, current fees, appointments, insurance, and certified translation.';

  const arStart = rawContent.indexOf('# كيفية التقديم على تأشيرة إيطاليا');
  const enStart = rawContent.indexOf('# English Version');
  const seoMetaStart = rawContent.indexOf('# SEO Metadata');

  let bodyAr = rawContent.substring(arStart, enStart).trim();
  let bodyEn = rawContent.substring(enStart + '# English Version'.length, seoMetaStart).trim();

  // Enhance Arabic internal links
  bodyAr = bodyAr.replace(
    'هل يجب ترجمة المستندات إلى الإيطالية؟',
    'هل يجب ترجمة المستندات إلى الإيطالية؟\n\nإذا كنت بحاجة إلى ترجمة أوراقك الرسمية، يمكنك الاعتماد على [مكتب ترجمة معتمد للسفارة الإيطالية بالقاهرة والإسكندرية](/ar/embassies/افضل-مترجم-ايطالي-معتمد-من-السفارة-الايطالية) لضمان قبول ملفك دون أي ملاحظات.'
  );

  bodyAr = bodyAr.replace(
    'ماذا تفعل إذا كانت لديك مستندات تحتاج إلى ترجمة؟',
    'ماذا تفعل إذا كانت لديك مستندات تحتاج إلى ترجمة؟\n\nتوفر جلوباليز جروب باقة متكاملة من [خدمات الترجمة المعتمدة](/ar/certified) لجميع [المستندات والشهادات الرسمية المطلوبة للسفارات](/ar/documents)، بما في ذلك شهادات الميلاد، عقود الزواج، كشوف الحسابات البنكية، والفيش الجنائي الموجه للقنصلية الإيطالية ومراكز ألمافيفا.'
  );

  if (!bodyAr.includes('/ar/contact')) {
    bodyAr += '\n\n---\n\n### هل تبدأ تجهيز ملف تأشيرة إيطاليا الآن؟\n\nتواصل مع خبراء الترجمة المعتمدة في جلوباليز جروب عبر [صفحة التواصل السريع](/ar/contact) أو تفضل بزيارة أحد [فروعنا المعتمدة في القاهرة والإسكندرية](/ar/branches) لترجمة وتدقيق كافة مستندات السفر والتأشيرة بأعلى معايير الدقة والسرعة.';
  }

  // Enhance English internal links
  bodyEn = bodyEn.replace(
    'Do Italian Visa Documents Need Translation?',
    'Do Italian Visa Documents Need Translation?\n\nIf your file requires official translation, you can rely on our [certified translation for the Italian Embassy in Egypt](/en/embassies/افضل-مترجم-ايطالي-معتمد-من-السفارة-الايطالية) to ensure full compliance with consular guidelines.'
  );

  bodyEn = bodyEn.replace(
    'What If Your Application Contains Documents That Need Translation?',
    'What If Your Application Contains Documents That Need Translation?\n\nGlobalize Group provides comprehensive [certified translation services](/en/certified) for all [official documents and certificates required by embassies](/en/documents), including birth certificates, bank statements, marriage contracts, and police clearance certificates.'
  );

  if (!bodyEn.includes('/en/contact')) {
    bodyEn += '\n\n---\n\n### Preparing Your Italy Visa Application?\n\nGet in touch with our certified translation specialists via our [contact page](/en/contact) or visit any of [our branch locations in Cairo & Alexandria](/en/branches) for prompt and certified document translation services.';
  }

  const faqsAr = [
    {
      question: 'هل ألمافيفا هي التي تقرر قبول أو رفض تأشيرة إيطاليا؟',
      answer: 'لا. ألمافيفا تقدم خدمات دعم واستقبال الطلبات، بينما قرار منح التأشيرة أو رفضها تتخذه الجهة القنصلية المختصة لدى سفارة إيطاليا بالقاهرة.'
    },
    {
      question: 'كم تبلغ رسوم تأشيرة شنغن إيطاليا؟',
      answer: 'وفق جدول الرسوم المنشور حاليًا من سفارة إيطاليا بالقاهرة، تبلغ الرسوم القياسية لتأشيرة شنغن 90 يورو، مع رسوم مخفضة أو إعفاءات لبعض الفئات.'
    },
    {
      question: 'أين أقدم طلب تأشيرة إيطاليا في مصر؟',
      answer: 'توجد مراكز دعم للتأشيرات Almaviva Visa Egypt في القاهرة والإسكندرية، وتنشر سفارة إيطاليا العناوين ومعلومات الحجز الحالية على موقعها الرسمي.'
    },
    {
      question: 'هل أحتاج إلى ترجمة المستندات إلى الإيطالية أو الإنجليزية؟',
      answer: 'يعتمد ذلك على نوع التأشيرة وقائمة المستندات الخاصة بطلبك. إذا كانت الترجمة مطلوبة، يجب إعداد الوثائق وفق متطلبات السفارة لدى مكتب ترجمة معتمد وموثوق.'
    }
  ];

  const faqsEn = [
    {
      question: 'Does Almaviva decide whether an Italian visa is approved?',
      answer: 'No. Almaviva provides visa application support and receives applications, while the competent consular authority at the Italian Embassy makes the visa decision.'
    },
    {
      question: 'How much is the Italian Schengen visa fee?',
      answer: 'According to the current fee table published by the Italian Embassy in Cairo, the standard Schengen visa fee is EUR 90, with reduced fees or exemptions for certain categories.'
    },
    {
      question: 'Where can I submit an Italian visa application in Egypt?',
      answer: 'The Italian Embassy lists Almaviva visa support centers in Cairo and Alexandria and publishes their current addresses and appointment information.'
    },
    {
      question: 'Do I need to translate my documents?',
      answer: "It depends on the visa category and the checklist applicable to your application. If translation is required, documents should be prepared according to the receiving authority's requirements by a certified translation office."
    }
  ];

  const featuredImageUrl = '/images/blog/italy-visa-egypt-almaviva.jpg';

  const schemas = {
    article: {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: titleAr,
      description: excerptAr,
      image: `https://www.globalizetl.com${featuredImageUrl}`,
      author: {
        '@type': 'Organization',
        name: 'جلوباليز جروب للترجمة المعتمدة'
      },
      publisher: {
        '@type': 'Organization',
        name: 'جلوباليز جروب للترجمة المعتمدة',
        logo: {
          '@type': 'ImageObject',
          url: 'https://www.globalizetl.com/logo.png'
        }
      },
      datePublished: '2026-08-31T12:00:00.000Z'
    },
    faq: {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqsAr.map(f => ({
        '@type': 'Question',
        name: f.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: f.answer
        }
      }))
    },
    breadcrumb: {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'الرئيسية',
          item: 'https://www.globalizetl.com/ar'
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'المدونة',
          item: 'https://www.globalizetl.com/ar/blog'
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: titleAr,
          item: `https://www.globalizetl.com/ar/blog/${slug}`
        }
      ]
    }
  };

  const imageMeta = {
    imageFilename: 'italy-visa-egypt-almaviva.jpg',
    imagePath: featuredImageUrl,
    altText: 'التقديم على تأشيرة إيطاليا من مصر عبر ألمافيفا وتجهيز المستندات',
    titleText: 'تأشيرة إيطاليا من مصر عبر ألمافيفا',
    caption: 'دليل عملي للتقديم على تأشيرة إيطاليا من مصر وتجهيز المستندات المطلوبة.',
    primaryKeyword: 'تأشيرة إيطاليا من مصر',
    relatedArticleSlug: slug
  };

  const author = {
    id: 'auth-1',
    name: 'د. أحمد منصور',
    title: 'المدير التنفيذي ومترجم معتمد',
    photoUrl: '',
    bio: 'خبير معتمد في الترجمة القانونية وتأشيرات السفارات والهجرة الدولية.'
  };

  const newBlogPostItem = {
    id: `blog-${slug}`,
    title: titleAr,
    slug: slug,
    seoTitle: seoTitleAr,
    metaDescription: metaDescAr,
    excerpt: excerptAr,
    body: bodyAr,
    primaryKeyword: 'تأشيرة إيطاليا من مصر',
    secondaryKeywords: [
      'المافيفا مصر',
      'حجز تأشيرة إيطاليا',
      'تأشيرة إيطاليا شنغن',
      'مستندات تأشيرة إيطاليا',
      'رسوم تأشيرة إيطاليا',
      'ترجمة مستندات تأشيرة إيطاليا',
      'حجز موعد المافيفا'
    ],
    category: 'تأشيرات وسفارات',
    featuredImageUrl: featuredImageUrl,
    imageMeta: imageMeta,
    publishedAt: '2026-08-31T12:00:00.000Z',
    readMinutes: 8,
    geoAnswer: 'يتم تقديم طلبات التأشيرة الإيطالية من مصر عبر مراكز Almaviva Visa Egypt في القاهرة والإسكندرية لدعم استقبال الطلبات، بينما قرار التأشيرة يصدر من سفارة إيطاليا.',
    faqs: faqsAr,
    schemas: schemas,
    author: author
  };

  // 1. Update Neon DB
  console.log('Syncing post to Neon DB...');
  let teamMember = await prisma.teamMember.findFirst();
  if (!teamMember) {
    teamMember = await prisma.teamMember.create({
      data: {
        nameAr: author.name,
        nameEn: 'Dr. Ahmed Mansour',
        titleAr: author.title,
        titleEn: 'CEO & Certified Translator',
        languagePair: 'جميع اللغات',
        yearsExperience: 15,
        certifications: ['مترجم محلف', 'اعتماد جميع السفارات'],
        isLeadership: true,
        bioAr: author.bio,
        bioEn: 'Certified translation expert for embassies and consular affairs.'
      }
    });
  }

  await prisma.blogPost.upsert({
    where: { slug: slug },
    update: {
      titleAr: titleAr,
      titleEn: titleEn,
      excerptAr: excerptAr,
      excerptEn: excerptEn,
      bodyAr: bodyAr,
      bodyEn: bodyEn,
      categoryAr: 'تأشيرات وسفارات',
      categoryEn: 'Visas & Embassies',
      featuredImageUrl: featuredImageUrl,
      authorId: teamMember.id,
      publishedAt: new Date('2026-08-31T12:00:00.000Z'),
      readMinutes: 8,
      published: true
    },
    create: {
      titleAr: titleAr,
      titleEn: titleEn,
      slug: slug,
      excerptAr: excerptAr,
      excerptEn: excerptEn,
      bodyAr: bodyAr,
      bodyEn: bodyEn,
      categoryAr: 'تأشيرات وسفارات',
      categoryEn: 'Visas & Embassies',
      featuredImageUrl: featuredImageUrl,
      authorId: teamMember.id,
      publishedAt: new Date('2026-08-31T12:00:00.000Z'),
      readMinutes: 8,
      published: true
    }
  });
  console.log('Post saved to Neon DB successfully!');

  // 2. Update src/lib/blog-data.ts
  const blogDataPath = path.resolve(__dirname, '..', 'src', 'lib', 'blog-data.ts');
  let blogDataContent = fs.readFileSync(blogDataPath, 'utf8');

  // Parse existing ALL_BLOG_POSTS
  const marker = 'export const ALL_BLOG_POSTS: BlogPostItem[] =';
  const markerIdx = blogDataContent.indexOf(marker);
  const prefix = blogDataContent.substring(0, markerIdx + marker.length);
  const arrayContent = blogDataContent.substring(markerIdx + marker.length).trim().replace(/;$/, '');

  let posts = eval(arrayContent);
  // Remove if existing
  posts = posts.filter(p => p.slug !== slug);
  // Insert at index 0
  posts.unshift(newBlogPostItem);

  const updatedTs = `${prefix} ${JSON.stringify(posts, null, 2)};\n`;
  fs.writeFileSync(blogDataPath, updatedTs, 'utf8');
  console.log(`Updated src/lib/blog-data.ts with ${slug} at index 0 (Total posts: ${posts.length})`);
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });
