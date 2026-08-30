const fs = require('fs');
const path = require('path');

async function updateStaticDatasets() {
  const mdPath = path.resolve(__dirname, '..', 'data', 'certified-translation-us-embassy-cairo-globalize.md');
  const mdContent = fs.readFileSync(mdPath, 'utf8');

  // Extract Arabic Body and English Body
  const arBodyMatch = mdContent.match(/## ARABIC ARTICLE\r?\n\r?\n([\s\S]*?)\r?\n\r?\n---\r?\n\r?\n## ENGLISH ARTICLE/);
  const enBodyMatch = mdContent.match(/## ENGLISH ARTICLE\r?\n\r?\n([\s\S]*?)\r?\n\r?\n---\r?\n\r?\n## INTERNAL LINK MAP/);

  const bodyAr = arBodyMatch ? arBodyMatch[1].trim() : '';
  const bodyEn = enBodyMatch ? enBodyMatch[1].trim() : '';

  const newBlogPost = {
    id: "blog-us-embassy-cairo",
    title: "ترجمة معتمدة للسفارة الأمريكية في القاهرة: كيف تجهز مستنداتك بدون تأخير؟",
    slug: "certified-translation-us-embassy-cairo",
    seoTitle: "ترجمة معتمدة للسفارة الأمريكية في القاهرة | جلوباليز جروب",
    metaDescription: "دليل عملي لترجمة مستندات السفارة الأمريكية في القاهرة: متى تحتاج ترجمة معتمدة، ما الصيغة المطلوبة، وكيف تتجنب التأخير في المقابلة أو CEAC.",
    excerpt: "دليل عملي لترجمة مستندات السفارة الأمريكية في القاهرة: متى تحتاج ترجمة معتمدة، ما الصيغة المطلوبة، وكيف تتجنب التأخير.",
    body: bodyAr,
    primaryKeyword: "ترجمة معتمدة للسفارة الأمريكية في القاهرة",
    secondaryKeywords: [
      "ترجمة مستندات السفارة الأمريكية",
      "ترجمة معتمدة للتأشيرة الأمريكية",
      "ترجمة أوراق الهجرة إلى أمريكا",
      "ترجمة شهادة ميلاد للسفارة الأمريكية",
      "certified translation for U.S. Embassy Cairo"
    ],
    category: "ترجمة معتمدة والسفارات",
    featuredImageUrl: "/images/blog/certified-translation-us-embassy-cairo-globalize.webp",
    imageMeta: {
      imageFilename: "certified-translation-us-embassy-cairo-globalize.webp",
      imagePath: "/images/blog/certified-translation-us-embassy-cairo-globalize.webp",
      altText: "مكتب عمل منظم يحتوي على جواز سفر ومستندات مدنية وترجمات إنجليزية معتمدة جاهزة للمراجعة للسفارة الأمريكية.",
      titleText: "ترجمة مستندات السفارة الأمريكية في القاهرة",
      caption: "تجهيز ترجمة دقيقة وواضحة يساعد على تقليل أخطاء المستندات قبل موعد السفارة.",
      primaryKeyword: "ترجمة معتمدة للسفارة الأمريكية في القاهرة",
      relatedArticleSlug: "certified-translation-us-embassy-cairo"
    },
    publishedAt: "2026-08-30T12:00:00.000Z",
    readMinutes: 7,
    geoAnswer: "ترجمة معتمدة للسفارة الأمريكية في القاهرة تعني ترجمة دقيقة للمستندات المطلوبة إلى الإنجليزية مع إقرار موقع يفيد بدقة الترجمة وكفاءة المترجم. توضح تعليمات وزارة الخارجية الأمريكية (Travel.State.Gov) الخاصة بالقاهرة أن أي مستند ليس باللغة الإنجليزية أو العربية يحتاج ترجمة إنجليزية معتمدة، مع ضرورة تطابق الأسماء مع جواز السفر ورفع المستند نفسه إلكترونياً على CEAC.",
    faqs: [
      {
        question: "هل كل مستند عربي يحتاج ترجمة للسفارة الأمريكية في القاهرة؟",
        answer: "ليس دائمًا. تعليمات مقابلات الهجرة في القاهرة تشير إلى أن المستندات غير الإنجليزية أو العربية تحتاج ترجمة إنجليزية معتمدة. لكن بعض الخدمات أو التأشيرات قد تطلب الإنجليزية تحديدًا، لذلك يجب مراجعة تعليمات نوع التأشيرة المحددة."
      },
      {
        question: "ما صيغة الترجمة المعتمدة المطلوبة للسفارة الأمريكية؟",
        answer: "تتضمن الترجمة نص المستند كاملًا، بيانات المترجم أو المكتب، ختمًا وتوقيعًا رسميًا، وإقرارًا قانونيًا بدقة الترجمة وكفاءة المترجم لمطابقة تعليمات وزارة الخارجية الأمريكية."
      },
      {
        question: "هل الترجمة المعتمدة تضمن قبول التأشيرة الأمريكية؟",
        answer: "لا، الترجمة الدقيقة تضمن وضوح الملف واستيفاء شروط المستندات وتفادي التأخيرات أو طلب الاستكمال، بينما قرار التأشيرة يخضع للقنصل والقوانين المنظمة."
      },
      {
        question: "متى يجب البدء في ترجمة المستندات قبل موعد السفارة؟",
        answer: "يُفضل البدء فور استلام قائمة المستندات المطلوبة، وذلك لإتاحة الوقت لمراجعة الأسماء والتواريخ وتحديث الملفات على بوابة CEAC ومطابقتها مع الأصول الورقية."
      }
    ],
    schemas: {
      article: {
        "@context": "https://schema.org",
        "@type": "Article",
        headline: "ترجمة معتمدة للسفارة الأمريكية في القاهرة: كيف تجهز مستنداتك بدون تأخير؟",
        description: "دليل عملي لترجمة مستندات السفارة الأمريكية في القاهرة: متى تحتاج ترجمة معتمدة، ما الصيغة المطلوبة، وكيف تتجنب التأخير.",
        image: "https://www.globalizetl.com/images/blog/certified-translation-us-embassy-cairo-globalize.webp",
        author: {
          "@type": "Organization",
          name: "Globalize Group"
        },
        publisher: {
          "@type": "Organization",
          name: "Globalize Group",
          logo: {
            "@type": "ImageObject",
            url: "https://www.globalizetl.com/images/logo.png"
          }
        },
        datePublished: "2026-08-30T12:00:00.000Z"
      },
      faq: {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: [
          {
            "@type": "Question",
            name: "هل كل مستند عربي يحتاج ترجمة للسفارة الأمريكية في القاهرة؟",
            acceptedAnswer: {
              "@type": "Answer",
              text: "ليس دائمًا. تعليمات مقابلات الهجرة في القاهرة تشير إلى أن المستندات غير الإنجليزية أو العربية تحتاج ترجمة إنجليزية معتمدة. لكن بعض الخدمات أو التأشيرات قد تطلب الإنجليزية تحديدًا، لذلك يجب مراجعة تعليمات نوع التأشيرة المحددة."
            }
          },
          {
            "@type": "Question",
            name: "ما صيغة الترجمة المعتمدة المطلوبة للسفارة الأمريكية؟",
            acceptedAnswer: {
              "@type": "Answer",
              text: "تتضمن الترجمة نص المستند كاملًا، بيانات المترجم أو المكتب، ختمًا وتوقيعًا رسميًا، وإقرارًا قانونيًا بدقة الترجمة وكفاءة المترجم لمطابقة تعليمات وزارة الخارجية الأمريكية."
            }
          }
        ]
      },
      breadcrumb: {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "الرئيسية",
            item: "https://www.globalizetl.com/ar"
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "المدونة",
            item: "https://www.globalizetl.com/ar/blog"
          },
          {
            "@type": "ListItem",
            position: 3,
            name: "ترجمة معتمدة للسفارة الأمريكية في القاهرة",
            item: "https://www.globalizetl.com/ar/blog/certified-translation-us-embassy-cairo"
          }
        ]
      }
    },
    author: {
      id: "auth-1",
      name: "د. أحمد منصور",
      title: "المدير التنفيذي ومترجم معتمد",
      photoUrl: "",
      bio: "خبير معتمد في الترجمة القانونية وتأشيرات السفارات والهجرة الدولية."
    }
  };

  // 1. Update src/lib/blog-data.ts
  const blogDataFile = path.resolve(__dirname, '..', 'src', 'lib', 'blog-data.ts');
  let blogDataContent = fs.readFileSync(blogDataFile, 'utf8');

  if (!blogDataContent.includes('certified-translation-us-embassy-cairo')) {
    const insertPos = blogDataContent.indexOf('export const ALL_BLOG_POSTS: BlogPostItem[] = [');
    if (insertPos !== -1) {
      const match = 'export const ALL_BLOG_POSTS: BlogPostItem[] = [\n';
      const replacement = `export const ALL_BLOG_POSTS: BlogPostItem[] = [\n  ${JSON.stringify(newBlogPost, null, 2)},\n`;
      blogDataContent = blogDataContent.replace(match, replacement);
      fs.writeFileSync(blogDataFile, blogDataContent, 'utf8');
      console.log('src/lib/blog-data.ts updated with new post at index 0!');
    }
  } else {
    console.log('Post already present in src/lib/blog-data.ts');
  }

  // 2. Update src/lib/embassies-data.ts
  const embassyDataFile = path.resolve(__dirname, '..', 'src', 'lib', 'embassies-data.ts');
  let embassyDataContent = fs.readFileSync(embassyDataFile, 'utf8');

  const newEmbassyItem = {
    id: "embassy-us-cairo",
    slug: "us-embassy-cairo",
    title: "مكتب ترجمة معتمد لسفارة الولايات المتحدة الأمريكية بالقاهرة | جلوباليز جروب",
    excerpt: "ترجمة معتمدة لكافة مستندات وشهادات السفارة الأمريكية في القاهرة، تأشيرات الهجرة ولم الشمل (CR1, IR1)، القرعة العشوائية (DV)، وتأشيرات الدراسة F1 وفق معايير وزارة الخارجية الأمريكية.",
    body: bodyAr,
    wordCount: 1450,
    countryCode: "us",
    region: "AMERICAS",
    countryName: "الولايات المتحدة الأمريكية",
    requirements: [
      "ترجمة إنجليزية معتمدة لكافة المستندات غير الصادرة بالإنجليزية أو العربية (وفقاً لتعليمات Travel.State.Gov بالقاهرة).",
      "إرفاق إقرار موقع من المترجم أو مكتب الترجمة يفيد بدقة الترجمة وكفاءة المترجم اللغوية.",
      "تطابق طريقة كتابة الأسماء والتواريخ في الترجمة تماماً مع جواز السفر ساري المفعول.",
      "رفع نفس النسخة المترجمة والمطابقة على بوابة الهجرة الإلكترونية CEAC وإحضار الأصل للمقابلة."
    ],
    useCases: [
      "تأشيرات الهجرة ولم الشمل العائلي (CR1, IR1, F2A, F4)",
      "تأشيرات برنامج الهجرة التعددية والقرعة العشوائية (DV Lottery)",
      "تأشيرات الدراسة والتبادل الأكاديمي والعمل (F1, J1, H1B)",
      "معاملات الأحوال المدنية وتقرير الميلاد القنصلي بالخارج (CRBA)"
    ],
    faqs: newBlogPost.faqs,
    indexable: true
  };

  if (!embassyDataContent.includes('"us-embassy-cairo"')) {
    const insertPos = embassyDataContent.indexOf('export const ALL_EMBASSY_POSTS: EmbassyPostItem[] = [');
    if (insertPos !== -1) {
      const match = 'export const ALL_EMBASSY_POSTS: EmbassyPostItem[] = [\n';
      const replacement = `export const ALL_EMBASSY_POSTS: EmbassyPostItem[] = [\n  ${JSON.stringify(newEmbassyItem, null, 2)},\n`;
      embassyDataContent = embassyDataContent.replace(match, replacement);
      fs.writeFileSync(embassyDataFile, embassyDataContent, 'utf8');
      console.log('src/lib/embassies-data.ts updated with us-embassy-cairo!');
    }
  } else {
    console.log('us-embassy-cairo already present in src/lib/embassies-data.ts');
  }
}

updateStaticDatasets().catch(console.error);
