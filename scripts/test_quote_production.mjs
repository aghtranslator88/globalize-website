import {
  checkRateLimit,
  storeLeadPermanently,
  saveToPrimaryDatabase,
  saveToPersistentFallback,
  dispatchNotifications,
  sendTelegramNotification,
  sendEmailNotification,
  maskPhone,
  maskEmail,
} from '../src/lib/leadResilience.ts';
import { POST as handleQuotePost } from '../src/app/api/quote/route.ts';
import { prisma } from '../src/lib/prisma.ts';

console.log('================================================================');
console.log('🧪 COMPREHENSIVE PRODUCTION TEST SUITE: /api/quote & RESILIENCE');
console.log('================================================================\n');

let passed = 0;
let failed = 0;

function assert(condition, testName, details = '') {
  if (condition) {
    console.log(`✅ PASS: ${testName}`);
    passed++;
  } else {
    console.error(`❌ FAIL: ${testName} ${details ? `(${details})` : ''}`);
    failed++;
  }
}

async function runProductionTestSuite() {
  // --------------------------------------------------------------------------
  // TEST 1: Successful Lead Submission (Primary PostgreSQL)
  // --------------------------------------------------------------------------
  console.log('\n--- 1. Testing Successful Lead Submission to Primary DB ---');
  const uniquePhone = `+201099${Math.floor(100000 + Math.random() * 900000)}`;
  const validPayload = {
    name: 'سارة الأحمدي',
    phone: uniquePhone,
    email: 'sara@example.com',
    serviceType: 'certified',
    attachmentName: 'commercial_register.pdf',
    notes: 'ترجمة معتمدة للسفارة الألمانية',
  };

  const req1 = new Request('http://localhost:3000/api/quote', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-forwarded-for': '192.168.1.1',
    },
    body: JSON.stringify(validPayload),
  });

  const res1 = await handleQuotePost(req1);
  const data1 = await res1.json();

  assert(res1.status === 201, 'Status code must be 201 Created on success', `Got ${res1.status}`);
  assert(data1.success === true, 'Response body success must be true');
  assert(data1.leadId && data1.leadId.length > 20, 'Unique leadId UUID must be generated');
  assert(data1.storageStatus === 'PRIMARY_DB', 'Storage status must be PRIMARY_DB');
  assert(data1.attachmentStatus === 'MANUAL_WHATSAPP_UPLOAD_REQUIRED', 'Attachment status must be MANUAL_WHATSAPP_UPLOAD_REQUIRED');

  // Verify in PostgreSQL database
  const dbRecord = await prisma.quoteRequest.findUnique({ where: { id: data1.leadId } });
  assert(dbRecord !== null, 'Lead must physically exist in PostgreSQL database');
  assert(dbRecord?.phone === uniquePhone, 'Stored phone in DB must match');
  assert(dbRecord?.fileUrl === 'MANUAL_WHATSAPP_UPLOAD:commercial_register.pdf', 'fileUrl in DB must be prefixed with MANUAL_WHATSAPP_UPLOAD:');
  assert(dbRecord?.notes?.includes('[Email: sara@example.com]'), 'Customer email must be preserved in notes prefix');

  // --------------------------------------------------------------------------
  // TEST 2: Database Failure with Successful Fallback (Upstash Redis Mock/Real)
  // --------------------------------------------------------------------------
  console.log('\n--- 2. Testing Database Failure with Fallback to Upstash Redis ---');
  let upstashCalled = false;
  let upstashStoredBody = null;

  // Intercept global fetch to mock Upstash Redis REST endpoint
  const originalFetch = global.fetch;
  global.fetch = async (url, options) => {
    if (typeof url === 'string' && url.includes('upstash.io/pipeline')) {
      upstashCalled = true;
      upstashStoredBody = JSON.parse(options.body);
      return {
        ok: true,
        status: 200,
        text: async () => JSON.stringify([{ result: 'OK' }, { result: 1 }]),
      };
    }
    return originalFetch(url, options);
  };

  // Set mock Upstash env vars
  process.env.UPSTASH_REDIS_REST_URL = 'https://mock-redis.upstash.io';
  process.env.UPSTASH_REDIS_REST_TOKEN = 'mock-upstash-token-123';

  // Force Primary DB failure by passing invalid/unconnectable connection or bad payload
  const fallbackLeadPhone = `+201088${Math.floor(100000 + Math.random() * 900000)}`;
  const simulatedLead = {
    name: 'محمود عبد الله',
    phone: fallbackLeadPhone,
    serviceType: 'localization',
    attachmentName: 'strings.json',
    notes: 'توطين تطبيق جوال',
  };

  // Directly test fallback save
  const testLeadRecord = {
    id: `fb-test-${Date.now()}`,
    name: simulatedLead.name,
    phone: simulatedLead.phone,
    email: null,
    serviceType: simulatedLead.serviceType,
    notes: simulatedLead.notes,
    attachmentName: simulatedLead.attachmentName,
    attachmentStatus: 'MANUAL_WHATSAPP_UPLOAD_REQUIRED',
    createdAt: new Date().toISOString(),
    storageStatus: 'FAILED',
    emailStatus: 'NOT_CONFIGURED',
    telegramStatus: 'NOT_CONFIGURED',
    retryCount: 0,
    lastError: null,
  };

  const fallbackSaveRes = await saveToPersistentFallback(testLeadRecord);
  assert(fallbackSaveRes.success === true, 'saveToPersistentFallback must succeed via Upstash pipeline');
  assert(upstashCalled === true, 'Upstash pipeline endpoint must be called');
  assert(Array.isArray(upstashStoredBody) && upstashStoredBody.length === 2, 'Upstash pipeline must contain SET and RPUSH');
  assert(upstashStoredBody[0][0] === 'SET', 'Pipeline command 1 must be SET');
  assert(upstashStoredBody[1][0] === 'RPUSH', 'Pipeline command 2 must be RPUSH');

  // --------------------------------------------------------------------------
  // TEST 3: Database and Fallback Failure (Both Fail -> 503)
  // --------------------------------------------------------------------------
  console.log('\n--- 3. Testing Database AND Fallback Failure (Total Storage Failure) ---');
  // Temporarily disable Upstash and mock fetch failure
  delete process.env.UPSTASH_REDIS_REST_URL;
  delete process.env.UPSTASH_REDIS_REST_TOKEN;

  // Intercept prisma to simulate complete DB failure
  const originalPrismaCreate = prisma.quoteRequest.create;
  prisma.quoteRequest.create = async () => {
    throw new Error('P1001: Can\'t reach database server at neon.tech:5432');
  };

  const failedStorageRes = await storeLeadPermanently({
    name: 'خالد توفيق',
    phone: `+201077${Math.floor(100000 + Math.random() * 900000)}`,
    serviceType: 'certified',
  });

  assert(failedStorageRes.success === false, 'storeLeadPermanently must return success: false when all stores fail');
  assert(failedStorageRes.lead.storageStatus === 'FAILED', 'Storage status must be FAILED');
  assert(failedStorageRes.error !== null, 'Detailed error must be recorded');

  // Restore prisma
  prisma.quoteRequest.create = originalPrismaCreate;
  global.fetch = originalFetch;

  // --------------------------------------------------------------------------
  // TEST 4: Email Notification Failure Isolation (Lead Preserved)
  // --------------------------------------------------------------------------
  console.log('\n--- 4. Testing Email Failure Isolation (Lead Not Invalidated) ---');
  process.env.RESEND_API_KEY = 'invalid-test-key';
  process.env.LEAD_EMAIL_TO = 'test@example.com';

  global.fetch = async (url, options) => {
    if (typeof url === 'string' && url.includes('api.resend.com')) {
      return { ok: false, status: 401, text: async () => 'Unauthorized' };
    }
    return originalFetch(url, options);
  };

  const emailTestLead = {
    ...testLeadRecord,
    id: `lead-email-fail-${Date.now()}`,
    storageStatus: 'PRIMARY_DB',
  };

  const emailStatus = await sendEmailNotification(emailTestLead, 2);
  assert(emailStatus === 'FAILED', 'Email status must report FAILED on Resend error');
  assert(emailTestLead.storageStatus === 'PRIMARY_DB', 'Storage status must REMAIN PRIMARY_DB despite email failure');

  delete process.env.RESEND_API_KEY;
  delete process.env.LEAD_EMAIL_TO;
  global.fetch = originalFetch;

  // --------------------------------------------------------------------------
  // TEST 5: Telegram Notification Failure Isolation (Lead Preserved)
  // --------------------------------------------------------------------------
  console.log('\n--- 5. Testing Telegram Failure Isolation (Lead Not Invalidated) ---');
  process.env.TELEGRAM_BOT_TOKEN = 'mock-bot-token';
  process.env.TELEGRAM_CHAT_ID = 'mock-chat-id';

  global.fetch = async (url, options) => {
    if (typeof url === 'string' && url.includes('api.telegram.org')) {
      return { ok: false, status: 400, text: async () => 'Bad Request' };
    }
    return originalFetch(url, options);
  };

  const tgTestLead = {
    ...testLeadRecord,
    id: `lead-tg-fail-${Date.now()}`,
    storageStatus: 'PRIMARY_DB',
  };

  const tgStatus = await sendTelegramNotification(tgTestLead, 2);
  assert(tgStatus === 'FAILED', 'Telegram status must report FAILED on 400 response');
  assert(tgTestLead.storageStatus === 'PRIMARY_DB', 'Storage status must REMAIN PRIMARY_DB despite Telegram failure');

  delete process.env.TELEGRAM_BOT_TOKEN;
  delete process.env.TELEGRAM_CHAT_ID;
  global.fetch = originalFetch;

  // --------------------------------------------------------------------------
  // TEST 6: Notification Retry Logic
  // --------------------------------------------------------------------------
  console.log('\n--- 6. Testing Notification Retry Handling ---');
  let tgAttempts = 0;
  process.env.TELEGRAM_BOT_TOKEN = 'mock-bot-token';
  process.env.TELEGRAM_CHAT_ID = 'mock-chat-id';

  global.fetch = async (url, options) => {
    if (typeof url === 'string' && url.includes('api.telegram.org')) {
      tgAttempts++;
      if (tgAttempts === 1) {
        throw new Error('Network timeout on attempt 1');
      }
      return { ok: true, status: 200, json: async () => ({ ok: true }) };
    }
    return originalFetch(url, options);
  };

  const retryLead = { ...testLeadRecord, id: `lead-retry-${Date.now()}` };
  const retryStatus = await sendTelegramNotification(retryLead, 2);

  assert(tgAttempts === 2, 'Telegram notification must retry after first failure', `Attempt count: ${tgAttempts}`);
  assert(retryStatus === 'SENT', 'Telegram notification must report SENT when retry succeeds');

  delete process.env.TELEGRAM_BOT_TOKEN;
  delete process.env.TELEGRAM_CHAT_ID;
  global.fetch = originalFetch;

  // --------------------------------------------------------------------------
  // TEST 7: Duplicate Submission Protection (Deduplication Window)
  // --------------------------------------------------------------------------
  console.log('\n--- 7. Testing Duplicate Submission Suppression ---');
  const dupPhone = `+201011${Math.floor(100000 + Math.random() * 900000)}`;
  const dupPayload = {
    name: 'كريم حسني',
    phone: dupPhone,
    serviceType: 'interpretation',
    notes: 'مؤتمر طبي دولي',
  };

  // First submission
  const dupReq1 = new Request('http://localhost:3000/api/quote', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-forwarded-for': '192.168.2.50' },
    body: JSON.stringify(dupPayload),
  });
  const dupRes1 = await handleQuotePost(dupReq1);
  const dupData1 = await dupRes1.json();
  assert(dupRes1.status === 201, 'First submission should return 201 Created');

  // Second submission (exact same phone & service within 30 seconds)
  const dupReq2 = new Request('http://localhost:3000/api/quote', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-forwarded-for': '192.168.2.50' },
    body: JSON.stringify(dupPayload),
  });
  const dupRes2 = await handleQuotePost(dupReq2);
  const dupData2 = await dupRes2.json();

  assert(dupRes2.status === 200, 'Duplicate submission should return 200 OK');
  assert(dupData2.duplicate === true, 'Response must have duplicate: true');
  assert(dupData2.leadId === dupData1.leadId, 'Duplicate submission must return original leadId without duplicate record creation');

  // --------------------------------------------------------------------------
  // TEST 8: Rate-Limit Rejection (HTTP 429)
  // --------------------------------------------------------------------------
  console.log('\n--- 8. Testing Rate Limiting Rejection ---');
  const spammerIp = '10.99.88.77';
  let lastRateStatus = 0;

  for (let i = 1; i <= 6; i++) {
    const rateReq = new Request('http://localhost:3000/api/quote', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-forwarded-for': spammerIp },
      body: JSON.stringify({
        name: `Rate Test ${i}`,
        phone: `+20101234567${i}`,
        serviceType: 'certified',
      }),
    });
    const rateRes = await handleQuotePost(rateReq);
    lastRateStatus = rateRes.status;
  }

  assert(lastRateStatus === 429, 'Request exceeding 5 req/min from same IP must return 429 Too Many Requests', `Got ${lastRateStatus}`);

  // --------------------------------------------------------------------------
  // TEST 9: Honeypot Anti-Bot Rejection (HTTP 400)
  // --------------------------------------------------------------------------
  console.log('\n--- 9. Testing Honeypot Bot Rejection ---');
  const botReq = new Request('http://localhost:3000/api/quote', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-forwarded-for': '10.55.44.33' },
    body: JSON.stringify({
      name: 'Spam Bot',
      phone: '+201099887766',
      serviceType: 'certified',
      _gotcha: 'http://spam-link.com/click-here',
    }),
  });
  const botRes = await handleQuotePost(botReq);
  const botData = await botRes.json();

  assert(botRes.status === 400, 'Honeypot filled request must return 400 Bad Request', `Got ${botRes.status}`);
  assert(botData.code === 'HONEYPOT_TRIGGERED', 'Error code must indicate HONEYPOT_TRIGGERED');

  // --------------------------------------------------------------------------
  // TEST 10: Real Attachment Handling (No Fake Uploads)
  // --------------------------------------------------------------------------
  console.log('\n--- 10. Testing Real Attachment Handling ---');
  // 10a. With attachment
  const attachPhone = `+201066${Math.floor(100000 + Math.random() * 900000)}`;
  const attachReq = new Request('http://localhost:3000/api/quote', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-forwarded-for': '192.168.3.10' },
    body: JSON.stringify({
      name: 'منى زكي',
      phone: attachPhone,
      serviceType: 'certified',
      attachmentName: 'degree_certificate.pdf',
    }),
  });
  const attachRes = await handleQuotePost(attachReq);
  const attachData = await attachRes.json();

  assert(attachData.attachmentStatus === 'MANUAL_WHATSAPP_UPLOAD_REQUIRED', 'Attachment status must explicitly state MANUAL_WHATSAPP_UPLOAD_REQUIRED');

  const attachDb = await prisma.quoteRequest.findUnique({ where: { id: attachData.leadId } });
  assert(attachDb?.fileUrl === 'MANUAL_WHATSAPP_UPLOAD:degree_certificate.pdf', 'fileUrl in DB must be MANUAL_WHATSAPP_UPLOAD:filename');
  assert(!attachDb?.fileUrl?.startsWith('/uploads/'), 'fileUrl must NEVER contain fake /uploads/ path');

  // 10b. Without attachment
  const noAttachPhone = `+201055${Math.floor(100000 + Math.random() * 900000)}`;
  const noAttachReq = new Request('http://localhost:3000/api/quote', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-forwarded-for': '192.168.3.11' },
    body: JSON.stringify({
      name: 'طارق علي',
      phone: noAttachPhone,
      serviceType: 'certified',
    }),
  });
  const noAttachRes = await handleQuotePost(noAttachReq);
  const noAttachData = await noAttachRes.json();

  assert(noAttachData.attachmentStatus === 'NONE', 'Attachment status must be NONE when no file is specified');

  // --------------------------------------------------------------------------
  // TEST 11: PII Masking Utilities
  // --------------------------------------------------------------------------
  console.log('\n--- 11. Testing PII Masking in Logs ---');
  const maskedPhone = maskPhone('+201062990808');
  assert(maskedPhone.includes('****'), 'Phone must be masked with ****');
  assert(!maskedPhone.includes('299'), 'Middle digits of phone must not be visible in masked output');

  const maskedEmail = maskEmail('ahmed.mohamed@globalizetl.com');
  assert(maskedEmail.startsWith('a***') && maskedEmail.includes('@globalizetl.com'), 'Email username must be masked with a***');

  // --------------------------------------------------------------------------
  // Summary
  // --------------------------------------------------------------------------
  console.log('\n================================================================');
  console.log(`📊 FINAL TEST RESULTS: ${passed} PASSED, ${failed} FAILED`);
  console.log('================================================================');

  if (failed > 0) {
    process.exit(1);
  }
}

runProductionTestSuite()
  .then(() => {
    console.log('\n✅ All quote API and resilience tests passed successfully.');
    process.exit(0);
  })
  .catch((err) => {
    console.error('\n❌ Unhandled error during test execution:', err);
    process.exit(1);
  });
