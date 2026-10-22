import { ChevronDown } from "lucide-react";
import { parseMarkdown } from "@/lib/markdown";
import { serializeJsonLd } from "@/lib/jsonLd";
import { generateFAQJsonLd } from "@/lib/seo";
import type { PageContentUnit } from "@/content/pageContent";

// Strips Markdown syntax so FAQ answers can be used as plain text in JSON-LD.
export function markdownToPlainText(markdown: string): string {
  return markdown
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/\*\*|__|\*|_/g, "")
    .replace(/^\s*[-*]\s+/gm, "")
    .replace(/^\s*#+\s+/gm, "")
    .replace(/\s+/g, " ")
    .trim();
}

export function PageContentFaqJsonLd({ unit }: { unit: PageContentUnit }) {
  if (unit.faqs.length === 0) return null;
  const faqs = unit.faqs.map((f) => ({ question: f.question, answer: markdownToPlainText(f.answer) }));
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: serializeJsonLd(generateFAQJsonLd(faqs)) }}
    />
  );
}

/** The page's single H1 plus the "short answer" box from the editorial content. */
export function PageContentIntro({ unit, isAr }: { unit: PageContentUnit; isAr: boolean }) {
  const answerHtml = unit.shortAnswer ? parseMarkdown(unit.shortAnswer).html : "";
  return (
    <div className="space-y-6">
      <h1 className="text-2xl sm:text-4xl font-black text-dark-navy font-arabic leading-tight">{unit.h1}</h1>
      {answerHtml && (
        <div className="answer-box p-6 sm:p-8">
          <p className="font-bold text-xs text-primary-blue uppercase tracking-wide mb-2">
            {isAr ? "الإجابة المختصرة" : "Short answer"}
          </p>
          <div
            className="[&_p]:mb-0 [&_p]:text-sm [&_p]:font-semibold [&_p]:text-dark-navy"
            dangerouslySetInnerHTML={{ __html: answerHtml }}
          />
        </div>
      )}
    </div>
  );
}

/** The long-form body sections (H2/H3, tables, lists) from the editorial content. */
export function PageContentBody({ unit }: { unit: PageContentUnit }) {
  if (!unit.body) return null;
  const { html } = parseMarkdown(unit.body);
  return <div className="max-w-none" dangerouslySetInnerHTML={{ __html: html }} />;
}

/** The FAQ section from the editorial content, rendered as an accordion. */
export function PageContentFaqs({ unit }: { unit: PageContentUnit }) {
  if (unit.faqs.length === 0) return null;
  return (
    <section>
      <h2 className="text-xl font-bold text-dark-navy mb-6 border-b border-gray-100 pb-3 font-arabic">
        {unit.faqHeading}
      </h2>
      <div className="space-y-4">
        {unit.faqs.map((faq) => (
          <div key={faq.question} className="border border-gray-100 rounded-xl overflow-hidden shadow-sm">
            <details className="group">
              <summary className="flex items-center justify-between gap-4 px-6 py-4 font-bold text-sm text-dark-navy cursor-pointer select-none bg-gray-50/50 list-none">
                <h3 className="font-bold text-sm">{faq.question}</h3>
                <ChevronDown className="h-4 w-4 flex-shrink-0 text-gray-500 transition-transform group-open:rotate-180" />
              </summary>
              <div
                className="px-6 py-4 border-t border-gray-100 [&_p]:mb-0"
                dangerouslySetInnerHTML={{ __html: parseMarkdown(faq.answer).html }}
              />
            </details>
          </div>
        ))}
      </div>
    </section>
  );
}
