import fs from "node:fs";
import path from "node:path";

const GSC_DIR = path.resolve(process.cwd(), ".gsc");
const CLIENT_SECRET_FILE = path.join(GSC_DIR, "client_secret.json");
const TOKENS_FILE = path.join(GSC_DIR, "tokens.json");

async function getAccessToken() {
  if (!fs.existsSync(TOKENS_FILE)) throw new Error("GSC not authenticated.");
  const creds = JSON.parse(fs.readFileSync(CLIENT_SECRET_FILE, "utf-8"));
  const config = creds.installed || creds.web;
  const tokens = JSON.parse(fs.readFileSync(TOKENS_FILE, "utf-8"));

  const isExpired = tokens.saved_at && (Date.now() - tokens.saved_at > (tokens.expires_in - 300) * 1000);
  if (tokens.access_token && !isExpired) return tokens.access_token;

  const res = await fetch(config.token_uri || "https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: config.client_id,
      client_secret: config.client_secret,
      refresh_token: tokens.refresh_token,
      grant_type: "refresh_token",
    }),
  });

  const newTokens = await res.json();
  if (!res.ok) throw new Error(newTokens.error_description || "Token refresh failed");
  tokens.access_token = newTokens.access_token;
  tokens.expires_in = newTokens.expires_in || 3600;
  tokens.saved_at = Date.now();
  fs.writeFileSync(TOKENS_FILE, JSON.stringify(tokens, null, 2), "utf-8");
  return tokens.access_token;
}

async function queryGSC(body) {
  const token = await getAccessToken();
  const siteUrl = "sc-domain:globalizetl.com";
  const res = await fetch(`https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(siteUrl)}/searchAnalytics/query`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body)
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error?.message || JSON.stringify(data));
  return data.rows || [];
}

async function main() {
  console.log("==========================================");
  console.log("📊 EXTRACTING POST-IMPLEMENTATION GSC DATA");
  console.log("==========================================\n");

  const today = new Date();
  const endDate = today.toISOString().split("T")[0];
  const startDate = "2026-06-01";

  // 1. Overall Totals
  console.log(`Querying overall totals (${startDate} to ${endDate})...`);
  const totals = await queryGSC({
    startDate,
    endDate,
    dimensions: [],
    type: "web"
  });
  console.log("Overall Performance:", totals);

  // 2. Daily Time Series
  console.log("\nQuerying daily breakdown...");
  const daily = await queryGSC({
    startDate,
    endDate,
    dimensions: ["date"],
    type: "web"
  });
  console.log(`Days recorded: ${daily.length}`);
  if (daily.length > 0) {
    console.log("Latest days:");
    console.table(daily.slice(-7));
  }

  // 3. Top Pages
  console.log("\nQuerying top pages...");
  const pages = await queryGSC({
    startDate,
    endDate,
    dimensions: ["page"],
    rowLimit: 50,
    type: "web"
  });
  console.log(`Top ${pages.length} Pages:`);
  console.table(pages.map(p => ({
    page: p.keys[0],
    clicks: p.clicks,
    impressions: p.impressions,
    ctr: (p.ctr * 100).toFixed(2) + "%",
    position: p.position.toFixed(1)
  })));

  // 4. Top Queries
  console.log("\nQuerying top queries...");
  const queries = await queryGSC({
    startDate,
    endDate,
    dimensions: ["query"],
    rowLimit: 50,
    type: "web"
  });
  console.log(`Top ${queries.length} Queries:`);
  console.table(queries.map(q => ({
    query: q.keys[0],
    clicks: q.clicks,
    impressions: q.impressions,
    ctr: (q.ctr * 100).toFixed(2) + "%",
    position: q.position.toFixed(1)
  })));

  // 5. Almaviva Specific Queries
  console.log("\nQuerying Almaviva specific queries...");
  const almavivaQueries = await queryGSC({
    startDate,
    endDate,
    dimensions: ["query"],
    dimensionFilterGroups: [{
      filters: [{
        dimension: "page",
        operator: "contains",
        expression: "almaviva"
      }]
    }],
    rowLimit: 25,
    type: "web"
  });
  console.log(`Almaviva Queries count: ${almavivaQueries.length}`);
  if (almavivaQueries.length > 0) {
    console.table(almavivaQueries.map(q => ({
      query: q.keys[0],
      clicks: q.clicks,
      impressions: q.impressions,
      ctr: (q.ctr * 100).toFixed(2) + "%",
      pos: q.position.toFixed(1)
    })));
  }

  // 6. Documents Specific Queries
  console.log("\nQuerying Documents specific queries...");
  const docQueries = await queryGSC({
    startDate,
    endDate,
    dimensions: ["query"],
    dimensionFilterGroups: [{
      filters: [{
        dimension: "page",
        operator: "contains",
        expression: "document"
      }]
    }],
    rowLimit: 25,
    type: "web"
  });
  console.log(`Document Queries count: ${docQueries.length}`);
  if (docQueries.length > 0) {
    console.table(docQueries.map(q => ({
      query: q.keys[0],
      clicks: q.clicks,
      impressions: q.impressions,
      ctr: (q.ctr * 100).toFixed(2) + "%",
      pos: q.position.toFixed(1)
    })));
  }

  // Save all raw data
  const outputData = {
    extractedAt: new Date().toISOString(),
    startDate,
    endDate,
    totals,
    daily,
    pages,
    queries,
    almavivaQueries,
    docQueries
  };
  fs.writeFileSync("gsc_performance_review_raw.json", JSON.stringify(outputData, null, 2));
  console.log("\nSaved complete raw dataset to gsc_performance_review_raw.json");
}

main().catch(console.error);
