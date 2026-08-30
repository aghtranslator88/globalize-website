import { setRequestLocale } from "next-intl/server";
import { getDocuments } from "@/lib/data";
import { getSEOHeaders, generateBreadcrumbJsonLd } from "@/lib/seo";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Link } from "@/i18n/routing";
import { FileText, Clock, Phone, ArrowLeft, ArrowRight, MessageCircle } from "lucide-react";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const title = locale === "ar" ? "أسعار ترجمة المستندات والشهادات الرسمية" : "Official Document Translation Prices";
  const description = locale === "ar"
    ? "قائمة شاملة بأسعار ترجمة الأوراق والوثائق الرسمية (شهادة ميلاد، زواج، فيش، تخرج، قيد عائلي) والمدد الزمنية للتسليم."
    : "Comprehensive list of prices and turnaround times for certified document translation (birth, marriage, graduation certificates).";
  return getSEOHeaders(title, description, "/documents", true, locale);
}

export default async function DocumentsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const documents = await getDocuments(locale);
  const isAr = locale === "ar";

  const breadcrumbs = [
    { name: isAr ? "الرئيسية" : "Home", url: "/" },
    { name: isAr ? "الوثائق والأسعار" : "Documents & Pricing", url: "/documents" },
  ];

  const breadcrumbJsonLd = generateBreadcrumbJsonLd(breadcrumbs);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
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

        <div className="text-center mb-8">
          <h1 className="text-2xl sm:text-4xl font-black text-dark-navy mb-4 font-arabic">
            {isAr ? "أسعار ترجمة المستندات والشهادات الرسمية" : "Certified Document Translation Prices"}
          </h1>
          <p className="text-gray-500 text-xs sm:text-sm max-w-2xl mx-auto leading-relaxed">
            {isAr
              ? "أسعار واضحة ومعلنة لكافة الأوراق الرسمية الصادرة عن مصلحة الأحوال المدنية والسجل المدني والجامعات المصرية لتقديمها معتمدة للسفارات."
              : "Clear and transparent rates for all official certificates issued by the Civil Registry and universities for embassy submission."}
          </p>
        </div>

        {/* Pricing Policy Banner */}
        <div className="mb-10 rounded-2xl bg-gradient-to-r from-blue-50 via-white to-blue-50 border border-primary-blue/20 p-5 shadow-xs">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="h-10 w-10 shrink-0 rounded-xl bg-primary-blue text-white flex items-center justify-center font-bold text-sm">
                🏷️
              </div>
              <div>
                <h2 className="text-sm font-bold text-dark-navy mb-1">
                  {isAr ? "قائمة الأسعار المعتمدة للترجمة الرسمية" : "Official Certified Translation Rate Guide"}
                </h2>
                <p className="text-xs text-gray-600 leading-relaxed">
                  {isAr ? (
                    <>
                      سعر ترجمة الصفحة الواحدة هو <strong className="text-primary-blue font-black">200 جنيه مصري</strong> للترجمة بين (العربية ↔ الإنجليزية)، و <strong className="text-emerald-700 font-black">300 جنيه مصري</strong> للصفحة لأي لغة أجنبية أخرى (ألماني، فرنسي، إيطالي، إسباني، روسي، وغيرها). وفي حال كانت الوثيقة مكونة من أكثر من صفحة يُحسب الإجمالي وفقاً لعدد الصفحات مع تسليم معتمد خلال 24 ساعة.
                    </>
                  ) : (
                    <>
                      The certified translation rate is <strong className="text-primary-blue font-black">200 EGP / page</strong> for (Arabic ↔ English) and <strong className="text-emerald-700 font-black">300 EGP / page</strong> for all other foreign languages (German, French, Italian, Spanish, Russian, etc.). For multi-page documents, the total is calculated per page with a 24-hour certified turnaround.
                    </>
                  )}
                </p>
              </div>
            </div>
            <div className="shrink-0 flex items-center gap-2">
              <span className="inline-flex items-center px-3 py-1.5 rounded-full text-[11px] font-bold bg-primary-blue/10 text-primary-blue border border-primary-blue/20">
                {isAr ? "عربي ↔ إنجليزي: 200 ج.م / صفحة" : "AR ↔ EN: 200 EGP / page"}
              </span>
              <span className="inline-flex items-center px-3 py-1.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                {isAr ? "باقي اللغات: 300 ج.م / صفحة" : "Other Langs: 300 EGP / page"}
              </span>
            </div>
          </div>
        </div>

        {/* Documents Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {documents.map((doc) => (
            <div
              key={doc.slug}
              className="rounded-2xl border border-gray-150 p-6 bg-white hover-lift flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="h-10 w-10 rounded-xl bg-primary-blue/10 text-primary-blue flex items-center justify-center">
                    <FileText className="h-5 w-5" />
                  </div>
                  <span className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-gray-100 text-gray-600">
                    {isAr ? "سعر الصفحة" : "Per Page"}
                  </span>
                </div>
                <h3 className="font-bold text-sm text-dark-navy mb-2 line-clamp-1">
                  {doc.name}
                </h3>
                <p className="text-[11px] text-gray-500 leading-relaxed mb-4 line-clamp-2">
                  {doc.description}
                </p>
              </div>

              <div className="border-t border-gray-100 pt-4 mt-auto">
                <div className="space-y-1.5 mb-4">
                  <div className="flex items-baseline justify-between">
                    <span className="text-[11px] text-gray-500 font-semibold">{isAr ? "عربي ↔ إنجليزي:" : "AR ↔ EN:"}</span>
                    <span className="text-base font-black text-primary-blue">
                      200 <span className="text-[10px] font-normal">{isAr ? "ج.م / صفحة" : "EGP / page"}</span>
                    </span>
                  </div>
                  <div className="flex items-baseline justify-between text-[11px] text-emerald-700 font-medium">
                    <span>{isAr ? "اللغات الأخرى:" : "Other languages:"}</span>
                    <span className="font-bold">300 <span className="text-[9px] font-normal">{isAr ? "ج.م / صفحة" : "EGP / page"}</span></span>
                  </div>
                </div>

                <div className="flex items-center gap-1 text-[10px] text-gray-400 font-semibold mb-4">
                  <Clock className="h-3.5 w-3.5" />
                  <span>{doc.deliveryHours} {isAr ? "ساعة للتسليم" : "hours delivery"}</span>
                </div>

                <div className="flex flex-col gap-2">
                  <Link
                    href={`/documents/${doc.slug}`}
                    className="flex w-full items-center justify-center gap-1 rounded-xl bg-gray-50 hover:bg-gray-100 py-2.5 text-[10px] font-bold text-dark-navy transition-all"
                  >
                    <span>{isAr ? "التفاصيل والمتطلبات" : "Details & Requirements"}</span>
                    {isAr ? <ArrowLeft className="h-3 w-3" /> : <ArrowRight className="h-3 w-3" />}
                  </Link>

                  <a
                    href={`https://wa.me/201062990808?text=${encodeURIComponent(
                      isAr 
                        ? `أريد ترجمة وثيقة: ${doc.name} (سعر الصفحة 200 ج.م عربي-إنجليزي أو 300 ج.م للغات الأخرى)`
                        : `I want to translate document: ${doc.name} (200 EGP/page AR-EN or 300 EGP/page other languages)`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex w-full items-center justify-center gap-1.5 rounded-xl bg-whatsapp-green hover:bg-emerald-600 text-white py-2.5 text-[10px] font-bold shadow-sm animate-pulse-glow"
                  >
                    <MessageCircle className="h-3 w-3" />
                    <span>{isAr ? "اطلب بالواتساب" : "Order WhatsApp"}</span>
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </>
  );
}
