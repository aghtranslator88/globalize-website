import type { BlogPostItem } from "@/lib/blog-data";
import { GUIDE_CONTENT, type GuideContentKey, type PageContentUnit } from "@/content/pageContent";

// Bilingual service guides and buyer guides from the editorial content package
// (content/guides/{ar,en}/*.md), published as blog posts.

const AUTHOR: BlogPostItem["author"] = {
  id: "team-001",
  name: "جلوباليز جروب للترجمة المعتمدة",
  nameEn: "Globalize Group Translation Team",
  title: "فريق الترجمة والمراجعة",
  titleEn: "Translation and Review Team",
  photoUrl: "/logo-icon.png",
  bio: "فريق من المترجمين والمراجعين والمتخصصين حسب المجال لدى جلوباليز جروب.",
  bioEn: "Globalize Group's translators, reviewers, and subject specialists.",
};

interface GuideMeta {
  key: GuideContentKey;
  slug: string;
  category: string;
  categoryEn: string;
  primaryKeyword: string;
  secondaryKeywords: string[];
  publishedAt: string;
  readMinutes: number;
}

const GUIDES: GuideMeta[] = [
  {
    key: "academic-scientific-translation",
    slug: "academic-scientific-translation",
    category: "ترجمة أكاديمية وعلمية",
    categoryEn: "Academic & Scientific Translation",
    primaryKeyword: "ترجمة أكاديمية وعلمية",
    secondaryKeywords: ["ترجمة الأبحاث العلمية", "ترجمة الشهادات الدراسية", "academic translation"],
    publishedAt: "2026-10-22T09:00:00.000Z",
    readMinutes: 7,
  },
  {
    key: "business-financial-translation",
    slug: "business-financial-translation",
    category: "ترجمة تجارية ومالية",
    categoryEn: "Business & Financial Translation",
    primaryKeyword: "ترجمة مالية وتجارية",
    secondaryKeywords: ["ترجمة القوائم المالية", "ترجمة مستندات الشركات", "financial translation"],
    publishedAt: "2026-10-22T09:30:00.000Z",
    readMinutes: 7,
  },
  {
    key: "technical-translation",
    slug: "technical-translation-services",
    category: "ترجمة تقنية",
    categoryEn: "Technical Translation",
    primaryKeyword: "ترجمة تقنية",
    secondaryKeywords: ["ترجمة الأدلة الفنية", "ترجمة الكتالوجات", "technical translation"],
    publishedAt: "2026-10-22T10:00:00.000Z",
    readMinutes: 7,
  },
  {
    key: "subtitling",
    slug: "video-subtitling-services",
    category: "ترجمة الفيديو",
    categoryEn: "Subtitling",
    primaryKeyword: "ترجمة الفيديو والترجمة النصية",
    secondaryKeywords: ["ترجمة الفيديوهات", "subtitling", "ترجمة نصية للفيديو"],
    publishedAt: "2026-10-22T10:30:00.000Z",
    readMinutes: 7,
  },
  {
    key: "ai-assisted-translation",
    slug: "ai-assisted-translation-human-review",
    category: "الترجمة والتقنية",
    categoryEn: "Translation & Technology",
    primaryKeyword: "الترجمة بالذكاء الاصطناعي مع مراجعة بشرية",
    secondaryKeywords: ["الترجمة الآلية", "مراجعة الترجمة الآلية", "AI translation"],
    publishedAt: "2026-10-22T11:00:00.000Z",
    readMinutes: 7,
  },
  {
    key: "choosing-a-translation-provider",
    slug: "how-to-choose-translation-provider",
    category: "أدلة إرشادية",
    categoryEn: "Guides",
    primaryKeyword: "كيف تختار مكتب ترجمة معتمد",
    secondaryKeywords: ["اختيار مكتب ترجمة", "مكتب ترجمة معتمد", "translation provider"],
    publishedAt: "2026-10-22T11:30:00.000Z",
    readMinutes: 8,
  },
  {
    key: "preparing-a-translation-brief",
    slug: "how-to-prepare-translation-brief",
    category: "أدلة إرشادية",
    categoryEn: "Guides",
    primaryKeyword: "تجهيز طلب الترجمة",
    secondaryKeywords: ["موجز الترجمة", "طلب عرض سعر ترجمة", "translation brief"],
    publishedAt: "2026-10-22T12:00:00.000Z",
    readMinutes: 7,
  },
];

function plain(markdown: string): string {
  return markdown
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/\*\*|__/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function excerptOf(unit: PageContentUnit): string {
  const source = unit.shortAnswer || unit.body.split("\n").find((l) => l.trim() && !l.startsWith("#")) || "";
  const text = plain(source);
  return text.length > 220 ? `${text.slice(0, 217).replace(/\s+\S*$/, "")}…` : text;
}

function toPost(meta: GuideMeta): BlogPostItem {
  const ar = GUIDE_CONTENT[meta.key].ar;
  const en = GUIDE_CONTENT[meta.key].en;
  const image = `/images/blog/guides/${meta.slug}.svg`;
  return {
    id: `blog-${meta.slug}`,
    title: ar.h1,
    titleEn: en.h1,
    slug: meta.slug,
    seoTitle: ar.seoTitle,
    seoTitleEn: en.seoTitle,
    metaDescription: ar.metaDescription,
    metaDescriptionEn: en.metaDescription,
    excerpt: excerptOf(ar),
    excerptEn: excerptOf(en),
    body: ar.body,
    bodyEn: en.body,
    primaryKeyword: meta.primaryKeyword,
    secondaryKeywords: meta.secondaryKeywords,
    category: meta.category,
    categoryEn: meta.categoryEn,
    featuredImageUrl: image,
    imageMeta: {
      imageFilename: `${meta.slug}.svg`,
      imagePath: image,
      altText: ar.h1,
      altTextEn: en.h1,
      titleText: ar.h1,
      titleTextEn: en.h1,
      caption: ar.h1,
      captionEn: en.h1,
      primaryKeyword: meta.primaryKeyword,
      relatedArticleSlug: meta.slug,
    },
    publishedAt: meta.publishedAt,
    readMinutes: meta.readMinutes,
    geoAnswer: plain(ar.shortAnswer),
    geoAnswerEn: en.shortAnswer ? plain(en.shortAnswer) : undefined,
    faqs: ar.faqs.map((f) => ({ question: f.question, answer: plain(f.answer) })),
    faqsEn: en.faqs.map((f) => ({ question: f.question, answer: plain(f.answer) })),
    author: AUTHOR,
  };
}

export const GUIDE_BLOG_POSTS: BlogPostItem[] = GUIDES.map(toPost);
