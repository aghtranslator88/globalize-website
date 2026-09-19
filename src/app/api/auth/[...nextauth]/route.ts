import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

// ============================================================================
// Distributed Login Rate Limiter (Upstash Redis with In-Memory Fallback)
// Max 5 failed attempts per IP within 15 minutes across all serverless instances
// ============================================================================
interface LoginAttemptRecord {
  failedAttempts: number;
  lockedUntil: number;
}

const loginAttempts = new Map<string, LoginAttemptRecord>();
const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_WINDOW_MS = 15 * 60 * 1000; // 15 minutes

function getClientIp(req: any): string {
  if (!req) return "127.0.0.1";
  const headers = req.headers || {};
  const forwarded = headers["x-forwarded-for"] || headers["x-real-ip"];
  if (typeof forwarded === "string") {
    return forwarded.split(",")[0].trim();
  }
  return "127.0.0.1";
}

async function checkLoginRateLimit(ip: string): Promise<{ allowed: boolean; remainingMs: number }> {
  const upstashUrl = process.env.UPSTASH_REDIS_REST_URL?.replace(/\/+$/, "");
  const upstashToken = process.env.UPSTASH_REDIS_REST_TOKEN;

  // 1. Distributed Check via Upstash Redis (if configured)
  if (upstashUrl && upstashToken) {
    try {
      const res = await fetch(`${upstashUrl}/get/ratelimit:login:${ip}`, {
        headers: { Authorization: `Bearer ${upstashToken}` },
        signal: AbortSignal.timeout(3000),
      });
      if (res.ok) {
        const data = await res.json();
        const count = parseInt(data.result || "0", 10);
        if (count >= MAX_FAILED_ATTEMPTS) {
          return { allowed: false, remainingMs: LOCKOUT_WINDOW_MS };
        }
      }
    } catch {
      // Fall through to in-memory on Redis network error
    }
  }

  // 2. In-Memory Fallback (Instance level)
  const record = loginAttempts.get(ip);
  if (!record) {
    return { allowed: true, remainingMs: 0 };
  }

  const now = Date.now();
  if (record.lockedUntil > now) {
    return { allowed: false, remainingMs: record.lockedUntil - now };
  }

  if (record.lockedUntil > 0 && record.lockedUntil <= now) {
    loginAttempts.delete(ip);
  }

  return { allowed: true, remainingMs: 0 };
}

async function recordFailedLogin(ip: string): Promise<void> {
  const upstashUrl = process.env.UPSTASH_REDIS_REST_URL?.replace(/\/+$/, "");
  const upstashToken = process.env.UPSTASH_REDIS_REST_TOKEN;

  // 1. Increment distributed counter in Upstash Redis with 15-minute TTL
  if (upstashUrl && upstashToken) {
    try {
      await fetch(`${upstashUrl}/pipeline`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${upstashToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify([
          ["INCR", `ratelimit:login:${ip}`],
          ["EXPIRE", `ratelimit:login:${ip}`, 900], // 15 minutes
        ]),
        signal: AbortSignal.timeout(3000),
      });
    } catch {
      // Fall through to in-memory
    }
  }

  // 2. In-memory record update
  const now = Date.now();
  const record = loginAttempts.get(ip) || { failedAttempts: 0, lockedUntil: 0 };
  record.failedAttempts += 1;

  if (record.failedAttempts >= MAX_FAILED_ATTEMPTS) {
    record.lockedUntil = now + LOCKOUT_WINDOW_MS;
  }

  loginAttempts.set(ip, record);
}

async function recordSuccessfulLogin(ip: string): Promise<void> {
  const upstashUrl = process.env.UPSTASH_REDIS_REST_URL?.replace(/\/+$/, "");
  const upstashToken = process.env.UPSTASH_REDIS_REST_TOKEN;

  // 1. Reset distributed counter in Upstash Redis
  if (upstashUrl && upstashToken) {
    try {
      await fetch(`${upstashUrl}/del/ratelimit:login:${ip}`, {
        headers: { Authorization: `Bearer ${upstashToken}` },
        signal: AbortSignal.timeout(3000),
      });
    } catch {
      // Ignore
    }
  }

  // 2. Clear in-memory record
  loginAttempts.delete(ip);
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "البريد الإلكتروني / Email", type: "email" },
        password: { label: "كلمة المرور / Password", type: "password" },
      },
      async authorize(credentials, req) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const clientIp = getClientIp(req);
        const rateCheck = await checkLoginRateLimit(clientIp);

        if (!rateCheck.allowed) {
          throw new Error("TOO_MANY_REQUESTS");
        }

        const inputEmail = credentials.email.trim().toLowerCase();
        const inputPassword = credentials.password;

        const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
        const adminPassHash = process.env.ADMIN_PASSWORD_HASH;
        const editorEmail = process.env.EDITOR_EMAIL?.trim().toLowerCase();
        const editorPassHash = process.env.EDITOR_PASSWORD_HASH;

        // Verify Admin Credentials
        if (adminEmail && adminPassHash && inputEmail === adminEmail) {
          const isValid = bcrypt.compareSync(inputPassword, adminPassHash);
          if (isValid) {
            await recordSuccessfulLogin(clientIp);
            return {
              id: "1",
              name: "مدير النظام (Admin)",
              email: adminEmail,
              role: "ADMIN",
            };
          }
        }

        // Verify Editor Credentials
        if (editorEmail && editorPassHash && inputEmail === editorEmail) {
          const isValid = bcrypt.compareSync(inputPassword, editorPassHash);
          if (isValid) {
            await recordSuccessfulLogin(clientIp);
            return {
              id: "2",
              name: "محرر المحتوى (Editor)",
              email: editorEmail,
              role: "EDITOR",
            };
          }
        }

        // Record failed attempt on credentials mismatch
        await recordFailedLogin(clientIp);
        return null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).role = token.role;
      }
      return session;
    },
  },
  pages: {
    signIn: "/dashboard/login",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
