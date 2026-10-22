import { setRequestLocale } from "next-intl/server";
import { getSEOHeaders, generateServiceJsonLd, generateBreadcrumbJsonLd } from "@/lib/seo";
import { getPageContent } from "@/lib/pageContent";
import { PageContentIntro, PageContentBody, PageContentFaqs, PageContentFaqJsonLd } from "@/components/PageContent";
import { serializeJsonLd } from "@/lib/jsonLd";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import QuoteForm from "@/components/QuoteForm";
import TrackedWhatsAppLink from "@/components/TrackedWhatsAppLink";
import TrackedPhoneLink from "@/components/TrackedPhoneLink";
import { Link } from "@/i18n/routing";

import {
  Phone,
  MessageCircle,
} from "lucide-react";
import type { Metadata } from "next";

export const revalidate = 3600;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const content = getPageContent("legal-translation", locale);

  return getSEOHeaders(content.seoTitle, content.metaDescription, "/services/legal-translation", true, locale, true);
}

export default async function LegalTranslationPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const isAr = locale === "ar";
  const content = getPageContent("legal-translation", locale);

  const breadcrumbs = [
    { name: isAr ? "الرئيسية" : "Home", url: "/" },
    { name: isAr ? "خدمات الترجمة" : "Services", url: "/certified" },
    { name: isAr ? "الترجمة القانونية المعتمدة" : "Certified Legal Translation", url: "/services/legal-translation" },
  ];

  const serviceJsonLd = generateServiceJsonLd({
    name: content.h1,
    description: content.metaDescription,
    url: `/${locale}/services/legal-translation`,
  });

  const breadcrumbJsonLd = generateBreadcrumbJsonLd(breadcrumbs, locale);

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
              <PageContentIntro unit={content} isAr={isAr} />

              {/* ACTION BUTTONS */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <TrackedWhatsAppLink
                  href={`https://wa.me/201062990808?text=${encodeURIComponent(
                    isAr
                      ? "مرحباً جلوباليز جروب، أود إرسال وثائق قانونية للحصول على عرض سعر وموعد تسليم معتمد."
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


            <PageContentBody unit={content} />

            <PageContentFaqs unit={content} />

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
                  {isAr ? "فروع جلوباليز جروب في القاهرة والجيزة" : "Globalize Group Cairo & Giza Branches"}
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
