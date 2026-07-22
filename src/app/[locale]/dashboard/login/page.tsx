"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { Lock, Mail, Loader2, AlertCircle } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const locale = useLocale();
  const isAr = locale === "ar";
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (res?.error) {
        setError(
          isAr
            ? "البريد الإلكتروني أو كلمة المرور غير صحيحة"
            : "Invalid email or password"
        );
      } else {
        router.push(`/${locale}/dashboard`);
        router.refresh();
      }
    } catch (err) {
      console.error(err);
      setError(isAr ? "حدث خطأ غير متوقع" : "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50/50 px-4 py-12 sm:px-6 lg:px-8 font-arabic">
      <div className="w-full max-w-md space-y-8 rounded-2xl bg-white p-8 shadow-xl border border-gray-150 relative overflow-hidden">
        {/* Decorative arc */}
        <div className="absolute top-0 right-0 left-0 h-2 bg-gradient-to-r from-dark-navy to-primary-blue"></div>

        <div className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-primary-blue text-white font-bold text-xl shadow-md">
            G
          </div>
          <h2 className="mt-6 text-xl font-bold text-dark-navy">
            {isAr ? "تسجيل دخول لوحة التحكم" : "Dashboard Login"}
          </h2>
          <p className="mt-2 text-xs text-gray-500">
            {isAr 
              ? "أدخل بيانات الاعتماد الخاصة بك للوصول إلى لوحة الإدارة" 
              : "Enter your credentials to access the admin area"}
          </p>
        </div>

        {error && (
          <div className="flex items-center gap-2 rounded-xl bg-red-50 p-4 text-xs text-red-800 border border-red-200">
            <AlertCircle className="h-4.5 w-4.5 text-red-600 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-xs font-bold text-dark-navy mb-1.5">
                {isAr ? "البريد الإلكتروني" : "Email Address"}
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 pl-10 pr-4 py-3 text-xs bg-gray-50/50 outline-none focus:bg-white focus:ring-4 focus:ring-primary-blue/10 transition-all"
                  placeholder="admin@globalizetl.com"
                />
                <Mail className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-gray-400" />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-bold text-dark-navy mb-1.5">
                {isAr ? "كلمة المرور" : "Password"}
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 pl-10 pr-4 py-3 text-xs bg-gray-50/50 outline-none focus:bg-white focus:ring-4 focus:ring-primary-blue/10 transition-all"
                  placeholder="••••••••"
                />
                <Lock className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-gray-400" />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-gold to-yellow-500 py-3.5 text-xs font-bold text-dark-navy shadow-md hover:shadow-lg transition-all"
          >
            {loading ? (
              <>
                <Loader2 className="h-4.5 w-4.5 animate-spin" />
                <span>{isAr ? "جاري التحميل..." : "Loading..."}</span>
              </>
            ) : (
              <span>{isAr ? "تسجيل الدخول" : "Sign In"}</span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
