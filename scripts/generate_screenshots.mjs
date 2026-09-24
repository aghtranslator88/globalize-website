import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";

const REVIEWS_FILE = ".gbp/all_curated_reviews.json";
const OUTPUT_DIR = path.resolve(process.cwd(), "public/images/reviews");
const EDGE_PATH = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

if (!fs.existsSync(REVIEWS_FILE)) {
  console.error("❌ Curated reviews file not found!");
  process.exit(1);
}

const allReviews = JSON.parse(fs.readFileSync(REVIEWS_FILE, "utf-8"));

// Pick top 12 curated reviews (ideal for 3x4 grid)
const curated = allReviews
  .filter((r) => r.comment && r.comment.length > 20)
  .slice(0, 12);

console.log(`📸 Processing ${curated.length} top reviews for gallery...`);

const manifest = [];

for (let idx = 0; idx < curated.length; idx++) {
  const r = curated[idx];
  const index = idx + 1;
  const filename = `google-review-${index}.png`;
  const imagePath = `/images/reviews/${filename}`;
  const fullOutputPath = path.join(OUTPUT_DIR, filename);

  const reviewerName = r.reviewer?.displayName || "عميل جلوباليز";
  const avatarUrl = r.reviewer?.profilePhotoUrl || "";
  const initial = reviewerName.trim().charAt(0).toUpperCase();

  let cleanComment = r.comment.replace(/\n*\(Translated by Google\)\n*[\s\S]*$/i, "").trim();
  if (!cleanComment) cleanComment = r.comment.trim();

  const replyComment = r.reviewReply?.comment || "شكراً جزيلاً لثقتك الغالية في جلوباليز جروب للترجمة المعتمدة. يسعدنا ويشرفنا دائماً خدمتكم بأعلى معايير الدقة والسرعة.";

  const dateStr = new Date(r.createTime).toLocaleDateString("ar-EG", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  manifest.push({
    id: `review-${index}`,
    authorName: reviewerName,
    avatarUrl: avatarUrl,
    date: dateStr,
    rating: 5,
    comment: cleanComment,
    reply: replyComment,
    imagePath: imagePath,
    googleReviewUrl: r.reviewReplyUrl || "https://maps.google.com/?q=Globalize+Group+Translation",
  });

  // Skip rendering if screenshot already exists and is non-empty
  if (fs.existsSync(fullOutputPath) && fs.statSync(fullOutputPath).size > 1000) {
    console.log(`⏩ [${index}/${curated.length}] Already captured: ${filename}`);
    continue;
  }

  const html = `<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
<meta charset="utf-8">
<style>
  @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;500;600;700;800&family=Roboto:wght@400;500;700&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    background: #0f172a;
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    padding: 30px;
    font-family: 'Cairo', system-ui, sans-serif;
  }
  .review-card {
    background: #ffffff;
    width: 650px;
    border-radius: 20px;
    box-shadow: 0 20px 40px -15px rgba(0,0,0,0.3);
    padding: 32px;
    border: 1px solid #e2e8f0;
    position: relative;
    overflow: hidden;
  }
  .card-top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #f1f5f9;
    padding-bottom: 18px;
    margin-bottom: 22px;
  }
  .google-branding {
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .google-g {
    width: 26px;
    height: 26px;
  }
  .google-tag {
    font-size: 13px;
    font-weight: 700;
    color: #475569;
    letter-spacing: -0.2px;
  }
  .verified-badge {
    background: #ecfdf5;
    color: #059669;
    font-size: 11px;
    font-weight: 700;
    padding: 4px 12px;
    border-radius: 9999px;
    border: 1px solid #a7f3d0;
    display: flex;
    align-items: center;
    gap: 4px;
  }
  .reviewer-info {
    display: flex;
    align-items: center;
    gap: 16px;
    margin-bottom: 16px;
  }
  .avatar {
    width: 56px;
    height: 56px;
    border-radius: 50%;
    object-fit: cover;
    border: 2px solid #e2e8f0;
    box-shadow: 0 2px 4px rgba(0,0,0,0.06);
  }
  .avatar-fallback {
    width: 56px;
    height: 56px;
    border-radius: 50%;
    background: linear-gradient(135deg, #1e3a8a, #3b82f6);
    color: #ffffff;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 700;
    font-size: 22px;
  }
  .details h3 {
    font-size: 17px;
    font-weight: 700;
    color: #0f172a;
    margin-bottom: 2px;
  }
  .details .date {
    font-size: 12px;
    color: #94a3b8;
  }
  .stars {
    display: flex;
    gap: 3px;
    margin-bottom: 18px;
  }
  .star {
    color: #f59e0b;
    font-size: 20px;
  }
  .comment-text {
    font-size: 15px;
    line-height: 1.8;
    color: #334155;
    font-weight: 500;
    margin-bottom: 22px;
    white-space: pre-line;
  }
  .owner-reply {
    background: #f8fafc;
    border-right: 4px solid #1e3a8a;
    border-radius: 0 12px 12px 0;
    padding: 16px 20px;
    margin-top: 14px;
  }
  .reply-header {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 12px;
    font-weight: 700;
    color: #1e3a8a;
    margin-bottom: 6px;
  }
  .reply-text {
    font-size: 13px;
    line-height: 1.7;
    color: #475569;
  }
  .place-tag {
    font-size: 11px;
    color: #64748b;
    margin-top: 18px;
    display: flex;
    align-items: center;
    gap: 6px;
    border-top: 1px solid #f1f5f9;
    padding-top: 12px;
  }
</style>
</head>
<body>
  <div class="review-card">
    <div class="card-top">
      <div class="google-branding">
        <svg class="google-g" viewBox="0 0 24 24">
          <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.66v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.15z"/>
          <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.24v3.15C3.26 21.36 7.33 24 12 24z"/>
          <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.24C.45 8.15 0 9.99 0 12s.45 3.85 1.24 5.42l4.04-3.15z"/>
          <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.24 6.58l4.04 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
        </svg>
        <span class="google-tag">تقييم موثق على Google Maps</span>
      </div>
      <span class="verified-badge">✔ تم التحقق</span>
    </div>

    <div class="reviewer-info">
      ${
        avatarUrl
          ? `<img class="avatar" src="${avatarUrl}" alt="${reviewerName}" onerror="this.outerHTML='<div class=\\'avatar-fallback\\'>${initial}</div>'">`
          : `<div class="avatar-fallback">${initial}</div>`
      }
      <div class="details">
        <h3>${reviewerName}</h3>
        <span class="date">${dateStr}</span>
      </div>
    </div>

    <div class="stars">
      <span class="star">★</span>
      <span class="star">★</span>
      <span class="star">★</span>
      <span class="star">★</span>
      <span class="star">★</span>
    </div>

    <p class="comment-text">${cleanComment}</p>

    <div class="owner-reply">
      <div class="reply-header">
        <span>↩️</span>
        <span>رد من إدارة جلوباليز جروب للترجمة المعتمدة</span>
      </div>
      <p class="reply-text">${replyComment}</p>
    </div>

    <div class="place-tag">
      <span>📍 جلوباليز جروب - مكتب ترجمة معتمد (فرع الجيزة الرئيسي)</span>
    </div>
  </div>
</body>
</html>`;

  const tempHtmlPath = path.resolve(OUTPUT_DIR, `temp-${index}.html`);
  fs.writeFileSync(tempHtmlPath, html, "utf-8");

  try {
    const cmd = `"${EDGE_PATH}" --headless --disable-gpu --screenshot="${fullOutputPath}" --window-size=720,780 "file:///${tempHtmlPath.replace(/\\/g, "/")}"`;
    execSync(cmd, { stdio: "ignore", timeout: 25000 });
    console.log(`✅ [${index}/${curated.length}] Captured: ${filename}`);
  } catch (err) {
    console.error(`❌ Failed capturing card ${index}:`, err.message);
  } finally {
    if (fs.existsSync(tempHtmlPath)) fs.unlinkSync(tempHtmlPath);
  }
}

const manifestPath = path.resolve(process.cwd(), "src/lib/google-reviews-manifest.json");
fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2), "utf-8");
console.log(`\n🎉 Processed ${manifest.length} reviews and updated src/lib/google-reviews-manifest.json`);
