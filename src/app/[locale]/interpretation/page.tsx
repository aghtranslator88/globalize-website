import { setRequestLocale } from "next-intl/server";
import { getServiceBySlug } from "@/lib/data";
import { getSEOHeaders, generateServiceJsonLd, generateBreadcrumbJsonLd } from "@/lib/seo";
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
  const service = await getServiceBySlug("interpretation", locale);
  if (!service) return {};
  const content = getPageContent("interpretation", locale);
  return getSEOHeaders(content.seoTitle, content.metaDescription, "/interpretation", service.indexable, locale);
}

export default async function InterpretationPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const service = await getServiceBySlug("interpretation", locale);
  if (!service) return null;

  const content = getPageContent("interpretation", locale);
  const isAr = locale === "ar";

  const breadcrumbs = [
    { name: isAr ? "الرئيسية" : "Home", url: "/" },
    { name: service.name, url: "/interpretation" },
  ];

  const breadcrumbJsonLd = generateBreadcrumbJsonLd(breadcrumbs, locale);
  const serviceJsonLd = generateServiceJsonLd({
    name: content.h1,
    description: content.metaDescription,
    url: `/${locale}/interpretation`,
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

            <section className="rounded-xl border border-gray-200 bg-white p-6 space-y-3">
              <h2 className="font-bold text-sm text-dark-navy">{isAr ? "مقالات ذات صلة" : "Related reading"}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <Link href="/blog/إيجار-سماعات-وشاشات-ومعدات-الترجمة-الفورية" className="p-3 rounded-lg border border-gray-100 hover:border-primary-blue hover:bg-blue-50/30 transition-colors block font-bold text-dark-navy">
                  {isAr ? "أجهزة ومعدات الترجمة الفورية للمؤتمرات" : "Conference interpretation equipment (Arabic article)"}
                </Link>
                <Link href="/blog/choose-right-interpreter-conference" className="p-3 rounded-lg border border-gray-100 hover:border-primary-blue hover:bg-blue-50/30 transition-colors block font-bold text-dark-navy">
                  {isAr ? "كيف تختار المترجم الفوري المناسب لمؤتمرك" : "How to choose the right conference interpreter"}
                </Link>
              </div>
            </section>
          </div>

          {/* Quote Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-28">
              <QuoteForm services={[{ slug: "interpretation", name: isAr ? "ترجمة فورية للمؤتمرات" : "Interpretation" }]} />
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
