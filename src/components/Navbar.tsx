"use client";

import { useState } from "react";
import { Link, usePathname, useRouter } from "@/i18n/routing";
import { useLocale, useTranslations } from "next-intl";
import { Menu, X, Phone, Globe, MessageCircle } from "lucide-react";
import Image from "next/image";

export default function Navbar() {
  const t = useTranslations("Navbar");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const switchLocale = (newLocale: string) => {
    router.replace(pathname, { locale: newLocale });
  };

  const navItems = [
    { key: "home", path: "/" },
    { key: "certified", path: "/certified" },
    { key: "localization", path: "/localization" },
    { key: "interpretation", path: "/interpretation" },
    { key: "documents", path: "/documents" },
    { key: "branches", path: "/branches" },
    { key: "team", path: "/team" },
    { key: "reviews", path: "/reviews" },
    { key: "blog", path: "/blog" },
    { key: "contact", path: "/contact" },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/95 shadow-md backdrop-blur-md transition-all duration-300">
      {/* Top Bar for Language Switcher (always left aligned using dir="ltr") */}
      <div className="w-full bg-gray-50 border-b border-gray-100 py-1 px-4 sm:px-6 lg:px-8" dir="ltr">
        <div className="mx-auto max-w-7xl flex justify-between items-center">
          {/* Top Left: Language Selector */}
          <div className="flex items-center gap-1 rounded-md border border-gray-200 bg-white p-0.5 shadow-sm">
            <button
              onClick={() => switchLocale("ar")}
              aria-label="تغيير اللغة إلى العربية"
              className={`rounded px-2 py-0.5 text-[10px] font-bold transition-all cursor-pointer ${
                locale === "ar" ? "bg-primary-blue text-white" : "text-gray-500 hover:text-gray-900"
              }`}
            >
              العربية
            </button>
            <button
              onClick={() => switchLocale("en")}
              aria-label="Switch language to English"
              className={`rounded px-2 py-0.5 text-[10px] font-bold transition-all cursor-pointer ${
                locale === "en" ? "bg-primary-blue text-white" : "text-gray-500 hover:text-gray-900"
              }`}
            >
              EN
            </button>
          </div>
          {/* Top Right: Call center */}
          <div className="flex items-center gap-1 text-[10px] text-gray-500 font-bold">
            <Phone className="h-3 w-3 text-primary-blue" />
            <span>+20 106 299 0808</span>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          {/* Logo and Brand Name */}
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center group">
              {/* Desktop Wide Logo */}
              <div className="relative hidden lg:flex h-11 w-36 items-center justify-start transition-transform duration-300 group-hover:scale-[1.02]">
                <Image
                  src="/logo.png"
                  alt="Globalize Group Logo"
                  width={135}
                  height={42}
                  className="object-contain object-left rtl:object-right"
                  priority
                />
              </div>
              {/* Mobile Square Icon Logo */}
              <div className="relative flex lg:hidden h-9 w-9 items-center justify-center transition-transform duration-300 group-hover:scale-[1.05]">
                <Image
                  src="/logo-icon.png"
                  alt="Globalize Group Icon"
                  width={32}
                  height={32}
                  className="object-contain"
                  priority
                />
              </div>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navItems.map((item) => (
              <Link
                key={item.key}
                href={item.path}
                className={`px-2 py-1.5 text-xs font-semibold rounded-lg transition-all duration-200 hover:bg-light-sky/10 hover:text-primary-blue ${
                  pathname === item.path || (item.path !== "/" && pathname.startsWith(item.path))
                    ? "text-primary-blue bg-light-sky/15"
                    : "text-gray-600"
                }`}
              >
                {t(item.key)}
              </Link>
            ))}
          </div>

          {/* Right Utilities (Locale & CTA) */}
          <div className="hidden lg:flex items-center gap-4">
            {/* Gold WhatsApp CTA button */}
            <a
              href={`https://wa.me/201062990808?text=${encodeURIComponent(locale === 'ar' ? 'أريد الاستفسار عن ترجمة معتمدة' : 'I would like to inquire about certified translation')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 rounded-xl bg-whatsapp-green text-white px-4 py-2 text-xs font-bold shadow-sm transition-all duration-300 hover:shadow-md animate-pulse-glow"
            >
              <MessageCircle className="h-3.5 w-3.5" />
              <span>{locale === 'ar' ? 'واتساب' : 'WhatsApp'}</span>
            </a>
          </div>

          {/* Mobile Menu button */}
          <div className="flex lg:hidden items-center gap-3">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="rounded-lg p-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900 focus:outline-none"
              aria-label={isOpen ? (locale === 'ar' ? 'إغلاق القائمة الرئيسية' : 'Close navigation menu') : (locale === 'ar' ? 'فتح القائمة الرئيسية' : 'Open navigation menu')}
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      {isOpen && (
        <div className="lg:hidden border-t border-gray-100 bg-white/95 px-4 pb-6 pt-4 shadow-inner backdrop-blur-md">
          <div className="flex flex-col gap-2">
            {navItems.map((item) => (
              <Link
                key={item.key}
                href={item.path}
                onClick={() => setIsOpen(false)}
                className={`block rounded-lg px-4 py-2.5 text-sm font-semibold transition-all ${
                  pathname === item.path || (item.path !== "/" && pathname.startsWith(item.path))
                    ? "bg-primary-blue/10 text-primary-blue"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                {t(item.key)}
              </Link>
            ))}

            <div className="mt-4 pt-4 border-t border-gray-100">
              <a
                href={`https://wa.me/201062990808?text=${encodeURIComponent(locale === 'ar' ? 'أريد الاستفسار عن ترجمة معتمدة' : 'I would like to inquire about certified translation')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-whatsapp-green py-3 text-sm font-bold text-white shadow-sm animate-pulse-glow"
              >
                <MessageCircle className="h-4 w-4" />
                <span>{locale === 'ar' ? 'تواصل معنا واتساب' : 'Contact on WhatsApp'}</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
