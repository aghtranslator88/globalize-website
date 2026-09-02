import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { getEmbassyBySlug, getFAQs } from "@/lib/data";
import { getSEOHeaders, generateFAQJsonLd, generateBreadcrumbJsonLd } from "@/lib/seo";
import { isGenuineEnglish } from "@/lib/translationDetection";
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
  const hasEnglishTranslation = isGenuineEnglish(embassy.name, embassy.requirements?.join(" "));
  return getSEOHeaders(embassy.name, `${embassy.name} requirements and certified translation details.`, `/embassies/${slug}`, embassy.indexable, locale, hasEnglishTranslation);
}

function getEmbassyGuide(slug: string, countryCode: string | undefined, isAr: boolean) {
  const cc = countryCode?.toUpperCase() || "";
  if (cc === "US" || slug.includes("us-embassy") || slug.includes("american")) {
    return {
      title: isAr ? "ترجمة معتمدة للسفارة الأمريكية بالقاهرة: كيف تجهز مستنداتك بدون تأخير؟" : "Certified Translation for U.S. Embassy Cairo: Complete Document Prep Guide",
      desc: isAr ? "تفاصيل ترجمة شهادات الميلاد، عقود الزواج، صحيفة الحالة الجنائية، ورفع الملفات على CEAC." : "Check complete instructions on civil documents, marriage/birth certificates, and CEAC uploads.",
      url: "/blog/certified-translation-us-embassy-cairo"
    };
  }
  if (cc === "IT" || slug.includes("italian") || slug.includes("italy")) {
    return {
      title: isAr ? "كيفية التقديم على تأشيرة إيطاليا من مصر عبر ألمافيفا: الخطوات والمستندات" : "How to Apply for Italy Visa from Egypt via Almaviva: Requirements & Translation",
      desc: isAr ? "قائمة المستندات الإلزامية، متطلبات الترجمة الإيطالية المحلفة، وتصديق وزارة الخارجية." : "Mandatory document checklist, Italian sworn translation criteria, and MOFA legalizations.",
      url: "/blog/italy-visa-egypt-almaviva"
    };
  }
  if (["DE", "FR", "ES", "GB", "NL", "AT", "GR", "CH", "SE", "NO"].includes(cc) || slug.includes("schengen") || slug.includes("german") || slug.includes("french") || slug.includes("spanish") || slug.includes("british")) {
    return {
      title: isAr ? "معايير وشروط الترجمة المعتمدة للسفارة الأمريكية ودول الشنغن" : "Certified Translation Standards for US & Schengen Embassies",
      desc: isAr ? "متطلبات الترجمة المعتمدة للفيزا الأوروبية، شروط TLScontact وVFS Global وBLS، وتفادي الرفض." : "Accreditation guidelines for European visas, visa center compliance, and common translation pitfalls.",
      url: "/blog/us-schengen-embassies-certified-translation-guide"
    };
  }
  if (["SA", "AE", "KW", "QA", "OM", "BH"].includes(cc) || slug.includes("saudi") || slug.includes("uae") || slug.includes("gulf") || slug.includes("kuwait") || slug.includes("qatar")) {
    return {
      title: isAr ? "دليل تصديق وزارة الخارجية وترجمة مستندات الإقامة والاستثمار للخليج" : "MOFA Legalization & Translation Guide for GCC Visas & Residency",
      desc: isAr ? "متطلبات توثيق الشهادات وعقود العمل والوكالات التجارية لسفارات السعودية والإمارات والخليج." : "Attestation and certified translation requirements for Saudi, UAE, and GCC work visas.",
      url: "/blog/foreign-ministry-attestation-gulf-translation-guide"
    };
  }
  return {
    title: isAr ? "دليل أسعار وشروط الترجمة المعتمدة في مصر 2026" : "Certified Translation Prices & Requirements Guide 2026",
    desc: isAr ? "شروط اعتماد المستندات، ختم المترجم المعتمد، ومتطلبات القبول الدبلوماسي الرسمي." : "Consular translation standards, certification seal guidelines, and express delivery options.",
    url: "/blog/certified-translation-prices-requirements-guide"
  };
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
  const guide = getEmbassyGuide(slug, embassy.countryCode, isAr);

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

        {/* Hero title banner */}
        <div className="bg-gradient-to-br from-blue-50/50 via-white to-gray-50 rounded-3xl p-8 sm:p-12 mb-12 border border-gray-150 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-6">
            {embassy.countryCode && (
              <img
                src={`https://flagcdn.com/w80/${embassy.countryCode.toLowerCase()}.png`}
                alt={`${embassy.name} flag`}
                className="h-16 w-24 object-cover rounded-xl shadow-md border border-gray-200"
              />
            )}
            <div>
              <span className="inline-block px-3 py-1 bg-primary-blue/10 text-primary-blue text-xs font-bold rounded-full mb-2">
                {isAr ? "معتمد 100%" : "100% Certified"}
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-dark-navy font-arabic">
                {embassy.name}
              </h1>
            </div>
          </div>
          <div className="text-center md:text-right">
            <h2 className="text-sm font-bold text-dark-navy mb-1 font-arabic">
              {isAr ? "الترجمة المعتمدة لتقديمات السفارة" : "Certified Translation for Embassy Submissions"}
            </h2>
            <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">
              {isAr ? "خدمات الترجمة والاعتماد الرسمية" : "Official Translation & Certification Guidelines"}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main content body */}
          <div className="lg:col-span-2 space-y-12">
            {/* Dynamic Featured Guide Banner */}
            {guide && (
              <div className="rounded-2xl bg-gradient-to-r from-blue-50/90 via-indigo-50/70 to-blue-50/90 border border-blue-200/80 p-6 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xs">
                <div className="space-y-2 text-center sm:text-right flex-1">
                  <span className="inline-block px-3 py-1 bg-primary-blue text-white text-[10px] font-bold rounded-full">
                    {isAr ? "دليل شامل ومحدث 2026" : "Comprehensive Guide 2026"}
                  </span>
                  <h3 className="text-base sm:text-lg font-black text-dark-navy font-arabic">
                    {guide.title}
                  </h3>
                  <p className="text-xs text-gray-600 font-arabic leading-relaxed">
                    {guide.desc}
                  </p>
                </div>
                <Link
                  href={guide.url}
                  className="flex-shrink-0 px-5 py-2.5 rounded-xl bg-primary-blue hover:bg-blue-800 text-white font-bold text-xs shadow-md transition-all whitespace-nowrap hover:scale-105"
                >
                  {isAr ? "قراءة الدليل الكامل ↗" : "Read Full Guide ↗"}
                </Link>
              </div>
            )}

            {/* Rich Embassy Article Body */}
            {embassy.body && (
              <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-100 shadow-sm space-y-6 text-gray-700 leading-relaxed font-arabic text-sm">
                {embassy.body.split('\n\n').map((paragraph, idx) => {
                  if (paragraph.startsWith('# ')) {
                    return null; // Skip H1 title as it is already rendered in hero
                  }
                  if (paragraph.startsWith('## ')) {
                    return (
                      <h2 key={idx} className="text-xl font-black text-dark-navy pt-4 border-b border-gray-100 pb-2">
                        {paragraph.replace('## ', '')}
                      </h2>
                    );
                  }
                  if (paragraph.startsWith('### ')) {
                    return (
                      <h3 key={idx} className="text-base font-bold text-primary-blue pt-2">
                        {paragraph.replace('### ', '')}
                      </h3>
                    );
                  }
                  if (paragraph.includes('GEO Summary')) {
                    return (
                      <div key={idx} className="rounded-2xl bg-amber-500/10 border border-amber-500/20 p-5 my-4">
                        <span className="inline-block text-xs font-bold text-amber-700 bg-amber-200/50 px-2.5 py-1 rounded-md mb-2">
                          إجابة سريعة وموجزة (GEO Summary)
                        </span>
                        <p className="text-xs sm:text-sm text-dark-navy font-semibold leading-relaxed">
                          {paragraph.replace(/[\s\S]*GEO Summary\)/, '').trim()}
                        </p>
                      </div>
                    );
                  }
                  if (paragraph.startsWith('* ') || paragraph.startsWith('- ')) {
                    const items = paragraph.split('\n').map(item => item.replace(/^[*|-]\s*/, ''));
                    return (
                      <ul key={idx} className="space-y-2 list-disc list-inside bg-gray-50/50 p-4 rounded-xl text-xs sm:text-sm">
                        {items.map((it, i) => (
                          <li key={i} className="text-gray-600">{it}</li>
                        ))}
                      </ul>
                    );
                  }
                  if (paragraph.startsWith('|') && paragraph.includes('\n|')) {
                    const rows = paragraph.trim().split('\n').map(r => r.trim()).filter(r => r.startsWith('|'));
                    if (rows.length >= 2) {
                      const headerRow = rows[0].slice(1, -1).split('|').map(c => c.trim());
                      let startIndex = 1;
                      if (rows[1] && rows[1].replace(/[\s\-\|\:]/g, "").length === 0) {
                        startIndex = 2;
                      }
                      const bodyRows = rows.slice(startIndex).map(r => r.slice(1, -1).split('|').map(c => c.trim()));
                      return (
                        <div key={idx} className="overflow-x-auto my-6 rounded-2xl border border-gray-200 bg-white shadow-xs">
                          <table className="min-w-full text-xs text-right border-collapse divide-y divide-gray-200">
                            <thead className="bg-gray-100/90 text-dark-navy">
                              <tr>
                                {headerRow.map((h, hIdx) => (
                                  <th key={hIdx} className="px-5 py-3.5 text-xs font-bold text-dark-navy font-arabic tracking-wide border-b border-gray-200 text-right">
                                    {h}
                                  </th>
                                ))}
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 bg-white font-arabic">
                              {bodyRows.map((row, rIdx) => (
                                <tr key={rIdx} className={`hover:bg-blue-50/40 transition-colors ${rIdx % 2 === 1 ? "bg-gray-50/40" : "bg-white"}`}>
                                  {row.map((cell, cIdx) => (
                                    <td key={cIdx} className={`px-5 py-4 text-xs text-gray-700 leading-relaxed ${cIdx === 0 ? "font-bold text-dark-navy" : ""}`}>
                                      {cell}
                                    </td>
                                  ))}
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      );
                    }
                  }
                  return (
                    <p key={idx} className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                      {paragraph}
                    </p>
                  );
                })}
              </div>
            )}

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
                        <th className="px-6 py-4">{isAr ? "الوثيقة" : "Document"}</th>
                        <th className="px-6 py-4">{isAr ? "سعر الصفحة" : "Price (Per Page)"}</th>
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
                  href={`https://wa.me/201062990808?text=${encodeURIComponent(
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
