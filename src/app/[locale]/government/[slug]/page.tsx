import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { getGovEntityBySlug, getFAQs } from "@/lib/data";
import { getSEOHeaders, generateFAQJsonLd, generateBreadcrumbJsonLd } from "@/lib/seo";
import { isGenuineEnglish } from "@/lib/translationDetection";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import QuoteForm from "@/components/QuoteForm";
import { Link } from "@/i18n/routing";
import { Phone, CheckCircle, ChevronDown, Landmark, FileText, MessageCircle } from "lucide-react";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const gov = await getGovEntityBySlug(slug, locale);
  if (!gov) return {};
  const hasEnglishTranslation = isGenuineEnglish(gov.name, gov.requirements?.join(" "));
  return getSEOHeaders(gov.name, `${gov.name} requirements and certified translation details.`, `/government/${slug}`, gov.indexable, locale, hasEnglishTranslation);
}

export default async function GovEntityDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const gov = await getGovEntityBySlug(slug, locale);
  if (!gov) {
    notFound();
  }

  const faqs = await getFAQs("govEntity", gov.id, locale);
  const isAr = locale === "ar";

  const breadcrumbs = [
    { name: isAr ? "الرئيسية" : "Home", url: "/" },
    { name: isAr ? "الهيئات الحكومية" : "Gov Entities", url: "/government" },
    { name: gov.name, url: `/government/${slug}` },
  ];

  const breadcrumbJsonLd = generateBreadcrumbJsonLd(breadcrumbs);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      {faqs.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(generateFAQJsonLd(faqs)) }}
        />
      )}
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        {/* Quality control robots tag if non-indexable */}
        {!gov.indexable && <meta name="robots" content="noindex, nofollow" />}

        {/* Breadcrumbs */}
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

        {/* Header section */}
        <div className="flex flex-col md:flex-row items-center gap-6 mb-10 border-b border-gray-100 pb-8">
          <div className="h-16 w-16 rounded-xl bg-primary-blue/10 text-primary-blue flex items-center justify-center flex-shrink-0 shadow-sm border border-primary-blue/20">
            <Landmark className="h-8 w-8" />
          </div>
          <div className="text-center md:text-right">
            <h1 className="text-2xl sm:text-4xl font-black text-dark-navy mb-2 font-arabic">
              {gov.name}
            </h1>
            <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">
              {isAr ? "متطلبات التوثيق والترجمة المعتمدة" : "Legalization & Certified Translation Requirements"}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main content body */}
          <div className="lg:col-span-2 space-y-12">
            {/* Requirements Checklist */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-100 shadow-sm">
              <h2 className="text-lg font-bold text-dark-navy mb-6 flex items-center gap-2 border-b border-gray-100 pb-3 font-arabic">
                <CheckCircle className="h-5 w-5 text-primary-blue" />
                <span>{isAr ? "شروط وإجراءات التوثيق بالجهة" : "Legalization & Filing Rules"}</span>
              </h2>
              {gov.requirements && gov.requirements.length > 0 ? (
                <ul className="space-y-4">
                  {gov.requirements.map((req, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-xs text-gray-600 leading-relaxed">
                      <span className="h-5 w-5 rounded-full bg-green-50 text-green-600 flex items-center justify-center flex-shrink-0 text-[10px] font-bold mt-0.5">
                        {idx + 1}
                      </span>
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs text-gray-400 italic">
                  {isAr ? "لم يتم تحديد اشتراطات خاصة بعد، يرجى التواصل معنا للاستفسار." : "No specific rules specified, please contact us for details."}
                </p>
              )}
            </div>

            {/* Accepted Documents Table */}
            {gov.acceptedDocuments && gov.acceptedDocuments.length > 0 && (
              <div>
                <h2 className="text-lg font-bold text-dark-navy mb-6 border-b border-gray-100 pb-3 flex items-center gap-2 font-arabic">
                  <FileText className="h-5 w-5 text-primary-blue" />
                  <span>{isAr ? "الوثائق المقبولة وأسعارها لدينا" : "Accepted Documents & Prices"}</span>
                </h2>
                <div className="overflow-x-auto rounded-xl border border-gray-150 shadow-sm bg-white">
                  <table className="min-w-full divide-y divide-gray-200 text-right">
                    <thead className="bg-gray-50 text-dark-navy text-xs font-bold">
                      <tr>
                        <th className="px-6 py-4">{isAr ? "اسم الوثيقة" : "Document Name"}</th>
                        <th className="px-6 py-4">{isAr ? "سعر الصفحة" : "Price (Per Page)"}</th>
                        <th className="px-6 py-4">{isAr ? "مدة التسليم" : "Turnaround"}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-150 text-xs text-gray-700">
                      {gov.acceptedDocuments.map((doc) => (
                        <tr key={doc.slug} className="hover:bg-gray-50/50 transition-colors">
                          <td className="px-6 py-4 font-bold text-dark-navy">
                            <Link href={`/documents/${doc.slug}`} className="hover:text-primary-blue transition-colors">
                              {doc.name}
                            </Link>
                          </td>
                          <td className="px-6 py-4 font-semibold text-primary-blue">
                            {doc.priceEGP} {isAr ? "ج.م / صفحة" : "EGP / page"}
                          </td>
                          <td className="px-6 py-4 text-gray-500">
                            {doc.deliveryHours} {isAr ? "ساعة" : "hours"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Use cases */}
            {gov.useCases && gov.useCases.length > 0 && (
              <div>
                <h2 className="text-lg font-bold text-dark-navy mb-6 border-b border-gray-100 pb-3 flex items-center gap-2 font-arabic">
                  <Landmark className="h-5 w-5 text-primary-blue" />
                  <span>{isAr ? "أشهر المعاملات التي تطلبها" : "Common Transactions"}</span>
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {gov.useCases.map((useCase, idx) => (
                    <div key={idx} className="rounded-xl border border-gray-100 p-5 bg-white shadow-sm flex items-start gap-3">
                      <span className="h-5 w-5 rounded-lg bg-primary-blue/10 text-primary-blue flex items-center justify-center flex-shrink-0 text-xs font-bold mt-0.5">
                        {idx + 1}
                      </span>
                      <p className="text-xs font-semibold text-gray-700">{useCase}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* FAQs */}
            {faqs.length > 0 && (
              <div>
                <h2 className="text-lg font-bold text-dark-navy mb-6 border-b border-gray-100 pb-3 font-arabic">
                  {isAr ? "الأسئلة الشائعة" : "FAQ"}
                </h2>
                <div className="space-y-4">
                  {faqs.map((faq) => (
                    <div key={faq.id} className="border border-gray-100 rounded-xl overflow-hidden shadow-sm">
                      <details className="group">
                        <summary className="flex items-center justify-between px-6 py-4 font-bold text-sm text-dark-navy cursor-pointer select-none bg-gray-50/50 list-none">
                          <span>{faq.question}</span>
                          <ChevronDown className="h-4 w-4 text-gray-500 transition-transform group-open:rotate-180" />
                        </summary>
                        <div className="px-6 py-4 text-xs text-gray-600 leading-relaxed border-t border-gray-100">
                          {faq.answer}
                        </div>
                      </details>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-28">
              <QuoteForm services={[{ slug: "certified", name: isAr ? "ترجمة معتمدة" : "Certified Translation" }]} />
              
              <div className="mt-6 rounded-2xl bg-whatsapp-green/5 border border-whatsapp-green/20 p-6 text-center">
                <h4 className="font-bold text-xs text-whatsapp-green mb-2">{isAr ? "هل تريد التوثيق والترجمة فوراً؟" : "Need Quick Assistance?"}</h4>
                <p className="text-[11px] text-gray-500 leading-relaxed mb-4">
                  {isAr 
                    ? "راسلنا بالملفات الأصلية للحصول على إرشادات توثيق الخارجية وترجمتها وتوصيلها معتمدة."
                    : "Send us the originals to guide you through MOFA steps, translate them, and deliver certified."}
                </p>
                <a
                  href={`https://wa.me/201062990808?text=${encodeURIComponent(
                    isAr 
                      ? `أريد الاستفسار عن توثيقات: ${gov.name}`
                      : `I want to inquire about: ${gov.name} legalizations`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 rounded-xl bg-whatsapp-green hover:bg-emerald-600 text-white py-3 text-xs font-bold shadow-md transition-all animate-pulse-glow"
                >
                  <MessageCircle className="h-4 w-4" />
                  <span>{isAr ? "تواصل معنا بالواتساب" : "WhatsApp Specialist"}</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
