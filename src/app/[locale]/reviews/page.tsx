import { setRequestLocale } from "next-intl/server";
import { getSEOHeaders, generateAggregateRatingJsonLd, generateBreadcrumbJsonLd } from "@/lib/seo";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import GoogleReviewsGallery from "@/components/GoogleReviewsGallery";
import { Link } from "@/i18n/routing";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const title = locale === "ar" ? "تقييمات وآراء عملائنا الموثقة على خرائط جوجل" : "Verified Client Reviews on Google Maps";
  const description = locale === "ar"
    ? "آراء وتوثيقات حقيقية لعملاء جلوباليز جروب للترجمة المعتمدة على Google Maps، بمعدل تقييم 4.9 من 5."
    : "Genuine, verified reviews and ratings from clients of Globalize Group for certified translation on Google Maps, rated 4.9 out of 5.";
  return getSEOHeaders(title, description, "/reviews", true, locale);
}

export default async function ReviewsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const isAr = locale === "ar";

  const breadcrumbs = [
    { name: isAr ? "الرئيسية" : "Home", url: "/" },
    { name: isAr ? "آراء وتقييمات العملاء" : "Client Reviews", url: "/reviews" },
  ];

  const breadcrumbJsonLd = generateBreadcrumbJsonLd(breadcrumbs);
  
  // Real Google Business Profile verified stats
  const aggregateRatingJsonLd = generateAggregateRatingJsonLd(4.9, 100);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aggregateRatingJsonLd) }}
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
            {isAr ? "آراء وتقييمات عملائنا الموثقة" : "Verified Client Reviews & Testimonials"}
          </h1>
          <p className="text-gray-500 text-xs sm:text-sm max-w-2xl mx-auto leading-relaxed">
            {isAr
              ? "نعتز بثقتكم ونفخر بتقديم أفضل جودة لترجماتكم المعتمدة لدى جميع السفارات والجهات الحكومية. طالع تجارب وتقييمات عملائنا الحقيقية الموثقة على خرائط Google."
              : "We take pride in delivering top-quality certified translations accepted by all embassies and authorities. Read authentic client reviews verified on Google Maps."}
          </p>
        </div>

        {/* 100% Genuine Google Maps Reviews & Screenshots Gallery */}
        <GoogleReviewsGallery locale={locale} />
      </main>

      <Footer />
    </>
  );
}
