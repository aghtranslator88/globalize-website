import { setRequestLocale } from "next-intl/server";
import { getSEOHeaders, generateServiceJsonLd, generateFAQJsonLd, generateBreadcrumbJsonLd } from "@/lib/seo";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import QuoteForm from "@/components/QuoteForm";
import TrackedWhatsAppLink from "@/components/TrackedWhatsAppLink";
import TrackedPhoneLink from "@/components/TrackedPhoneLink";
import { Link } from "@/i18n/routing";

import {
  Activity,
  ShieldCheck,
  FileCheck,
  Building2,
  Lock,
  Clock,
  Phone,
  MessageCircle,
  ChevronDown,
  ArrowRight,
  ArrowLeft,
  FileText,
  Stethoscope,
  HeartPulse,
  Syringe,
  Pill,
  Award,
  AlertTriangle,
  Check,
  HelpCircle
} from "lucide-react";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isAr = locale === "ar";

  const title = isAr
    ? "مكتب ترجمة تقارير طبية معتمدة بالقاهرة والجيزة | علاج بالخارج وتحاليل | جلوبالايز جروب"
    : "Certified Medical Translation Services Cairo | Clinical Reports & Lab Tests | Globalize Group";

  const description = isAr
    ? "مكتب ترجمة طبية معتمد بالقاهرة والجيزة. ترجمة التقارير الطبية، التحاليل المخبرية، فحوصات الأشعة، ومذكرات العمليات الجراحية للسفر والعلاج بالخارج بدقة مصطلحات تامة وسرية مطلقة."
    : "Accredited medical translation office in Cairo & Giza. Certified translation for clinical summaries, pathology tests, operative notes, and overseas medical travel dossiers with strict patient confidentiality.";

  return getSEOHeaders(title, description, "/services/medical-translation", true, locale, true);
}

export default async function MedicalTranslationPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const isAr = locale === "ar";

  const breadcrumbs = [
    { name: isAr ? "الرئيسية" : "Home", url: "/" },
    { name: isAr ? "خدمات الترجمة" : "Services", url: "/certified" },
    { name: isAr ? "الترجمة الطبية المعتمدة" : "Certified Medical Translation", url: "/services/medical-translation" },
  ];

  const serviceJsonLd = generateServiceJsonLd({
    name: isAr ? "خدمات الترجمة الطبية المعتمدة" : "Certified Medical Translation Services",
    description: isAr
      ? "ترجمة طبية رسمية معتمدة للتقارير الطبية ونتائج التحاليل وفحوصات الأشعة وملفات العلاج بالخارج، مقبولة لدى المستشفيات العالمية والسفارات."
      : "Official certified medical translation for clinical reports, lab analyses, surgical records, and overseas treatment dossiers.",
    url: `https://globalizetl.com/${locale}/services/medical-translation`,
  });

  const breadcrumbJsonLd = generateBreadcrumbJsonLd(breadcrumbs);

  const medicalFaqs = [
    {
      id: "mf-1",
      question: isAr
        ? "هل الترجمة الطبية الصادرة من جلوبالايز جروب معتمدة لدى المستشفيات في الخارج وسفارات السفر للعلاج؟"
        : "Is your medical translation accepted by international hospitals and visa authorities for medical travel?",
      answer: isAr
        ? "نعم. تصدر جميع ترجماتنا الطبية ممهورة بختم مكتبنا المعتمد وتوقيع المترجم الطبي المسؤول، وتتضمن إقرار مطابقة رسمي يربط الترجمة بالتقرير الأصلي. هذه الصيغة معتمدة ومقبولة رسمياً لدى أقسام المرضى الدوليين (International Patient Departments) في مستشفيات ألمانيا، إنجلترا، فرنسا، الولايات المتحدة، وتركيا، وكذلك لدى السفارات الأجنبية وقنصلياتها في مصر (مثل السفارة الألمانية والإيطالية والأمريكية والبريطانية) لاستخراج تأشيرات العلاج الطبي وتنسيق الإخلاء الصحي."
        : "Yes. All our medical translations carry the official certification seal of our accredited office, authorized linguist signatures, and a formal Certificate of Accuracy. This format is accepted across International Patient Departments at major medical centers in Germany, the UK, France, the United States, and Turkey, as well as by foreign consular visa sections processing medical visas and medical evacuation dossiers.",
    },
    {
      id: "mf-2",
      question: isAr
        ? "من يقوم بترجمة ومراجعة الملفات الطبية المتخصصة لديكم؟"
        : "Who performs and reviews specialized clinical translations in your office?",
      answer: isAr
        ? "تُسند ملفات الترجمة الطبية حصرياً إلى مترجمين طبيين متخصصين من ذوي الخلفية الأكاديمية والعملية في الطب البشري والصيدلة والعلوم الطبية الحيوية، وذوي دراية كاملة بالمصطلحات السريرية والتصنيف الدولي للأمراض (ICD-10) والمصطلحات الدوائية العالمية. ويعقب الترجمة مرحلة تدقيق ومراجعة متقاطعة من مراجع طبي أول للتأكد من انعدام أي خطأ في الجرعات أو الأرقام أو مسميات التشخيصات والإجراءات الجراحية."
        : "Medical documents are handled strictly by translators with backgrounds in medicine, pharmacy, and biomedical sciences. They possess deep familiarity with clinical nomenclature, pharmacology, and ICD coding frameworks. Every translated file undergoes dual-layer review by senior medical editors who scrutinize dosage quantities, clinical parameters, surgical descriptions, and diagnostic terminology.",
    },
    {
      id: "mf-3",
      question: isAr
        ? "ما هي أنواع التقارير والفحوصات الطبية التي تقومون بترجمتها؟"
        : "What types of diagnostic reports and healthcare records do you translate?",
      answer: isAr
        ? "نترجم كافة أنواع الوثائق الصحية: التقارير السريرية الشاملة، نتائج تحاليل الدم والمناعة والجينات، تقارير فحص الأنسجة والخزعات (Histopathology & Biopsy)، تقارير الأشعة التشخيصية (الرنين المغناطيسي، الأشعة المقطعية، المسح الذري، والموجات الصوتية)، مذكرات الجراحين وتقارير العمليات الجراحية، مذكرات الخروج من المستشفيات، الروشتات والوصفات الدوائية، وملفات تسجيل الأدوية والتجارب الإكلينيكية لدى هيئة الدواء المصرية."
        : "We translate the entire spectrum of medical documentation: comprehensive diagnostic workups, pathology and biopsy histopathology reports, laboratory panels, diagnostic imaging (MRI, CT, PET-CT, ultrasound), operative summaries and anesthesia logs, hospital discharge summaries, specialist referrals, and pharmaceutical regulatory dossiers for the Egyptian Drug Authority (EDA).",
    },
    {
      id: "mf-4",
      question: isAr
        ? "كيف تتعاملون مع الحالات الحرجة ومواعيد السفر المستعجلة للعلاج بالخارج؟"
        : "How do you handle emergency medical files and urgent flight deadlines?",
      answer: isAr
        ? "ندرك تماماً أن القرارات الطبية لا تحتمل التأخير، خاصة في حالات السفر العاجل لتلقي العلاج أو استشارة استشاري بالخارج؛ لذلك نوفر مساراً عاجلاً للترجمة الفورية للتقارير الطبية يتيح تسليم الملفات المعتمدة خلال ساعات معدودة في نفس اليوم، مع إرسال نسخ PDF إلكترونية عالية الدقة فور اعتمادها وتوفير النسخ الورقية المختومة للاستلام من أقرب فرع أو عبر مندوب سريع."
        : "We recognize that medical treatment schedules and emergency consultations cannot tolerate delays. We maintain an express clinical workflow capable of delivering certified medical translations within hours on the same day. High-resolution stamped digital copies are transmitted instantly for urgent hospital admission, with hard copies dispatched via courier.",
    },
    {
      id: "mf-5",
      question: isAr
        ? "كيف تضمنون سرية الملفات الطبية وخصوصية بيانات المريض؟"
        : "How do you guarantee patient privacy and health data confidentiality?",
      answer: isAr
        ? "نطبق تدابير صارمة لحماية الخصوصية والبيانات الصحية للمرضى بما يتوافق مع المعايير الأخلاقية الطبية وأحكام قانون حماية البيانات الشخصية المصري رقم 151 لسنة 2020. لا يطّلع على الملف إلا المترجم والمراجع المعينان، وتُنقل الملفات عبر بيئة مشفرة مع إمكانية حذف البيانات والتقارير من خوادمنا فور استلام العميل للترجمة بناءً على طلبه."
        : "We enforce stringent confidentiality protocols aligned with medical ethics and Egyptian Data Protection Law No. 151 of 2020. Access is restricted exclusively to designated clinical linguists. Files are transferred via encrypted protocols, and documents can be permanently expunged from our storage upon client receipt.",
    },
    {
      id: "mf-6",
      question: isAr
        ? "كيف يتم تحديد تكلفة ترجمة التقارير الطبية؟"
        : "How are pricing and rates calculated for medical reports?",
      answer: isAr
        ? "يتم التسعير بشفافية تامة وفقاً لحجم التقرير الطبي (عدد الصفحات أو الكلمات)، والزوج اللغوي المطلوب (مثل العربي إلى الإنجليزي أو الألماني أو الفرنسي)، ودرجة التخصص والمهلة الزمنية المتاحة. نقدم عرض سعر دقيق ومحدد فور إرسال صورة أو ملف التقرير عبر الواتساب أو البريد الإلكتروني دون أي رسوم خفية."
        : "Pricing is transparently calculated based on document page or word count, the language combination (e.g., Arabic to English, German, or French), terminological density, and delivery deadline. We provide an exact quotation immediately upon reviewing the scan or PDF via WhatsApp or email with no hidden fees.",
    },
    {
      id: "mf-7",
      question: isAr
        ? "أين تقع فروعكم لاستلام وتسليم التقارير الطبية الورقية؟"
        : "Where are your branches located for paper document drop-off and pickup?",
      answer: isAr
        ? "يمكنكم تسليم واستلام التقارير الطبية الورقية من مقرنا الرئيسي في 1 شارع جامعة القاهرة بالجيزة، أو من فروعنا في الدقي (2 ب شارع عكاشة بجوار الشهر العقاري)، والهرم (6 شارع أيوب بجوار كايرو مول)، ومصر الجديدة (عمارات العبور بشارع صلاح سالم). كما نوفر خدمة الاستلام والتسليم عبر مندوب سريع في كافة مناطق القاهرة الكبرى."
        : "You can submit and collect physical documents at our Giza Headquarters (1 Cairo University St.), or at our service branches in Dokki (2B Okasha St., next to the Real Estate Registry), Haram (6 Ayoub St., near Cairo Mall), and Heliopolis (Al-Obour Buildings, Salah Salem St.). Express courier pickup and delivery are also available across Greater Cairo.",
    },
    {
      id: "mf-8",
      question: isAr
        ? "كيف تترجمون تقارير الأورام وعلم الأنسجة (Biopsy & Histopathology) بدقة متناهية؟"
        : "How do you ensure precision in oncology staging and histopathology biopsy reports?",
      answer: isAr
        ? "تتطلب تقارير الأورام دقة جزيئية بالغة لتفادي أي ارتباك في البروتوكول العلاجي؛ فنقوم بالتحقق المتقاطع من تصنيف مراحل الورم وفق نظام TNM الدولي، ومؤشرات التمايز الخلوي (Histological Grading)، ومؤشرات التكاثر مثل Ki-67، والتحليلات الجينية الدقيقة (مثل طفرات EGFR وKRAS وHER2). ويقوم بمراجعة التقرير أطباء وصيادلة متخصصون لمطابقة أرقام بلوكات الشمع ونتائج الصبغات المناعية مع التقرير الأصلي قبل الختم والاعتماد."
        : "Oncology biopsy reports demand exacting precision in clinical staging and immunohistochemical profiling. We preserve standard clinical classifications including TNM staging parameters, histological grading criteria, mitotic indices (such as Ki-67 proliferation rates), and molecular genetic mutations (including EGFR, KRAS, and HER2 panels). Senior biomedical reviewers verify every numerical parameter and wax block reference directly against source lab prints to prevent diagnostic misalignment during overseas multidisciplinary tumor boards.",
    },
    {
      id: "mf-9",
      question: isAr
        ? "هل تقبل ترجمتكم للتقارير الطبية لدى المجالس الطبية المتخصصة وشركات التأمين الصحي؟"
        : "Is your medical translation accepted by Egyptian specialized health councils and medical insurers?",
      answer: isAr
        ? "نعم. تقبل تقاريرنا المترجمة والمعتمدة لدى المجالس الطبية المتخصصة بوزارة الصحة المصرية لاستخراج قرارات السفر للعلاج على نفقة الدولة، وكذلك لدى الهيئة العامة للتأمين الصحي، والنقابات المهنية، وكبرى شركات التأمين الصحي الخاصة المحلية والدولية (مثل أليانز، بوبا، وميتلايف) لتسوية مطالبات التعويض واسترداد نفقات العلاج والفحوصات بالخارج."
        : "Yes. Our certified medical translations are accepted by the Specialized Medical Councils of the Egyptian Ministry of Health for state-sponsored overseas treatment decrees, as well as by the General Authority for Health Insurance and major multinational private health insurers (including Bupa, Allianz, and MetLife) for international claim reimbursements and cross-border clinical authorizations.",
    },
  ];

  const faqJsonLd = generateFAQJsonLd(
    medicalFaqs.map((f, i) => ({
      id: f.id,
      question: f.question,
      answer: f.answer,
      sortOrder: i + 1,
    }))
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <Navbar />

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        {/* BREADCRUMBS */}
        <nav className="text-xs text-gray-500 mb-6" aria-label="Breadcrumb">
          <ol className="flex items-center gap-1.5 flex-wrap">
            {breadcrumbs.map((b, i) => (
              <li key={i} className="flex items-center gap-1.5">
                {i > 0 && <span className="text-gray-300">/</span>}
                <Link href={b.url} className="hover:text-primary-blue transition-colors">
                  {b.name}
                </Link>
              </li>
            ))}
          </ol>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 xl:gap-12">
          {/* MAIN COLUMN */}
          <div className="lg:col-span-2 space-y-12">
            {/* HERO SECTION */}
            <header className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-500/20 text-emerald-700 text-xs font-bold">
                <Activity className="h-3.5 w-3.5" />
                <span>{isAr ? "دقة تشخيصية معتمدة • سرية تامة لبيانات المريض" : "Clinically Verified • Strict Patient Privacy"}</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-black text-dark-navy leading-tight font-arabic">
                {isAr
                  ? "مكتب ترجمة تقارير طبية معتمدة بالقاهرة والجيزة"
                  : "Certified Medical Translation Services in Cairo & Giza"}
              </h1>
              <p className="text-gray-700 text-sm sm:text-base leading-relaxed">
                {isAr
                  ? "يقدم مكتب جلوبالايز جروب خدمات الترجمة الطبية المعتمدة للمرضى المسافرين للعلاج بالخارج، المستشفيات، المراكز الطبية، وشركات الأدوية. نترجم التقارير الطبية، نتائج التحاليل المخبرية، مذكرات العمليات الجراحية، وفحوصات الأشعة بدقة متناهية تخضع لمراجعة متخصصين في العلوم الطبية والصيدلانية، ومقبولة لدى كبرى المستشفيات الدولية والسفارات في مصر والخارج."
                  : "Globalize Group provides certified medical translation services tailored for patients seeking treatment abroad, international healthcare providers, research hospitals, and pharmaceutical enterprises. We translate diagnostic summaries, laboratory panels, operative summaries, and diagnostic imaging studies with clinical accuracy verified by biomedical linguists, fully accredited for hospital admissions and medical visa processing."}
              </p>

              {/* ACTION BUTTONS */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <TrackedWhatsAppLink
                  href={`https://wa.me/201062990808?text=${encodeURIComponent(
                    isAr
                      ? "مرحباً جلوبالايز جروب، أود إرسال تقرير طبي لترجمته ترجمة معتمدة للسفر والعلاج بالخارج."
                      : "Hello Globalize Group, I would like to submit a medical report for certified translation for overseas healthcare."
                  )}`}
                  ctaLocation="medical_translation_hero"
                  service="medical-translation"
                  language={locale}
                  className="inline-flex items-center gap-2 rounded-xl bg-whatsapp-green hover:bg-emerald-600 text-white px-5 py-3 text-xs sm:text-sm font-bold shadow-md transition-all duration-200 cursor-pointer"
                >
                  <MessageCircle className="h-4 w-4" />
                  <span>{isAr ? "إرسال تقرير طبي عبر واتساب" : "Send Medical Report via WhatsApp"}</span>
                </TrackedWhatsAppLink>
                <TrackedPhoneLink
                  href="tel:+201062990808"
                  ctaLocation="medical_translation_hero_phone"
                  language={locale}
                  className="inline-flex items-center gap-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-dark-navy px-4 py-3 text-xs sm:text-sm font-bold transition-colors cursor-pointer"
                >
                  <Phone className="h-4 w-4 text-primary-blue" />
                  <span dir="ltr">+20 106 299 0808</span>
                </TrackedPhoneLink>
              </div>
            </header>


            {/* ANSWER BOX: SEARCH INTENT DEFINITION */}
            <div className="rounded-2xl border-2 border-emerald-500/25 bg-gradient-to-br from-emerald-50/80 via-white to-emerald-50/40 p-6 sm:p-7 shadow-xs space-y-2">
              <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs uppercase tracking-wider">
                <FileCheck className="h-4 w-4" />
                <span>{isAr ? "ما هي معايير وشروط الترجمة الطبية المعتمدة؟" : "Accredited Medical Translation Standards"}</span>
              </div>
              <p className="text-dark-navy text-xs sm:text-sm leading-relaxed font-semibold">
                {isAr
                  ? "الترجمة الطبية المعتمدة هي النقل العلمي المنضبط للتقارير السريرية والفحوصات التشخيصية من لغة إلى أخرى دون أي لبس أو اجتهاد شخصي. وتتطلب قانوناً وطبياً التزاماً صارماً بالمصطلحات التشريحية والدوائية المعتمدة دولياً، ومطابقة دقيقة لنتائج التحاليل ووحدات القياس المخبرية والجرعات العلاجية. وتصدر ممهورة بختم مكتب ترجمة معتمد وتوقيع المترجم المسؤول مع إقرار مطابقة رسمي، لتكون مقبولة لدى اللجان الطبية في السفارات الأجنبية، وأقسام قبول المرضى الدوليين بالمستشفيات العالمية، وشركات التأمين الصحي الدولية."
                  : "Certified medical translation is the precise scientific rendering of diagnostic reports, pathology findings, and surgical notes by qualified healthcare linguists. It demands adherence to standard anatomical and pharmacological nomenclature, exact preservation of laboratory values and measurement units, and complete omission of ambiguous phrasing. Issued with the physical stamp of an accredited translation office and an official Certificate of Accuracy, it carries evidentiary standing before overseas hospital admissions boards, consular visa committees, and international medical insurers."}
              </p>
            </div>

            {/* DEEP EDITORIAL GUIDE: CLINICAL RISKS & PRACTICAL CONSIDERATIONS */}
            <article className="space-y-6 text-gray-700 text-xs sm:text-sm leading-relaxed">
              <div className="border-b border-gray-200 pb-3">
                <h2 className="text-xl sm:text-2xl font-bold text-dark-navy font-arabic">
                  {isAr
                    ? "مخاطر الترجمة الطبية غير المتخصصة ومعايير الدقة السريرية"
                    : "Clinical Risks of Unqualified Medical Translation & Terminological Standards"}
                </h2>
              </div>

              <p>
                {isAr
                  ? "على عكس الترجمات العامة، لا تحتمل الترجمة الطبية أي هامش للخطأ؛ فالخطأ في ترجمة مصطلح تشخيصي واحد أو التباس في قراءة اختصار معملي قد يؤدي إلى تشخيص خاطئ من الطبيب المعالج بالخارج أو تكرار فحوصات مؤلمة ومكلفة للمريض. يواجه المرضى الذين يعتمدون على ترجمات غير متخصصة مشاكل متكررة تشمل رفض السفارات لتأشيرات العلاج لعدم وضوح التشخيص، أو تأخير مواعيد العمليات الجراحية في المستشفيات المستقبلة."
                  : "Unlike general translation, medical translation carries direct clinical consequences. A single mistranslated diagnostic finding or an erroneous unit conversion can lead to medical mismanagement, contraindications, or redundant testing. Patients presenting non-specialized translations frequently encounter consular visa refusals, delayed hospital admissions, or confusion regarding surgical indications."}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
                <div className="p-4 rounded-xl border border-gray-200 bg-white space-y-2">
                  <h3 className="font-bold text-dark-navy text-xs sm:text-sm flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-amber-600" />
                    {isAr ? "فخ الاختصارات الطبية والتشابه اللفظي" : "Medical Abbreviations & Near-Homonyms"}
                  </h3>
                  <p className="text-gray-600 text-xs leading-relaxed">
                    {isAr
                      ? "تمتلئ التقارير الطبية باختصارات لاتينية وسريرية دقيقة؛ فمثلاً اختصار 'MI' قد يعني احتشاء عضلة القلب (Myocardial Infarction) أو ارتجاع الصمام الميترالي (Mitral Insufficiency)، واختصار 'MS' قد يشير إلى التصلب اللويحي (Multiple Sclerosis) أو تضيق الصمام الميترالي (Mitral Stenosis). يتطلب فهم السياق السريري الكامل معرفة متخصصة لضمان عدم حدوث أي لبس تشخيصي."
                      : "Clinical summaries rely heavily on Latin and English acronyms. For example, 'MI' may denote myocardial infarction or mitral insufficiency; 'MS' can mean multiple sclerosis or mitral stenosis. Decoupling these terms accurately requires deep contextual familiarity with clinical pathology."}
                  </p>
                </div>

                <div className="p-4 rounded-xl border border-gray-200 bg-white space-y-2">
                  <h3 className="font-bold text-dark-navy text-xs sm:text-sm flex items-center gap-2">
                    <Activity className="h-4 w-4 text-emerald-600" />
                    {isAr ? "تحويل وحدات القياس المخبرية المعتمدة" : "Laboratory Units & International Formats"}
                  </h3>
                  <p className="text-gray-600 text-xs leading-relaxed">
                    {isAr
                      ? "تختلف وحدات القياس المخبرية المعتمدة بين الدول؛ فمستشفيات ألمانيا وأوروبا تعتمد غالباً وحدات قياس تختلف عن المعايير الأمريكية والمصرية (مثل قياس سكر الدم بوحدة mmol/L مقابل mg/dL، أو قياس الهيموجلوبين بوحدة g/L مقابل g/dL). يحرص مترجمونا على توضيح الوحدات بدقة لتفادي أي ارتباك لدى الأطباء المشرفين."
                      : "Laboratory parameters often diverge across jurisdictions. European clinics routinely use international SI units (e.g., mmol/L for glucose), while US and Egyptian labs report in mg/dL. Our translators ensure laboratory indices, reference ranges, and unit symbols are represented with zero ambiguity."}
                  </p>
                </div>
              </div>

              <p>
                {isAr
                  ? "في جلوبالايز جروب، نعتمد على قواميس المصطلحات الطبية المعتمدة من منظمة الصحة العالمية (WHO) والتصنيف الدولي للأمراض (ICD-10)، بالإضافة إلى قواميس دورلاند وميدرا (MedDRA) الخاصة بالصناعات الدوائية، مع إخضاع كل تقرير لتدقيق متقاطع يشمل فحص الأرقام ونسب التحاليل والجرعات الدوائية بدقة مجهرية."
                  : "At Globalize Group, our medical linguists reference validated clinical terminologies from the World Health Organization (WHO), ICD-10 coding dictionaries, Dorland's Illustrated Medical Dictionary, and MedDRA standards for pharmacovigilance. Every document undergoes dual-layer verification to protect clinical values, laboratory thresholds, and medical history."}
              </p>
            </article>

            {/* CORE MEDICAL DOCUMENT SPECIALTIES */}
            <section className="space-y-6">
              <div className="border-b border-gray-200 pb-3">
                <h2 className="text-xl sm:text-2xl font-bold text-dark-navy font-arabic">
                  {isAr ? "التقارير والمستندات الطبية التي نختص بترجمتها" : "Medical Documents & Records in Our Practice"}
                </h2>
                <p className="text-gray-500 text-xs sm:text-sm mt-1">
                  {isAr
                    ? "تغطية تخصصية متكاملة لجميع الفروع الطبية والجراحية والتحاليل المخبرية."
                    : "A comprehensive practice serving patients, research hospitals, and pharmaceutical importers."}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* 1 */}
                <div className="rounded-xl border border-gray-200 bg-white p-5 space-y-2 hover:border-emerald-500/40 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                      <Stethoscope className="h-4 w-4" />
                    </div>
                    <h3 className="font-bold text-sm text-dark-navy">
                      {isAr ? "التقارير السريرية ومذكرات الخروج" : "Clinical Summaries & Discharge Letters"}
                    </h3>
                  </div>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    {isAr
                      ? "تقارير الفحص الإكلينيكي الشامل، تقارير أطباء الأورام، مذكرات الخروج من المستشفيات (Discharge Summaries)، ملخصات تاريخ المرضى ومراحل العلاج الكيماوي والإشعاعي، وتقارير المتابعة الدورية للحالات المزمنة."
                      : "Inpatient discharge summaries, clinical consultation letters, oncology staging evaluations, chemotherapy and radiotherapy progress records, and comprehensive longitudinal disease management dossiers."}
                  </p>
                </div>

                {/* 2 */}
                <div className="rounded-xl border border-gray-200 bg-white p-5 space-y-2 hover:border-emerald-500/40 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                      <Activity className="h-4 w-4" />
                    </div>
                    <h3 className="font-bold text-sm text-dark-navy">
                      {isAr ? "التحاليل المخبرية وعلم الأمراض والخزعات" : "Laboratory Panels, Pathology & Biopsies"}
                    </h3>
                  </div>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    {isAr
                      ? "فحوصات الدم الشاملة، تحاليل وظائف الكبد والكلى، دلالات الأورام (Tumor Markers)، تقارير فحص الأنسجة والخزعات الجراحية (Histopathology & Biopsy Reports)، وتحاليل الطفرات الجينية والمناعية."
                      : "Complete blood counts, metabolic and liver panels, tumor marker assays, histopathology biopsies, immunohistochemistry stains, and molecular genetic sequencing dossiers."}
                  </p>
                </div>

                {/* 3 */}
                <div className="rounded-xl border border-gray-200 bg-white p-5 space-y-2 hover:border-emerald-500/40 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                      <HeartPulse className="h-4 w-4" />
                    </div>
                    <h3 className="font-bold text-sm text-dark-navy">
                      {isAr ? "فحوصات الأشعة والتصوير التشخيصي" : "Diagnostic Imaging & Radiology Reports"}
                    </h3>
                  </div>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    {isAr
                      ? "تقارير الرنين المغناطيسي (MRI)، الأشعة المقطعية متعددة المقاطع (CT Scan)، المسح الذري والتصوير البوزيتروني (PET-CT)، أشعة الموجات فوق الصوتية (Ultrasound)، وفحوصات الدوبلر والقسطرة القلبية."
                      : "Magnetic resonance imaging (MRI), computed tomography (CT), positron emission tomography (PET-CT), Doppler ultrasound, mammography, and diagnostic cardiac catheterization reports."}
                  </p>
                </div>

                {/* 4 */}
                <div className="rounded-xl border border-gray-200 bg-white p-5 space-y-2 hover:border-emerald-500/40 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                      <Syringe className="h-4 w-4" />
                    </div>
                    <h3 className="font-bold text-sm text-dark-navy">
                      {isAr ? "تقارير العمليات الجراحية والتخدير" : "Operative Notes & Anesthesia Logs"}
                    </h3>
                  </div>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    {isAr
                      ? "مذكرات الجراحين المفصلة للإجراءات الجراحية، تقارير عمليات القلب والمخ والأعصاب وجراحات العظام، سجلات التخدير، تقارير التعافي في الرعاية المركزة (ICU)، وخطط التأهيل الطبي والعلاج الطبيعي."
                      : "Detailed operative records, neurosurgical and cardiovascular procedural logs, orthopedic reconstruction notes, anesthesia charts, ICU critical care progress notes, and physical therapy plans."}
                  </p>
                </div>

                {/* 5 */}
                <div className="rounded-xl border border-gray-200 bg-white p-5 space-y-2 hover:border-emerald-500/40 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                      <Pill className="h-4 w-4" />
                    </div>
                    <h3 className="font-bold text-sm text-dark-navy">
                      {isAr ? "ملفات الأدوية والأبحاث والتجارب الإكلينيكية" : "Pharmaceutical Dossiers & Clinical Trials"}
                    </h3>
                  </div>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    {isAr
                      ? "ملفات تسجيل المستحضرات الطبية والأدوية لدى هيئة الدواء المصرية (EDA)، نشرات الأدوية الموجهة للمرضى (PIL)، بروتوكولات التجارب السريرية، استمارات الموافقة المستنيرة، ودراسات التكافؤ الحيوي."
                      : "Drug master files for registration with the Egyptian Drug Authority (EDA), patient information leaflets (PIL), clinical trial investigator brochures, informed consent forms (ICF), and bioequivalence protocols."}
                  </p>
                </div>

                {/* 6 */}
                <div className="rounded-xl border border-gray-200 bg-white p-5 space-y-2 hover:border-emerald-500/40 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                      <FileText className="h-4 w-4" />
                    </div>
                    <h3 className="font-bold text-sm text-dark-navy">
                      {isAr ? "ملفات السفر للعلاج بالخارج والتأشيرات الطبية" : "Medical Travel Dossiers & Consular Visas"}
                    </h3>
                  </div>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    {isAr
                      ? "تجميع وتجهيز الملفات الطبية الشاملة المطلوبة للحصول على تأشيرات العلاج في سفارات ألمانيا، بريطانيا، أمريكا، والتشيك، والشهادات الطبية الرسمية والإجازات المرضية المعتمدة لجهات العمل والجامعات."
                      : "Preparation of consolidated medical dossiers for medical visa appointments at German, UK, US, and Czech consulates, accompanied by certified sick leave attestations for overseas employers and universities."}
                  </p>
                </div>
              </div>
            </section>

            {/* OVERSEAS MEDICAL TRAVEL GUIDE */}
            <section className="space-y-6">
              <div className="border-b border-gray-200 pb-3">
                <h2 className="text-xl sm:text-2xl font-bold text-dark-navy font-arabic">
                  {isAr
                    ? "دليل تجهيز الملف الطبي للسفر والعلاج بالخارج: المستندات والشروط القنصلية"
                    : "Preparing Clinical Dossiers for Overseas Healthcare & Consular Visas"}
                </h2>
                <p className="text-gray-500 text-xs sm:text-sm mt-1">
                  {isAr
                    ? "خطوات عملية لتجهيز التقارير المطلوبة لسفارات ألمانيا، إنجلترا، أمريكا، واللجان الطبية بالمستشفيات."
                    : "A practical preparation roadmap for international patient departments and embassy medical visa interviews."}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-gray-700">
                <div className="p-4 rounded-xl border border-gray-200 bg-white space-y-2">
                  <div className="font-bold text-dark-navy text-sm flex items-center gap-2">
                    <span className="h-6 w-6 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs">1</span>
                    {isAr ? "مستشفيات ألمانيا وأوروبا (اللغة الألمانية والإنجليزية)" : "German & European Hospitals (Charité & Heidelberg)"}
                  </div>
                  <p className="text-gray-600 leading-relaxed">
                    {isAr
                      ? "تشترط أقسام المرضى الدوليين في مستشفيات مثل شاريتيه في برلين ومستشفى هايدلبرغ الجامعي تقديم تقرير طبي مفصل لا يتجاوز تاريخ إصداره 3 أشهر، متضمناً التشخيص الكامل ونتائج فحص الخزعات والأنسجة (Histopathology) مع بيان التصنيف الورمي TNM، وقائمة الأدوية الحالية بالأسماء العلمية الدولية (INN)."
                      : "International patient admission offices at centers such as Charité Berlin and Heidelberg University Hospital require clinical summaries dated within 90 days. Dossiers must detail full histopathology staging (TNM classifications), current pharmacology under International Nonproprietary Names (INN), and converted metric laboratory values."}
                  </p>
                </div>

                <div className="p-4 rounded-xl border border-gray-200 bg-white space-y-2">
                  <div className="font-bold text-dark-navy text-sm flex items-center gap-2">
                    <span className="h-6 w-6 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs">2</span>
                    {isAr ? "المستشفيات البريطانية والأمريكية (Royal Marsden & Mayo)" : "UK & US Hospital Consortia (Royal Marsden & Mayo Clinic)"}
                  </div>
                  <p className="text-gray-600 leading-relaxed">
                    {isAr
                      ? "تطلب المستشفيات في لندن والولايات المتحدة مذكرات الخروج من المستشفى (Discharge Summaries)، وسجلات التخدير ومذكرات الجراحين عن أي تدخل جراحي سابق، مع تقارير الأشعة التشخيصية المفصلة مصحوبة برقم قيد الاستشاري المعالج في نقابة الأطباء المصرية لتوثيق المصدر الطبي."
                      : "Admissions teams across London and US academic centers mandate formal hospital discharge summaries, prior operative logs with anesthesia notes, and complete cross-sectional imaging reports referenced with the lead consultant's Egyptian Medical Syndicate registration."}
                  </p>
                </div>

                <div className="p-4 rounded-xl border border-gray-200 bg-white space-y-2">
                  <div className="font-bold text-dark-navy text-sm flex items-center gap-2">
                    <span className="h-6 w-6 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs">3</span>
                    {isAr ? "متطلبات تأشيرة العلاج في السفارات الأجنبية بالقاهرة" : "Consular Medical Visa Requirements in Cairo"}
                  </div>
                  <p className="text-gray-600 leading-relaxed">
                    {isAr
                      ? "تشترط أقسام التأشيرات بالسفارات (مثل السفارة الألمانية والبريطانية والأمريكية بالقاهرة) تقديم تقرير طبي مترجم ترجمة معتمدة يوضح تعذر إجراء التدخل المطلوب محلياً أو أفضلية العلاج بالخارج، مرفقاً به خطاب القبول المبدئي من المستشفى المستقبل وتقدير التكلفة المالية للعلاج."
                      : "Consular visa sections in Cairo—including the German, British, and US embassies—require certified translations confirming diagnostic status and clinical necessity, coupled with the receiving medical center's official invitation letter and preliminary financial estimate."}
                  </p>
                </div>

                <div className="p-4 rounded-xl border border-gray-200 bg-white space-y-2">
                  <div className="font-bold text-dark-navy text-sm flex items-center gap-2">
                    <span className="h-6 w-6 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs">4</span>
                    {isAr ? "قرارات العلاج على نفقة الدولة والمجالس الطبية" : "State Healthcare Decrees & Ministry Attestation"}
                  </div>
                  <p className="text-gray-600 leading-relaxed">
                    {isAr
                      ? "بالنسبة للمرضى الحاصلين على دعم حكومي أو قرارات من المجالس الطبية المتخصصة، نترجم قرارات السفر الرسمية والتقارير الطبية الثلاثية، ونجهز الملفات لاعتماد مكتب تصديقات وزارة الصحة ومكاتب تصديقات وزارة الخارجية المصرية لإنهاء إجراءات السفر الرسمية."
                      : "For patients granted state-funded medical support through the Egyptian Specialized Medical Councils, we translate official tripartite medical evaluation reports and overseas decrees, readying documentation for Ministry of Health and Ministry of Foreign Affairs attestations."}
                  </p>
                </div>
              </div>
            </section>

            {/* PHARMACEUTICAL DOSSIERS & EDA STANDARDS */}
            <section className="space-y-4 text-xs sm:text-sm text-gray-700">
              <div className="border-b border-gray-200 pb-3">
                <h2 className="text-xl sm:text-2xl font-bold text-dark-navy font-arabic">
                  {isAr
                    ? "معايير ترجمة التقارير الصيدلانية والتجارب السريرية لهيئة الدواء المصرية (EDA)"
                    : "Pharmaceutical Dossiers & Clinical Trial Translation for the Egyptian Drug Authority"}
                </h2>
                <p className="text-gray-500 text-xs sm:text-sm mt-1">
                  {isAr
                    ? "ضوابط اصطلاحية صارمة لملفات تسجيل الأدوية والمستلزمات الطبية والأبحاث السريرية."
                    : "Rigorous scientific translation meeting regulatory submission requirements for pharmaceutical sponsors."}
                </p>
              </div>

              <p className="leading-relaxed">
                {isAr
                  ? "تخضع ملفات تسجيل الأدوية والمستحضرات الحيوية والمستلزمات الطبية لدى هيئة الدواء المصرية (Egyptian Drug Authority - EDA) لاشتراطات فنية بالغة الدقة. يوفر فريقنا الصيدلاني المتخصص ترجمة معتمدة تتوافق مع إرشادات المجلس الدولي للتنسيق (ICH):"
                  : "Regulatory submissions for human pharmaceuticals, biologic products, and medical devices filed with the Egyptian Drug Authority (EDA) require strict adherence to international regulatory science standards. Our pharmaceutical translation team follows ICH and WHO drafting guidelines:"}
              </p>

              <div className="space-y-3">
                <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 space-y-1.5">
                  <h3 className="font-bold text-dark-navy text-xs sm:text-sm">
                    {isAr ? "1. ملفات التسجيل الفني الموحد (CTD / eCTD Modules)" : "1. Common Technical Document (CTD) Modules"}
                  </h3>
                  <p className="text-gray-600 text-xs leading-relaxed">
                    {isAr
                      ? "ترجمة ملخصات الجودة (Quality Overall Summary)، ودراسات السمية الدوائية قبل السريرية (Non-clinical Pharmacology & Toxicology)، وملخصات الدراسات السريرية (Clinical Study Reports) بما يطابق المصطلحات المعتمدة في دساتير الأدوية الدولية (USP / BP / Ph. Eur)."
                      : "Translating Quality Overall Summaries, non-clinical pharmacokinetic dossiers, toxicological safety assessments, and clinical study reports adhering strictly to international pharmacopeial monographs (USP, BP, and European Pharmacopoeia)."}
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 space-y-1.5">
                  <h3 className="font-bold text-dark-navy text-xs sm:text-sm">
                    {isAr ? "2. نشرات الأدوية للمريض والملخص الطبي للممارس (PIL & SmPC)" : "2. Patient Information Leaflets (PIL) & Summary of Product Characteristics (SmPC)"}
                  </h3>
                  <p className="text-gray-600 text-xs leading-relaxed">
                    {isAr
                      ? "صياغة نشرات الأدوية الموجهة للمريض بلغة عربية واضحة ومباشرة تخلو من التعقيد مع الحفاظ التام على التحذيرات، ودواعي الاستعمال، وموانع الاستخدام، والآثار الجانبية، مع صياغة ملخص خصائص المنتج (SmPC) باللغة الطبية المتخصصة الموجهة للأطباء والصيادلة."
                      : "Drafting bilingual patient leaflets in lucid, unambiguous language that clearly communicates dosages, contraindications, and adverse reactions, while translating Summary of Product Characteristics (SmPC) documents in precise pharmacological terminology for clinicians."}
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 space-y-1.5">
                  <h3 className="font-bold text-dark-navy text-xs sm:text-sm">
                    {isAr ? "3. استمارات الموافقة المستنيرة وبروتوكولات التجارب السريرية (ICF & Protocols)" : "3. Informed Consent Forms (ICF) & Clinical Trial Protocols"}
                  </h3>
                  <p className="text-gray-600 text-xs leading-relaxed">
                    {isAr
                      ? "ترجمة استمارات الموافقة المستنيرة (Informed Consent Forms) للمشاركين في التجارب السريرية في مصر وفق اشتراطات لجان أخلاقيات البحث العلمي (IRB/REC) وقانون تنظيم البحوث الطبية الإكلينيكية، مع ترجمة بروتوكولات البحث واستمارات الإبلاغ عن الحوادث العكسية الجسيمة (SAE Reports)."
                      : "Translating patient informed consent documents for clinical trial participants in Egypt compliant with institutional review board (IRB) ethics standards, alongside clinical investigator brochures, master protocols, and Serious Adverse Event (SAE) reporting dossiers."}
                  </p>
                </div>
              </div>
            </section>

            {/* PATIENT PRIVACY & DATA CONFIDENTIALITY */}
            <section className="rounded-2xl bg-gray-50 p-6 sm:p-8 border border-gray-200 space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-dark-navy text-white flex items-center justify-center shrink-0">
                  <Lock className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-dark-navy font-arabic">
                    {isAr ? "بروتوكول خصوصية البيانات الصحية وسرية المريض" : "Patient Privacy & Health Data Confidentiality Protocol"}
                  </h2>
                  <p className="text-xs text-gray-500">
                    {isAr ? "حماية مشددة لنتائج الفحوصات والملفات الشخصية" : "Full compliance with health data privacy and Egyptian Law No. 151 of 2020"}
                  </p>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                {isAr
                  ? "تخضع السجلات الطبية لمعايير حماية استثنائية لحماية خصوصية المرضى. وتشمل الإجراءات المعتمدة لدينا:"
                  : "Health records demand extraordinary privacy protections. We adhere to rigorous administrative and technical standards:"}
              </p>

              <ul className="space-y-2.5 text-xs text-gray-700">
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>
                    {isAr
                      ? "حصر الاطلاع على التقارير الطبية على المترجم الطبي المعتمد والمدقق المسؤول عن الملف حصراً."
                      : "Restricting document access strictly to the assigned medical linguist and reviewing medical editor."}
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>
                    {isAr
                      ? "تشفير الملفات الطبية المتبادلة وعدم مشاركة أي بيانات تشخيصية مع أي طرف ثالث تحت أي ظرف."
                      : "Ensuring end-to-end encrypted file handling with zero third-party disclosure under any circumstance."}
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>
                    {isAr
                      ? "إمكانية إخفاء البيانات الشخصية للمريض (Anonymization) والاكتفاء بالرقم التعريفي للملف الطبي عند رغبة العميل."
                      : "Offering complete patient data anonymization and record numbering upon client request."}
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>
                    {isAr
                      ? "الحذف النهائي للتقارير والتحاليل من خوادمنا فور تأكيد استلام العميل للنسخ المعتمدة."
                      : "Permanently purging digital medical files from our servers upon confirmed delivery to the client."}
                  </span>
                </li>
              </ul>
            </section>

            {/* PROCESS WORKFLOW: 4 STEPS */}
            <section className="space-y-6">
              <div className="border-b border-gray-200 pb-3">
                <h2 className="text-xl sm:text-2xl font-bold text-dark-navy font-arabic">
                  {isAr ? "خطوات ترجمة واعتماد تقريرك الطبي" : "Our Step-by-Step Medical Translation Workflow"}
                </h2>
                <p className="text-gray-500 text-xs sm:text-sm mt-1">
                  {isAr ? "إجراءات واضحة تضمن السرعة القصوى مع الحفاظ على الدقة السريرية." : "A swift, disciplined protocol designed for urgent medical travel deadlines."}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* Step 1 */}
                <div className="rounded-xl border border-gray-200 p-5 bg-white space-y-2 relative">
                  <span className="text-2xl font-black text-emerald-600/20">01</span>
                  <h3 className="font-bold text-sm text-dark-navy">
                    {isAr ? "إرسال التقرير الطبي بصورة واضحة" : "Submit Clear Report Scans"}
                  </h3>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    {isAr
                      ? "أرسل التقرير أو التحليل كملف PDF أو صورة واضحة عبر الواتساب أو النموذج، مع تحديد الدولة أو المستشفى الموجه إليه الملف لتحديد اللغة والنمط الاصطلاحي المفضل."
                      : "Upload clear digital scans or PDFs via WhatsApp or our secure portal, specifying your destination hospital or embassy."}
                  </p>
                </div>

                {/* Step 2 */}
                <div className="rounded-xl border border-gray-200 p-5 bg-white space-y-2 relative">
                  <span className="text-2xl font-black text-emerald-600/20">02</span>
                  <h3 className="font-bold text-sm text-dark-navy">
                    {isAr ? "معاينة سريرية وتحديد التكلفة والموعد" : "Clinical Review & Precise Quotation"}
                  </h3>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    {isAr
                      ? "يقوم منسق الترجمة الطبية بمعاينة الملف وتحديد عدد الصفحات والمصطلحات التخصصية، ويقدم عرض سعر فوري ومحدد مع جدول زمني دقيق للتسليم."
                      : "Our clinical coordinator reviews document volume and specialized nomenclature, issuing a binding quotation and delivery schedule."}
                  </p>
                </div>

                {/* Step 3 */}
                <div className="rounded-xl border border-gray-200 p-5 bg-white space-y-2 relative">
                  <span className="text-2xl font-black text-emerald-600/20">03</span>
                  <h3 className="font-bold text-sm text-dark-navy">
                    {isAr ? "الترجمة والتدقيق الطبي المتقاطع" : "Specialized Translation & Medical Review"}
                  </h3>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    {isAr
                      ? "يقوم مترجم طبي متخصص بصياغة التقرير مع مراعاة المصطلحات اللاتينية والإنجليزية، يعقبه تدقيق متقاطع للأرقام والنسب والجرعات التشخيصية."
                      : "An expert medical linguist translates the text, followed by rigorous verification of diagnostic parameters, dosages, and reference values."}
                  </p>
                </div>

                {/* Step 4 */}
                <div className="rounded-xl border border-gray-200 p-5 bg-white space-y-2 relative">
                  <span className="text-2xl font-black text-emerald-600/20">04</span>
                  <h3 className="font-bold text-sm text-dark-navy">
                    {isAr ? "الاعتماد الرسمي والتسليم الفوري" : "Official Certification & Express Delivery"}
                  </h3>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    {isAr
                      ? "تُختم الترجمة بختم الاعتماد الرسمي وتُسلم نسخة إلكترونية فورية (PDF) للتقديم العاجل، مع توفير النسخ الورقية المعتمدة من أقرب فرع أو عبر التوصيل."
                      : "The translation is certified with our official seal and Certificate of Accuracy. Digital copies arrive immediately, with stamped hard copies ready."}
                  </p>
                </div>
              </div>
            </section>

            {/* TRANSPARENT PRICING PRINCIPLES */}
            <section className="rounded-2xl border border-emerald-500/20 bg-gradient-to-r from-emerald-50/60 via-white to-emerald-50/60 p-6 sm:p-7 space-y-3">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-base shrink-0">
                  🩺
                </div>
                <div>
                  <h3 className="font-bold text-sm sm:text-base text-dark-navy">
                    {isAr ? "سياسة التسعير العادل والشفاف للتقارير الطبية" : "Transparent Medical Translation Pricing Policy"}
                  </h3>
                  <p className="text-xs text-gray-500">
                    {isAr ? "تسعير مخصص بحسب عدد الصفحات واللغة دون أي رسوم غير معلنة" : "Honest custom quotes based on actual volume, target language, and urgency"}
                  </p>
                </div>
              </div>
              <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
                {isAr
                  ? "تتفاوت التقارير الطبية تفاوتاً كبيراً في أحجامها؛ فتقرير تحليل دم أو أشعة سينية يختلف عن ملف جراحي مطول يضم عشرات الصفحات وتقارير الأنسجة. لذلك نوفر لكل عميل عرض سعر واضح ومحدد فور معاينة المستند عبر الواتساب، يوضح التكلفة الإجمالية والمدة الزمنية المحددة للاستلام، مع توفير مسارات عاجلة للحالات الطارئة ومواعيد السفر القريبة."
                  : "Clinical records span from single-page routine blood workups to extensive multidisciplinary surgical dossiers. Rather than imposing arbitrary flat fees, we evaluate the exact document volume and terminology density via WhatsApp or email to provide an itemized, transparent quote with guaranteed turnaround times."}
              </p>
              <div className="pt-2 flex flex-wrap items-center gap-3">
                <TrackedWhatsAppLink
                  href={`https://wa.me/201062990808?text=${encodeURIComponent(
                    isAr
                      ? "أود إرسال تقرير طبي لمعاينته ومعرفة تكلفة الترجمة المعتمدة وموعد الاستلام."
                      : "I would like to submit a medical report to receive an exact quotation and delivery timeline."
                  )}`}
                  ctaLocation="medical_translation_bottom_pricing"
                  service="medical-translation"
                  language={locale}
                  className="inline-flex items-center gap-2 rounded-lg bg-whatsapp-green hover:bg-emerald-600 text-white px-4 py-2.5 text-xs font-bold shadow-xs transition-colors cursor-pointer"
                >
                  <MessageCircle className="h-3.5 w-3.5" />
                  <span>{isAr ? "إرسال التقرير للمعاينة والتسعير" : "Submit Report for Pricing"}</span>
                </TrackedWhatsAppLink>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-primary-blue hover:underline"
                >
                  <span>{isAr ? "أو تفضل بزيارة أقرب فرع" : "Or visit one of our branches"}</span>
                  {isAr ? <ArrowLeft className="h-3 w-3" /> : <ArrowRight className="h-3 w-3" />}
                </Link>
              </div>

            </section>

            {/* FAQS SECTION */}
            <section className="space-y-4">
              <div className="border-b border-gray-200 pb-3">
                <h2 className="text-xl font-bold text-dark-navy font-arabic">
                  {isAr ? "الأسئلة الأكثر شيوعاً حول الترجمة الطبية المعتمدة" : "Frequently Asked Questions on Medical Translation"}
                </h2>
                <p className="text-gray-500 text-xs sm:text-sm mt-1">
                  {isAr
                    ? "إجابات شافية حول القبول لدى المستشفيات الدولية، سرية البيانات، ومواعيد التسليم."
                    : "Direct answers addressing international hospital acceptance, privacy, and express delivery."}
                </p>
              </div>

              <div className="space-y-3">
                {medicalFaqs.map((faq) => (
                  <div key={faq.id} className="border border-gray-200 rounded-xl overflow-hidden bg-white shadow-xs">
                    <details className="group">
                      <summary className="flex items-center justify-between px-5 py-4 font-bold text-xs sm:text-sm text-dark-navy cursor-pointer select-none bg-gray-50/50 hover:bg-gray-50 transition-colors list-none">
                        <span>{faq.question}</span>
                        <ChevronDown className="h-4 w-4 text-gray-500 transition-transform group-open:rotate-180 shrink-0" />
                      </summary>
                      <div className="px-5 py-4 text-xs text-gray-600 leading-relaxed border-t border-gray-100 bg-white">
                        {faq.answer}
                      </div>
                    </details>
                  </div>
                ))}
              </div>
            </section>

            {/* INTERNAL LINKS TO RELATED SERVICES */}
            <section className="rounded-xl border border-gray-200 bg-white p-6 space-y-4">
              <h3 className="font-bold text-sm text-dark-navy">
                {isAr ? "خدمات ترجمة معتمدة أخرى ذات صلة" : "Related Certified Translation Services"}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <Link
                  href="/services/legal-translation"
                  className="p-3 rounded-lg border border-gray-100 hover:border-primary-blue hover:bg-blue-50/30 transition-colors block"
                >
                  <div className="font-bold text-dark-navy mb-1">{isAr ? "الترجمة القانونية المعتمدة" : "Certified Legal Translation"}</div>
                  <div className="text-gray-500 text-[11px]">{isAr ? "العقود والتوكيلات وسجلات الشركات" : "Contracts, POAs & litigation records"}</div>
                </Link>
                <Link
                  href="/certified"
                  className="p-3 rounded-lg border border-gray-100 hover:border-primary-blue hover:bg-blue-50/30 transition-colors block"
                >
                  <div className="font-bold text-dark-navy mb-1">{isAr ? "ترجمة السفارات والتأشيرات" : "Embassy Certified Translation"}</div>
                  <div className="text-gray-500 text-[11px]">{isAr ? "تأشيرات السفر وتصديقات وزارة الخارجية" : "Visa translation & consular dossiers"}</div>
                </Link>
                <Link
                  href="/documents"
                  className="p-3 rounded-lg border border-gray-100 hover:border-primary-blue hover:bg-blue-50/30 transition-colors block"
                >
                  <div className="font-bold text-dark-navy mb-1">{isAr ? "ترجمة الوثائق والشهادات" : "Official Documents & Pricing"}</div>
                  <div className="text-gray-500 text-[11px]">{isAr ? "شهادات الميلاد والزواج والفيش الجنائي" : "Vital records & police clearances"}</div>
                </Link>
              </div>
            </section>
          </div>

          {/* SIDEBAR: QUOTE FORM + PHYSICAL BRANCHES */}
          <aside className="lg:col-span-1">
            <div className="sticky top-28 space-y-6">
              <QuoteForm />

              {/* BRANCH ACCESS CARD */}
              <div className="rounded-2xl border border-gray-200 bg-white p-5 space-y-3 shadow-xs">
                <h4 className="font-bold text-xs text-dark-navy uppercase tracking-wider">
                  {isAr ? "فروع جلوبالايز جروب في القاهرة والجيزة" : "Globalize Group Cairo & Giza Branches"}
                </h4>
                <div className="space-y-2 text-xs text-gray-600">
                  <div className="flex items-start gap-2">
                    <span className="text-emerald-600 font-bold">📍</span>
                    <div>
                      <strong className="text-dark-navy">{isAr ? "المقر الرئيسي (الجيزة):" : "Giza HQ:"}</strong>{" "}
                      {isAr ? "1 شارع جامعة القاهرة، أعلى عمر أفندي." : "1 Cairo University St., above Omar Effendi."}
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-emerald-600 font-bold">📍</span>
                    <div>
                      <strong className="text-dark-navy">{isAr ? "فرع الدقي:" : "Dokki Branch:"}</strong>{" "}
                      {isAr ? "2 ب شارع عكاشة، بجوار الشهر العقاري." : "2B Okasha St., next to Real Estate Registry."}
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-emerald-600 font-bold">📍</span>
                    <div>
                      <strong className="text-dark-navy">{isAr ? "فرع الهرم:" : "Haram Branch:"}</strong>{" "}
                      {isAr ? "6 شارع أيوب، متفرع من شارع الهرم." : "6 Ayoub St., off Haram St., near Cairo Mall."}
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-emerald-600 font-bold">📍</span>
                    <div>
                      <strong className="text-dark-navy">{isAr ? "فرع مصر الجديدة:" : "Heliopolis Branch:"}</strong>{" "}
                      {isAr ? "عمارات العبور، شارع صلاح سالم." : "Al-Obour Bldgs, Salah Salem St."}
                    </div>
                  </div>
                </div>
                <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-xs">
                  <span className="text-gray-500">{isAr ? "مواعيد العمل: السبت - الخميس (9 ص - 9 م)" : "Hours: Sat - Thu (9 AM - 9 PM)"}</span>
                  <Link href="/branches" className="text-primary-blue font-bold hover:underline">
                    {isAr ? "الخرائط" : "Maps"}
                  </Link>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </main>

      <Footer />
    </>
  );
}
