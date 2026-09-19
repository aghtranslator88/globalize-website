import { useLocale } from "next-intl";
import { Search, Home, ArrowLeft, ArrowRight } from "lucide-react";
import { Link } from "@/i18n/routing";

export default function NotFoundPage() {
  const locale = useLocale();
  const isAr = locale === "ar";
  const ArrowIcon = isAr ? ArrowLeft : ArrowRight;

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16 font-arabic bg-gray-50/50">
      <div className="max-w-md w-full bg-white rounded-2xl p-8 border border-gray-150 shadow-xl text-center space-y-6">
        <div className="mx-auto w-16 h-16 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-primary-blue">
          <Search className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <span className="text-3xl font-black text-primary-blue">404</span>
          <h2 className="text-xl font-bold text-dark-navy">
            {isAr ? "الصفحة المطلوبة غير موجودة" : "Page Not Found"}
          </h2>
          <p className="text-xs text-gray-500 leading-relaxed">
            {isAr
              ? "يبدو أن الصفحة التي تبحث عنها قد تم نقلها أو حذفها، أو أن الرابط غير صحيح."
              : "The page you are looking for may have been moved, deleted, or the URL might be incorrect."}
          </p>
        </div>

        <div className="pt-2">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl bg-gradient-to-r from-gold to-yellow-500 text-dark-navy text-xs font-bold hover:shadow-md transition-all shadow-xs"
          >
            <Home className="w-4 h-4" />
            <span>{isAr ? "العودة إلى الصفحة الرئيسية" : "Back to Home"}</span>
            <ArrowIcon className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
