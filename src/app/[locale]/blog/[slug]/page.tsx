import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { getBlogPostBySlug, getRawBlogPostBySlug, getFAQs } from "@/lib/data";
import { getSEOHeaders, generateArticleJsonLd, generateFAQJsonLd, generateBreadcrumbJsonLd } from "@/lib/seo";
import { getSiteUrl } from "@/lib/siteUrl";
import { isGenuineEnglish } from "@/lib/translationDetection";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import QuoteForm from "@/components/QuoteForm";
import { Link } from "@/i18n/routing";
import { Calendar, User, Clock, ChevronDown, Award, HelpCircle, MessageCircle } from "lucide-react";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const post = await getBlogPostBySlug(slug, locale);
  if (!post) return {};
  const rawPost = getRawBlogPostBySlug(slug);
  const hasEnglishTranslation = isGenuineEnglish(post.title, post.body);
  const isAr = locale === "ar";
  const metaTitle = (!isAr && rawPost?.seoTitleEn) ? rawPost.seoTitleEn : post.title;
  const metaDesc = (!isAr && rawPost?.metaDescriptionEn) ? rawPost.metaDescriptionEn : post.excerpt;
  return getSEOHeaders(metaTitle, metaDesc, `/blog/${slug}`, true, locale, hasEnglishTranslation);
}

// Enhanced Markdown Parser & TOC Generator with Table, Card Steps, and Full Justified Typography
function parseMarkdown(markdown: string) {
  const headings: { id: string; text: string; level: number }[] = [];
  const lines = markdown.split("\n");
  const output: string[] = [];
  let i = 0;

  function inlineFormat(text: string): string {
    return text
      .replace(/\*\*(.*?)\*\*/g, "<strong class='font-bold text-dark-navy'>$1</strong>")
      .replace(/\*(.*?)\*/g, "<em class='italic'>$1</em>")
      .replace(/\[(.*?)\]\((.*?)\)/g, (match, text, href) => {
        const isInternal = href.startsWith("/") || href.startsWith("#") || href.includes("globalizetl.com");
        if (isInternal) {
          return `<a href='${href}' class='text-primary-blue hover:underline font-bold transition-colors'>${text}</a>`;
        }
        return `<a href='${href}' class='text-primary-blue hover:underline font-bold transition-colors' target='_blank' rel='noopener noreferrer'>${text}</a>`;
      });
  }

  while (i < lines.length) {
    const rawLine = lines[i];
    const trimmed = rawLine.trim();

    if (!trimmed) {
      i++;
      continue;
    }

    // 0. Fenced Code Blocks / Mermaid Process Flow Check (```)
    if (trimmed.startsWith("```")) {
      const codeLines: string[] = [];
      i++;
      while (i < lines.length && !lines[i].trim().startsWith("```")) {
        codeLines.push(lines[i]);
        i++;
      }
      if (i < lines.length) i++; // skip closing ```
      
      const fullBlock = codeLines.join("\n");
      if (trimmed.includes("mermaid") || fullBlock.includes("graph TD") || fullBlock.includes("graph LR") || fullBlock.includes("-->")) {
        const stepMatches = fullBlock.match(/["']([^"']+)["']/g);
        const steps: string[] = [];
        if (stepMatches) {
          stepMatches.forEach(m => {
            const clean = m.slice(1, -1).trim();
            if (clean && !steps.includes(clean)) steps.push(clean);
          });
        }
        if (steps.length > 0) {
          const flowHtml = `
<div class="my-8 p-6 rounded-2xl bg-gradient-to-br from-blue-50/80 via-slate-50 to-blue-50/40 border border-blue-100 shadow-xs font-arabic">
  <div class="text-xs font-bold text-primary-blue mb-4 flex items-center gap-2">
    <span class="h-2 w-2 rounded-full bg-primary-blue animate-pulse"></span>
    <span>مخطط تسلسل الخطوات والإجراءات المعتمدة:</span>
  </div>
  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
    ${steps.map((step, sIdx) => `
      <div class="flex items-start gap-3 bg-white p-4 rounded-xl border border-blue-100 shadow-xs">
        <span class="flex-shrink-0 h-6 w-6 rounded-lg bg-primary-blue text-white flex items-center justify-center text-[10px] font-black">${sIdx + 1}</span>
        <div class="text-xs font-semibold text-dark-navy leading-relaxed">${inlineFormat(step.replace(/^\d+\.\s*/, ''))}</div>
      </div>
    `).join('')}
  </div>
</div>`;
          output.push(flowHtml);
          continue;
        }
      }
      continue;
    }

    // 1. Markdown Table Check (starts and ends with | or contains | separators)
    if (trimmed.startsWith("|") && trimmed.endsWith("|")) {
      const tableLines: string[] = [];
      while (i < lines.length && lines[i].trim().startsWith("|") && lines[i].trim().endsWith("|")) {
        tableLines.push(lines[i].trim());
        i++;
      }

      if (tableLines.length >= 2) {
        const headerRow = tableLines[0]
          .slice(1, -1)
          .split("|")
          .map((c) => c.trim());

        // Check if row 1 is delimiter row e.g. |---|---|---|
        let startIndex = 1;
        if (tableLines[1] && tableLines[1].replace(/[\s\-\|\:]/g, "").length === 0) {
          startIndex = 2;
        }

        const bodyRows = tableLines.slice(startIndex).map((rowStr) =>
          rowStr
            .slice(1, -1)
            .split("|")
            .map((c) => c.trim())
        );

        let tableHtml = `
<div class="overflow-x-auto my-8 rounded-2xl border border-gray-200 bg-white shadow-xs">
  <table class="min-w-full text-xs text-right border-collapse divide-y divide-gray-200">
    <thead class="bg-gray-100/90 text-dark-navy">
      <tr>
        ${headerRow
          .map(
            (h) =>
              `<th class="px-5 py-3.5 text-xs font-bold text-dark-navy font-arabic tracking-wide border-b border-gray-200 text-right">${inlineFormat(
                h
              )}</th>`
          )
          .join("")}
      </tr>
    </thead>
    <tbody class="divide-y divide-gray-100 bg-white font-arabic">
      ${bodyRows
        .map(
          (row, rIdx) => `
        <tr class="hover:bg-blue-50/40 transition-colors ${
          rIdx % 2 === 1 ? "bg-gray-50/40" : "bg-white"
        }">
          ${row
            .map(
              (cell, cIdx) =>
                `<td class="px-5 py-4 text-xs text-gray-700 leading-relaxed [text-align:justify] [text-justify:inter-word] ${
                  cIdx === 0 ? "font-bold text-dark-navy whitespace-nowrap" : ""
                }">${inlineFormat(cell)}</td>`
            )
            .join("")}
        </tr>`
        )
        .join("")}
    </tbody>
  </table>
</div>`;
        output.push(tableHtml);
        continue;
      }
    }

    // 2. Blockquotes / Alerts (> Quote)
    if (trimmed.startsWith("> ")) {
      const quoteLines: string[] = [];
      while (i < lines.length && lines[i].trim().startsWith(">")) {
        quoteLines.push(lines[i].trim().replace(/^>\s*/, ""));
        i++;
      }
      const quoteHtml = `
<div class="my-6 p-5 rounded-2xl bg-amber-500/10 border-r-4 border-amber-500 text-dark-navy font-arabic text-xs sm:text-sm leading-relaxed [text-align:justify] [text-justify:inter-word] shadow-xs">
  ${inlineFormat(quoteLines.join(" "))}
</div>`;
      output.push(quoteHtml);
      continue;
    }

    // 3. Headings: #, ##, ###
    const headingMatch = trimmed.match(/^(#{1,6})\s+(.+)$/);
    if (headingMatch) {
      const level = headingMatch[1].length;
      const rawText = headingMatch[2].trim();
      const text = rawText.replace(/\*\*|__/g, "");
      const id = text
        .toLowerCase()
        .replace(/[^a-z0-9\u0600-\u06FF]+/g, "-")
        .replace(/^-+|-+$/g, "");

      headings.push({ id, text, level });

      const headingClasses =
        level === 2
          ? "text-lg sm:text-xl font-black text-dark-navy mt-10 mb-5 border-b border-gray-150 pb-3 font-arabic"
          : "text-sm sm:text-base font-bold text-dark-navy mt-7 mb-3 font-arabic";

      output.push(`<h${level} id="${id}" class="${headingClasses}">${inlineFormat(rawText)}</h${level}>`);
      i++;
      continue;
    }

    // 4. Numbered List: 1. Item
    if (/^\d+\.\s+/.test(trimmed)) {
      const stepItems: string[] = [];
      while (i < lines.length && /^\d+\.\s+/.test(lines[i].trim())) {
        let stepText = lines[i].trim().replace(/^\d+\.\s+/, "");
        i++;
        // Collect following lines that belong to this step
        while (
          i < lines.length &&
          lines[i].trim() &&
          !/^\d+\.\s+/.test(lines[i].trim()) &&
          !lines[i].trim().startsWith("- ") &&
          !lines[i].trim().startsWith("* ") &&
          !lines[i].trim().startsWith("#") &&
          !lines[i].trim().startsWith("|")
        ) {
          stepText += " " + lines[i].trim();
          i++;
        }
        stepItems.push(stepText);
      }
      const stepsHtml = `
<div class="space-y-3.5 my-7 font-arabic">
  ${stepItems
    .map(
      (item, sIdx) => `
    <div class="flex items-start gap-4 bg-gradient-to-r from-blue-50/60 to-slate-50/50 hover:from-blue-50 p-4 sm:p-5 rounded-2xl border border-blue-100 shadow-xs transition-all">
      <span class="flex-shrink-0 h-7 w-7 rounded-xl bg-primary-blue text-white flex items-center justify-center text-xs font-black shadow-xs mt-0.5">${sIdx + 1}</span>
      <div class="text-xs sm:text-sm text-gray-700 leading-relaxed [text-align:justify] [text-justify:inter-word] flex-1">
        ${inlineFormat(item)}
      </div>
    </div>`
    )
    .join("")}
</div>`;
      output.push(stepsHtml);
      continue;
    }

    // 5. Bullet List: - Item or * Item
    if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
      const listItems: string[] = [];
      while (i < lines.length && (lines[i].trim().startsWith("- ") || lines[i].trim().startsWith("* "))) {
        let bulletText = lines[i].trim().substring(2);
        i++;
        while (
          i < lines.length &&
          lines[i].trim() &&
          !lines[i].trim().startsWith("- ") &&
          !lines[i].trim().startsWith("* ") &&
          !/^\d+\.\s+/.test(lines[i].trim()) &&
          !lines[i].trim().startsWith("#") &&
          !lines[i].trim().startsWith("|")
        ) {
          bulletText += " " + lines[i].trim();
          i++;
        }
        listItems.push(bulletText);
      }
      const listHtml = `
<div class="space-y-3 my-6 font-arabic">
  ${listItems
    .map(
      (item) => `
    <div class="flex items-start gap-3.5 bg-gray-50/70 hover:bg-gray-50 p-4 rounded-xl border border-gray-150 shadow-xs transition-all">
      <span class="flex-shrink-0 h-2.5 w-2.5 rounded-full bg-primary-blue mt-1.5 shadow-xs"></span>
      <div class="text-xs sm:text-sm text-gray-700 leading-relaxed [text-align:justify] [text-justify:inter-word] flex-1">
        ${inlineFormat(item)}
      </div>
    </div>`
    )
    .join("")}
</div>`;
      output.push(listHtml);
      continue;
    }

    // 6. Normal paragraph (with full text justification - Ctrl + J)
    output.push(`<p class="text-xs sm:text-sm text-gray-700 leading-relaxed mb-5 font-arabic [text-align:justify] [text-justify:inter-word]">${inlineFormat(trimmed)}</p>`);
    i++;
  }

  return {
    html: output.join("\n"),
    headings,
  };
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

  const breadcrumbJsonLd = rawBreadcrumb || generateBreadcrumbJsonLd(breadcrumbs);
  const articleJsonLd = rawArticle || generateArticleJsonLd({
    title: post.title,
    excerpt: post.excerpt,
    featuredImageUrl: post.featuredImageUrl,
    publishedAt: post.publishedAt,
    updatedAt: post.publishedAt,
    url: `${SITE_URL}/${locale}/blog/${slug}`,
    authorName: post.author.name,
  });

  const { html: bodyHtml, headings } = parseMarkdown(post.body);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      {faqsList.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(rawFaqSchema || generateFAQJsonLd(faqsList)) }}
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
                  loading="lazy"
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
                  <a
                    href={`https://wa.me/201062990808?text=${encodeURIComponent(isAr ? 'أريد الاستفسار عن ترجمة معتمدة' : 'I want to inquire about certified translation')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-xl bg-whatsapp-green hover:bg-emerald-600 text-white px-6 py-3 text-xs font-bold shadow-md hover:scale-[1.03] transition-transform animate-pulse-glow"
                  >
                    <MessageCircle className="h-4 w-4" />
                    <span>{isAr ? "تواصل معنا واتساب" : "Contact on WhatsApp"}</span>
                  </a>
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
