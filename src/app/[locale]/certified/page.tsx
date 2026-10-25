import { setRequestLocale } from "next-intl/server";
import { getServiceBySlug, getDocuments } from "@/lib/data";
import { getSEOHeaders, generateServiceJsonLd, generateBreadcrumbJsonLd } from "@/lib/seo";
import { getPageContent } from "@/lib/pageContent";
import { GUIDE_BLOG_POSTS } from "@/lib/guide-posts";
import { PageContentIntro, PageContentBody, PageContentFaqs, PageContentFaqJsonLd } from "@/components/PageContent";
import { serializeJsonLd } from "@/lib/jsonLd";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import QuoteForm from "@/components/QuoteForm";
import TrackedWhatsAppLink from "@/components/TrackedWhatsAppLink";
import { ShieldCheck, FileText, Landmark, Globe, MessageCircle } from "lucide-react";
import { Link } from "@/i18n/routing";

import type { Metadata } from "next";

export const revalidate = 3600;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const service = await getServiceBySlug("certified", locale);
  if (!service) return {};
  const content = getPageContent("certified", locale);
  return getSEOHeaders(content.seoTitle, content.metaDescription, "/certified", service.indexable, locale);
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
  const content = getPageContent("certified", locale);
  const isAr = locale === "ar";

  // Breadcrumbs data
  const breadcrumbs = [
    { name: isAr ? "الرئيسية" : "Home", url: "/" },
    { name: isAr ? "الترجمة المعتمدة" : "Certified Translation", url: "/certified" },
  ];

  const breadcrumbJsonLd = generateBreadcrumbJsonLd(breadcrumbs, locale);
  const serviceJsonLd = generateServiceJsonLd({
    name: content.h1,
    description: content.metaDescription,
    url: `/${locale}/certified`,
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(serviceJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(breadcrumbJsonLd) }}
      />
      <PageContentFaqJsonLd unit={content} />
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
            <PageContentIntro unit={content} isAr={isAr} />

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
                           <TrackedWhatsAppLink
                            href={`https://wa.me/201062990808?text=${encodeURIComponent(
                              isAr
                                ? `أريد الاستفسار عن ترجمة: ${doc.name} (سعر الصفحة 200 ج.م عربي-إنجليزي أو 300 ج.م للغات الأخرى)`
                                : `I want to inquire about translating: ${doc.name} (200 EGP/page AR-EN or 300 EGP/page other languages)`
                            )}`}
                            ctaLocation="certified_table_row"
                            language={locale}
                            className="inline-flex items-center gap-1 rounded-lg bg-whatsapp-green hover:bg-emerald-600 text-white px-3 py-1.5 text-[10px] font-bold shadow-sm animate-pulse-glow cursor-pointer"
                          >
                            <MessageCircle className="h-3 w-3" />
                            <span>{isAr ? "واتساب" : "WhatsApp"}</span>
                          </TrackedWhatsAppLink>
                        </td>

                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-[11px] text-gray-500 bg-gray-50 p-3 rounded-lg border border-gray-200 leading-relaxed">
                {isAr
                  ? "📌 ملاحظة مهمة: تُحسب الأسعار أعلاه لكل صفحة (200 جنيه للترجمة بين العربية والإنجليزية، و300 جنيه لأي لغة أجنبية أخرى كالفرنسية والألمانية والإيطالية). وفي حال كانت الوثيقة تحتوي على أكثر من صفحة، يُحسب الإجمالي وفقاً لإجمالي عدد الصفحات."
                  : "📌 Important Note: Rates above are calculated per page (200 EGP for Arabic ↔ English, 300 EGP for other foreign languages such as German, French, Italian). For multi-page documents, the total is calculated per page."}
              </p>
            </div>

            <PageContentBody unit={content} />

            <section className="rounded-xl border border-gray-200 bg-white p-6 space-y-4">
              <h2 className="font-bold text-base text-dark-navy font-arabic">
                {isAr ? "خدمات وأدلة ذات صلة" : "Related services and guides"}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {GUIDE_BLOG_POSTS.map((post) => (
                  <Link
                    key={post.slug}
                    href={`/blog/${post.slug}`}
                    className="p-3 rounded-lg border border-gray-100 hover:border-primary-blue hover:bg-blue-50/30 transition-colors block font-bold text-dark-navy"
                  >
                    {isAr ? post.title : post.titleEn}
                  </Link>
                ))}
              </div>
            </section>

            <PageContentFaqs unit={content} />
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
