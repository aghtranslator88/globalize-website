import { setRequestLocale } from "next-intl/server";
import { getServiceBySlug, getFAQs } from "@/lib/data";
import { getSEOHeaders, generateServiceJsonLd, generateFAQJsonLd } from "@/lib/seo";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import QuoteForm from "@/components/QuoteForm";
import { Link } from "@/i18n/routing";
import { Globe, Code, FileCode, CheckCircle, Smartphone } from "lucide-react";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const service = await getServiceBySlug("localization", locale);
  if (!service) return {};
  return getSEOHeaders(service.name, service.description, "/localization", service.indexable, locale);
}

export default async function LocalizationPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const service = await getServiceBySlug("localization", locale);
  if (!service) return null;

  const faqs = await getFAQs("service", service.id, locale);
  const isAr = locale === "ar";

  const breadcrumbs = [
    { name: isAr ? "الرئيسية" : "Home", url: "/" },
    { name: service.name, url: "/localization" },
  ];

  const serviceJsonLd = generateServiceJsonLd({
    name: service.name,
    description: service.description,
    url: `/${locale}/localization`,
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }}
      />
      {faqs.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(generateFAQJsonLd(faqs)) }}
        />
      )}
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <nav className="text-xs text-gray-500 mb-6" aria-label="Breadcrumb">
          <ol className="flex items-center gap-1.5">
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-12">
            <div>
              <h1 className="text-2xl sm:text-4xl font-black text-dark-navy mb-4 font-arabic">
                {service.name}
              </h1>
              <p className="text-gray-600 text-sm leading-relaxed">
                {service.description}
              </p>
            </div>

            {/* Definition answer box */}
            <div className="answer-box p-6 sm:p-8">
              <h3 className="font-bold text-xs text-primary-blue uppercase tracking-wide mb-2">
                {isAr ? "لماذا التوطين اللغوي؟" : "Why Localization?"}
              </h3>
              <p className="text-sm font-semibold text-dark-navy leading-relaxed font-arabic">
                {service.definition}
              </p>
            </div>

            {/* Corporate Localization services */}
            <div>
              <h2 className="text-xl font-bold text-dark-navy mb-6 border-b border-gray-100 pb-3 font-arabic">
                {isAr ? "خدمات التوطين الرقمية للمؤسسات" : "Digital Localization Services for Enterprises"}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="rounded-xl border border-gray-100 p-6 bg-white shadow-sm">
                  <Globe className="h-7 w-7 text-primary-blue mb-4" />
                  <h3 className="font-bold text-sm text-dark-navy mb-2">{isAr ? "توطين المواقع الإلكترونية" : "Website Localization"}</h3>
                  <p className="text-xs text-gray-500 leading-relaxed">{isAr ? "تطويع كامل لمحتوى المواقع والمتاجر الإلكترونية للغة العربية الفصحى ولهجات الخليج مع مراعاة اتجاهات الكتابة RTL والتصميم البصري." : "Adapting site layouts and marketing copy to Arabic RTL formats, targeting regional Gulf accents or standard Arabic dialects."}</p>
                </div>

                <div className="rounded-xl border border-gray-100 p-6 bg-white shadow-sm">
                  <Smartphone className="h-7 w-7 text-primary-blue mb-4" />
                  <h3 className="font-bold text-sm text-dark-navy mb-2">{isAr ? "توطين تطبيقات الموبايل" : "Mobile App Localization"}</h3>
                  <p className="text-xs text-gray-500 leading-relaxed">{isAr ? "ترجمة واجهات تطبيقات iOS و Android وتكييفها لضمان تجربة مستخدم سلسة وخالية من الأخطاء البرمجية." : "Translating iOS and Android application UI strings and layouts to offer a native and bug-free local experience."}</p>
                </div>

                <div className="rounded-xl border border-gray-100 p-6 bg-white shadow-sm">
                  <Code className="h-7 w-7 text-primary-blue mb-4" />
                  <h3 className="font-bold text-sm text-dark-navy mb-2">{isAr ? "توطين البرمجيات والأنظمة" : "Software Localization"}</h3>
                  <p className="text-xs text-gray-500 leading-relaxed">{isAr ? "تهيئة وتوطين أنظمة إدارة الشركات (ERP) وأنظمة الفوترة لتتوافق مع اللوائح والضرائب المحلية في مصر والخليج." : "Preparing and adapting Enterprise ERP platforms and invoices to comply with tax and currency rules in Egypt and GCC."}</p>
                </div>

                <div className="rounded-xl border border-gray-100 p-6 bg-white shadow-sm">
                  <FileCode className="h-7 w-7 text-primary-blue mb-4" />
                  <h3 className="font-bold text-sm text-dark-navy mb-2">{isAr ? "ترجمة وثائق البرمجة والتعليمات" : "Tech Docs & API Guides"}</h3>
                  <p className="text-xs text-gray-500 leading-relaxed">{isAr ? "ترجمة كتيبات الاستخدام، ووثائق المطورين (APIs) بدقة علمية لضمان فهمها الكامل من قبل الفرق الفنية." : "Translating technical user manuals, coding specs, and developer APIs with absolute scientific accuracy."}</p>
                </div>
              </div>
            </div>

            {/* Corporate Process / Why Us */}
            <div>
              <h2 className="text-xl font-bold text-dark-navy mb-6 border-b border-gray-100 pb-3 font-arabic">
                {isAr ? "مراحل وضوابط جودة التوطين لدينا" : "Our Localization Quality Standards"}
              </h2>
              <div className="space-y-4 text-xs text-gray-600">
                <div className="flex gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                  <p><strong>{isAr ? "التحليل الفني للملفات" : "Technical File Analysis"}</strong>: {isAr ? "مراجعة الكود البرمجي واستخراج سلاسل النصوص (Strings) بدقة دون المساس ببنية التطبيق أو الموقع." : "Reviewing code structures and extracting text resource keys accurately without breaking development patterns."}</p>
                </div>
                <div className="flex gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                  <p><strong>{isAr ? "الترجمة والتكييف الثقافي" : "Linguistic Adaptation"}</strong>: {isAr ? "صياغة المحتوى بلهجة تسويقية طبيعية ومفهومة محلياً وتفادي الترجمات الحرفية المشوهة." : "Drafting content with a natural marketing tone tailored locally, avoiding mechanical translations."}</p>
                </div>
                <div className="flex gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                  <p><strong>{isAr ? "اختبار جودة الواجهات (UI Testing)" : "UI Testing & QA"}</strong>: {isAr ? "مراجعة الموقع أو التطبيق بعد دمج النصوص للتأكد من عدم وجود تداخل في الكلمات أو مشاكل في الاتجاهات." : "Testing layouts after text integration to check readability, font scaling, and RTL visual flows."}</p>
                </div>
              </div>
            </div>
          </div>

          {/* RFQ Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-28">
              {/* Specialized corporate quote options */}
              <QuoteForm services={[{ slug: "localization", name: isAr ? "توطين مواقع وتطبيقات" : "Localization" }]} />
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
