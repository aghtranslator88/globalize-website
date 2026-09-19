import { prisma } from '@/lib/prisma';
import * as Sentry from '@sentry/nextjs';
import crypto from 'crypto';

// ============================================================================
// Types & Contracts
// ============================================================================
export type StorageStatus = 'PRIMARY_DB' | 'FALLBACK_STORE' | 'FAILED';
export type NotificationStatus = 'SENT' | 'FAILED' | 'NOT_CONFIGURED' | 'SKIPPED';
export type AttachmentStatus = 'MANUAL_WHATSAPP_UPLOAD_REQUIRED' | 'NONE';

export interface LeadInput {
  name: string;
  phone: string;
  email?: string | null;
  serviceType: string;
  attachmentName?: string | null;
  fileUrl?: string | null;
  notes?: string | null;
}

export interface LeadRecord {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  serviceType: string;
  notes: string | null;
  attachmentName: string | null;
  attachmentStatus: AttachmentStatus;
  createdAt: string;
  storageStatus: StorageStatus;
  emailStatus: NotificationStatus;
  telegramStatus: NotificationStatus;
  retryCount: number;
  lastError: string | null;
}

export interface StoreLeadResult {
  success: boolean;
  lead: LeadRecord;
  isDuplicate?: boolean;
  error?: string | null;
}

// ============================================================================
// 1. PII Masking Utilities (Logs & Monitoring Safety)
// ============================================================================
export function maskPhone(phone: string): string {
  if (!phone) return '***';
  const digits = phone.replace(/\s+/g, '');
  if (digits.length <= 6) return digits.slice(0, 2) + '****';
  return digits.slice(0, 4) + '****' + digits.slice(-3);
}

export function maskEmail(email: string | null | undefined): string {
  if (!email) return 'none';
  const parts = email.split('@');
  if (parts.length !== 2) return '***@***';
  const name = parts[0];
  const domain = parts[1];
  const maskedName = name.length > 2 ? name[0] + '***' + name[name.length - 1] : name[0] + '***';
  return `${maskedName}@${domain}`;
}

// ============================================================================
// 2. In-Memory Sliding Window Rate Limiter (Serverless Friendly)
// ============================================================================
interface RateLimitRecord {
  timestamps: number[];
}

const rateLimitMap = new Map<string, RateLimitRecord>();
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 5;      // 5 requests per minute

// Clean up expired entries periodically
setInterval(() => {
  const now = Date.now();
  for (const [ip, record] of rateLimitMap.entries()) {
    record.timestamps = record.timestamps.filter(t => now - t < RATE_LIMIT_WINDOW_MS);
    if (record.timestamps.length === 0) {
      rateLimitMap.delete(ip);
    }
  }
}, 5 * 60 * 1000).unref?.();

export function checkRateLimit(ip: string): { allowed: boolean; remaining: number } {
  const now = Date.now();
  let record = rateLimitMap.get(ip);
  if (!record) {
    record = { timestamps: [] };
    rateLimitMap.set(ip, record);
  }

  record.timestamps = record.timestamps.filter(t => now - t < RATE_LIMIT_WINDOW_MS);

  if (record.timestamps.length >= MAX_REQUESTS_PER_WINDOW) {
    return { allowed: false, remaining: 0 };
  }

  record.timestamps.push(now);
  return { allowed: true, remaining: MAX_REQUESTS_PER_WINDOW - record.timestamps.length };
}

// ============================================================================
// 3. Deduplication Cache (Prevents double-click duplicate leads & duplicate alerts)
// ============================================================================
interface DedupEntry {
  timestamp: number;
  lead: LeadRecord;
}

const dedupMap = new Map<string, DedupEntry>();
const DEDUP_WINDOW_MS = 30 * 1000; // 30 seconds

setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of dedupMap.entries()) {
    if (now - entry.timestamp > DEDUP_WINDOW_MS) {
      dedupMap.delete(key);
    }
  }
}, 60 * 1000).unref?.();

function getDedupKey(phone: string, serviceType: string): string {
  const cleanPhone = phone.replace(/\D/g, '');
  const cleanService = serviceType.trim().toLowerCase();
  return `${cleanPhone}:${cleanService}`;
}

export function checkDuplicateLead(phone: string, serviceType: string): LeadRecord | null {
  const key = getDedupKey(phone, serviceType);
  const existing = dedupMap.get(key);
  if (existing && Date.now() - existing.timestamp < DEDUP_WINDOW_MS) {
    return existing.lead;
  }
  return null;
}

export function registerDuplicateLead(lead: LeadRecord): void {
  const key = getDedupKey(lead.phone, lead.serviceType);
  dedupMap.set(key, { timestamp: Date.now(), lead });
}

// ============================================================================
// 4. Primary Database Storage (PostgreSQL via Prisma with Retry)
// ============================================================================
export async function saveToPrimaryDatabase(lead: LeadRecord, maxRetries = 3): Promise<{ success: boolean; error?: unknown }> {
  let lastError: unknown = null;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      // Encode optional email into notes prefix so schema remains 100% backward compatible
      const finalNotes = lead.email 
        ? `[Email: ${lead.email}]\n${lead.notes || ''}`.trim()
        : (lead.notes || null);

      const dbFileUrl = lead.attachmentName 
        ? `MANUAL_WHATSAPP_UPLOAD:${lead.attachmentName}`
        : null;

      await prisma.quoteRequest.create({
        data: {
          id: lead.id,
          name: lead.name,
          phone: lead.phone,
          serviceType: lead.serviceType,
          fileUrl: dbFileUrl,
          notes: finalNotes,
          status: 'NEW',
        },
      });

      return { success: true };
    } catch (err) {
      lastError = err;
      lead.retryCount = attempt;
      console.warn(`[PrimaryDB] Attempt ${attempt}/${maxRetries} failed:`, {
        leadId: lead.id,
        maskedPhone: maskPhone(lead.phone),
        error: String(err),
      });

      if (attempt < maxRetries) {
        const delay = Math.min(150 * Math.pow(2, attempt - 1), 1000);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }

  return { success: false, error: lastError };
}

// ============================================================================
// 5. Persistent External Fallback Store (Upstash Redis REST API)
// ============================================================================
export async function saveToPersistentFallback(lead: LeadRecord, maxRetries = 2): Promise<{ success: boolean; error?: string }> {
  const upstashUrl = process.env.UPSTASH_REDIS_REST_URL?.replace(/\/+$/, '');
  const upstashToken = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!upstashUrl || !upstashToken) {
    const msg = 'Persistent fallback store (Upstash Redis) is not configured in environment variables.';
    console.warn(`[FallbackStore] ${msg}`);
    return { success: false, error: msg };
  }

  let lastError: string | null = null;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      // Execute atomic pipeline: save complete lead record and push to fallback queue
      const pipelineBody = [
        ['SET', `lead:quote:${lead.id}`, JSON.stringify(lead)],
        ['RPUSH', 'queue:fallback_quotes', JSON.stringify({
          id: lead.id,
          name: lead.name,
          phone: lead.phone,
          email: lead.email,
          serviceType: lead.serviceType,
          attachmentName: lead.attachmentName,
          attachmentStatus: lead.attachmentStatus,
          createdAt: lead.createdAt,
        })],
      ];

      const response = await fetch(`${upstashUrl}/pipeline`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${upstashToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(pipelineBody),
      });

      if (response.ok) {
        console.log(`[FallbackStore] Lead ${lead.id} safely stored in Upstash Redis fallback.`);
        return { success: true };
      }

      const text = await response.text();
      lastError = `Upstash HTTP ${response.status}: ${text}`;
    } catch (err) {
      lastError = String(err);
    }

    if (attempt < maxRetries) {
      await new Promise(resolve => setTimeout(resolve, 200));
    }
  }

  return { success: false, error: lastError || 'Unknown Upstash failure' };
}

// ============================================================================
// 6. Complete Storage Orchestrator
// ============================================================================
export async function storeLeadPermanently(input: LeadInput): Promise<StoreLeadResult> {
  const rawAttachment = input.attachmentName || input.fileUrl || null;
  const attachmentName = rawAttachment ? rawAttachment.trim() : null;
  const attachmentStatus: AttachmentStatus = attachmentName 
    ? 'MANUAL_WHATSAPP_UPLOAD_REQUIRED' 
    : 'NONE';

  // Check for duplicate submission within deduplication window
  const duplicate = checkDuplicateLead(input.phone, input.serviceType);
  if (duplicate) {
    console.log(`[StoreLead] Duplicate submission detected for ${maskPhone(input.phone)} - returning existing lead ${duplicate.id}`);
    return {
      success: true,
      lead: duplicate,
      isDuplicate: true,
    };
  }

  const leadId = crypto.randomUUID();
  const lead: LeadRecord = {
    id: leadId,
    name: input.name.trim(),
    phone: input.phone.trim(),
    email: input.email ? input.email.trim() : null,
    serviceType: input.serviceType.trim(),
    notes: input.notes ? input.notes.trim() : null,
    attachmentName,
    attachmentStatus,
    createdAt: new Date().toISOString(),
    storageStatus: 'FAILED',
    emailStatus: 'NOT_CONFIGURED',
    telegramStatus: 'NOT_CONFIGURED',
    retryCount: 0,
    lastError: null,
  };

  // STEP 1: Attempt Primary PostgreSQL Storage
  const dbResult = await saveToPrimaryDatabase(lead, 3);
  if (dbResult.success) {
    lead.storageStatus = 'PRIMARY_DB';
    registerDuplicateLead(lead);
    console.log(`[StoreLead] Lead ${lead.id} successfully saved to Primary PostgreSQL DB.`);
    return { success: true, lead };
  }

  // STEP 2: Primary DB Failed -> Attempt Persistent Fallback Store (Upstash Redis)
  console.warn(`[StoreLead] Primary DB failed for lead ${lead.id}. Triggering persistent external fallback.`);
  lead.lastError = `Primary DB failed: ${String(dbResult.error)}`;

  const fallbackResult = await saveToPersistentFallback(lead, 2);
  if (fallbackResult.success) {
    lead.storageStatus = 'FALLBACK_STORE';
    registerDuplicateLead(lead);

    try {
      Sentry.captureMessage(`Lead saved to Fallback Store: ${lead.name} (${maskPhone(lead.phone)})`, {
        level: 'warning',
        tags: { leadId: lead.id, storageStatus: 'FALLBACK_STORE' },
        extra: { serviceType: lead.serviceType, lastError: lead.lastError },
      });
    } catch {
      // Sentry log error ignored
    }

    return { success: true, lead };
  }

  // STEP 3: Both Primary DB and Persistent Fallback Failed -> Return Storage Failure
  lead.storageStatus = 'FAILED';
  lead.lastError = `Primary DB failed (${String(dbResult.error)}) AND Fallback Store failed (${fallbackResult.error})`;
  
  console.error(`[StoreLead] CRITICAL: Both Primary DB and Fallback Store failed for lead ${lead.id}!`, {
    maskedPhone: maskPhone(lead.phone),
    error: lead.lastError,
  });

  try {
    Sentry.captureException(new Error(`Total lead storage failure: ${lead.lastError}`), {
      level: 'error',
      tags: { leadId: lead.id, storageStatus: 'FAILED' },
      extra: { maskedPhone: maskPhone(lead.phone), serviceType: lead.serviceType },
    });
  } catch {
    // Sentry log error ignored
  }

  return { success: false, lead, error: lead.lastError };
}

// ============================================================================
// 7. Reliable Notification System (Runs ONLY after storage succeeds)
// ============================================================================
export async function sendTelegramNotification(lead: LeadRecord, maxRetries = 2): Promise<NotificationStatus> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    return 'NOT_CONFIGURED';
  }

  const storageTag = lead.storageStatus === 'PRIMARY_DB' 
    ? '✅ قاعدة البيانات الرئيسية' 
    : '⚠️ مخزن الطوارئ السحابي (Upstash Redis)';

  const attachmentText = lead.attachmentName
    ? `📎 *المستند المطلوب:* ${lead.attachmentName}\n*(مطلوب الإرفاق اليدوي عبر واتساب)*\n`
    : '';

  const emailText = lead.email ? `📧 *البريد الإلكتروني:* \`${lead.email}\`\n` : '';

  const message = `🔔 *طلب تسعير جديد — جلوبالايز*\n\n` +
    `🆔 *المعرف:* \`${lead.id}\`\n` +
    `👤 *الاسم:* ${lead.name}\n` +
    `📱 *الهاتف:* \`${lead.phone}\`\n` +
    emailText +
    `💼 *الخدمة:* ${lead.serviceType}\n` +
    attachmentText +
    (lead.notes ? `📝 *ملاحظات:* ${lead.notes}\n` : '') +
    `💾 *حالة الحفظ:* ${storageTag}\n` +
    `⏱ *التوقيت:* ${lead.createdAt}`;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text: message,
          parse_mode: 'Markdown',
        }),
      });

      if (res.ok) {
        return 'SENT';
      }
      console.warn(`[Telegram] Attempt ${attempt}/${maxRetries} failed with status: ${res.status}`);
    } catch (err) {
      console.warn(`[Telegram] Attempt ${attempt}/${maxRetries} error:`, String(err));
    }

    if (attempt < maxRetries) {
      await new Promise(resolve => setTimeout(resolve, 300 * attempt));
    }
  }

  return 'FAILED';
}

export async function sendEmailNotification(lead: LeadRecord, maxRetries = 2): Promise<NotificationStatus> {
  const resendApiKey = process.env.RESEND_API_KEY;
  const leadEmailTo = process.env.LEAD_EMAIL_TO;
  const leadEmailFrom = process.env.LEAD_EMAIL_FROM || 'Globalize Leads <onboarding@resend.dev>';

  if (!resendApiKey || !leadEmailTo) {
    return 'NOT_CONFIGURED';
  }

  const emailHtml = `
    <div style="font-family: Arial, sans-serif; direction: rtl; text-align: right; max-width: 600px; margin: 0 auto; border: 1px solid #eaeaea; border-radius: 8px; padding: 20px;">
      <h2 style="color: #1e3a8a; border-bottom: 2px solid #eab308; padding-bottom: 10px;">طلب تسعير جديد (جلوبالايز)</h2>
      <p><strong>المعرف:</strong> ${lead.id}</p>
      <p><strong>الاسم:</strong> ${lead.name}</p>
      <p><strong>الهاتف:</strong> ${lead.phone}</p>
      ${lead.email ? `<p><strong>البريد الإلكتروني:</strong> ${lead.email}</p>` : ''}
      <p><strong>نوع الخدمة:</strong> ${lead.serviceType}</p>
      ${lead.attachmentName ? `<p><strong>المستند المطلوب:</strong> ${lead.attachmentName} <em>(يرجى المتابعة على واتساب لاستلام الملف)</em></p>` : ''}
      ${lead.notes ? `<p><strong>الملاحظات:</strong> ${lead.notes}</p>` : ''}
      <p><strong>حالة التخزين:</strong> ${lead.storageStatus}</p>
      <p><strong>تاريخ الطلب:</strong> ${lead.createdAt}</p>
    </div>
  `;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${resendApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: leadEmailFrom,
          to: leadEmailTo,
          subject: `طلب تسعير جديد: ${lead.name} (${lead.serviceType})`,
          html: emailHtml,
        }),
      });

      if (res.ok) {
        return 'SENT';
      }
      console.warn(`[Email] Attempt ${attempt}/${maxRetries} failed with status: ${res.status}`);
    } catch (err) {
      console.warn(`[Email] Attempt ${attempt}/${maxRetries} error:`, String(err));
    }

    if (attempt < maxRetries) {
      await new Promise(resolve => setTimeout(resolve, 300 * attempt));
    }
  }

  return 'FAILED';
}

export async function dispatchNotifications(lead: LeadRecord): Promise<{ telegram: NotificationStatus; email: NotificationStatus }> {
  // Safety guard: NEVER send notifications if lead failed to store permanently!
  if (lead.storageStatus === 'FAILED') {
    lead.telegramStatus = 'SKIPPED';
    lead.emailStatus = 'SKIPPED';
    return { telegram: 'SKIPPED', email: 'SKIPPED' };
  }

  // Execute Telegram & Email notifications in parallel
  const [telegramStatus, emailStatus] = await Promise.all([
    sendTelegramNotification(lead, 2),
    sendEmailNotification(lead, 2),
  ]);

  lead.telegramStatus = telegramStatus;
  lead.emailStatus = emailStatus;

  // Optional custom webhook notification
  const webhookUrl = process.env.LEAD_NOTIFICATION_WEBHOOK_URL;
  if (webhookUrl) {
    try {
      await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event: 'quote.lead_stored',
          leadId: lead.id,
          storageStatus: lead.storageStatus,
          name: lead.name,
          phone: lead.phone,
          email: lead.email,
          serviceType: lead.serviceType,
          attachmentName: lead.attachmentName,
          attachmentStatus: lead.attachmentStatus,
          notes: lead.notes,
          createdAt: lead.createdAt,
        }),
      });
    } catch (hookErr) {
      console.warn('[Webhook] Custom webhook dispatch failed:', String(hookErr));
    }
  }

  return { telegram: telegramStatus, email: emailStatus };
}
