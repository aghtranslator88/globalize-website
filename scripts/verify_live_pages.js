async function check() {
  const arUrl = 'https://www.globalizetl.com/ar/blog/italy-visa-egypt-almaviva';
  const enUrl = 'https://www.globalizetl.com/en/blog/italy-visa-egypt-almaviva';

  for (const url of [arUrl, enUrl]) {
    try {
      console.log('\n==============================');
      console.log('Fetching:', url);
      const res = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
          'Cache-Control': 'no-cache'
        }
      });
      console.log('HTTP Status:', res.status);
      const html = await res.text();

      // Title
      const title = html.match(/<title>([^<]+)<\/title>/i);
      console.log('Title:', title ? title[1] : 'NOT FOUND');

      // Meta Description
      const desc = html.match(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']+)["']/i) ||
                   html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+name=["']description["']/i);
      console.log('Description:', desc ? desc[1] : 'NOT FOUND');

      // Canonical
      const canonical = html.match(/<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)["']/i) ||
                        html.match(/<link[^>]+href=["']([^"']+)["'][^>]+rel=["']canonical["']/i);
      console.log('Canonical:', canonical ? canonical[1] : 'NOT FOUND');

      // Hreflang
      const hreflangs = [...html.matchAll(/<link[^>]+rel=["']alternate["'][^>]+hreflang=["']([^"']+)["'][^>]+href=["']([^"']+)["']/gi)];
      console.log('Hreflangs found:', hreflangs.length);
      hreflangs.forEach(h => console.log(`  - ${h[1]}: ${h[2]}`));

      // JSON-LD Schemas
      const schemas = [...html.matchAll(/<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)];
      console.log('JSON-LD blocks found:', schemas.length);
      schemas.forEach((s, idx) => {
        try {
          const parsed = JSON.parse(s[1]);
          console.log(`  [Schema #${idx+1}] @type:`, parsed['@type'] || (Array.isArray(parsed) ? parsed.map(p => p['@type']) : 'unknown'));
          if (parsed['@type'] === 'Article' || parsed['@type'] === 'BlogPosting') {
            console.log(`    Headline: ${parsed.headline}`);
          }
          if (parsed['@type'] === 'FAQPage') {
            console.log(`    FAQ count: ${parsed.mainEntity?.length}`);
          }
        } catch (e) {
          console.log(`  [Schema #${idx+1}] (parsing error)`);
        }
      });

      // Internal links check in page
      const internalLinks = [...html.matchAll(/href=["'](\/(?:ar|en)\/[^"']+)["']/gi)].map(m => m[1]);
      const uniqueLinks = [...new Set(internalLinks)];
      console.log('Internal localized links in page:', uniqueLinks.length);
      const relevantLinks = uniqueLinks.filter(l => l.includes('document') || l.includes('service') || l.includes('embass') || l.includes('branch'));
      console.log('Sample key internal links:', relevantLinks.slice(0, 8));

      // WhatsApp CTA check
      const waLinks = [...html.matchAll(/href=["'](https:\/\/wa\.me\/[^"']+)["']/gi)].map(m => m[1]);
      console.log('WhatsApp links found:', waLinks.length);

    } catch (err) {
      console.error('Error fetching', url, err);
    }
  }
}

check();
