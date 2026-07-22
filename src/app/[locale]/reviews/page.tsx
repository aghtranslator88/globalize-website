import { setRequestLocale } from "next-intl/server";
import { getReviews } from "@/lib/data";
import { getSEOHeaders, generateAggregateRatingJsonLd, generateBreadcrumbJsonLd } from "@/lib/seo";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ReviewsList from "@/components/ReviewsList";
import { Link } from "@/i18n/routing";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const title = locale === "ar" ? "تقييمات وآراء عملائنا في خدمات الترجمة" : "Client Reviews & Testimonials";
  const description = locale === "ar"
    ? "آراء حقيقية وتوثيقات لعملاء تعاملوا معنا في خدمات الترجمة المعتمدة وتوطين البرمجيات."
    : "Genuine reviews and ratings from clients who used our certified translation and software localization services.";
  return getSEOHeaders(title, description, "/reviews", true, locale);
}

export default async function ReviewsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const reviews = await getReviews(locale);
  const isAr = locale === "ar";

  const breadcrumbs = [
    { name: isAr ? "الرئيسية" : "Home", url: "/" },
    { name: isAr ? "آراء وتقييمات العملاء" : "Client Reviews", url: "/reviews" },
  ];

  const breadcrumbJsonLd = generateBreadcrumbJsonLd(breadcrumbs);
  
  // Aggregate rating calculations for JSON-LD
  const averageRating = reviews.length > 0
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : 5;
  const aggregateRatingJsonLd = generateAggregateRatingJsonLd(averageRating, reviews.length > 0 ? reviews.length : 1);

  // Convert dates to string format for next-intl Client components serialization safety
  const serializedReviews = reviews.map((r) => ({
    id: r.id,
    authorName: r.authorName,
    rating: r.rating,
    text: r.text,
    serviceType: r.serviceType,
    date: r.date.toISOString(),
    videoUrl: r.videoUrl,
  }));

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

        <div className="text-center mb-12">
          <h1 className="text-2xl sm:text-4xl font-black text-dark-navy mb-4 font-arabic">
            {isAr ? "آراء وتقييمات عملائنا الكرام" : "Client Reviews & Testimonials"}
          </h1>
          <p className="text-gray-500 text-xs sm:text-sm max-w-2xl mx-auto leading-relaxed">
            {isAr
              ? "نعتز بثقتكم ونفخر بتقديم أفضل جودة لترجماتكم القانونية والشخصية. اقرأ تجارب عملائنا الحقيقية."
              : "We value your trust and take pride in delivering the highest quality certified translations. Read real client experiences."}
          </p>
        </div>

        {/* Reviews List Component */}
        <ReviewsList reviews={serializedReviews} />
      </main>

      <Footer />
    </>
  );
}
