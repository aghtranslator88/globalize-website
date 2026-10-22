// Enhanced Markdown Parser & TOC Generator with Table, Card Steps, and Safe XSS Sanitization
export function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

// Legacy document slugs referenced inside older article bodies that have no live page.
// Rewriting them at render time keeps internal links pointing at real, indexable URLs
// (no redirects or DB edits needed).
const LEGACY_DOCUMENT_LINKS: Record<string, string> = {
  "certified-birth-certificate": "/documents/birth-certificate",
  "criminal-record-cert": "/documents/police-record",
  "certified-marriage-contract": "/documents/marriage-contract",
  "marriage-certificate": "/documents/marriage-contract",
  "bank-statement": "/blog/bank-statement-certified-translation-visa",
  "commercial-register": "/blog/commercial-register-tax-card-translation",
  "commercial-register-certificate": "/blog/commercial-register-tax-card-translation",
  "tax-card": "/blog/commercial-register-tax-card-translation",
  "power-of-attorney": "/services/legal-translation",
  "single-status-certificate": "/documents",
};

export function normalizeInternalHref(href: string): string {
  const match = href.match(/^((?:https?:\/\/(?:www\.)?globalizetl\.com)?\/(ar|en))\/documents\/([a-z0-9-]+)\/?((?:[?#].*)?)$/i);
  if (!match) return href;
  const target = LEGACY_DOCUMENT_LINKS[match[3].toLowerCase()];
  return target ? `/${match[2]}${target}${match[4] || ""}` : href;
}

export function parseMarkdown(markdown: string) {
  const headings: { id: string; text: string; level: number }[] = [];
  const lines = markdown.split("\n");
  const output: string[] = [];
  let i = 0;

  function inlineFormat(text: string): string {
    // 1. Sanitize raw HTML characters first to prevent XSS
    const sanitized = escapeHtml(text);

    // 2. Format legitimate Markdown tokens (bold, italics, safe links)
    return sanitized
      .replace(/\*\*(.*?)\*\*/g, "<strong class='font-bold text-dark-navy'>$1</strong>")
      .replace(/\*(.*?)\*/g, "<em class='italic'>$1</em>")
      .replace(/\[([^\]]+)\]\(((?:[^()]+|\([^()]*\))*)\)/g, (match, linkText, href) => {
        const cleanHref = normalizeInternalHref(href.trim());
        // Prevent javascript:, data:, vbscript: pseudo-protocols
        const isSafeProtocol = /^(https?:\/\/|\/|#|mailto:)/i.test(cleanHref);
        if (!isSafeProtocol) {
          return linkText;
        }
        const isInternal = cleanHref.startsWith("/") || cleanHref.startsWith("#") || cleanHref.includes("globalizetl.com");
        if (isInternal) {
          return `<a href='${cleanHref}' class='text-primary-blue hover:underline font-bold transition-colors'>${linkText}</a>`;
        }
        return `<a href='${cleanHref}' class='text-primary-blue hover:underline font-bold transition-colors' target='_blank' rel='noopener noreferrer'>${linkText}</a>`;
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

        const tableHtml = `
<div class="overflow-x-auto my-8 rounded-2xl border border-gray-200 bg-white shadow-xs">
  <table class="min-w-full text-xs text-start border-collapse divide-y divide-gray-200">
    <thead class="bg-gray-100/90 text-dark-navy">
      <tr>
        ${headerRow
          .map(
            (h) =>
              `<th class="px-5 py-3.5 text-xs font-bold text-dark-navy font-arabic tracking-wide border-b border-gray-200 text-start">${inlineFormat(
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
<div class="my-6 p-5 rounded-2xl bg-amber-500/10 border-s-4 border-amber-500 text-dark-navy font-arabic text-xs sm:text-sm leading-relaxed [text-align:justify] [text-justify:inter-word] shadow-xs">
  ${inlineFormat(quoteLines.join(" "))}
</div>`;
      output.push(quoteHtml);
      continue;
    }

    // 3. Headings: #, ##, ###
    const headingMatch = trimmed.match(/^(#{1,6})\s+(.+)$/);
    if (headingMatch) {
      // The page template already renders the post title as the single <h1>;
      // demote any "# " heading inside the body to <h2> to avoid duplicate H1s.
      const level = Math.max(2, headingMatch[1].length);
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
