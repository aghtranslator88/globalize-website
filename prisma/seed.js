const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Clearing database...');
  await prisma.fAQ.deleteMany({});
  await prisma.quoteRequest.deleteMany({});
  await prisma.review.deleteMany({});
  await prisma.blogPost.deleteMany({});
  await prisma.teamMember.deleteMany({});
  await prisma.branch.deleteMany({});
  await prisma.language.deleteMany({});
  await prisma.govEntity.deleteMany({});
  await prisma.embassy.deleteMany({});
  await prisma.document.deleteMany({});
  await prisma.service.deleteMany({});
  await prisma.siteSetting.deleteMany({});

  console.log('Seeding site settings...');
  const settings = [
    { key: 'company_name_ar', value: 'جلوبالايز جروب لأعمال الترجمة المعتمدة' },
    { key: 'company_name_en', value: 'Globalize Group for Certified Translation' },
    { key: 'phone', value: '01062990808' },
    { key: 'whatsapp', value: '+20 106 299 0808' },
    { key: 'email', value: 'info@globalizetl.com' },
    { key: 'address_ar', value: 'الطابق الخامس، 6 شارع أيوب، الهرم، الجيزة، بالقرب من كايرو مول' },
    { key: 'address_en', value: '5th Floor, 6 Ayoub St., Haram, Giza, Egypt (near Cairo Mall)' },
    { key: 'facebook', value: 'https://facebook.com/globalizegroup' },
    { key: 'twitter', value: 'https://twitter.com/globalizegroup' },
    { key: 'linkedin', value: 'https://linkedin.com/company/globalizegroup' },
    { key: 'meta_title_template_ar', value: '%s | جلوبالايز جروب' },
    { key: 'meta_title_template_en', value: '%s | Globalize Group' },
    { key: 'meta_default_title_ar', value: 'جلوبالايز جروب — ترجمة معتمدة لدى جميع السفارات والهيئات الحكومية' },
    { key: 'meta_default_title_en', value: 'Globalize Group — Certified Translation for All Embassies & Gov Entities' },
    { key: 'meta_description_ar', value: 'جلوبالايز جروب هي شركة ترجمة معتمدة رائدة في مصر والوطن العربي، نقدم خدمات الترجمة القانونية والفورية وتوطين المواقع بدقة واحترافية متناهية.' },
    { key: 'meta_description_en', value: 'Globalize Group is a leading certified translation company in Egypt and the Middle East, offering legal translation, interpretation, and website localization services.' }
  ];

  for (const s of settings) {
    await prisma.siteSetting.create({ data: s });
  }

  console.log('Seeding services...');
  const services = [
    {
      nameAr: 'ترجمة معتمدة',
      nameEn: 'Certified Translation',
      slug: 'certified',
      type: 'CERTIFIED',
      descriptionAr: 'ترجمة رسمية معتمدة ومطابقة للأصل مقبولة لدى كافة السفارات والجهات الحكومية والجامعات داخل مصر وخارجها.',
      descriptionEn: 'Official certified translation matching the original document, accepted by all embassies, government bodies, and universities in Egypt and abroad.',
      definitionAr: 'الترجمة المعتمدة هي ترجمة رسمية للوثائق والمستندات تحمل ختم مكتب ترجمة معتمد وتوقيع المترجم، وتكون مصحوبة بإقرار بمطابقتها للنص الأصلي.',
      definitionEn: 'Certified translation is an official translation of documents bearing the stamp of a certified translation office and the translator signature, accompanied by a declaration of accuracy.'
    },
    {
      nameAr: 'ترجمة وتوطين المواقع والبرمجيات',
      nameEn: 'Localization Services',
      slug: 'localization',
      type: 'LOCALIZATION',
      descriptionAr: 'تطويع المواقع والتطبيقات والبرمجيات لتناسب الثقافة واللغة المحلية للفئات المستهدفة في الأسواق العالمية المختلفة.',
      descriptionEn: 'Adapting websites, apps, and software to suit the local language and culture of target audiences in global markets.',
      definitionAr: 'التوطين يتجاوز الترجمة الحرفية لتهيئة المحتوى الرقمي، من خلال تعديل التصاميم والصيغ التعبيرية لتتوافق مع الثقافة واللوائح المحلية للجمهور المستهدف.',
      definitionEn: 'Localization goes beyond literal translation to adapt digital content, layouts, and expressions to match the local culture and regulations of the target audience.'
    },
    {
      nameAr: 'الترجمة الفورية وترجمة المؤتمرات',
      nameEn: 'Interpretation Services',
      slug: 'interpretation',
      type: 'INTERPRETATION',
      descriptionAr: 'خدمات الترجمة الفورية والشفهية للمؤتمرات والاجتماعات الدولية مع توفير أحدث أجهزة الصوت وكبائن الترجمة.',
      descriptionEn: 'Simultaneous and consecutive interpretation services for conferences and business meetings, with state-of-the-art audio equipment and interpreter booths.',
      definitionAr: 'الترجمة الفورية هي نقل الكلام الشفهي مباشرة من اللغة المصدر إلى اللغة الهدف في نفس وقت التحدث، وتتطلب مهارة عالية ومعدات متخصصة.',
      definitionEn: 'Interpretation is the oral translation of spoken language in real-time, requiring highly skilled professionals and specialized equipment.'
    }
  ];

  const serviceRecords = [];
  for (const s of services) {
    const record = await prisma.service.create({ data: s });
    serviceRecords.push(record);
  }

  console.log('Seeding documents...');
  const documentsData = [
    {
      nameAr: 'شهادة ميلاد مميكنة',
      nameEn: 'Certified Birth Certificate',
      slug: 'birth-certificate',
      priceEGP: 200,
      deliveryHours: 24,
      descriptionAr: 'ترجمة معتمدة لشهادة الميلاد المصرية المميكنة (الكمبيوتر) إلى مختلف اللغات الأجنبية لتقديمها للسفارات والجامعات.',
      descriptionEn: 'Certified translation of Egyptian computerized birth certificate into various foreign languages for embassies and universities.',
      answerBoxAr: 'سعر ترجمة الصفحة الواحدة لشهادة الميلاد هو 200 جنيه مصري للترجمة بين العربية والإنجليزية، و300 جنيه مصري للصفحة لأي لغة أجنبية أخرى. وفي حال تعدد الصفحات يُحسب الإجمالي بعدد الصفحات مع تسليم معتمد خلال 24 ساعة.',
      answerBoxEn: 'The certified translation rate for a birth certificate starts at 200 EGP per page (Arabic ↔ English) and 300 EGP per page for any other foreign language. Multi-page documents are charged per page with 24-hour delivery.'
    },
    {
      nameAr: 'عقد زواج مميكن',
      nameEn: 'Certified Marriage Contract',
      slug: 'marriage-contract',
      priceEGP: 200,
      deliveryHours: 24,
      descriptionAr: 'ترجمة معتمدة لعقود الزواج الرسمية المميكنة الصادرة عن وزارة الداخلية والسجل المدني لجميع الأغراض الرسمية والسفر.',
      descriptionEn: 'Certified translation of official marriage contracts issued by the Ministry of Interior and Civil Registry for travel and official procedures.',
      answerBoxAr: 'سعر ترجمة الصفحة الواحدة لعقد الزواج هو 200 جنيه مصري للترجمة بين العربية والإنجليزية، و300 جنيه مصري للصفحة للغات الأجنبية الأخرى، ويُحسب الإجمالي بعدد الصفحات مع تسليم معتمد خلال 24 ساعة.',
      answerBoxEn: 'The certified translation fee for marriage contracts is 200 EGP per page (Arabic ↔ English) and 300 EGP per page for other languages, calculated per page with 24-hour turnaround.'
    },
    {
      nameAr: 'قيد عائلي مميكن',
      nameEn: 'Certified Family Record',
      slug: 'family-record',
      priceEGP: 200,
      deliveryHours: 24,
      descriptionAr: 'ترجمة معتمدة لوثيقة القيد العائلي المميكن المطلوبة للسفر والهجرة وإجراءات شؤون الأسرة بالخارج.',
      descriptionEn: 'Certified translation of the computerized family record required for travel, immigration, and family affairs abroad.',
      answerBoxAr: 'تكلفة ترجمة الصفحة للقيد العائلي المميكن تبدأ من 200 جنيه مصري (عربي ↔ إنجليزي) و300 جنيه مصري للغات الأخرى للصفحة، ويُحسب الإجمالي بعدد الصفحات.',
      answerBoxEn: 'Family record certified translation starts at 200 EGP per page (Arabic ↔ English) and 300 EGP per page for other languages, calculated based on total page count.'
    },
    {
      nameAr: 'شهادة تحركات',
      nameEn: 'Movement Certificate',
      slug: 'movement-certificate',
      priceEGP: 200,
      deliveryHours: 24,
      descriptionAr: 'ترجمة معتمدة لشهادة التحركات الصادرة من مصلحة الجوازات والهجرة لتوضيح سجل السفر وتأشيرات الخروج والدخول.',
      descriptionEn: 'Certified translation of the movement certificate issued by the Passport Administration showing travel history and entry/exit stamps.',
      answerBoxAr: 'سعر ترجمة الصفحة لشهادة التحركات هو 200 جنيه مصري (عربي ↔ إنجليزي) و300 جنيه مصري للغات الأخرى، وتُحسب الشهادات المتعددة الصفحات بسعر الصفحة.',
      answerBoxEn: 'Movement certificate translation rate is 200 EGP per page (Arabic ↔ English) and 300 EGP per page for other languages, charged per page with official certification.'
    },
    {
      nameAr: 'شهادة وفاة مميكنة',
      nameEn: 'Certified Death Certificate',
      slug: 'death-certificate',
      priceEGP: 200,
      deliveryHours: 24,
      descriptionAr: 'ترجمة معتمدة لشهادة الوفاة الصادرة عن السجل المدني لإجراءات المواريث والمعاملات القانونية بالخارج.',
      descriptionEn: 'Certified translation of death certificates issued by the Civil Registry for inheritance and official legal transactions abroad.',
      answerBoxAr: 'سعر ترجمة الصفحة الواحدة لشهادة الوفاة هو 200 جنيه مصري (عربي ↔ إنجليزي) و300 جنيه مصري للغات الأجنبية الأخرى، وتسلم معتمدة خلال 24 ساعة.',
      answerBoxEn: 'Certified death certificate translation is 200 EGP per page (Arabic ↔ English) and 300 EGP per page for other languages, processed within 24 hours.'
    },
    {
      nameAr: 'فيش جنائي (صحيفة الحالة الجنائية)',
      nameEn: 'Certified Police Record (Criminal Record)',
      slug: 'police-record',
      priceEGP: 200,
      deliveryHours: 24,
      descriptionAr: 'ترجمة معتمدة لصحيفة الحالة الجنائية (الفيش والتشبيه) المطلوبة للحصول على تأشيرات السفر والعمل بالخارج.',
      descriptionEn: 'Certified translation of the criminal record check (police record) required for travel visas and employment abroad.',
      answerBoxAr: 'تكلفة ترجمة الصفحة الواحدة للفيش الجنائي هي 200 جنيه مصري (عربي ↔ إنجليزي) و300 جنيه مصري لأي لغة ثانية، والتسليم معتمد رسمياً في 24 ساعة.',
      answerBoxEn: 'Police record certified translation is 200 EGP per page (Arabic ↔ English) and 300 EGP per page for other foreign languages, certified in 24 hours.'
    },
    {
      nameAr: 'شهادة تخرج',
      nameEn: 'Certified Graduation Certificate',
      slug: 'graduation-certificate',
      priceEGP: 200,
      deliveryHours: 24,
      descriptionAr: 'ترجمة معتمدة لشهادات التخرج الصادرة من مختلف الجامعات المصرية للمنح الدراسية والتقديم للوظائف بالخارج.',
      descriptionEn: 'Certified translation of graduation certificates from Egyptian universities for academic admissions and employment abroad.',
      answerBoxAr: 'سعر ترجمة الصفحة لشهادة التخرج هو 200 جنيه مصري (عربي ↔ إنجليزي) و300 جنيه مصري لأي لغة ثانية، وتُحسب المستندات متعددة الصفحات بعدد صفحاتها.',
      answerBoxEn: 'Graduation certificate translation is priced at 200 EGP per page (Arabic ↔ English) and 300 EGP per page for other languages, calculated per page.'
    },
    {
      nameAr: 'بيان درجات (سجل أكاديمي)',
      nameEn: 'Certified Academic Transcript',
      slug: 'academic-transcript',
      priceEGP: 200,
      deliveryHours: 24,
      descriptionAr: 'ترجمة معتمدة لبيانات الدرجات والسجلات الأكاديمية المفصلة للطلاب والخريجين لأغراض استكمال الدراسة في الخارج.',
      descriptionEn: 'Certified translation of detailed academic transcripts for students and graduates for university admissions abroad.',
      answerBoxAr: 'سعر ترجمة بيان الدرجات هو 200 جنيه مصري للصفحة الواحدة (عربي ↔ إنجليزي) و300 جنيه مصري للصفحة للغات الأجنبية الأخرى، ويُحتسب الإجمالي وفقاً لعدد صفحات البيان.',
      answerBoxEn: 'Academic transcript translation is 200 EGP per page (Arabic ↔ English) and 300 EGP per page for other languages. Total fee is calculated based on transcript page count.'
    }
  ];

  const documentRecords = [];
  for (const doc of documentsData) {
    const record = await prisma.document.create({ data: doc });
    documentRecords.push(record);
  }

  // Connect related documents (self-relation)
  // Let's connect Birth and Family Record, Graduation and Transcript, etc.
  await prisma.document.update({
    where: { id: documentRecords[0].id },
    data: { relatedTo: { connect: [{ id: documentRecords[2].id }] } } // Birth -> Family Record
  });
  await prisma.document.update({
    where: { id: documentRecords[6].id },
    data: { relatedTo: { connect: [{ id: documentRecords[7].id }] } } // Graduation -> Transcript
  });

  console.log('Seeding embassies...');
  const embassiesData = [
    {
      nameAr: 'سفارة ألمانيا بالقاهرة',
      nameEn: 'Embassy of Germany in Cairo',
      slug: 'germany-embassy',
      countryCode: 'DE',
      region: 'EUROPE',
      indexable: true,
      requirementsAr: [
        'ترجمة معتمدة لجميع الوثائق باللغة الألمانية',
        'تصديق وزارة الخارجية المصرية على الوثائق الأصلية قبل الترجمة',
        'صلاحية تصديق الخارجية يجب ألا تتجاوز 6 أشهر',
        'إرفاق النسخ الأصلية مع الترجمات المعتمدة وتقديمها في موعد التأشيرة'
      ],
      requirementsEn: [
        'Certified translation of all documents into German.',
        'Egyptian Ministry of Foreign Affairs legalization on original documents before translation.',
        'Legalization by MOFA must not be older than 6 months.',
        'Original documents must be submitted alongside the certified translations at the visa interview.'
      ],
      useCasesAr: ['تأشيرات الدراسة والبحث العلمي', 'تأشيرات العمل والبحث عن عمل', 'تأشيرات لم الشمل العائلي والسياحة'],
      useCasesEn: ['Student and Academic Research Visas', 'Employment and Job Seeker Visas', 'Family Reunion and Tourism Visas']
    },
    {
      nameAr: 'سفارة إيطاليا بالقاهرة',
      nameEn: 'Embassy of Italy in Cairo',
      slug: 'italy-embassy',
      countryCode: 'IT',
      region: 'EUROPE',
      indexable: false,
      requirementsAr: ['ترجمة المستندات للغة الإيطالية معتمدة وموثقة من الخارجية.'],
      requirementsEn: ['Certified translation into Italian, legalized by the Ministry of Foreign Affairs.'],
      useCasesAr: ['الدراسة والسياحة والمعاملات التجارية'],
      useCasesEn: ['Study, tourism, and business transactions']
    },
    {
      nameAr: 'سفارة فرنسا بالقاهرة',
      nameEn: 'Embassy of France in Cairo',
      slug: 'france-embassy',
      countryCode: 'FR',
      region: 'EUROPE',
      indexable: false,
      requirementsAr: ['ترجمة المستندات للغة الفرنسية معتمدة وموثقة.'],
      requirementsEn: ['Certified translation into French, fully legalized.'],
      useCasesAr: ['السفر والعمل والدراسة'],
      useCasesEn: ['Travel, work, and education']
    },
    {
      nameAr: 'سفارة إسبانيا بالقاهرة',
      nameEn: 'Embassy of Spain in Cairo',
      slug: 'spain-embassy',
      countryCode: 'ES',
      region: 'EUROPE',
      indexable: false,
      requirementsAr: ['ترجمة المستندات للغة الإسبانية مع التصديق والاعتماد.'],
      requirementsEn: ['Certified translation into Spanish, fully legalized.'],
      useCasesAr: ['السفر والعمل والدراسة'],
      useCasesEn: ['Travel, work, and education']
    },
    {
      nameAr: 'سفارة المملكة المتحدة بالقاهرة',
      nameEn: 'British Embassy in Cairo',
      slug: 'uk-embassy',
      countryCode: 'GB',
      region: 'EUROPE',
      indexable: false,
      requirementsAr: ['ترجمة معتمدة للغة الإنجليزية طبقاً لمتطلبات الـ Home Office.'],
      requirementsEn: ['Certified translation into English in compliance with UK Home Office rules.'],
      useCasesAr: ['تأشيرات العمل، الدراسة، والهجرة'],
      useCasesEn: ['Work, study, and immigration visas']
    },
    {
      nameAr: 'سفارة الولايات المتحدة بالقاهرة',
      nameEn: 'US Embassy in Cairo',
      slug: 'usa-embassy',
      countryCode: 'US',
      region: 'AMERICAS',
      indexable: false,
      requirementsAr: ['ترجمة المستندات للإنجليزية مع إقرار المترجم بمطابقة النص.'],
      requirementsEn: ['Certified translation into English with translator certificate of accuracy.'],
      useCasesAr: ['الهجرة، الدراسة، السياحة والاستثمار'],
      useCasesEn: ['Immigration, study, tourism, and investment']
    },
    {
      nameAr: 'سفارة كندا بالقاهرة',
      nameEn: 'Embassy of Canada in Cairo',
      slug: 'canada-embassy',
      countryCode: 'CA',
      region: 'AMERICAS',
      indexable: false,
      requirementsAr: ['ترجمة المستندات للإنجليزية أو الفرنسية معتمدة ومطابقة.'],
      requirementsEn: ['Certified translation into English or French, fully matching original.'],
      useCasesAr: ['الهجرة السريعة Express Entry، الدراسة والزيارة'],
      useCasesEn: ['Express Entry Immigration, Study, and Visitor visas']
    },
    {
      nameAr: 'سفارة المملكة العربية السعودية بالقاهرة',
      nameEn: 'Embassy of Saudi Arabia in Cairo',
      slug: 'saudi-embassy',
      countryCode: 'SA',
      region: 'GULF_ARAB',
      indexable: false,
      requirementsAr: ['تصديق الأوراق الرسمية من الخارجية والملحق الثقافي السعودي للشهادات.'],
      requirementsEn: ['Legalization by MOFA and the Saudi Cultural Attache for degrees.'],
      useCasesAr: ['تأشيرات العمل، الإقامة، وتأشيرات الزيارة التجارية والتعليم'],
      useCasesEn: ['Work, residency, commercial visit visas, and education']
    },
    {
      nameAr: 'سفارة الإمارات العربية المتحدة بالقاهرة',
      nameEn: 'Embassy of UAE in Cairo',
      slug: 'uae-embassy',
      countryCode: 'AE',
      region: 'GULF_ARAB',
      indexable: false,
      requirementsAr: ['تصديق المستندات من الخارجية المصرية وسفارة الإمارات ثم تصديقها داخل الإمارات.'],
      requirementsEn: ['Legalization from Egyptian MOFA, UAE Embassy, and then inside UAE.'],
      useCasesAr: ['تأسيس الشركات، تأشيرات إقامة العمل والمستثمرين'],
      useCasesEn: ['Company formation, work residency, and investor visas']
    },
    {
      nameAr: 'سفارة الكويت بالقاهرة',
      nameEn: 'Embassy of Kuwait in Cairo',
      slug: 'kuwait-embassy',
      countryCode: 'KW',
      region: 'GULF_ARAB',
      indexable: false,
      requirementsAr: ['ترجمة وتوثيق المستندات الرسمية وعقود العمل والشهادات.'],
      requirementsEn: ['Translation and legalization of official documents, work contracts, and degrees.'],
      useCasesAr: ['تأشيرات العمل والإقامة العائلية'],
      useCasesEn: ['Work visas and family residency']
    },
    {
      nameAr: 'سفارة الصين بالقاهرة',
      nameEn: 'Embassy of China in Cairo',
      slug: 'china-embassy',
      countryCode: 'CN',
      region: 'ASIA_AUSTRALIA',
      indexable: false,
      requirementsAr: ['ترجمة معتمدة للإنجليزية أو الصينية مع تصديق الخارجية المصرية وسفارة الصين.'],
      requirementsEn: ['Certified translation into English or Chinese, legalized by Egyptian MOFA and China Embassy.'],
      useCasesAr: ['الدراسة، السياحة، والمعاملات التجارية والاستيراد'],
      useCasesEn: ['Study, tourism, business transactions, and importing']
    },
    {
      nameAr: 'سفارة قطر بالقاهرة',
      nameEn: 'Embassy of Qatar in Cairo',
      slug: 'qatar-embassy',
      countryCode: 'QA',
      region: 'GULF_ARAB',
      indexable: false,
      requirementsAr: ['توثيق المستندات والشهادات من الخارجية وسفارة قطر بالقاهرة.'],
      requirementsEn: ['Legalization of documents and degrees from MOFA and Qatar Embassy in Cairo.'],
      useCasesAr: ['العمل والدراسة والاستثمار'],
      useCasesEn: ['Work, education, and investment']
    }
  ];

  const embassyRecords = [];
  for (const emb of embassiesData) {
    const record = await prisma.embassy.create({
      data: {
        ...emb,
        popularDocuments: {
          connect: [
            { id: documentRecords[0].id }, // Birth
            { id: documentRecords[1].id }, // Marriage
            { id: documentRecords[6].id }  // Graduation
          ]
        }
      }
    });
    embassyRecords.push(record);
  }

  console.log('Seeding government entities...');
  const govEntitiesData = [
    {
      nameAr: 'وزارة الخارجية المصرية',
      nameEn: 'Egyptian Ministry of Foreign Affairs',
      slug: 'mofa-egypt',
      requirementsAr: ['يجب أن تحمل جميع الوثائق ختم الجهة المصدرة لها قبل تقديمها للتصديق في أحد مكاتب تصديقات الخارجية.'],
      requirementsEn: ['All documents must bear the official stamp of the issuing authority before submission to MOFA offices.'],
      useCasesAr: ['تصديق الشهادات والوثائق الرسمية للسفر والتعاملات الرسمية خارج مصر.'],
      useCasesEn: ['Legalization of degrees and official documents for travel and legal transactions outside Egypt.'],
      indexable: true
    },
    {
      nameAr: 'مصلحة الشهر العقاري والتوثيق',
      nameEn: 'Real Estate Registry & Notary Public',
      slug: 'notary-public',
      requirementsAr: ['حضور الأطراف ببطاقة الرقم القومي أو التوكيل الرسمي، وترجمة العقود والتوكيلات في مكتب معتمد.'],
      requirementsEn: ['Presence of parties with national ID or official power of attorney; contract translation by a certified office.'],
      useCasesAr: ['توثيق عقود البيع، التوكيلات الرسمية، والإقرارات القانونية.'],
      useCasesEn: ['Notarizing sale contracts, official powers of attorney, and legal declarations.'],
      indexable: false
    },
    {
      nameAr: 'المحاكم المصرية (بمختلف درجاتها)',
      nameEn: 'Egyptian Courts',
      slug: 'egyptian-courts',
      requirementsAr: ['تقديم ترجمة معتمدة لجميع المستندات والأدلة الصادرة بلغة أجنبية قبل إرفاقها بملف الدعوى القضائية.'],
      requirementsEn: ['Submission of certified translation of all foreign documents and evidence before filing them in court.'],
      useCasesAr: ['قضايا الأحوال الشخصية، المنازعات التجارية، وقضايا التحكيم الدولي.'],
      useCasesEn: ['Personal status cases, commercial disputes, and international arbitration.'],
      indexable: false
    },
    {
      nameAr: 'وزارة التعليم العالي والبحث العلمي',
      nameEn: 'Ministry of Higher Education',
      slug: 'higher-education',
      requirementsAr: ['ترجمة شهادات الثانوية الأجنبية والمناهج التعليمية لمعادلتها من الإدارة العامة للبعثات والمعادلات.'],
      requirementsEn: ['Translation of foreign high school certificates and syllabi for equivalency by the General Department of Missions.'],
      useCasesAr: ['معادلة الشهادات الأجنبية، التقديم بالجامعات الحكومية والخاصة بمصر.'],
      useCasesEn: ['Foreign degree equivalency, admission into public and private Egyptian universities.'],
      indexable: false
    },
    {
      nameAr: 'وزارة الصحة والسكان',
      nameEn: 'Ministry of Health',
      slug: 'ministry-of-health',
      requirementsAr: ['ترجمة التقارير الطبية، وشهادات تسجيل الأدوية والمستلزمات الطبية من مكاتب معتمدة.'],
      requirementsEn: ['Certified translation of medical reports, drug registration certificates, and medical equipment docs.'],
      useCasesAr: ['العلاج بالخارج، استيراد وتسجيل الأدوية، وترخيص المنشآت الطبية.'],
      useCasesEn: ['Medical treatment abroad, drug importation/registration, and licensing medical facilities.'],
      indexable: false
    },
    {
      nameAr: 'مصلحة الجوازات والهجرة والجنسية',
      nameEn: 'Passport & Immigration Administration',
      slug: 'immigration-passport',
      requirementsAr: ['ترجمة وثائق إثبات الجنسية الأجنبية أو سجلات السفر الصادرة من دول أخرى.'],
      requirementsEn: ['Certified translation of foreign nationality proof documents or travel history from other countries.'],
      useCasesAr: ['إصدار وتجديد الجوازات، طلبات الجنسية المصرية، وتراخيص الإقامة للأجانب.'],
      useCasesEn: ['Issuing and renewing passports, Egyptian citizenship applications, and residency permits for foreigners.'],
      indexable: false
    }
  ];

  const govRecords = [];
  for (const gov of govEntitiesData) {
    const record = await prisma.govEntity.create({
      data: {
        ...gov,
        useCasesAr: gov.useCasesAr,
        useCasesEn: gov.useCasesEn,
        acceptedDocuments: {
          connect: [
            { id: documentRecords[0].id }, // Birth
            { id: documentRecords[1].id }, // Marriage
            { id: documentRecords[5].id }  // Police Record
          ]
        }
      }
    });
    govRecords.push(record);
  }

  console.log('Seeding languages...');
  const languagesData = [
    // Popular
    { nameAr: 'اللغة العربية', nameEn: 'Arabic Language', slug: 'arabic', code: 'ar', popular: true, descriptionAr: 'اللغة الأم والأساسية لجميع المعاملات الرسمية في مصر والدول العربية.', descriptionEn: 'The native and primary language for all official transactions in Egypt and Arab countries.' },
    { nameAr: 'اللغة الإنجليزية', nameEn: 'English Language', slug: 'english', code: 'en', popular: true, descriptionAr: 'اللغة العالمية الأولى للتعليم والعمل والسفر والعقود الدولية.', descriptionEn: 'The primary international language for education, business, travel, and global contracts.' },
    { nameAr: 'اللغة الألمانية', nameEn: 'German Language', slug: 'german', code: 'de', popular: true, descriptionAr: 'المطلوبة للدراسة والعمل في ألمانيا والنمسا وسويسرا وتأشيرات السفارة الألمانية.', descriptionEn: 'Required for study and employment in Germany, Austria, and Switzerland, as well as German embassy visas.' },
    { nameAr: 'اللغة الفرنسية', nameEn: 'French Language', slug: 'french', code: 'fr', popular: true, descriptionAr: 'المستخدمة في فرنسا وكندا ودول الفرانكوفونية للمعاملات الرسمية والدراسة.', descriptionEn: 'Used in France, Canada, and Francophone nations for official transactions and academic admission.' },
    { nameAr: 'اللغة الإيطالية', nameEn: 'Italian Language', slug: 'italian', code: 'it', popular: true, descriptionAr: 'المعتمدة للتأشيرات الدراسية والعملية لدى السفارة والقنصلية الإيطالية بمصر.', descriptionEn: 'Certified for study and employment visas at the Italian Embassy and Consulate in Egypt.' },
    { nameAr: 'اللغة الإسبانية', nameEn: 'Spanish Language', slug: 'spanish', code: 'es', popular: true, descriptionAr: 'المستخدمة في إسبانيا ودول أمريكا اللاتينية لكافة الأغراض الرسمية والسياحة.', descriptionEn: 'Used in Spain and Latin American countries for all official purposes and tourism.' },
    // Others
    { nameAr: 'اللغة الروسية', nameEn: 'Russian Language', slug: 'russian', code: 'ru', popular: false, descriptionAr: 'للتبادل التجاري والترجمة السياحية والعلمية.', descriptionEn: 'For commercial trade, tourism, and academic translation.' },
    { nameAr: 'اللغة الصينية', nameEn: 'Chinese Language', slug: 'chinese', code: 'zh', popular: false, descriptionAr: 'المهمة للتبادل التجاري والاستيراد وعقود الشركات مع الصين.', descriptionEn: 'Important for trade, importing, and corporate agreements with China.' },
    { nameAr: 'اللغة التركية', nameEn: 'Turkish Language', slug: 'turkish', code: 'tr', popular: false, descriptionAr: 'للعمل والدراسة والاستيراد من تركيا والمعاملات الرسمية.', descriptionEn: 'For work, study, importing from Turkey, and official transactions.' },
    { nameAr: 'اللغة البرتغالية', nameEn: 'Portuguese Language', slug: 'portuguese', code: 'pt', popular: false, descriptionAr: 'المستخدمة في البرتغال والبرازيل.', descriptionEn: 'Used in Portugal and Brazil.' },
    { nameAr: 'اللغة الهولندية', nameEn: 'Dutch Language', slug: 'dutch', code: 'nl', popular: false, descriptionAr: 'للسفر والدراسة في هولندا وبلجيكا.', descriptionEn: 'For travel and study in the Netherlands and Belgium.' },
    { nameAr: 'اللغة السويدية', nameEn: 'Swedish Language', slug: 'swedish', code: 'sv', popular: false, descriptionAr: 'لأغراض الهجرة والدراسة في السويد والدول الإسكندنافية.', descriptionEn: 'For immigration and study in Sweden and Scandinavian countries.' },
    { nameAr: 'اللغة البولندية', nameEn: 'Polish Language', slug: 'polish', code: 'pl', popular: false, descriptionAr: 'للشهادات والوثائق المتجهة إلى بولندا.', descriptionEn: 'For certificates and documents destined for Poland.' },
    { nameAr: 'اللغة الفارسية', nameEn: 'Persian Language', slug: 'persian', code: 'fa', popular: false, descriptionAr: 'للترجمة الأدبية والتاريخية والوثائقية.', descriptionEn: 'For literary, historical, and documentary translation.' },
    { nameAr: 'اللغة اليابانية', nameEn: 'Japanese Language', slug: 'japanese', code: 'ja', popular: false, descriptionAr: 'للتبادل الثقافي والتكنولوجي وتأشيرات العمل باليابان.', descriptionEn: 'For cultural and technological exchange and Japanese work visas.' },
    { nameAr: 'اللغة الكورية', nameEn: 'Korean Language', slug: 'korean', code: 'ko', popular: false, descriptionAr: 'للترجمة التجارية وعلاقات العمل مع الشركات الكورية.', descriptionEn: 'For business translation and relations with Korean corporations.' },
    { nameAr: 'اللغة الهندية', nameEn: 'Hindi Language', slug: 'hindi', code: 'hi', popular: false, descriptionAr: 'للعقود وشهادات العمالة الوافدة بالخليج.', descriptionEn: 'For contracts and credentials of foreign labor in the Gulf.' },
    { nameAr: 'اللغة اليونانية', nameEn: 'Greek Language', slug: 'greek', code: 'el', popular: false, descriptionAr: 'للمعاملات الرسمية والشهادات بمصر واليونان.', descriptionEn: 'For official transactions and certificates in Egypt and Greece.' },
    { nameAr: 'اللغة الرومانية', nameEn: 'Romanian Language', slug: 'romanian', code: 'ro', popular: false, descriptionAr: 'للمنح الدراسية والمعاملات التجارية برومانيا.', descriptionEn: 'For academic scholarships and commercial trade in Romania.' },
    { nameAr: 'اللغة الأوكرانية', nameEn: 'Ukrainian Language', slug: 'ukrainian', code: 'uk', popular: false, descriptionAr: 'لترجمة الشهادات والأوراق الرسمية الأوكرانية.', descriptionEn: 'For translation of Ukrainian certificates and official papers.' },
    { nameAr: 'اللغة التشيكية', nameEn: 'Czech Language', slug: 'czech', code: 'cs', popular: false, descriptionAr: 'للدراسة والعلاج بالتشيك.', descriptionEn: 'For study and medical treatment in the Czech Republic.' },
    { nameAr: 'اللغة الدنماركية', nameEn: 'Danish Language', slug: 'danish', code: 'da', popular: false, descriptionAr: 'للهجرة والدراسة في الدنمارك.', descriptionEn: 'For immigration and study in Denmark.' },
    { nameAr: 'اللغة النرويجية', nameEn: 'Norwegian Language', slug: 'norwegian', code: 'no', popular: false, descriptionAr: 'لأغراض العمل والإقامة في النرويج.', descriptionEn: 'For employment and residency purposes in Norway.' },
    { nameAr: 'اللغة الفنلندية', nameEn: 'Finnish Language', slug: 'finnish', code: 'fi', popular: false, descriptionAr: 'لأغراض الدراسة والبحث في فنلندا.', descriptionEn: 'For study and research purposes in Finland.' },
    { nameAr: 'اللغة المجرية', nameEn: 'Hungarian Language', slug: 'hungarian', code: 'hu', popular: false, descriptionAr: 'للمنح الدراسية والمعادلات بهنغاريا.', descriptionEn: 'For academic scholarships and equivalencies in Hungary.' }
  ];

  const languageRecords = [];
  for (const lang of languagesData) {
    const record = await prisma.language.create({ data: lang });
    languageRecords.push(record);
  }

  console.log('Seeding branches...');
  const branches = [
    {
      nameAr: 'فرع الهرم الرئيسي',
      nameEn: 'Haram Main Branch',
      slug: 'haram-main-branch',
      addressAr: 'الطابق الخامس، 6 شارع أيوب، الهرم، الجيزة، بالقرب من كايرو مول',
      addressEn: '5th Floor, 6 Ayoub St., Haram, Giza, Egypt (near Cairo Mall)',
      phone: '01062990808',
      whatsapp: '+20 106 299 0808',
      workingHoursAr: 'السبت - الخميس: 9:00 ص - 9:00 م، الجمعة مغلق',
      workingHoursEn: 'Sat - Thu: 9:00 AM - 9:00 PM, Friday Closed',
      lat: 29.9886,
      lng: 31.1856,
      googleMapsUrl: 'https://maps.google.com/?q=29.9886,31.1856'
    },
    {
      nameAr: 'فرع مدينة نصر',
      nameEn: 'Nasr City Branch',
      slug: 'nasr-city-branch',
      addressAr: 'الطابق الثاني، 12 شارع عباس العقاد، مدينة نصر، القاهرة',
      addressEn: '2nd Floor, 12 Abbas El-Akkad St., Nasr City, Cairo, Egypt',
      phone: '01062990808',
      whatsapp: '+20 106 299 0808',
      workingHoursAr: 'السبت - الخميس: 10:00 ص - 10:00 م، الجمعة مغلق',
      workingHoursEn: 'Sat - Thu: 10:00 AM - 10:00 PM, Friday Closed',
      lat: 30.0614,
      lng: 31.3371,
      googleMapsUrl: 'https://maps.google.com/?q=30.0614,31.3371'
    }
  ];

  const branchRecords = [];
  for (const b of branches) {
    const record = await prisma.branch.create({ data: b });
    branchRecords.push(record);
  }

  console.log('Seeding team members...');
  const teamMembers = [
    {
      nameAr: 'د. أحمد منصور',
      nameEn: 'Dr. Ahmed Mansour',
      titleAr: 'المدير التنفيذي ومؤسس الشركة',
      titleEn: 'CEO & Founder',
      languagePair: 'الإنجليزية - العربية',
      yearsExperience: 18,
      certifications: ['دكتوراه في اللغويات التطبيقية', 'عضوية الجمعية المصرية للمترجمين (EGYTA)', 'اعتماد الاتحاد الدولي للمترجمين (FIT)'],
      isLeadership: true,
      bioAr: 'يتمتع الدكتور أحمد بخبرة تزيد عن 18 عاماً في إدارة مشاريع الترجمة الكبرى والترجمة القانونية المعتمدة للمؤسسات الدولية وسفارات الاتحاد الأوروبي.',
      bioEn: 'Dr. Ahmed has over 18 years of experience managing large-scale translation projects and certified legal translation for international institutions and EU embassies.'
    },
    {
      nameAr: 'أ. سارة الغندور',
      nameEn: 'Sarah Al-Ghandour',
      titleAr: 'رئيسة قسم الترجمة المعتمدة',
      titleEn: 'Head of Certified Translation',
      languagePair: 'الألمانية - العربية',
      yearsExperience: 12,
      certifications: ['ماجستير في الترجمة الفورية والتحريرية', 'اعتماد معهد جوته والجمعية المصرية للمترجمين'],
      isLeadership: true,
      bioAr: 'متخصصة في الترجمة الألمانية الرسمية وتأشيرات سفارات ألمانيا والنمسا وسويسرا مع دقة لا تضاهى في المصطلحات القانونية.',
      bioEn: 'Specializes in official German translation and German/Austrian/Swiss embassy visas with unparalleled accuracy in legal terminology.'
    },
    {
      nameAr: 'أ. خالد سعيد',
      nameEn: 'Khaled Saeed',
      titleAr: 'مترجم قانوني أول',
      titleEn: 'Senior Legal Translator',
      languagePair: 'الإنجليزية - العربية',
      yearsExperience: 10,
      certifications: ['ليسانس ألسن لغة إنجليزية', 'اعتماد الجمعية المصرية للمترجمين'],
      isLeadership: false,
      bioAr: 'خبير في صياغة العقود القانونية والاتفاقيات التجارية ومحاضر العقود القضائية.',
      bioEn: 'Expert in drafting legal contracts, commercial agreements, and judicial declarations.'
    },
    {
      nameAr: 'أ. ياسمين حسني',
      nameEn: 'Yasmine Hosny',
      titleAr: 'مديرة قسم التوطين والمواقع',
      titleEn: 'Localization Department Lead',
      languagePair: 'الفرنسية - العربية',
      yearsExperience: 9,
      certifications: ['ليسانس لغات وترجمة فرنسي', 'شهادة إدارة مشاريع الترجمة والتوطين'],
      isLeadership: false,
      bioAr: 'تقود ياسمين فرق العمل الفنية واللغوية لتوطين البرمجيات والمواقع للشركات المتجهة للأسواق الأفريقية والفرنسية.',
      bioEn: 'Yasmine leads technical and linguistic teams to localize software and websites for companies targeting African and French markets.'
    },
    {
      nameAr: 'أ. عمر عبد العزيز',
      nameEn: 'Omar Abdelaziz',
      titleAr: 'رئيس قسم الترجمة الفورية',
      titleEn: 'Head of Interpretation Services',
      languagePair: 'الإنجليزية - العربية',
      yearsExperience: 11,
      certifications: ['دبلوم الترجمة الفورية بالجامعة الأمريكية', 'عضوية الجمعية الدولية لمترجمي المؤتمرات (AIIC)'],
      isLeadership: true,
      bioAr: 'مترجم مؤتمرات دولي شارك في أكثر من 150 مؤتمراً إقليمياً ودولياً في مختلف القطاعات الطبية والاقتصادية.',
      bioEn: 'An international conference interpreter who participated in over 150 regional and international conferences in medical and economic sectors.'
    },
    {
      nameAr: 'أ. منى خليل',
      nameEn: 'Mona Khalil',
      titleAr: 'مترجمة لغة فرنسية وإسبانية معتمدة',
      titleEn: 'Certified French & Spanish Translator',
      languagePair: 'الفرنسية/الإسبانية - العربية',
      yearsExperience: 8,
      certifications: ['ليسانس ألسن فرنسي وإسباني', 'اعتماد معهد سيرفانتس والجمعية المصرية للمترجمين'],
      isLeadership: false,
      bioAr: 'متخصصة في ترجمة الوثائق الشخصية والتجارية المقدمة لسفارتي فرنسا وإسبانيا وبلجيكا.',
      bioEn: 'Specialized in translating personal and business documents submitted to French, Spanish, and Belgian embassies.'
    }
  ];

  const teamRecords = [];
  for (const t of teamMembers) {
    const record = await prisma.teamMember.create({ data: t });
    teamRecords.push(record);
  }

  console.log('Seeding reviews...');
  const reviewsData = [
    { authorName: 'محمد عبد الله', rating: 5, textAr: 'ترجمت شهادة ميلادي وعقد زواجي لتقديمها للسفارة الألمانية للتأشيرة الدراسية. تم قبول الأوراق بدون أي استفسارات أو تعديلات. الخدمة سريعة ومحترفة جداً.', textEn: 'I translated my birth and marriage certificates for the German Embassy visa. The documents were accepted without any questions. Very fast and professional.', serviceType: 'CERTIFIED', date: new Date('2026-06-15') },
    { authorName: 'ياسر الشمري', rating: 5, textAr: 'تعاملنا مع جلوبالايز جروب لترجمة وتوطين موقع شركتنا إلى ثلاث لغات. دقة في الصياغة وفهم عميق للمصطلحات التقنية. نوصي بهم بشدة.', textEn: 'We worked with Globalize Group to localize our company website into three languages. Great accuracy and deep understanding of technical terms. Highly recommended.', serviceType: 'LOCALIZATION', date: new Date('2026-07-01') },
    { authorName: 'أ. داليا مصطفى (شركة الخليج للخدمات)', rating: 5, textAr: 'قمنا باستئجار كبائن الترجمة الفورية والتقينا بمترجمين فوريين متميزين جداً لمؤتمرنا الطبي السنوي. شكرًا جلوبالايز على التنظيم الرائع.', textEn: 'We rented interpretation booths and hired outstanding interpreters for our annual medical conference. Thank you Globalize for the excellent organization.', serviceType: 'INTERPRETATION', date: new Date('2026-05-20') },
    { authorName: 'أحمد فوزي', rating: 5, textAr: 'خدمة سريعة في ترجمة فيش جنائي وبيان درجات خلال نفس اليوم وتوصيل المستندات للمنزل. شكراً لفريق العمل بالهرم.', textEn: 'Fast service translating my police record and academic transcript in the same day and home delivering. Thanks to the Haram branch team.', serviceType: 'CERTIFIED', date: new Date('2026-07-10') },
    { authorName: 'سارة التميمي', rating: 4, textAr: 'ترجمة دقيقة لشهادات التخرج لجامعة الملك سعود بالرياض، تم قبول الملف بدون مشاكل. الالتزام بالوقت كان ممتازا.', textEn: 'Accurate translation of graduation certificates for King Saud University in Riyadh, the file was accepted with no issues. Turnaround time commitment was excellent.', serviceType: 'CERTIFIED', date: new Date('2026-07-12') },
    { authorName: 'م. شريف جلال', rating: 5, textAr: 'شركة محترفة جداً، تعاملنا معهم في ترجمة وتوطين عقود وعروض التقديم التقنية لشركتنا. جودة ممتازة وسعر مناسب.', textEn: 'A very professional company. We worked with them on translating and localizing contracts and tech proposals for our company. Excellent quality and fair price.', serviceType: 'LOCALIZATION', date: new Date('2026-06-25') },
    { authorName: 'نهى الجندي', rating: 5, textAr: 'ترجمت شهادة تحركات وقيد عائلي لتقديمهما للسفارة الإيطالية والترجمة كانت ممتازة ومطابقة للمطلوب.', textEn: 'I translated a movement certificate and family record to submit to the Italian Embassy. The translation was excellent and matched requirements.', serviceType: 'CERTIFIED', date: new Date('2026-07-05') },
    { authorName: 'د. طارق الحسين', rating: 4, textAr: 'الترجمة الفورية كانت جيدة جداً في مؤتمر الاستثمار العقاري والتنظيم التقني للصوت نال إعجاب جميع الحاضرين.', textEn: 'The interpretation was very good during the Real Estate Investment Conference, and the audio technical setup was praised by all attendees.', serviceType: 'INTERPRETATION', date: new Date('2026-06-18') },
    { authorName: 'كريم البشري', rating: 5, textAr: 'سرعة ودقة ومصداقية. ترجمت لديهم أوراق الهجرة لكندا وتم قبولها كاملة. أنصح بالتعامل معهم.', textEn: 'Speed, accuracy, and credibility. I translated my Canadian immigration documents with them, and they were fully accepted. Recommend dealing with them.', serviceType: 'CERTIFIED', date: new Date('2026-07-14') }
  ];

  for (const r of reviewsData) {
    await prisma.review.create({ data: r });
  }

  console.log('Seeding blog posts...');
  const blogPosts = [
    {
      titleAr: 'خطوات ترجمة شهادة الميلاد وتوثيقها للسفر إلى ألمانيا',
      titleEn: 'Steps to Translate and Legalize Birth Certificate for Germany Travel',
      slug: 'translate-birth-certificate-germany',
      excerptAr: 'دليل شامل يوضح بالتفصيل خطوات ترجمة شهادة الميلاد المصرية وتصديقها من الخارجية لتقديمها للسفارة الألمانية.',
      excerptEn: 'A comprehensive guide showing in detail the steps to translate Egyptian birth certificates and legalize them from MOFA for German Embassy submission.',
      bodyAr: `## خطوات الترجمة والتوثيق لسفارة ألمانيا

للسفر والدراسة أو لم الشمل في ألمانيا، تعد **شهادة الميلاد المميكنة** وثيقة أساسية يطلب تقديم ترجمتها الألمانية مع التصديقات الرسمية. إليك الخطوات بالتفصيل:

### 1. استخراج الشهادة الأصلية حديثة
قبل البدء في إجراءات الترجمة والتصديق، احرص على استخراج شهادة ميلاد مميكنة حديثة من السجل المدني تحمل الختم الرسمي.

### 2. التصديق من وزارة الخارجية المصرية
توجه بأصل الشهادة المميكنة إلى أقرب مكتب تصديقات لوزارة الخارجية المصرية للحصول على تصديق الخارجية (اللاصقة الرسمية والختم). تذكر أن السفارة الألمانية تتطلب ألا يزيد عمر تصديق الخارجية عن 6 أشهر.

### 3. الترجمة المعتمدة للغة الألمانية
بعد تصديق الأصل من الخارجية، خذ الوثيقة المصَدقة وتوجه بها إلى مكتب **جلوبالايز جروب للترجمة المعتمدة**. سيقوم المترجمون المتخصصون لدينا بنقل محتويات الشهادة بما فيها أختام الخارجية والصياغات القانونية بدقة متناهية إلى اللغة الألمانية، وختمها بالختم الرسمي المعترف به.

### 4. تقديم الأوراق للسفارة
يتم تسليمك المستند مترجمًا ومرفقًا بصورة من الأصل ومختومًا بالاعتماد الرسمي، لتقديمه للسفارة أو مكتب التأشيرات (VFS Global).`,
      bodyEn: `## Steps for Translating and Legalizing Documents for the German Embassy

For travel, study, or family reunion in Germany, the **computerized birth certificate** is a primary document whose German translation must be submitted with official legalizations. Here are the steps in detail:

### 1. Extract a Recent Original Certificate
Before beginning, extract a recent computerized birth certificate from the Civil Registry bearing the official stamp.

### 2. Legalization from the Egyptian MOFA
Take the original certificate to the nearest Egyptian Ministry of Foreign Affairs (MOFA) office to get a legalization stamp. Remember that the German Embassy requires the MOFA stamp to be no older than 6 months.

### 3. Certified German Translation
After legalizing the original, bring it to **Globalize Group for Certified Translation**. Our specialized translators will translate the certificate contents—including the MOFA stamps and legal terminologies—into German, fully stamped with our official recognized stamp.

### 4. Submitting to the Embassy
You will receive the certified translated document attached to a copy of the legalized original, ready to be presented at your visa interview or VFS Global center.`,
      categoryAr: 'ترجمة معتمدة والسفارات',
      categoryEn: 'Certified Translation & Embassies',
      readMinutes: 5,
      authorId: teamRecords[1].id // Sarah Al-Ghandour
    },
    {
      titleAr: 'ما هي الترجمة المعتمدة والفرق بينها وبين الترجمة العادية؟',
      titleEn: 'What is Certified Translation vs Regular Translation?',
      slug: 'what-is-certified-translation',
      excerptAr: 'تعرف على مفهوم الترجمة المعتمدة وشروطها الأساسية، وحالات استخدامها والفرق بينها وبين الترجمة التقليدية.',
      excerptEn: 'Learn the concept of certified translation, its essential requirements, use cases, and the difference from traditional translation.',
      bodyAr: `## مفهوم الترجمة المعتمدة وشروطها

يتساءل الكثيرون عن المقصود بالترجمة المعتمدة (Certified Translation) ومتى تكون مطلوبة بدلاً من الترجمة التقليدية.

### ما هي الترجمة المعتمدة؟
الترجمة المعتمدة هي ترجمة رسمية تطابق المستند الأصلي تماماً، يقوم بها مترجم معتمد أو مكتب ترجمة مرخص وموثوق. يتم ختم الترجمة بختم الاعتماد الرسمي للمكتب، وتوقيع المترجم المسؤول، وتضمين بيان (Certification Statement) يقر بمطابقة الترجمة للأصل وصحتها ومسؤولية المكتب القانونية عنها.

### الفرق بين الترجمة المعتمدة والعادية
- **الاعتماد والمسؤولية**: الترجمة العادية لا تحمل توقيعاً أو ختماً رسمياً يضمن دقتها للجهات الحكومية، بينما المعتمدة تكون وثيقة قانونية معترف بها أمام المحاكم والسفارات.
- **تطابق الشكل والمضمون**: في الترجمة المعتمدة، يجب نقل كل تفاصيل المستند بما فيها الأختام، التواقيع، الهوامش، وحتى الكتابات غير الواضحة.
- **جهة التقديم**: تُطلب الترجمة المعتمدة دائماً من قبل الجهات الرسمية، السفارات، الجامعات، مصلحة الهجرة، والمحاكم. بينما الترجمة العادية تُستخدم لأغراض المعرفة الشخصية أو المقالات العامة والكتب.

نحن في **جلوبالايز جروب** نقدم ترجمات معتمدة متوافقة بالكامل مع أعلى المعايير المهنية ومعترف بها رسمياً لدى جميع السفارات والهيئات الحكومية داخل مصر وخارجها.`,
      bodyEn: `## Understanding Certified Translation and Its Requirements

Many people wonder what certified translation means and when it is required instead of regular translation.

### What is Certified Translation?
Certified translation is an official, word-for-word translation matching the original document, completed by a certified translator or a licensed, trusted translation office. The translation is stamped with the official stamp, signed by the responsible translator, and includes a certification statement declaring that the translation is an accurate and true representation of the original document.

### Differences Between Certified and Regular Translation
- **Certification & Liability**: Regular translation does not carry official signatures or stamps to guarantee accuracy to official authorities. Certified translation is a legal document recognized before courts and embassies.
- **Layout & Content Matching**: In certified translation, all details must be translated, including stamps, signatures, margins, and handwritten notes.
- **Destination**: Certified translation is always required by official entities, embassies, universities, immigration departments, and courts. Regular translation is used for personal reference, news, and general content.

At **Globalize Group**, we provide certified translations fully compliant with professional standards and officially recognized by all embassies and government entities.`,
      categoryAr: 'دليل المبتدئين للترجمة',
      categoryEn: 'Basic Guide to Translation',
      readMinutes: 4,
      authorId: teamRecords[2].id // Khaled Saeed
    },
    {
      titleAr: 'أهمية توطين المواقع والتطبيقات عند التوسع في دول الخليج',
      titleEn: 'Importance of Website Localization for Expanding to the Gulf Region',
      slug: 'importance-localization-gulf',
      excerptAr: 'كيف يساعد التوطين اللغوي والثقافي للمواقع والتطبيقات الإلكترونية الشركات على النجاح واكتساب ثقة العملاء في دول مجلس التعاون الخليجي.',
      excerptEn: 'How website and app localization helps companies succeed and gain client trust when expanding into GCC countries.',
      bodyAr: `## دور التوطين في نجاح الأعمال بدول الخليج

عند التخطيط لتوسيع أعمال شركتك الرقمية أو متجرك الإلكتروني إلى دول الخليج العربي (المملكة العربية السعودية، الإمارات، الكويت، قطر، البحرين، عمان)، فإن مجرد ترجمة المحتوى إلى اللغة العربية الفصحى لا يكفي دائماً. هنا تبرز أهمية **التوطين (Localization)**.

### ما هو توطين المواقع والتطبيقات؟
التوطين هو عملية موائمة وتطويع الموقع الإلكتروني أو التطبيق بالكامل من الناحية اللغوية، الثقافية، التقنية، والبصرية ليناسب طبيعة وعادات المستهلك الخليجي.

### لماذا يعد التوطين هاماً لدول الخليج؟
1. **استخدام اللهجات والمصطلحات المحلية**: يفضل العميل الخليجي الصياغات القريبة من لهجته في العروض والتسويق، مما يعزز الثقة والارتباط بالبراند.
2. **تعديل تنسيقات العرض (RTL)**: تحويل واجهات المستخدم لتناسب الكتابة من اليمين إلى اليسار بشكل انسيابي مريح للعين ودون مشاكل تقنية.
3. **تخصيص طرق الدفع والعملات**: توفير بوابات الدفع المحلية الأكثر شعبية في الخليج مثل (مدى mada، تمارا، Apple Pay) وعرض الأسعار بالريال والدرهم والدينار.
4. **التوافق مع القوانين المحلية**: تعديل الشروط والأحكام وسياسات الخصوصية لتتوافق مع قوانين حماية البيانات والتجارة الإلكترونية في كل دولة خليجية.

تقدم **جلوبالايز جروب** خدمات توطين برمجية ولغوية متكاملة بأيدي مترجمين ومهندسين خبراء لضمان نجاح توسع علامتك التجارية في الخليج.`,
      bodyEn: `## The Role of Localization in Business Success in the GCC

When planning to expand your digital business or e-commerce store into the GCC countries (Saudi Arabia, UAE, Kuwait, Qatar, Bahrain, Oman), simple translation of content into standard Arabic is not always enough. This is where **Localization** becomes crucial.

### What is Website & App Localization?
Localization is the process of fully adapting your website or application linguistically, culturally, visually, and technically to suit the preferences and habits of GCC consumers.

### Why is Localization Important for the Gulf Region?
1. **Local Terminology & Nuances**: Gulf clients prefer marketing copy close to their local dialects, which builds trust and brand loyalty.
2. **Right-to-Left (RTL) Layout Adaptation**: Adjusting user interfaces to display beautifully from right to left without breaking layouts.
3. **Local Payment Methods & Currencies**: Integrating popular local payment gateways in the Gulf (like mada, Tamara, Apple Pay) and displaying prices in SAR, AED, or KWD.
4. **Regulatory Compliance**: Adapting Terms & Conditions and Privacy Policies to comply with the e-commerce laws of each GCC country.

**Globalize Group** provides comprehensive localization services by expert engineers and linguists to ensure your successful brand expansion in the Gulf.`,
      categoryAr: 'توطين وتطوير الأعمال',
      categoryEn: 'Localization & Business Development',
      readMinutes: 6,
      authorId: teamRecords[3].id // Yasmine Hosny
    },
    {
      titleAr: 'كيف تختار المترجم الفوري المناسب لمؤتمرك الدولي؟',
      titleEn: 'How to Choose the Right Interpreter for Your International Conference?',
      slug: 'choose-right-interpreter-conference',
      excerptAr: 'نصائح وإرشادات هامة لاختيار المترجم الفوري المناسب لضمان نجاح الفعاليات والمؤتمرات متعددة اللغات وتفادي المشاكل التقنية واللغوية.',
      excerptEn: 'Essential tips for choosing the right simultaneous interpreter to ensure the success of multi-lingual conferences and avoid technical issues.',
      bodyAr: `## معايير اختيار المترجم الفوري للمؤتمرات

الترجمة الفورية (Simultaneous Interpretation) هي واحدة من أصعب فروع الترجمة وأكثرها حساسية. نجاح مؤتمرك الدولي يعتمد بالكامل على قدرة المترجم الفوري على نقل الأفكار والمصطلحات بسرعة فائقة ودقة متناهية. إليك كيفية الاختيار:

### 1. التخصص في موضوع المؤتمر
الترجمة الفورية الطبية تختلف تماماً عن ترجمة مؤتمرات النفط والغاز أو القانون الدولي. تأكد من أن المترجم لديه خلفية معرفية وخبرة عملية سابقة في القطاع الخاص بمؤتمرك ليكون على دراية بالمصطلحات الفنية المحددة.

### 2. الخبرة والشهادات المعتمدة
اختر دائماً مترجمين فورين مسجلين في جمعيات مهنية عريقة مثل الجمعية الدولية لمترجمي المؤتمرات (AIIC) أو الجمعية المصرية للمترجمين، حيث يخضع أعضاؤها لاختبارات مهنية صارمة.

### 3. العمل في ثنائيات (المترجم الزميل)
الترجمة الفورية تتطلب مجهوداً ذهنياً جباراً؛ لذلك، لا يمكن لمترجم فوري العمل بمفرده لأكثر من 30-40 دقيقة متواصلة. يجب توفير مترجمين اثنين على الأقل في كل كبينة ترجمة ليتناوبا العمل كل نصف ساعة لضمان استقرار جودة الترجمة.

### 4. التجهيزات والكبائن الصوتية الاحترافية
الترجمة الفورية الناجحة تتطلب كبائن ترجمة عازلة للصوت ومعدات بث لاسلكي وسماعات رأس ذات جودة عالية للحضور.

في قسم الترجمة الفورية بـ **جلوبالايز جروب**، نوفر النخبة من المترجمين الفوريين للمؤتمرات الدولية مع أحدث التجهيزات الصوتية والكبائن لضمان إخراج فعاليتك بأفضل صورة ممكنة.`,
      bodyEn: `## Criteria for Choosing Conference Interpreters

Simultaneous interpretation is one of the most challenging and sensitive fields of translation. The success of your international conference depends entirely on the interpreter's ability to convey ideas and terminologies quickly and accurately. Here is how to choose:

### 1. Specialization in the Conference Topic
Medical interpretation differs completely from oil & gas or international law conferences. Make sure the interpreter has background knowledge and prior experience in your specific industry.

### 2. Professional Credentials & Experience
Always hire interpreters registered with renowned professional bodies such as the International Association of Conference Interpreters (AIIC) or the Egyptian Translators Association.

### 3. Working in Pairs (Co-interpreting)
Interpretation requires intense mental focus. Therefore, an interpreter cannot work alone for more than 30-40 minutes. You must hire at least two interpreters per booth to take turns every 30 minutes.

### 4. Professional Sound Equipment & Booths
Successful interpretation requires soundproof interpretation booths, wireless transmitters, and high-quality headsets for the audience.

At **Globalize Group**, we provide elite conference interpreters along with state-of-the-art audio equipment and booths to ensure the perfect execution of your event.`,
      categoryAr: 'الترجمة الفورية والفعاليات',
      categoryEn: 'Interpretation & Events',
      readMinutes: 5,
      authorId: teamRecords[4].id // Omar Abdelaziz
    }
  ];

  const blogRecords = [];
  for (const post of blogPosts) {
    const record = await prisma.blogPost.create({ data: post });
    blogRecords.push(record);
  }

  console.log('Seeding FAQs...');
  const faqs = [
    // Homepage FAQs
    {
      questionAr: 'ما هي مواعيد العمل الرسمية لجلوبالايز جروب؟',
      questionEn: 'What are the official working hours of Globalize Group?',
      answerAr: 'نستقبلكم في فروعنا من السبت إلى الخميس من الساعة 9:00 صباحاً وحتى الساعة 9:00 مساءً. ويوم الجمعة هو يوم العطلة الأسبوعية الرسمي، ولكن يمكنكم طلب عروض الأسعار عبر موقعنا وعلى الواتساب طوال 24 ساعة.',
      answerEn: 'We welcome you at our branches Saturday through Thursday from 9:00 AM to 9:00 PM. Friday is our official weekend, but you can request quotes via website or WhatsApp 24/7.',
      sortOrder: 1,
      homepage: true
    },
    {
      questionAr: 'هل ترجمة جلوبالايز جروب معتمدة رسمياً لدى السفارات؟',
      questionEn: 'Is Globalize Group translation officially accepted by embassies?',
      answerAr: 'نعم، نحن مكتب ترجمة معتمد بشكل رسمي ومقبول لدى جميع السفارات والقنصليات بمصر وخارجها (بما في ذلك سفارات دول الاتحاد الأوروبي، الولايات المتحدة، المملكة المتحدة، ودول الخليج العربي)، وكذلك جميع الهيئات الحكومية والمحاكم والجامعات.',
      answerEn: 'Yes, we are officially certified and accepted by all embassies and consulates in Egypt and abroad (including EU, US, UK, and GCC embassies), as well as government bodies, courts, and universities.',
      sortOrder: 2,
      homepage: true
    },
    {
      questionAr: 'كم يستغرق وقت ترجمة المستندات والشهادات الشخصية؟',
      questionEn: 'How long does it take to translate personal documents and certificates?',
      answerAr: 'تستغرق ترجمة واعتماد المستندات والشهادات الشخصية (مثل شهادات الميلاد، عقود الزواج، الفيش الجنائي، شهادات التخرج) 24 ساعة فقط كحد أقصى، مع توفير خدمة الترجمة المستعجلة في الحالات الطارئة خلال ساعات قليلة.',
      answerEn: 'Translation and certification of personal documents (such as birth certificates, marriage contracts, police records, graduation certificates) takes a maximum of 24 hours. Express service is available for emergencies.',
      sortOrder: 3,
      homepage: true
    },
    // Service FAQs (Certified translation)
    {
      questionAr: 'ما الذي يضمن قبول أوراقي لدى السفارة الألمانية؟',
      questionEn: 'What guarantees my documents will be accepted by the German Embassy?',
      answerAr: 'نحن نلتزم بالمعايير الدقيقة التي تطلبها السفارة الألمانية بالقاهرة، بما في ذلك كتابة الترجمة بالألمانية وتصديق وزارة الخارجية على أصل المستند قبل ترجمته والختم الرسمي لمكتبنا المعتمد. سارة الغندور رئيسة القسم تشرف شخصياً على الملفات.',
      answerEn: 'We adhere to the exact standards required by the German Embassy in Cairo, including translating into German, ensuring the original is MOFA legalized, and certifying with our recognized stamp. Our department head, Sarah Al-Ghandour, personally supervises German files.',
      sortOrder: 1,
      serviceId: serviceRecords[0].id
    },
    // Document FAQs (Birth Certificate)
    {
      questionAr: 'هل يجب إحضار أصل شهادة الميلاد لإتمام الترجمة المعتمدة؟',
      questionEn: 'Do I need to bring the original birth certificate for certified translation?',
      answerAr: 'يمكننا البدء بالترجمة من خلال صورة ضوئية واضحة أو نسخة ممسوحة ضوئياً ترسلها لنا عبر الواتساب أو الموقع، ولكن عند تقديم الملف للسفارة، يجب إرفاق أصل الشهادة الموثقة من الخارجية مع ترجمتها معاً.',
      answerEn: 'We can start translation from a clear photo or scan sent via WhatsApp or our site. However, when submitting to the embassy, you must present the original legalized certificate alongside its certified translation.',
      sortOrder: 1,
      documentId: documentRecords[0].id
    },
    // Embassy FAQs (Germany)
    {
      questionAr: 'هل تتطلب سفارة ألمانيا تصديق الخارجية المصرية؟',
      questionEn: 'Does the German Embassy require Egyptian MOFA legalization?',
      answerAr: 'نعم، تشترط السفارة الألمانية بشكل أساسي تصديق وزارة الخارجية المصرية على الأوراق والمستندات الرسمية الصادرة من مصر قبل تقديمها مترجمة.',
      answerEn: 'Yes, the German Embassy strictly requires all official documents issued in Egypt to be legalized by the Egyptian Ministry of Foreign Affairs before being submitted with translations.',
      sortOrder: 1,
      embassyId: embassyRecords[0].id
    },
    // GovEntity FAQs (MOFA)
    {
      questionAr: 'أين توجد مكاتب تصديقات وزارة الخارجية في القاهرة والجيزة؟',
      questionEn: 'Where are the Ministry of Foreign Affairs legalization offices in Cairo and Giza?',
      answerAr: 'تنتشر مكاتب التصديقات في عدة مناطق رئيسية، مثل: مكتب أحمد عرابي بالمهندسين، مكتب القوات المسلحة بمصر الجديدة، مكتب الميريلاند، ومكتب التصديقات بمحافظة الجيزة.',
      answerEn: 'MOFA legalization offices are located in several key areas, including Ahmed Orabi in Mohandessin, the Armed Forces office in Heliopolis, Maryland, and the Giza Governorate office.',
      sortOrder: 1,
      govEntityId: govRecords[0].id
    },
    // BlogPost FAQs
    {
      questionAr: 'كيف أتأكد أن مكتب الترجمة معتمد لدى السفارة الألمانية؟',
      questionEn: 'How can I make sure a translation office is certified by the German Embassy?',
      answerAr: 'السفارة الألمانية لا تصدر قائمة رسمية للمكاتب، ولكنها تشترط أن تكون الترجمة مطابقة للمعايير القانونية الألمانية ومختومة وموقعة من مترجم معترف به وعضو نقابي، وهو ما توفره جلوبالايز جروب بالكامل.',
      answerEn: 'The German Embassy does not issue an official list of offices, but requires the translation to comply with German legal standards, stamped and signed by a recognized, qualified translator, which Globalize Group guarantees.',
      sortOrder: 1,
      blogPostId: blogRecords[0].id
    }
  ];

  for (const faq of faqs) {
    await prisma.fAQ.create({ data: faq });
  }

  console.log('Seeding reviews and blog relationships...');
  console.log('Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
