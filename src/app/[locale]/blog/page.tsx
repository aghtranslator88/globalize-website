import { setRequestLocale } from "next-intl/server";
import { getBlogPosts } from "@/lib/data";
import { getSEOHeaders, generateBreadcrumbJsonLd } from "@/lib/seo";
import { serializeJsonLd } from "@/lib/jsonLd";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BlogList from "@/components/BlogList";
import { Link } from "@/i18n/routing";
import type { Metadata } from "next";

export const revalidate = 3600;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const title = locale === "ar"
    ? "أدلة الترجمة المعتمدة وأوراق السفارات | مدونة جلوباليز جروب"
    : "Certified Translation & Embassy Document Guides | Globalize Group Blog";
  const description = locale === "ar"
    ? "أدلة عملية عن الترجمة المعتمدة في مصر: أسعار الصفحة، أوراق السفارات والتأشيرات مثل ألمافيفا إيطاليا، ترجمة الفيش الجنائي وشهادات الميلاد والشهادات الجامعية، وتصديق الخارجية."
    : "Practical guides to certified translation in Egypt: per-page pricing, embassy and visa paperwork such as Almaviva Italy, police records, birth and university certificates, and MOFA legalization.";
  return getSEOHeaders(title, description, "/blog", true, locale);
}

export default async function BlogPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const posts = await getBlogPosts(locale);
  const isAr = locale === "ar";

  const breadcrumbs = [
    { name: isAr ? "الرئيسية" : "Home", url: "/" },
    { name: isAr ? "المدونة والتقارير" : "Our Blog", url: "/blog" },
  ];

  const breadcrumbJsonLd = generateBreadcrumbJsonLd(breadcrumbs, locale);

  // Serialize posts for safe React 19 / client-component injection
  const serializedPosts = posts.map((p) => ({
    id: p.id,
    title: p.title,
    slug: p.slug,
    excerpt: p.excerpt,
    category: p.category,
    featuredImageUrl: p.featuredImageUrl,
    publishedAt: p.publishedAt.toISOString(),
    readMinutes: p.readMinutes,
    author: {
      name: p.author.name,
      title: p.author.title,
    },
  }));

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(breadcrumbJsonLd) }}
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
            {isAr ? "مدونة جلوباليز جروب اللغوية" : "Globalize Group Translation Blog"}
          </h1>
          <p className="text-gray-500 text-xs sm:text-sm max-w-2xl mx-auto leading-relaxed">
            {isAr
              ? "دليلك الموثوق لمعرفة شروط اعتماد السفارات وتصديقات الأوراق الرسمية، وأحدث استراتيجيات التوطين الرقمي."
              : "Your trusted guide to understanding embassy requirements, MOFA stamps, and digital localization strategies."}
          </p>
        </div>

        {/* Blog Search & List */}
        <BlogList posts={serializedPosts} />
      </main>

      <Footer />
    </>
  );
}
