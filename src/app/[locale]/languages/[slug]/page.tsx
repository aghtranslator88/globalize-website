import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { getLanguageBySlug, getServices } from "@/lib/data";
import { getSEOHeaders, generateBreadcrumbJsonLd } from "@/lib/seo";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import QuoteForm from "@/components/QuoteForm";
import { Link } from "@/i18n/routing";
import { Phone, CheckCircle, Globe, ArrowLeft, ArrowRight, MessageCircle } from "lucide-react";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const lang = await getLanguageBySlug(slug, locale);
  if (!lang) return {};
  return getSEOHeaders(lang.name, `${lang.name} certified translation services and languages.`, `/languages/${slug}`, true, locale);
}

export default async function LanguageDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const lang = await getLanguageBySlug(slug, locale);
  if (!lang) {
    notFound();
  }

  const services = await getServices(locale);
  const isAr = locale === "ar";

  const breadcrumbs = [
    { name: isAr ? "الرئيسية" : "Home", url: "/" },
    { name: isAr ? "اللغات" : "Languages", url: "/languages" },
    { name: lang.name, url: `/languages/${slug}` },
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

        {/* Header Section */}
        <div className="flex flex-col md:flex-row items-center gap-6 mb-10 border-b border-gray-100 pb-8">
          <div className="h-16 w-16 rounded-xl bg-primary-blue/10 text-primary-blue flex items-center justify-center flex-shrink-0 shadow-sm border border-primary-blue/20">
            <Globe className="h-8 w-8" />
          </div>
          <div className="text-center md:text-right">
            <h1 className="text-2xl sm:text-4xl font-black text-dark-navy mb-2 font-arabic">
              {isAr ? `خدمات الترجمة بـ ${lang.name}` : `Translation Services for ${lang.name}`}
            </h1>
            <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">
              {isAr ? `كافة الخدمات المعتمدة للغة ${lang.name}` : `All Certified Solutions in ${lang.name}`}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-12">
            {/* Language details answerbox */}
            <div className="answer-box p-6 sm:p-8">
              <h3 className="font-bold text-xs text-primary-blue uppercase tracking-wide mb-2">
                {isAr ? `نبذة عن خدمات اللغة` : `About Language Services`}
              </h3>
              <p className="text-sm font-semibold text-dark-navy leading-relaxed font-arabic">
                {lang.description}
              </p>
            </div>

            {/* List Services for that Language */}
            <div>
              <h2 className="text-xl font-bold text-dark-navy mb-6 border-b border-gray-100 pb-3 font-arabic">
                {isAr ? `الخدمات المتوفرة للغة ${lang.name}` : `Available Services in ${lang.name}`}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {services.map((srv) => (
                  <div key={srv.slug} className="rounded-xl border border-gray-150 p-6 bg-white shadow-sm flex flex-col justify-between">
                    <div>
                      <h3 className="font-bold text-sm text-dark-navy mb-2">{srv.name}</h3>
                      <p className="text-xs text-gray-500 leading-relaxed mb-4">{srv.description}</p>
                    </div>
                    <Link
                      href={`/${srv.slug}`}
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-primary-blue hover:underline mt-4"
                    >
                      <span>{isAr ? "عرض تفاصيل الخدمة" : "View Service"}</span>
                      {isAr ? <ArrowLeft className="h-3 w-3" /> : <ArrowRight className="h-3 w-3" />}
                    </Link>
                  </div>
                ))}
              </div>
            </div>

            {/* Quality seal */}
            <div className="rounded-2xl border border-green-200 bg-green-50/50 p-6 flex gap-4">
              <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-xs text-green-800 mb-1">
                  {isAr ? "ضمان القبول الرسمي" : "Guaranteed Acceptance"}
                </h4>
                <p className="text-[11px] text-green-700 leading-relaxed">
                  {isAr 
                    ? `تخضع ترجماتنا بـ ${lang.name} لعمليات تدقيق لغوية دقيقة ومطابقة بنسبة 100% للوثيقة الأصلية لضمان قبولها الكامل وبدون تأخير.`
                    : `Our ${lang.name} translations undergo rigorous linguistic reviews and 100% format matching to guarantee full acceptance.`}
                </p>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-28">
              <QuoteForm />
              
              <div className="mt-6 rounded-2xl bg-whatsapp-green/5 border border-whatsapp-green/20 p-6 text-center">
                <h4 className="font-bold text-xs text-whatsapp-green mb-2">{isAr ? "طلب تسعير فوري عبر الواتساب" : "Instant Quote on WhatsApp"}</h4>
                <a
                  href={`https://wa.me/201062990808?text=${encodeURIComponent(
                    isAr 
                      ? `أريد الاستفسار عن ترجمة للغة: ${lang.name}`
                      : `I want to inquire about translation into: ${lang.name}`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 rounded-xl bg-whatsapp-green hover:bg-emerald-600 text-white py-3 text-xs font-bold shadow-md transition-all animate-pulse-glow"
                >
                  <MessageCircle className="h-4 w-4" />
                  <span>{isAr ? "تواصل واتساب" : "WhatsApp Chat"}</span>
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
