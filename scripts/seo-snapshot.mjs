import fs from 'node:fs';
import path from 'node:path';

// Decode basic HTML entities
function decodeHtmlEntities(str) {
  if (!str) return '';
  return str
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/&#x([0-9a-fA-F]+);/g, (_, hex) => String.fromCharCode(parseInt(hex, 16)))
    .replace(/&#(\d+);/g, (_, dec) => String.fromCharCode(parseInt(dec, 10)));
}

function stripTags(html) {
  if (!html) return '';
  return decodeHtmlEntities(html.replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ').trim();
}

function extractAllTypes(obj, types = []) {
  if (!obj || typeof obj !== 'object') return types;
  if (Array.isArray(obj)) {
    for (const item of obj) extractAllTypes(item, types);
    return types;
  }
  if (obj['@type']) {
    if (Array.isArray(obj['@type'])) {
      types.push(...obj['@type']);
    } else {
      types.push(obj['@type']);
    }
  }
  for (const key of Object.keys(obj)) {
    if (typeof obj[key] === 'object') {
      extractAllTypes(obj[key], types);
    }
  }
  return types;
}

export async function snapshotPath(baseUrl, urlPath) {
  const fullUrl = `${baseUrl.replace(/\/$/, '')}${urlPath}`;
  try {
    const res = await fetch(fullUrl, {
      redirect: 'manual',
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; GlobalizeSeoSnapshot/1.0)',
      },
    });

    const status = res.status;
    if (status >= 300 && status < 400) {
      return {
        path: urlPath,
        status,
        location: res.headers.get('location'),
      };
    }

    if (status === 404) {
      return {
        path: urlPath,
        status,
      };
    }

    const html = await res.text();

    // 1. <title>
    const titleMatch = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
    const title = titleMatch ? stripTags(titleMatch[1]) : null;

    // 2. meta description
    const descMatch =
      html.match(/<meta[^>]+name=["']description["'][^>]+content=["']([\s\S]*?)["']/i) ||
      html.match(/<meta[^>]+content=["']([\s\S]*?)["'][^>]+name=["']description["']/i);
    const description = descMatch ? decodeHtmlEntities(descMatch[1]).trim() : null;

    // 3. meta robots
    const robotsMatch =
      html.match(/<meta[^>]+name=["']robots["'][^>]+content=["']([\s\S]*?)["']/i) ||
      html.match(/<meta[^>]+content=["']([\s\S]*?)["'][^>]+name=["']robots["']/i);
    const robots = robotsMatch ? robotsMatch[1].trim() : null;

    // 4. canonical href
    const canonicalMatch =
      html.match(/<link[^>]+rel=["']canonical["'][^>]+href=["']([\s\S]*?)["']/i) ||
      html.match(/<link[^>]+href=["']([\s\S]*?)["'][^>]+rel=["']canonical["']/i);
    const canonical = canonicalMatch ? canonicalMatch[1].trim() : null;

    // 5. ALL hreflang alternates (sorted by hreflang)
    const hreflangRegex = /<link[^>]+rel=["']alternate["'][^>]+hreflang=["']([^"']+)["'][^>]+href=["']([^"']+)["']/gi;
    const hreflangRegexRev = /<link[^>]+hreflang=["']([^"']+)["'][^>]+href=["']([^"']+)["'][^>]+rel=["']alternate["']/gi;
    const hreflangRegexHrefFirst = /<link[^>]+rel=["']alternate["'][^>]+href=["']([^"']+)["'][^>]+hreflang=["']([^"']+)["']/gi;
    const alternatesMap = new Map();

    for (const match of html.matchAll(hreflangRegex)) {
      alternatesMap.set(match[1].toLowerCase(), match[2]);
    }
    for (const match of html.matchAll(hreflangRegexRev)) {
      alternatesMap.set(match[1].toLowerCase(), match[2]);
    }
    for (const match of html.matchAll(hreflangRegexHrefFirst)) {
      alternatesMap.set(match[2].toLowerCase(), match[1]);
    }

    const alternates = Array.from(alternatesMap.entries())
      .map(([hreflang, href]) => ({ hreflang, href }))
      .sort((a, b) => a.hreflang.localeCompare(b.hreflang));

    // 6. og:url
    const ogUrlMatch =
      html.match(/<meta[^>]+property=["']og:url["'][^>]+content=["']([\s\S]*?)["']/i) ||
      html.match(/<meta[^>]+content=["']([\s\S]*?)["'][^>]+property=["']og:url["']/i);
    const ogUrl = ogUrlMatch ? ogUrlMatch[1].trim() : null;

    // 7. parsed JSON-LD blocks
    const jsonLdBlocks = [];
    const jsonLdTypes = [];
    const jsonLdRegex = /<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
    for (const match of html.matchAll(jsonLdRegex)) {
      try {
        const rawJson = match[1].trim();
        const parsed = JSON.parse(rawJson);
        jsonLdBlocks.push(parsed);
        const types = extractAllTypes(parsed);
        jsonLdTypes.push(...types);
      } catch (err) {
        jsonLdBlocks.push({ error: 'JSON_PARSE_ERROR', raw: match[1].slice(0, 100) });
      }
    }

    // 8. H1 text(s)
    const h1s = [];
    const h1Regex = /<h1[^>]*>([\s\S]*?)<\/h1>/gi;
    for (const match of html.matchAll(h1Regex)) {
      h1s.push(stripTags(match[1]));
    }

    // 9. visible FAQ question texts
    // Look for <summary ...><span>question</span> or <summary ...>question</summary>
    const faqs = [];
    const summaryRegex = /<summary[^>]*>([\s\S]*?)<\/summary>/gi;
    for (const match of html.matchAll(summaryRegex)) {
      // Strip SVG icons if any
      const cleaned = match[1].replace(/<svg[\s\S]*?<\/svg>/gi, '');
      const text = stripTags(cleaned);
      if (text) faqs.push(text);
    }

    // 10. text word-count of <main>
    const mainMatch = html.match(/<main[^>]*>([\s\S]*?)<\/main>/i);
    let mainWordCount = 0;
    if (mainMatch) {
      // remove script, style, svg tags from main
      const cleanMain = mainMatch[1]
        .replace(/<script[\s\S]*?<\/script>/gi, '')
        .replace(/<style[\s\S]*?<\/style>/gi, '')
        .replace(/<svg[\s\S]*?<\/svg>/gi, '');
      const mainText = stripTags(cleanMain);
      const words = mainText ? mainText.split(/\s+/).filter(Boolean) : [];
      mainWordCount = words.length;
    }

    return {
      path: urlPath,
      status,
      title,
      description,
      robots,
      canonical,
      alternates,
      ogUrl,
      jsonLdTypes: Array.from(new Set(jsonLdTypes)),
      jsonLdBlocks,
      h1s,
      faqs,
      mainWordCount,
    };
  } catch (error) {
    return {
      path: urlPath,
      error: error.message,
    };
  }
}

export async function snapshotSitemap(baseUrl) {
  const url = `${baseUrl.replace(/\/$/, '')}/sitemap.xml`;
  try {
    const res = await fetch(url);
    if (!res.ok) return { error: `HTTP ${res.status}` };
    const xml = await res.text();

    const urls = [];
    const urlBlockRegex = /<url>([\s\S]*?)<\/url>/gi;
    for (const match of xml.matchAll(urlBlockRegex)) {
      const block = match[1];
      const locMatch = block.match(/<loc>(.*?)<\/loc>/i);
      const loc = locMatch ? locMatch[1].trim() : null;

      const alternates = [];
      const altRegex = /<xhtml:link[^>]+rel=["']alternate["'][^>]+hreflang=["']([^"']+)["'][^>]+href=["']([^"']+)["']/gi;
      const altRegexHrefFirst = /<xhtml:link[^>]+href=["']([^"']+)["'][^>]+hreflang=["']([^"']+)["']/gi;

      for (const alt of block.matchAll(altRegex)) {
        alternates.push({ hreflang: alt[1], href: alt[2] });
      }
      if (alternates.length === 0) {
        for (const alt of block.matchAll(altRegexHrefFirst)) {
          alternates.push({ hreflang: alt[2], href: alt[1] });
        }
      }
      alternates.sort((a, b) => a.hreflang.localeCompare(b.hreflang));

      if (loc) {
        urls.push({ loc, alternates });
      }
    }
    return { count: urls.length, urls };
  } catch (err) {
    return { error: err.message };
  }
}

export async function snapshotRobots(baseUrl) {
  const url = `${baseUrl.replace(/\/$/, '')}/robots.txt`;
  try {
    const res = await fetch(url);
    return await res.text();
  } catch (err) {
    return `Error fetching robots.txt: ${err.message}`;
  }
}

export const AUDIT_PATHS = [
  // Homepage & Core
  '/ar',
  '/en',
  '/ar/certified',
  '/en/certified',
  '/ar/localization',
  '/ar/interpretation',
  '/ar/services/legal-translation',
  '/en/services/legal-translation',
  '/ar/services/medical-translation',
  '/ar/documents',
  '/ar/documents/birth-certificate',
  '/en/documents/birth-certificate',

  // Embassies (Index + 3 details: at least one Arabic slug, at least one with EN in sitemap + EN versions)
  '/ar/embassies',
  '/ar/embassies/us-embassy-cairo',
  '/en/embassies/us-embassy-cairo',
  '/ar/embassies/germany-embassy',
  '/en/embassies/germany-embassy',
  '/ar/embassies/%D8%A3%D9%81%D8%B6%D9%84-%D9%85%D9%83%D8%AA%D8%A8-%D8%AA%D8%B1%D8%AC%D9%85%D8%A9-%D9%85%D8%B9%D8%AA%D9%85%D8%AF-%D9%85%D9%86-%D8%B3%D9%81%D8%A7%D8%B1%D8%A9-%D8%B3%D9%88%D9%8A%D8%B3%D8%B1%D8%A7',
  '/en/embassies/%D8%A3%D9%81%D8%B6%D9%84-%D9%85%D9%83%D8%AA%D8%A8-%D8%AA%D8%B1%D8%AC%D9%85%D8%A9-%D9%85%D8%B9%D8%AA%D9%85%D8%AF-%D9%85%D9%86-%D8%B3%D9%81%D8%A7%D8%B1%D8%A9-%D8%B3%D9%88%D9%8A%D8%B3%D8%B1%D8%A7',

  // Government (Index + 2 details AR+EN)
  '/ar/government',
  '/ar/government/mofa-egypt',
  '/en/government/mofa-egypt',
  '/ar/government/notary-public',
  '/en/government/notary-public',

  // Blog (Index + what-is-certified-translation AR+EN + other EN sitemap posts + 3 others AR+EN)
  '/ar/blog',
  '/ar/blog/what-is-certified-translation',
  '/en/blog/what-is-certified-translation',
  '/ar/blog/choose-right-interpreter-conference',
  '/en/blog/choose-right-interpreter-conference',
  '/ar/blog/italy-visa-egypt-almaviva',
  '/en/blog/italy-visa-egypt-almaviva',
  '/ar/blog/importance-localization-gulf',
  '/en/blog/importance-localization-gulf',
  '/ar/blog/translate-birth-certificate-germany',
  '/en/blog/translate-birth-certificate-germany',
  '/ar/blog/bank-statement-certified-translation-visa',
  '/en/blog/bank-statement-certified-translation-visa',
  '/ar/blog/certified-translation-nasr-city-new-cairo',
  '/en/blog/certified-translation-nasr-city-new-cairo',
  '/ar/blog/commercial-register-tax-card-translation',
  '/en/blog/commercial-register-tax-card-translation',

  // Languages & Misc
  '/ar/languages',
  '/ar/languages/english',
  '/en/languages/english',
  '/ar/branches',
  '/ar/reviews',
  '/ar/team',
  '/ar/contact',

  // 404 test
  '/ar/this-page-does-not-exist',
];

async function main() {
  const baseUrl = process.argv[2] || 'https://www.globalizetl.com';
  const outputPath = process.argv[3] || 'scratch/audit/seo-snapshot.json';

  console.log(`Taking SEO snapshot of ${baseUrl}...`);
  const outDir = path.dirname(outputPath);
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  const results = {
    baseUrl,
    generatedAt: new Date().toISOString(),
    paths: {},
    sitemap: null,
    robots: null,
  };

  for (const p of AUDIT_PATHS) {
    process.stdout.write(`Fetching ${p}... `);
    const snap = await snapshotPath(baseUrl, p);
    results.paths[p] = snap;
    console.log(`[${snap.status || snap.error}]`);
  }

  console.log('Fetching sitemap.xml...');
  results.sitemap = await snapshotSitemap(baseUrl);

  console.log('Fetching robots.txt...');
  results.robots = await snapshotRobots(baseUrl);

  fs.writeFileSync(outputPath, JSON.stringify(results, null, 2), 'utf8');
  console.log(`Snapshot saved to ${outputPath}`);
}

if (process.argv[1] && process.argv[1].endsWith('seo-snapshot.mjs')) {
  main().catch((err) => {
    console.error('Fatal error in snapshot:', err);
    process.exit(1);
  });
}
