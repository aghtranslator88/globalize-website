import { setRequestLocale } from "next-intl/server";
import { getGovEntities } from "@/lib/data";
import { getSEOHeaders, generateBreadcrumbJsonLd } from "@/lib/seo";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Link } from "@/i18n/routing";
import { Landmark } from "lucide-react";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const title = locale === "ar" ? "الترجمة المعتمدة للهيئات والمؤسسات الحكومية" : "Certified Translation for Gov Entities";
  const description = locale === "ar"
    ? "قائمة بالجهات والمؤسسات الحكومية بمصر والوطن العربي المعتمد لديها خدماتنا من وثائق وترجمات رسمية."
    : "List of government entities and institutions accepting our certified translations in Egypt and the region.";
  return getSEOHeaders(title, description, "/government", true, locale);
}

export default async function GovernmentPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const govEntities = await getGovEntities(locale);
  const isAr = locale === "ar";

  const breadcrumbs = [
    { name: isAr ? "الرئيسية" : "Home", url: "/" },
    { name: isAr ? "الهيئات الحكومية المعتمدة" : "Accepted Gov Entities", url: "/government" },
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
            {isAr ? "الترجمة المعتمدة للهيئات والمؤسسات الحكومية" : "Certified Translation for Gov Entities"}
          </h1>
          <p className="text-gray-500 text-xs sm:text-sm max-w-2xl mx-auto leading-relaxed">
            {isAr
              ? "نقدم ترجمات معتمدة ورسمية ومطابقة تماماً للأصل، مقبولة أمام الوزارات والجهات الحكومية والنيابات والمحاكم ومصلحة الشهر العقاري بمصر والخليج."
              : "We provide certified translation officially accepted by ministries, state authorities, courts, and notary public offices in Egypt and GCC."}
          </p>
        </div>

        {/* Gov Entities Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {govEntities.map((gov) => (
            <Link
              key={gov.slug}
              href={`/government/${gov.slug}`}
              className="rounded-xl border border-gray-150 p-6 bg-white hover-lift flex items-center justify-between"
            >
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-lg bg-primary-blue/10 text-primary-blue flex items-center justify-center flex-shrink-0">
                  <Landmark className="h-5 w-5" />
                </div>
                <div className="flex flex-col">
                  <h3 className="font-bold text-xs text-dark-navy hover:text-primary-blue transition-colors">
                    {gov.name}
                  </h3>
                  <span className="text-[9px] text-gray-400 font-semibold mt-0.5">
                    {gov.indexable 
                      ? (isAr ? "متطلبات كاملة ✓" : "Fully filled Requirements ✓")
                      : (isAr ? "ترجمة رسمية" : "Official Translation")}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>

      <Footer />
    </>
  );
}
