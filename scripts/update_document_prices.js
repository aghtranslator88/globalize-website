const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function updatePrices() {
  console.log('Connecting to database to update document prices...');
  
  const documentsUpdate = [
    {
      slug: 'birth-certificate',
      nameAr: 'شهادة ميلاد مميكنة',
      nameEn: 'Certified Birth Certificate',
      priceEGP: 200,
      answerBoxAr: 'سعر ترجمة الصفحة الواحدة لشهادة الميلاد هو 200 جنيه مصري للترجمة بين العربية والإنجليزية، و300 جنيه مصري للصفحة لأي لغة أجنبية أخرى. وفي حال تعدد الصفحات يُحسب الإجمالي بعدد الصفحات مع تسليم معتمد خلال 24 ساعة.',
      answerBoxEn: 'The certified translation rate for a birth certificate starts at 200 EGP per page (Arabic ↔ English) and 300 EGP per page for any other foreign language. Multi-page documents are charged per page with 24-hour delivery.'
    },
    {
      slug: 'marriage-contract',
      nameAr: 'عقد زواج مميكن',
      nameEn: 'Certified Marriage Contract',
      priceEGP: 200,
      answerBoxAr: 'سعر ترجمة الصفحة الواحدة لعقد الزواج هو 200 جنيه مصري للترجمة بين العربية والإنجليزية، و300 جنيه مصري للصفحة للغات الأجنبية الأخرى، ويُحسب الإجمالي بعدد الصفحات مع تسليم معتمد خلال 24 ساعة.',
      answerBoxEn: 'The certified translation fee for marriage contracts is 200 EGP per page (Arabic ↔ English) and 300 EGP per page for other languages, calculated per page with 24-hour turnaround.'
    },
    {
      slug: 'family-record',
      nameAr: 'قيد عائلي مميكن',
      nameEn: 'Certified Family Record',
      priceEGP: 200,
      answerBoxAr: 'تكلفة ترجمة الصفحة للقيد العائلي المميكن تبدأ من 200 جنيه مصري (عربي ↔ إنجليزي) و300 جنيه مصري للغات الأخرى للصفحة، ويُحسب الإجمالي بعدد الصفحات.',
      answerBoxEn: 'Family record certified translation starts at 200 EGP per page (Arabic ↔ English) and 300 EGP per page for other languages, calculated based on total page count.'
    },
    {
      slug: 'movement-certificate',
      nameAr: 'شهادة تحركات',
      nameEn: 'Movement Certificate',
      priceEGP: 200,
      answerBoxAr: 'سعر ترجمة الصفحة لشهادة التحركات هو 200 جنيه مصري (عربي ↔ إنجليزي) و300 جنيه مصري للغات الأخرى، وتُحسب الشهادات المتعددة الصفحات بسعر الصفحة.',
      answerBoxEn: 'Movement certificate translation rate is 200 EGP per page (Arabic ↔ English) and 300 EGP per page for other languages, charged per page with official certification.'
    },
    {
      slug: 'death-certificate',
      nameAr: 'شهادة وفاة مميكنة',
      nameEn: 'Certified Death Certificate',
      priceEGP: 200,
      answerBoxAr: 'سعر ترجمة الصفحة الواحدة لشهادة الوفاة هو 200 جنيه مصري (عربي ↔ إنجليزي) و300 جنيه مصري للغات الأجنبية الأخرى، وتسلم معتمدة خلال 24 ساعة.',
      answerBoxEn: 'Certified death certificate translation is 200 EGP per page (Arabic ↔ English) and 300 EGP per page for other languages, processed within 24 hours.'
    },
    {
      slug: 'police-record',
      nameAr: 'فيش جنائي (صحيفة الحالة الجنائية)',
      nameEn: 'Certified Police Record (Criminal Record)',
      priceEGP: 200,
      answerBoxAr: 'تكلفة ترجمة الصفحة الواحدة للفيش الجنائي هي 200 جنيه مصري (عربي ↔ إنجليزي) و300 جنيه مصري لأي لغة ثانية، والتسليم معتمد رسمياً في 24 ساعة.',
      answerBoxEn: 'Police record certified translation is 200 EGP per page (Arabic ↔ English) and 300 EGP per page for other foreign languages, certified in 24 hours.'
    },
    {
      slug: 'graduation-certificate',
      nameAr: 'شهادة تخرج',
      nameEn: 'Certified Graduation Certificate',
      priceEGP: 200,
      answerBoxAr: 'سعر ترجمة الصفحة لشهادة التخرج هو 200 جنيه مصري (عربي ↔ إنجليزي) و300 جنيه مصري لأي لغة ثانية، وتُحسب المستندات متعددة الصفحات بعدد صفحاتها.',
      answerBoxEn: 'Graduation certificate translation is priced at 200 EGP per page (Arabic ↔ English) and 300 EGP per page for other languages, calculated per page.'
    },
    {
      slug: 'academic-transcript',
      nameAr: 'بيان درجات (سجل أكاديمي)',
      nameEn: 'Certified Academic Transcript',
      priceEGP: 200,
      answerBoxAr: 'سعر ترجمة بيان الدرجات هو 200 جنيه مصري للصفحة الواحدة (عربي ↔ إنجليزي) و300 جنيه مصري للصفحة للغات الأجنبية الأخرى، ويُحتسب الإجمالي وفقاً لعدد صفحات البيان.',
      answerBoxEn: 'Academic transcript translation is 200 EGP per page (Arabic ↔ English) and 300 EGP per page for other languages. Total fee is calculated based on transcript page count.'
    }
  ];

  for (const doc of documentsUpdate) {
    await prisma.document.upsert({
      where: { slug: doc.slug },
      update: {
        priceEGP: doc.priceEGP,
        answerBoxAr: doc.answerBoxAr,
        answerBoxEn: doc.answerBoxEn
      },
      create: {
        nameAr: doc.nameAr,
        nameEn: doc.nameEn,
        slug: doc.slug,
        priceEGP: doc.priceEGP,
        deliveryHours: 24,
        descriptionAr: `ترجمة معتمدة لـ ${doc.nameAr} مقبولة لدى كافة السفارات والجهات الرسمية.`,
        descriptionEn: `Official certified translation for ${doc.nameEn} accepted by all embassies.`,
        answerBoxAr: doc.answerBoxAr,
        answerBoxEn: doc.answerBoxEn,
        indexable: true
      }
    });
    console.log(`Updated document: ${doc.slug} -> priceEGP: 200`);
  }

  // Also update any other documents if they exist
  await prisma.document.updateMany({
    data: {
      priceEGP: 200
    }
  });

  console.log('All document records in database updated successfully!');
}

updatePrices()
  .catch((e) => {
    console.error('Error updating document prices:', e.message);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
