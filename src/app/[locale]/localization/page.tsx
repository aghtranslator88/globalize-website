import { setRequestLocale } from "next-intl/server";
import { getServiceBySlug } from "@/lib/data";
import { getSEOHeaders, generateServiceJsonLd } from "@/lib/seo";
import { getPageContent } from "@/lib/pageContent";
import { PageContentIntro, PageContentBody, PageContentFaqs, PageContentFaqJsonLd } from "@/components/PageContent";
import { serializeJsonLd } from "@/lib/jsonLd";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import QuoteForm from "@/components/QuoteForm";
import { Link } from "@/i18n/routing";
import type { Metadata } from "next";

export const revalidate = 3600;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const service = await getServiceBySlug("localization", locale);
  if (!service) return {};
  const content = getPageContent("localization", locale);
  return getSEOHeaders(content.seoTitle, content.metaDescription, "/localization", service.indexable, locale);
}

export default async function LocalizationPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const service = await getServiceBySlug("localization", locale);
  if (!service) return null;

  const content = getPageContent("localization", locale);
  const isAr = locale === "ar";

  const breadcrumbs = [
    { name: isAr ? "الرئيسية" : "Home", url: "/" },
    { name: service.name, url: "/localization" },
  ];

  const serviceJsonLd = generateServiceJsonLd({
    name: content.h1,
    description: content.metaDescription,
    url: `/${locale}/localization`,
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(serviceJsonLd) }}
      />
      <PageContentFaqJsonLd unit={content} />
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-12">
            <PageContentIntro unit={content} isAr={isAr} />

            <PageContentBody unit={content} />

            <PageContentFaqs unit={content} />
          </div>

          {/* RFQ Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-28">
              {/* Specialized corporate quote options */}
              <QuoteForm services={[{ slug: "localization", name: isAr ? "توطين مواقع وتطبيقات" : "Localization" }]} />
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
