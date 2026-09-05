const fs = require('fs');
const path = require('path');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function updateItalyVisaPost() {
  console.log('================================================================');
  console.log('🇮🇹 UPDATING ITALY VISA ALMAVIVA POST WITH FULL ENGLISH VERSION');
  console.log('================================================================\n');

  const slug = 'italy-visa-egypt-almaviva';
  const titleAr = 'كيفية التقديم على تأشيرة إيطاليا من مصر عبر ألمافيفا: الخطوات والمستندات والرسوم';
  const titleEn = 'How to Apply for an Italian Visa from Egypt Through Almaviva: Steps, Documents, and Fees';

  const excerptAr = 'دليل عملي شامل للتقديم على تأشيرة إيطاليا من مصر عبر ألمافيفا (Almaviva Visa Egypt): خطوات حجز الموعد، قائمة المستندات المطلوبة، الرسوم الحالية، متطلبات التأمين الطبي والترجمة المعتمدة.';
  const excerptEn = 'A comprehensive practical guide on applying for an Italian Schengen or National visa from Egypt through Almaviva Visa Egypt: appointment booking, required document checklist, current fees, travel insurance, and certified Italian translation.';

  const seoTitleAr = 'تأشيرة إيطاليا من مصر عبر ألمافيفا: الخطوات والمستندات والرسوم | جلوباليز';
  const seoTitleEn = 'Italy Visa from Egypt Through Almaviva: Steps, Documents & Fees | Globalize';

  const metaDescAr = 'دليل عملي للتقديم على تأشيرة إيطاليا من مصر عبر ألمافيفا، مع شرح خطوات الحجز والمستندات والرسوم والتأمين والترجمة المعتمدة.';
  const metaDescEn = 'Learn how to apply for an Italy visa from Egypt through Almaviva, including documents, current fees, appointments, insurance, and certified translation.';

  const geoAnswerAr = 'يتم تقديم طلبات التأشيرة الإيطالية من مصر عبر مراكز Almaviva Visa Egypt في القاهرة والإسكندرية لدعم استقبال الطلبات، بينما قرار التأشيرة يصدر حصرياً من سفارة إيطاليا بالقاهرة.';
  const geoAnswerEn = 'Italian visa applications in Egypt are submitted through Almaviva Visa Egypt support centers in Cairo and Alexandria, while the final visa decision is made exclusively by the Italian Embassy in Cairo.';

  const bodyAr = `# كيفية التقديم على تأشيرة إيطاليا من مصر عبر ألمافيفا: الخطوات والمستندات والرسوم

## Answer Box

يتم تقديم طلبات التأشيرة الإيطالية من مصر عبر مراكز دعم تستخدمها سفارة إيطاليا لاستقبال طلبات التأشيرة. وتوجد مراكز Almaviva Visa Egypt في القاهرة والإسكندرية. تبدأ الإجراءات بتحديد نوع التأشيرة، ومراجعة المتطلبات الرسمية، وحجز الموعد من القناة المعتمدة، ثم تقديم الملف والبيانات البيومترية عند الحاجة ومتابعة الطلب.

## ما دور ألمافيفا في طلب تأشيرة إيطاليا من مصر؟

تستخدم سفارة إيطاليا في مصر مراكز Almaviva لدعم إجراءات تقديم طلبات التأشيرة واستقبال الملفات. وتوضح السفارة أن معلومات المواعيد والتقديم متاحة عبر موقع Almaviva Visa Egypt الرسمي، مع وجود مركزين في القاهرة والإسكندرية.

المركز مسؤول عن الإجراءات التشغيلية المرتبطة باستقبال الطلب، بينما قرار منح التأشيرة أو رفضها تتخذه الجهة القنصلية المختصة. لذلك من الخطأ التعامل مع مركز تقديم الطلب باعتباره الجهة التي تضمن صدور التأشيرة.

## ما أنواع التأشيرات الإيطالية التي يمكن التقديم عليها؟

نوع التأشيرة يعتمد على الغرض الحقيقي من السفر ومدة الإقامة. وقد تشمل الفئات:

- تأشيرة شنغن للإقامة القصيرة (السياحة وزيارة الأعمال).
- تأشيرة الدراسة والالتحاق بالجامعات الإيطالية.
- تأشيرة العمل وتصاريح الإقامة المهنية.
- تأشيرات الزيارة العائلية ولم الشمل.
- التأشيرات الوطنية من الفئة D للإقامات الطويلة.

يجب اختيار الفئة التي تتوافق مع الغرض الفعلي من السفر والمستندات الداعمة. وتوفر سفارة إيطاليا بالقاهرة معلومات رسمية عن أنواع التأشيرات ومتطلبات كل فئة.

## كيف تحجز موعد تأشيرة إيطاليا في مصر؟

ابدأ من موقع Almaviva Visa Egypt الرسمي المرتبط من موقع السفارة الإيطالية. تجنب الاعتماد على روابط قديمة أو وسطاء غير رسميين.

بعد تحديد فئة التأشيرة، اتبع تعليمات الحجز وأدخل بيانات المتقدم بدقة. احتفظ بتأكيد الموعد وأي إيصال أو رقم مرجعي يصدر أثناء العملية.

### أين توجد مراكز تقديم الطلب في مصر؟

| المركز | العنوان |
|---|---|
| القاهرة | 20 شارع المدينة المنورة، الدقي، الجيزة |
| الإسكندرية | مبنى 230 شارع عبد السلام عارف، لوران، الرمل أول، الإسكندرية |

تنشر السفارة بيانات المراكز ومواعيد العمل المحدثة على موقعها الرسمي.

### هل توجد ترتيبات خاصة لبعض المتقدمين؟

قد تعلن السفارة عن إجراءات خاصة لفئات معينة. ففي فبراير 2026 أعلنت، وفق شروط محددة، إمكانية التقديم بنظام walk-in لبعض حاملي تأشيرات سياحية إيطالية سابقة لمدة سنة على الأقل. لذلك يجب مراجعة آخر إعلان رسمي قبل اتخاذ قرار الحجز.

## ما المستندات المطلوبة لتأشيرة إيطاليا؟

تختلف القائمة الدقيقة حسب نوع التأشيرة والغرض من السفر. لذلك لا تستخدم قائمة عامة قديمة باعتبارها قائمة نهائية.

قد تشمل مستندات طلب شنغن، حسب الحالة:

- جواز سفر ساري المفعول لمدة لا تقل عن 3 أشهر بعد تاريخ العودة المقترح.
- نموذج طلب التأشيرة معبأ وموقع بدقة.
- صور شخصية حديثة بخلفية بيضاء وفق المواصفات القياسية.
- إثبات الغرض من الرحلة (حجوزات طيران وفنادق مبدئية مؤكدة).
- مستندات الإقامة أو خطاب الدعوة الرسمي عند زيارة الأقارب أو الأصدقاء.
- إثبات القدرة المالية (كشف حساب بنكي لآخر 6 أشهر بحركة واضحة).
- تأمين طبي للسفر يغطي منطقة شنغن بحد أدنى 30,000 يورو.
- مستندات العمل أو الدراسة أو السجل التجاري والبطاقة الضريبية.
- شهادة تحركات صادرة من مصلحة الجوازات والهجرة لتوضيح السفر السابق.

الأفضل دائمًا مراجعة قائمة المستندات الخاصة بنوع التأشيرة التي تتقدم لها، لأن متطلبات العمل والدراسة والسياحة والإقامات الطويلة ليست متطابقة.

## هل يجب ترجمة المستندات إلى الإيطالية؟

إذا كنت بحاجة إلى ترجمة أوراقك الرسمية، يمكنك الاعتماد على [مكتب ترجمة معتمد للسفارة الإيطالية بالقاهرة والإسكندرية](/ar/embassies/افضل-مترجم-ايطالي-معتمد-من-السفارة-الايطالية) لضمان قبول ملفك دون أي ملاحظات.

إذا كانت ترجمة وثائق معينة مطلوبة، فيجب إعدادها وفق متطلبات السفارة والقنصلية الإيطالية. ويشمل ذلك عند الحاجة:
- [ترجمة شهادات الميلاد والوفاة والقيد العائلي](/ar/documents/certified-birth-certificate)
- [ترجمة عقود الزواج والطلاق الرسمية](/ar/documents/marriage-contract)
- [ترجمة كشوف الحسابات البنكية وإثبات الملاءة المالية](/ar/documents/bank-statement)
- [ترجمة صحيفة الحالة الجنائية (الفيش والتشبيه)](/ar/documents/criminal-record-cert)
- السجلات التجارية والبطاقات الضريبية والشهادات الجامعية.

يجب أن تحافظ الترجمة المعتمدة على الأسماء والأرقام والتواريخ والأختام الرسمية، وأن تعكس محتوى الأصل بدقة بالغة.

## كيف تستعد لموعد تقديم الطلب؟

لا تنتظر يوم الموعد لمراجعة الملف. اتبع الخطوات التنظيمية التالية:

1. راجع جواز السفر وصلاحيته والتأكد من وجود صفحات فارغة.
2. تأكد من اكتمال نموذج الطلب وتطابق توقيعك مع جواز السفر.
3. قارن تهجئة الأسماء باللغة الإيطالية أو الإنجليزية مع جواز السفر في جميع المستندات.
4. رتب الملف وفق القائمة الرسمية المحددة من ألمافيفا.
5. أرفق النسخ الأصلية والمترجمة وصور واضحة منها.
6. راجع شروط وثيقة التأمين الطبي والتغطية المالية المطلوبة.
7. احضر في الموعد المحدد مع إيصال الحجز المسبق.

## ما تكلفة ورسوم تأشيرة إيطاليا من مصر؟

يجب التفريق بين رسوم التأشيرة القنصلية ورسوم الخدمة الخاصة بمركز ألمافيفا:

| الفئة | رسم التأشيرة القنصلي (يورو) | الملاحظات |
|---|---|---|
| البالغون (تأشيرة شنغن قصيرة) | 90 يورو | يُدفع بالجنيه المصري حسب سعر الصرف بالسفارة |
| الأطفال (من 6 إلى أقل من 12 سنة) | 45 يورو | رسم مخفض |
| الأطفال دون 6 سنوات | مجاناً | معفون من الرسوم القنصلية |
| التأشيرة الوطنية للإقامة الطويلة (Type D) | 116 يورو | للدراسة أو العمل أو لم الشمل |

*ملاحظة:* تُضاف رسوم خدمة مركز ألمافيفا إلى الرسوم القنصلية، ويُنصح بمراجعة جدول الرسوم المحدث قبل موعد التقديم.

## هل تأمين السفر الطبي إلزامي؟

نعم، بالنسبة لجميع تأشيرات شنغن، يجب استخراج وثيقة تأمين سفر طبي معتمدة تغطي كامل فترة الإقامة في منطقة شنغن، بحد أدنى للتغطية قدره 30,000 يورو للمصاريف الطبية الطارئة والعودة للوطن.

## ماذا يحدث بعد تقديم الطلب؟

بعد تسليم الملف وأخذ البصمات البيومترية في مركز ألمافيفا، يُرسل الملف بالكامل إلى القسم القنصلي بسفارة إيطاليا بالقاهرة أو القنصلية بالإسكندرية للبت في الطلب.

يمكنك تتبع حالة الطلب عبر الموقع الرسمي لألمافيفا باستخدام الرقم المرجعي ورقم جواز السفر، ثم استلام الجواز بعد إشعار الجاهزية.

## كيف تساعدك جلوباليز جروب في تجهيز أوراق تأشيرة إيطاليا؟

توفر جلوباليز جروب باقة متكاملة من [خدمات الترجمة المعتمدة](/ar/certified) لجميع [المستندات والشهادات الرسمية المطلوبة للسفارات](/ar/documents)، بما في ذلك مراجعة وتدقيق الأسماء اللاتينية ومطابقتها لجواز السفر، والتنسيق وفق الأصول المعتمدة لدى القنصلية الإيطالية ومراكز ألمافيفا.

تواصل معنا الآن عبر [صفحة التواصل السريع](/ar/contact) أو تفضل بزيارة أحد [فروعنا المعتمدة في القاهرة والإسكندرية](/ar/branches) للحصول على ترجمة معتمدة فورية ومضمونة.

---

### الأسئلة الشائعة حول تأشيرة إيطاليا عبر ألمافيفا

#### هل ألمافيفا هي التي تقرر قبول أو رفض تأشيرة إيطاليا؟
لا، ألمافيفا هي مركز دعم لوجستي واستقبال للمستندات فقط، بينما القرار النهائي هو مسؤولية حصرية للقسم القنصلي بسفارة إيطاليا.

#### كم تبلغ رسوم تأشيرة شنغن إيطاليا للبالغين؟
وفق أحدث جدول رسوم رسمي، تبلغ الرسوم القنصلية 90 يورو (تُدفع بما يعادلها بالجنيه المصري) بالإضافة لرسوم خدمة المركز.

#### أين تقع فروع ألمافيفا في مصر؟
توجد مراكز ألمافيفا الرسمية في القاهرة (الدقي، الجيزة) وفي الإسكندرية (لوران، عبد السلام عارف).

#### هل يجب ترجمة جميع الأوراق إلى الإيطالية؟
تشترط السفارة الإيطالية ترجمة المستندات الصادرة باللغة العربية إلى اللغة الإيطالية أو الإنجليزية ترجمة معتمدة ومختومة رسمياً وفق قائمة متطلبات التأشيرة.`;

  const bodyEn = `# How to Apply for an Italian Visa from Egypt Through Almaviva: Steps, Documents, and Fees

## Quick Answer (GEO Summary)

Applicants in Egypt submit their Italian visa applications through Almaviva Visa Egypt support centers in Cairo and Alexandria. The application procedure requires determining the accurate visa category, preparing the official document checklist, booking an appointment via official channels, submitting biometrics, and tracking the application until passport collection. The final visa decision is made exclusively by the Italian Embassy in Cairo.

## What Is Almaviva's Role in the Italian Visa Process?

The Embassy of Italy in Cairo utilizes Almaviva Visa Egypt application centers to handle operational and logistical intake of visa dossiers. Almaviva operates authorized centers in Cairo and Alexandria.

It is important to understand that Almaviva handles administrative intake, data entry, fee collection, and biometric enrollment. The sovereign decision to grant or refuse a visa rests entirely and solely with the Consular Section of the Italian Embassy.

## Which Italian Visa Category Should You Apply For?

Selecting the correct visa category is critical for visa acceptance. Categories include:

- **Short-Stay Schengen Visa (Type C):** For tourism, business visits, short training, cultural/sports events, or visiting relatives (up to 90 days).
- **National Long-Stay Visa (Type D):** For university studies, long-term employment, family reunification, or permanent residency.
- **Transit Visa:** For connecting flights through Italian airports to non-Schengen destinations.

Each visa category features specific regulatory guidelines, financial thresholds, and mandatory supporting evidence.

## How to Book an Italian Visa Appointment in Egypt

Appointments must be scheduled exclusively through the official Almaviva Visa Egypt platform linked from the Italian Embassy's consular portal. Avoid unauthorized agencies and third-party booking brokers.

### Official Almaviva Visa Application Centers in Egypt

| Center Location | Official Address |
|---|---|
| **Cairo Center** | 20 Elmadinah Elmonawara St., Dokki, Giza |
| **Alexandria Center** | Building 230, Abdelsalam Aref St., Loran, Elraml Awal, Alexandria |

*Note:* The Italian Embassy periodically announces special walk-in or expedited procedures for specific categories (such as frequent travelers with previous multi-year Schengen visas). Always verify current consular notices before scheduling.

## Comprehensive Required Documents Checklist

A standard Italian Schengen visa application dossier generally includes:

- **Original Passport:** Valid for at least 3 months beyond the intended departure from the Schengen zone, with at least two blank pages.
- **Completed Visa Application Form:** Filled accurately in Italian or English and signed by the applicant.
- **Biometric Photographs:** Recent standard passport-sized photos on a white background.
- **Proof of Travel Arrangements:** Round-trip flight itinerary and confirmed hotel reservation or official hospitality declaration (*Lettera di Invito*).
- **Proof of Financial Solvency:** Stamped bank statements covering the last 6 months showing regular income and sufficient funds.
- **Travel Medical Insurance:** Minimum coverage of €30,000 for emergency medical care and repatriation, valid across all Schengen states.
- **Employment / Academic Status:** Official HR letter with salary, role, and approved leave, or student enrollment letter.
- **Civil Status Documents:** Certified translation of birth, marriage, and family registry certificates where relevant.
- **Movement Certificate (*Mogamma*):** Stamped movement record from Egyptian Passports and Immigration Authority documenting past travel.

## Certified Translation Requirements for the Italian Embassy

Official documents issued in Arabic (such as marriage certificates, commercial registers, tax cards, court records, or birth certificates) must be translated into **Italian or English** by an accredited and authorized translation office.

To guarantee seamless consular compliance, you can rely on our [certified translation for the Italian Embassy in Cairo and Alexandria](/en/embassies/افضل-مترجم-ايطالي-معتمد-من-السفارة-الايطالية).

Globalize Group provides certified translations for all essential visa records:
- [Certified Birth Certificate Translation](/en/documents/certified-birth-certificate)
- [Official Marriage Contract Translation](/en/documents/marriage-contract)
- [Bank Statement & Financial Solvency Translation](/en/documents/bank-statement)
- [Police Clearance & Criminal Record Translation](/en/documents/criminal-record-cert)

Translations must maintain exact character spelling of names identical to your passport, accurate numerical data, and formal certification seals.

## Step-by-Step Preparation for Your Visa Appointment

1. **Verify Passport Validity:** Ensure no damage and valid expiry dates.
2. **Review Form Data:** Verify that all employment, destination, and accommodation details match supporting paperwork.
3. **Cross-Check Translations:** Confirm that English/Italian spellings across all certified translations mirror your passport.
4. **Organize Documents:** Arrange the dossier strictly following Almaviva's official submission sequence.
5. **Arrive Punctually:** Bring your printed appointment confirmation, passport, original documents, certified translations, and required fee payments.

## Italian Visa Fees and Service Charges in Egypt

| Visa Category | Consular Fee (€) | Notes |
|---|---|---|
| **Adults (Schengen Type C)** | €90 | Payable in EGP based on embassy exchange rates |
| **Children (Age 6 to under 12)** | €45 | Reduced consular rate |
| **Children (Under 6 years)** | Free | Fully exempt from consular fee |
| **National Long-Stay (Type D)** | €116 | Applicable for study, work, and family residency |

*Note:* Almaviva charges an administrative service fee per applicant in addition to the official consular fee.

## Mandatory Travel Medical Insurance Specifications

Travel medical insurance is legally required for all Schengen visa applications. The policy must:
- Provide minimum coverage of €30,000.
- Cover all member states of the Schengen territory.
- Cover the entire duration of the intended stay.
- Include emergency hospitalization, medical treatment, and repatriation.

## What Happens After Submitting Your Application?

Following document submission and biometric capture at Almaviva, your file is securely transferred to the Italian Embassy Consular Section. Standard processing times typically range between 15 to 30 calendar days.

You can track your dossier status online through Almaviva's tracking portal using your reference number and passport credentials.

## How Globalize Group Supports Your Italian Visa Application

Preparing your visa dossier with precision eliminates delays and administrative rejections. **Globalize Group** offers end-to-end [certified translation services](/en/certified) for all [official documents required by embassies and consulates](/en/documents).

Contact our specialized team today via our [contact page](/en/contact) or visit our [Cairo and Alexandria branches](/en/branches) for prompt, accurate, and consulate-accepted certified translations.

---

### Frequently Asked Questions (FAQ)

#### Does Almaviva decide whether an Italian visa is approved?
No. Almaviva is an outsourced visa application support center. The final decision to grant or refuse a visa is exclusively made by the Consular Section of the Italian Embassy in Cairo.

#### How much is the Italian Schengen visa fee?
The standard consular fee is €90 for adults and €45 for children aged 6–12, payable in Egyptian Pounds, plus Almaviva's local administrative service charge.

#### Where are Almaviva centers located in Egypt?
Almaviva operates official application centers in Cairo (Dokki, Giza) and Alexandria (Loran, Abdelsalam Aref St.).

#### Do Arabic documents need certified Italian translation?
Yes. Official Egyptian civil status, legal, and financial documents issued in Arabic must be translated into Italian or English by an accredited translation office before submission.`;

  const faqsAr = [
    {
      question: 'هل ألمافيفا هي التي تقرر قبول أو رفض تأشيرة إيطاليا؟',
      answer: 'لا. ألمافيفا تقدم خدمات دعم واستقبال الطلبات فقط، بينما قرار منح التأشيرة أو رفضها تتخذه الجهة القنصلية المختصة لدى سفارة إيطاليا بالقاهرة.'
    },
    {
      question: 'كم تبلغ رسوم تأشيرة شنغن إيطاليا؟',
      answer: 'وفق جدول الرسوم المنشور حاليًا من سفارة إيطاليا بالقاهرة، تبلغ الرسوم القياسية لتأشيرة شنغن 90 يورو للبالغين و45 يورو للأطفال بين 6 و12 سنة، مع إعفاء الأطفال دون 6 سنوات.'
    },
    {
      question: 'أين أقدم طلب تأشيرة إيطاليا في مصر؟',
      answer: 'توجد مراكز دعم للتأشيرات Almaviva Visa Egypt في القاهرة (الدقي) والإسكندرية (لوران)، وتنشر سفارة إيطاليا العناوين ومعلومات الحجز على موقعها الرسمي.'
    },
    {
      question: 'هل أحتاج إلى ترجمة المستندات إلى الإيطالية؟',
      answer: 'نعم، تشترط السفارة الإيطالية ترجمة المستندات العربية إلى اللغة الإيطالية أو الإنجليزية ترجمة معتمدة ومطابقة للأصل من مكتب ترجمة معتمد.'
    }
  ];

  const faqsEn = [
    {
      question: 'Does Almaviva decide whether an Italian visa is approved?',
      answer: 'No. Almaviva provides administrative and logistical application intake, while the final visa decision is made exclusively by the Consular Section of the Italian Embassy.'
    },
    {
      question: 'How much is the Italian Schengen visa fee?',
      answer: 'According to the official fee schedule, the standard Schengen visa fee is €90 for adults and €45 for children aged 6 to 12, while children under 6 are exempt.'
    },
    {
      question: 'Where can I submit an Italian visa application in Egypt?',
      answer: 'Applications are submitted at official Almaviva Visa Egypt centers in Cairo (Dokki, Giza) and Alexandria (Loran).'
    },
    {
      question: 'Do I need certified Italian translation for my documents?',
      answer: 'Yes. Official civil, financial, and legal records issued in Arabic must be translated into Italian or English by an accredited certified translation office.'
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
      inLanguage: 'ar',
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
      datePublished: '2026-08-31T12:00:00.000Z',
      dateModified: '2026-09-05T12:00:00.000Z'
    },
    articleEn: {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: titleEn,
      description: excerptEn,
      image: `https://www.globalizetl.com${featuredImageUrl}`,
      inLanguage: 'en',
      author: {
        '@type': 'Organization',
        name: 'Globalize Group'
      },
      publisher: {
        '@type': 'Organization',
        name: 'Globalize Group',
        logo: {
          '@type': 'ImageObject',
          url: 'https://www.globalizetl.com/logo.png'
        }
      },
      datePublished: '2026-08-31T12:00:00.000Z',
      dateModified: '2026-09-05T12:00:00.000Z'
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
    faqEn: {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqsEn.map(f => ({
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
    },
    breadcrumbEn: {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: 'https://www.globalizetl.com/en'
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Blog',
          item: 'https://www.globalizetl.com/en/blog'
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: titleEn,
          item: `https://www.globalizetl.com/en/blog/${slug}`
        }
      ]
    }
  };

  const imageMeta = {
    imageFilename: 'italy-visa-egypt-almaviva.jpg',
    imagePath: featuredImageUrl,
    altText: 'التقديم على تأشيرة إيطاليا من مصر عبر ألمافيفا وتجهيز المستندات',
    altTextEn: 'Italy visa application from Egypt through Almaviva with required documents',
    titleText: 'تأشيرة إيطاليا من مصر عبر ألمافيفا',
    titleTextEn: 'Italy Visa from Egypt Through Almaviva: Steps, Documents & Fees',
    caption: 'دليل عملي للتقديم على تأشيرة إيطاليا من مصر وتجهيز المستندات المطلوبة.',
    captionEn: 'A practical guide to applying for an Italian visa from Egypt and preparing the required documents.',
    primaryKeyword: 'تأشيرة إيطاليا من مصر',
    primaryKeywordEn: 'Italy visa from Egypt',
    relatedArticleSlug: slug
  };

  const author = {
    id: 'auth-1',
    name: 'د. أحمد منصور',
    nameEn: 'Dr. Ahmed Mansour',
    title: 'المدير التنفيذي ومترجم معتمد',
    titleEn: 'CEO & Certified Legal Translator',
    photoUrl: '',
    bio: 'خبير معتمد في الترجمة القانونية وتأشيرات السفارات والهجرة الدولية.',
    bioEn: 'Certified legal translation expert with 18+ years of experience in consular and embassy affairs.'
  };

  const updatedBlogPostItem = {
    id: `blog-${slug}`,
    title: titleAr,
    titleEn: titleEn,
    slug: slug,
    seoTitle: seoTitleAr,
    seoTitleEn: seoTitleEn,
    metaDescription: metaDescAr,
    metaDescriptionEn: metaDescEn,
    excerpt: excerptAr,
    excerptEn: excerptEn,
    body: bodyAr,
    bodyEn: bodyEn,
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
    categoryEn: 'Visas & Embassies',
    featuredImageUrl: featuredImageUrl,
    imageMeta: imageMeta,
    publishedAt: '2026-08-31T12:00:00.000Z',
    readMinutes: 8,
    geoAnswer: geoAnswerAr,
    geoAnswerEn: geoAnswerEn,
    faqs: faqsAr,
    faqsEn: faqsEn,
    schemas: schemas,
    author: author
  };

  // 1. Update Neon DB
  console.log('--- SYNCING TO NEON POSTGRESQL DATABASE ---');
  let teamMember = await prisma.teamMember.findFirst();

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
      authorId: teamMember ? teamMember.id : undefined,
      publishedAt: new Date('2026-08-31T12:00:00.000Z'),
      readMinutes: 8,
      published: true
    },
    create: {
      id: `blog-${slug}`,
      slug: slug,
      titleAr: titleAr,
      titleEn: titleEn,
      excerptAr: excerptAr,
      excerptEn: excerptEn,
      bodyAr: bodyAr,
      bodyEn: bodyEn,
      categoryAr: 'تأشيرات وسفارات',
      categoryEn: 'Visas & Embassies',
      featuredImageUrl: featuredImageUrl,
      authorId: teamMember ? teamMember.id : undefined,
      publishedAt: new Date('2026-08-31T12:00:00.000Z'),
      readMinutes: 8,
      published: true
    }
  });
  console.log('✓ Successfully updated Neon PostgreSQL DB with English & Arabic versions!');

  // 2. Update src/lib/blog-data.ts
  const blogDataModule = require('../src/lib/blog-data.ts');
  let allPosts = blogDataModule.ALL_BLOG_POSTS;
  allPosts = allPosts.filter(p => p.slug !== slug);
  allPosts.unshift(updatedBlogPostItem);

  const headerContent = `// Auto-generated blog dataset containing 102 fully audited & SEO/GEO/AEO optimized Arabic and English articles
export interface BlogPostItem {
  id: string;
  title: string;
  titleEn?: string;
  slug: string;
  seoTitle: string;
  seoTitleEn?: string;
  metaDescription: string;
  metaDescriptionEn?: string;
  excerpt: string;
  excerptEn?: string;
  body: string;
  bodyEn?: string;
  primaryKeyword: string;
  secondaryKeywords: string[];
  category: string;
  categoryEn?: string;
  featuredImageUrl: string;
  imageMeta: {
    imageFilename: string;
    imagePath: string;
    altText: string;
    altTextEn?: string;
    titleText: string;
    titleTextEn?: string;
    caption: string;
    captionEn?: string;
    primaryKeyword: string;
    primaryKeywordEn?: string;
    relatedArticleSlug: string;
  };
  publishedAt: string;
  readMinutes: number;
  geoAnswer: string;
  geoAnswerEn?: string;
  faqs: { question: string; answer: string }[];
  faqsEn?: { question: string; answer: string }[];
  schemas: any;
  author: {
    id: string;
    name: string;
    nameEn?: string;
    title: string;
    titleEn?: string;
    photoUrl: string;
    bio: string;
    bioEn?: string;
  };
}
`;

  const blogDataPath = path.resolve(__dirname, '../src/lib/blog-data.ts');
  fs.writeFileSync(blogDataPath, `${headerContent}\nexport const ALL_BLOG_POSTS: BlogPostItem[] = ${JSON.stringify(allPosts, null, 2)};\n`, 'utf8');
  console.log('✓ Successfully written updated dataset to src/lib/blog-data.ts');
}

updateItalyVisaPost()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
