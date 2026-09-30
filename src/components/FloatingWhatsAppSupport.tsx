"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { X, CheckCheck } from "lucide-react";
import { useLocale } from "next-intl";
import { trackWhatsAppClick } from "@/lib/gtag";

export default function FloatingWhatsAppSupport() {
  const locale = useLocale();
  const isArabic = locale === "ar";

  const [isOpen, setIsOpen] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);

  // Auto-open greeting after 2.5 seconds unless dismissed in this session
  useEffect(() => {
    try {
      const dismissed = sessionStorage.getItem("globalize_wa_dismissed");
      if (dismissed === "true") return;
    } catch {
      // Ignore storage errors in privacy mode
    }

    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  const handleDismiss = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsOpen(false);
    setHasInteracted(true);
    try {
      sessionStorage.setItem("globalize_wa_dismissed", "true");
    } catch {
      // Ignore storage errors
    }
  };

  const handleAvatarClick = () => {
    if (!isOpen) {
      setIsOpen(true);
      setHasInteracted(true);
    } else {
      // If already open, clicking the avatar initiates chat directly
      handleStartChat();
    }
  };

  const handleStartChat = () => {
    trackWhatsAppClick({
      cta_location: "floating_support_card",
      language: locale,
    });

    const defaultMsg = isArabic
      ? "مرحباً سارة، أريد الاستفسار عن ترجمة معتمدة لبعض المستندات"
      : "Hello Sarah, I would like to inquire about certified translation services";

    const waUrl = `https://wa.me/201062990808?text=${encodeURIComponent(defaultMsg)}`;
    window.open(waUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <div
      className={`fixed bottom-5 sm:bottom-6 z-50 flex flex-col items-end pointer-events-auto ${
        isArabic ? "left-5 sm:left-6 items-start" : "right-5 sm:right-6 items-end"
      }`}
      dir={isArabic ? "rtl" : "ltr"}
    >
      {/* 1. Welcome Chat Card / Bubble */}
      <div
        className={`transition-all duration-300 ease-out origin-bottom ${
          isArabic ? "origin-bottom-left" : "origin-bottom-right"
        } mb-3.5 w-[calc(100vw-2.5rem)] sm:w-[330px] rounded-2xl bg-white shadow-2xl border border-gray-100 dark:border-gray-800 overflow-hidden ${
          isOpen
            ? "opacity-100 scale-100 translate-y-0 pointer-events-auto"
            : "opacity-0 scale-90 translate-y-4 pointer-events-none h-0 mb-0 border-none"
        }`}
      >
        {/* Header with agent info & online status */}
        <div className="bg-gradient-to-r from-primary-blue to-[#0b2447] text-white p-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="relative h-10 w-10 rounded-full overflow-hidden border-2 border-gold shadow-sm">
                <Image
                  src="/images/support-agent.jpg"
                  alt={isArabic ? "سارة - مستشارة الترجمة" : "Sarah - Translation Advisor"}
                  fill
                  sizes="40px"
                  className="object-cover object-top"
                />
              </div>
              <span className="absolute bottom-0 end-0 h-3 w-3 rounded-full bg-emerald-500 border-2 border-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h4 className="font-bold text-sm leading-tight text-white">
                  {isArabic ? "سارة" : "Sarah"}
                </h4>
                <span className="text-[10px] bg-gold/25 text-gold px-1.5 py-0.5 rounded font-medium">
                  {isArabic ? "مستشارة معتمدة" : "Advisor"}
                </span>
              </div>
              <p className="text-[11px] text-gray-300 flex items-center gap-1 mt-0.5">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>{isArabic ? "متصلة الآن • رد فوري" : "Online now • Instant reply"}</span>
              </p>
            </div>
          </div>

          <button
            onClick={handleDismiss}
            aria-label={isArabic ? "إغلاق الرسالة الترحيبية" : "Close welcome card"}
            className="text-gray-300 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Message body */}
        <div className="p-4 bg-gray-50/70">
          <div className="bg-white rounded-2xl p-3 shadow-sm border border-gray-100 text-xs text-gray-800 leading-relaxed relative">
            <p className="font-medium text-gray-900 mb-1">
              {isArabic ? "أهلاً بك في جلوبالايز للترجمة المعتمدة! 👋" : "Welcome to Globalize Translation! 👋"}
            </p>
            <p className="text-gray-600">
              {isArabic
                ? "معك سارة، كيف يمكنني مساعدتك اليوم؟ تفضل بإرسال أوراقك للحصول على تسعيرة فورية وتأكيد اعتماد السفارات."
                : "I'm Sarah. How can I help you today? Send your documents for an instant quote and embassy accreditation check."}
            </p>
            <div className="flex items-center justify-end gap-1 mt-2 text-[10px] text-gray-400" dir="ltr">
              <span>{isArabic ? "الآن" : "Just now"}</span>
              <CheckCheck className="h-3.5 w-3.5 text-primary-blue" />
            </div>
          </div>

          {/* CTA Button */}
          <button
            onClick={handleStartChat}
            className="mt-3.5 w-full bg-[#25D366] hover:bg-[#20ba5a] text-white py-2.5 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all duration-200 active:scale-[0.98] cursor-pointer"
          >
            <svg className="h-4 w-4 fill-current flex-shrink-0" viewBox="0 0 24 24">
              <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.664-.698c.97.587 1.961.913 2.796.913h.005c3.179 0 5.767-2.587 5.767-5.766.001-3.181-2.586-5.768-5.766-5.768zm3.397 8.211c-.144.405-.837.774-1.17.824-.312.045-.694.072-2.128-.521-1.615-.67-2.66-2.307-2.74-2.414-.08-.106-.653-.869-.653-1.654 0-.785.412-1.171.558-1.328.146-.157.32-.196.427-.196.107 0 .213.001.306.006.1.005.234-.038.366.279.136.327.466 1.139.507 1.222.041.083.069.18.014.288-.055.108-.083.175-.165.271-.082.096-.173.214-.247.288-.082.079-.168.165-.072.33.096.165.426.703.914 1.138.628.56 1.157.734 1.322.816.165.083.262.072.36-.041.098-.113.42-.49.533-.622.113-.133.227-.113.371-.06.144.053.914.431 1.072.509.158.078.262.118.3.184.038.066.038.383-.106.788zM12 2C6.477 2 2 6.477 2 12c0 1.891.524 3.66 1.434 5.174L2 22l4.981-1.306C8.423 21.547 10.155 22 12 22c5.523 0 10-4.477 10-10S17.523 2 12 2z" />
            </svg>
            <span>{isArabic ? "تحدثي معي على واتساب الآن" : "Chat with me on WhatsApp"}</span>
          </button>

          {/* Trust footer note */}
          <p className="text-[10px] text-gray-500 text-center mt-2 font-medium">
            {isArabic ? "⚡ ترجمة معتمدة وموثوقة لجميع السفارات والجهات" : "⚡ Officially accredited for all embassies & ministries"}
          </p>
        </div>
      </div>

      {/* 2. Floating Avatar Trigger Button */}
      <button
        onClick={handleAvatarClick}
        aria-label={isArabic ? "تواصل مع خدمة العملاء عبر واتساب" : "Contact Customer Support on WhatsApp"}
        className="group relative flex items-center justify-center transition-transform duration-300 hover:scale-105 active:scale-95 focus:outline-none cursor-pointer"
      >
        {/* Pulsing glow effect */}
        <span className="absolute -inset-1 rounded-full bg-gradient-to-r from-emerald-500 to-[#25D366] opacity-60 blur-sm group-hover:opacity-100 animate-pulse transition-opacity" />

        {/* Main avatar circle */}
        <div className="relative h-15 w-15 sm:h-16 sm:w-16 rounded-full overflow-hidden border-[3px] border-white shadow-xl bg-white">
          <Image
            src="/images/support-agent.jpg"
            alt={isArabic ? "مستشارة خدمة العملاء جلوبالايز" : "Globalize Support Representative"}
            fill
            sizes="64px"
            className="object-cover object-top"
            priority
          />
        </div>

        {/* Online pulsing green dot indicator */}
        <span className="absolute top-0 end-0 flex h-4 w-4">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500 border-2 border-white" />
        </span>

        {/* WhatsApp Badge at the bottom */}
        <div className="absolute -bottom-1 -end-1 flex h-6 w-6 items-center justify-center rounded-full bg-[#25D366] text-white shadow-md border-2 border-white">
          <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 24 24">
            <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.664-.698c.97.587 1.961.913 2.796.913h.005c3.179 0 5.767-2.587 5.767-5.766.001-3.181-2.586-5.768-5.766-5.768zm3.397 8.211c-.144.405-.837.774-1.17.824-.312.045-.694.072-2.128-.521-1.615-.67-2.66-2.307-2.74-2.414-.08-.106-.653-.869-.653-1.654 0-.785.412-1.171.558-1.328.146-.157.32-.196.427-.196.107 0 .213.001.306.006.1.005.234-.038.366.279.136.327.466 1.139.507 1.222.041.083.069.18.014.288-.055.108-.083.175-.165.271-.082.096-.173.214-.247.288-.082.079-.168.165-.072.33.096.165.426.703.914 1.138.628.56 1.157.734 1.322.816.165.083.262.072.36-.041.098-.113.42-.49.533-.622.113-.133.227-.113.371-.06.144.053.914.431 1.072.509.158.078.262.118.3.184.038.066.038.383-.106.788zM12 2C6.477 2 2 6.477 2 12c0 1.891.524 3.66 1.434 5.174L2 22l4.981-1.306C8.423 21.547 10.155 22 12 22c5.523 0 10-4.477 10-10S17.523 2 12 2z" />
          </svg>
        </div>
      </button>
    </div>
  );
}
