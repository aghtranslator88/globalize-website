import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { getBlogPostBySlug, getRawBlogPostBySlug, getFAQs } from "@/lib/data";
import { getSEOHeaders, generateArticleJsonLd, generateFAQJsonLd, generateBreadcrumbJsonLd } from "@/lib/seo";
import { serializeJsonLd } from "@/lib/jsonLd";
import { getSiteUrl } from "@/lib/siteUrl";
import { isGenuineEnglish } from "@/lib/translationDetection";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import QuoteForm from "@/components/QuoteForm";
import TrackedWhatsAppLink from "@/components/TrackedWhatsAppLink";
import { Link } from "@/i18n/routing";

import { Calendar, User, Clock, ChevronDown, Award, HelpCircle, MessageCircle } from "lucide-react";
import type { Metadata } from "next";
import { ALL_BLOG_POSTS } from "@/lib/blog-data";
import { routing } from "@/i18n/routing";
import { parseMarkdown } from "@/lib/markdown";

export const revalidate = 3600;

export async function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    ALL_BLOG_POSTS.map((post) => ({
      locale,
      slug: post.slug,
    }))
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const post = await getBlogPostBySlug(slug, locale);
  if (!post) return {};
  const rawPost = getRawBlogPostBySlug(slug);
  const hasEnglishTranslation = post.hasEnglish;
  const isAr = locale === "ar";
  const metaTitle = (!isAr && rawPost?.seoTitleEn)
    ? rawPost.seoTitleEn
    : ((rawPost as any)?.seoTitleAr || rawPost?.seoTitle || post.title);
  const metaDesc = (!isAr && rawPost?.metaDescriptionEn)
    ? rawPost.metaDescriptionEn
    : ((rawPost as any)?.metaDescriptionAr || rawPost?.metaDescription || post.excerpt);

  return getSEOHeaders(metaTitle, metaDesc, `/blog/${slug}`, true, locale, hasEnglishTranslation);
}


export default async function BlogPostDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const post = await getBlogPostBySlug(slug, locale);
  if (!post) {
    notFound();
  }

  const rawPost = getRawBlogPostBySlug(slug);
  const isAr = locale === "ar";
  const faqs = await getFAQs("blogPost", post.id, locale);
  const rawFaqs = isAr ? rawPost?.faqs : (rawPost?.faqsEn || rawPost?.faqs);
  const faqsList = faqs.length > 0 ? faqs : (rawFaqs?.map((f, i) => ({ id: `faq-${i}`, question: f.question, answer: f.answer, sortOrder: i })) || []);

  const breadcrumbs = [
    { name: isAr ? "الرئيسية" : "Home", url: "/" },
    { name: isAr ? "المدونة" : "Blog", url: "/blog" },
    { name: post.title, url: `/blog/${post.slug}` },
  ];

  const SITE_URL = getSiteUrl();
  const rawBreadcrumb = isAr ? rawPost?.schemas?.breadcrumb : (rawPost?.schemas?.breadcrumbEn || rawPost?.schemas?.breadcrumb);
  const rawArticle = isAr ? rawPost?.schemas?.article : (rawPost?.schemas?.articleEn || rawPost?.schemas?.article);
  const rawFaqSchema = isAr ? rawPost?.schemas?.faq : (rawPost?.schemas?.faqEn || rawPost?.schemas?.faq);

  const breadcrumbJsonLd = rawBreadcrumb || generateBreadcrumbJsonLd(breadcrumbs, locale);
  const articleJsonLd = rawArticle || generateArticleJsonLd({
    title: post.title,
    excerpt: post.excerpt,
    featuredImageUrl: post.featuredImageUrl,
    publishedAt: post.publishedAt,
    updatedAt: post.updatedAt || post.publishedAt,
    url: `${SITE_URL}/${locale}/blog/${slug}`,
    authorName: post.author.name,
  });

  const { html: bodyHtml, headings } = parseMarkdown(post.body);

  const isFaqSchemaMatchingList = (schema: any, list: typeof faqsList) => {
    if (!schema?.mainEntity || !Array.isArray(schema.mainEntity)) return false;
    if (schema.mainEntity.length !== list.length) return false;
    return list.every((item, idx) => schema.mainEntity[idx]?.name === item.question);
  };
  const faqJsonLd = (rawFaqSchema && isFaqSchemaMatchingList(rawFaqSchema, faqsList))
    ? rawFaqSchema
    : generateFAQJsonLd(faqsList);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(articleJsonLd) }}
      />
      {faqsList.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: serializeJsonLd(faqJsonLd) }}
        />
      )}
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

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          {/* Left Sidebar: Table of Contents */}
          <div className="lg:col-span-1 hidden lg:block">
            <div className="sticky top-28 space-y-6">
              <div className="rounded-2xl border border-gray-150 p-6 bg-white shadow-sm">
                <h3 className="font-bold text-xs text-dark-navy border-b border-gray-100 pb-3 mb-4 uppercase tracking-wide">
                  {isAr ? "فهرس المقال" : "Table of Contents"}
                </h3>
                <ul className="space-y-3.5 text-xs text-gray-500">
                  {headings.map((h, i) => (
                    <li
                      key={i}
                      className={`${h.level === 3 ? (isAr ? "pr-4" : "pl-4") : ""} hover:text-primary-blue transition-colors`}
                    >
                      <a href={`#${h.id}`} className="font-medium line-clamp-1 leading-snug">
                        {h.text}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Main Article Content */}
          <div className="lg:col-span-2 space-y-10">
            {/* Article Header */}
            <header className="space-y-4">
              <span className="inline-block text-[9px] font-bold text-primary-blue bg-primary-blue/5 rounded px-2.5 py-1">
                {post.category}
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-dark-navy leading-tight font-arabic">
                {post.title}
              </h1>
              
              {/* Meta */}
              <div className="flex flex-wrap items-center gap-4 text-[10px] text-gray-400 font-semibold border-b border-gray-100 pb-6">
                <div className="flex items-center gap-1.5">
                  <User className="h-4 w-4" />
                  <span className="font-arabic">{post.author.name}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Calendar className="h-4 w-4" />
                  <span>
                    {post.publishedAt.toLocaleDateString(locale, {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="h-4 w-4" />
                  <span>{post.readMinutes} {isAr ? "دقائق قراءة" : "min read"}</span>
                </div>
              </div>
            </header>

            {/* GEO Answer Box */}
            {(rawPost?.geoAnswer || rawPost?.geoAnswerEn) && (
              <div className="bg-primary-blue/5 border border-primary-blue/10 rounded-2xl p-6 mb-8 font-arabic">
                <h4 className="font-bold text-xs text-primary-blue mb-2">
                  {isAr ? "إجابة سريعة وموجزة (GEO Summary)" : "Quick Answer (GEO Summary)"}
                </h4>
                <p className="text-xs sm:text-sm font-semibold text-dark-navy leading-relaxed">
                  {isAr ? rawPost.geoAnswer : (rawPost.geoAnswerEn || post.excerpt)}
                </p>
              </div>
            )}

            {/* Featured Image */}
            {post.featuredImageUrl && (
              <div className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden mb-8 border border-gray-100 shadow-sm bg-gray-50">
                <img
                  src={post.featuredImageUrl}
                  alt={(!isAr && rawPost?.imageMeta?.altTextEn) ? rawPost.imageMeta.altTextEn : (rawPost?.imageMeta?.altText || post.title)}
                  title={(!isAr && rawPost?.imageMeta?.titleTextEn) ? rawPost.imageMeta.titleTextEn : (rawPost?.imageMeta?.titleText || post.title)}
                  className="object-cover w-full h-full"
                  loading="eager"
                  fetchPriority="high"
                  decoding="async"
                />
              </div>
            )}

            {/* Markdown Body Content */}
            <article
              className="prose max-w-none text-xs sm:text-sm text-gray-700 leading-relaxed font-arabic [text-align:justify] [text-justify:inter-word]"
              dangerouslySetInnerHTML={{ __html: bodyHtml }}
            />

            {/* CTA Banner */}
            <div className="bg-gradient-to-r from-dark-navy to-primary-blue rounded-2xl p-6 sm:p-8 text-white text-center shadow-md relative overflow-hidden my-8">
              <div className="relative z-10 space-y-4">
                <h3 className="text-lg sm:text-xl font-bold font-arabic">
                  {isAr ? "اطلب ترجمتك الآن من جلوباليز جروب للترجمة المعتمدة" : "Order Your Certified Translation from Globalize Group Now"}
                </h3>
                <p className="text-[11px] text-gray-200 max-w-md mx-auto leading-relaxed">
                  {isAr 
                    ? "ترجمة دقيقة، سريعة، ومعتمدة بالكامل لدى جميع السفارات والجهات الحكومية في مصر والشرق الأوسط."
                    : "Accurate, fast, and fully certified translation accepted at all embassies and government entities."}
                </p>
                <div className="pt-2">
                  <TrackedWhatsAppLink
                    href={`https://wa.me/201062990808?text=${encodeURIComponent(isAr ? 'أريد الاستفسار عن ترجمة معتمدة' : 'I want to inquire about certified translation')}`}
                    ctaLocation="blog_detail_cta"
                    service={`blog-${post.slug}`}
                    language={locale}
                    className="inline-flex items-center gap-2 rounded-xl bg-whatsapp-green hover:bg-emerald-600 text-white px-6 py-3 text-xs font-bold shadow-md hover:scale-[1.03] transition-transform animate-pulse-glow cursor-pointer"
                  >
                    <MessageCircle className="h-4 w-4" />
                    <span>{isAr ? "تواصل معنا واتساب" : "Contact on WhatsApp"}</span>
                  </TrackedWhatsAppLink>
                </div>

              </div>
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_-20%,rgba(240,217,122,0.15),transparent_70%)] pointer-events-none" />
            </div>

            {/* Author Box */}
            <div className="rounded-2xl border border-gray-150 p-6 bg-white shadow-sm flex flex-col sm:flex-row gap-6">
              <div className="h-14 w-14 rounded-2xl bg-gradient-to-tr from-gold to-yellow-500 text-dark-navy font-bold text-xl flex items-center justify-center flex-shrink-0">
                {post.author.name.charAt(0)}
              </div>
              <div className="space-y-3 flex-grow">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1">
                  <h4 className="font-bold text-xs text-dark-navy font-arabic">{post.author.name}</h4>
                  <span className="text-[9px] font-bold text-primary-blue bg-primary-blue/5 rounded px-2 py-0.5">
                    {post.author.title}
                  </span>
                </div>
                <p className="text-[11px] text-gray-500 leading-relaxed font-arabic">
                  {post.author.bio}
                </p>
                <div className="text-[10px] text-gray-400 font-semibold flex flex-wrap gap-4 pt-2 border-t border-gray-50">
                  <div><strong>{isAr ? "سنوات الخبرة:" : "Experience:"}</strong> {post.author.yearsExperience} {isAr ? "عاماً" : "years"}</div>
                  <div><strong>{isAr ? "التخصص:" : "Specialty:"}</strong> {post.author.languagePair}</div>
                </div>
              </div>
            </div>

            {/* Blog FAQs */}
            {faqsList.length > 0 && (
              <div className="space-y-6">
                <h3 className="font-bold text-sm text-dark-navy border-b border-gray-100 pb-3 flex items-center gap-1.5 font-arabic">
                  <HelpCircle className="h-5 w-5 text-primary-blue" />
                  <span>{isAr ? "أسئلة شائعة متصلة بالموضوع" : "FAQs Related to This Article"}</span>
                </h3>
                <div className="space-y-4">
                  {faqsList.map((faq) => (
                    <div key={faq.id} className="border border-gray-100 rounded-xl overflow-hidden shadow-sm">
                      <details className="group">
                        <summary className="flex items-center justify-between px-6 py-4 font-bold text-xs text-dark-navy cursor-pointer select-none bg-gray-50/50 list-none">
                          <span>{faq.question}</span>
                          <ChevronDown className="h-4 w-4 text-gray-500 transition-transform group-open:rotate-180" />
                        </summary>
                        <div className="px-6 py-4 text-[11px] text-gray-600 leading-relaxed border-t border-gray-100 font-arabic">
                          {faq.answer}
                        </div>
                      </details>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Sidebar: Quote Form */}
          <div className="lg:col-span-1">
            <div className="sticky top-28">
              <QuoteForm />
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
