import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { getDocumentBySlug, getFAQs } from "@/lib/data";
import { getSEOHeaders, generateOfferJsonLd, generateFAQJsonLd, generateBreadcrumbJsonLd } from "@/lib/seo";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import QuoteForm from "@/components/QuoteForm";
import { Link } from "@/i18n/routing";
import { Phone, CheckCircle, ChevronDown, Landmark, FileText, ArrowLeft, ArrowRight, ShieldCheck, Clock, MessageCircle } from "lucide-react";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const doc = await getDocumentBySlug(slug, locale);
  if (!doc) return {};
  return getSEOHeaders(doc.name, `${doc.name} translation price, speed, and legalization.`, `/documents/${slug}`, doc.indexable, locale);
}

export default async function DocumentDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const doc = await getDocumentBySlug(slug, locale);
  if (!doc) {
    notFound();
  }

  const faqs = await getFAQs("document", doc.id, locale);
  const isAr = locale === "ar";

  const breadcrumbs = [
    { name: isAr ? "الرئيسية" : "Home", url: "/" },
    { name: isAr ? "الوثائق والأسعار" : "Documents", url: "/documents" },
    { name: doc.name, url: `/documents/${slug}` },
  ];

  const breadcrumbJsonLd = generateBreadcrumbJsonLd(breadcrumbs);
  const offerJsonLd = generateOfferJsonLd({
    name: doc.name,
    priceEGP: doc.priceEGP,
    url: `/documents/${slug}`,
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(offerJsonLd) }}
      />
      {faqs.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(generateFAQJsonLd(faqs)) }}
        />
      )}
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        {/* Quality control robots tag if non-indexable */}
        {!doc.indexable && <meta name="robots" content="noindex, nofollow" />}

        {/* Breadcrumbs */}
        <nav className="text-xs text-gray-500 mb-6" aria-label="Breadcrumb">
          <ol className="flex items-center gap-1.5">
            {breadcrumbs.map((b, i) => (
              <li key={i} className="flex items-center gap-1.5">
                {i > 0 && <span className="text-gray-300">/</span>}
                <Link href={b.url} className="hover:text-primary-blue transition-colors">
                  {b.name}
                </Link>
              </li>
            ))}
          </ol>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main content body */}
          <div className="lg:col-span-2 space-y-12">
            <div>
              <h1 className="text-2xl sm:text-4xl font-black text-dark-navy mb-4 font-arabic">
                {isAr ? `ترجمة معتمدة لـ ${doc.name}` : `Certified Translation of ${doc.name}`}
              </h1>
              <p className="text-gray-600 text-sm leading-relaxed">
                {doc.description}
              </p>
            </div>

            {/* Answer box with price sentence */}
            <div className="answer-box p-6 sm:p-8">
              <h3 className="font-bold text-xs text-primary-blue uppercase tracking-wide mb-2">
                {isAr ? "سعر وموعد تسليم الترجمة" : "Pricing & Turnaround Answer Box"}
              </h3>
              <p className="text-sm font-semibold text-dark-navy leading-relaxed font-arabic">
                {doc.answerBox}
              </p>
            </div>

            {/* Accepted-by flags grid */}
            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-150">
              <h3 className="font-bold text-xs text-dark-navy uppercase tracking-wide mb-4">
                {isAr ? "معتمد ومقبول لدى سفارات دول مثل:" : "Accepted by embassies of:"}
              </h3>
              <div className="flex flex-wrap gap-4">
                {["DE", "FR", "IT", "ES", "GB", "US", "CA", "SA", "AE"].map((cc) => (
                  <div key={cc} className="flex items-center gap-2 bg-white rounded-xl px-3.5 py-2 border border-gray-200 text-[10px] font-bold text-gray-700 shadow-sm">
                    <img
                      src={`https://flagcdn.com/w40/${cc.toLowerCase()}.png`}
                      alt={cc}
                      className="h-4 w-6 object-cover rounded-sm border border-gray-100 flex-shrink-0"
                    />
                    <span>{cc}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 3 Steps */}
            <div>
              <h2 className="text-xl font-bold text-dark-navy mb-6 border-b border-gray-100 pb-3 font-arabic">
                {isAr ? "كيف تطلب ترجمة هذه الوثيقة؟" : "How to Order This Document Translation"}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="p-5 border border-gray-100 bg-white rounded-xl shadow-sm text-center">
                  <div className="h-10 w-10 rounded-full bg-primary-blue/10 text-primary-blue font-bold flex items-center justify-center mx-auto mb-3">1</div>
                  <h4 className="font-bold text-xs text-dark-navy mb-1.5">{isAr ? "أرسل المستند" : "1. Send Document"}</h4>
                  <p className="text-[10px] text-gray-500">{isAr ? "صور الشهادة بموبايلك أو اسحبها ضوئياً وارسلها بالواتساب." : "Take a clear picture of the certificate and send via WhatsApp."}</p>
                </div>
                <div className="p-5 border border-gray-100 bg-white rounded-xl shadow-sm text-center">
                  <div className="h-10 w-10 rounded-full bg-primary-blue/10 text-primary-blue font-bold flex items-center justify-center mx-auto mb-3">2</div>
                  <h4 className="font-bold text-xs text-dark-navy mb-1.5">{isAr ? "الترجمة والاعتماد" : "2. Translate & Seal"}</h4>
                  <p className="text-[10px] text-gray-500">{isAr ? "يقوم فريقنا القانوني بترجمتها واعتمادها بالختم الرسمي." : "Our legal team translates and certifies it with our official seal."}</p>
                </div>
                <div className="p-5 border border-gray-100 bg-white rounded-xl shadow-sm text-center">
                  <div className="h-10 w-10 rounded-full bg-primary-blue/10 text-primary-blue font-bold flex items-center justify-center mx-auto mb-3">3</div>
                  <h4 className="font-bold text-xs text-dark-navy mb-1.5">{isAr ? "الاستلام والتوصيل" : "3. Collect or Deliver"}</h4>
                  <p className="text-[10px] text-gray-500">{isAr ? "استلمها من فرع الهرم أو اطلب خدمة الشحن للمنزل." : "Pick up from our branch or request secure express courier shipping."}</p>
                </div>
              </div>
            </div>

            {/* Related documents */}
            {doc.relatedDocuments && doc.relatedDocuments.length > 0 && (
              <div>
                <h2 className="text-xl font-bold text-dark-navy mb-6 border-b border-gray-100 pb-3 font-arabic">
                  {isAr ? "وثائق مرتبطة قد تحتاج إليها" : "Related Documents You May Need"}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {doc.relatedDocuments.map((rd) => (
                    <div key={rd.slug} className="rounded-xl border border-gray-150 p-5 bg-white shadow-sm flex items-center justify-between">
                      <div className="flex flex-col">
                        <Link href={`/documents/${rd.slug}`} className="font-bold text-xs text-dark-navy hover:text-primary-blue transition-colors">
                          {rd.name}
                        </Link>
                        <span className="text-[10px] text-primary-blue font-semibold mt-1">
                          {rd.priceEGP} {isAr ? "ج.م" : "EGP"}
                        </span>
                      </div>
                      <Link
                        href={`/documents/${rd.slug}`}
                        className="rounded-lg bg-gray-50 hover:bg-gray-100 p-2 text-xs font-bold text-gray-700"
                      >
                        {isAr ? "عرض" : "View"}
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* FAQs */}
            {faqs.length > 0 && (
              <div>
                <h2 className="text-xl font-bold text-dark-navy mb-6 border-b border-gray-100 pb-3 font-arabic">
                  {isAr ? "الأسئلة الشائعة حول ترجمة هذه الوثيقة" : "Document FAQ"}
                </h2>
                <div className="space-y-4">
                  {faqs.map((faq) => (
                    <div key={faq.id} className="border border-gray-100 rounded-xl overflow-hidden shadow-sm">
                      <details className="group">
                        <summary className="flex items-center justify-between px-6 py-4 font-bold text-sm text-dark-navy cursor-pointer select-none bg-gray-50/50 list-none">
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
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-28">
              {/* Big price card */}
              <div className="rounded-2xl bg-gradient-to-tr from-dark-navy to-primary-blue text-white p-6 text-center shadow-lg mb-6">
                <h3 className="text-xs font-semibold text-gold tracking-wider uppercase mb-3">
                  {isAr ? "تكلفة الترجمة المعتمدة (للوثيقة/الصفحة)" : "Certified Translation Rates (Per Page)"}
                </h3>

                <div className="bg-white/10 rounded-xl p-3.5 mb-3 border border-white/15 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-200">{isAr ? "عربي ↔ إنجليزي:" : "Arabic ↔ English:"}</span>
                    <span className="text-lg font-black text-gold">200 <span className="text-[10px] font-normal text-white">{isAr ? "ج.م / صفحة" : "EGP / page"}</span></span>
                  </div>
                  <div className="flex items-center justify-between border-t border-white/10 pt-2">
                    <span className="text-xs text-gray-200">{isAr ? "اللغات الأخرى (ألماني، فرنسي..):" : "Other Langs (DE, FR..):"}</span>
                    <span className="text-sm font-bold text-white">300 <span className="text-[10px] font-normal text-gray-300">{isAr ? "ج.م / صفحة" : "EGP / page"}</span></span>
                  </div>
                </div>

                <p className="text-[10px] text-gray-300 mb-4 leading-relaxed bg-black/20 rounded-lg p-2">
                  {isAr 
                    ? "📌 ملاحظة: في حال كانت الوثيقة مكونة من أكثر من صفحة يتم احتساب الإجمالي وفقاً لعدد الصفحات."
                    : "📌 Note: For multi-page documents, the total fee is calculated based on page count."}
                </p>

                <div className="flex items-center justify-center gap-1 text-[10px] text-gray-200 mb-5">
                  <Clock className="h-3.5 w-3.5" />
                  <span>{isAr ? "مدة التجهيز:" : "Turnaround:"} {doc.deliveryHours} {isAr ? "ساعة" : "hours"}</span>
                </div>
                
                <a
                  href={`https://wa.me/201062990808?text=${encodeURIComponent(
                    isAr 
                      ? `أريد ترجمة شهادة: ${doc.name} (سعر الصفحة 200 ج.م عربي-إنجليزي أو 300 ج.م للغات الأخرى)`
                      : `I want to translate: ${doc.name} (200 EGP/page AR-EN or 300 EGP/page other languages)`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 rounded-xl bg-whatsapp-green hover:bg-emerald-600 text-white py-3 text-xs font-bold shadow-md transition-all animate-pulse-glow"
                >
                  <MessageCircle className="h-4 w-4" />
                  <span>{isAr ? "ابعت الشهادة واتساب" : "Send Document on WhatsApp"}</span>
                </a>
              </div>

              <QuoteForm />
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
