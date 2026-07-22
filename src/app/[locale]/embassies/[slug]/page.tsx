import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { getEmbassyBySlug, getFAQs } from "@/lib/data";
import { getSEOHeaders, generateFAQJsonLd, generateBreadcrumbJsonLd } from "@/lib/seo";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import QuoteForm from "@/components/QuoteForm";
import { Link } from "@/i18n/routing";
import { Phone, CheckCircle, ChevronDown, Flag, FileText, Landmark, MessageCircle } from "lucide-react";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const embassy = await getEmbassyBySlug(slug, locale);
  if (!embassy) return {};
  return getSEOHeaders(embassy.name, `${embassy.name} requirements and certified translation details.`, `/embassies/${slug}`, embassy.indexable, locale);
}

export default async function EmbassyDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const embassy = await getEmbassyBySlug(slug, locale);
  if (!embassy) {
    notFound();
  }

  const faqs = await getFAQs("embassy", embassy.id, locale);
  const isAr = locale === "ar";

  const breadcrumbs = [
    { name: isAr ? "الرئيسية" : "Home", url: "/" },
    { name: isAr ? "السفارات" : "Embassies", url: "/embassies" },
    { name: embassy.name, url: `/embassies/${slug}` },
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
        {!embassy.indexable && <meta name="robots" content="noindex, nofollow" />}

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

        {/* Page Title & Flags */}
        <div className="flex flex-col md:flex-row items-center gap-6 mb-10 border-b border-gray-100 pb-8">
          <div className="h-16 w-16 rounded-full overflow-hidden border border-gray-150 shadow-sm bg-gray-50 flex items-center justify-center">
            <img
              src={`https://flagcdn.com/w80/${embassy.countryCode.toLowerCase()}.png`}
              alt={embassy.name}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="text-center md:text-right">
            <h1 className="text-2xl sm:text-4xl font-black text-dark-navy mb-2 font-arabic">
              {embassy.name}
            </h1>
            <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">
              {isAr ? "خدمات الترجمة والاعتماد الرسمية" : "Official Translation & Certification Guidelines"}
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
                <span>{isAr ? "متطلبات واشتراطات السفارة" : "Embassy Requirements"}</span>
              </h2>
              {embassy.requirements && embassy.requirements.length > 0 ? (
                <ul className="space-y-4">
                  {embassy.requirements.map((req, idx) => (
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
                  {isAr ? "لم يتم تحديد متطلبات خاصة بعد، يرجى التواصل معنا للاستفسار." : "No specific requirements specified, please contact us for details."}
                </p>
              )}
            </div>

            {/* Popular Documents Price Table */}
            {embassy.popularDocuments && embassy.popularDocuments.length > 0 && (
              <div>
                <h2 className="text-lg font-bold text-dark-navy mb-6 border-b border-gray-100 pb-3 flex items-center gap-2 font-arabic">
                  <FileText className="h-5 w-5 text-primary-blue" />
                  <span>{isAr ? "الوثائق الأكثر طلباً وأسعارها" : "Popular Documents & Prices"}</span>
                </h2>
                <div className="overflow-x-auto rounded-xl border border-gray-150 shadow-sm bg-white">
                  <table className="min-w-full divide-y divide-gray-200 text-right">
                    <thead className="bg-gray-50 text-dark-navy text-xs font-bold">
                      <tr>
                        <th className="px-6 py-4">{isAr ? "اسم الوثيقة" : "Document Name"}</th>
                        <th className="px-6 py-4">{isAr ? "سعر الترجمة والاعتماد" : "Certified Translation Price"}</th>
                        <th className="px-6 py-4">{isAr ? "مدة التسليم" : "Turnaround"}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-150 text-xs text-gray-700">
                      {embassy.popularDocuments.map((doc) => (
                        <tr key={doc.slug} className="hover:bg-gray-50/50 transition-colors">
                          <td className="px-6 py-4 font-bold text-dark-navy">
                            <Link href={`/documents/${doc.slug}`} className="hover:text-primary-blue transition-colors">
                              {doc.name}
                            </Link>
                          </td>
                          <td className="px-6 py-4 font-semibold text-primary-blue">
                            {doc.priceEGP} {isAr ? "ج.م" : "EGP"}
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

            {/* Use Cases Cards */}
            {embassy.useCases && embassy.useCases.length > 0 && (
              <div>
                <h2 className="text-lg font-bold text-dark-navy mb-6 border-b border-gray-100 pb-3 flex items-center gap-2 font-arabic">
                  <Landmark className="h-5 w-5 text-primary-blue" />
                  <span>{isAr ? "حالات الاستخدام الشائعة" : "Common Use Cases"}</span>
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {embassy.useCases.map((useCase, idx) => (
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

            {/* FAQs Section */}
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
              
              {/* WhatsApp Quick Link */}
              <div className="mt-6 rounded-2xl bg-whatsapp-green/5 border border-whatsapp-green/20 p-6 text-center">
                <h4 className="font-bold text-xs text-whatsapp-green mb-2">{isAr ? "هل لديك استفسار عاجل؟" : "Have an urgent question?"}</h4>
                <p className="text-[11px] text-gray-500 leading-relaxed mb-4">
                  {isAr 
                    ? "تواصل مباشرة مع أحد أخصائيي الترجمة مع السفارة عبر الواتساب للإجابة الفورية."
                    : "Connect directly with an embassy translation specialist on WhatsApp for immediate answers."}
                </p>
                <a
                  href={`https://wa.me/201555592535?text=${encodeURIComponent(
                    isAr 
                      ? `أريد الاستفسار عن متطلبات: ${embassy.name}`
                      : `I want to inquire about requirements for: ${embassy.name}`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 rounded-xl bg-whatsapp-green hover:bg-emerald-600 text-white py-3 text-xs font-bold shadow-md transition-all animate-pulse-glow"
                >
                  <MessageCircle className="h-4 w-4" />
                  <span>{isAr ? "اسأل خبير واتساب" : "Ask Specialist"}</span>
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
