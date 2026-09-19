"use client";

import { useEffect } from "react";
import { useLocale } from "next-intl";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import { Link } from "@/i18n/routing";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const locale = useLocale();
  const isAr = locale === "ar";

  useEffect(() => {
    console.error("Application runtime error:", error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16 font-arabic bg-gray-50/50">
      <div className="max-w-md w-full bg-white rounded-2xl p-8 border border-gray-150 shadow-xl text-center space-y-6">
        <div className="mx-auto w-14 h-14 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600">
          <AlertTriangle className="w-7 h-7" />
        </div>

        <div className="space-y-2">
          <h2 className="text-xl font-bold text-dark-navy">
            {isAr ? "عذراً، حدث خطأ غير متوقع" : "Something went wrong"}
          </h2>
          <p className="text-xs text-gray-500 leading-relaxed">
            {isAr
              ? "نعتذر عن هذا الخطأ المؤقت. تم تسجيل المشكلة للتحقق منها، يمكنك إعادة المحاولة الآن أو العودة للصفحة الرئيسية."
              : "We apologize for this temporary issue. You can try refreshing or return to the home page."}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button
            onClick={() => reset()}
            className="flex-1 inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-primary-blue text-white text-xs font-bold hover:bg-blue-800 transition-colors shadow-sm cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
            <span>{isAr ? "إعادة المحاولة" : "Try Again"}</span>
          </button>
          <Link
            href="/"
            className="flex-1 inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gray-100 text-dark-navy text-xs font-bold hover:bg-gray-200 transition-colors"
          >
            <Home className="w-4 h-4" />
            <span>{isAr ? "الصفحة الرئيسية" : "Home"}</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
