import fs from 'node:fs';

function deepEqual(a, b) {
  if (a === b) return true;
  if (a == null || b == null) return false;
  if (typeof a !== typeof b) return false;
  if (typeof a !== 'object') return false;
  if (Array.isArray(a) !== Array.isArray(b)) return false;

  if (Array.isArray(a)) {
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) {
      if (!deepEqual(a[i], b[i])) return false;
    }
    return true;
  }

  const keysA = Object.keys(a);
  const keysB = Object.keys(b);
  if (keysA.length !== keysB.length) return false;

  for (const key of keysA) {
    if (!Object.prototype.hasOwnProperty.call(b, key)) return false;
    if (!deepEqual(a[key], b[key])) return false;
  }
  return true;
}

export function diffSnapshots(before, after) {
  const diffs = {
    paths: {},
    sitemap: {
      addedLocs: [],
      removedLocs: [],
      alternateDiffs: [],
    },
    robotsChanged: false,
  };

  const allPaths = Array.from(
    new Set([...Object.keys(before.paths || {}), ...Object.keys(after.paths || {})])
  );

  for (const p of allPaths) {
    const b = before.paths[p];
    const a = after.paths[p];

    if (!b) {
      diffs.paths[p] = { error: 'Path missing in before snapshot' };
      continue;
    }
    if (!a) {
      diffs.paths[p] = { error: 'Path missing in after snapshot' };
      continue;
    }

    const pathDiffs = {};

    if (b.status !== a.status) {
      pathDiffs.status = { before: b.status, after: a.status };
    }
    if (b.title !== a.title) {
      pathDiffs.title = { before: b.title, after: a.title };
    }
    if (b.description !== a.description) {
      pathDiffs.description = { before: b.description, after: a.description };
    }
    if (b.robots !== a.robots) {
      pathDiffs.robots = { before: b.robots, after: a.robots };
    }
    if (b.canonical !== a.canonical) {
      // Normalize baseUrl diffs (e.g. localhost:3000 vs www.globalizetl.com) if checking local-to-local
      pathDiffs.canonical = { before: b.canonical, after: a.canonical };
    }
    if (b.ogUrl !== a.ogUrl) {
      pathDiffs.ogUrl = { before: b.ogUrl, after: a.ogUrl };
    }
    if (!deepEqual(b.alternates, a.alternates)) {
      pathDiffs.alternates = { before: b.alternates, after: a.alternates };
    }
    if (!deepEqual(b.h1s, a.h1s)) {
      pathDiffs.h1s = { before: b.h1s, after: a.h1s };
    }
    if (!deepEqual(b.jsonLdTypes?.sort(), a.jsonLdTypes?.sort())) {
      pathDiffs.jsonLdTypes = { before: b.jsonLdTypes, after: a.jsonLdTypes };
    }
    if (!deepEqual(b.jsonLdBlocks, a.jsonLdBlocks)) {
      pathDiffs.jsonLdBlocks = {
        countBefore: b.jsonLdBlocks?.length,
        countAfter: a.jsonLdBlocks?.length,
        diffDetails: 'JSON-LD blocks modified',
      };
    }
    if (!deepEqual(b.faqs, a.faqs)) {
      pathDiffs.faqs = { before: b.faqs, after: a.faqs };
    }
    if (Math.abs((b.mainWordCount || 0) - (a.mainWordCount || 0)) > 5) {
      pathDiffs.mainWordCount = { before: b.mainWordCount, after: a.mainWordCount };
    }

    if (Object.keys(pathDiffs).length > 0) {
      diffs.paths[p] = pathDiffs;
    }
  }

  // Sitemap diff
  const bUrls = new Map((before.sitemap?.urls || []).map((u) => [u.loc, u]));
  const aUrls = new Map((after.sitemap?.urls || []).map((u) => [u.loc, u]));

  for (const [loc] of aUrls) {
    if (!bUrls.has(loc)) {
      diffs.sitemap.addedLocs.push(loc);
    }
  }
  for (const [loc] of bUrls) {
    if (!aUrls.has(loc)) {
      diffs.sitemap.removedLocs.push(loc);
    }
  }
  for (const [loc, bItem] of bUrls) {
    const aItem = aUrls.get(loc);
    if (aItem && !deepEqual(bItem.alternates, aItem.alternates)) {
      diffs.sitemap.alternateDiffs.push({
        loc,
        before: bItem.alternates,
        after: aItem.alternates,
      });
    }
  }

  // Robots diff
  if (before.robots !== after.robots) {
    diffs.robotsChanged = true;
  }

  return diffs;
}

function main() {
  const beforeFile = process.argv[2];
  const afterFile = process.argv[3];

  if (!beforeFile || !afterFile) {
    console.error('Usage: node scripts/seo-diff.mjs <before.json> <after.json>');
    process.exit(1);
  }

  const before = JSON.parse(fs.readFileSync(beforeFile, 'utf8'));
  const after = JSON.parse(fs.readFileSync(afterFile, 'utf8'));

  const diffs = diffSnapshots(before, after);

  console.log('='.repeat(60));
  console.log(`SEO DIFF REPORT: ${beforeFile} vs ${afterFile}`);
  console.log('='.repeat(60));

  const changedPaths = Object.keys(diffs.paths);
  if (changedPaths.length === 0) {
    console.log('✔ All monitored paths are IDENTICAL!');
  } else {
    console.log(`⚠ Found differences in ${changedPaths.length} path(s):`);
    for (const p of changedPaths) {
      console.log(`\n--- Path: ${p} ---`);
      console.log(JSON.stringify(diffs.paths[p], null, 2));
    }
  }

  console.log('\n--- Sitemap Differences ---');
  console.log(`Added URLs (${diffs.sitemap.addedLocs.length}):`, diffs.sitemap.addedLocs);
  console.log(`Removed URLs (${diffs.sitemap.removedLocs.length}):`, diffs.sitemap.removedLocs);
  console.log(`Alternate Diffs (${diffs.sitemap.alternateDiffs.length}):`, diffs.sitemap.alternateDiffs);

  console.log('\n--- Robots.txt ---');
  console.log('Robots Changed:', diffs.robotsChanged);
  console.log('='.repeat(60));
}

if (process.argv[1] && process.argv[1].endsWith('seo-diff.mjs')) {
  main();
}
