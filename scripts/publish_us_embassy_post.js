const fs = require('fs');
const path = require('path');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function publishUSEmbassyPost() {
  console.log('Publishing US Embassy Cairo Certified Translation Article...');

  const mdPath = path.resolve(__dirname, '..', 'data', 'certified-translation-us-embassy-cairo-globalize.md');
  const mdContent = fs.readFileSync(mdPath, 'utf8');

  // Extract Arabic Body and English Body
  const arBodyMatch = mdContent.match(/## ARABIC ARTICLE\r?\n\r?\n([\s\S]*?)\r?\n\r?\n---\r?\n\r?\n## ENGLISH ARTICLE/);
  const enBodyMatch = mdContent.match(/## ENGLISH ARTICLE\r?\n\r?\n([\s\S]*?)\r?\n\r?\n---\r?\n\r?\n## INTERNAL LINK MAP/);

  const bodyAr = arBodyMatch ? arBodyMatch[1].trim() : '';
  const bodyEn = enBodyMatch ? enBodyMatch[1].trim() : '';

  const postSlug = 'certified-translation-us-embassy-cairo';
  const postTitleAr = 'ترجمة معتمدة للسفارة الأمريكية في القاهرة: كيف تجهز مستنداتك بدون تأخير؟';
  const postTitleEn = 'Certified Translation for U.S. Embassy Cairo: How to Prepare Your Documents Correctly';
  const excerptAr = 'دليل عملي لترجمة مستندات السفارة الأمريكية في القاهرة: متى تحتاج ترجمة معتمدة، ما الصيغة المطلوبة، وكيف تتجنب التأخير في المقابلة أو CEAC.';
  const excerptEn = 'Learn when U.S. Embassy Cairo documents need certified translation, what to prepare, and how to avoid interview or CEAC delays.';
  const featuredImageUrl = '/images/blog/certified-translation-us-embassy-cairo-globalize.webp';

  const faqs = [
    {
      questionAr: 'هل كل مستند عربي يحتاج ترجمة للسفارة الأمريكية في القاهرة؟',
      questionEn: 'Does every Arabic document need translation for U.S. Embassy Cairo?',
      answerAr: 'ليس دائمًا. تعليمات مقابلات الهجرة في القاهرة تشير إلى أن المستندات غير الإنجليزية أو العربية تحتاج ترجمة إنجليزية معتمدة. لكن بعض الخدمات أو التأشيرات قد تطلب الإنجليزية تحديدًا، لذلك يجب مراجعة تعليمات نوع التأشيرة المحددة.',
      answerEn: 'Not always. Cairo immigrant visa instructions state that documents not in English or Arabic require certified English translation. Other services may specifically require English.'
    },
    {
      questionAr: 'ما صيغة الترجمة المعتمدة المطلوبة للسفارة الأمريكية؟',
      questionEn: 'What should a certified translation include for the U.S. Embassy?',
      answerAr: 'تتضمن الترجمة نص المستند كاملًا، بيانات المترجم أو المكتب، ختمًا وتوقيعًا رسميًا، وإقرارًا قانونيًا بدقة الترجمة وكفاءة المترجم لمطابقة تعليمات وزارة الخارجية الأمريكية.',
      answerEn: 'It should include a complete translation, translation office details, an official stamp and signature, and a signed statement confirming accuracy and translator competence.'
    },
    {
      questionAr: 'هل الترجمة المعتمدة تضمن قبول التأشيرة الأمريكية؟',
      questionEn: 'Can a certified translation guarantee visa approval?',
      answerAr: 'لا، الترجمة الدقيقة تضمن وضوح الملف واستيفاء شروط المستندات وتفادي التأخيرات أو طلب الاستكمال، بينما قرار التأشيرة يخضع للقنصل والقوانين المنظمة.',
      answerEn: 'No. A strong translation ensures clarity and avoids document errors, but visa decisions depend on the full consular review and immigration law.'
    },
    {
      questionAr: 'متى يجب البدء في ترجمة المستندات قبل موعد السفارة؟',
      questionEn: 'How early should I translate my documents before the interview?',
      answerAr: 'يُفضل البدء فور استلام قائمة المستندات المطلوبة، وذلك لإتاحة الوقت لمراجعة الأسماء والتواريخ وتحديث الملفات على بوابة CEAC ومطابقتها مع الأصول الورقية.',
      answerEn: 'Start as soon as you know the required checklist to allow sufficient time for reviewing names, dates, and updating electronic CEAC uploads.'
    }
  ];

  // 1. Get or create Author in Database
  let author = await prisma.teamMember.findFirst({
    where: { isLeadership: true }
  });
  if (!author) {
    author = await prisma.teamMember.create({
      data: {
        nameAr: 'د. أحمد منصور',
        nameEn: 'Dr. Ahmed Mansour',
        titleAr: 'المدير التنفيذي ومترجم معتمد',
        titleEn: 'CEO & Certified Translator',
        languagePair: 'الإنجليزية - العربية',
        yearsExperience: 18,
        certifications: ['عضوية الجمعية المصرية للمترجمين EGYTA', 'اعتماد الاتحاد الدولي للمترجمين FIT'],
        isLeadership: true,
        bioAr: 'خبرة تزيد عن 18 عاماً في الترجمة القانونية المعتمدة وتأشيرات السفارات.',
        bioEn: 'Over 18 years experience in certified legal translation and embassy visa documentation.'
      }
    });
  }

  // 2. Upsert BlogPost in Neon Database
  const dbPost = await prisma.blogPost.upsert({
    where: { slug: postSlug },
    update: {
      titleAr: postTitleAr,
      titleEn: postTitleEn,
      excerptAr: excerptAr,
      excerptEn: excerptEn,
      bodyAr: bodyAr,
      bodyEn: bodyEn,
      categoryAr: 'ترجمة معتمدة والسفارات',
      categoryEn: 'Certified Translation & Embassies',
      featuredImageUrl: featuredImageUrl,
      readMinutes: 7,
      published: true,
      authorId: author.id
    },
    create: {
      slug: postSlug,
      titleAr: postTitleAr,
      titleEn: postTitleEn,
      excerptAr: excerptAr,
      excerptEn: excerptEn,
      bodyAr: bodyAr,
      bodyEn: bodyEn,
      categoryAr: 'ترجمة معتمدة والسفارات',
      categoryEn: 'Certified Translation & Embassies',
      featuredImageUrl: featuredImageUrl,
      readMinutes: 7,
      published: true,
      authorId: author.id
    }
  });
  console.log(`Database BlogPost saved: ${dbPost.id}`);

  // Delete existing FAQs for this post and re-insert
  await prisma.fAQ.deleteMany({
    where: { blogPostId: dbPost.id }
  });

  for (let i = 0; i < faqs.length; i++) {
    await prisma.fAQ.create({
      data: {
        questionAr: faqs[i].questionAr,
        answerAr: faqs[i].answerAr,
        questionEn: faqs[i].questionEn,
        answerEn: faqs[i].answerEn,
        sortOrder: i,
        blogPostId: dbPost.id
      }
    });
  }
  console.log('Post FAQs inserted into database.');

  // 3. Upsert U.S. Embassy in Database & connect popular documents
  const birthCert = await prisma.document.findUnique({ where: { slug: 'birth-certificate' } });
  const marriageContract = await prisma.document.findUnique({ where: { slug: 'marriage-contract' } });
  const policeRecord = await prisma.document.findUnique({ where: { slug: 'police-record' } });
  const familyRecord = await prisma.document.findUnique({ where: { slug: 'family-record' } });

  const connectedDocs = [birthCert, marriageContract, policeRecord, familyRecord].filter(Boolean);

  const embassyRecord = await prisma.embassy.upsert({
    where: { slug: 'us-embassy-cairo' },
    update: {
      nameAr: 'سفارة الولايات المتحدة الأمريكية بالقاهرة',
      nameEn: 'Embassy of the United States in Cairo',
      countryCode: 'US',
      region: 'AMERICAS',
      requirementsAr: [
        'ترجمة إنجليزية معتمدة لكافة المستندات غير الصادرة بالإنجليزية أو العربية (وفقاً لتعليمات Travel.State.Gov بالقاهرة).',
        'إرفاق إقرار موقع من المترجم أو مكتب الترجمة يفيد بدقة الترجمة وكفاءة المترجم اللغوية.',
        'تطابق طريقة كتابة الأسماء والتواريخ في الترجمة تماماً مع جواز السفر ساري المفعول.',
        'رفع نفس النسخة المترجمة والمطابقة على بوابة الهجرة الإلكترونية CEAC وإحضار الأصل للمقابلة.'
      ],
      requirementsEn: [
        'Certified English translation for all civil documents not in English or Arabic (per Travel.State.Gov Cairo instructions).',
        'Signed certification statement from the translator confirming accuracy and competency.',
        'Exact match of applicant names and dates with the valid passport.',
        'Uploading the exact document to the CEAC electronic visa system and bringing the original to the interview.'
      ],
      useCasesAr: [
        'تأشيرات الهجرة ولم الشمل العائلي (CR1, IR1, F2A, F4)',
        'تأشيرات برنامج الهجرة التعددية والقرعة العشوائية (DV Lottery)',
        'تأشيرات الدراسة والتبادل الأكاديمي والعمل (F1, J1, H1B)',
        'معاملات الأحوال المدنية وتقرير الميلاد القنصلي بالخارج (CRBA)'
      ],
      useCasesEn: [
        'Immigrant Visas & Family Reunification (CR1, IR1, F2A, F4)',
        'Diversity Immigrant Visa Program (DV Lottery)',
        'Student, Exchange & Work Visas (F1, J1, H1B)',
        'Consular Report of Birth Abroad (CRBA) and civil documentation'
      ],
      indexable: true,
      popularDocuments: {
        set: connectedDocs.map(d => ({ id: d.id }))
      }
    },
    create: {
      slug: 'us-embassy-cairo',
      nameAr: 'سفارة الولايات المتحدة الأمريكية بالقاهرة',
      nameEn: 'Embassy of the United States in Cairo',
      countryCode: 'US',
      region: 'AMERICAS',
      requirementsAr: [
        'ترجمة إنجليزية معتمدة لكافة المستندات غير الصادرة بالإنجليزية أو العربية (وفقاً لتعليمات Travel.State.Gov بالقاهرة).',
        'إرفاق إقرار موقع من المترجم أو مكتب الترجمة يفيد بدقة الترجمة وكفاءة المترجم اللغوية.',
        'تطابق طريقة كتابة الأسماء والتواريخ في الترجمة تماماً مع جواز السفر ساري المفعول.',
        'رفع نفس النسخة المترجمة والمطابقة على بوابة الهجرة الإلكترونية CEAC وإحضار الأصل للمقابلة.'
      ],
      requirementsEn: [
        'Certified English translation for all civil documents not in English or Arabic (per Travel.State.Gov Cairo instructions).',
        'Signed certification statement from the translator confirming accuracy and competency.',
        'Exact match of applicant names and dates with the valid passport.',
        'Uploading the exact document to the CEAC electronic visa system and bringing the original to the interview.'
      ],
      useCasesAr: [
        'تأشيرات الهجرة ولم الشمل العائلي (CR1, IR1, F2A, F4)',
        'تأشيرات برنامج الهجرة التعددية والقرعة العشوائية (DV Lottery)',
        'تأشيرات الدراسة والتبادل الأكاديمي والعمل (F1, J1, H1B)',
        'معاملات الأحوال المدنية وتقرير الميلاد القنصلي بالخارج (CRBA)'
      ],
      useCasesEn: [
        'Immigrant Visas & Family Reunification (CR1, IR1, F2A, F4)',
        'Diversity Immigrant Visa Program (DV Lottery)',
        'Student, Exchange & Work Visas (F1, J1, H1B)',
        'Consular Report of Birth Abroad (CRBA) and civil documentation'
      ],
      indexable: true,
      popularDocuments: {
        connect: connectedDocs.map(d => ({ id: d.id }))
      }
    }
  });
  console.log(`US Embassy Record saved: ${embassyRecord.id}`);

  // Also add Embassy FAQs
  await prisma.fAQ.deleteMany({
    where: { embassyId: embassyRecord.id }
  });

  for (let i = 0; i < faqs.length; i++) {
    await prisma.fAQ.create({
      data: {
        questionAr: faqs[i].questionAr,
        answerAr: faqs[i].answerAr,
        questionEn: faqs[i].questionEn,
        answerEn: faqs[i].answerEn,
        sortOrder: i,
        embassyId: embassyRecord.id
      }
    });
  }

  console.log('US Embassy FAQs and popular documents linked successfully!');
}

publishUSEmbassyPost()
  .catch((e) => {
    console.error('Error publishing US Embassy Post:', e.message);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
