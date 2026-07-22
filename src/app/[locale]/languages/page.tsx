import { setRequestLocale } from "next-intl/server";
import { getLanguages } from "@/lib/data";
import { getSEOHeaders, generateBreadcrumbJsonLd } from "@/lib/seo";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Link } from "@/i18n/routing";
import { Globe, Star, ArrowLeft, ArrowRight } from "lucide-react";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const title = locale === "ar" ? "اللغات التي نترجمها — أكثر من 50 لغة معتمدة" : "Languages We Translate — Over 50 Certified Languages";
  const description = locale === "ar"
    ? "نقدم خدمات الترجمة الرسمية المعتمدة إلى أكثر من 50 لغة عالمية، بما في ذلك الإنجليزية والألمانية والفرنسية والإيطالية وغيرها."
    : "We offer certified official translation services into over 50 global languages, including English, German, French, and Italian.";
  return getSEOHeaders(title, description, "/languages", true, locale);
}

export default async function LanguagesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const languages = await getLanguages(locale);
  const isAr = locale === "ar";

  const breadcrumbs = [
    { name: isAr ? "الرئيسية" : "Home", url: "/" },
    { name: isAr ? "اللغات المعتمدة" : "Supported Languages", url: "/languages" },
  ];

  const breadcrumbJsonLd = generateBreadcrumbJsonLd(breadcrumbs);

  // Group languages into popular and other languages
  const popularLanguages = languages.filter((l) => l.popular);
  const otherLanguages = languages.filter((l) => !l.popular);

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
            {isAr ? "اللغات المعتمدة التي نترجمها" : "Certified Languages We Translate"}
          </h1>
          <p className="text-gray-500 text-xs sm:text-sm max-w-2xl mx-auto leading-relaxed">
            {isAr
              ? "نغطي أكثر من 50 لغة عالمية بترجمات معتمدة ورسمية تناسب متطلبات السفارات والهيئات الأكاديمية والتجارية."
              : "We support over 50 global languages with certified official translations compliant with all embassies and academic boards."}
          </p>
        </div>

        {/* Popular Languages Section */}
        {popularLanguages.length > 0 && (
          <div className="space-y-6 mb-16">
            <h2 className="text-lg font-bold text-dark-navy border-b border-gray-100 pb-3 flex items-center gap-2 font-arabic">
              <Star className="h-5 w-5 text-gold fill-current" />
              <span>{isAr ? "اللغات الأكثر طلباً" : "Popular Languages"}</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {popularLanguages.map((lang) => (
                <Link
                  key={lang.slug}
                  href={`/languages/${lang.slug}`}
                  className="rounded-2xl border border-gray-150 p-6 bg-white shadow-sm hover-lift flex flex-col justify-between"
                >
                  <div>
                    <div className="h-10 w-10 rounded-xl bg-primary-blue/10 text-primary-blue flex items-center justify-center mb-4">
                      <Globe className="h-5 w-5" />
                    </div>
                    <h3 className="font-bold text-sm text-dark-navy mb-2 font-arabic">{lang.name}</h3>
                    <p className="text-[11px] text-gray-500 leading-relaxed mb-4 line-clamp-2">
                      {lang.description}
                    </p>
                  </div>
                  <span className="text-[10px] font-bold text-primary-blue inline-flex items-center gap-1 mt-2">
                    <span>{isAr ? "عرض الخدمات" : "View Services"}</span>
                    {isAr ? <ArrowLeft className="h-3 w-3" /> : <ArrowRight className="h-3 w-3" />}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Other Languages Section */}
        {otherLanguages.length > 0 && (
          <div className="space-y-6">
            <h2 className="text-lg font-bold text-dark-navy border-b border-gray-100 pb-3 flex items-center gap-2 font-arabic">
              <span className="h-4 w-1 bg-primary-blue rounded-full"></span>
              <span>{isAr ? "لغات أخرى متوفرة لدينا" : "Other Available Languages"}</span>
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-4">
              {otherLanguages.map((lang) => (
                <Link
                  key={lang.slug}
                  href={`/languages/${lang.slug}`}
                  className="rounded-xl border border-gray-150 p-4 bg-white text-center hover:bg-gray-50/50 hover:border-primary-blue/30 transition-all duration-200 block"
                >
                  <h3 className="font-semibold text-xs text-dark-navy hover:text-primary-blue transition-colors truncate">
                    {lang.name}
                  </h3>
                  <span className="text-[9px] text-gray-400 font-semibold mt-1 block">
                    {lang.code.toUpperCase()}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </main>

      <Footer />
    </>
  );
}
