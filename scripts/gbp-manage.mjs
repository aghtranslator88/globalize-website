import { listAccounts, listLocations, getReviews, getPerformance } from "./gbp-client.mjs";

const command = process.argv[2] || "status";

async function main() {
  try {
    if (command === "status" || command === "locations") {
      console.log("==================================================");
      console.log("📍 GOOGLE BUSINESS PROFILE - CONNECTED LOCATIONS");
      console.log("==================================================");
      const accounts = await listAccounts();
      for (const acc of accounts) {
        console.log(`\n👤 Account: ${acc.accountName || acc.name} (${acc.type || "PERSONAL"})`);
        const locations = await listLocations(acc.name);
        if (locations.length === 0) {
          console.log("   (No locations directly under this account)");
          continue;
        }
        locations.forEach((loc, idx) => {
          console.log(`\n  [${idx + 1}] ${loc.title}`);
          console.log(`      ID: ${loc.name}`);
          console.log(`      Address: ${loc.storefrontAddress?.addressLines?.join(", ") || "N/A"}`);
          console.log(`      Phone: ${loc.phoneNumbers?.primaryPhone || "N/A"}`);
          console.log(`      Website: ${loc.websiteUri || "N/A"}`);
          console.log(`      Primary Category: ${loc.categories?.primaryCategory?.displayName || "N/A"}`);
        });
      }
    } else if (command === "reviews") {
      console.log("==================================================");
      console.log("⭐ REVIEWS OVERVIEW");
      console.log("==================================================");
      const accounts = await listAccounts();
      for (const acc of accounts) {
        const locations = await listLocations(acc.name);
        for (const loc of locations) {
          console.log(`\n🏢 Location: ${loc.title}`);
          try {
            const data = await getReviews(acc.name, loc.name, 20);
            const reviews = data.reviews || [];
            console.log(`   Total Reviews: ${data.totalReviewCount || reviews.length} | Avg Rating: ⭐ ${data.averageRating ? data.averageRating.toFixed(1) : "N/A"}`);
            
            const unreplied = reviews.filter((r) => !r.reviewReply);
            console.log(`   Unreplied Reviews: ${unreplied.length}`);

            console.log("\n   Latest Reviews:");
            reviews.slice(0, 5).forEach((r) => {
              const stars = { ONE: 1, TWO: 2, THREE: 3, FOUR: 4, FIVE: 5 }[r.starRating] || r.starRating;
              console.log(`   --------------------------------------------------`);
              console.log(`   👤 ${r.reviewer?.displayName || "Anonymous"} (${stars} ⭐) - ${new Date(r.createTime).toLocaleDateString("ar-EG")}`);
              if (r.comment) console.log(`   💬 "${r.comment.trim()}"`);
              if (r.reviewReply) {
                console.log(`   ↩️ [Reply]: "${r.reviewReply.comment.trim()}"`);
              } else {
                console.log(`   ⚠️ [No Reply Yet]`);
              }
            });
          } catch (e) {
            console.log(`   ⚠️ Error reading reviews: ${e.message}`);
          }
        }
      }
    } else if (command === "performance") {
      console.log("==================================================");
      console.log("📈 LAST 30 DAYS PERFORMANCE OVERVIEW");
      console.log("==================================================");
      const accounts = await listAccounts();
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(endDate.getDate() - 30);

      for (const acc of accounts) {
        const locations = await listLocations(acc.name);
        for (const loc of locations) {
          console.log(`\n🏢 Location: ${loc.title}`);
          try {
            const perf = await getPerformance(loc.name, startDate, endDate);
            if (perf.multiDailyMetricTimeSeries) {
              perf.multiDailyMetricTimeSeries.forEach((ts) => {
                const metric = ts.dailyMetric;
                const total = ts.dailyMetricTimeSeries?.timeSeries?.datedValues?.reduce((sum, v) => sum + parseInt(v.value || 0), 0) || 0;
                console.log(`   - ${metric}: ${total}`);
              });
            } else {
              console.log("   No performance metrics returned.");
            }
          } catch (e) {
            console.log(`   ⚠️ Error reading performance: ${e.message}`);
          }
        }
      }
    } else {
      console.log(`Unknown command: ${command}. Use: status | reviews | performance`);
    }
  } catch (err) {
    console.error("❌ Error:", err.message);
  }
}

main();
