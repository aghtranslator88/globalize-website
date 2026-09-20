"use client";

import { useState, useEffect } from "react";
import { Link, usePathname, useRouter } from "@/i18n/routing";
import { useLocale, useTranslations } from "next-intl";
import { Menu, X, Phone, MessageCircle } from "lucide-react";
import Image from "next/image";
import { trackWhatsAppClick, trackPhoneClick } from "@/lib/gtag";

export default function Navbar() {

  const t = useTranslations("Navbar");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

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
    <nav className="sticky top-0 z-50 w-full bg-white lg:bg-white/95 shadow-md lg:backdrop-blur-md transition-all duration-300">
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
          <a
            href="tel:+201062990808"
            onClick={() => trackPhoneClick({ cta_location: 'navbar_top_bar', language: locale })}
            className="flex items-center gap-1 text-[10px] text-gray-500 font-bold hover:text-primary-blue transition-colors cursor-pointer"
            dir="ltr"
          >
            <Phone className="h-3 w-3 text-primary-blue" />
            <span>+20 106 299 0808</span>
          </a>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative flex h-16 lg:h-20 items-center justify-between">
          {/* Logo and Brand Name */}
          <div className="flex items-center">
            <Link 
              href="/" 
              className="flex items-center group lg:static absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10"
            >
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
              {/* Mobile Full Logo */}
              <div className="relative flex lg:hidden h-9 sm:h-10 items-center justify-center transition-transform duration-300 group-hover:scale-[1.02]">
                <Image
                  src="/logo.png"
                  alt="Globalize Group Logo"
                  width={130}
                  height={62}
                  className="h-8.5 sm:h-9 w-auto object-contain"
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
              onClick={() => trackWhatsAppClick({ cta_location: 'header_navbar_desktop', language: locale })}
              className="flex items-center gap-1.5 rounded-xl bg-whatsapp-green text-white px-4 py-2 text-xs font-bold shadow-sm transition-all duration-300 hover:shadow-md animate-pulse-glow"
            >
              <MessageCircle className="h-3.5 w-3.5" />
              <span>{locale === 'ar' ? 'واتساب' : 'WhatsApp'}</span>
            </a>
          </div>


          {/* Mobile Menu button */}
          <div className="flex lg:hidden items-center ms-auto lg:ms-0">
            <button
              id="mobile-menu-toggle-btn"
              onClick={() => setIsOpen(!isOpen)}
              className="rounded-lg p-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900 focus:outline-none min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer"
              aria-label={isOpen ? (locale === 'ar' ? 'إغلاق القائمة الرئيسية' : 'Close navigation menu') : (locale === 'ar' ? 'فتح القائمة الرئيسية' : 'Open navigation menu')}
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Navigation (Side-sliding) */}
      {/* 1. Backdrop Overlay */}
      <div
        id="mobile-drawer-backdrop"
        className={`fixed inset-0 z-50 bg-black/50 transition-opacity duration-300 lg:hidden ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsOpen(false)}
        aria-hidden="true"
      />

      {/* 2. Slide-over Drawer */}
      <div
        id="mobile-nav-drawer"
        dir={locale === "ar" ? "rtl" : "ltr"}
        className={`fixed inset-y-0 z-50 w-[290px] sm:w-[320px] max-w-[85vw] h-screen h-[100dvh] bg-white shadow-2xl flex flex-col transition-transform duration-300 ease-in-out lg:hidden ${
          locale === "ar" ? "right-0" : "left-0"
        } ${
          isOpen
            ? "translate-x-0"
            : locale === "ar"
            ? "translate-x-full"
            : "-translate-x-full"
        }`}
        role="dialog"
        aria-modal="true"
        aria-label={locale === "ar" ? "قائمة التنقل" : "Navigation menu"}
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <button
            id="mobile-drawer-close-btn"
            onClick={() => setIsOpen(false)}
            className="rounded-lg p-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900 focus:outline-none min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer"
            aria-label={locale === "ar" ? "إغلاق القائمة" : "Close navigation menu"}
          >
            <X className="h-6 w-6" />
          </button>
          <div className="relative h-8 w-24 flex items-center justify-end rtl:justify-start">
            <Image
              src="/logo.png"
              alt="Globalize Group"
              width={100}
              height={48}
              className="h-7 w-auto object-contain"
            />
          </div>
        </div>

        {/* Drawer Navigation Links */}
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-1.5">
          {navItems.map((item) => (
            <Link
              key={item.key}
              href={item.path}
              onClick={() => setIsOpen(false)}
              className={`text-start block rounded-lg px-4 py-2.5 text-sm font-semibold transition-all ${
                pathname === item.path || (item.path !== "/" && pathname.startsWith(item.path))
                  ? "bg-primary-blue/10 text-primary-blue font-bold"
                  : "text-gray-700 hover:bg-gray-50 hover:text-primary-blue"
              }`}
            >
              {t(item.key)}
            </Link>
          ))}
        </div>

        {/* Drawer Footer (WhatsApp CTA) */}
        <div className="p-4 border-t border-gray-100 bg-gray-50/50">
          <a
            href={`https://wa.me/201062990808?text=${encodeURIComponent(locale === 'ar' ? 'أريد الاستفسار عن ترجمة معتمدة' : 'I would like to inquire about certified translation')}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => {
              trackWhatsAppClick({ cta_location: 'header_navbar_mobile', language: locale });
              setIsOpen(false);
            }}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-whatsapp-green py-3 text-sm font-bold text-white shadow-sm transition-all hover:bg-whatsapp-green/90 animate-pulse-glow"
          >
            <MessageCircle className="h-4 w-4" />
            <span>{locale === 'ar' ? 'تواصل معنا واتساب' : 'Contact on WhatsApp'}</span>
          </a>
        </div>
      </div>
    </nav>
  );
}
