import { Link } from "@/i18n/routing";
import { getMessages, setRequestLocale } from "next-intl/server";
import { getServices, getDocuments, getReviews, getFAQs, getSiteSettings } from "@/lib/data";
import { getSEOHeaders, generateOrganizationJsonLd } from "@/lib/seo";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Phone, CheckCircle, ArrowRight, ArrowLeft, Star, ChevronDown, Check, Globe, MessageCircle } from "lucide-react";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const settings = await getSiteSettings();
  const title = locale === "ar" ? settings.meta_default_title_ar : settings.meta_default_title_en;
  const description = locale === "ar" ? settings.meta_description_ar : settings.meta_description_en;
  return getSEOHeaders(title, description, "", true, locale);
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  // Fetch all home data server-side
  const services = await getServices(locale);
  const allDocs = await getDocuments(locale);
  const reviews = await getReviews(locale);
  const faqs = await getFAQs("homepage", undefined, locale);

  // Filter 4 documents for the quick-prices strip
  const quickDocs = allDocs.slice(0, 4);
  // Get first 3 reviews
  const displayReviews = reviews.slice(0, 3);

  const isAr = locale === "ar";
  
  // JSON-LD Injection
  const orgJsonLd = generateOrganizationJsonLd();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
      />
      <Navbar />

      <main className="relative min-h-screen">
        {/* Curved blue/gold arc decoration */}
        <div className="curved-arc"></div>

        {/* Hero Section */}
        <section className="relative pt-20 pb-24 overflow-hidden">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10 text-center">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-primary-blue/10 px-4 py-1.5 text-xs font-bold text-primary-blue mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-blue opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-blue"></span>
              </span>
              {isAr ? "شريكك اللغوي المعتمد" : "Your Certified Translation Partner"}
            </span>

            <h1 className="text-3xl sm:text-5xl font-black text-dark-navy tracking-tight max-w-4xl mx-auto leading-tight mb-6 font-arabic">
              {isAr
                ? "جلوبالايز جروب — ترجمة معتمدة لدى جميع السفارات والهيئات الحكومية"
                : "Globalize Group — Certified Translation for All Embassies & Gov Entities"}
            </h1>

            <p className="text-gray-600 text-sm sm:text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
              {isAr
                ? "نقدم خدمات الترجمة الرسمية المعتمدة وتوطين البرمجيات والترجمة الفورية بدقة لا متناهية وخبرة تمتد لأكثر من 15 عاماً في خدمة الشركات والأفراد بمصر ودول الخليج."
                : "Providing certified official translation, software localization, and interpretation with infinite accuracy and over 15 years of experience serving corporates and individuals."}
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/contact"
                className="w-full sm:w-auto rounded-xl bg-gradient-to-r from-gold to-yellow-500 px-8 py-4 text-sm font-bold text-dark-navy shadow-md hover:shadow-xl hover:scale-[1.03] transition-all"
              >
                {isAr ? "اطلب عرض سعر" : "Request a Quote"}
              </Link>
              <a
                href="https://wa.me/201062990808?text=%D8%A3%D8%B1%D9%8A%D8%AF%20%D8%A7%D9%84%D8%A7%D8%B3%D8%AA%D9%81%D8%B3%D8%A7%D8%B1%20%D8%B9%D9%86%20%D8%AA%D8%B1%D8%AC%D9%85%D8%A9%20%D9%85%D8%B9%D8%AA%D9%85%D8%AF%D8%A9"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl bg-whatsapp-green text-white px-8 py-4 text-sm font-bold shadow-md hover:shadow-xl transition-all animate-pulse-glow"
              >
                <MessageCircle className="h-4 w-4" />
                <span>{isAr ? "تواصل واتساب" : "Contact via WhatsApp"}</span>
              </a>
            </div>

            {/* Trust Bar */}
            <div className="mt-16 border-t border-b border-gray-200/60 py-6 bg-white/40 backdrop-blur-sm rounded-2xl max-w-5xl mx-auto shadow-sm">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 px-4">
                <div className="flex items-center justify-center gap-2 text-dark-navy text-xs font-bold">
                  <Check className="h-4 w-4 text-primary-blue flex-shrink-0" />
                  <span>{isAr ? "معتمد لدى جميع السفارات" : "All Embassies Certified"}</span>
                </div>
                <div className="flex items-center justify-center gap-2 text-dark-navy text-xs font-bold">
                  <Check className="h-4 w-4 text-primary-blue flex-shrink-0" />
                  <span>{isAr ? "خبرة +15 عاماً" : "+15 Years Experience"}</span>
                </div>
                <div className="flex items-center justify-center gap-2 text-dark-navy text-xs font-bold">
                  <Check className="h-4 w-4 text-primary-blue flex-shrink-0" />
                  <span>{isAr ? "+50 لغة متوفرة" : "+50 Languages Supported"}</span>
                </div>
                <div className="flex items-center justify-center gap-2 text-dark-navy text-xs font-bold">
                  <Check className="h-4 w-4 text-primary-blue flex-shrink-0" />
                  <span>{isAr ? "اعتماد الجهات الحكومية" : "Gov Accepted"}</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 3 Service Hub Cards */}
        <section className="py-16 bg-gray-50/50 relative">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-2xl sm:text-3xl font-black text-dark-navy mb-4 font-arabic">
                {isAr ? "خدماتنا اللغوية المتكاملة" : "Our Integrated Language Services"}
              </h2>
              <p className="text-gray-500 text-xs sm:text-sm max-w-lg mx-auto leading-relaxed">
                {isAr
                  ? "حلول ترجمة معتمدة ودقيقة تغطي كافة قطاعات الأعمال والاحتياجات الشخصية."
                  : "Certified and accurate translation solutions covering all business sectors and personal needs."}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {services.map((service) => (
                <div
                  key={service.slug}
                  className="rounded-2xl bg-white p-8 border border-gray-100 hover-lift flex flex-col justify-between"
                >
                  <div>
                    <div className="h-12 w-12 rounded-xl bg-primary-blue/10 flex items-center justify-center text-primary-blue font-bold mb-6">
                      <Globe className="h-6 w-6" />
                    </div>
                    <h3 className="text-lg font-bold text-dark-navy mb-3">
                      {service.name}
                    </h3>
                    <p className="text-gray-600 text-xs leading-relaxed mb-6">
                      {service.description}
                    </p>
                  </div>
                  <Link
                    href={`/${service.slug}`}
                    className="inline-flex items-center gap-1 text-xs font-bold text-primary-blue hover:text-dark-navy group mt-auto"
                  >
                    <span>{isAr ? "اقرأ المزيد" : "Read More"}</span>
                    {isAr ? (
                      <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-1" />
                    ) : (
                      <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                    )}
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Quick-Prices Strip */}
        <section className="py-12 bg-dark-navy text-white relative">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
              <div className="max-w-md text-center lg:text-right">
                <h2 className="text-xl sm:text-2xl font-bold text-gold mb-2">
                  {isAr ? "أسعار ترجمة المستندات والشهادات" : "Document Translation Pricing"}
                </h2>
                <p className="text-xs text-gray-300 leading-relaxed">
                  {isAr
                    ? "أسعار واضحة ومعلنة للأوراق الثبوتية والشهادات الرسمية من السجل المدني مع إتمامها في 24 ساعة."
                    : "Transparent rates for certified translation of vital documents, processed fully within 24 hours."}
                </p>
              </div>

              {/* Price Cards Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full lg:w-auto flex-grow justify-items-center">
                {quickDocs.map((doc) => (
                  <div
                    key={doc.slug}
                    className="bg-white/10 border border-white/10 rounded-xl p-4 text-center w-full max-w-[170px]"
                  >
                    <h3 className="text-xs font-bold text-white mb-2 truncate">
                      {doc.name}
                    </h3>
                    <p className="text-lg font-black text-gold mb-1">
                      {doc.priceEGP} <span className="text-[10px] font-normal">{isAr ? "ج.م" : "EGP"}</span>
                    </p>
                    <span className="text-[9px] text-gray-300 block">
                      {doc.deliveryHours} {isAr ? "ساعة تسليم" : "hrs delivery"}
                    </span>
                  </div>
                ))}
              </div>

              {/* WhatsApp Quick Order button */}
              <a
                href={`https://wa.me/201062990808?text=${encodeURIComponent(
                  isAr
                    ? "أريد طلب ترجمة وثيقة رسمية"
                    : "I would like to order an official document translation"
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-xl bg-whatsapp-green hover:bg-emerald-600 text-white px-6 py-3 text-xs font-bold shadow-md hover:shadow-xl transition-all animate-pulse-glow"
              >
                <MessageCircle className="h-4 w-4" />
                <span>{isAr ? "اطلب عبر واتساب" : "Order via WhatsApp"}</span>
              </a>
            </div>
          </div>
        </section>

        {/* 4-Step "كيف نعمل" */}
        <section className="py-20 bg-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-2xl sm:text-3xl font-black text-dark-navy mb-4 font-arabic">
                {isAr ? "خطوات الحصول على ترجمتك المعتمدة" : "How We Deliver Your Translation"}
              </h2>
              <p className="text-gray-500 text-xs sm:text-sm max-w-lg mx-auto">
                {isAr
                  ? "عملية بسيطة وسريعة تضمن استلام ترجمتك المعتمدة بأعلى جودة ودون عناء."
                  : "A simple and streamlined process ensuring you receive your certified document stress-free."}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center p-4">
                <div className="h-12 w-12 rounded-full bg-primary-blue/10 flex items-center justify-center text-primary-blue font-bold text-lg mx-auto mb-4">
                  1
                </div>
                <h3 className="font-bold text-sm text-dark-navy mb-2">
                  {isAr ? "1. رفع المستندات" : "1. Upload Documents"}
                </h3>
                <p className="text-gray-500 text-xs leading-relaxed">
                  {isAr
                    ? "أرسل وثائقك إلينا من خلال نموذج الموقع أو عبر الواتساب مباشرة."
                    : "Send us your files via our online quote request form or directly through WhatsApp."}
                </p>
              </div>

              <div className="text-center p-4">
                <div className="h-12 w-12 rounded-full bg-primary-blue/10 flex items-center justify-center text-primary-blue font-bold text-lg mx-auto mb-4">
                  2
                </div>
                <h3 className="font-bold text-sm text-dark-navy mb-2">
                  {isAr ? "2. عرض السعر والموافقة" : "2. Quote and Approve"}
                </h3>
                <p className="text-gray-500 text-xs leading-relaxed">
                  {isAr
                    ? "نراجع المستند ونرسل لك عرض سعر مفصل والمدة المطلوبة خلال دقائق."
                    : "We review the documents and send you a detailed quote and delivery timeline within minutes."}
                </p>
              </div>

              <div className="text-center p-4">
                <div className="h-12 w-12 rounded-full bg-primary-blue/10 flex items-center justify-center text-primary-blue font-bold text-lg mx-auto mb-4">
                  3
                </div>
                <h3 className="font-bold text-sm text-dark-navy mb-2">
                  {isAr ? "3. الترجمة والتدقيق" : "3. Translation & Audit"}
                </h3>
                <p className="text-gray-500 text-xs leading-relaxed">
                  {isAr
                    ? "يترجم المستند مترجم قانوني معتمد، ثم يراجعه مدقق ثانٍ لضمان خلوه من الأخطاء."
                    : "A certified legal translator translates the files, followed by proofreading for complete accuracy."}
                </p>
              </div>

              <div className="text-center p-4">
                <div className="h-12 w-12 rounded-full bg-primary-blue/10 flex items-center justify-center text-primary-blue font-bold text-lg mx-auto mb-4">
                  4
                </div>
                <h3 className="font-bold text-sm text-dark-navy mb-2">
                  {isAr ? "4. الاستلام والاعتماد" : "4. Pick Up or Delivery"}
                </h3>
                <p className="text-gray-500 text-xs leading-relaxed">
                  {isAr
                    ? "تستلم النسخة المعتمدة والمختومة من الفرع أو نرسلها لك أينما كنت بالبريد السريع."
                    : "Receive your stamped certified document at our branch or via secure home delivery."}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Reviews Section */}
        <section className="py-16 bg-gray-50/50">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-2xl sm:text-3xl font-black text-dark-navy mb-4 font-arabic">
                {isAr ? "ماذا يقول عملؤنا" : "What Our Clients Say"}
              </h2>
              <p className="text-gray-500 text-xs sm:text-sm max-w-md mx-auto">
                {isAr
                  ? "آراء حقيقية لعملاء وثقوا بجلوبالايز جروب لترجمة أوراق السفر والهجرة وأعمالهم التجارية."
                  : "Real reviews from clients who trusted us with travel, immigration, and business files."}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {displayReviews.map((rev) => (
                <div key={rev.id} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex flex-col justify-between">
                  <div>
                    <div className="flex gap-1 mb-4 text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`h-4 w-4 fill-current ${i < rev.rating ? "text-yellow-400" : "text-gray-200"}`} />
                      ))}
                    </div>
                    <p className="text-gray-600 text-xs leading-relaxed mb-6 italic">
                      "{rev.text}"
                    </p>
                  </div>
                  <div className="border-t border-gray-100 pt-4 flex items-center justify-between mt-auto">
                    <span className="font-bold text-xs text-dark-navy">{rev.authorName}</span>
                    <span className="text-[10px] text-gray-400 font-medium">
                      {rev.serviceType === "CERTIFIED" ? (isAr ? "ترجمة معتمدة" : "Certified") : (isAr ? "توطين" : "Localization")}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Accordion */}
        <section className="py-20 bg-white">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-2xl sm:text-3xl font-black text-dark-navy mb-4 font-arabic">
                {isAr ? "الأسئلة الشائعة حول خدمات الترجمة" : "Frequently Asked Questions"}
              </h2>
              <p className="text-gray-500 text-xs sm:text-sm">
                {isAr
                  ? "إجابات شافية حول شروط وتكلفة الترجمة المعتمدة وإجراءات توثيق الأوراق."
                  : "Find answers about certified translation requirements, fees, and legalization processes."}
              </p>
            </div>

            <div className="space-y-4">
              {faqs.map((faq) => (
                <div key={faq.id} className="border border-gray-100 rounded-xl overflow-hidden shadow-sm">
                  <details className="group">
                    <summary className="flex items-center justify-between px-6 py-4 font-bold text-sm text-dark-navy cursor-pointer select-none bg-gray-50/50 list-none [&::-webkit-details-marker]:hidden">
                      <span>{faq.question}</span>
                      <ChevronDown className="h-4 w-4 text-gray-500 transition-transform group-open:rotate-180" />
                    </summary>
                    <div className="px-6 py-4 text-xs text-gray-600 leading-relaxed border-t border-gray-100">
                      {faq.answer}
                    </div>
                  </details>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Navy CTA banner */}
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mb-20">
          <div className="rounded-3xl bg-gradient-to-r from-dark-navy to-primary-blue p-8 sm:p-12 text-center text-white shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 h-48 w-48 bg-white/5 rounded-full blur-xl pointer-events-none"></div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gold mb-4 font-arabic">
              {isAr ? "هل أنت مستعد لبدء ترجمة مستنداتك؟" : "Ready to Translate Your Documents?"}
            </h2>
            <p className="text-gray-200 text-xs sm:text-sm max-w-xl mx-auto mb-8 leading-relaxed">
              {isAr
                ? "ارفع أوراقك الآن واحصل على عرض تسعير مجاني في 15 دقيقة فقط، أو تفضل بزيارة أحد فروعنا."
                : "Upload your files now and get a free quote within 15 minutes, or visit one of our branches."}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/contact"
                className="w-full sm:w-auto rounded-xl bg-gold text-dark-navy px-8 py-3.5 text-xs font-bold shadow-md hover:scale-[1.03] transition-transform"
              >
                {isAr ? "اطلب عرض سعر الآن" : "Request Free Quote"}
              </Link>
              <Link
                href="/branches"
                className="w-full sm:w-auto rounded-xl border border-white/30 hover:bg-white/10 text-white px-8 py-3.5 text-xs font-bold transition-colors"
              >
                {isAr ? "فروعنا وعناويننا" : "Our Branches"}
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
