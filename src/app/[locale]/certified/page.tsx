import { setRequestLocale } from "next-intl/server";
import { getServiceBySlug, getDocuments, getFAQs } from "@/lib/data";
import { getSEOHeaders, generateServiceJsonLd, generateFAQJsonLd } from "@/lib/seo";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import QuoteForm from "@/components/QuoteForm";
import { Phone, CheckCircle, ShieldCheck, Award, FileText, Landmark, Clock, ChevronDown, Globe, MessageCircle } from "lucide-react";
import { Link } from "@/i18n/routing";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const service = await getServiceBySlug("certified", locale);
  if (!service) return {};
  return getSEOHeaders(service.name, service.description, "/certified", service.indexable, locale);
}

export default async function CertifiedPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const service = await getServiceBySlug("certified", locale);
  if (!service) return null;

  const docs = await getDocuments(locale);
  const faqs = await getFAQs("service", service.id, locale);
  const isAr = locale === "ar";

  // Breadcrumbs data
  const breadcrumbs = [
    { name: isAr ? "الرئيسية" : "Home", url: "/" },
    { name: service.name, url: "/certified" },
  ];

  const serviceJsonLd = generateServiceJsonLd({
    name: service.name,
    description: service.description,
    url: `/${locale}/certified`,
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-12">
            {/* H1 & Header */}
            <div>
              <h1 className="text-2xl sm:text-4xl font-black text-dark-navy mb-4 font-arabic">
                {service.name}
              </h1>
              <p className="text-gray-600 text-sm leading-relaxed">
                {service.description}
              </p>
            </div>

            {/* Answer Box Definition */}
            <div className="answer-box p-6 sm:p-8">
              <h3 className="font-bold text-xs text-primary-blue uppercase tracking-wide mb-2">
                {isAr ? "تعريف الترجمة المعتمدة" : "Certified Translation Defined"}
              </h3>
              <p className="text-sm font-semibold text-dark-navy leading-relaxed font-arabic">
                {service.definition}
              </p>
            </div>

            {/* 4 Sub-Hub Cards */}
            <div>
              <h2 className="text-xl font-bold text-dark-navy mb-6 border-b border-gray-100 pb-3 font-arabic">
                {isAr ? "مجالات وخدمات الاعتماد" : "Areas of Certification"}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <Link href="/embassies" className="rounded-xl border border-gray-100 p-6 bg-white hover-lift text-center block">
                  <Landmark className="h-8 w-8 text-primary-blue mx-auto mb-4" />
                  <h3 className="font-bold text-sm text-dark-navy mb-2">{isAr ? "السفارات الأجنبية" : "Foreign Embassies"}</h3>
                  <p className="text-[11px] text-gray-500">{isAr ? "متطلبات تأشيرات السفر والدراسة والهجرة" : "Visa & Immigration requirements"}</p>
                </Link>

                <Link href="/government" className="rounded-xl border border-gray-100 p-6 bg-white hover-lift text-center block">
                  <ShieldCheck className="h-8 w-8 text-primary-blue mx-auto mb-4" />
                  <h3 className="font-bold text-sm text-dark-navy mb-2">{isAr ? "الهيئات الحكومية" : "Gov Entities"}</h3>
                  <p className="text-[11px] text-gray-500">{isAr ? "التصديقات الخارجية والشهر العقاري والمحاكم" : "MOFA Legalizations & Court files"}</p>
                </Link>

                <Link href="/documents" className="rounded-xl border border-gray-100 p-6 bg-white hover-lift text-center block">
                  <FileText className="h-8 w-8 text-primary-blue mx-auto mb-4" />
                  <h3 className="font-bold text-sm text-dark-navy mb-2">{isAr ? "الوثائق والأوراق" : "Documents & Certificates"}</h3>
                  <p className="text-[11px] text-gray-500">{isAr ? "أسعار ترجمة شهادة الميلاد والزواج والوفاة والفيش" : "Pricing lists of vital records"}</p>
                </Link>

                <Link href="/languages" className="rounded-xl border border-gray-100 p-6 bg-white hover-lift text-center block">
                  <Globe className="h-8 w-8 text-primary-blue mx-auto mb-4" />
                  <h3 className="font-bold text-sm text-dark-navy mb-2">{isAr ? "اللغات المتاحة" : "Supported Languages"}</h3>
                  <p className="text-[11px] text-gray-500">{isAr ? "لغات الترجمة المعتمدة كالإنجليزية والفرنسية والألمانية" : "Certified translation in English, French, German, etc."}</p>
                </Link>
              </div>
            </div>

            {/* Full Pricing Table */}
            <div>
              <h2 className="text-xl font-bold text-dark-navy mb-6 border-b border-gray-100 pb-3 font-arabic">
                {isAr ? "جدول أسعار ترجمة الوثائق الرسمية (سعر الصفحة)" : "Certified Document Pricing Table (Per Page)"}
              </h2>
              <div className="overflow-x-auto rounded-xl border border-gray-150 shadow-sm bg-white mb-3">
                <table className="min-w-full divide-y divide-gray-200 text-right">
                  <thead className="bg-gray-50 text-dark-navy text-xs font-bold">
                    <tr>
                      <th className="px-6 py-4">{isAr ? "الوثيقة" : "Document"}</th>
                      <th className="px-6 py-4">{isAr ? "عربي ↔ إنجليزي" : "Arabic ↔ English"}</th>
                      <th className="px-6 py-4">{isAr ? "اللغات الأخرى" : "Other Languages"}</th>
                      <th className="px-6 py-4">{isAr ? "مدة التسليم" : "Turnaround"}</th>
                      <th className="px-6 py-4 text-center">{isAr ? "طلب الخدمة" : "Order"}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-150 text-xs text-gray-700">
                    {docs.map((doc) => (
                      <tr key={doc.slug} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-6 py-4 font-bold text-dark-navy">
                          <Link href={`/documents/${doc.slug}`} className="hover:text-primary-blue transition-colors">
                            {doc.name}
                          </Link>
                        </td>
                        <td className="px-6 py-4 font-black text-primary-blue">
                          200 <span className="text-[10px] font-normal">{isAr ? "ج.م / صفحة" : "EGP / page"}</span>
                        </td>
                        <td className="px-6 py-4 font-bold text-emerald-700">
                          300 <span className="text-[10px] font-normal">{isAr ? "ج.م / صفحة" : "EGP / page"}</span>
                        </td>
                        <td className="px-6 py-4 text-gray-500">
                          {doc.deliveryHours} {isAr ? "ساعة" : "hours"}
                        </td>
                        <td className="px-6 py-4 text-center">
                           <a
                            href={`https://wa.me/201062990808?text=${encodeURIComponent(
                              isAr
                                ? `أريد الاستفسار عن ترجمة: ${doc.name} (سعر الصفحة 200 ج.م عربي-إنجليزي أو 300 ج.م للغات الأخرى)`
                                : `I want to inquire about translating: ${doc.name} (200 EGP/page AR-EN or 300 EGP/page other languages)`
                            )}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 rounded-lg bg-whatsapp-green hover:bg-emerald-600 text-white px-3 py-1.5 text-[10px] font-bold shadow-sm animate-pulse-glow"
                          >
                            <MessageCircle className="h-3 w-3" />
                            <span>{isAr ? "واتساب" : "WhatsApp"}</span>
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-[11px] text-gray-500 bg-gray-50 p-3 rounded-lg border border-gray-200 leading-relaxed">
                {isAr
                  ? "📌 ملاحظة هامة: الأسعار أعلاه تُحسب لكل صفحة (200 جنيه للترجمة بين العربية والإنجليزية، و 300 جنيه لأي لغة ثانية كالفرنسية والألمانية والإيطالية). إذا كانت الوثيقة تحتوي على أكثر من صفحة يُحسب الإجمالي وفقاً لعدد الصفحات."
                  : "📌 Important Note: Rates above are calculated per page (200 EGP for Arabic ↔ English, 300 EGP for other foreign languages such as German, French, Italian). For multi-page documents, the total is calculated per page."}
              </p>
            </div>

            {/* Why Us / Quality Bar */}
            <div>
              <h2 className="text-xl font-bold text-dark-navy mb-6 border-b border-gray-100 pb-3 font-arabic">
                {isAr ? "لماذا تختار جلوبالايز جروب للترجمة المعتمدة؟" : "Why Choose Globalize Group?"}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="flex gap-4">
                  <div className="h-10 w-10 rounded-lg bg-green-50 text-green-600 flex items-center justify-center flex-shrink-0">
                    <Award className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-dark-navy mb-1">{isAr ? "دقة ومطابقة قانونية كاملة" : "Full Legal Accuracy"}</h4>
                    <p className="text-[11px] text-gray-500 leading-relaxed">{isAr ? "نلتزم بأعلى معايير الصياغة القانونية واللغوية ومطابقة الشكل لتفادي أي رفض." : "We adhere to strict legal styling and terminology formats to ensure document acceptance."}</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="h-10 w-10 rounded-lg bg-green-50 text-green-600 flex items-center justify-center flex-shrink-0">
                    <ShieldCheck className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-dark-navy mb-1">{isAr ? "اعتماد رسمي 100%" : "100% Officially Accepted"}</h4>
                    <p className="text-[11px] text-gray-500 leading-relaxed">{isAr ? "ترجمتنا مختومة بختم مكتبنا المعتمد المقبول لدى جميع الهيئات والسفارات بالجمهورية والخليج." : "Our stamp is recognized by all consulates, government entities, and international bodies."}</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="h-10 w-10 rounded-lg bg-green-50 text-green-600 flex items-center justify-center flex-shrink-0">
                    <Clock className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-dark-navy mb-1">{isAr ? "سرعة قصوى للتسليم" : "Fast Turnaround"}</h4>
                    <p className="text-[11px] text-gray-500 leading-relaxed">{isAr ? "نلتزم بتسليم الوثائق والشهادات خلال 24 ساعة فقط مع توفير خدمات الترجمة الفورية المستعجلة." : "Turnaround within 24 hours for standard certificates, with express options for urgent files."}</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="h-10 w-10 rounded-lg bg-green-50 text-green-600 flex items-center justify-center flex-shrink-0">
                    <Phone className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-dark-navy mb-1">{isAr ? "دعم متواصل على مدار الساعة" : "24/7 Support"}</h4>
                    <p className="text-[11px] text-gray-500 leading-relaxed">{isAr ? "فريق عملنا متواجد للرد على استفساراتكم وتلقي الطلبات عبر الواتساب على مدار اليوم." : "Our staff is online to quote and process document requests via WhatsApp all day."}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* FAQs Accordion */}
            {faqs.length > 0 && (
              <div>
                <h2 className="text-xl font-bold text-dark-navy mb-6 border-b border-gray-100 pb-3 font-arabic">
                  {isAr ? "الأسئلة الشائعة حول الخدمة" : "Frequently Asked Questions"}
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

          {/* Sidebar Area: Quote Form */}
          <div className="lg:col-span-1">
            <div className="sticky top-28">
              <QuoteForm />
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
