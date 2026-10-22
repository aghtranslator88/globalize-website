import { setRequestLocale } from "next-intl/server";
import { getEmbassies } from "@/lib/data";
import { getSEOHeaders, generateBreadcrumbJsonLd } from "@/lib/seo";
import { getPageContent } from "@/lib/pageContent";
import { PageContentIntro, PageContentBody, PageContentFaqs, PageContentFaqJsonLd } from "@/components/PageContent";
import { serializeJsonLd } from "@/lib/jsonLd";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Link } from "@/i18n/routing";
import type { Metadata } from "next";

export const revalidate = 3600;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const content = getPageContent("embassies", locale);
  return getSEOHeaders(content.seoTitle, content.metaDescription, "/embassies", true, locale);
}

export default async function EmbassiesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const embassies = await getEmbassies(locale);
  const isAr = locale === "ar";
  const content = getPageContent("embassies", locale);

  // Group by region
  const regions: Record<string, string> = {
    EUROPE: isAr ? "دول أوروبا والاتحاد الأوروبي" : "Europe & EU",
    GULF_ARAB: isAr ? "دول الخليج العربي والوطن العربي" : "Gulf & Arab Countries",
    AMERICAS: isAr ? "الأمريكتان (أمريكا وكندا)" : "The Americas",
    ASIA_AUSTRALIA: isAr ? "آسيا وأستراليا" : "Asia & Australia",
  };

  const groupedEmbassies = embassies.reduce((acc, emb) => {
    if (!acc[emb.region]) acc[emb.region] = [];
    acc[emb.region].push(emb);
    return acc;
  }, {} as Record<string, typeof embassies>);

  const breadcrumbs = [
    { name: isAr ? "الرئيسية" : "Home", url: "/" },
    { name: isAr ? "السفارات" : "Embassies", url: "/embassies" },
  ];

  const breadcrumbJsonLd = generateBreadcrumbJsonLd(breadcrumbs, locale);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(breadcrumbJsonLd) }}
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

        <div className="mb-12 max-w-4xl">
          <PageContentIntro unit={content} isAr={isAr} />
        </div>

        {/* Embassies Grid grouped by region */}
        <div className="space-y-12">
          {Object.entries(regions).map(([regionKey, regionName]) => {
            const list = groupedEmbassies[regionKey] || [];
            if (list.length === 0) return null;

            return (
              <div key={regionKey} className="space-y-6">
                <h2 className="text-lg font-bold text-dark-navy border-b border-gray-100 pb-3 flex items-center gap-2 font-arabic">
                  <span className="h-4 w-1 bg-primary-blue rounded-full"></span>
                  <span>{regionName}</span>
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {list.map((emb) => (
                    <Link
                      key={emb.slug}
                      href={`/embassies/${emb.slug}`}
                      className="rounded-xl border border-gray-150 p-5 bg-white hover-lift flex items-center justify-between"
                    >
                      <div className="flex items-center gap-4">
                        {/* Flag Image */}
                        <div className="h-9 w-9 rounded-full overflow-hidden border border-gray-100 flex-shrink-0 bg-gray-50 flex items-center justify-center">
                          <img
                            src={`https://flagcdn.com/w40/${emb.countryCode.toLowerCase()}.png`}
                            alt={emb.name}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div className="flex flex-col">
                          <h3 className="font-bold text-xs text-dark-navy hover:text-primary-blue transition-colors">
                            {emb.name}
                          </h3>
                          <span className="text-[9px] text-gray-400 font-semibold mt-0.5">
                            {emb.indexable 
                              ? (isAr ? "متطلبات كاملة ✓" : "Fully filled Requirements ✓")
                              : (isAr ? "ترجمة معتمدة" : "Certified Translation")}
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-14 max-w-4xl space-y-12">
          <PageContentBody unit={content} />
          <PageContentFaqs unit={content} />
        </div>
      </main>

      <Footer />
    </>
  );
}
