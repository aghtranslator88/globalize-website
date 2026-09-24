import fs from "node:fs";
import path from "node:path";

const GBP_DIR = path.resolve(process.cwd(), ".gbp");
const CLIENT_SECRET_FILE = path.join(GBP_DIR, "client_secret.json");
const TOKENS_FILE = path.join(GBP_DIR, "tokens.json");

/**
 * Get valid OAuth Access Token with automatic refresh
 */
export async function getAccessToken() {
  if (!fs.existsSync(TOKENS_FILE)) {
    throw new Error("GBP not authenticated. Run: node scripts/gbp-auth.mjs first.");
  }

  const creds = JSON.parse(fs.readFileSync(CLIENT_SECRET_FILE, "utf-8"));
  const config = creds.installed || creds.web;
  const tokens = JSON.parse(fs.readFileSync(TOKENS_FILE, "utf-8"));

  const isExpired = tokens.saved_at && (Date.now() - tokens.saved_at > (tokens.expires_in - 300) * 1000);

  if (tokens.access_token && !isExpired) {
    return tokens.access_token;
  }

  if (!tokens.refresh_token) {
    throw new Error("No refresh_token found. Re-run: node scripts/gbp-auth.mjs");
  }

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
  if (!res.ok) {
    throw new Error(newTokens.error_description || "Failed to refresh token");
  }

  tokens.access_token = newTokens.access_token;
  tokens.expires_in = newTokens.expires_in || 3600;
  tokens.saved_at = Date.now();
  fs.writeFileSync(TOKENS_FILE, JSON.stringify(tokens, null, 2), "utf-8");

  return tokens.access_token;
}

/**
 * List all Google Business Profile Accounts
 */
export async function listAccounts() {
  const token = await getAccessToken();
  const res = await fetch("https://mybusinessaccountmanagement.googleapis.com/v1/accounts", {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error?.message || "Failed to list GBP accounts");
  return data.accounts || [];
}

/**
 * List all locations under an account
 */
export async function listLocations(accountName) {
  const token = await getAccessToken();
  const readMask = "name,title,storefrontAddress,websiteUri,phoneNumbers,categories,regularHours,profile,metadata";
  const url = `https://mybusinessbusinessinformation.googleapis.com/v1/${accountName}/locations?readMask=${readMask}`;
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error?.message || "Failed to list locations");
  return data.locations || [];
}

/**
 * Get Reviews for a specific location
 */
export async function getReviews(accountName, locationName, pageSize = 50, pageToken = "") {
  const token = await getAccessToken();
  const accId = accountName.replace("accounts/", "");
  const locId = locationName.replace("locations/", "");
  let url = `https://mybusiness.googleapis.com/v4/accounts/${accId}/locations/${locId}/reviews?pageSize=${pageSize}`;
  if (pageToken) url += `&pageToken=${pageToken}`;

  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error?.message || "Failed to fetch reviews");
  return data;
}

/**
 * Reply to a review (or update an existing reply)
 */
export async function replyToReview(accountName, locationName, reviewId, comment) {
  const token = await getAccessToken();
  const accId = accountName.replace("accounts/", "");
  const locId = locationName.replace("locations/", "");
  const revId = reviewId.replace(/.*\/reviews\//, "");

  const url = `https://mybusiness.googleapis.com/v4/accounts/${accId}/locations/${locId}/reviews/${revId}/reply`;
  const res = await fetch(url, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ comment }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error?.message || "Failed to reply to review");
  return data;
}

/**
 * Delete a reply to a review
 */
export async function deleteReviewReply(accountName, locationName, reviewId) {
  const token = await getAccessToken();
  const accId = accountName.replace("accounts/", "");
  const locId = locationName.replace("locations/", "");
  const revId = reviewId.replace(/.*\/reviews\//, "");

  const url = `https://mybusiness.googleapis.com/v4/accounts/${accId}/locations/${locId}/reviews/${revId}/reply`;
  const res = await fetch(url, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.error?.message || "Failed to delete review reply");
  }
  return { success: true };
}

/**
 * Fetch Performance Metrics (Impressions, Calls, Website Clicks, etc.)
 */
export async function getPerformance(locationName, startDate, endDate) {
  const token = await getAccessToken();
  const locId = locationName.replace("locations/", "");

  const metrics = [
    "BUSINESS_IMPRESSIONS_DESKTOP_MAPS",
    "BUSINESS_IMPRESSIONS_DESKTOP_SEARCH",
    "BUSINESS_IMPRESSIONS_MOBILE_MAPS",
    "BUSINESS_IMPRESSIONS_MOBILE_SEARCH",
    "CALL_CLICKS",
    "WEBSITE_CLICKS",
    "BUSINESS_DIRECTION_REQUESTS",
  ];

  const params = new URLSearchParams();
  metrics.forEach((m) => params.append("dailyMetrics", m));
  params.set("dailyRange.startDate.year", startDate.getFullYear());
  params.set("dailyRange.startDate.month", startDate.getMonth() + 1);
  params.set("dailyRange.startDate.day", startDate.getDate());
  params.set("dailyRange.endDate.year", endDate.getFullYear());
  params.set("dailyRange.endDate.month", endDate.getMonth() + 1);
  params.set("dailyRange.endDate.day", endDate.getDate());

  const url = `https://businessprofileperformance.googleapis.com/v1/locations/${locId}:fetchMultiDailyMetricsTimeSeries?${params.toString()}`;
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error?.message || "Failed to fetch performance data");
  return data;
}
