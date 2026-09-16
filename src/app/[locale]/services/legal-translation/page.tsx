import { setRequestLocale } from "next-intl/server";
import { getSEOHeaders, generateServiceJsonLd, generateFAQJsonLd, generateBreadcrumbJsonLd } from "@/lib/seo";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import QuoteForm from "@/components/QuoteForm";
import TrackedWhatsAppLink from "@/components/TrackedWhatsAppLink";
import TrackedPhoneLink from "@/components/TrackedPhoneLink";
import { Link } from "@/i18n/routing";

import {
  Scale,
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
  Briefcase,
  FileText,
  Landmark,
  Award,
  AlertTriangle,
  HelpCircle,
  MapPin,
  Check
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
    ? "مكتب ترجمة قانونية معتمد بالقاهرة والجيزة | عقود وقضايا وشركات | جلوبالايز جروب"
    : "Certified Legal Translation Services Cairo | Contracts & Court Records | Globalize Group";

  const description = isAr
    ? "مكتب ترجمة قانونية معتمد في القاهرة والجيزة. ترجمة العقود التجارية، صحف الدعاوى، مذكرات المحاكم، التوكيلات، ومستندات الشركات. ختم معتمد رسمي مع اتفاقية سرية (NDA)."
    : "Accredited legal translation office in Cairo & Giza. Certified translation for commercial agreements, litigation records, court pleadings, bylaws, and powers of attorney with strict NDA confidentiality.";

  return getSEOHeaders(title, description, "/services/legal-translation", true, locale, true);
}

export default async function LegalTranslationPage({
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
    { name: isAr ? "الترجمة القانونية المعتمدة" : "Certified Legal Translation", url: "/services/legal-translation" },
  ];

  const serviceJsonLd = generateServiceJsonLd({
    name: isAr ? "خدمات الترجمة القانونية المعتمدة" : "Certified Legal Translation Services",
    description: isAr
      ? "ترجمة قانونية رسمية معتمدة للعقود والاتفاقيات التجارية ووثائق المحاكم والتوكيلات، مقبولة لدى وزارة العدل والمحاكم والسفارات."
      : "Official certified legal translation for commercial contracts, litigation documents, and corporate records accepted by courts and ministries.",
    url: `https://globalizetl.com/${locale}/services/legal-translation`,
  });

  const breadcrumbJsonLd = generateBreadcrumbJsonLd(breadcrumbs);

  const legalFaqs = [
    {
      id: "lf-1",
      question: isAr
        ? "هل الترجمة القانونية المقدمة من جلوبالايز جروب معتمدة رسمياً أمام المحاكم والجهات الحكومية؟"
        : "Is your legal translation officially accepted by courts and government bodies?",
      answer: isAr
        ? "نعم. تصدر جميع الترجمات القانونية ممهورة بختم مكتبنا المعتمد وتوقيع المترجم المسؤول، وتتضمن إقرار مطابقة رسمي يربط النص المترجم بالأصل. هذه الصيغة معتمدة ومقبولة لدى المحاكم المصرية بمختلف درجاتها (المحاكم الابتدائية، محاكم الاستئناف، المحكمة الاقتصادية، ومحكمة النقض)، وهيئات التحكيم، ومكاتب الشهر العقاري والتوثيق، ووزارة العدل، بالإضافة إلى السفارات والقنصليات الأجنبية داخل جمهورية مصر العربية وخارجها."
        : "Yes. Every legal translation is issued with our accredited certification seal, authorized signature, and a formal Certificate of Accuracy binding the target translation directly to the source record. This standard is accepted across Egyptian courts (First Instance, Appellate, Economic, and Cassation Courts), arbitration tribunals (including CRCICA), notary offices, the Ministry of Justice, and foreign embassies worldwide.",
    },
    {
      id: "lf-2",
      question: isAr
        ? "كيف تتعاملون مع سرية المستندات والعقود الحساسة؟ هل توقعون اتفاقية سرية (NDA)؟"
        : "How do you protect the confidentiality of corporate and litigation records? Do you sign an NDA?",
      answer: isAr
        ? "نعتبر سرية المستندات التزاماً قانونياً ومهنياً غير قابل للتفاوض. يوقع جميع مترجمينا ومراجعينا القانونيين على اتفاقيات حظر إفصاح صارمة قبل مباشرة أي ملف. كما نلتزم بأحكام قانون حماية البيانات الشخصية المصري رقم 151 لسنة 2020. ويسعدنا دائماً توقيع اتفاقية سرية معلومات مسبقة (Non-Disclosure Agreement) مع شركتكم أو مكتبكم القانوني لحماية بنود الاتفاقيات والنزاعات القضائية والأسرار التجارية قبل بدء استلام الوثائق."
        : "Document confidentiality is a mandatory legal commitment. Every linguist and editor on our legal team operates under binding non-disclosure agreements. We comply with data security regulations, including Egyptian Data Protection Law No. 151 of 2020. We regularly execute mutual or unilateral Non-Disclosure Agreements (NDAs) directly with corporate clients and law firms before any confidential briefs, commercial agreements, or litigation records are shared.",
    },
    {
      id: "lf-3",
      question: isAr
        ? "ما الفرق بين المترجم العام والمترجم القانوني المتخصص في العقود والقضايا؟"
        : "What distinguishes a specialized legal translator from a general translator?",
      answer: isAr
        ? "الترجمة القانونية تتجاوز مجرد نقل الكلمات؛ فهي تتطلب فهماً معمقاً للأنظمة القضائية والقواعد الفقهية والتشريعية المقارنة بين القانون اللاتيني (Civil Law المطبق في مصر) والقانون العام (Common Law المطبق في بريطانيا وأمريكا). المترجم العام قد يترجم كلمة مثل 'Damages' على أنها 'أضرار'، في حين أن معناها القانوني الدقيق هو 'تعويضات'. والمصطلحات الإجرائية مثل 'Injunction' أو 'Indemnification' أو 'Force Majeure' تتطلب صياغة تمنع أي ثغرة قد يستغلها الخصم في المحكمة أو تفسد نية أطراف التعاقد."
        : "Legal translation requires deep comprehension of comparative legal traditions, specifically bridging the Romano-Germanic Civil Law tradition (practiced in Egypt) and the Anglo-American Common Law system. A general translator may misinterpret basic terms—for example, rendering 'damages' as general harm rather than financial compensation ('تعويضات'). Specialized legal translators ensure terms like 'indemnification', 'force majeure', 'joint and several liability', and 'injunctive relief' carry exact statutory weight without creating litigation liabilities.",
    },
    {
      id: "lf-4",
      question: isAr
        ? "كيف يتم احتساب سعر ترجمة العقود والمستندات القانونية؟"
        : "How are fees calculated for contracts and legal translations?",
      answer: isAr
        ? "نعتمد سياسة تسعير عادلة وشفافة تخضع لحجم الملف (عدد الكلمات أو الصفحات القانونية القياسية)، والزوج اللغوي المطلوب، والمهلة الزمنية المتاحة للتسليم، وطبيعة التخصص (عقود اعتيادية مقابل مذكرات تحكيم دولي معقدة). نقدم عروض أسعار تفصيلية ومحددة فور معاينة المستند عبر الواتساب أو البريد الإلكتروني دون أي رسوم خفية، مع توفير أسعار خاصة للملفات ذات الأحجام الكبيرة والتعاقدات السنوية لمكاتب المحاماة والشركات."
        : "Our rates are calculated transparently based on overall word volume, standard legal page counts, language combination, required turnaround schedule, and technical complexity (standard commercial contracts versus complex cross-border arbitration records). We provide itemized, binding quotations upon reviewing the files via WhatsApp or email with zero hidden surcharges, accompanied by volume arrangements for law firms and corporate legal departments.",
    },
    {
      id: "lf-5",
      question: isAr
        ? "ما هي المدة الزمنية المعتادة لتسليم العقود والمذكرات القانونية المترجمة؟"
        : "What is your turnaround schedule for contracts and legal documents?",
      answer: isAr
        ? "تعتمد المدة على حجم الملف. العقود والوثائق المتوسطة (حتى 10 إلى 15 صفحة) تسلم عادة خلال 24 إلى 48 ساعة عمل تشمل مرحلتي الترجمة والتدقيق القانوني المتقاطع. وفي الحالات القضائية العاجلة ومواعيد جلسات المحاكم الطارئة، نوفر مساراً عاجلاً يتيح تسليم الوثائق في نفس اليوم عبر فريق عمل مكرس للملف مع الحفاظ على أعلى درجات الدقة والتدقيق اللغوي والقانوني."
        : "Turnaround depends on page volume and complexity. Standard agreements and corporate filings (up to 10–15 pages) are typically delivered within 24 to 48 business hours, accounting for dual-layer drafting and senior legal proofreading. For impending court sessions, bidding deadlines, or urgent signing meetings, we provide an express pathway capable of same-day delivery through dedicated multi-linguist teams.",
    },
    {
      id: "lf-6",
      question: isAr
        ? "هل تترجمون السجلات التجارية والبطاقات الضريبية والقرارات الوزارية؟"
        : "Do you translate commercial registers, tax cards, and corporate resolutions?",
      answer: isAr
        ? "نعم، نترجم كافة المحررات الرسمية للشركات بما في ذلك مستخرجات السجل التجاري الحديثة، البطاقات الضريبية، شهادات التسجيل في ضريبة القيمة المضافة، محاضر اجتماعات الجمعيات العمومية العادية وغير العادية، وقرارات مجالس الإدارة، وصحف الاستثمار. وتعتمد هذه المستندات لدى البنوك المحلية والدولية، والغرف التجارية، والسفارات الأجنبية لفتح الحسابات أو استخراج تأشيرات رجال الأعمال."
        : "Yes. We translate all corporate establishment and compliance records, including current commercial registry extracts, corporate tax cards, VAT certificates, ordinary and extraordinary general assembly minutes, board resolutions, and investment authority gazettes. These records are accredited for international banking, corporate account onboarding, chamber of commerce filings, and executive visa applications.",
    },
    {
      id: "lf-7",
      question: isAr
        ? "أين تقع فروعكم في القاهرة والجيزة؟ وهل توفرون خدمة الاستلام والتوصيل؟"
        : "Where are your Cairo and Giza branches located? Do you provide delivery?",
      answer: isAr
        ? "يقع مقرنا الرئيسي في 1 شارع جامعة القاهرة بمحافظة الجيزة، ولدينا فروع في الدقي (2 ب شارع عكاشة بجوار الشهر العقاري)، والهرم (6 شارع أيوب بجوار كايرو مول)، ومصر الجديدة (عمارات العبور بشارع صلاح سالم). كما نوفر خدمة استقبال المستندات إلكترونياً بصيغ PDF أو صور عالية الدقة عبر الواتساب والبريد، وتوصيل النسخ الورقية المعتمدة والمختومة إلى مقر شركتكم أو مكتبكم في كافة محافظات مصر عبر مندوب سريع أو خدمات الشحن الموثوقة."
        : "Our primary headquarters is located at 1 Cairo University St., Giza, supported by dedicated service branches in Dokki (2B Okasha St., adjacent to the Real Estate Registry), Haram (6 Ayoub St., near Cairo Mall), and Heliopolis (Al-Obour Buildings, Salah Salem St.). Clients can submit records digitally via WhatsApp or email, and receive stamped paper copies delivered directly to their offices across Greater Cairo and Egyptian governorates via express courier.",
    },
    {
      id: "lf-8",
      question: isAr
        ? "هل تقبل ترجمتكم القانونية لدى البنوك المصرية والدولية لفتح الحسابات وتسهيلات الائتمان؟"
        : "Is your legal translation accepted by Egyptian and international banks for corporate onboarding?",
      answer: isAr
        ? "نعم. تعتمد البنوك العاملة في مصر (مثل البنك التجاري الدولي CIB، وبنك مصر، والبنك الأهلي المصري، وHSBC) والبنوك الخارجية في الإمارات والمملكة المتحدة والاتحاد الأوروبي ترجماتنا المعتمدة لعقود التأسيس، ومستخرجات السجل التجاري الحديثة، والبطاقات الضريبية، ومحاضر تعيين المفوضين بالتوقيع، والقوائم المالية المدققة. وتستوفي ترجماتنا معايير إدارات الامتثال المصرفي وإجراءات التحقق من العملاء ومكافحة غسل الأموال (KYC & AML)."
        : "Yes. Leading domestic and international banks—including CIB, HSBC, National Bank of Egypt, and Banque Misr, alongside corporate financial institutions across the UAE, the UK, and Europe—regularly accept our certified translations of commercial registry records, corporate bylaws, board signatory delegations, and audited financial statements for KYC compliance and corporate account opening.",
    },
    {
      id: "lf-9",
      question: isAr
        ? "كيف تترجمون أحكام محاكم الأسرة وإعلام الوراثة للسفر والإقامة في الخارج؟"
        : "How do you handle family court judgments, custody rulings, and inheritance decrees for residency abroad?",
      answer: isAr
        ? "تتطلب وثائق الأحوال الشخصية وقضايا الأسرة دقة بالغة في ضبط المصطلحات القانونية والشرعية؛ فنترجم إعلامات الوراثة الشرعية مع بيان أنصبة الورثة والمستحقين بدقة، وأحكام ثبوت النسب والطلاق، وقرارات الحضانة والولاية التعليمية الصادرة عن محاكم الأسرة المصرية. وتصدر الترجمة مختومة بختم مكتبنا المعتمد ومجهزة للتصديق من مكاتب وزارة الخارجية والقنصليات الأجنبية لمعاملات لمّ الشمل والإقامات العائلية."
        : "Family court decrees and personal status records require exacting precision to statutory and Sharia provisions. We translate official inheritance determination decrees with exact estate distributions, custody awards, educational guardianship rulings, and divorce decrees rendered by Egyptian Family Courts. All translations are stamped and prepared for attestation at the Egyptian Ministry of Foreign Affairs and foreign consular sections for family reunification and international residency filings.",
    },
  ];

  const faqJsonLd = generateFAQJsonLd(
    legalFaqs.map((f, i) => ({
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
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 border border-primary-blue/20 text-primary-blue text-xs font-bold">
                <Scale className="h-3.5 w-3.5" />
                <span>{isAr ? "اعتماد رسمي مع التزام صارم بالسرية" : "Official Certification • Strict NDA Protocols"}</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-black text-dark-navy leading-tight font-arabic">
                {isAr
                  ? "مكتب ترجمة قانونية معتمد بالقاهرة والجيزة"
                  : "Certified Legal Translation Services in Cairo & Giza"}
              </h1>
              <p className="text-gray-700 text-sm sm:text-base leading-relaxed">
                {isAr
                  ? "يقدم مكتب جلوبالايز جروب خدمات الترجمة القانونية المعتمدة للشركات متعددة الجنسيات، مكاتب المحاماة والاستشارات القانونية، والمستثمرين، والأفراد. نترجم العقود التجارية، صحف الدعاوى، الأحكام القضائية، مذكرات التحكيم الدولي، والتوكيلات الرسمية بدقة اصطلاحية تامة تتوافق مع القوانين السارية ومصطلحات المحاكم والهيئات الحكومية والسفارات الأجنبية."
                  : "Globalize Group delivers certified legal translation services tailored for multinational corporations, corporate legal departments, independent law practices, and private clients. We translate commercial agreements, court filings, judicial awards, powers of attorney, and statutory filings with terminological fidelity reflecting the nuances of domestic and international jurisprudence."}
              </p>

              {/* ACTION BUTTONS */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <TrackedWhatsAppLink
                  href={`https://wa.me/201062990808?text=${encodeURIComponent(
                    isAr
                      ? "مرحباً جلوبالايز جروب، أود إرسال وثائق قانونية للحصول على عرض سعر وموعد تسليم معتمد."
                      : "Hello Globalize Group, I would like to submit legal records for a certified translation quote and schedule."
                  )}`}
                  ctaLocation="legal_translation_hero"
                  service="legal-translation"
                  language={locale}
                  className="inline-flex items-center gap-2 rounded-xl bg-whatsapp-green hover:bg-emerald-600 text-white px-5 py-3 text-xs sm:text-sm font-bold shadow-md transition-all duration-200 cursor-pointer"
                >
                  <MessageCircle className="h-4 w-4" />
                  <span>{isAr ? "إرسال ملف قانوني عبر واتساب" : "Submit File via WhatsApp"}</span>
                </TrackedWhatsAppLink>
                <TrackedPhoneLink
                  href="tel:+201062990808"
                  ctaLocation="legal_translation_hero_phone"
                  language={locale}
                  className="inline-flex items-center gap-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-dark-navy px-4 py-3 text-xs sm:text-sm font-bold transition-colors cursor-pointer"
                >
                  <Phone className="h-4 w-4 text-primary-blue" />
                  <span dir="ltr">+20 106 299 0808</span>
                </TrackedPhoneLink>
              </div>
            </header>


            {/* ANSWER BOX: SEARCH INTENT DIRECT RESPONSE */}
            <div className="rounded-2xl border-2 border-primary-blue/25 bg-gradient-to-br from-blue-50/80 via-white to-blue-50/40 p-6 sm:p-7 shadow-xs space-y-2">
              <div className="flex items-center gap-2 text-primary-blue font-bold text-xs uppercase tracking-wider">
                <FileCheck className="h-4 w-4" />
                <span>{isAr ? "ما هي شروط ومعايير الترجمة القانونية المعتمدة؟" : "Accredited Legal Translation Standards"}</span>
              </div>
              <p className="text-dark-navy text-xs sm:text-sm leading-relaxed font-semibold">
                {isAr
                  ? "الترجمة القانونية المعتمدة هي صياغة قانونية منضبطة تنقل المعنى التشريعي والتعاقدي للنص الأصلي دون أي إخلال أو لبس. وتتطلب قانوناً توقيع مترجم قانوني معتمد وختم المكتب الرسمي المعتمد، وإرفاق إقرار مطابقة (Certificate of Accuracy) ينص صراحة على مطابقة النص المترجم للوثيقة الأصلية. بهذه الشروط تكون الترجمة حجة رسمية مقبولة قانوناً لدى المحاكم المصرية، مصلحة الشهر العقاري والتوثيق، هيئات التحكيم التجاري، والغرف التجارية، وسفارات الدول الأجنبية."
                  : "Certified legal translation represents a legally binding linguistic transfer that mirrors the statutory and contractual intent of the source text. To hold official standing, it must feature the physical stamp of an accredited translation office, the signature of a qualified legal translator, and a formal Certificate of Accuracy certifying true correspondence with the original instrument. This enables the document to carry full legal weight before domestic courts, public notary offices, commercial registries, arbitration panels, and international consular authorities."}
              </p>
            </div>

            {/* DEEP EDITORIAL GUIDE: WHY LEGAL TRANSLATION DEMANDS SPECIALIZATION */}
            <article className="space-y-6 text-gray-700 text-xs sm:text-sm leading-relaxed">
              <div className="border-b border-gray-200 pb-3">
                <h2 className="text-xl sm:text-2xl font-bold text-dark-navy font-arabic">
                  {isAr
                    ? "أهمية التخصص الدقيق في ترجمة العقود والمستندات القضائية"
                    : "Why Specialized Legal Acumen Matters in Contract & Court Translation"}
                </h2>
              </div>

              <p>
                {isAr
                  ? "تعد الترجمة القانونية من أدق فروع الترجمة وأكثرها حساسية؛ فالخطأ في صياغة بند تعاقدي واحد أو تفسير خاطئ لشرط جزائي قد يترتب عليه خسائر مالية جسيمة أو نزاعات قضائية معقدة أمام المحاكم. لا تقتصر مهمة المترجم القانوني المحترف على مجرد استبدال الكلمات بما يقابلها في القاموس، بل تتطلب إدراكاً عميقاً للفلسفة التشريعية للغتين واختلاف النظم القضائية بين الدول."
                  : "Legal translation represents one of the most demanding linguistic disciplines because a minor ambiguity in a contract clause or an inaccurate rendering of a penalty provision can trigger protracted litigation or severe financial exposure. A qualified legal translator does not merely consult dictionaries; they understand comparative jurisprudence and the structural distinctions between different legal traditions."}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
                <div className="p-4 rounded-xl border border-gray-200 bg-white space-y-2">
                  <h3 className="font-bold text-dark-navy text-xs sm:text-sm flex items-center gap-2">
                    <Scale className="h-4 w-4 text-primary-blue" />
                    {isAr ? "نظام القانون المدني (Civil Law)" : "Civil Law Traditions (Romano-Germanic)"}
                  </h3>
                  <p className="text-gray-600 text-xs leading-relaxed">
                    {isAr
                      ? "النظام المعمول به في مصر ومعظم دول الشرق الأوسط وأوروبا القارية. يعتمد على النصوص التشريعية المقننة (مثل القانون المدني وقانون المرافعات)، وتتميز نصوصه بالتركيز على المبادئ العامة وحسن النية والقوة القاهرة."
                      : "The system applied in Egypt and continental Europe. Grounded in codified statutes and civil codes, emphasizing general doctrines such as good faith and statutory force majeure."}
                  </p>
                </div>

                <div className="p-4 rounded-xl border border-gray-200 bg-white space-y-2">
                  <h3 className="font-bold text-dark-navy text-xs sm:text-sm flex items-center gap-2">
                    <Landmark className="h-4 w-4 text-primary-blue" />
                    {isAr ? "نظام القانون العام (Common Law)" : "Common Law Traditions (Anglo-American)"}
                  </h3>
                  <p className="text-gray-600 text-xs leading-relaxed">
                    {isAr
                      ? "النظام السائد في بريطانيا والولايات المتحدة ودول الكومنولث. يعتمد على السوابق القضائية، وتميل صياغته التعاقدية إلى الإسهاب الشديد والتحوط من كل احتمال وارد (Boilerplate Clauses)."
                      : "Prevalent across the UK, US, and Commonwealth jurisdictions. Reliant upon judicial precedent, characterized by exhaustive definitions and elaborate boilerplate protective drafting."}
                  </p>
                </div>
              </div>

              <p>
                {isAr
                  ? "في جلوبالايز جروب، يقوم فريقنا القانوني بمطابقة المصطلحات بدقة، مع مراعاة المفاهيم الدقيقة مثل 'Indemnity' (التعويض الاتفاقي عن الخسارة) مقابل 'Damages' (التعويض القضائي عن الضرر)، وشروط إنهاء العقود 'Termination for Cause' مقابل 'Termination for Convenience'، والتفرقة الإجرائية الدقيقة في المحاكم بين 'Summons' (إعلان صحيفة الدعوى) و'Pleading' (المذكرة القضائية الموضوعية)."
                  : "At Globalize Group, our legal linguists differentiate rigorously between closely related yet distinct legal concepts. For instance, we distinguish between contractual indemnity and statutory damages, delineate 'termination for cause' from 'termination for convenience', and maintain strict procedural clarity between initial service of summons, interlocutory motions, and substantive defense pleadings."}
              </p>
            </article>

            {/* CORE LEGAL DOCUMENT CATEGORIES */}
            <section className="space-y-6">
              <div className="border-b border-gray-200 pb-3">
                <h2 className="text-xl sm:text-2xl font-bold text-dark-navy font-arabic">
                  {isAr ? "المستندات والعقود التي نختص بترجمتها قانونياً" : "Legal Document Categories in Our Practice"}
                </h2>
                <p className="text-gray-500 text-xs sm:text-sm mt-1">
                  {isAr
                    ? "نطاق عمل متكامل يلبي متطلبات مكاتب المحاماة، الإدارات القانونية للشركات، والأفراد."
                    : "A comprehensive practice serving corporate counsels, private practitioners, and institutional clients."}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* 1 */}
                <div className="rounded-xl border border-gray-200 bg-white p-5 space-y-2 hover:border-primary-blue/40 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-lg bg-blue-50 text-primary-blue flex items-center justify-center shrink-0">
                      <Briefcase className="h-4 w-4" />
                    </div>
                    <h3 className="font-bold text-sm text-dark-navy">
                      {isAr ? "عقود الشركات والاتفاقيات التجارية" : "Corporate & Commercial Agreements"}
                    </h3>
                  </div>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    {isAr
                      ? "عقود التأسيس والأنظمة الأساسية، اتفاقيات المساهمين (Shareholder Agreements)، عقود الاندماج والاستحواذ، اتفاقيات الشراكة والمشاريع المشتركة (Joint Ventures)، عقود التوزيع الحصري والوكالة التجارية، واتفاقيات الامتياز (Franchise)."
                      : "Articles of association, shareholder agreements, mergers and acquisitions documentation, joint venture contracts, distribution and agency agreements, franchise licenses, and commercial supply covenants."}
                  </p>
                </div>

                {/* 2 */}
                <div className="rounded-xl border border-gray-200 bg-white p-5 space-y-2 hover:border-primary-blue/40 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-lg bg-blue-50 text-primary-blue flex items-center justify-center shrink-0">
                      <Scale className="h-4 w-4" />
                    </div>
                    <h3 className="font-bold text-sm text-dark-navy">
                      {isAr ? "مذكرات التقاضي وأحكام المحاكم والتحكيم" : "Litigation, Pleadings & Arbitration Awards"}
                    </h3>
                  </div>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    {isAr
                      ? "صحف الدعاوى، مذكرات الدفاع أمام المحاكم الابتدائية والاستئناف والنقض، تقارير الخبراء، حوافظ المستندات القضائية، أحكام المحاكم الصادرة في المنازعات المدنية والتجارية، وقرارات هيئات التحكيم الدولي (مثل محكمة تحكيم ICC ومركز القاهرة الإقليمي للتحكيم CRCICA)."
                      : "Statements of claim, appellate defense briefs, expert witness affidavits, court evidentiary bundles, judicial decrees, and institutional arbitration awards rendered under ICC, CRCICA, or UNCITRAL frameworks."}
                  </p>
                </div>

                {/* 3 */}
                <div className="rounded-xl border border-gray-200 bg-white p-5 space-y-2 hover:border-primary-blue/40 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-lg bg-blue-50 text-primary-blue flex items-center justify-center shrink-0">
                      <FileCheck className="h-4 w-4" />
                    </div>
                    <h3 className="font-bold text-sm text-dark-navy">
                      {isAr ? "التوكيلات الرسمية ومحررات الشهر العقاري" : "Powers of Attorney & Notarial Records"}
                    </h3>
                  </div>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    {isAr
                      ? "التوكيلات العامة والخاصة، توكيلات إدارة الشركات والتمثيل القانوني، الإقرارات المشفوعة باليمين (Affidavits)، عقود بيع العقارات والمركبات، وتصديقات مكاتب الشهر العقاري والتوثيق المصرية والقنصليات الخارجية."
                      : "General and special powers of attorney, corporate representation POAs, sworn affidavits, real estate conveyance deeds, vehicle title assignments, and consular legalizations."}
                  </p>
                </div>

                {/* 4 */}
                <div className="rounded-xl border border-gray-200 bg-white p-5 space-y-2 hover:border-primary-blue/40 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-lg bg-blue-50 text-primary-blue flex items-center justify-center shrink-0">
                      <Building2 className="h-4 w-4" />
                    </div>
                    <h3 className="font-bold text-sm text-dark-navy">
                      {isAr ? "السجلات التجارية والبطاقات الضريبية والقوائم" : "Commercial Registers & Corporate Disclosures"}
                    </h3>
                  </div>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    {isAr
                      ? "مستخرجات السجل التجاري الحديثة، البطاقات الضريبية، شهادات التسجيل في ضريبة القيمة المضافة، محاضر الجمعيات العمومية ومجالس الإدارة، والقوائم المالية المعتمدة للشركات لفتح الحسابات البنكية بالخارج أو التعامل مع الجهات الحكومية."
                      : "Official commercial registry extracts, corporate tax identification cards, VAT certificates, board and general assembly minutes, audited balance sheets, and compliance filings for international corporate banking."}
                  </p>
                </div>

                {/* 5 */}
                <div className="rounded-xl border border-gray-200 bg-white p-5 space-y-2 hover:border-primary-blue/40 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-lg bg-blue-50 text-primary-blue flex items-center justify-center shrink-0">
                      <Landmark className="h-4 w-4" />
                    </div>
                    <h3 className="font-bold text-sm text-dark-navy">
                      {isAr ? "الملكية الفكرية وبراءات الاختراع والترخيص" : "Intellectual Property & Licensing"}
                    </h3>
                  </div>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    {isAr
                      ? "مستندات تسجيل العلامات التجارية والأسماء التجارية، طلبات براءات الاختراع ومواصفاتها الفنية، اتفاقيات ترخيص التقنية، عقود نقل التكنولوجيا، ونزاعات التعدي على حقوق الملكية الفكرية."
                      : "Trademark registration applications, patent specifications and claims, technology transfer agreements, software licensing deeds, and intellectual property dispute filings."}
                  </p>
                </div>

                {/* 6 */}
                <div className="rounded-xl border border-gray-200 bg-white p-5 space-y-2 hover:border-primary-blue/40 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-lg bg-blue-50 text-primary-blue flex items-center justify-center shrink-0">
                      <FileText className="h-4 w-4" />
                    </div>
                    <h3 className="font-bold text-sm text-dark-navy">
                      {isAr ? "قوانين العمل واللوائح والتحقيقات الإدارية" : "Labor Regulations & Employment Disputes"}
                    </h3>
                  </div>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    {isAr
                      ? "عقود العمل الفردية والجماعية، لوائح تنظيم العمل الداخلية المعتمدة من وزارة العمل، خطط الحوافز والمكافآت، محاضر التحقيقات الإدارية، وإخطارات إنهاء الخدمة والمخالصات النهائية."
                      : "Individual executive employment agreements, certified internal company policies, non-compete covenants, administrative inquiry records, and formal severance settlements."}
                  </p>
                </div>
              </div>
            </section>

            {/* LEGALIZATION CHAIN IN EGYPT */}
            <section className="space-y-6">
              <div className="border-b border-gray-200 pb-3">
                <h2 className="text-xl sm:text-2xl font-bold text-dark-navy font-arabic">
                  {isAr
                    ? "سلسلة التصديقات الرسمية: خطوات توثيق وترجمة المحررات القانونية في مصر"
                    : "The Official Legalization Chain: How Legal Documents are Attested in Egypt"}
                </h2>
                <p className="text-gray-500 text-xs sm:text-sm mt-1">
                  {isAr
                    ? "دليل إجرائي عملي للشركات والأفراد لتجهيز المستندات أمام المحاكم والسفارات والجهات الحكومية."
                    : "A procedural guide for corporations and individuals preparing records for ministries, courts, and consulates."}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-gray-700">
                <div className="p-4 rounded-xl border border-gray-200 bg-white space-y-2">
                  <div className="font-bold text-dark-navy text-sm flex items-center gap-2">
                    <span className="h-6 w-6 rounded-full bg-blue-100 text-primary-blue flex items-center justify-center font-bold text-xs">1</span>
                    {isAr ? "التوثيق من جهة الإصدار أو الشهر العقاري" : "Notarization or Issuing Authority Seal"}
                  </div>
                  <p className="text-gray-600 leading-relaxed">
                    {isAr
                      ? "تبدأ المعاملة القانونية باستخراج أصل المحرر رسمياً ومختوماً. بالنسبة للتوكيلات وعقود البيع، يتم توثيقها بمكاتب الشهر العقاري والتوثيق. أما السجلات التجارية والبطاقات الضريبية فيتم استخراج مستخرج حديث ممهور بخاتم شعار الجمهورية من مكتب السجل التجاري التابع له مقر الشركة."
                      : "Every cross-border legal filing starts with an authentic source instrument. Powers of attorney and conveyancing deeds require formal notarization at local Real Estate Registry (Shahr El-Akary) offices. Commercial extracts and tax cards must bear the live republican eagle seal from the competent Commercial Registry office."}
                  </p>
                </div>

                <div className="p-4 rounded-xl border border-gray-200 bg-white space-y-2">
                  <div className="font-bold text-dark-navy text-sm flex items-center gap-2">
                    <span className="h-6 w-6 rounded-full bg-blue-100 text-primary-blue flex items-center justify-center font-bold text-xs">2</span>
                    {isAr ? "التصديق من مكاتب وزارة الخارجية المصرية" : "Attestation at the Egyptian Ministry of Foreign Affairs"}
                  </div>
                  <p className="text-gray-600 leading-relaxed">
                    {isAr
                      ? "يُعرض أصل المحرر على أحد مكاتب تصديقات وزارة الخارجية المصرية في القاهرة أو الجيزة (مثل مكتب أحمد عرابي بالمهندسين، مكتب الميريلاند بمصر الجديدة، أو مكتب تصديقات الدراسة). يتحقق موظف التصديقات من صحة خاتم جهة الإصدار ويعتمد المستند بخاتم ورسوم التصديق الرسمية."
                      : "The original authenticated document must be presented to one of the certified Ministry of Foreign Affairs (MFA) attestation chambers in Cairo or Giza—such as the Ahmed Orabi office in Mohandessin, Maryland in Heliopolis, or El-Derasa. The attestation officer verifies the issuing authority's live seal and affixes the official state authentication sticker."}
                  </p>
                </div>

                <div className="p-4 rounded-xl border border-gray-200 bg-white space-y-2">
                  <div className="font-bold text-dark-navy text-sm flex items-center gap-2">
                    <span className="h-6 w-6 rounded-full bg-blue-100 text-primary-blue flex items-center justify-center font-bold text-xs">3</span>
                    {isAr ? "الترجمة القانونية المعتمدة وختم المطابقة" : "Certified Translation & Certificate of Accuracy"}
                  </div>
                  <p className="text-gray-600 leading-relaxed">
                    {isAr
                      ? "يتولى مترجمونا القانونيون في جلوبالايز جروب صياغة النص باللغة الأجنبية المطلوبة مع ترجمة كافة الأختام والتوقيعات وتواريخ التصديق بدقة تامة، وإرفاق إقرار مطابقة رسمي (Certificate of Accuracy) معتمد بخاتم مكتبنا وتوقيع المترجم المسؤول وكود التحقق."
                      : "Our legal linguists at Globalize Group translate the complete text into the target language, including exact transcriptions of all marginal stamps, notary seals, and verification notations. We affix our certified office seal, authorized signature, and an official Certificate of Accuracy."}
                  </p>
                </div>

                <div className="p-4 rounded-xl border border-gray-200 bg-white space-y-2">
                  <div className="font-bold text-dark-navy text-sm flex items-center gap-2">
                    <span className="h-6 w-6 rounded-full bg-blue-100 text-primary-blue flex items-center justify-center font-bold text-xs">4</span>
                    {isAr ? "التصديق القنصلي أو التقديم المباشر" : "Consular Legalization or Direct Submission"}
                  </div>
                  <p className="text-gray-600 leading-relaxed">
                    {isAr
                      ? "تُقدم النسخة المترجمة والمرفق بها أصل المحرر إلى القسم القنصلي بسفارة الدولة المعنية في القاهرة إذا كانت الدولة تطلب التصديق القنصلي، أو تُقدم مباشرة إلى الجهات القضائية والشركات الأجنبية والبنوك التي تقبل ترجمتنا المعتمدة فوراً دون حاجة لإجراءات إضافية."
                      : "The certified translation package is submitted to the consular section of the destination embassy in Cairo when consular legalization is mandatory, or transmitted directly to foreign courts, multinational corporate headquarters, or international banking compliance departments."}
                  </p>
                </div>
              </div>
            </section>

            {/* CRITICAL CONTRACT CLAUSES & DISPUTE JURISPRUDENCE */}
            <section className="space-y-4 text-xs sm:text-sm text-gray-700">
              <div className="border-b border-gray-200 pb-3">
                <h2 className="text-xl sm:text-2xl font-bold text-dark-navy font-arabic">
                  {isAr
                    ? "دليل المصطلحات والبنود الحساسة في العقود والنزاعات القضائية"
                    : "Translating Sensitive Contractual Clauses & Dispute Provisions"}
                </h2>
                <p className="text-gray-500 text-xs sm:text-sm mt-1">
                  {isAr
                    ? "معايير الصياغة القانونية المقارنة المتبعة لدى خبرائنا لحماية حقوق أطراف التعاقد."
                    : "Comparative legal terminology standards applied by our senior editors to safeguard contractual rights."}
                </p>
              </div>

              <p className="leading-relaxed">
                {isAr
                  ? "تتطلب صياغة العقود التجارية والاتفاقيات الدولية موازنة قانونية بين مصطلحات القانون المدني المصري المستمد من القانون الفرنسي ومصطلحات القانون العام الإنجليزي والأمريكي. يحرص فريقنا في جلوبالايز جروب على التعامل مع البنود الحساسة وفق القواعد الآتية:"
                  : "Drafting cross-border commercial agreements requires harmonizing concepts from the Egyptian Civil Code with Anglo-American common law practice. Our senior legal team handles sensitive provisions according to established comparative legal benchmarks:"}
              </p>

              <div className="space-y-3">
                <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 space-y-1.5">
                  <h3 className="font-bold text-dark-navy text-xs sm:text-sm">
                    {isAr ? "1. بنود التحكيم والاختصاص القضائي (Dispute Resolution & Governing Law)" : "1. Dispute Resolution & Governing Law Clauses"}
                  </h3>
                  <p className="text-gray-600 text-xs leading-relaxed">
                    {isAr
                      ? "يتم تدقيق نصوص مشارطات التحكيم وفقاً لقانون التحكيم المصري رقم 27 لسنة 1994 وقواعد غرفة التجارة الدولية (ICC) وقواعد مركز القاهرة الإقليمي للتحكيم التجاري الدولي (CRCICA). نضمن دقة صياغة مقر التحكيم (Seat of Arbitration)، والقانون الواجب التطبيق (Governing Law)، ولغة التحكيم، وتعيين هيئة التحكيم لمنع بطلان شرط التحكيم أمام محاكم الاستئناف."
                      : "Arbitration agreements are translated strictly in accordance with Egyptian Arbitration Law No. 27 of 1994, ICC rules, and CRCICA procedures. We ensure precise distinction between the seat of arbitration, substantive governing law, procedural language, and tribunal appointment mechanisms to prevent jurisdictional challenges before appellate courts."}
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 space-y-1.5">
                  <h3 className="font-bold text-dark-navy text-xs sm:text-sm">
                    {isAr ? "2. بنود القوة القاهرة والظروف الطارئة (Force Majeure & Hardship)" : "2. Force Majeure & Material Adverse Change (MAC)"}
                  </h3>
                  <p className="text-gray-600 text-xs leading-relaxed">
                    {isAr
                      ? "يفرق القانون المدني المصري في المادتين 147 و165 بين الظروف الطارئة التي تجعل الالتزام مرهقاً فيرد إلى الحد المعقول وبين القوة القاهرة التي تجعل الالتزام مستحيلاً فينفسخ العقد. يقوم مترجمونا بمطابقة هذه المفاهيم مع بنود 'Material Adverse Change' و'Frustration of Purpose' في العقود الإنجليزية دون خلط."
                      : "The Egyptian Civil Code distinguishes in Articles 147 and 165 between unforeseen hardship that renders performance burdensome (allowing judicial adjustment) and absolute force majeure that extinguishes performance obligations. Our linguists map these civil concepts accurately against Anglo-American doctrines of frustration of purpose and material adverse change."}
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 space-y-1.5">
                  <h3 className="font-bold text-dark-navy text-xs sm:text-sm">
                    {isAr ? "3. شروط الشرط الجزائي والتعويض الاتفاقي (Liquidated Damages vs Penalties)" : "3. Liquidated Damages & Contractual Penalties"}
                  </h3>
                  <p className="text-gray-600 text-xs leading-relaxed">
                    {isAr
                      ? "تسمح النظم القانونية المدنية بالشرط الجزائي مع إعطاء القاضي سلطة تخفيضه إذا كان مبالغاً فيه وفق المادة 224 من القانون المدني، في حين ترفض المحاكم الإنجليزية والأمريكية شروط الغرامة العقابية (Penalties) وتقبل فقط التقدير المسبق المعقول للضرر (Liquidated Damages). يضمن مترجمونا صياغة دقيقة تبرز الطبيعة التعويضية للبند."
                      : "Civil jurisdictions recognize contractual penalty clauses while empowering judges to reduce disproportionate penalties under Article 224 of the Egyptian Civil Code. In contrast, common law courts enforce genuine pre-estimates of loss (liquidated damages) while striking down punitive clauses. Our translations reflect the exact legal nature of the covenant to avoid rendering it unenforceable."}
                  </p>
                </div>
              </div>
            </section>

            {/* CONFIDENTIALITY & DATA PROTECTION IN DETAIL */}
            <section className="rounded-2xl bg-gray-50 p-6 sm:p-8 border border-gray-200 space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-dark-navy text-white flex items-center justify-center shrink-0">
                  <Lock className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-dark-navy font-arabic">
                    {isAr ? "بروتوكول حماية السرية وأمن البيانات (NDA)" : "Confidentiality & Data Protection Protocol"}
                  </h2>
                  <p className="text-xs text-gray-500">
                    {isAr ? "حماية صارمة للوثائق والعقود والملفات القضائية" : "Strict compliance with Egyptian and international privacy frameworks"}
                  </p>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                {isAr
                  ? "تتعامل جلوبالايز جروب مع ملفات العملاء باعتبارها معلومات سرية بطبيعتها. نطبق ضوابط إدارية وفنية لحماية البيانات تشمل:"
                  : "Globalize Group treats client files as strictly privileged and confidential. We implement physical and digital safeguards:"}
              </p>

              <ul className="space-y-2.5 text-xs text-gray-700">
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>
                    {isAr
                      ? "توقيع اتفاقية سرية معلومات ملزمة (NDA) بناءً على طلب العميل قبل استلام أي مستندات تعاقدية أو قضائية."
                      : "Executing binding bilateral Non-Disclosure Agreements (NDAs) prior to receiving proprietary documents."}
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>
                    {isAr
                      ? "حصر الاطلاع على نصوص العقود والملفات القضائية على المترجم والمراجع المعنيين بالملف حصراً."
                      : "Restricting file access exclusively to designated legal translators and the assigned senior review editor."}
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>
                    {isAr
                      ? "نقل واستقبال الملفات عبر قنوات رقمية مشفرة، مع إمكانية حذف الملفات نهائياً من خوادمنا بمجرد إتمام التسليم."
                      : "Transmitting documents over encrypted channels, with permanent digital data wiping available upon completion."}
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>
                    {isAr
                      ? "الامتثال الكامل لأحكام قانون حماية البيانات الشخصية المصري رقم 151 لسنة 2020."
                      : "Operating in full compliance with Egyptian Data Protection Law No. 151 of 2020."}
                  </span>
                </li>
              </ul>
            </section>

            {/* PROCESS WORKFLOW: 4 STEPS */}
            <section className="space-y-6">
              <div className="border-b border-gray-200 pb-3">
                <h2 className="text-xl sm:text-2xl font-bold text-dark-navy font-arabic">
                  {isAr ? "دورة العمل في ترجمة المستندات القانونية" : "Our Step-by-Step Legal Translation Workflow"}
                </h2>
                <p className="text-gray-500 text-xs sm:text-sm mt-1">
                  {isAr ? "مراحل تنفيذ منضبطة تضمن التدقيق المتقاطع قبل ختم الاعتماد الرسمي." : "A rigorous four-stage quality assurance protocol before final certification."}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* Step 1 */}
                <div className="rounded-xl border border-gray-200 p-5 bg-white space-y-2 relative">
                  <span className="text-2xl font-black text-primary-blue/20">01</span>
                  <h3 className="font-bold text-sm text-dark-navy">
                    {isAr ? "فحص المستند وتحديد الاختصاص" : "Document Review & Legal Scoping"}
                  </h3>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    {isAr
                      ? "يتم فحص طبيعة المستند القانوني (عقد تجاري، صحيفة دعوى، توكيل، أو مستندات شركات) لتحديد المصطلحات المتخصصة والأنظمة القضائية ذات الصلة وحجم الكلمات الدقيق."
                      : "We evaluate the document type, terminology scope, and target legal system, calculating precise volume and identifying sector-specific considerations."}
                  </p>
                </div>

                {/* Step 2 */}
                <div className="rounded-xl border border-gray-200 p-5 bg-white space-y-2 relative">
                  <span className="text-2xl font-black text-primary-blue/20">02</span>
                  <h3 className="font-bold text-sm text-dark-navy">
                    {isAr ? "عرض سعر رسمي وجدول زمني للتسليم" : "Itemized Quotation & Turnaround Schedule"}
                  </h3>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    {isAr
                      ? "نقدم عرض سعر تفصيلي يوضح التكلفة الإجمالية، الموعد المحدد للتسليم، مع توقيع اتفاقية السرية (NDA) عند رغبة العميل."
                      : "We issue an itemized, binding quotation specifying total investment, guaranteed delivery schedule, and optional bilateral NDA execution."}
                  </p>
                </div>

                {/* Step 3 */}
                <div className="rounded-xl border border-gray-200 p-5 bg-white space-y-2 relative">
                  <span className="text-2xl font-black text-primary-blue/20">03</span>
                  <h3 className="font-bold text-sm text-dark-navy">
                    {isAr ? "الترجمة والتدقيق القانوني المتقاطع" : "Specialized Drafting & Legal Proofreading"}
                  </h3>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    {isAr
                      ? "يقوم مترجم قانوني متخصص بصياغة المستند، يعقبه تدقيق قانوني شامل من مراجع أول لمطابقة بنود العقود والأرقام والتواريخ والمصطلحات الإجرائية بدقة تامة."
                      : "A qualified legal translator produces the initial draft, followed by an independent senior legal editor who verifies clauses, cross-references, dates, and statutory terminology."}
                  </p>
                </div>

                {/* Step 4 */}
                <div className="rounded-xl border border-gray-200 p-5 bg-white space-y-2 relative">
                  <span className="text-2xl font-black text-primary-blue/20">04</span>
                  <h3 className="font-bold text-sm text-dark-navy">
                    {isAr ? "الاعتماد والتسليم الورقي والإلكتروني" : "Official Certification & Dual Delivery"}
                  </h3>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    {isAr
                      ? "يتم ختم الترجمة بختم الاعتماد الرسمي وتوقيع المترجم المعتمد وإرفاق إقرار المطابقة. نوفر نسخة إلكترونية فورية (PDF)، والنسخ الورقية المعتمدة من أقرب فرع أو عبر التوصيل السريع."
                      : "The final translation is stamped with our official certification seal, signed by the authorized translator, and issued with a Certificate of Accuracy in digital PDF and physical stamped formats."}
                  </p>
                </div>
              </div>
            </section>

            {/* TRANSPARENT PRICING PRINCIPLES */}
            <section className="rounded-2xl border border-primary-blue/20 bg-gradient-to-r from-blue-50/60 via-white to-blue-50/60 p-6 sm:p-7 space-y-3">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-primary-blue text-white flex items-center justify-center font-bold text-base shrink-0">
                  ⚖️
                </div>
                <div>
                  <h3 className="font-bold text-sm sm:text-base text-dark-navy">
                    {isAr ? "سياسة التسعير العادل والشفاف للترجمة القانونية" : "Transparent Legal Translation Pricing Policy"}
                  </h3>
                  <p className="text-xs text-gray-500">
                    {isAr ? "تسعير مخصص يعتمد على حجم المستند دون أي رسوم إضافية خفية" : "Honest custom quotes based on actual volume and technical complexity"}
                  </p>
                </div>
              </div>
              <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
                {isAr
                  ? "تختلف العقود والمستندات القانونية في درجة تعقيدها وطول موادها؛ فترجمة عقد تأسيس شركة يختلف عن ترجمة صحيفة دعوى استئنافية أو مذكرة تحكيم دولي. لذلك نقدم لكل عميل عرض سعر مخصص وواضح فور معاينة المستند يحدد التكلفة الدقيقة وموعد الاستلام النهائي. كما نوفر ترتيبات تسعير تفضيلية لمكاتب المحاماة والشركات التي تمتلك تدفقاً دورياً من العقود والاستشارات."
                  : "Legal instruments range widely in scope, length, and procedural complexity—from straightforward articles of association to extensive arbitration pleadings spanning hundreds of exhibits. Rather than arbitrary pricing, we provide transparent quotations directly after examining the documents via WhatsApp or email. Corporate clients and active law practices benefit from preferential retainer rates."}
              </p>
              <div className="pt-2 flex flex-wrap items-center gap-3">
                <TrackedWhatsAppLink
                  href={`https://wa.me/201062990808?text=${encodeURIComponent(
                    isAr
                      ? "أود إرسال مستند قانوني لمعاينة حجمه والحصول على عرض سعر وموعد تسليم."
                      : "I would like to send a legal record to receive an exact quotation and delivery timeline."
                  )}`}
                  ctaLocation="legal_translation_bottom_pricing"
                  service="legal-translation"
                  language={locale}
                  className="inline-flex items-center gap-2 rounded-lg bg-whatsapp-green hover:bg-emerald-600 text-white px-4 py-2.5 text-xs font-bold shadow-xs transition-colors cursor-pointer"
                >
                  <MessageCircle className="h-3.5 w-3.5" />
                  <span>{isAr ? "إرسال ملف للمعادلة والتسعير" : "Submit Document for Pricing"}</span>
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
                  {isAr ? "الأسئلة الشائعة حول الترجمة القانونية المعتمدة" : "Frequently Asked Questions on Legal Translation"}
                </h2>
                <p className="text-gray-500 text-xs sm:text-sm mt-1">
                  {isAr
                    ? "إجابات واضحة عن معايير الاعتماد الرسمي، حفظ السرية، والمدة الزمنية."
                    : "Direct answers addressing court accreditation, confidentiality, and turnaround."}
                </p>
              </div>

              <div className="space-y-3">
                {legalFaqs.map((faq) => (
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
                  href="/services/medical-translation"
                  className="p-3 rounded-lg border border-gray-100 hover:border-primary-blue hover:bg-blue-50/30 transition-colors block"
                >
                  <div className="font-bold text-dark-navy mb-1">{isAr ? "الترجمة الطبية المعتمدة" : "Certified Medical Translation"}</div>
                  <div className="text-gray-500 text-[11px]">{isAr ? "التقارير الطبية والتحاليل وفحوصات الأشعة" : "Diagnostic summaries & medical travel"}</div>
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
                    <span className="text-primary-blue font-bold">📍</span>
                    <div>
                      <strong className="text-dark-navy">{isAr ? "المقر الرئيسي (الجيزة):" : "Giza HQ:"}</strong>{" "}
                      {isAr ? "1 شارع جامعة القاهرة، أعلى عمر أفندي." : "1 Cairo University St., above Omar Effendi."}
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-primary-blue font-bold">📍</span>
                    <div>
                      <strong className="text-dark-navy">{isAr ? "فرع الدقي:" : "Dokki Branch:"}</strong>{" "}
                      {isAr ? "2 ب شارع عكاشة، بجوار الشهر العقاري." : "2B Okasha St., next to Real Estate Registry."}
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-primary-blue font-bold">📍</span>
                    <div>
                      <strong className="text-dark-navy">{isAr ? "فرع الهرم:" : "Haram Branch:"}</strong>{" "}
                      {isAr ? "6 شارع أيوب، متفرع من شارع الهرم." : "6 Ayoub St., off Haram St., near Cairo Mall."}
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-primary-blue font-bold">📍</span>
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
