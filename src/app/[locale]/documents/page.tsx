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

        <div className="text-center mb-12">
          <h1 className="text-2xl sm:text-4xl font-black text-dark-navy mb-4 font-arabic">
            {isAr ? "أسعار ترجمة المستندات والشهادات الرسمية" : "Certified Document Translation Prices"}
          </h1>
          <p className="text-gray-500 text-xs sm:text-sm max-w-2xl mx-auto leading-relaxed">
            {isAr
              ? "أسعار واضحة ومعلنة لكافة الأوراق الرسمية الصادرة عن مصلحة الأحوال المدنية والسجل المدني والجامعات المصرية لتقديمها معتمدة للسفارات."
              : "Clear and transparent rates for all official certificates issued by the Civil Registry and universities for embassy submission."}
          </p>
        </div>

        {/* Documents Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {documents.map((doc) => (
            <div
              key={doc.slug}
              className="rounded-2xl border border-gray-150 p-6 bg-white hover-lift flex flex-col justify-between"
            >
              <div>
                <div className="h-10 w-10 rounded-xl bg-primary-blue/10 text-primary-blue flex items-center justify-center mb-4">
                  <FileText className="h-5 w-5" />
                </div>
                <h3 className="font-bold text-sm text-dark-navy mb-2 line-clamp-1">
                  {doc.name}
                </h3>
                <p className="text-[11px] text-gray-500 leading-relaxed mb-4 line-clamp-2">
                  {doc.description}
                </p>
              </div>

              <div className="border-t border-gray-100 pt-4 mt-auto">
                <div className="flex items-baseline justify-between mb-4">
                  <span className="text-xs text-gray-400 font-semibold">{isAr ? "السعر:" : "Price:"}</span>
                  <span className="text-lg font-black text-primary-blue">
                    {doc.priceEGP} <span className="text-[10px] font-normal">{isAr ? "ج.م" : "EGP"}</span>
                  </span>
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
                        ? `أريد ترجمة وثيقة: ${doc.name}`
                        : `I want to translate document: ${doc.name}`
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
