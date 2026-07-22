import { Link } from "@/i18n/routing";
import { useLocale, useTranslations } from "next-intl";
import { Phone, Mail, MapPin, MessageSquare } from "lucide-react";
import Image from "next/image";

export default function Footer() {
  const t = useTranslations("Footer");
  const tc = useTranslations("Common");
  const locale = useLocale();

  return (
    <footer className="bg-dark-navy text-white relative overflow-hidden pt-16 pb-8">
      {/* Visual background arch decoration */}
      <div className="absolute bottom-0 right-0 left-0 h-[200px] bg-gradient-to-t from-primary-blue/20 to-transparent pointer-events-none z-0"></div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 border-b border-white/10 pb-12">
          {/* Column 1: Brand details */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center">
              <div className="relative flex h-12 w-40 items-center justify-start">
                <Image
                  src="/logo.png"
                  alt="Globalize Group Logo"
                  width={140}
                  height={40}
                  className="object-contain object-left rtl:object-right"
                />
              </div>
            </div>
            <p className="text-gray-300 text-xs leading-relaxed">
              {t("aboutText")}
            </p>
          </div>

          {/* Column 2: Quick links */}
          <div className="flex flex-col gap-4">
            <h3 className="font-bold text-sm text-gold tracking-wide uppercase">
              {t("quickLinks")}
            </h3>
            <ul className="flex flex-col gap-2.5 text-xs text-gray-300">
              <li>
                <Link href="/" className="hover:text-gold transition-colors">
                  {locale === 'ar' ? 'الرئيسية' : 'Home'}
                </Link>
              </li>
              <li>
                <Link href="/embassies" className="hover:text-gold transition-colors">
                  {locale === 'ar' ? 'اعتماد السفارات' : 'Embassies Acceptance'}
                </Link>
              </li>
              <li>
                <Link href="/government" className="hover:text-gold transition-colors">
                  {locale === 'ar' ? 'الهيئات الحكومية' : 'Gov Entities'}
                </Link>
              </li>
              <li>
                <Link href="/documents" className="hover:text-gold transition-colors">
                  {locale === 'ar' ? 'الوثائق والأسعار' : 'Docs & Prices'}
                </Link>
              </li>
              <li>
                <Link href="/team" className="hover:text-gold transition-colors">
                  {locale === 'ar' ? 'فريق المترجمين' : 'Our Translators'}
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-gold transition-colors">
                  {locale === 'ar' ? 'المدونة الطبية والقانونية' : 'Legal & Tech Blog'}
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Services */}
          <div className="flex flex-col gap-4">
            <h3 className="font-bold text-sm text-gold tracking-wide uppercase">
              {t("services")}
            </h3>
            <ul className="flex flex-col gap-2.5 text-xs text-gray-300">
              <li>
                <Link href="/certified" className="hover:text-gold transition-colors">
                  {locale === 'ar' ? 'ترجمة مستندات معتمدة' : 'Certified Document Translation'}
                </Link>
              </li>
              <li>
                <Link href="/localization" className="hover:text-gold transition-colors">
                  {locale === 'ar' ? 'توطين المواقع والتطبيقات' : 'Website & App Localization'}
                </Link>
              </li>
              <li>
                <Link href="/interpretation" className="hover:text-gold transition-colors">
                  {locale === 'ar' ? 'الترجمة الفورية للمؤتمرات' : 'Conference Interpretation'}
                </Link>
              </li>
              <li>
                <Link href="/languages" className="hover:text-gold transition-colors">
                  {locale === 'ar' ? 'اللغات المعتمدة (+50 لغة)' : 'Supported Languages (+50)'}
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact info */}
          <div className="flex flex-col gap-4">
            <h3 className="font-bold text-sm text-gold tracking-wide uppercase">
              {t("contactUs")}
            </h3>
            <ul className="flex flex-col gap-3 text-xs text-gray-300">
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-gold flex-shrink-0" />
                <span dir="ltr">+20 155 559 2535</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-gold flex-shrink-0" />
                <span dir="ltr">02 37804005</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-gold flex-shrink-0" />
                <span>info@globalizetl.com</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-gold mt-0.5 flex-shrink-0" />
                <span>
                  {locale === 'ar'
                    ? 'فرع الهرم: 6 شارع أيوب، الجيزة'
                    : 'Haram Branch: 6 Ayoub St., Giza, Egypt'}
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-8 text-xs text-gray-400">
          <p>{t("rights")}</p>
          <div className="flex gap-4">
            <a href="https://facebook.com/globalizegroup" target="_blank" rel="noreferrer" className="hover:text-gold transition-colors">
              Facebook
            </a>
            <a href="https://twitter.com/globalizegroup" target="_blank" rel="noreferrer" className="hover:text-gold transition-colors">
              Twitter
            </a>
            <a href="https://linkedin.com/company/globalizegroup" target="_blank" rel="noreferrer" className="hover:text-gold transition-colors">
              LinkedIn
            </a>
          </div>
        </div>
      </div>

      {/* Floating WhatsApp button at lower right */}
      <a
        href={`https://wa.me/201555592535?text=${encodeURIComponent(locale === 'ar' ? 'أريد الاستفسار عن ترجمة معتمدة' : 'I would like to inquire about certified translation')}`}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-whatsapp-green text-white shadow-lg transition-transform duration-300 hover:scale-110 active:scale-95 animate-pulse-glow"
        aria-label="Contact WhatsApp"
      >
        <MessageSquare className="h-7 w-7" />
      </a>
    </footer>
  );
}
